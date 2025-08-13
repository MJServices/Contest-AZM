const { verifyAccessToken, extractTokenFromHeader } = require('../config/jwt');
const User = require('../models/User');

/**
 * Authentication middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'MISSING_TOKEN'
      });
    }

    // Verify the token
    const decoded = verifyAccessToken(token);
    
    // Check if user still exists and is active
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive',
        error: 'ACCOUNT_INACTIVE'
      });
    }

    if (!user.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Email verification required',
        error: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: 'INVALID_TOKEN'
    });
  }
};

/**
 * Authorization middleware to check user roles
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.userId);
    
    if (user && user.is_active && user.email_verified) {
      req.user = user;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Middleware to check if user owns the resource
 * @param {String} paramName - Parameter name containing the user ID
 * @returns {Function} Middleware function
 */
const checkResourceOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    const resourceUserId = parseInt(req.params[paramName]);
    const currentUserId = req.user.user_id;

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // User can only access their own resources
    if (resourceUserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this resource',
        error: 'RESOURCE_ACCESS_DENIED'
      });
    }

    next();
  };
};

/**
 * Convenience function for role-based authorization
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const requireRole = (allowedRoles = []) => {
  return authorizeRoles(allowedRoles);
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireRole,
  optionalAuth,
  checkResourceOwnership
};