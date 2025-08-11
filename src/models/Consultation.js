const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Consultation = sequelize.define('consultations', {
  consultation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  consultation_type: {
    type: DataTypes.ENUM(
      'initial_consultation',
      'design_review',
      'progress_check',
      'final_walkthrough',
      'follow_up',
      'other'
    ),
    defaultValue: 'initial_consultation'
  },
  meeting_type: {
    type: DataTypes.ENUM('in_person', 'video_call', 'phone_call'),
    defaultValue: 'video_call'
  },
  scheduled_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    validate: {
      min: 15,
      max: 480 // 8 hours max
    }
  },
  status: {
    type: DataTypes.ENUM(
      'requested',
      'confirmed',
      'rescheduled',
      'in_progress',
      'completed',
      'cancelled',
      'no_show'
    ),
    defaultValue: 'requested'
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Physical address or video call link'
  },
  meeting_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  client_requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  budget_discussed: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  follow_up_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  follow_up_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of file URLs shared during consultation'
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'waived'),
    defaultValue: 'pending'
  },
  reminder_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
      fields: ['scheduled_date']
    },
    {
      fields: ['consultation_type']
    },
    {
      fields: ['meeting_type']
    }
  ]
});

// Instance methods
Consultation.prototype.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return await this.save();
};

Consultation.prototype.reschedule = async function(newDate) {
  this.scheduled_date = newDate;
  this.status = 'rescheduled';
  this.reminder_sent = false;
  return await this.save();
};

Consultation.prototype.complete = async function(notes = null) {
  this.status = 'completed';
  if (notes) {
    this.meeting_notes = notes;
  }
  return await this.save();
};

Consultation.prototype.addRating = async function(rating, feedback = null) {
  this.rating = rating;
  if (feedback) {
    this.feedback = feedback;
  }
  return await this.save();
};

Consultation.prototype.markReminderSent = async function() {
  this.reminder_sent = true;
  return await this.save();
};

// Class methods
Consultation.findByClient = function(clientId) {
  return this.findAll({ 
    where: { client_id: clientId },
    order: [['scheduled_date', 'DESC']]
  });
};

Consultation.findByDesigner = function(designerId) {
  return this.findAll({ 
    where: { designer_id: designerId },
    order: [['scheduled_date', 'ASC']]
  });
};

Consultation.findByStatus = function(status) {
  return this.findAll({ 
    where: { status },
    order: [['scheduled_date', 'ASC']]
  });
};

Consultation.findUpcoming = function(designerId = null) {
  const where = {
    scheduled_date: {
      [sequelize.Sequelize.Op.gte]: new Date()
    },
    status: ['confirmed', 'rescheduled']
  };
  
  if (designerId) {
    where.designer_id = designerId;
  }
  
  return this.findAll({ 
    where,
    order: [['scheduled_date', 'ASC']]
  });
};

Consultation.findPendingAssignment = function() {
  return this.findAll({ 
    where: { 
      designer_id: null,
      status: 'requested'
    },
    order: [['created_at', 'ASC']]
  });
};

Consultation.findNeedingReminder = function() {
  const reminderTime = new Date();
  reminderTime.setHours(reminderTime.getHours() + 24); // 24 hours before
  
  return this.findAll({ 
    where: { 
      scheduled_date: {
        [sequelize.Sequelize.Op.lte]: reminderTime,
        [sequelize.Sequelize.Op.gte]: new Date()
      },
      status: ['confirmed', 'rescheduled'],
      reminder_sent: false
    },
    order: [['scheduled_date', 'ASC']]
  });
};

module.exports = Consultation;