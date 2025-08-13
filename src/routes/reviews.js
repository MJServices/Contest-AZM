const express = require('express');
const router = express.Router();

// Import controllers
const {
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
} = require('../controllers/reviewController');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: {
    success: false,
    message: 'Too many review requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const createReviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit review creation
  message: {
    success: false,
    message: 'Too many review submissions, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateReviewCreation = [
  body('reviewee_id')
    .isInt({ min: 1 })
    .withMessage('Valid reviewee ID is required'),
  
  body('review_type')
    .isIn(['project_review', 'consultation_review', 'designer_review', 'client_review', 'general_review'])
    .withMessage('Valid review type is required'),
  
  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('review_text')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review text must be between 10 and 2000 characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters'),
  
  body('communication_rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),
  
  body('quality_rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Quality rating must be between 1 and 5'),
  
  body('timeliness_rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Timeliness rating must be between 1 and 5'),
  
  body('professionalism_rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Professionalism rating must be between 1 and 5'),
  
  body('value_rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Value rating must be between 1 and 5'),
  
  body('would_recommend')
    .optional()
    .isBoolean()
    .withMessage('Would recommend must be a boolean'),
  
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('Is public must be a boolean')
];

const validateReviewUpdate = [
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('review_text')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Review text must be between 10 and 2000 characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters')
];

const validateResponse = [
  body('response_text')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Response text must be between 10 and 1000 characters')
];

const validateModeration = [
  body('action')
    .isIn(['approve', 'reject', 'flag'])
    .withMessage('Action must be approve, reject, or flag'),
  
  body('is_featured')
    .optional()
    .isBoolean()
    .withMessage('Is featured must be a boolean')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Public routes

/**
 * @route   GET /api/v1/reviews
 * @desc    Get all reviews with filtering
 * @access  Public
 */
router.get('/', reviewLimiter, getReviews);

/**
 * @route   GET /api/v1/reviews/featured
 * @desc    Get featured reviews
 * @access  Public
 */
router.get('/featured', reviewLimiter, getFeaturedReviews);

/**
 * @route   GET /api/v1/reviews/user/:userId
 * @desc    Get reviews for a specific user
 * @access  Public
 */
router.get('/user/:userId', 
  reviewLimiter,
  param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
  handleValidationErrors,
  getUserReviews
);

/**
 * @route   GET /api/v1/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get('/:id', 
  reviewLimiter,
  param('id').isInt({ min: 1 }).withMessage('Valid review ID is required'),
  handleValidationErrors,
  getReviewById
);

// Protected routes

/**
 * @route   POST /api/v1/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', 
  createReviewLimiter,
  authenticateToken,
  validateReviewCreation,
  handleValidationErrors,
  createReview
);

/**
 * @route   PUT /api/v1/reviews/:id
 * @desc    Update a review
 * @access  Private (reviewer only)
 */
router.put('/:id', 
  reviewLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid review ID is required'),
  validateReviewUpdate,
  handleValidationErrors,
  updateReview
);

/**
 * @route   DELETE /api/v1/reviews/:id
 * @desc    Delete a review
 * @access  Private (reviewer or admin)
 */
router.delete('/:id', 
  reviewLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid review ID is required'),
  handleValidationErrors,
  deleteReview
);

/**
 * @route   POST /api/v1/reviews/:id/response
 * @desc    Add response to a review
 * @access  Private (reviewee only)
 */
router.post('/:id/response', 
  reviewLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid review ID is required'),
  validateResponse,
  handleValidationErrors,
  addResponse
);

// Admin routes

/**
 * @route   GET /api/v1/reviews/admin/pending
 * @desc    Get pending reviews for moderation
 * @access  Private (Admin only)
 */
router.get('/admin/pending',
  reviewLimiter,
  authenticateToken,
  requireRole(['admin']),
  getPendingReviews
);

/**
 * @route   POST /api/v1/reviews/:id/moderate
 * @desc    Moderate a review (approve/reject/flag)
 * @access  Private (Admin only)
 */
router.post('/:id/moderate',
  reviewLimiter,
  authenticateToken,
  requireRole(['admin']),
  param('id').isInt({ min: 1 }).withMessage('Valid review ID is required'),
  validateModeration,
  handleValidationErrors,
  moderateReview
);

module.exports = router;