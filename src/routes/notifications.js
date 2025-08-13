const express = require('express');
const router = express.Router();

// Import controllers
const {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  getUnreadCount,
  getNotificationStats,
  createNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  cleanupExpiredNotifications
} = require('../controllers/notificationController');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Allow more requests for notifications
  message: {
    success: false,
    message: 'Too many notification requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const createNotificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit notification creation (admin only)
  message: {
    success: false,
    message: 'Too many notification creations, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateNotificationCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must not exceed 255 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message is required and must not exceed 1000 characters'),
  
  body('type')
    .isIn([
      'project_update', 'consultation_scheduled', 'consultation_reminder', 'consultation_cancelled',
      'review_received', 'payment_received', 'message_received', 'project_assigned',
      'project_completed', 'system_announcement', 'welcome', 'other'
    ])
    .withMessage('Valid notification type is required'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('action_url')
    .optional()
    .isURL({ require_protocol: false })
    .withMessage('Action URL must be a valid URL'),
  
  body('action_text')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Action text must not exceed 100 characters'),
  
  body('expires_at')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid date'),
  
  body('delivery_method')
    .optional()
    .isArray()
    .withMessage('Delivery method must be an array')
    .custom((value) => {
      const validMethods = ['in_app', 'email', 'sms'];
      return value.every(method => validMethods.includes(method));
    })
    .withMessage('Invalid delivery method'),
  
  body('user_ids')
    .custom((value) => {
      if (value === 'all') return true;
      if (Array.isArray(value) && value.every(id => Number.isInteger(id) && id > 0)) return true;
      return false;
    })
    .withMessage('User IDs must be "all" or an array of positive integers')
];

const validatePreferencesUpdate = [
  body('email_notifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  
  body('sms_notifications')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications must be a boolean'),
  
  body('push_notifications')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  
  body('notification_types')
    .optional()
    .isObject()
    .withMessage('Notification types must be an object'),
  
  body('quiet_hours')
    .optional()
    .isObject()
    .withMessage('Quiet hours must be an object')
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

// Protected routes (all notification routes require authentication)

/**
 * @route   GET /api/v1/notifications
 * @desc    Get user notifications with filtering
 * @access  Private
 */
router.get('/', 
  notificationLimiter,
  authenticateToken,
  getNotifications
);

/**
 * @route   GET /api/v1/notifications/count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get('/count',
  notificationLimiter,
  authenticateToken,
  getUnreadCount
);

/**
 * @route   GET /api/v1/notifications/stats
 * @desc    Get notification statistics
 * @access  Private
 */
router.get('/stats',
  notificationLimiter,
  authenticateToken,
  getNotificationStats
);

/**
 * @route   GET /api/v1/notifications/preferences
 * @desc    Get notification preferences
 * @access  Private
 */
router.get('/preferences',
  notificationLimiter,
  authenticateToken,
  getNotificationPreferences
);

/**
 * @route   PUT /api/v1/notifications/preferences
 * @desc    Update notification preferences
 * @access  Private
 */
router.put('/preferences',
  notificationLimiter,
  authenticateToken,
  validatePreferencesUpdate,
  handleValidationErrors,
  updateNotificationPreferences
);

/**
 * @route   POST /api/v1/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.post('/mark-all-read',
  notificationLimiter,
  authenticateToken,
  markAllAsRead
);

/**
 * @route   GET /api/v1/notifications/:id
 * @desc    Get notification by ID
 * @access  Private
 */
router.get('/:id', 
  notificationLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid notification ID is required'),
  handleValidationErrors,
  getNotificationById
);

/**
 * @route   POST /api/v1/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.post('/:id/read', 
  notificationLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid notification ID is required'),
  handleValidationErrors,
  markAsRead
);

/**
 * @route   POST /api/v1/notifications/:id/archive
 * @desc    Archive notification
 * @access  Private
 */
router.post('/:id/archive', 
  notificationLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid notification ID is required'),
  handleValidationErrors,
  archiveNotification
);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', 
  notificationLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid notification ID is required'),
  handleValidationErrors,
  deleteNotification
);

// Admin routes

/**
 * @route   POST /api/v1/notifications
 * @desc    Create notification (admin only)
 * @access  Private (Admin only)
 */
router.post('/', 
  createNotificationLimiter,
  authenticateToken,
  requireRole(['admin']),
  validateNotificationCreation,
  handleValidationErrors,
  createNotification
);

/**
 * @route   POST /api/v1/notifications/cleanup
 * @desc    Clean up expired notifications
 * @access  Private (Admin only)
 */
router.post('/cleanup',
  notificationLimiter,
  authenticateToken,
  requireRole(['admin']),
  cleanupExpiredNotifications
);

module.exports = router;