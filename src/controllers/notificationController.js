const Notification = require('../models/Notification');
const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const { Op } = require('sequelize');

/**
 * Get user notifications with filtering and pagination
 */
const getNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      priority,
      unread_only,
      include_archived
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { user_id: req.user.user_id };

    // Apply filters
    if (type) whereClause.type = type;
    if (priority) whereClause.priority = priority;
    if (unread_only === 'true') whereClause.is_read = false;
    if (include_archived !== 'true') whereClause.is_archived = false;

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'username'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'profile_image']
          }],
          required: false
        }
      ],
      order: [
        ['priority', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        notifications: notifications.rows,
        pagination: {
          total: notifications.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(notifications.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

/**
 * Get notification by ID
 */
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        notification_id: id,
        user_id: req.user.user_id
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['user_id', 'username'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'profile_image']
          }],
          required: false
        }
      ]
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Mark as read if not already read
    if (!notification.is_read) {
      await notification.markAsRead();
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification',
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        notification_id: id,
        user_id: req.user.user_id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.user_id);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

/**
 * Archive notification
 */
const archiveNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        notification_id: id,
        user_id: req.user.user_id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.archive();

    res.json({
      success: true,
      message: 'Notification archived successfully'
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive notification',
      error: error.message
    });
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        notification_id: id,
        user_id: req.user.user_id
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.user_id);

    res.json({
      success: true,
      data: { unread_count: count }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message
    });
  }
};

/**
 * Get notification statistics
 */
const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const stats = await Promise.all([
      Notification.count({ where: { user_id: userId, is_read: false, is_archived: false } }),
      Notification.count({ where: { user_id: userId, is_archived: false } }),
      Notification.count({ where: { user_id: userId, is_archived: true } }),
      Notification.count({ where: { user_id: userId, priority: 'high', is_read: false } }),
      Notification.count({ where: { user_id: userId, priority: 'urgent', is_read: false } })
    ]);

    res.json({
      success: true,
      data: {
        unread: stats[0],
        total_active: stats[1],
        archived: stats[2],
        high_priority_unread: stats[3],
        urgent_unread: stats[4]
      }
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error.message
    });
  }
};

/**
 * Create notification (admin only)
 */
const createNotification = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create notifications'
      });
    }

    const {
      user_ids, // Array of user IDs or 'all' for all users
      type,
      title,
      message,
      priority = 'medium',
      action_url,
      action_text,
      expires_at,
      delivery_method = ['in_app']
    } = req.body;

    // Validate required fields
    if (!title || !message || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and type are required'
      });
    }

    let targetUserIds = [];

    if (user_ids === 'all') {
      // Send to all active users
      const users = await User.findAll({
        where: { is_active: true },
        attributes: ['user_id']
      });
      targetUserIds = users.map(user => user.user_id);
    } else if (Array.isArray(user_ids)) {
      targetUserIds = user_ids;
    } else {
      return res.status(400).json({
        success: false,
        message: 'user_ids must be an array or "all"'
      });
    }

    // Create notifications
    const notificationData = {
      sender_id: req.user.user_id,
      type,
      title,
      message,
      priority,
      action_url,
      action_text,
      expires_at: expires_at ? new Date(expires_at) : null,
      delivery_method: Array.isArray(delivery_method) ? delivery_method : [delivery_method]
    };

    const notifications = await Notification.createBulkNotifications(targetUserIds, notificationData);

    res.status(201).json({
      success: true,
      message: `Notification sent to ${targetUserIds.length} users`,
      data: {
        notification_count: notifications.length,
        target_users: targetUserIds.length
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

/**
 * Get notification preferences (placeholder for future implementation)
 */
const getNotificationPreferences = async (req, res) => {
  try {
    // For now, return default preferences
    // In a full implementation, you'd have a user preferences table
    const preferences = {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      notification_types: {
        project_updates: true,
        consultation_reminders: true,
        review_notifications: true,
        system_announcements: true,
        marketing: false
      },
      quiet_hours: {
        enabled: false,
        start_time: '22:00',
        end_time: '08:00'
      }
    };

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification preferences',
      error: error.message
    });
  }
};

/**
 * Update notification preferences (placeholder for future implementation)
 */
const updateNotificationPreferences = async (req, res) => {
  try {
    const preferences = req.body;

    // In a full implementation, you'd save these to a user preferences table
    console.log(`Updated notification preferences for user ${req.user.user_id}:`, preferences);

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: preferences
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: error.message
    });
  }
};

/**
 * Clean up expired notifications (admin only)
 */
const cleanupExpiredNotifications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can cleanup notifications'
      });
    }

    const result = await Notification.archiveExpired();

    res.json({
      success: true,
      message: `${result[0]} expired notifications archived`,
      data: { archived_count: result[0] }
    });
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup expired notifications',
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  getUnreadCount,
  getNotificationStats,
  createNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  cleanupExpiredNotifications
};