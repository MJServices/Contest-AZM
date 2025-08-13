const Review = require('../models/Review');
const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const Project = require('../models/Project');
const Consultation = require('../models/Consultation');
const { Op } = require('sequelize');

/**
 * Get all reviews with filtering and pagination
 */
const getReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      reviewee_id,
      reviewer_id,
      review_type,
      rating_min,
      rating_max,
      status = 'approved',
      featured
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (reviewee_id) whereClause.reviewee_id = reviewee_id;
    if (reviewer_id) whereClause.reviewer_id = reviewer_id;
    if (review_type) whereClause.review_type = review_type;
    if (status) whereClause.status = status;
    if (featured === 'true') whereClause.is_featured = true;

    // Rating range filter
    if (rating_min || rating_max) {
      whereClause.rating = {};
      if (rating_min) whereClause.rating[Op.gte] = parseFloat(rating_min);
      if (rating_max) whereClause.rating[Op.lte] = parseFloat(rating_max);
    }

    // Only show public reviews unless admin
    if (req.user?.role !== 'admin') {
      whereClause.is_public = true;
    }

    const reviews = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['user_id', 'username'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'profile_image']
          }]
        },
        {
          model: User,
          as: 'reviewee',
          attributes: ['user_id', 'username', 'role'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'profile_image']
          }]
        },
        {
          model: Project,
          as: 'project',
          attributes: ['project_id', 'title'],
          required: false
        },
        {
          model: Consultation,
          as: 'consultation',
          attributes: ['consultation_id', 'title'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        reviews: reviews.rows,
        pagination: {
          total: reviews.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(reviews.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Get a specific review by ID
 */
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['user_id', 'username'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'profile_image']
          }]
        },
        {
          model: User,
          as: 'reviewee',
          attributes: ['user_id', 'username', 'role'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'profile_image']
          }]
        },
        {
          model: Project,
          as: 'project',
          attributes: ['project_id', 'title'],
          required: false
        },
        {
          model: Consultation,
          as: 'consultation',
          attributes: ['consultation_id', 'title'],
          required: false
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user can view this review
    if (!review.is_public && req.user?.role !== 'admin' && 
        req.user?.user_id !== review.reviewer_id && 
        req.user?.user_id !== review.reviewee_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

/**
 * Create a new review
 */
const createReview = async (req, res) => {
  try {
    const {
      reviewee_id,
      project_id,
      consultation_id,
      review_type,
      rating,
      title,
      review_text,
      communication_rating,
      quality_rating,
      timeliness_rating,
      professionalism_rating,
      value_rating,
      pros,
      cons,
      would_recommend,
      is_public = true
    } = req.body;

    // Validate required fields
    if (!reviewee_id || !review_type || !rating || !review_text) {
      return res.status(400).json({
        success: false,
        message: 'Reviewee ID, review type, rating, and review text are required'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if reviewee exists
    const reviewee = await User.findByPk(reviewee_id);
    if (!reviewee) {
      return res.status(404).json({
        success: false,
        message: 'Reviewee not found'
      });
    }

    // Prevent self-review
    if (req.user.user_id === reviewee_id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself'
      });
    }

    // Check if project/consultation exists and user has access
    if (project_id) {
      const project = await Project.findByPk(project_id);
      if (!project || (project.client_id !== req.user.user_id && project.designer_id !== req.user.user_id)) {
        return res.status(403).json({
          success: false,
          message: 'You can only review projects you are involved in'
        });
      }
    }

    if (consultation_id) {
      const consultation = await Consultation.findByPk(consultation_id);
      if (!consultation || (consultation.client_id !== req.user.user_id && consultation.designer_id !== req.user.user_id)) {
        return res.status(403).json({
          success: false,
          message: 'You can only review consultations you are involved in'
        });
      }
    }

    // Check for duplicate reviews
    const existingReview = await Review.findOne({
      where: {
        reviewer_id: req.user.user_id,
        reviewee_id,
        ...(project_id && { project_id }),
        ...(consultation_id && { consultation_id })
      }
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this item'
      });
    }

    // Create review
    const review = await Review.create({
      reviewer_id: req.user.user_id,
      reviewee_id,
      project_id,
      consultation_id,
      review_type,
      rating,
      title,
      review_text,
      communication_rating,
      quality_rating,
      timeliness_rating,
      professionalism_rating,
      value_rating,
      pros: Array.isArray(pros) ? pros : [],
      cons: Array.isArray(cons) ? cons : [],
      would_recommend,
      is_public,
      status: 'pending' // Reviews need approval
    });

    // Fetch created review with associations
    const createdReview = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['user_id', 'username'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        },
        {
          model: User,
          as: 'reviewee',
          attributes: ['user_id', 'username', 'role'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      data: createdReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

/**
 * Update a review (reviewer only)
 */
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only reviewer can update their review
    if (review.reviewer_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    // Don't allow updating approved reviews
    if (review.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update approved reviews'
      });
    }

    // Validate rating if provided
    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Reset status to pending if content is updated
    if (updates.rating || updates.review_text || updates.title) {
      updates.status = 'pending';
    }

    await review.update(updates);

    // Fetch updated review
    const updatedReview = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['user_id', 'username'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        },
        {
          model: User,
          as: 'reviewee',
          attributes: ['user_id', 'username', 'role'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

/**
 * Delete a review
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only reviewer or admin can delete
    if (review.reviewer_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

/**
 * Add response to a review (reviewee only)
 */
const addResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { response_text } = req.body;

    if (!response_text || response_text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response text is required'
      });
    }

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only reviewee can respond
    if (review.reviewee_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the reviewee can respond to this review'
      });
    }

    await review.addResponse(response_text);

    res.json({
      success: true,
      message: 'Response added successfully'
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
};

/**
 * Get reviews for a specific user (reviewee)
 */
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status = 'approved' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      reviewee_id: userId,
      status,
      is_public: true
    };

    const reviews = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['user_id', 'username'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'profile_image']
          }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get rating statistics
    const ratingStats = await Review.getDetailedRatings(userId);

    res.json({
      success: true,
      data: {
        reviews: reviews.rows,
        statistics: ratingStats,
        pagination: {
          total: reviews.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(reviews.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

/**
 * Get featured reviews
 */
const getFeaturedReviews = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const reviews = await Review.findFeatured();

    res.json({
      success: true,
      data: reviews.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured reviews',
      error: error.message
    });
  }
};

/**
 * Admin: Approve/reject review
 */
const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, is_featured } = req.body; // action: 'approve', 'reject', 'flag'

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can moderate reviews'
      });
    }

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    switch (action) {
      case 'approve':
        await review.approve();
        if (is_featured) {
          await review.makeFeature();
        }
        break;
      case 'reject':
        await review.reject();
        break;
      case 'flag':
        await review.flag();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Use approve, reject, or flag'
        });
    }

    res.json({
      success: true,
      message: `Review ${action}d successfully`
    });
  } catch (error) {
    console.error('Error moderating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to moderate review',
      error: error.message
    });
  }
};

/**
 * Admin: Get pending reviews
 */
const getPendingReviews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can view pending reviews'
      });
    }

    const reviews = await Review.findPendingApproval();

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending reviews',
      error: error.message
    });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  addResponse,
  getUserReviews,
  getFeaturedReviews,
  moderateReview,
  getPendingReviews
};