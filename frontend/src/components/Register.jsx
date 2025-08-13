import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, User, Mail, Phone, Lock, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { showRegistrationSuccess, showError } from '../utils/sweetAlert';
import EmailVerificationPending from './EmailVerificationPending';

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

    // eslint-disable-next-line no-unused-vars
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/6 w-16 h-16 border-2 border-purple-400/30 backdrop-blur-sm bg-white/5 rotate-45 animate-spin rounded-lg" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-12 h-12 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-full animate-bounce border border-pink-400/30" style={{animationDelay: '1s'}}></div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Premium Glass Morphism Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20 overflow-hidden">
          
          {/* Sparkle Effects */}
          <div className="absolute top-4 right-4 opacity-60 animate-pulse">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-60 animate-pulse" style={{animationDelay: '1s'}}>
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
              <UserPlus className="w-10 h-10 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Join DecorVista
            </h2>
            <p className="text-gray-300 text-lg">
              Create your account to get started with 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mx-1">
                premium design tools
              </span>
            </p>
          </div>
          
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-red-400/30 text-red-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-lg rounded-2xl border border-green-400/30 text-green-300 flex items-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <p className="text-sm font-medium">{success}</p>
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Name Fields Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="flex items-center text-gray-300 font-medium">
                  <User className="w-4 h-4 mr-2 text-purple-400" />
                  First Name
                </label>
                <motion.div
                  className="relative"
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
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15"
                    placeholder="Enter your first name"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
                </motion.div>
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="flex items-center text-gray-300 font-medium">
                  <User className="w-4 h-4 mr-2 text-purple-400" />
                  Last Name
                </label>
                <motion.div
                  className="relative"
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
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15"
                    placeholder="Enter your last name"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
                </motion.div>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="flex items-center text-gray-300 font-medium">
                <User className="w-4 h-4 mr-2 text-purple-400" />
                Username
              </label>
              <motion.div
                className="relative"
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
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15"
                  placeholder="Choose a unique username"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center text-gray-300 font-medium">
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15"
                  placeholder="Enter your email address"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            </div>

            {/* Contact Number Field */}
            <div className="space-y-2">
              <label htmlFor="contactNumber" className="flex items-center text-gray-300 font-medium">
                <Phone className="w-4 h-4 mr-2 text-purple-400" />
                Contact Number <span className="text-gray-500 text-sm ml-1">(Optional)</span>
              </label>
              <motion.div
                className="relative"
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
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15"
                  placeholder="Enter your phone number"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            </div>

            {/* Password Fields Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center text-gray-300 font-medium">
                  <Lock className="w-4 h-4 mr-2 text-purple-400" />
                  Password
                </label>
                <motion.div
                  className="relative"
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
                    className="w-full px-4 py-4 pr-12 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15"
                    placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
                </motion.div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="flex items-center text-gray-300 font-medium">
                  <Lock className="w-4 h-4 mr-2 text-purple-400" />
                  Confirm Password
                </label>
                <motion.div
                  className="relative"
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
                    className="w-full px-4 py-4 pr-12 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300 focus:bg-white/15"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 focus-within:from-purple-500/10 focus-within:to-pink-500/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
                </motion.div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="group relative w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-500 flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              {loading ? (
                <motion.div 
                  className="flex items-center relative z-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating Account...
                </motion.div>
              ) : (
                <div className="flex items-center relative z-10">
                  <UserPlus className="w-5 h-5 mr-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-all duration-300" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4 relative z-10">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
              <span className="text-gray-400 text-sm">Already have an account?</span>
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
            </div>
            
            <Link 
              to="/login" 
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 text-gray-300 hover:text-white hover:border-purple-400/50 transition-all duration-300 font-medium"
            >
              Sign In Instead
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

export default Register;