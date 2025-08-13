import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { showEmailSent, showError } from "../utils/sweetAlert";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);

  const { login, resendVerification, isLoggingIn, isResendingVerification } =
    useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedEmail = watch("email");

  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const onSubmit = async (data) => {
    try {
      clearErrors();
      const result = await login(data.email, data.password);

      // Smart redirect based on user state and return path
      if (result.success) {
        const user = result.user;

        // If user's email is not verified, redirect to verification pending
        if (!user.emailVerified) {
          navigate("/email-verification-pending");
          return;
        }

        // Redirect to return path or default dashboard
        const redirectPath =
          returnTo && returnTo !== "/login" ? returnTo : "/dashboard";
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      const errorCode = error.response?.data?.error;

      setError("root", { message: errorMessage });

      // Show resend verification option if email not verified
      if (errorCode === "EMAIL_NOT_VERIFIED") {
        setShowResendVerification(true);
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      const result = await resendVerification(watchedEmail);
      if (result.success) {
        setShowResendVerification(false);
        showEmailSent();
      } else {
        showError("Failed to Send", result.message);
      }
    } catch (error) {
      showError(
        "Error",
        "Failed to resend verification email. Please try again."
      );
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

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
        className="relative z-10 w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Glass Morphism Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl shadow-purple-500/20 overflow-hidden">
          {/* Sparkle Effects */}
          <div className="absolute top-4 right-4 opacity-60 animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div
            className="absolute bottom-4 left-4 opacity-60 animate-pulse"
            style={{ animationDelay: "1s" }}
          >
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>

          {/* Header Section */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl"
            >
              <LogIn className="w-10 h-10 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
            </motion.div>

            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Sign in to your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mx-1">
                DecorVista
              </span>
              account
            </p>
          </div>

          {/* Error Message */}
          {errors.root && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-red-400/30 text-red-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-sm font-medium mb-2">{errors.root.message}</p>
              {showResendVerification && (
                <motion.button
                  onClick={handleResendVerification}
                  className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 text-sm font-medium"
                  disabled={isResendingVerification}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isResendingVerification
                    ? "Sending..."
                    : "Resend Verification Email"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6 relative z-10"
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="flex items-center text-gray-300 font-medium"
              >
                <Mail className="w-4 h-4 mr-2 text-purple-400" />
                Email Address
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
              >
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Please enter your email address",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message:
                        "Please enter a valid email address (e.g., user@example.com)",
                    },
                  })}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-lg rounded-xl border ${
                    errors.email ? "border-red-400/50" : "border-white/20"
                  } text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15`}
                  placeholder="Enter your email"
                  disabled={isLoggingIn}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
              {errors.email && (
                <motion.span
                  className="text-red-400 text-sm font-medium flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.email.message}
                </motion.span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="flex items-center text-gray-300 font-medium"
              >
                <Lock className="w-4 h-4 mr-2 text-purple-400" />
                Password
              </label>
              <motion.div
                className="relative"
                variants={inputVariants}
                whileFocus="focus"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Please enter your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 bg-white/10 backdrop-blur-lg rounded-xl border ${
                    errors.password ? "border-red-400/50" : "border-white/20"
                  } text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15`}
                  placeholder="Enter your password"
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoggingIn}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
              {errors.password && (
                <motion.span
                  className="text-red-400 text-sm font-medium flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.password.message}
                </motion.span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="group relative w-full px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-500 flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isLoggingIn || !isValid}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

              {isLoggingIn ? (
                <motion.div
                  className="flex items-center relative z-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing In...
                </motion.div>
              ) : (
                <div className="flex items-center relative z-10">
                  <LogIn className="w-5 h-5 mr-2 sm:mr-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 sm:ml-3 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4 relative z-10">
            <Link
              to="/forgot-password"
              className="inline-block text-purple-400 hover:text-pink-400 font-medium transition-colors duration-300 hover:underline decoration-purple-400/50"
            >
              Forgot your password?
            </Link>

            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
              <span className="text-gray-400 text-sm">
                Don&apos;t have an account?
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
            </div>

            <Link
              to="/register"
              className="group inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-purple-400/50 transition-all duration-300 font-medium"
            >
              Create Account
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-cyan-500/0 hover:from-purple-500/10 hover:via-pink-500/5 hover:to-cyan-500/10 blur-2xl transition-all duration-1000 -z-10"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
