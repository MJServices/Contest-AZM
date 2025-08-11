import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  Palette, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    style: '',
    tags: [],
    color_palette: [],
    is_featured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState('#000000');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'living_room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'dining_room', label: 'Dining Room' },
    { value: 'office', label: 'Office' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'other', label: 'Other' }
  ];

  const styles = [
    { value: '', label: 'Select Style' },
    { value: 'modern', label: 'Modern' },
    { value: 'contemporary', label: 'Contemporary' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'scandinavian', label: 'Scandinavian' },
    { value: 'bohemian', label: 'Bohemian' },
    { value: 'rustic', label: 'Rustic' },
    { value: 'art_deco', label: 'Art Deco' },
    { value: 'mid_century', label: 'Mid Century' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addColor = () => {
    if (newColor && !formData.color_palette.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        color_palette: [...prev.color_palette, newColor]
      }));
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      color_palette: prev.color_palette.filter(color => color !== colorToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile || !formData.title || !formData.category || !formData.style) {
      alert('Please fill in all required fields and upload an image.');
      return;
    }

    setUploading(true);
    
    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('style', formData.style);
      uploadData.append('tags', JSON.stringify(formData.tags));
      uploadData.append('color_palette', JSON.stringify(formData.color_palette));
      uploadData.append('is_featured', formData.is_featured);

      // Mock upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onUpload(uploadData);
      handleClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      style: '',
      tags: [],
      color_palette: [],
      is_featured: false
    });
    setImageFile(null);
    setImagePreview(null);
    setNewTag('');
    setNewColor('#000000');
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neutral-900">Upload Design</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Image Upload */}
            <div className="mb-6">
              <label className="form-label required">Design Image</label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : imagePreview 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-neutral-300 hover:border-neutral-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon size={48} className="mx-auto text-neutral-400 mb-4" />
                    <p className="text-lg font-medium text-neutral-900 mb-2">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-sm text-neutral-500 mb-4">
                      Supports JPG, PNG, WebP up to 10MB
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary"
                    >
                      <Upload size={20} />
                      <span>Choose File</span>
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="form-label required">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter design title"
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="form-label required">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="form-label required">Style</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  {styles.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Featured Design</label>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-600">
                    Mark as featured design
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your design, inspiration, and key features..."
                rows={4}
                className="input resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="form-label">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-primary-100 text-primary-800 flex items-center space-x-1"
                  >
                    <Tag size={12} />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-outline"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div className="mb-8">
              <label className="form-label">Color Palette</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {formData.color_palette.map((color, index) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 border-neutral-200 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-neutral-500">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-12 h-10 border border-neutral-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="#000000"
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="btn-outline"
                >
                  <Palette size={16} />
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleClose}
                className="btn-outline"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={uploading || !imageFile || !formData.title || !formData.category || !formData.style}
              >
                {uploading ? (
                  <>
                    <div className="spinner w-4 h-4"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload Design</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;