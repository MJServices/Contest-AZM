const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('reviews', {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  reviewee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'projects',
      key: 'project_id'
    }
  },
  consultation_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'consultations',
      key: 'consultation_id'
    }
  },
  review_type: {
    type: DataTypes.ENUM(
      'project_review',
      'consultation_review',
      'designer_review',
      'client_review',
      'general_review'
    ),
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000] // Minimum 10 characters, maximum 2000
    }
  },
  // Detailed rating breakdown
  communication_rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  quality_rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  timeliness_rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  professionalism_rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  value_rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  pros: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of positive aspects'
  },
  cons: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of areas for improvement'
  },
  would_recommend: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged'),
    defaultValue: 'pending'
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  response_text: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Response from the reviewee'
  },
  response_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['reviewer_id']
    },
    {
      fields: ['reviewee_id']
    },
    {
      fields: ['project_id']
    },
    {
      fields: ['consultation_id']
    },
    {
      fields: ['review_type']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['status']
    },
    {
      fields: ['is_public']
    },
    {
      fields: ['is_featured']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Instance methods
Review.prototype.approve = async function() {
  this.status = 'approved';
  this.is_verified = true;
  return await this.save();
};

Review.prototype.reject = async function() {
  this.status = 'rejected';
  return await this.save();
};

Review.prototype.flag = async function() {
  this.status = 'flagged';
  return await this.save();
};

Review.prototype.addResponse = async function(responseText) {
  this.response_text = responseText;
  this.response_date = new Date();
  return await this.save();
};

Review.prototype.incrementHelpfulCount = async function() {
  this.helpful_count += 1;
  return await this.save();
};

Review.prototype.makeFeature = async function() {
  this.is_featured = true;
  return await this.save();
};

// Class methods
Review.findByReviewee = function(revieweeId) {
  return this.findAll({ 
    where: { 
      reviewee_id: revieweeId,
      status: 'approved',
      is_public: true
    },
    order: [['created_at', 'DESC']]
  });
};

Review.findByReviewer = function(reviewerId) {
  return this.findAll({ 
    where: { reviewer_id: reviewerId },
    order: [['created_at', 'DESC']]
  });
};

Review.findByProject = function(projectId) {
  return this.findAll({ 
    where: { project_id: projectId },
    order: [['created_at', 'DESC']]
  });
};

Review.findByConsultation = function(consultationId) {
  return this.findAll({ 
    where: { consultation_id: consultationId },
    order: [['created_at', 'DESC']]
  });
};

Review.findFeatured = function() {
  return this.findAll({ 
    where: { 
      is_featured: true,
      status: 'approved',
      is_public: true
    },
    order: [['created_at', 'DESC']]
  });
};

Review.findPendingApproval = function() {
  return this.findAll({ 
    where: { status: 'pending' },
    order: [['created_at', 'ASC']]
  });
};

Review.getAverageRating = async function(revieweeId) {
  const result = await this.findOne({
    where: { 
      reviewee_id: revieweeId,
      status: 'approved'
    },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
      [sequelize.fn('COUNT', sequelize.col('review_id')), 'total_reviews']
    ]
  });
  
  return {
    average_rating: result ? parseFloat(result.dataValues.average_rating) || 0 : 0,
    total_reviews: result ? parseInt(result.dataValues.total_reviews) || 0 : 0
  };
};

Review.getDetailedRatings = async function(revieweeId) {
  const result = await this.findOne({
    where: { 
      reviewee_id: revieweeId,
      status: 'approved'
    },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'overall_rating'],
      [sequelize.fn('AVG', sequelize.col('communication_rating')), 'communication_rating'],
      [sequelize.fn('AVG', sequelize.col('quality_rating')), 'quality_rating'],
      [sequelize.fn('AVG', sequelize.col('timeliness_rating')), 'timeliness_rating'],
      [sequelize.fn('AVG', sequelize.col('professionalism_rating')), 'professionalism_rating'],
      [sequelize.fn('AVG', sequelize.col('value_rating')), 'value_rating'],
      [sequelize.fn('COUNT', sequelize.col('review_id')), 'total_reviews']
    ]
  });
  
  if (!result) {
    return {
      overall_rating: 0,
      communication_rating: 0,
      quality_rating: 0,
      timeliness_rating: 0,
      professionalism_rating: 0,
      value_rating: 0,
      total_reviews: 0
    };
  }
  
  const data = result.dataValues;
  return {
    overall_rating: parseFloat(data.overall_rating) || 0,
    communication_rating: parseFloat(data.communication_rating) || 0,
    quality_rating: parseFloat(data.quality_rating) || 0,
    timeliness_rating: parseFloat(data.timeliness_rating) || 0,
    professionalism_rating: parseFloat(data.professionalism_rating) || 0,
    value_rating: parseFloat(data.value_rating) || 0,
    total_reviews: parseInt(data.total_reviews) || 0
  };
};

module.exports = Review;