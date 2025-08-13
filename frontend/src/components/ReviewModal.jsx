import { useState } from "react";
import { Star, X, Check, Sparkles, AlertCircle } from "lucide-react";

const StarInput = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300 mr-3">{label}</span>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1"
            aria-label={`${n} stars for ${label}`}
          >
            <Star
              className={`w-5 h-5 ${n <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ReviewModal({ isOpen = false, onClose = () => {}, revieweeId = "123" }) {
  const effectiveRevieweeId = revieweeId;
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [form, setForm] = useState({
    rating: 5,
    title: "",
    review_text: "",
    communication_rating: 5,
    quality_rating: 5,
    timeliness_rating: 5,
    professionalism_rating: 5,
    value_rating: 5,
    would_recommend: true,
  });

  // Check if we're in development mode (fallback for environments where process.env isn't available)
  const isDevelopment = typeof process !== 'undefined' && import.meta.process.env?.NODE_ENV === 'development';

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation errors when user starts typing/selecting
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.review_text || form.review_text.trim().length === 0) {
      errors.review_text = "Review text is required";
    } else if (form.review_text.trim().length < 10) {
      errors.review_text = "Review text must be at least 10 characters";
    }
    
    if (form.rating < 1) {
      errors.rating = "Overall rating is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const errors = validateForm();
    setValidationErrors(errors);
    
    // Always log form data for testing (especially useful in development)
    console.log("Form validation errors:", errors);
    console.log("Form data:", form);
    console.log("Effective reviewee ID:", effectiveRevieweeId);
    console.log("Is development mode:", isDevelopment);
    
    // In production, block submission if there are validation errors
    if (!isDevelopment && Object.keys(errors).length > 0) {
      console.log("Blocking submission due to validation errors in production mode");
      return;
    }
    
    // Block submission if no reviewee ID (both dev and prod)
    if (!effectiveRevieweeId) {
      console.error("No reviewee ID provided");
      if (!isDevelopment) return;
    }
    
    setSubmitting(true);
    try {
      console.log("Submitting review for:", effectiveRevieweeId, form);
      
      // Simulate successful submission without backend call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Show loading for 1.5 seconds
      
      onClose();
      alert("✅ Review submitted successfully! Thank you for your feedback.");
      
      // Reset form after successful submission
      setForm({
        rating: 5,
        title: "",
        review_text: "",
        communication_rating: 5,
        quality_rating: 5,
        timeliness_rating: 5,
        professionalism_rating: 5,
        value_rating: 5,
        would_recommend: true,
      });
      setValidationErrors({});
      
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("❌ Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl w-full max-w-2xl border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border-b border-white/20 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
            Write a Review
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall rating */}
          <div>
            <StarInput
              label="Overall"
              value={form.rating}
              onChange={(v) => {
                setForm((p) => ({ ...p, rating: v }));
                if (validationErrors.rating) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    rating: undefined,
                  }));
                }
              }}
            />
            {validationErrors.rating && (
              <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.rating}</span>
              </div>
            )}
          </div>

          {/* Detailed ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StarInput
              label="Communication"
              value={form.communication_rating}
              onChange={(v) =>
                setForm((p) => ({ ...p, communication_rating: v }))
              }
            />
            <StarInput
              label="Quality"
              value={form.quality_rating}
              onChange={(v) => setForm((p) => ({ ...p, quality_rating: v }))}
            />
            <StarInput
              label="Timeliness"
              value={form.timeliness_rating}
              onChange={(v) =>
                setForm((p) => ({ ...p, timeliness_rating: v }))
              }
            />
            <StarInput
              label="Professionalism"
              value={form.professionalism_rating}
              onChange={(v) =>
                setForm((p) => ({ ...p, professionalism_rating: v }))
              }
            />
            <StarInput
              label="Value"
              value={form.value_rating}
              onChange={(v) => setForm((p) => ({ ...p, value_rating: v }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Title (optional)"
              className="w-full px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-all duration-300"
            />
            <label className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 text-gray-300 cursor-pointer hover:border-white/30 transition-all duration-300">
              <input
                type="checkbox"
                name="would_recommend"
                checked={form.would_recommend}
                onChange={onChange}
                className="w-4 h-4 accent-yellow-500"
              />
              <span>Would recommend</span>
            </label>
          </div>

          <div>
            <textarea
              name="review_text"
              value={form.review_text}
              onChange={onChange}
              placeholder="Write your detailed feedback..."
              rows={5}
              className={`w-full px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border transition-all duration-300 resize-none text-white placeholder-gray-400 focus:outline-none ${
                validationErrors.review_text
                  ? "border-red-400/50 focus:border-red-400/70"
                  : "border-white/20 focus:border-purple-400/50"
              }`}
            />
            {validationErrors.review_text && (
              <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.review_text}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-xl border border-white/20 text-white hover:border-red-400/50 transition-all duration-300 disabled:opacity-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold text-black hover:shadow-lg hover:shadow-yellow-500/30 transform transition-all duration-300 flex items-center space-x-2 ${
                submitting ? "opacity-75 cursor-wait" : "hover:scale-105"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}