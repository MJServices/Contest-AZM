import axios from "axios";

// Request cache to prevent duplicate requests
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 15000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This is important for handling cookies with CORS
});

// Helper function to create cache key
const createCacheKey = (config) => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${config.headers.Authorization || ""}`;
};

// Helper function to get cached response
const getCachedResponse = (key) => {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response;
  }
  requestCache.delete(key);
  return null;
};

// Helper function to cache response
const setCachedResponse = (key, response) => {
  requestCache.set(key, {
    response: { ...response },
    timestamp: Date.now(),
  });
};

// Request interceptor to add auth token and handle caching
api.interceptors.request.use(
  (config) => {
    // Define endpoints that should NOT have authorization headers
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/verify-email",
      "/auth/resend-verification",
      "/auth/request-password-reset",
      "/auth/reset-password",
      "/auth/refresh-token",
    ];

    // Only add auth token for protected endpoints
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Check cache for GET requests to profile and verify-token endpoints
    if (
      config.method === "get" &&
      (config.url.includes("/profile") || config.url.includes("/verify-token"))
    ) {
      const cacheKey = createCacheKey(config);
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        config.adapter = () => Promise.resolve(cachedResponse);
      } else {
        config.cacheKey = cacheKey;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track refresh attempts to prevent loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle token refresh and caching
api.interceptors.response.use(
  (response) => {
    // Cache successful responses for profile and verify-token
    if (response.config.cacheKey && response.status === 200) {
      setCachedResponse(response.config.cacheKey, response);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data.tokens;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          processQueue(null, accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }),
  requestPasswordReset: (email) =>
    api.post("/auth/request-password-reset", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
  refreshToken: (refreshToken) =>
    api.post("/auth/refresh-token", { refreshToken }),
  verifyToken: () => api.get("/auth/verify-token"),
};

// Helper functions for token management
export const tokenManager = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  getAccessToken: () => localStorage.getItem("accessToken"),

  getRefreshToken: () => localStorage.getItem("refreshToken"),

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default api;
