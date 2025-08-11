import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showEmailSent, showError } from '../utils/sweetAlert';
import './Auth.css';

const EmailVerificationPending = ({ email, firstName }) => {
  const { resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);

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
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="auth-icon"
          >
            <Mail size={32} />
          </motion.div>
          <h2>Check Your Email</h2>
          <p className="auth-subtitle">
            We've sent a verification link to {email}
          </p>
        </div>

        <div className="verification-pending-content">
          <motion.div 
            className="verification-steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="step">
              <div className="step-icon">
                <Mail size={20} />
              </div>
              <div className="step-content">
                <h4>Check your inbox</h4>
                <p>Look for an email from DecorVista</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <CheckCircle size={20} />
              </div>
              <div className="step-content">
                <h4>Click the verification link</h4>
                <p>This will verify your email address</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="verification-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="resend-text">
              Didn't receive the email? Check your spam folder or
            </p>
            
            <motion.button
              onClick={handleResendVerification}
              disabled={isResending}
              className="resend-verification-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isResending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw size={16} />
                  </motion.div>
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Resend Email
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        <div className="auth-links">
          <Link to="/login" className="back-to-login">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPending;