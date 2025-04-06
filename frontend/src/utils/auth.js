import api, { withLoading } from './api';
import { fetchCsrfToken } from './api';

/**
 * Auth service for handling authentication-related operations
 */
class AuthService {
  /**
   * Initialize token if exists in localStorage
   */
  constructor() {
    // Initialize token from storage if in browser environment
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with response data
   */
  register = async (userData) => {
    // Fetch CSRF token before making request
    await fetchCsrfToken();
    
    const { data } = await api.post('/auth/register', userData);
    
    if (data && data.token) {
      this.setSession(data.token, data.data.user);
    }
    
    return data;
  };

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise with response data
   */
  login = async (email, password) => {
    // Fetch CSRF token before making request
    await fetchCsrfToken();
    
    const { data } = await api.post('/auth/login', { email, password });
    
    if (data && data.token) {
      this.setSession(data.token, data.data.user);
    }
    
    return data;
  };

  /**
   * Logout user
   * @returns {Promise} Promise with response data
   */
  logout = async () => {
    const { data } = await api.get('/auth/logout');
    this.clearSession();
    return data;
  };

  /**
   * Get current user
   * @returns {Promise} Promise with response data
   */
  getCurrentUser = async () => {
    if (!this.isAuthenticated()) {
      return null;
    }
    
    try {
      const { data } = await api.get('/auth/me');
      
      if (data && data.data.user) {
        // Update stored user data
        this.setUserData(data.data.user);
      }
      
      return data.data.user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, clear session
        this.clearSession();
      }
      return null;
    }
  };

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Promise with response data
   */
  forgotPassword = async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  };

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} Promise with response data
   */
  resetPassword = async (token, newPassword) => {
    const { data } = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
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
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
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
    }
  };

  /**
   * Cheque if user is authenticated
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