const express = require('express');
const router = express.Router();
const {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getAvailableDesigners,
  getDesignerAvailability,
  rateConsultation
} = require('../controllers/consultationController');
const { authenticateToken } = require('../middleware/auth');
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules
const createConsultationValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('consultation_type')
    .optional()
    .isIn(['initial_consultation', 'design_review', 'progress_check', 'final_walkthrough', 'follow_up', 'other'])
    .withMessage('Invalid consultation type'),
  body('meeting_type')
    .optional()
    .isIn(['in_person', 'video_call', 'phone_call'])
    .withMessage('Invalid meeting type'),
  body('scheduled_date')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const scheduledDate = new Date(value);
      const now = new Date();
      if (scheduledDate <= now) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),
  body('duration_minutes')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('designer_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invalid designer ID'),
  body('budget_discussed')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Invalid budget amount')
];

const updateConsultationValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid consultation ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['requested', 'confirmed', 'rescheduled', 'in_progress', 'completed', 'cancelled', 'no_show'])
    .withMessage('Invalid status'),
  body('meeting_notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Meeting notes must not exceed 2000 characters'),
  body('scheduled_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const ratingValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid consultation ID'),
  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feedback must not exceed 1000 characters')
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Routes

/**
 * @route   GET /api/consultations
 * @desc    Get all consultations for the authenticated user
 * @access  Private
 */
router.get('/', 
  authenticateToken,
  paginationValidation,
  query('status')
    .optional()
    .isIn(['requested', 'confirmed', 'rescheduled', 'in_progress', 'completed', 'cancelled', 'no_show'])
    .withMessage('Invalid status filter'),
  handleValidationErrors,
  getConsultations
);

/**
 * @route   GET /api/consultations/designers
 * @desc    Get available designers
 * @access  Private
 */
router.get('/designers',
  authenticateToken,
  query('specialization')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Invalid specialization'),
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  query('duration')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  handleValidationErrors,
  getAvailableDesigners
);

/**
 * @route   GET /api/consultations/designers/:designerId/availability
 * @desc    Get designer's availability for a date range
 * @access  Private
 */
router.get('/designers/:designerId/availability',
  authenticateToken,
  param('designerId')
    .isInt({ min: 1 })
    .withMessage('Invalid designer ID'),
  query('startDate')
    .isISO8601()
    .withMessage('Invalid start date format'),
  query('endDate')
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 30) {
        throw new Error('Date range cannot exceed 30 days');
      }
      return true;
    }),
  handleValidationErrors,
  getDesignerAvailability
);

/**
 * @route   GET /api/consultations/:id
 * @desc    Get a specific consultation by ID
 * @access  Private
 */
router.get('/:id',
  authenticateToken,
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid consultation ID'),
  handleValidationErrors,
  getConsultationById
);

/**
 * @route   POST /api/consultations
 * @desc    Create a new consultation
 * @access  Private
 */
router.post('/',
  authenticateToken,
  createConsultationValidation,
  handleValidationErrors,
  createConsultation
);

/**
 * @route   PUT /api/consultations/:id
 * @desc    Update a consultation
 * @access  Private
 */
router.put('/:id',
  authenticateToken,
  updateConsultationValidation,
  handleValidationErrors,
  updateConsultation
);

/**
 * @route   POST /api/consultations/:id/rate
 * @desc    Rate a completed consultation
 * @access  Private
 */
router.post('/:id/rate',
  authenticateToken,
  ratingValidation,
  handleValidationErrors,
  rateConsultation
);

/**
 * @route   DELETE /api/consultations/:id
 * @desc    Cancel a consultation
 * @access  Private
 */
router.delete('/:id',
  authenticateToken,
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid consultation ID'),
  handleValidationErrors,
  deleteConsultation
);

// Error handling middleware specific to consultation routes
router.use((error, req, res, next) => {
  console.error('Consultation route error:', error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors.map(err => ({
        field: err.path,
        message: err.message
      }))
    });
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Conflict: Resource already exists',
      error: error.message
    });
  }
  
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference to related resource',
      error: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = router;