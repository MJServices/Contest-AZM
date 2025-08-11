const crypto = require('crypto');
const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const { generateTokenPair, verifyRefreshToken } = require('../config/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      username, 
      firstName, 
      lastName, 
      contactNumber, 
      role = 'user' 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Sequelize.Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`,
        error: 'USER_EXISTS'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      email,
      password_hash: password, // Will be hashed by the model hook
      username,
      role,
      verification_token: verificationToken
    });

    // Create user details
    await UserDetails.create({
      user_id: user.user_id,
      firstname: firstName,
      lastname: lastName,
      contact_number: contactNumber
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, firstName);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        userId: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
        verificationRequired: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: 'REGISTRATION_FAILED'
    });
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        error: 'EMAIL_NOT_VERIFIED',
        data: {
          userId: user.user_id,
          email: user.email
        }
      });
    }

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Get user details
    const userDetails = await UserDetails.findOne({
      where: { user_id: user.user_id }
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.user_id,
          email: user.email,
          username: user.username,
          role: user.role,
          firstName: userDetails?.firstname,
          lastName: userDetails?.lastname,
          profileImage: userDetails?.profile_image
        },
        tokens
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: 'LOGIN_FAILED'
    });
  }
};

/**
 * Verify email address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findByVerificationToken(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
        error: 'INVALID_TOKEN'
      });
    }

    // Update user verification status
    await user.update({
      email_verified: true,
      verification_token: null
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        userId: user.user_id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: 'VERIFICATION_FAILED'
    });
  }
};

/**
 * Resend verification email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
        error: 'ALREADY_VERIFIED'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    await user.update({
      verification_token: verificationToken
    });

    // Get user details for name
    const userDetails = await UserDetails.findOne({
      where: { user_id: user.user_id }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken, userDetails?.firstname || 'User');

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: 'RESEND_FAILED'
    });
  }
};

/**
 * Request password reset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      reset_password_token: resetToken,
      reset_password_expires: resetExpires
    });

    // Get user details for name
    const userDetails = await UserDetails.findOne({
      where: { user_id: user.user_id }
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken, userDetails?.firstname || 'User');
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError.message);
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset request failed',
      error: 'RESET_REQUEST_FAILED'
    });
  }
};

/**
 * Reset password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findByResetToken(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
        error: 'INVALID_TOKEN'
      });
    }

    // Update password and clear reset token
    await user.update({
      password_hash: password, // Will be hashed by the model hook
      reset_password_token: null,
      reset_password_expires: null
    });

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      error: 'RESET_FAILED'
    });
  }
};

/**
 * Refresh access token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
        error: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Generate new token pair
    const tokens = generateTokenPair(user);

    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: { tokens }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      error: 'INVALID_REFRESH_TOKEN'
    });
  }
};

/**
 * Logout user (client-side token removal)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: 'LOGOUT_FAILED'
    });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    // Get user details
    const userDetails = await UserDetails.findOne({
      where: { user_id: user.user_id }
    });

    res.json({
      success: true,
      data: {
        id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
        emailVerified: user.email_verified,
        isActive: user.is_active,
        createdAt: user.created_at,
        profile: userDetails ? {
          firstName: userDetails.firstname,
          lastName: userDetails.lastname,
          contactNumber: userDetails.contact_number,
          address: userDetails.address,
          profileImage: userDetails.profile_image,
          dateOfBirth: userDetails.date_of_birth,
          gender: userDetails.gender
        } : null
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: 'PROFILE_FETCH_FAILED'
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
  refreshToken,
  logout,
  getProfile
};