const { User, UserDetails } = require('../models/associations');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile images
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

// Get user profile with details
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'username', 'email', 'role', 'email_verified', 'created_at'],
      include: [
        {
          model: UserDetails,
          as: 'profile',
          attributes: [
            'firstname', 'lastname', 'contact_number', 'address', 
            'profile_image', 'date_of_birth', 'gender', 'created_at', 'updated_at'
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      contact_number,
      address,
      date_of_birth,
      gender,
      email,
      username
    } = req.body;

    const userId = req.user.user_id;

    // Start transaction
    const { sequelize } = require('../config/database');
    const transaction = await sequelize.transaction();

    try {
      // Update User table fields if provided
      const userUpdateData = {};
      if (email && email !== req.user.email) {
        // Check if email is already taken
        const existingUser = await User.findOne({
          where: { email, user_id: { [require('sequelize').Op.ne]: userId } }
        });
        if (existingUser) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Email address is already in use'
          });
        }
        userUpdateData.email = email;
        userUpdateData.email_verified = false; // Reset verification if email changed
      }

      if (username && username !== req.user.username) {
        // Check if username is already taken
        const existingUser = await User.findOne({
          where: { username, user_id: { [require('sequelize').Op.ne]: userId } }
        });
        if (existingUser) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Username is already taken'
          });
        }
        userUpdateData.username = username;
      }

      // Update User table if there are changes
      if (Object.keys(userUpdateData).length > 0) {
        await User.update(userUpdateData, {
          where: { user_id: userId },
          transaction
        });
      }

      // Find or create UserDetails
      let userDetails = await UserDetails.findOne({
        where: { user_id: userId },
        transaction
      });

      const detailsData = {};
      if (firstname !== undefined) detailsData.firstname = firstname;
      if (lastname !== undefined) detailsData.lastname = lastname;
      if (contact_number !== undefined) detailsData.contact_number = contact_number;
      if (address !== undefined) detailsData.address = address;
      if (date_of_birth !== undefined) detailsData.date_of_birth = date_of_birth;
      if (gender !== undefined) detailsData.gender = gender;

      if (userDetails) {
        // Update existing details
        await userDetails.update(detailsData, { transaction });
      } else {
        // Create new details record
        detailsData.user_id = userId;
        userDetails = await UserDetails.create(detailsData, { transaction });
      }

      await transaction.commit();

      // Fetch updated user data
      const updatedUser = await User.findByPk(userId, {
        attributes: ['user_id', 'username', 'email', 'role', 'email_verified', 'created_at'],
        include: [
          {
            model: UserDetails,
            as: 'profile',
            attributes: [
              'firstname', 'lastname', 'contact_number', 'address', 
              'profile_image', 'date_of_birth', 'gender', 'created_at', 'updated_at'
            ]
          }
        ]
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Update profile image
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Profile image file is required'
      });
    }

    const userId = req.user.user_id;

    // Find or create UserDetails
    let userDetails = await UserDetails.findOne({
      where: { user_id: userId }
    });

    // Delete old profile image if exists
    if (userDetails && userDetails.profile_image) {
      try {
        const oldImagePath = userDetails.profile_image.replace(
          `${req.protocol}://${req.get('host')}/uploads/profiles/`,
          ''
        );
        const fullOldPath = path.join(__dirname, '../../uploads/profiles', oldImagePath);
        await fs.unlink(fullOldPath);
      } catch (deleteError) {
        console.error('Error deleting old profile image:', deleteError);
      }
    }

    // Create new image URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/profiles/${req.file.filename}`;

    if (userDetails) {
      // Update existing details
      await userDetails.update({ profile_image: imageUrl });
    } else {
      // Create new details record
      userDetails = await UserDetails.create({
        user_id: userId,
        profile_image: imageUrl,
        firstname: 'User', // Default values
        lastname: ''
      });
    }

    // Fetch updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: ['user_id', 'username', 'email', 'role', 'email_verified', 'created_at'],
      include: [
        {
          model: UserDetails,
          as: 'profile',
          attributes: [
            'firstname', 'lastname', 'contact_number', 'address', 
            'profile_image', 'date_of_birth', 'gender', 'created_at', 'updated_at'
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        user: updatedUser,
        image_url: imageUrl
      }
    });

  } catch (error) {
    console.error('Error updating profile image:', error);
    
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
      message: 'Failed to update profile image',
      error: error.message
    });
  }
};

