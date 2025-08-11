import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Eye,
  Upload,
  X,
  ChevronDown,
  Star,
  Tag,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UploadModal from './UploadModal';

const Gallery = () => {
  const { user } = useAuth();
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
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
    { value: 'all', label: 'All Styles' },
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

  // Mock data - replace with API calls
  useEffect(() => {
    const mockData = [
      {
        gallery_id: 1,
        title: 'Modern Living Room Design',
        description: 'A sleek and contemporary living room with clean lines and neutral colors.',
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        thumbnail_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        category: 'living_room',
        style: 'modern',
        color_palette: ['#FFFFFF', '#F5F5F5', '#333333', '#8B4513'],
        tags: ['modern', 'minimalist', 'neutral', 'spacious'],
        uploader: { username: 'designer1', profile: { firstname: 'Sarah', lastname: 'Johnson' } },
        is_featured: true,
        view_count: 1250,
        like_count: 89,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        gallery_id: 2,
        title: 'Cozy Bedroom Retreat',
        description: 'A warm and inviting bedroom with soft textures and calming colors.',
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        thumbnail_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        category: 'bedroom',
        style: 'scandinavian',
        color_palette: ['#F8F8FF', '#E6E6FA', '#DDA0DD', '#8FBC8F'],
        tags: ['cozy', 'scandinavian', 'bedroom', 'relaxing'],
        uploader: { username: 'designer2', profile: { firstname: 'Mike', lastname: 'Chen' } },
        is_featured: false,
        view_count: 890,
        like_count: 67,
        created_at: '2024-01-10T14:20:00Z'
      },
      {
        gallery_id: 3,
        title: 'Industrial Kitchen Design',
        description: 'Bold industrial kitchen with exposed brick and metal accents.',
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        thumbnail_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        category: 'kitchen',
        style: 'industrial',
        color_palette: ['#2F2F2F', '#8B4513', '#CD853F', '#A0522D'],
        tags: ['industrial', 'kitchen', 'brick', 'metal'],
        uploader: { username: 'designer3', profile: { firstname: 'Emma', lastname: 'Davis' } },
        is_featured: true,
        view_count: 2100,
        like_count: 156,
        created_at: '2024-01-08T09:15:00Z'
      }
    ];

    setTimeout(() => {
      setGalleryItems(mockData);
      setFilteredItems(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = galleryItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedStyle !== 'all') {
      filtered = filtered.filter(item => item.style === selectedStyle);
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, selectedStyle, galleryItems]);

  const handleLike = (itemId) => {
    setGalleryItems(prev =>
      prev.map(item =>
        item.gallery_id === itemId
          ? { ...item, like_count: item.like_count + 1 }
          : item
      )
    );
  };

  const handleUpload = (uploadData) => {
    // Mock successful upload - replace with actual API call
    const newItem = {
      gallery_id: Date.now(),
      title: uploadData.get('title'),
      description: uploadData.get('description'),
      image_url: URL.createObjectURL(uploadData.get('image')),
      thumbnail_url: URL.createObjectURL(uploadData.get('image')),
      category: uploadData.get('category'),
      style: uploadData.get('style'),
      color_palette: JSON.parse(uploadData.get('color_palette') || '[]'),
      tags: JSON.parse(uploadData.get('tags') || '[]'),
      uploader: {
        username: user.username,
        profile: {
          firstname: user.profile?.firstname || 'You',
          lastname: user.profile?.lastname || ''
        }
      },
      is_featured: uploadData.get('is_featured') === 'true',
      view_count: 0,
      like_count: 0,
      created_at: new Date().toISOString()
    };

    setGalleryItems(prev => [newItem, ...prev]);
    setShowUploadModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-96">
          <div className="spinner w-12 h-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
            Design Gallery
          </h1>
          <p className="text-lg text-neutral-600">
            Discover inspiring interior designs from our talented community
          </p>
        </div>
        
        {user?.role === 'designer' && (
          <motion.button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary mt-4 lg:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload size={20} />
            <span>Upload Design</span>
          </motion.button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search designs, styles, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center space-x-2"
          >
            <Filter size={20} />
            <span>Filters</span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-neutral-200 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Style</label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="input"
                    >
                      {styles.map(style => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-neutral-600">
          Showing {filteredItems.length} of {galleryItems.length} designs
        </p>
      </div>

      {/* Gallery Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.gallery_id}
              className="card-hover cursor-pointer overflow-hidden"
              whileHover={{ y: -4 }}
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                {item.is_featured && (
                  <div className="absolute top-3 left-3">
                    <span className="badge bg-accent-gold text-neutral-900 flex items-center space-x-1">
                      <Star size={12} />
                      <span>Featured</span>
                    </span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <span className="badge-primary flex items-center space-x-1">
                    <Eye size={12} />
                    <span>{item.view_count}</span>
                  </span>
                  <span className="badge bg-red-100 text-red-800 flex items-center space-x-1">
                    <Heart size={12} />
                    <span>{item.like_count}</span>
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{item.uploader.profile.firstname} {item.uploader.profile.lastname}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="badge bg-neutral-100 text-neutral-700 text-xs">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="badge bg-neutral-100 text-neutral-700 text-xs">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.gallery_id}
              className="card p-6 cursor-pointer"
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative md:w-64 md:h-40 w-full h-48 flex-shrink-0">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {item.is_featured && (
                    <div className="absolute top-3 left-3">
                      <span className="badge bg-accent-gold text-neutral-900 flex items-center space-x-1">
                        <Star size={12} />
                        <span>Featured</span>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <div className="flex space-x-3 text-sm text-neutral-500">
                      <span className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{item.view_count}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item.gallery_id);
                        }}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <Heart size={16} />
                        <span>{item.like_count}</span>
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="badge bg-neutral-100 text-neutral-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>{item.uploader.profile.firstname} {item.uploader.profile.lastname}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No designs found
          </h3>
          <p className="text-neutral-600 mb-6">
            Try adjusting your search terms or filters to find more designs.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStyle('all');
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full h-64 md:h-96 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                >
                  <X size={20} />
                </button>
                {selectedItem.is_featured && (
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-accent-gold text-neutral-900 flex items-center space-x-1">
                      <Star size={16} />
                      <span>Featured</span>
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {selectedItem.title}
                  </h2>
                  <div className="flex space-x-4 text-neutral-500">
                    <span className="flex items-center space-x-1">
                      <Eye size={20} />
                      <span>{selectedItem.view_count}</span>
                    </span>
                    <button
                      onClick={() => handleLike(selectedItem.gallery_id)}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart size={20} />
                      <span>{selectedItem.like_count}</span>
                    </button>
                  </div>
                </div>
                
                <p className="text-neutral-600 mb-6">
                  {selectedItem.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Category:</span>
                        <span className="capitalize">{selectedItem.category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Style:</span>
                        <span className="capitalize">{selectedItem.style.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Designer:</span>
                        <span>{selectedItem.uploader.profile.firstname} {selectedItem.uploader.profile.lastname}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Date:</span>
                        <span>{formatDate(selectedItem.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Color Palette</h4>
                    <div className="flex space-x-2">
                      {selectedItem.color_palette.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-neutral-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, index) => (
                      <span key={index} className="badge bg-primary-100 text-primary-800">
                        <Tag size={12} />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;