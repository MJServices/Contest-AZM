import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Fonts
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Gallery from "./components/Gallery";
import EmailVerification from "./components/EmailVerification";
import EmailVerificationPending from "./components/EmailVerificationPending";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300_000, // 5 min
    },
  },
});

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  return isLoading ? (
    <LoadingSpinner message="Checking authentication..." />
  ) : isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  return isLoading ? (
    <LoadingSpinner message="Loading..." />
  ) : !isAuthenticated ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

// Page animation wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: "tween", ease: "anticipate", duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading)
    return <LoadingSpinner message="Initializing application..." />;

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Redirect root */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AnimatedPage>
                    <Login />
                  </AnimatedPage>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <AnimatedPage>
                    <Register />
                  </AnimatedPage>
                </PublicRoute>
              }
            />
            <Route
              path="/verify-email/:token"
              element={
                <AnimatedPage>
                  <EmailVerification />
                </AnimatedPage>
              }
            />
            <Route
              path="/email-verification-pending"
              element={
                <AnimatedPage>
                  <EmailVerificationPending />
                </AnimatedPage>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AnimatedPage>
                  <ForgotPassword />
                </AnimatedPage>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <AnimatedPage>
                  <ResetPassword />
                </AnimatedPage>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AnimatedPage>
                    <Dashboard />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <AnimatedPage>
                    <Gallery />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(31, 41, 55, 0.95)",
            color: "#fff",
            borderRadius: "1rem",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          },
          success: {
            duration: 3000,
            style: {
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
