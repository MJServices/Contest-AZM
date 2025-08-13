const express = require('express');
const router = express.Router();

// Import controllers
const {
  upload,
  getProfile,
  updateProfile,
  updateProfileImage,
  requestRoleUpgrade,
  deleteProfileImage,
  approveRoleUpgrade,
  getPendingRoleUpgrades
} = require('../controllers/profileController');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Allow more requests for profile operations
  message: {
    success: false,
    message: 'Too many profile requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit image uploads
  message: {
    success: false,
    message: 'Too many upload attempts, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateProfileUpdate = [
  body('firstname')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('lastname')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .matches(/^[a-zA-Z]/)
    .withMessage('Username must start with a letter'),
  
  body('contact_number')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid contact number'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date >= today) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    }),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other')
];

const validateRoleUpgrade = [
  body('requestedRole')
    .notEmpty()
    .withMessage('Requested role is required')
    .isIn(['designer'])
    .withMessage('Only designer role upgrades are allowed'),
  
  body('reason')
    .notEmpty()
    .withMessage('Reason for role upgrade is required')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
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

/**
 * @route   GET /api/v1/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/', profileLimiter, authenticateToken, getProfile);

/**
 * @route   PUT /api/v1/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', 
  profileLimiter, 
  authenticateToken, 
  validateProfileUpdate, 
  handleValidationErrors, 
  updateProfile
);

/**
 * @route   POST /api/v1/profile/image
 * @desc    Update profile image
 * @access  Private
 */
router.post('/image', 
  uploadLimiter, 
  authenticateToken, 
  upload.single('profileImage'), 
  updateProfileImage
);

/**
 * @route   DELETE /api/v1/profile/image
 * @desc    Delete profile image
 * @access  Private
 */
router.delete('/image', 
  profileLimiter, 
  authenticateToken, 
  deleteProfileImage
);

/**
 * @route   POST /api/v1/profile/role-upgrade
 * @desc    Request role upgrade
 * @access  Private
 */
router.post('/role-upgrade', 
  profileLimiter, 
  authenticateToken, 
  validateRoleUpgrade, 
  handleValidationErrors, 
  requestRoleUpgrade
);

/**
 * @route   GET /api/v1/profile/pending-upgrades
 * @desc    Get all pending role upgrade requests (admin only)
 * @access  Private (Admin only)
 */
router.get('/pending-upgrades',
  profileLimiter,
  authenticateToken,
  requireRole(['admin']),
  getPendingRoleUpgrades
);

/**
 * @route   POST /api/v1/profile/approve-upgrade/:userId
 * @desc    Approve or reject role upgrade request (admin only)
 * @access  Private (Admin only)
 */
router.post('/approve-upgrade/:userId',
  profileLimiter,
  authenticateToken,
  requireRole(['admin']),
  body('approve')
    .isBoolean()
    .withMessage('Approve field must be a boolean value'),
  handleValidationErrors,
  approveRoleUpgrade
);

module.exports = router;