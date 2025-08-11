import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import { showRegistrationSuccess, showError } from '../utils/sweetAlert';
import EmailVerificationPending from './EmailVerificationPending';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    contactNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationPending, setShowVerificationPending] = useState(false);

  const { register } = useAuth();
  // const navigate = useNavigate(); // Not needed as we use EmailVerificationPending component

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    // First Name validation
    if (!formData.firstName.trim()) {
      setError('Please enter your first name');
      return false;
    }
    
    if (formData.firstName.length < 2) {
      setError('First name must be at least 2 characters long');
      return false;
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      setError('Please enter your last name');
      return false;
    }
    
    if (formData.lastName.length < 2) {
      setError('Last name must be at least 2 characters long');
      return false;
    }
    
    // Username validation (3-30 chars, alphanumeric)
    if (formData.username.length < 3 || formData.username.length > 30) {
      setError('Username must be between 3 and 30 characters long');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return false;
    }
    
    // Contact number validation (optional but if provided, should be valid)
    if (formData.contactNumber && !/^[+]?[1-9][\d]{0,15}$/.test(formData.contactNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid contact number');
      return false;
    }
    
    // Password validation (match backend requirements exactly)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, and one number');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please make sure both passwords are identical');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log(formData);
      return;
    }
    
    setLoading(true);
    setError('');

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    
    if (result.success) {
      setSuccess(result.message);
      
      // Show success alert and redirect to verification pending
      showRegistrationSuccess().then(() => {
        setShowVerificationPending(true);
      });
    } else {
      setError(result.message);
      
      // Show error alert
      showError('Registration Failed', result.message);
    }
    
    setLoading(false);
  };

  // Show verification pending page after successful registration
  if (showVerificationPending) {
    return <EmailVerificationPending email={formData.email} firstName={formData.firstName} />;
  }

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
            <UserPlus size={32} />
          </motion.div>
          <h2>Join DecorVista</h2>
          <p className="auth-subtitle">Create your account to get started</p>
        </div>
        
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                <User size={16} />
                First Name
              </label>
              <motion.div
                className="input-wrapper"
                variants={inputVariants}
                whileFocus="focus"
              >
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your first name"
                />
              </motion.div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                <User size={16} />
                Last Name
              </label>
              <motion.div
                className="input-wrapper"
                variants={inputVariants}
                whileFocus="focus"
              >
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your last name"
                />
              </motion.div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <User size={16} />
              Username
            </label>
            <motion.div
              className="input-wrapper"
              variants={inputVariants}
              whileFocus="focus"
            >
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Choose a unique username"
              />
            </motion.div>
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email address"
              />
            </motion.div>
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">
              <Phone size={16} />
              Contact Number
            </label>
            <motion.div
              className="input-wrapper"
              variants={inputVariants}
              whileFocus="focus"
            >
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your phone number"
              />
            </motion.div>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="8"
                placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={16} />
              Confirm Password
            </label>
            <motion.div
              className="input-wrapper password-wrapper"
              variants={inputVariants}
              whileFocus="focus"
            >
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="8"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className="auth-btn"
            disabled={loading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {loading ? (
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⟳
              </motion.div>
            ) : (
              <>
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-links">
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>
          <Link to="/login" className="register-link">
            Sign In Instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;