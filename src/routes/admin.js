const express = require('express');
const router = express.Router();

// Import controllers
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getPendingApprovals,
  moderateGalleryItem,
  getActivityLogs,
  sendSystemAnnouncement
} = require('../controllers/adminController');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Allow more requests for admin operations
  message: {
    success: false,
    message: 'Too many admin requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const moderationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit moderation actions
  message: {
    success: false,
    message: 'Too many moderation actions, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateUserStatusUpdate = [
  body('is_active')
    .isBoolean()
    .withMessage('is_active must be a boolean value')
];

const validateUserRoleUpdate = [
  body('role')
    .isIn(['user', 'designer', 'admin'])
    .withMessage('Role must be user, designer, or admin')
];

const validateGalleryModeration = [
  body('action')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be approve or reject'),
  
  body('is_featured')
    .optional()
    .isBoolean()
    .withMessage('is_featured must be a boolean value')
];

const validateSystemAnnouncement = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must not exceed 255 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message is required and must not exceed 2000 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('target_roles')
    .optional()
    .isArray()
    .withMessage('Target roles must be an array')
    .custom((value) => {
      const validRoles = ['user', 'designer', 'admin'];
      return value.every(role => validRoles.includes(role));
    })
    .withMessage('Invalid target roles'),
  
  body('expires_at')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid date')
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

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['admin']));

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard', 
  adminLimiter,
  getDashboardStats
);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with filtering
 * @access  Private (Admin only)
 */
router.get('/users', 
  adminLimiter,
  getUsers
);

/**
 * @route   PUT /api/v1/admin/users/:userId/status
 * @desc    Update user status (activate/deactivate)
 * @access  Private (Admin only)
 */
router.put('/users/:userId/status', 
  moderationLimiter,
  param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
  validateUserStatusUpdate,
  handleValidationErrors,
  updateUserStatus
);

/**
 * @route   PUT /api/v1/admin/users/:userId/role
 * @desc    Update user role
 * @access  Private (Admin only)
 */
router.put('/users/:userId/role', 
  moderationLimiter,
  param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
  validateUserRoleUpdate,
  handleValidationErrors,
  updateUserRole
);

/**
 * @route   GET /api/v1/admin/pending-approvals
 * @desc    Get pending approvals (gallery, reviews, role upgrades)
 * @access  Private (Admin only)
 */
router.get('/pending-approvals', 
  adminLimiter,
  getPendingApprovals
);

/**
 * @route   POST /api/v1/admin/gallery/:id/moderate
 * @desc    Moderate gallery item (approve/reject)
 * @access  Private (Admin only)
 */
router.post('/gallery/:id/moderate', 
  moderationLimiter,
  param('id').isInt({ min: 1 }).withMessage('Valid gallery item ID is required'),
  validateGalleryModeration,
  handleValidationErrors,
  moderateGalleryItem
);

/**
 * @route   GET /api/v1/admin/activity-logs
 * @desc    Get system activity logs
 * @access  Private (Admin only)
 */
router.get('/activity-logs', 
  adminLimiter,
  getActivityLogs
);

/**
 * @route   POST /api/v1/admin/announcements
 * @desc    Send system announcement to users
 * @access  Private (Admin only)
 */
router.post('/announcements', 
  moderationLimiter,
  validateSystemAnnouncement,
  handleValidationErrors,
  sendSystemAnnouncement
);

/**
 * @route   GET /api/v1/admin/health
 * @desc    Admin health check endpoint
 * @access  Private (Admin only)
 */
router.get('/health', 
  adminLimiter,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin panel is operational',
      timestamp: new Date().toISOString(),
      admin_user: {
        id: req.user.user_id,
        username: req.user.username,
        role: req.user.role
      }
    });
  }
);

module.exports = router;