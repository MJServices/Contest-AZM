import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI, tokenManager } from '../services/api';
import { showWelcome } from '../utils/sweetAlert';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const authCheckRef = useRef(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple simultaneous auth checks
      if (authCheckRef.current) return;
      authCheckRef.current = true;

      try {
        if (tokenManager.isAuthenticated()) {
          // Single API call to get profile (which also verifies token)
          const profileResponse = await authAPI.getProfile();
          setUser(profileResponse.data.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        tokenManager.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        authCheckRef.current = false;
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoggingIn(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const { user: userData, tokens } = response.data.data;
        
        // Store tokens
        tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
        
        // Set user data
        setUser(userData);
        setIsAuthenticated(true);
        
        // Show welcome message
        showWelcome(userData.firstName || userData.username);
        
        return { success: true, user: userData };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const errorCode = error.response?.data?.error;
      
      // Throw error to be handled by the component
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        return { 
          success: true, 
          message: response.data.message,
          data: response.data.data
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const errorCode = error.response?.data?.error;
      
      return { 
        success: false, 
        message: errorMessage,
        error: errorCode
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call result
      tokenManager.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      return { success: false, message: errorMessage };
    }
  };

  const resendVerification = async (email) => {
    setIsResendingVerification(true);
    try {
      const response = await authAPI.resendVerification(email);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification';
      return { success: false, message: errorMessage };
    } finally {
      setIsResendingVerification(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await authAPI.requestPasswordReset(email);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed';
      return { success: false, message: errorMessage };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    isLoggingIn,
    isResendingVerification,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};