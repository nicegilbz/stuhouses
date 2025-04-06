import axios from 'axios';
import toast from 'react-hot-toast';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies with cross-origin requests
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Check for CSRF token and add if available
    const csrfToken = localStorage.getItem('csrf_token');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear stored tokens
      localStorage.removeItem('auth_token');
      
      // Redirect to login if needed
      // window.location.href = '/auth/login';
    }
    
    // Handle 403 Forbidden - access denied
    if (error.response && error.response.status === 403) {
      console.error('Access forbidden');
    }
    
    // Handle 500 server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

// Function to fetch CSRF token
export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, {
      withCredentials: true,
    });
    
    const token = response.data.csrfToken;
    localStorage.setItem('csrf_token', token);
    return token;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

/**
 * Higher-order function to handle API requests with loading state
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Options
 * @returns {Promise} Promise with data and loading state
 */
export const withLoading = (apiCall, options = {}) => {
  return async (...args) => {
    const { setLoading, onSuccess, onError } = options;
    
    try {
      if (setLoading) setLoading(true);
      const response = await apiCall(...args);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    } finally {
      if (setLoading) setLoading(false);
    }
  };
};

export default api; 