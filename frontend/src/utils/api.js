import axios from 'axios';
import toast from 'react-hot-toast';

// Create Axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token, etc.
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (if available)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Add token to headers if exists
    if (token) {
      config.headers.Authorisation = `Bearer ${token}`;
    }
    
    // Add CSRF token if exists
    const csrfToken = typeof window !== 'undefined' ? localStorage.getItem('csrfToken') : null;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      const { status, data } = error.response;
      
      if (status === 401) {
        // Handle unauthorized (clear token and redirect to login)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Only redirect if we're in a browser context
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
        }
        errorMessage = 'Please log in to continue.';
      } else if (status === 403) {
        // Handle forbidden
        errorMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        // Handle not found
        errorMessage = 'The requested resource was not found.';
      } else if (status === 422 || status === 400) {
        // Handle validation errors
        errorMessage = data.message || 'Validation error. Please cheque your input.';
        
        // Display field errors if available
        if (data.errors && Array.isArray(data.errors)) {
          return Promise.reject({ 
            message: errorMessage, 
            fieldErrors: data.errors.reduce((acc, curr) => {
              acc[curr.field] = curr.message;
              return acc;
            }, {})
          });
        }
      } else if (status === 429) {
        // Rate limiting
        errorMessage = 'Too many requests. Please try again later.';
      } else if (status >= 500) {
        // Server errors
        errorMessage = 'Server error. Please try again later.';
        
        // Log server errors to console in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Server Error:', data);
        }
      }
      
      // Use the server's error message if available
      if (data && data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please cheque your connection.';
    }
    
    // Toast error message (this can be conditional based on error type)
    toast.error(errorMessage);
    
    return Promise.reject({ message: errorMessage });
  }
);

/**
 * Fetch CSRF token
 */
export const fetchCsrfToken = async () => {
  try {
    const { data } = await api.get('/csrf-token');
    if (data && data.csrfToken) {
      localStorage.setItem('csrfToken', data.csrfToken);
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
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