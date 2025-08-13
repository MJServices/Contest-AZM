import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { authAPI, tokenManager } from "../services/api";
import { showWelcome } from "../utils/sweetAlert";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
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
          const raw = profileResponse.data.data;
          const userData = {
            ...raw,
            emailVerified: raw.emailVerified ?? raw.email_verified ?? false,
            firstName:
              raw.firstName ??
              raw.firstname ??
              raw.profile?.firstname ??
              raw.username,
            lastName:
              raw.lastName ?? raw.lastname ?? raw.profile?.lastname ?? "",
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
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
        const { user: rawUser, tokens } = response.data.data;

        // Store tokens
        tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);

        // Backend prevents login if email is not verified, so it's safe to mark as verified here
        const userData = {
          ...rawUser,
          emailVerified: true,
          firstName:
            rawUser.firstName ??
            rawUser.firstname ??
            rawUser.profile?.firstname ??
            rawUser.username,
          lastName:
            rawUser.lastName ??
            rawUser.lastname ??
            rawUser.profile?.lastname ??
            "",
        };

        // Set user state
        setUser(userData);
        setIsAuthenticated(true);

        // Show welcome message
        showWelcome(userData.firstName || "");

        return { success: true, user: userData };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
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
          data: response.data.data,
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      const errorCode = error.response?.data?.error;

      return {
        success: false,
        message: errorMessage,
        error: errorCode,
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
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

      // After successful verification, we should update the user state if authenticated
      if (response.data.success && isAuthenticated && user) {
        setUser((prevUser) => ({
          ...prevUser,
          emailVerified: true,
        }));
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Email verification failed:", error);
      const errorMessage =
        error.response?.data?.message || "Email verification failed";
      return { success: false, message: errorMessage };
    }
  };

  const resendVerification = async (email) => {
    setIsResendingVerification(true);
    try {
      const response = await authAPI.resendVerification(email);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend verification";
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
      const errorMessage =
        error.response?.data?.message || "Password reset request failed";
      return { success: false, message: errorMessage };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Password reset failed";
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
