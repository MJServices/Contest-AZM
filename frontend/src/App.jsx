import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
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
import EditProfile from "./components/EditProfile";
import Gallery from "./components/Gallery";
import BookConsultation from "./components/BookConsultation";
import ConsultationHistory from "./components/ConsultationHistory";
import ConsultationDetails from "./components/ConsultationDetails";
import EmailVerification from "./components/EmailVerification";
import EmailVerificationPending from "./components/EmailVerificationPending";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";
import Home from "./components/Home";
import UploadModal from "./components/UploadModal";
import ReviewModal from "./components/ReviewModal";

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

// Route Guards with Enhanced Access Control

// Public routes whitelist - only these routes are accessible without authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/email-verification-pending",
  "/forgot-password",
  "/reset-password",
];

// Enhanced ProtectedRoute with role-based access control and email verification
const ProtectedRoute = ({
  children,
  requiredRole = null,
  requireEmailVerification = false,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    // Preserve the intended destination for redirect after login
    const returnTo = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  // Check email verification if required
  if (requireEmailVerification && !user.emailVerified) {
    return <Navigate to="/email-verification-pending" replace />;
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user's actual role
    const redirectPath =
      user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOf(["user", "designer", "admin"]),
  requireEmailVerification: PropTypes.bool,
};

// Enhanced PublicRoute that restricts unauthenticated users to whitelist only
const PublicRoute = ({ children, allowAuthenticated = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // Check if current route is in public whitelist
  const currentPath = location.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route.includes(":")) {
      // Handle dynamic routes like /verify-email/:token
      const routePattern = route.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(currentPath);
    }
    return currentPath === route || currentPath.startsWith(route + "/");
  });

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (isAuthenticated && !allowAuthenticated) {
    // Smart redirect based on user state
    if (user && !user.emailVerified) {
      return <Navigate to="/email-verification-pending" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Even when allowAuthenticated is true (e.g., verify pages), if user is already verified, send to dashboard
  if (
    isAuthenticated &&
    user &&
    user.emailVerified &&
    (currentPath.startsWith("/verify-email") ||
      currentPath.startsWith("/email-verification-pending"))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // If unauthenticated user tries to access non-public route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    const returnTo = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowAuthenticated: PropTypes.bool,
};

// Route wrapper that handles both public and protected route logic
const RouteGuard = ({
  children,
  isProtected = false,
  requiredRole = null,
  requireEmailVerification = false,
}) => {
  if (isProtected) {
    return (
      <ProtectedRoute
        requiredRole={requiredRole}
        requireEmailVerification={requireEmailVerification}
      >
        {children}
      </ProtectedRoute>
    );
  }
  return <PublicRoute>{children}</PublicRoute>;
};

RouteGuard.propTypes = {
  children: PropTypes.node.isRequired,
  isProtected: PropTypes.bool,
  requiredRole: PropTypes.oneOf(["user", "designer", "admin"]),
  requireEmailVerification: PropTypes.bool,
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

AnimatedPage.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading)
    return <LoadingSpinner message="Initializing application..." />;

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Navbar />
      <main className="relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Home Route - Always accessible */}
            <Route
              path="/"
              element={
                <PublicRoute allowAuthenticated={true}>
                  <Home />
                </PublicRoute>
              }
            />
            <Route
              path="/upload-model"
              element={
                <PublicRoute allowAuthenticated={true}>
                  <UploadModal />
                </PublicRoute>
              }
            />
            <Route
              path="/review-model/:revieweeId"
              element={
                <PublicRoute allowAuthenticated={true}>
                  {({ params }) => (
                    <ReviewModal
                      isOpen={true}
                      onClose={() => window.history.back()}
                      revieweeId={params.revieweeId}
                    />
                  )}
                </PublicRoute>
              }
            />
            {/* Public Routes - Only accessible when not authenticated */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                      <Login />
                    </div>
                  </AnimatedPage>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                      <Register />
                    </div>
                  </AnimatedPage>
                </PublicRoute>
              }
            />

            {/* Email verification routes - Accessible to all */}
            <Route
              path="/verify-email/:token"
              element={
                <PublicRoute allowAuthenticated={true}>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                      <EmailVerification />
                    </div>
                  </AnimatedPage>
                </PublicRoute>
              }
            />
            <Route
              path="/email-verification-pending"
              element={
                <PublicRoute allowAuthenticated={true}>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                      <EmailVerificationPending />
                    </div>
                  </AnimatedPage>
                </PublicRoute>
              }
            />

            {/* Password reset routes - Only accessible when not authenticated */}
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                      <ForgotPassword />
                    </div>
                  </AnimatedPage>
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <PublicRoute>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                      <ResetPassword />
                    </div>
                  </AnimatedPage>
                </PublicRoute>
              }
            />

            {/* Protected Routes - Require authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireEmailVerification={true}>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                      <Dashboard />
                    </div>
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute requireEmailVerification={true}>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                      <Gallery />
                    </div>
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute requireEmailVerification={true}>
                  <AnimatedPage>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                      <EditProfile />
                    </div>
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />

            {/* Consultation Routes */}
            <Route
              path="/book-consultation"
              element={
                <ProtectedRoute requireEmailVerification={true}>
                  <AnimatedPage>
                    <BookConsultation />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultations"
              element={
                <ProtectedRoute requireEmailVerification={true}>
                  <AnimatedPage>
                    <ConsultationHistory />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultations/:id"
              element={
                <ProtectedRoute requireEmailVerification={true}>
                  <AnimatedPage>
                    <ConsultationDetails />
                  </AnimatedPage>
                </ProtectedRoute>
              }
            />

            {/* Fallback - Redirect unknown routes to login with return path */}
            <Route
              path="*"
              element={
                <PublicRoute>
                  <Navigate to="/login" replace />
                </PublicRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Enhanced Toast notifications with glass morphism */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(15, 23, 42, 0.8)",
            color: "#f1f5f9",
            borderRadius: "1.5rem",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            padding: "16px 20px",
          },
          success: {
            duration: 3000,
            style: {
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            },
          },
          error: {
            duration: 4000,
            style: {
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            },
          },
          loading: {
            style: {
              background:
                "linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
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
