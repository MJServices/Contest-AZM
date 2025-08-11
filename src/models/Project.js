const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('projects', {
  project_id: {
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
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  designer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
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
      'full_home',
      'other'
    ),
    allowNull: false,
    defaultValue: 'other'
  },
  style_preference: {
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
    allowNull: true
  },
  budget_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  budget_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  timeline_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  timeline_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'draft',
      'submitted', 
      'in_review', 
      'assigned', 
      'in_progress', 
      'design_review', 
      'revision_requested',
      'approved', 
      'completed', 
      'cancelled'
    ),
    defaultValue: 'draft'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  room_dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Object containing room measurements'
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  inspiration_images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of image URLs for inspiration'
  },
  design_files: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of design file URLs'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completion_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['client_id']
    },
    {
      fields: ['designer_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['category']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Instance methods
Project.prototype.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return await this.save();
};

Project.prototype.updateProgress = async function(percentage) {
  this.completion_percentage = Math.max(0, Math.min(100, percentage));
  return await this.save();
};

Project.prototype.assignDesigner = async function(designerId) {
  this.designer_id = designerId;
  this.status = 'assigned';
  return await this.save();
};

Project.prototype.addRating = async function(rating, reviewText = null) {
  this.rating = rating;
  if (reviewText) {
    this.review_text = reviewText;
  }
  return await this.save();
};

// Class methods
Project.findByClient = function(clientId) {
  return this.findAll({ 
    where: { client_id: clientId },
    order: [['created_at', 'DESC']]
  });
};

Project.findByDesigner = function(designerId) {
  return this.findAll({ 
    where: { designer_id: designerId },
    order: [['created_at', 'DESC']]
  });
};

Project.findByStatus = function(status) {
  return this.findAll({ 
    where: { status },
    order: [['created_at', 'DESC']]
  });
};

Project.findUnassigned = function() {
  return this.findAll({ 
    where: { 
      designer_id: null,
      status: ['submitted', 'in_review']
    },
    order: [['priority', 'DESC'], ['created_at', 'ASC']]
  });
};

Project.findActiveProjects = function() {
  return this.findAll({ 
    where: { 
      status: ['assigned', 'in_progress', 'design_review', 'revision_requested']
    },
    order: [['priority', 'DESC'], ['created_at', 'ASC']]
  });
};

module.exports = Project;