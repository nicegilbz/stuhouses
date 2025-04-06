const { db } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} Newly created user and token
 */
exports.registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;
  
  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    throw new Error('Please provide all required fields');
  }
  
  // Cheque if email already exists
  const existingUser = await db('users')
    .where({ email })
    .first();
  
  if (existingUser) {
    throw new Error('Email already in use');
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
  const token = generateToken(userId);
  
  return {
    user: {
      id: userId,
      firstName,
      lastName,
      email
    },
    token
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User and token
 */
exports.loginUser = async (email, password) => {
  // Cheque if email and password are provided
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }
  
  // Cheque if user exists
  const user = await db('users')
    .where({ email })
    .first();
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Cheque if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password');
  }
  
  // Generate JWT
  const token = generateToken(user.id);
  
  return {
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    },
    token
  };
};

/**
 * Generate password reset token
 * @param {string} email - User email
 * @returns {Object} Reset token and URL
 */
exports.forgotPassword = async (email) => {
  if (!email) {
    throw new Error('Please provide your email');
  }
  
  // Cheque if user exists
  const user = await db('users')
    .where({ email })
    .first();
  
  if (!user) {
    throw new Error('No user found with that email');
  }
  
  // Generate reset token (more secure than random string)
  const resetToken = uuidv4();
  
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
  
  return {
    resetToken,
    resetUrl: `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`
  };
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Object} User data
 */
exports.getUserById = async (id) => {
  const user = await db('users')
    .where({ id })
    .select('id', 'first_name', 'last_name', 'email', 'created_at')
    .first();
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    createdAt: user.created_at
  };
};

/**
 * Reset user password
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {boolean} Success status
 */
exports.resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error('Token and new password are required');
  }
  
  // Find user with valid reset token
  const user = await db('users')
    .whereRaw('reset_token_expires > NOW()')
    .first();
  
  if (!user) {
    throw new Error('Invalid or expired token');
  }
  
  // Verify token
  const isValidToken = await bcrypt.compare(token, user.reset_token);
  
  if (!isValidToken) {
    throw new Error('Invalid token');
  }
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update user password and clear reset token
  await db('users')
    .where({ id: user.id })
    .update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
      updated_at: new Date()
    });
  
  return true;
};

/**
 * Generate JWT token
 * @param {number} userId 
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}; 