const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  logout,
  getProfile
} = require('../controllers/authController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateEmailVerification,
  validateRefreshToken
} = require('../middleware/validation');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5 to 20 for better UX
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests to prevent blocking legitimate users
  skip: (req, res) => res.statusCode < 400
});

const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Reduced to 5 minutes for faster reset
  max: 200, // Increased from 100 to 200 for better performance
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Separate limiter for token verification (more lenient)
const tokenLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Allow frequent token checks
  message: {
    success: false,
    message: 'Too many token verification requests',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes (no authentication required)

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, validateRegistration, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, validateLogin, login);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify user email address
 * @access  Public
 */
router.get('/verify-email/:token', generalLimiter, validateEmailVerification, verifyEmail);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
router.post('/resend-verification', authLimiter, resendVerification);

/**
 * @route   POST /api/v1/auth/request-password-reset
 * @desc    Request password reset
 * @access  Public
 */
router.post('/request-password-reset', authLimiter, validatePasswordResetRequest, requestPasswordReset);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', authLimiter, validatePasswordReset, resetPassword);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', tokenLimiter, validateRefreshToken, refreshToken);

// Protected routes (authentication required)

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', generalLimiter, authenticateToken, logout);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', tokenLimiter, authenticateToken, getProfile);

/**
 * @route   GET /api/v1/auth/verify-token
 * @desc    Verify if current token is valid
 * @access  Private
 */
router.get('/verify-token', tokenLimiter, authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      userId: req.user.user_id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router;