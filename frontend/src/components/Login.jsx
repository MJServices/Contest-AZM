import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showEmailSent, showError } from '../utils/sweetAlert';
import './Auth.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  
  const { login, resendVerification, isLoggingIn, isResendingVerification } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const watchedEmail = watch('email');

  const onSubmit = async (data) => {
    try {
      clearErrors();
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const errorCode = error.response?.data?.error;
      
      setError('root', { message: errorMessage });
      
      // Show resend verification option if email not verified
      if (errorCode === 'EMAIL_NOT_VERIFIED') {
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
        showError('Failed to Send', result.message);
      }
    } catch (error) {
      showError('Error', 'Failed to resend verification email. Please try again.');
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
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
            <LogIn size={32} />
          </motion.div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your DecorVista account</p>
        </div>
        
        {errors.root && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {errors.root.message}
            {showResendVerification && (
              <motion.button 
                onClick={handleResendVerification}
                className="resend-btn"
                disabled={isResendingVerification}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
              </motion.button>
            )}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email Address
            </label>
            <motion.div 
              className="input-wrapper"
              variants={inputVariants}
              whileFocus="focus"
            >
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Please enter your email address',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address (e.g., user@example.com)'
                  }
                })}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
                disabled={isLoggingIn}
              />
            </motion.div>
            {errors.email && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.email.message}
              </motion.span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Password
            </label>
            <motion.div 
              className="input-wrapper password-wrapper"
              variants={inputVariants}
              whileFocus="focus"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', {
                  required: 'Please enter your password',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long'
                  }
                })}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                disabled={isLoggingIn}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoggingIn}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
            {errors.password && (
              <motion.span 
                className="error-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.password.message}
              </motion.span>
            )}
          </div>

          <motion.button 
            type="submit" 
            className="auth-btn"
            disabled={isLoggingIn || !isValid}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLoggingIn ? (
              <motion.div 
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⟳
              </motion.div>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password" className="forgot-link">
            Forgot your password?
          </Link>
          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>
          <Link to="/register" className="register-link">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;