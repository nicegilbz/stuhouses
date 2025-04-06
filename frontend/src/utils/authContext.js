import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

// Create the auth context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  token: null,
});

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user data using token
  const fetchUserData = async (authToken) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(data.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      
      const authToken = data.data.token;
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(data.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, userData);
      
      // Some APIs automatically log in user after registration
      if (data.data.token) {
        localStorage.setItem('auth_token', data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if needed
      if (token) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local auth data regardless of API response
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      
      // Optional: redirect to login page
      // router.push('/auth/login');
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process password reset request.'
      };
    }
  };

  // Reset password function
  const resetPassword = async (token, password, passwordConfirmation) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        token,
        password,
        password_confirmation: passwordConfirmation
      });
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password.'
      };
    }
  };

  // Value to provide through context
  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 