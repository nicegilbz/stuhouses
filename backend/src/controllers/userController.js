const { db } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const crypto = require('crypto');

/**
 * Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and password are required'
      });
    }
    
    // Cheque if user already exists
    const existingUser = await db('users')
      .where({ email })
      .first();
    
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user
    const [userId] = await db('users').insert({
      email,
      password: hashedPassword,
      first_name: first_name || null,
      last_name: last_name || null,
      phone: phone || null,
      verification_token: verificationToken,
      created_at: new Date()
    }).returning('id');
    
    logger.info(`New user registered: ${email}`);
    
    // Create and send token
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
    
    // Set cookie
    const cookieOptions = {
      expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
    
    res.cookie('jwt', token, cookieOptions);
    
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: userId,
          email,
          first_name,
          last_name
        }
      }
    });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while registering user'
    });
  }
};

/**
 * User login
 * @route   POST /api/users/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email and password are required'
      });
    }
    
    // Cheque if user exists
    const user = await db('users')
      .where({ email })
      .first();
    
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    // Cheque if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    logger.info(`User logged in: ${email}`);
    
    // Create and send token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
    
    // Set cookie
    const cookieOptions = {
      expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
    
    res.cookie('jwt', token, cookieOptions);
    
    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        }
      }
    });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while logging in'
    });
  }
};

/**
 * User logout
 * @route   GET /api/users/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);
    
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 1000),
      httpOnly: true
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error(`Error logging out user: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while logging out'
    });
  }
};

/**
 * Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Getting profile for user ${userId}`);
    
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_verified')
      .first();
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    logger.error(`Error fetching user profile: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user profile'
    });
  }
};

/**
 * Update user profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone } = req.body;
    logger.info(`Updating profile for user ${userId}`);
    
    const [updatedUser] = await db('users')
      .where({ id: userId })
      .update({
        first_name,
        last_name,
        phone,
        updated_at: new Date()
      })
      .returning(['id', 'email', 'first_name', 'last_name', 'phone', 'is_verified']);
    
    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating user profile'
    });
  }
};

/**
 * Get user's shortlisted properties
 * @route   GET /api/users/shortlist
 * @access  Private
 */
exports.getShortlist = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Getting shortlist for user ${userId}`);
    
    const shortlist = await db('user_shortlist')
      .join('properties', 'user_shortlist.property_id', 'properties.id')
      .leftJoin('property_images', function() {
        this.on('properties.id', '=', 'property_images.property_id')
          .andOn('property_images.is_primary', '=', db.raw('true'));
      })
      .where('user_shortlist.user_id', userId)
      .select(
        'properties.*',
        'user_shortlist.created_at as shortlisted_at',
        'property_images.url as primary_image'
      );
    
    return res.status(200).json({
      status: 'success',
      results: shortlist.length,
      data: {
        shortlist
      }
    });
  } catch (error) {
    logger.error(`Error fetching user shortlist: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user shortlist'
    });
  }
};

