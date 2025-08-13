import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  User,
  CheckCircle,
  Palette,
  Home,
  TrendingUp,
  ArrowRight,
  Eye,
  Users,
  Settings,
  Upload,
  Activity,
  Mail,
  Phone,
  Edit3,
  Award,
  Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';
// ReviewModal available; hook up in a dedicated designer profile page later

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  // const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    setIsVisible(true);

    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUploadDesign = () => {
    // For now, navigate to gallery where upload functionality will be available
    // Later we can implement a dedicated upload modal or page
    navigate('/gallery');
  };

  const quickActions = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Design",
      description: "Share your latest creation",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      action: () => handleUploadDesign()
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Browse Gallery",
      description: "Explore design inspiration",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      action: () => navigate('/gallery')
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Book Consultation",
      description: "Schedule with experts",
      color: "from-green-500 to-teal-500",
      bgGradient: "from-green-500/20 to-teal-500/20",
      action: () => navigate('/book-consultation')
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Account Settings",
      description: "Manage your profile",
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20",
      action: () => navigate('/edit-profile')
    }
  ];
  
  if (user) {
    quickActions.push({
      icon: <Award className="w-6 h-6" />,
      title: 'Review a Designer',
      description: 'Share feedback with the community',
      color: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      action: () => setShowReviewModal(true),
    });
  }

  const stats = [
    { 
      number: '0', 
      label: 'Active Projects', 
      icon: <Home className="w-6 h-6" />, 
      color: 'from-purple-500 to-pink-500',
      change: '+0%',
      trend: 'up'
    },
    { 
      number: '0', 
      label: 'Consultations', 
      icon: <Users className="w-6 h-6" />, 
      color: 'from-green-500 to-teal-500',
      change: '+0%',
      trend: 'up'
    },
    { 
      number: '0', 
      label: 'Saved Designs', 
      icon: <Bookmark className="w-6 h-6" />, 
      color: 'from-blue-500 to-cyan-500',
      change: '+0%',
      trend: 'up'
    },
    { 
      number: '0', 
      label: 'Total Views', 
      icon: <Eye className="w-6 h-6" />, 
      color: 'from-orange-500 to-red-500',
      change: '+0%',
      trend: 'up'
    }
  ];

  const recentActivity = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Profile Created",
      description: "Welcome to DecorVista!",
      time: "Just now",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Verification",
      description: user.emailVerified ? "Email verified successfully" : "Please verify your email",
      time: "Recently",
      color: user.emailVerified ? "from-green-500 to-teal-500" : "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          className={`mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome Back!
              </h1>
              <p className="text-xl text-gray-300">
                Hello, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  {user.profile?.firstname || user.firstName || user.username || 'User'}
                </span>! Ready to create something amazing?
              </p>
            </div>
            
            <div className="flex items-center space-x-6 mt-6 lg:mt-0">
              <div className="text-right">
                <div className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <span>{formatTime(currentTime)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(currentTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Profile Card */}
            <motion.div 
              className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20 overflow-hidden transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center border-4 border-slate-900">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {user.profile?.firstname || user.firstName || 'User'} {user.profile?.lastname || user.lastName || ''}
                    </h3>
                    <p className="text-gray-400">@{user.username}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                      <span className={`text-sm ${user.emailVerified ? 'text-green-400' : 'text-orange-400'}`}>
                        {user.emailVerified ? 'Verified Account' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="p-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
                >
                  <Edit3 className="w-5 h-5 text-purple-400" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Role</p>
                      <p className="text-white font-medium capitalize">{user.role || 'User'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
                    <Phone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Contact</p>
                      <p className="text-white font-medium">{user.profile?.contactNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
                    <Calendar className="w-5 h-5 text-pink-400" />
                    <div>
                      <p className="text-sm text-gray-400">Member Since</p>
                      <p className="text-white font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transform hover:scale-105 transition-all duration-500 text-left overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 text-white`}>
                        {action.icon}
                      </div>
                      <h4 className="text-lg font-semibold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                        {action.title}
                      </h4>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-all duration-300">
                        {action.description}
                      </p>
                    </div>
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-8">
            {/* Stats Cards */}
            <motion.div 
              className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-purple-500/20 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Your Stats</h3>
                  <p className="text-gray-400 text-sm">Activity overview</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{stat.label}</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {stat.number}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl shadow-purple-500/20 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">Recent Activity</h3>
                  <p className="text-gray-400 text-sm">Latest updates</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl border border-white/10">
                    <div className={`w-8 h-8 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{activity.title}</h4>
                      <p className="text-sm text-gray-400">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className={`mt-8 text-center transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-purple-500/20">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to Transform Your Space?
            </h3>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Explore our gallery, connect with designers, and bring your vision to life with DecorVista.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/gallery')}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10 flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Explore Gallery
                </span>
              </button>
              <button
                onClick={() => navigate('/book-consultation')}
                className="group relative px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl font-semibold border border-white/20 hover:border-cyan-400/50 transform hover:scale-105 transition-all duration-500"
              >
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Consultation
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;