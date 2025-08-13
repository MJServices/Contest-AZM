import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, ArrowRight, Sparkles, Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { showEmailSent, showError } from '../utils/sweetAlert';

const EmailVerificationPending = ({ email: propEmail }) => {
  const { resendVerification, user } = useAuth();
  const [isResending, setIsResending] = useState(false);

  // Use email from props or from user context
  const email = propEmail || user?.email;

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        showEmailSent();
      } else {
        showError('Failed to Send', result.message);
      }
    } catch (error) {
      showError('Error', 'Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden flex items-center justify-center p-6">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/6 w-16 h-16 border-2 border-purple-400/30 backdrop-blur-sm bg-white/5 rotate-45 animate-spin rounded-lg" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-12 h-12 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-full animate-bounce border border-pink-400/30" style={{animationDelay: '1s'}}></div>
      </div>

      <motion.div 
        className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20 max-w-lg w-full overflow-hidden"
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
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Mail className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Check Your Email
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p 
            className="text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            We&apos;ve sent a verification link to{' '}
            <span className="text-cyan-400 font-semibold">{email}</span>
          </motion.p>

          {/* Steps */}
          <motion.div 
            className="space-y-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-white mb-1">Check your inbox</h4>
                <p className="text-sm text-gray-400">Look for an email from DecorVista in your inbox</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-white mb-1">Click the verification link</h4>
                <p className="text-sm text-gray-400">This will verify your email address and activate your account</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-white mb-1">Check spam folder</h4>
                <p className="text-sm text-gray-400">If you don&apos;t see it, check your spam or junk folder</p>
              </div>
            </div>
          </motion.div>

          {/* Resend Section */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-400 text-sm mb-4">
              Didn&apos;t receive the email?
            </p>
            
            <motion.button
              onClick={handleResendVerification}
              disabled={isResending}
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30 hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              whileHover={{ scale: isResending ? 1 : 1.02 }}
              whileTap={{ scale: isResending ? 1 : 0.98 }}
            >
              <span className="flex items-center space-x-2">
                {isResending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Email</span>
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link 
              to="/login" 
              className="group relative inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 hover:border-cyan-400/50 transform hover:scale-105 transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Login</span>
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.div 
            className="mt-6 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-gray-400">
              💡 <strong>Tip:</strong> The verification link will expire in 24 hours. 
              If you need help, please contact our support team.
            </p>
          </motion.div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 blur-xl transition-all duration-700 -z-10"></div>
      </motion.div>
    </div>
  );
};

EmailVerificationPending.propTypes = {
  email: PropTypes.string,
};

export default EmailVerificationPending;