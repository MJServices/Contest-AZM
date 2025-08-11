const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Gallery, User, UserDetails } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/gallery');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `gallery-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed'));
    }
  }
});

// GET /api/v1/gallery - Get all gallery items with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      style,
      search,
      featured,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const whereClause = {
      status: 'approved' // Only show approved items
    };

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (style && style !== 'all') {
      whereClause.style = style;
    }

    if (featured === 'true') {
      whereClause.is_featured = true;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search.toLowerCase()] } }
      ];
    }

    // Get gallery items with user details
    const { count, rows: galleryItems } = await Gallery.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['user_id', 'username', 'role'],
          include: [
            {
              model: UserDetails,
              as: 'profile',
              attributes: ['firstname', 'lastname', 'profile_image']
            }
          ]
        }
      ],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset
    });

    // Update view counts for returned items
    const galleryIds = galleryItems.map(item => item.gallery_id);
    if (galleryIds.length > 0) {
      await Gallery.increment('view_count', {
        where: { gallery_id: { [Op.in]: galleryIds } }
      });
    }

    res.json({
      success: true,
      data: {
        items: galleryItems,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / parseInt(limit)),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items',
      error: error.message
    });
  }
});

// GET /api/v1/gallery/:id - Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findByPk(id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['user_id', 'username', 'role'],
          include: [
            {
              model: UserDetails,
              as: 'profile',
              attributes: ['firstname', 'lastname', 'profile_image']
            }
          ]
        }
      ]
    });

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Increment view count
    await galleryItem.increment('view_count');

    res.json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery item',
      error: error.message
    });
  }
});

// POST /api/v1/gallery - Upload new gallery item (designers only)
router.post('/', authenticateToken, requireRole(['designer', 'admin']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const {
      title,
      description,
      category,
      style,
      tags,
      color_palette,
      is_featured = false
    } = req.body;

    // Validate required fields
    if (!title || !category || !style) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and style are required'
      });
    }

    // Parse JSON fields
    let parsedTags = [];
    let parsedColorPalette = [];

    try {
      if (tags) parsedTags = JSON.parse(tags);
      if (color_palette) parsedColorPalette = JSON.parse(color_palette);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format for tags or color_palette'
      });
    }

    // Create file URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/gallery/${req.file.filename}`;
    const thumbnailUrl = imageUrl; // For now, use same image. In production, you'd generate thumbnails

    // Create gallery item
    const galleryItem = await Gallery.create({
      title,
      description,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl,
      category,
      style,
      tags: parsedTags,
      color_palette: parsedColorPalette,
      uploader_id: req.user.user_id,
      is_featured: req.user.role === 'admin' ? is_featured : false, // Only admins can set featured
      status: req.user.role === 'admin' ? 'approved' : 'pending' // Auto-approve for admins
    });

    // Fetch the created item with user details
    const createdItem = await Gallery.findByPk(galleryItem.gallery_id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['user_id', 'username', 'role'],
          include: [
            {
              model: UserDetails,
              as: 'profile',
              attributes: ['firstname', 'lastname', 'profile_image']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' ? 'Gallery item uploaded successfully' : 'Gallery item uploaded and pending approval',
      data: createdItem
    });
  } catch (error) {
    console.error('Error uploading gallery item:', error);
    
    // Clean up uploaded file if database operation failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload gallery item',
      error: error.message
    });
  }
});

// PUT /api/v1/gallery/:id - Update gallery item (owner or admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      style,
      tags,
      color_palette,
      is_featured
    } = req.body;

    const galleryItem = await Gallery.findByPk(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && galleryItem.uploader_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own gallery items'
      });
    }

    // Parse JSON fields if provided
    let parsedTags = galleryItem.tags;
    let parsedColorPalette = galleryItem.color_palette;

    try {
      if (tags !== undefined) parsedTags = JSON.parse(tags);
      if (color_palette !== undefined) parsedColorPalette = JSON.parse(color_palette);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format for tags or color_palette'
      });
    }

    // Update fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (style !== undefined) updateData.style = style;
    if (tags !== undefined) updateData.tags = parsedTags;
    if (color_palette !== undefined) updateData.color_palette = parsedColorPalette;
    
    // Only admins can set featured status
    if (req.user.role === 'admin' && is_featured !== undefined) {
      updateData.is_featured = is_featured;
    }

    await galleryItem.update(updateData);

    // Fetch updated item with user details
    const updatedItem = await Gallery.findByPk(id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['user_id', 'username', 'role'],
          include: [
            {
              model: UserDetails,
              as: 'profile',
              attributes: ['firstname', 'lastname', 'profile_image']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item',
      error: error.message
    });
  }
});

// DELETE /api/v1/gallery/:id - Delete gallery item (owner or admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findByPk(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && galleryItem.uploader_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own gallery items'
      });
    }

    // Delete associated files
    if (galleryItem.image_url) {
      try {
        const filename = path.basename(galleryItem.image_url);
        const filePath = path.join(__dirname, '../../uploads/gallery', filename);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error('Error deleting gallery image file:', fileError);
      }
    }

    await galleryItem.destroy();

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item',
      error: error.message
    });
  }
});

// POST /api/v1/gallery/:id/like - Toggle like on gallery item
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findByPk(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // For now, just increment like count
    // In a full implementation, you'd track individual user likes
    await galleryItem.increment('like_count');

    res.json({
      success: true,
      message: 'Gallery item liked successfully',
      data: {
        like_count: galleryItem.like_count + 1
      }
    });
  } catch (error) {
    console.error('Error liking gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like gallery item',
      error: error.message
    });
  }
});

// GET /api/v1/gallery/user/:userId - Get gallery items by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: galleryItems } = await Gallery.findAndCountAll({
      where: {
        uploader_id: userId,
        status: 'approved'
      },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['user_id', 'username', 'role'],
          include: [
            {
              model: UserDetails,
              as: 'profile',
              attributes: ['firstname', 'lastname', 'profile_image']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        items: galleryItems,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / parseInt(limit)),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user gallery items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user gallery items',
      error: error.message
    });
  }
});

module.exports = router;