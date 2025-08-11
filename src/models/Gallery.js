const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gallery = sequelize.define('galleries', {
  gallery_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  category: {
    type: DataTypes.ENUM(
      'living_room', 
      'bedroom', 
      'kitchen', 
      'bathroom', 
      'dining_room', 
      'office', 
      'outdoor', 
      'other'
    ),
    allowNull: false,
    defaultValue: 'other'
  },
  style: {
    type: DataTypes.ENUM(
      'modern', 
      'contemporary', 
      'traditional', 
      'minimalist', 
      'industrial', 
      'scandinavian', 
      'bohemian', 
      'rustic', 
      'art_deco', 
      'mid_century', 
      'other'
    ),
    allowNull: false,
    defaultValue: 'modern'
  },
  color_palette: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of hex color codes'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of tags for search and filtering'
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  like_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['style']
    },
    {
      fields: ['uploaded_by']
    },
    {
      fields: ['is_featured']
    },
    {
      fields: ['is_public']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Instance methods
Gallery.prototype.incrementViewCount = async function() {
  this.view_count += 1;
  return await this.save();
};

Gallery.prototype.incrementLikeCount = async function() {
  this.like_count += 1;
  return await this.save();
};

Gallery.prototype.decrementLikeCount = async function() {
  if (this.like_count > 0) {
    this.like_count -= 1;
    return await this.save();
  }
  return this;
};

// Class methods
Gallery.findByCategory = function(category) {
  return this.findAll({ 
    where: { 
      category,
      is_public: true,
      status: 'approved'
    },
    order: [['created_at', 'DESC']]
  });
};

Gallery.findByStyle = function(style) {
  return this.findAll({ 
    where: { 
      style,
      is_public: true,
      status: 'approved'
    },
    order: [['created_at', 'DESC']]
  });
};

Gallery.findFeatured = function() {
  return this.findAll({ 
    where: { 
      is_featured: true,
      is_public: true,
      status: 'approved'
    },
    order: [['created_at', 'DESC']]
  });
};

Gallery.findByUser = function(userId) {
  return this.findAll({ 
    where: { uploaded_by: userId },
    order: [['created_at', 'DESC']]
  });
};

module.exports = Gallery;