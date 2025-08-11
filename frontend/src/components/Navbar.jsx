import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, LogOut, Menu, X, Image, Calendar, Star, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-lg border-b border-neutral-200 shadow-soft"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container-custom flex justify-between items-center py-4">
        <Link to="/" className="flex items-center space-x-3">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="/logo.png"
              alt="DecorVista Logo"
              className="h-10 w-10 object-contain"
            />
            <h2 className="text-2xl font-bold text-gradient-primary">DecorVista</h2>
          </motion.div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <motion.div
                className="flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-full text-sm text-primary-700 font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <User size={16} />
                <span>Welcome, {user?.profile?.firstname || user?.username || 'User'}!</span>
              </motion.div>
              
              <nav className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/dashboard" className="nav-link">
                    <Home size={16} />
                    Dashboard
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/gallery" className="nav-link">
                    <Image size={16} />
                    Gallery
                  </Link>
                </motion.div>
                
                {user?.role === 'user' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/consultations" className="nav-link">
                      <Calendar size={16} />
                      Consultations
                    </Link>
                  </motion.div>
                )}
                
                {user?.role === 'designer' && (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/my-projects" className="nav-link">
                        <Calendar size={16} />
                        My Projects
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/reviews" className="nav-link">
                        <Star size={16} />
                        Reviews
                      </Link>
                    </motion.div>
                  </>
                )}
                
                {user?.role === 'admin' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/admin" className="nav-link">
                      <Settings size={16} />
                      Admin
                    </Link>
                  </motion.div>
                )}
              </nav>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="nav-link">Login</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn-primary">Register</Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden flex items-center justify-center p-2 rounded-xl text-primary-600 hover:bg-primary-50 transition-colors duration-200"
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-white border-t border-neutral-200 shadow-lg"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {isAuthenticated ? (
              <div className="px-4 py-6 space-y-4">
                <motion.div
                  className="flex items-center space-x-2 p-3 bg-primary-50 rounded-xl text-primary-700 font-medium"
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: 0.1 }}
                >
                  <User size={16} />
                  <span>{user?.profile?.firstname || user?.username || 'User'}</span>
                </motion.div>
                
                <div className="space-y-2">
                  <motion.div
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home size={20} />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/gallery"
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Image size={20} />
                      <span className="font-medium">Gallery</span>
                    </Link>
                  </motion.div>
                  
                  {user?.role === 'user' && (
                    <motion.div
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        to="/consultations"
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Calendar size={20} />
                        <span className="font-medium">Consultations</span>
                      </Link>
                    </motion.div>
                  )}
                  
                  {user?.role === 'designer' && (
                    <>
                      <motion.div
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/my-projects"
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Calendar size={20} />
                          <span className="font-medium">My Projects</span>
                        </Link>
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          to="/reviews"
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Star size={20} />
                          <span className="font-medium">Reviews</span>
                        </Link>
                      </motion.div>
                    </>
                  )}
                  
                  {user?.role === 'admin' && (
                    <motion.div
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings size={20} />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
                
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200"
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: 0.6 }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="px-4 py-6 space-y-4">
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/login"
                    className="block w-full p-3 text-center rounded-xl border border-primary-200 text-primary-600 font-medium hover:bg-primary-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/register"
                    className="block w-full p-3 text-center rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;