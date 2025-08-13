import { useEffect, useState, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { showEmailVerified, showError } from "../utils/sweetAlert";

const EmailVerification = () => {
  const { token } = useParams();
  const { verifyEmail, user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false); // Prevent duplicate API calls

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      // Prevent duplicate verification attempts
      if (hasVerified.current) {
        return;
      }
      hasVerified.current = true;

      try {
        const result = await verifyEmail(token);

        if (result.success) {
          setStatus("success");
          setMessage(result.message);

          // Show success alert
          showEmailVerified();
        } else {
          setStatus("error");
          setMessage(result.message);

          // Show error alert
          showError("Verification Failed", result.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage("Email verification failed. Please try again.");

        // Show error alert
        showError(
          "Verification Failed",
          "Email verification failed. Please try again."
        );
      }
    };

    handleVerification();
  }, [token, verifyEmail]);

  if (status === "verifying") {
    return <LoadingSpinner message="Verifying your email..." />;
  }

  // If already verified and logged in, send to dashboard
  if (isAuthenticated && user?.emailVerified && status === "success") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden flex items-center justify-center p-6">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/6 w-16 h-16 border-2 border-purple-400/30 backdrop-blur-sm bg-white/5 rotate-45 animate-spin rounded-lg"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/6 w-12 h-12 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-full animate-bounce border border-pink-400/30"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <motion.div
        className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20 max-w-md w-full overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sparkle Effects */}
        <div className="absolute top-4 right-4 opacity-60 animate-pulse">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>

        <div className="text-center">
          {/* Icon */}
          <motion.div
            className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-2xl ${
              status === "success"
                ? "bg-gradient-to-r from-green-500 to-teal-500"
                : "bg-gradient-to-r from-red-500 to-pink-500"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {status === "success" ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <XCircle className="w-10 h-10 text-white" />
            )}
            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Email Verification
          </motion.h2>

          {/* Message */}
          <motion.div
            className={`p-4 rounded-2xl mb-6 border ${
              status === "success"
                ? "bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-400/30 text-green-300"
                : "bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/30 text-red-300"
            } backdrop-blur-lg`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              {status === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {status === "success"
                  ? "Verification Successful!"
                  : "Verification Failed"}
              </span>
            </div>
            <p className="text-sm opacity-90">{message}</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {status === "success" ? (
              <Link
                to="/login"
                className="group relative w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-500 overflow-hidden flex items-center justify-center space-x-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10 flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Continue to Login</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="group relative w-full px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Back to Login</span>
                </Link>
                <Link
                  to="/register"
                  className="group relative w-full px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30 hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Create New Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Additional Info for Success */}
          {status === "success" && (
            <motion.div
              className="mt-6 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-gray-300">
                🎉 Welcome to DecorVista! Your account is now verified and ready
                to use.
              </p>
            </motion.div>
          )}
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute inset-0 rounded-3xl ${
            status === "success"
              ? "bg-gradient-to-r from-green-500/0 to-teal-500/0 group-hover:from-green-500/20 group-hover:to-teal-500/20"
              : "bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/20 group-hover:to-pink-500/20"
          } blur-xl transition-all duration-700 -z-10`}
        ></div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
