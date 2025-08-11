const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('notifications', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      'project_update',
      'consultation_scheduled',
      'consultation_reminder',
      'consultation_cancelled',
      'review_received',
      'payment_received',
      'message_received',
      'project_assigned',
      'project_completed',
      'system_announcement',
      'welcome',
      'other'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional data related to the notification'
  },
  related_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of related entity (project_id, consultation_id, etc.)'
  },
  related_type: {
    type: DataTypes.ENUM(
      'project',
      'consultation',
      'review',
      'user',
      'gallery',
      'other'
    ),
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  action_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL to navigate when notification is clicked'
  },
  action_text: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Text for action button'
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When this notification should be automatically archived'
  },
  delivery_method: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of delivery methods: ["in_app", "email", "sms"]'
  },
  email_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sms_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['sender_id']
    },
    {
      fields: ['type']
    },
    {
      fields: ['is_read']
    },
    {
      fields: ['is_archived']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['expires_at']
    },
    {
      fields: ['related_id', 'related_type']
    }
  ]
});

// Instance methods
Notification.prototype.markAsRead = async function() {
  this.is_read = true;
  this.read_at = new Date();
  return await this.save();
};

Notification.prototype.archive = async function() {
  this.is_archived = true;
  return await this.save();
};

Notification.prototype.markEmailSent = async function() {
  this.email_sent = true;
  return await this.save();
};

Notification.prototype.markSmsSent = async function() {
  this.sms_sent = true;
  return await this.save();
};

// Class methods
Notification.findByUser = function(userId, includeArchived = false) {
  const where = { user_id: userId };
  if (!includeArchived) {
    where.is_archived = false;
  }
  
  return this.findAll({ 
    where,
    order: [['created_at', 'DESC']]
  });
};

Notification.findUnread = function(userId) {
  return this.findAll({ 
    where: { 
      user_id: userId,
      is_read: false,
      is_archived: false
    },
    order: [['created_at', 'DESC']]
  });
};

Notification.findByType = function(userId, type) {
  return this.findAll({ 
    where: { 
      user_id: userId,
      type,
      is_archived: false
    },
    order: [['created_at', 'DESC']]
  });
};

Notification.findByPriority = function(userId, priority) {
  return this.findAll({ 
    where: { 
      user_id: userId,
      priority,
      is_archived: false
    },
    order: [['created_at', 'DESC']]
  });
};

Notification.findExpired = function() {
  return this.findAll({ 
    where: { 
      expires_at: {
        [sequelize.Sequelize.Op.lt]: new Date()
      },
      is_archived: false
    }
  });
};

Notification.findPendingEmail = function() {
  return this.findAll({ 
    where: { 
      email_sent: false,
      delivery_method: {
        [sequelize.Sequelize.Op.contains]: ['email']
      }
    },
    order: [['created_at', 'ASC']]
  });
};

Notification.findPendingSms = function() {
  return this.findAll({ 
    where: { 
      sms_sent: false,
      delivery_method: {
        [sequelize.Sequelize.Op.contains]: ['sms']
      }
    },
    order: [['created_at', 'ASC']]
  });
};

Notification.getUnreadCount = async function(userId) {
  return await this.count({ 
    where: { 
      user_id: userId,
      is_read: false,
      is_archived: false
    }
  });
};

Notification.markAllAsRead = async function(userId) {
  return await this.update(
    { 
      is_read: true,
      read_at: new Date()
    },
    { 
      where: { 
        user_id: userId,
        is_read: false
      }
    }
  );
};

Notification.archiveExpired = async function() {
  return await this.update(
    { is_archived: true },
    { 
      where: { 
        expires_at: {
          [sequelize.Sequelize.Op.lt]: new Date()
        },
        is_archived: false
      }
    }
  );
};

// Static method to create notification
Notification.createNotification = async function(data) {
  const notification = await this.create(data);
  
  // Here you could add logic to send real-time notifications
  // via WebSocket, push notifications, etc.
  
  return notification;
};

// Bulk create notifications for multiple users
Notification.createBulkNotifications = async function(userIds, notificationData) {
  const notifications = userIds.map(userId => ({
    ...notificationData,
    user_id: userId
  }));
  
  return await this.bulkCreate(notifications);
};

module.exports = Notification;