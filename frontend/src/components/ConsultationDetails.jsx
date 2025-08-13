import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  DollarSign,
  FileText,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../utils/sweetAlert';

const ConsultationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const statusConfig = {
    requested: { 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-400/20', 
      border: 'border-yellow-400',
      icon: <AlertCircle className="w-5 h-5" />
    },
    confirmed: { 
      color: 'text-green-400', 
      bg: 'bg-green-400/20', 
      border: 'border-green-400',
      icon: <CheckCircle className="w-5 h-5" />
    },
    rescheduled: { 
      color: 'text-orange-400', 
      bg: 'bg-orange-400/20', 
      border: 'border-orange-400',
      icon: <RefreshCw className="w-5 h-5" />
    },
    in_progress: { 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/20', 
      border: 'border-blue-400',
      icon: <Clock className="w-5 h-5" />
    },
    completed: { 
      color: 'text-purple-400', 
      bg: 'bg-purple-400/20', 
      border: 'border-purple-400',
      icon: <CheckCircle className="w-5 h-5" />
    },
    cancelled: { 
      color: 'text-red-400', 
      bg: 'bg-red-400/20', 
      border: 'border-red-400',
      icon: <XCircle className="w-5 h-5" />
    },
    no_show: { 
      color: 'text-gray-400', 
      bg: 'bg-gray-400/20', 
      border: 'border-gray-400',
      icon: <XCircle className="w-5 h-5" />
    }
  };

  const meetingTypeConfig = {
    video_call: { 
      icon: <Video className="w-5 h-5" />, 
      label: 'Video Call',
      color: 'text-blue-400'
    },
    phone_call: { 
      icon: <Phone className="w-5 h-5" />, 
      label: 'Phone Call',
      color: 'text-green-400'
    },
    in_person: { 
      icon: <MapPin className="w-5 h-5" />, 
      label: 'In Person',
      color: 'text-purple-400'
    }
  };

  useEffect(() => {
    fetchConsultationDetails();
  }, [id]);

  const fetchConsultationDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/consultations/${id}`);
      
      if (response.data.success) {
        setConsultation(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching consultation details:', error);
      showErrorAlert('Failed to load consultation details');
      navigate('/consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const result = await showConfirmAlert(
      'Update Status',
      `Are you sure you want to mark this consultation as ${newStatus.replace('_', ' ')}?`,
      'question'
    );

    if (result.isConfirmed) {
      try {
        setUpdating(true);
        await api.put(`/consultations/${id}`, { status: newStatus });
        showSuccessAlert('Status updated successfully');
        fetchConsultationDetails();
      } catch (error) {
        console.error('Error updating status:', error);
        showErrorAlert(error.response?.data?.message || 'Failed to update status');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleCancelConsultation = async () => {
    const result = await showConfirmAlert(
      'Cancel Consultation',
      'Are you sure you want to cancel this consultation?',
      'warning'
    );

    if (result.isConfirmed) {
      try {
        setUpdating(true);
        await api.delete(`/consultations/${id}`);
        showSuccessAlert('Consultation cancelled successfully');
        navigate('/consultations');
      } catch (error) {
        console.error('Error cancelling consultation:', error);
        showErrorAlert(error.response?.data?.message || 'Failed to cancel consultation');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleRateConsultation = async (rating, feedback) => {
    try {
      await api.post(`/consultations/${id}/rate`, { rating, feedback });
      showSuccessAlert('Rating submitted successfully');
      setShowRatingModal(false);
      fetchConsultationDetails();
    } catch (error) {
      console.error('Error rating consultation:', error);
      showErrorAlert(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOtherParty = () => {
    if (!consultation) return null;
    return user.role === 'designer' ? consultation.client : consultation.designer;
  };

  const canUpdateStatus = () => {
    if (!consultation || user.role !== 'designer') return false;
    return ['requested', 'confirmed', 'in_progress'].includes(consultation.status);
  };

  const canCancelConsultation = () => {
    if (!consultation) return false;
    const now = new Date();
    const scheduledDate = new Date(consultation.scheduled_date);
    const hoursDiff = (scheduledDate - now) / (1000 * 60 * 60);
    
    return ['requested', 'confirmed', 'rescheduled'].includes(consultation.status) && 
           hoursDiff > 24;
  };

  const canRateConsultation = () => {
    if (!consultation) return false;
    return consultation.status === 'completed' && 
           user.role !== 'designer' && 
           !consultation.rating;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading consultation details...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Consultation Not Found</h2>
          <p className="text-gray-400 mb-6">The consultation you're looking for doesn't exist or you dont have access to it.</p>
          <button
            onClick={() => navigate('/consultations')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-medium text-white transition-all duration-300"
          >
            Back to Consultations
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[consultation.status];
  const meetingType = meetingTypeConfig[consultation.meeting_type];
  const otherParty = getOtherParty();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/consultations')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Consultations</span>
          </button>

          <div className="flex items-center space-x-3">
            {canUpdateStatus() && (
              <div className="flex items-center space-x-2">
                {consultation.status === 'requested' && (
                  <button
                    onClick={() => handleStatusUpdate('confirmed')}
                    disabled={updating}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-xl text-green-400 transition-all duration-300 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                )}
                {consultation.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-xl text-blue-400 transition-all duration-300 disabled:opacity-50"
                  >
                    Start
                  </button>
                )}
                {consultation.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={updating}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-xl text-purple-400 transition-all duration-300 disabled:opacity-50"
                  >
                    Complete
                  </button>
                )}
              </div>
            )}

            {canCancelConsultation() && (
              <button
                onClick={handleCancelConsultation}
                disabled={updating}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-red-400 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            {canRateConsultation() && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-xl text-yellow-400 transition-all duration-300"
              >
                Rate
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {consultation.title}
                  </h1>
                  <p className="text-gray-400 capitalize">
                    {consultation.consultation_type.replace('_', ' ')}
                  </p>
                </div>
                
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${status.bg} ${status.border}`}>
                  {status.icon}
                  <span className={`font-medium ${status.color}`}>
                    {consultation.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {consultation.description && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-semibold text-white mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </h3>
                  <p className="text-gray-300">{consultation.description}</p>
                </div>
              )}
            </motion.div>

            {/* Date, Time & Meeting Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-bold text-white mb-4">Meeting Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date */}
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white font-medium">
                      {formatDate(consultation.scheduled_date)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                  <Clock className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="text-white font-medium">
                      {formatTime(consultation.scheduled_date)}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-white font-medium">
                      {consultation.duration_minutes} minutes
                    </p>
                  </div>
                </div>

                {/* Meeting Type */}
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                  <div className={meetingType.color}>
                    {meetingType.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Meeting Type</p>
                    <p className="text-white font-medium">
                      {meetingType.label}
                    </p>
                  </div>
                </div>
              </div>

              {consultation.location && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl">
                  <h3 className="font-semibold text-white mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location/Link
                  </h3>
                  <p className="text-gray-300">{consultation.location}</p>
                </div>
              )}
            </motion.div>

            {/* Requirements & Budget */}
            {(consultation.client_requirements || consultation.budget_discussed) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
                
                <div className="space-y-4">
                  {consultation.client_requirements && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h3 className="font-semibold text-white mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Requirements
                      </h3>
                      <p className="text-gray-300">{consultation.client_requirements}</p>
                    </div>
                  )}

                  {consultation.budget_discussed && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h3 className="font-semibold text-white mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Budget Discussed
                      </h3>
                      <p className="text-white font-medium">
                        ${parseFloat(consultation.budget_discussed).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Meeting Notes */}
            {consultation.meeting_notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Meeting Notes
                </h2>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-gray-300 whitespace-pre-wrap">{consultation.meeting_notes}</p>
                </div>
              </motion.div>
            )}

            {/* Rating & Feedback */}
            {consultation.rating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Rating & Feedback
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < consultation.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-white">
                      {consultation.rating}/5
                    </span>
                  </div>

                  {consultation.feedback && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-gray-300">{consultation.feedback}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Other Party Info */}
            {otherParty && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  {user.role === 'designer' ? 'Client' : 'Designer'}
                </h3>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {otherParty.profile?.firstname} {otherParty.profile?.lastname}
                    </p>
                    <p className="text-gray-400 text-sm">@{otherParty.username}</p>
                  </div>
                </div>

                {otherParty.profile?.specialization && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Specialization</p>
                    <p className="text-cyan-400 font-medium">{otherParty.profile.specialization}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{otherParty.email}</span>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/book-consultation')}
                  className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-medium transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Another Consultation</span>
                </button>
                
                <button
                  onClick={() => navigate('/consultations')}
                  className="w-full flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>View All Consultations</span>
                </button>
              </div>
            </motion.div>

            {/* Consultation Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">Timeline</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-400">Scheduled:</span>
                  <span className="text-white">
                    {formatDate(consultation.scheduled_date)}
                  </span>
                </div>
                
                {consultation.updated_at !== consultation.created_at && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-400">Last Updated:</span>
                    <span className="text-white">
                      {new Date(consultation.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <RatingModal
            onClose={() => setShowRatingModal(false)}
            onSubmit={handleRateConsultation}
          />
        )}
      </div>
    </div>
  );
};

// Rating Modal Component
const RatingModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setSubmitting(true);
    try {
      await onSubmit(rating, feedback);
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
            onClick={onClose}
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
  );
};

export default ConsultationDetails;