// Request role upgrade
const requestRoleUpgrade = async (req, res) => {
  try {
    const { requestedRole, reason } = req.body;
    const userId = req.user.user_id;

    // Validate requested role
    const allowedRoles = ['designer'];
    if (!allowedRoles.includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role requested. Only designer role upgrades are allowed.'
      });
    }

    // Check if user already has the requested role or higher
    if (req.user.role === 'admin' || req.user.role === requestedRole) {
      return res.status(400).json({
        success: false,
        message: 'You already have the requested role or higher'
      });
    }

    // For now, we'll just log the request and return success
    // In a full implementation, you'd create a role upgrade request record
    console.log(`Role upgrade request from user ${userId}:`, {
      currentRole: req.user.role,
      requestedRole,
      reason,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Role upgrade request submitted successfully. An administrator will review your request.',
      data: {
        currentRole: req.user.role,
        requestedRole,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error processing role upgrade request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process role upgrade request',
      error: error.message
    });
  }
};

// Delete profile image
const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const userDetails = await UserDetails.findOne({
      where: { user_id: userId }
    });

    if (!userDetails || !userDetails.profile_image) {
      return res.status(404).json({
        success: false,
        message: 'No profile image found'
      });
    }

    // Delete image file
    try {
      const imagePath = userDetails.profile_image.replace(
        `${req.protocol}://${req.get('host')}/uploads/profiles/`,
        ''
      );
      const fullPath = path.join(__dirname, '../../uploads/profiles', imagePath);
      await fs.unlink(fullPath);
    } catch (deleteError) {
      console.error('Error deleting profile image file:', deleteError);
    }

    // Update database
    await userDetails.update({ profile_image: null });

    // Fetch updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: ['user_id', 'username', 'email', 'role', 'email_verified', 'created_at'],
      include: [
        {
          model: UserDetails,
          as: 'profile',
          attributes: [
            'firstname', 'lastname', 'contact_number', 'address', 
            'profile_image', 'date_of_birth', 'gender', 'created_at', 'updated_at'
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Profile image deleted successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile image',
      error: error.message
    });
  }
};

// Admin function to approve role upgrades
const approveRoleUpgrade = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approve } = req.body; // true to approve, false to reject

    // Check if current user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can approve role upgrades'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'designer-pending') {
      return res.status(400).json({
        success: false,
        message: 'User does not have a pending designer role upgrade'
      });
    }

    const newRole = approve ? 'designer' : 'user';
    await user.update({ role: newRole });

    // Log the approval/rejection
    console.log(`Admin ${req.user.user_id} ${approve ? 'approved' : 'rejected'} designer role for user ${userId}`);

    res.json({
      success: true,
      message: `Role upgrade ${approve ? 'approved' : 'rejected'} successfully`,
      data: {
        userId: user.user_id,
        username: user.username,
        newRole: newRole,
        approved: approve
      }
    });

  } catch (error) {
    console.error('Error processing role upgrade approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process role upgrade approval',
      error: error.message
    });
  }
};

// Get all pending role upgrade requests (admin only)
const getPendingRoleUpgrades = async (req, res) => {
  try {
    // Check if current user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can view pending role upgrades'
      });
    }

    const pendingUsers = await User.findAll({
      where: { role: 'designer-pending' },
      attributes: ['user_id', 'username', 'email', 'created_at'],
      include: [
        {
          model: UserDetails,
          as: 'profile',
          attributes: ['firstname', 'lastname', 'profile_image']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      data: pendingUsers
    });

  } catch (error) {
    console.error('Error fetching pending role upgrades:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending role upgrades',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  getProfile,
  updateProfile,
  updateProfileImage,
  requestRoleUpgrade,
  deleteProfileImage,
  approveRoleUpgrade,
  getPendingRoleUpgrades
};