/**
 * Request password reset
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate input
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is required'
      });
    }
    
    // Cheque if user exists
    const user = await db('users')
      .where({ email })
      .first();
    
    if (!user) {
      // For security reasons, don't tell the client if the user exists or not
      return res.status(200).json({
        status: 'success',
        message: 'If a user with that email exists, a password reset link will be sent'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
    
    // Save reset token to database
    await db('users')
      .where({ id: user.id })
      .update({
        reset_token: resetToken,
        reset_token_expires_at: resetTokenExpires,
        updated_at: new Date()
      });
    
    logger.info(`Password reset requested for: ${email}`);
    
    // In a real app, would send an email with the reset link
    // For now, just return the token in the response
    return res.status(200).json({
      status: 'success',
      message: 'Password reset link sent',
      data: {
        resetToken, // In production, remove this and send via email instead
        resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
      }
    });
  } catch (error) {
    logger.error(`Error requesting password reset: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while requesting password reset'
    });
  }
};

/**
 * Reset password using token
 * @route   PATCH /api/users/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Validate input
    if (!password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password is required'
      });
    }
    
    // Find user with valid reset token
    const user = await db('users')
      .where({ reset_token: token })
      .where('reset_token_expires_at', '>', new Date())
      .first();
    
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired reset token'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user's password and clear reset token
    await db('users')
      .where({ id: user.id })
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expires_at: null,
        updated_at: new Date()
      });
    
    logger.info(`Password reset completed for user: ${user.email}`);
    
    return res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (error) {
    logger.error(`Error resetting password: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while resetting password'
    });
  }
};

/**
 * Verify email address
 * @route   GET /api/users/verify/:token
 * @access  Public
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find user with verification token
    const user = await db('users')
      .where({ verification_token: token })
      .first();
    
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid verification token'
      });
    }
    
    // Update user's verification status
    await db('users')
      .where({ id: user.id })
      .update({
        is_verified: true,
        verification_token: null,
        updated_at: new Date()
      });
    
    logger.info(`Email verified for user: ${user.email}`);
    
    return res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    logger.error(`Error verifying email: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while verifying email'
    });
  }
};

/**
 * Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Getting profile for user ${userId}`);
    
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'email', 'first_name', 'last_name', 'phone', 'role')
      .first();
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
    
    // Get user's shortlisted properties
    const shortlist = await db('user_shortlist')
      .join('properties', 'user_shortlist.property_id', 'properties.id')
      .where('user_shortlist.user_id', userId)
      .select('properties.*');
    
    return res.status(200).json({
      status: 'success',
      data: {
        user,
        shortlist
      }
    });
  } catch (error) {
    logger.error(`Error fetching user profile: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user profile'
    });
  }
};

/**
 * Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone } = req.body;
    logger.info(`Updating profile for user ${userId}`);
    
    const updatedUser = await db('users')
      .where({ id: userId })
      .update({
        first_name,
        last_name,
        phone,
        updated_at: new Date()
      })
      .returning(['id', 'email', 'first_name', 'last_name', 'phone']);
    
    return res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser[0]
      }
    });
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating user profile'
    });
  }
};

/**
 * Change user password
 * @route   PUT /api/users/password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;
    logger.info(`Changing password for user ${userId}`);
    
    // Validate input
    if (!current_password || !new_password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current password and new password are required'
      });
    }
    
    // Get current user with password
    const user = await db('users')
      .where({ id: userId })
      .first();
    
    // Cheque if current password is correct
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    
    // Update password
    await db('users')
      .where({ id: userId })
      .update({
        password: hashedPassword,
        updated_at: new Date()
      });
    
    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    logger.error(`Error changing password: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while changing password'
    });
  }
};

/**
 * Get user shortlist
 * @route   GET /api/users/shortlist
 * @access  Private
 */
exports.getUserShortlist = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Getting shortlist for user ${userId}`);
    
    const shortlist = await db('user_shortlist')
      .join('properties', 'user_shortlist.property_id', 'properties.id')
      .leftJoin('property_images', function() {
        this.on('properties.id', '=', 'property_images.property_id')
          .andOn('property_images.is_primary', '=', db.raw('true'));
      })
      .where('user_shortlist.user_id', userId)
      .select(
        'properties.*',
        'user_shortlist.created_at as shortlisted_at',
        'property_images.url as primary_image'
      );
    
    return res.status(200).json({
      status: 'success',
      results: shortlist.length,
      data: {
        shortlist
      }
    });
  } catch (error) {
    logger.error(`Error fetching user shortlist: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user shortlist'
    });
  }
};

/**
 * Create user inquiry about a property
 * @route   POST /api/users/inquiries
 * @access  Private
 */
exports.createInquiry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { property_id, message, viewing_date } = req.body;
    logger.info(`Creating inquiry for user ${userId} about property ${property_id}`);
    
    // Validate input
    if (!property_id || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Property ID and message are required'
      });
    }
    
    // Cheque if property exists
    const property = await db('properties')
      .where({ id: property_id })
      .first();
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }
    
    // Create inquiry
    const [inquiryId] = await db('property_inquiries').insert({
      property_id,
      user_id: userId,
      message,
      viewing_date: viewing_date || null,
      status: 'pending',
      created_at: new Date()
    }).returning('id');
    
    return res.status(201).json({
      status: 'success',
      message: 'Inquiry created successfully',
      data: {
        inquiry_id: inquiryId
      }
    });
  } catch (error) {
    logger.error(`Error creating inquiry: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating your inquiry'
    });
  }
};

/**
 * Get user inquiries
 * @route   GET /api/users/inquiries
 * @access  Private
 */
exports.getUserInquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Getting inquiries for user ${userId}`);
    
    const inquiries = await db('property_inquiries')
      .join('properties', 'property_inquiries.property_id', 'properties.id')
      .where('property_inquiries.user_id', userId)
      .select(
        'property_inquiries.*',
        'properties.title as property_title',
        'properties.slug as property_slug'
      )
      .orderBy('property_inquiries.created_at', 'desc');
    
    return res.status(200).json({
      status: 'success',
      results: inquiries.length,
      data: {
        inquiries
      }
    });
  } catch (error) {
    logger.error(`Error fetching user inquiries: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user inquiries'
    });
  }
}; 