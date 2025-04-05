const { db } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if required fields are provided
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields'
      });
    }
    
    // Check if email already exists
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
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const [userId] = await db('users').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    }).returning('id');
    
    // Generate JWT
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Set JWT as HTTP-only cookie
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: userId,
          firstName,
          lastName,
          email
        }
      }
    });
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while registering user'
    });
  }
};

/**
 * Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists
    const user = await db('users')
      .where({ email })
      .first();
    
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Set JWT as HTTP-only cookie
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while logging in'
    });
  }
};

/**
 * Reset password request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide your email'
      });
    }
    
    // Check if user exists
    const user = await db('users')
      .where({ email })
      .first();
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email'
      });
    }
    
    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    // Hash token and store in database
    const hashedToken = await bcrypt.hash(resetToken, 12);
    
    // Set token expiry (1 hour from now)
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    
    // Update user with reset token details
    await db('users')
      .where({ id: user.id })
      .update({
        reset_token: hashedToken,
        reset_token_expires: tokenExpiry,
        updated_at: new Date()
      });
    
    // In a real app, we would send an email with the reset link/token
    // For this demo, we'll just return a success response
    
    return res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email',
      // For testing/demo purposes only, never expose in production
      resetToken,
      resetUrl: `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`
    });
  } catch (error) {
    console.error(`Error requesting password reset: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request'
    });
  }
};

/**
 * Logout user
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  try {
    // Clear JWT cookie
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error(`Error logging out: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while logging out'
    });
  }
};

/**
 * Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // User is already available from auth middleware
    const { id } = req.user;
    
    const user = await db('users')
      .where({ id })
      .select('id', 'first_name', 'last_name', 'email', 'created_at')
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
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error(`Error getting current user: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user details'
    });
  }
}; 