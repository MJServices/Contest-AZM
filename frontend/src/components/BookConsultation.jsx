import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Filter,
  Search,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { showSuccessAlert, showErrorAlert } from '../utils/sweetAlert';

const BookConsultation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    consultation_type: 'initial_consultation',
    meeting_type: 'video_call',
    scheduled_date: '',
    duration_minutes: 60,
    designer_id: null,
    client_requirements: '',
    budget_discussed: ''
  });

  // Component states
  const [designers, setDesigners] = useState([]);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const steps = [
    { id: 1, title: 'Consultation Details', icon: <Calendar className="w-5 h-5" /> },
    { id: 2, title: 'Select Designer', icon: <User className="w-5 h-5" /> },
    { id: 3, title: 'Choose Time', icon: <Clock className="w-5 h-5" /> },
    { id: 4, title: 'Confirmation', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const consultationTypes = [
    { value: 'initial_consultation', label: 'Initial Consultation', description: 'First meeting to discuss your project' },
    { value: 'design_review', label: 'Design Review', description: 'Review and refine existing designs' },
    { value: 'progress_check', label: 'Progress Check', description: 'Check on ongoing project progress' },
    { value: 'final_walkthrough', label: 'Final Walkthrough', description: 'Final review of completed work' },
    { value: 'follow_up', label: 'Follow-up', description: 'Follow-up on previous consultation' },
    { value: 'other', label: 'Other', description: 'Custom consultation type' }
  ];

  const meetingTypes = [
    { value: 'video_call', label: 'Video Call', icon: <Video className="w-5 h-5" />, description: 'Online video meeting' },
    { value: 'phone_call', label: 'Phone Call', icon: <Phone className="w-5 h-5" />, description: 'Voice call only' },
    { value: 'in_person', label: 'In Person', icon: <MapPin className="w-5 h-5" />, description: 'Face-to-face meeting' }
  ];

  const durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  // Fetch designers
  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultations/designers');
      setDesigners(response.data.data || []);
    } catch (error) {
      console.error('Error fetching designers:', error);
      showErrorAlert('Failed to load designers');
    } finally {
      setLoading(false);
    }
  };

  // Filter designers
  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = !searchTerm || 
      designer.profile?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designer.profile?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designer.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = !specializationFilter || 
      designer.profile?.specialization === specializationFilter;
    
    return matchesSearch && matchesSpecialization;
  });

  // Get unique specializations
  const specializations = [...new Set(designers.map(d => d.profile?.specialization).filter(Boolean))];

  // Generate time slots
  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle designer selection
  const handleDesignerSelect = (designer) => {
    setSelectedDesigner(designer);
    handleInputChange('designer_id', designer.user_id);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateTime = new Date(`${date}T${selectedTime || '09:00'}`);
    handleInputChange('scheduled_date', dateTime.toISOString());
    
    // Generate available slots for the selected date
    const slots = generateTimeSlots(date);
    setAvailableSlots(slots);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      const dateTime = new Date(`${selectedDate}T${time}`);
      handleInputChange('scheduled_date', dateTime.toISOString());
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation for each step
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.title && formData.consultation_type && formData.meeting_type;
      case 2:
        return selectedDesigner;
      case 3:
        return selectedDate && selectedTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Submit consultation booking
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const bookingData = {
        ...formData,
        budget_discussed: formData.budget_discussed ? parseFloat(formData.budget_discussed) : null
      };

      const response = await api.post('/consultations', bookingData);
      
      if (response.data.success) {
        showSuccessAlert('Consultation booked successfully!');
        navigate('/consultations');
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      showErrorAlert(error.response?.data?.message || 'Failed to book consultation');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Book a Consultation
          </h1>
          <p className="text-gray-300 text-lg">
            Connect with our expert designers to bring your vision to life
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  currentStep >= step.id ? 'text-cyan-400' : 'text-gray-400'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id 
                      ? 'border-cyan-400 bg-cyan-400/20' 
                      : 'border-gray-400 bg-gray-400/10'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-cyan-400' : 'bg-gray-400'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Consultation Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Consultation Details</h2>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Consultation Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Living Room Redesign"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project and what you'd like to discuss..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Consultation Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {consultationTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleInputChange('consultation_type', type.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                          formData.consultation_type === type.value
                            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                            : 'border-white/20 bg-white/5 text-gray-300 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm opacity-70">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meeting Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Meeting Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {meetingTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleInputChange('meeting_type', type.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                          formData.meeting_type === type.value
                            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                            : 'border-white/20 bg-white/5 text-gray-300 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className="flex justify-center mb-2">{type.icon}</div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm opacity-70">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {durations.map((duration) => (
                      <button
                        key={duration.value}
                        onClick={() => handleInputChange('duration_minutes', duration.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                          formData.duration_minutes === duration.value
                            ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                            : 'border-white/20 bg-white/5 text-gray-300 hover:border-cyan-400/50'
                        }`}
                      >
                        {duration.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={formData.client_requirements}
                    onChange={(e) => handleInputChange('client_requirements', e.target.value)}
                    placeholder="Any specific requirements or preferences..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Range (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.budget_discussed}
                    onChange={(e) => handleInputChange('budget_discussed', e.target.value)}
                    placeholder="Enter your budget"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Designer */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Select a Designer</h2>
                
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search designers..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={specializationFilter}
                      onChange={(e) => setSpecializationFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 appearance-none"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec} className="bg-slate-800">
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Designers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                  {filteredDesigners.map((designer) => (
                    <motion.button
                      key={designer.user_id}
                      onClick={() => handleDesignerSelect(designer)}
                      className={`p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                        selectedDesigner?.user_id === designer.user_id
                          ? 'border-cyan-400 bg-cyan-400/20'
                          : 'border-white/20 bg-white/5 hover:border-cyan-400/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {designer.profile?.firstname} {designer.profile?.lastname}
                          </h3>
                          <p className="text-gray-400 text-sm">@{designer.username}</p>
                          {designer.profile?.specialization && (
                            <p className="text-cyan-400 text-sm mt-1">
                              {designer.profile.specialization}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-300">
                                {designer.avgRating || 'New'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">
                                {designer.consultationCount || 0} consultations
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {filteredDesigners.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No designers found matching your criteria.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Choose Time */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Choose Date & Time</h2>
                
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Select Time *
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                            selectedTime === time
                              ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                              : 'border-white/20 bg-white/5 text-gray-300 hover:border-cyan-400/50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected DateTime Display */}
                {selectedDate && selectedTime && (
                  <div className="p-4 bg-cyan-400/20 border border-cyan-400 rounded-xl">
                    <h3 className="font-semibold text-cyan-400 mb-2">Selected Appointment</h3>
                    <p className="text-white">
                      {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {selectedTime}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      Duration: {formData.duration_minutes} minutes
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Confirm Your Booking</h2>
                
                <div className="space-y-4">
                  {/* Consultation Details */}
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="font-semibold text-white mb-4">Consultation Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Title:</span>
                        <span className="text-white">{formData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">
                          {consultationTypes.find(t => t.value === formData.consultation_type)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Meeting:</span>
                        <span className="text-white">
                          {meetingTypes.find(t => t.value === formData.meeting_type)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{formData.duration_minutes} minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Designer Details */}
                  {selectedDesigner && (
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-semibold text-white mb-4">Designer</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {selectedDesigner.profile?.firstname} {selectedDesigner.profile?.lastname}
                          </p>
                          <p className="text-gray-400 text-sm">@{selectedDesigner.username}</p>
                          {selectedDesigner.profile?.specialization && (
                            <p className="text-cyan-400 text-sm">
                              {selectedDesigner.profile.specialization}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="font-semibold text-white mb-4">Date & Time</h3>
                    <p className="text-white">
                      {selectedDate && selectedTime && 
                        new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      } at {selectedTime}
                    </p>
                  </div>

                  {/* Description */}
                  {formData.description && (
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-semibold text-white mb-4">Description</h3>
                      <p className="text-gray-300">{formData.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-white bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  !isStepValid(currentStep)
                    ? 'text-gray-500 cursor-not-allowed bg-gray-600/20'
                    : 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25'
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepValid(currentStep)}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                  loading || !isStepValid(currentStep)
                    ? 'text-gray-500 cursor-not-allowed bg-gray-600/20'
                    : 'text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-lg hover:shadow-green-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Book Consultation</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Cancel Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 mx-auto"
          >
            <X className="w-4 h-4" />
            <span>Cancel and return to dashboard</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookConsultation;
