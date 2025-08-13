const express = require('express');
const router = express.Router();

// Import controllers
const {
  getPlatformStats,
  getUserDashboard,
  getAnalytics
} = require('../controllers/statsController');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');
const { query, validationResult } = require('express-validator');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const statsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many statistics requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateAnalyticsQuery = [
  query('period')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Period must be between 1 and 365 days'),
  
  query('type')
    .optional()
    .isIn(['overview', 'users', 'projects', 'gallery', 'consultations'])
    .withMessage('Invalid analytics type')
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
 * @route   GET /api/v1/stats/platform
 * @desc    Get comprehensive platform statistics
 * @access  Private (Admin only)
 */
router.get('/platform', 
  statsLimiter,
  authenticateToken,
  requireRole(['admin']),
  getPlatformStats
);

/**
 * @route   GET /api/v1/stats/dashboard
 * @desc    Get user-specific dashboard statistics
 * @access  Private
 */
router.get('/dashboard', 
  statsLimiter,
  authenticateToken,
  getUserDashboard
);

/**
 * @route   GET /api/v1/stats/analytics
 * @desc    Get analytics data for charts and graphs
 * @access  Private (Admin only)
 */
router.get('/analytics', 
  statsLimiter,
  authenticateToken,
  requireRole(['admin']),
  validateAnalyticsQuery,
  handleValidationErrors,
  getAnalytics
);

/**
 * @route   GET /api/v1/stats/health
 * @desc    Statistics service health check
 * @access  Private
 */
router.get('/health', 
  statsLimiter,
  authenticateToken,
  (req, res) => {
    res.json({
      success: true,
      message: 'Statistics service is operational',
      timestamp: new Date().toISOString(),
      user: {
        id: req.user.user_id,
        role: req.user.role
      }
    });
  }
);

module.exports = router;