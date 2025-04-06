import api, { withLoading, fetchCsrfToken } from './api';
import toast from 'react-hot-toast';

// Safely import js-cookie with fallback
let Cookies;
try {
  Cookies = require('js-cookie');
} catch (error) {
  // Fallback implementation if js-cookie is not available
  Cookies = {
    set: (name, value, options) => {
      if (typeof document !== 'undefined') {
        const expires = options?.expires ? `; expires=${new Date(Date.now() + options.expires * 864e5).toUTCString()}` : '';
        const path = options?.path ? `; path=${options.path}` : '';
        document.cookie = `${name}=${value}${expires}${path}`;
      }
    },
    get: (name) => {
      if (typeof document !== 'undefined') {
        const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }
      return undefined;
    },
    remove: (name, options) => {
      if (typeof document !== 'undefined') {
        const path = options?.path ? `; path=${options.path}` : '';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${path}`;
      }
    }
  };
}

// Mock users for testing without a backend
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@stuhouses.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    role: 'admin',
    isVerified: true
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    firstName: 'Regular',
    lastName: 'User',
    name: 'Regular User',
    role: 'user',
    isVerified: true
  }
];

/**
 * Auth service for handling authentication-related operations
 */
class AuthService {
  /**
   * Initialize token if exists in localStorage
   */
  constructor() {
    // Initialize token and user from storage if in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }
  }

  /**
   * Mock authentication for testing - simulates a server response
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object|null} User object or null if auth fails
   */
  mockAuthenticate(email, password) {
    // Find user with matching email and password
    const user = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (user) {
      // Clone user and remove password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with response data
   */
  register = async (userData) => {
    try {
      console.log('Register attempt:', userData.email);
      
      // Check if email already exists in mock users
      const existingUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (existingUser) {
        toast.error('User with this email already exists');
        throw new Error('User with this email already exists');
      }
      
      // Create a new mock user
      const newUser = {
        id: MOCK_USERS.length + 1,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        role: 'user',
        isVerified: true
      };
      
      // Add to mock users (this won't persist on page reload)
      MOCK_USERS.push(newUser);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      // Create mock response
      const mockResponse = {
        token: `mock-token-${Date.now()}`,
        data: {
          user: userWithoutPassword
        }
      };
      
      // Set session
      this.setSession(mockResponse.token, mockResponse.data.user);
      
      return mockResponse;
    } catch (error) {
      console.error('Registration error:', error.message);
      throw error;
    }
  };

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise with response data
   */
  login = async (email, password) => {
    try {
      console.log('Login attempt:', email);
      
      // Authenticate with mock system
      const user = this.mockAuthenticate(email, password);
      
      if (!user) {
        toast.error('Invalid email or password');
        throw new Error('Invalid email or password');
      }
      
      // Create mock response
      const mockResponse = {
        token: `mock-token-${Date.now()}`,
        data: {
          user: user
        }
      };
      
      // Set session
      this.setSession(mockResponse.token, mockResponse.data.user);
      
      return mockResponse;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  /**
   * Logout user
   * @returns {Promise} Promise with response data
   */
  logout = async () => {
    this.clearSession();
    return { success: true };
  };

  /**
   * Get current user
   * @returns {Promise} Promise with response data
   */
  getCurrentUser = async () => {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    return this.user;
  };

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Promise with response data
   */
  forgotPassword = async (email) => {
    // Check if email exists in mock users
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return { success: true, message: 'If your email is registered, you will receive a password reset link.' };
    }
    
    return { success: true, message: 'If your email is registered, you will receive a password reset link.' };
  };

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} Promise with response data
   */
  resetPassword = async (token, newPassword) => {
    // In a mock environment, we'll just return success
    return { success: true, message: 'Password has been reset successfully.' };
  };

  /**
   * Set session data
   * @param {string} token - JWT token
   * @param {Object} user - User data
   */
  setSession = (token, user) => {
    this.token = token;
    this.user = user;
    
    if (typeof window !== 'undefined') {
      // Set in localStorage for backward compatibility
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set in cookies for middleware access
      // Set cookie to expire in 7 days
      Cookies.set('token', token, { expires: 7, path: '/' });
    }
  };

  /**
   * Set user data
   * @param {Object} user - User data
   */
  setUserData = (user) => {
    this.user = user;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  /**
   * Clear session data
   */
  clearSession = () => {
    this.token = null;
    this.user = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Remove cookie
      Cookies.remove('token', { path: '/' });
    }
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated = () => {
    return !!this.token;
  };

  /**
   * Get user data
   * @returns {Object} User data
   */
  getUserData = () => {
    return this.user;
  };

  /**
   * Get token
   * @returns {string} JWT token
   */
  getToken = () => {
    return this.token;
  };
}

// Create instance
const authService = new AuthService();

// Add withLoading versions of methods
export const authServiceWithLoading = {
  register: withLoading(authService.register),
  login: withLoading(authService.login),
  logout: withLoading(authService.logout),
  getCurrentUser: withLoading(authService.getCurrentUser),
  forgotPassword: withLoading(authService.forgotPassword),
  resetPassword: withLoading(authService.resetPassword),
};

export default authService;

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token or null if invalid
 */
export const verifyToken = (token) => {
  if (!token) return null;
  
  try {
    // In a real app, you would verify the token with JWT library
    // For this mock implementation, we'll handle special admin token
    
    // Hardcoded admin token
    if (token === 'admin-token') {
      return {
        id: 1,
        email: 'admin@stuhouses.com',
        name: 'Admin User',
        role: 'admin'
      };
    }
    
    // For stored users
    const user = MOCK_USERS.find(u => `user-token-${u.id}` === token);
    if (user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name || `User ${user.id}`,
        role: user.role || 'user'
      };
    }
    
    // Get token from localStorage as fallback
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken === 'admin-token') {
        return {
          id: 1,
          email: 'admin@stuhouses.com',
          name: 'Admin User',
          role: 'admin'
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}; 