import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  Star,
  MessageSquare,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../utils/sweetAlert';

const ConsultationHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConsultations, setTotalConsultations] = useState(0);

  const statusConfig = {
    requested: { 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/20', 
      border: 'border-yellow-400',
      icon: <AlertCircle className="w-4 h-4" />
    },
    confirmed: { 
      color: 'text-green-400', 
      bg: 'bg-green-400/20', 
      border: 'border-green-400',
      icon: <CheckCircle className="w-4 h-4" />
    },
    rescheduled: { 
      color: 'text-orange-400', 
      bg: 'bg-orange-400/20', 
      border: 'border-orange-400',
      icon: <RefreshCw className="w-4 h-4" />
    },
    in_progress: { 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/20', 
      border: 'border-blue-400',
      icon: <Clock className="w-4 h-4" />
    },
    completed: { 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/20', 
      border: 'border-purple-400',
      icon: <CheckCircle className="w-4 h-4" />
    },
    cancelled: { 
      color: 'text-red-400', 
      bg: 'bg-red-400/20', 
      border: 'border-red-400',
      icon: <XCircle className="w-4 h-4" />
    },
    no_show: { 
      color: 'text-gray-400', 
      bg: 'bg-gray-400/20', 
      border: 'border-gray-400',
      icon: <XCircle className="w-4 h-4" />
    }
  };

  const meetingTypeIcons = {
    video_call: <Video className="w-4 h-4" />,
    phone_call: <Phone className="w-4 h-4" />,
    in_person: <MapPin className="w-4 h-4" />
  };

  useEffect(() => {
    fetchConsultations();
  }, [currentPage, statusFilter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await api.get(`/consultations?${params}`);
      
      if (response.data.success) {
        setConsultations(response.data.data.consultations);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalConsultations(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      showErrorAlert('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      consultation.title.toLowerCase().includes(searchLower) ||
      consultation.client?.username?.toLowerCase().includes(searchLower) ||
      consultation.designer?.username?.toLowerCase().includes(searchLower) ||
      consultation.client?.profile?.firstname?.toLowerCase().includes(searchLower) ||
      consultation.client?.profile?.lastname?.toLowerCase().includes(searchLower) ||
      consultation.designer?.profile?.firstname?.toLowerCase().includes(searchLower) ||
      consultation.designer?.profile?.lastname?.toLowerCase().includes(searchLower)
    );
  });

  const handleCancelConsultation = async (consultationId) => {
    const result = await showConfirmAlert(
      'Cancel Consultation',
      'Are you sure you want to cancel this consultation?',
      'warning'
    );

    if (result.isConfirmed) {
      try {
        await api.delete(`/consultations/${consultationId}`);
        showSuccessAlert('Consultation cancelled successfully');
        fetchConsultations();
      } catch (error) {
        console.error('Error cancelling consultation:', error);
        showErrorAlert(error.response?.data?.message || 'Failed to cancel consultation');
      }
    }
  };

  const handleRateConsultation = async (consultationId, rating, feedback) => {
    try {
      await api.post(`/consultations/${consultationId}/rate`, {
        rating,
        feedback
      });
      showSuccessAlert('Rating submitted successfully');
      fetchConsultations();
    } catch (error) {
      console.error('Error rating consultation:', error);
      showErrorAlert(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOtherParty = (consultation) => {
    if (user.role === 'designer') {
      return consultation.client;
    }
    return consultation.designer;
  };

  const canCancelConsultation = (consultation) => {
    const now = new Date();
    const scheduledDate = new Date(consultation.scheduled_date);
    const hoursDiff = (scheduledDate - now) / (1000 * 60 * 60);
    
    return ['requested', 'confirmed', 'rescheduled'].includes(consultation.status) && 
           hoursDiff > 24; // Can cancel if more than 24 hours away
  };

  const canRateConsultation = (consultation) => {
    return consultation.status === 'completed' && 
           user.role !== 'designer' && 
           !consultation.rating;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              My Consultations
            </h1>
            <p className="text-gray-300">
              {totalConsultations} consultation{totalConsultations !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <motion.button
            onClick={() => navigate('/book-consultation')}
            className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Book New Consultation</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search consultations..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 appearance-none min-w-[200px]"
              >
                <option value="" className="bg-slate-800">All Status</option>
                <option value="requested" className="bg-slate-800">Requested</option>
                <option value="confirmed" className="bg-slate-800">Confirmed</option>
                <option value="rescheduled" className="bg-slate-800">Rescheduled</option>
                <option value="in_progress" className="bg-slate-800">In Progress</option>
                <option value="completed" className="bg-slate-800">Completed</option>
                <option value="cancelled" className="bg-slate-800">Cancelled</option>
                <option value="no_show" className="bg-slate-800">No Show</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Consultations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No consultations found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t booked any consultations yet'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <button
                  onClick={() => navigate('/book-consultation')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium text-white transition-all duration-300"
                >
                  Book Your First Consultation
                </button>
              )}
            </div>
          ) : (
            filteredConsultations.map((consultation, index) => {
              const status = statusConfig[consultation.status];
              const otherParty = getOtherParty(consultation);
              
              return (
                <motion.div
                  key={consultation.consultation_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {consultation.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="capitalize">
                              {consultation.consultation_type.replace('_', ' ')}
                            </span>
                            <span>•</span>
                            <span>{consultation.duration_minutes} minutes</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              {meetingTypeIcons[consultation.meeting_type]}
                              <span className="capitalize">
                                {consultation.meeting_type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${status.bg} ${status.border}`}>
                          {status.icon}
                          <span className={`text-sm font-medium ${status.color}`}>
                            {consultation.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Date & Time */}
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                          <Calendar className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="text-white font-medium">
                              {formatDate(consultation.scheduled_date)}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {formatTime(consultation.scheduled_date)}
                            </p>
                          </div>
                        </div>

                        {/* Other Party */}
                        {otherParty && (
                          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                            <User className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="text-white font-medium">
                                {otherParty.profile?.firstname} {otherParty.profile?.lastname}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {user.role === 'designer' ? 'Client' : 'Designer'} • @{otherParty.username}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {consultation.description && (
                        <div className="mb-4">
                          <p className="text-gray-300 text-sm">
                            {consultation.description}
                          </p>
                        </div>
                      )}

                      {/* Rating */}
                      {consultation.rating && (
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < consultation.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-300">
                            {consultation.rating}/5
                          </span>
                          {consultation.feedback && (
                            <div className="ml-4">
                              <MessageSquare className="w-4 h-4 text-gray-400 inline mr-1" />
                              <span className="text-sm text-gray-400">Feedback provided</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => navigate(`/consultations/${consultation.consultation_id}`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>

                      {canCancelConsultation(consultation) && (
                        <button
                          onClick={() => handleCancelConsultation(consultation.consultation_id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-400 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}

                      {canRateConsultation(consultation) && (
                        <RatingModal
                          consultation={consultation}
                          onRate={handleRateConsultation}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center space-x-4 mt-8"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-white bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              Previous
            </button>
            
            <span className="text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                currentPage === totalPages
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-white bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Rating Modal Component
const RatingModal = ({ consultation, onRate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setSubmitting(true);
    try {
      await onRate(consultation.consultation_id, rating, feedback);
      setIsOpen(false);
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-xl text-yellow-400 transition-all duration-300"
      >
        <Star className="w-4 h-4" />
        <span>Rate</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-4">Rate Your Consultation</h3>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-2">How was your experience?</p>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors duration-200"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  rating === 0 || submitting
                    ? 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ConsultationHistory;