const User = require("../models/User");
const UserDetails = require("../models/UserDetails");
const Project = require("../models/Project");
const Consultation = require("../models/Consultation");
const Review = require("../models/Review");
const Gallery = require("../models/Gallery");
const Notification = require("../models/Notification");
const { Op } = require("sequelize");

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can access dashboard statistics",
      });
    }

    // Get user statistics
    const userStats = await Promise.all([
      User.count({ where: { role: "user" } }),
      User.count({ where: { role: "designer" } }),
      User.count({ where: { role: "designer-pending" } }),
      User.count({ where: { role: "admin" } }),
      User.count({ where: { is_active: true } }),
      User.count({ where: { email_verified: false } }),
    ]);

    // Get project statistics
    const projectStats = await Promise.all([
      Project.count(),
      Project.count({ where: { status: "draft" } }),
      Project.count({ where: { status: "submitted" } }),
      Project.count({ where: { status: "in_progress" } }),
      Project.count({ where: { status: "completed" } }),
      Project.count({ where: { designer_id: null } }),
    ]);

    // Get consultation statistics
    const consultationStats = await Promise.all([
      Consultation.count(),
      Consultation.count({ where: { status: "requested" } }),
      Consultation.count({ where: { status: "confirmed" } }),
      Consultation.count({ where: { status: "completed" } }),
      Consultation.count({ where: { status: "cancelled" } }),
    ]);

    // Get review statistics
    const reviewStats = await Promise.all([
      Review.count(),
      Review.count({ where: { status: "pending" } }),
      Review.count({ where: { status: "approved" } }),
      Review.count({ where: { status: "rejected" } }),
      Review.count({ where: { is_featured: true } }),
    ]);

    // Get gallery statistics
    const galleryStats = await Promise.all([
      Gallery.count(),
      Gallery.count({ where: { status: "pending" } }),
      Gallery.count({ where: { status: "approved" } }),
      Gallery.count({ where: { is_featured: true } }),
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentActivity = await Promise.all([
      User.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } }),
      Project.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } }),
      Consultation.count({
        where: { created_at: { [Op.gte]: thirtyDaysAgo } },
      }),
      Review.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total_users: userStats[0],
          designers: userStats[1],
          pending_designers: userStats[2],
          admins: userStats[3],
          active_users: userStats[4],
          unverified_users: userStats[5],
        },
        projects: {
          total_projects: projectStats[0],
          draft_projects: projectStats[1],
          submitted_projects: projectStats[2],
          active_projects: projectStats[3],
          completed_projects: projectStats[4],
          unassigned_projects: projectStats[5],
        },
        consultations: {
          total_consultations: consultationStats[0],
          requested_consultations: consultationStats[1],
          confirmed_consultations: consultationStats[2],
          completed_consultations: consultationStats[3],
          cancelled_consultations: consultationStats[4],
        },
        reviews: {
          total_reviews: reviewStats[0],
          pending_reviews: reviewStats[1],
          approved_reviews: reviewStats[2],
          rejected_reviews: reviewStats[3],
          featured_reviews: reviewStats[4],
        },
        gallery: {
          total_items: galleryStats[0],
          pending_items: galleryStats[1],
          approved_items: galleryStats[2],
          featured_items: galleryStats[3],
        },
        recent_activity: {
          new_users: recentActivity[0],
          new_projects: recentActivity[1],
          new_consultations: recentActivity[2],
          new_reviews: recentActivity[3],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

/**
 * Get all users with filtering and pagination
 */
const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can view all users",
      });
    }

    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
      sort = "created_at",
      order = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (role) whereClause.role = role;
    if (status === "active") whereClause.is_active = true;
    if (status === "inactive") whereClause.is_active = false;
    if (status === "unverified") whereClause.email_verified = false;

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        "user_id",
        "username",
        "email",
        "role",
        "is_active",
        "email_verified",
        "created_at",
      ],
      include: [
        {
          model: UserDetails,
          as: "profile",
          attributes: [
            "firstname",
            "lastname",
            "contact_number",
            "profile_image",
          ],
          required: false,
        },
      ],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        users: users.rows,
        pagination: {
          total: users.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(users.count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * Update user status (activate/deactivate)
 */
const updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can update user status",
      });
    }

    const { userId } = req.params;
    const { is_active } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating themselves
    if (user.user_id === req.user.user_id) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    await user.update({ is_active });

    // Create notification for user
    await Notification.createNotification({
      user_id: userId,
      sender_id: req.user.user_id,
      type: "system_announcement",
      title: is_active ? "Account Activated" : "Account Deactivated",
      message: is_active
        ? "Your account has been activated by an administrator"
        : "Your account has been deactivated by an administrator",
      priority: "high",
      delivery_method: ["in_app", "email"],
    });

    res.json({
      success: true,
      message: `User ${is_active ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

/**
 * Update user role
 */
const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can update user roles",
      });
    }

    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ["user", "designer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from changing their own role
    if (user.user_id === req.user.user_id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const oldRole = user.role;
    await user.update({ role });

    // Create notification for user
    await Notification.createNotification({
      user_id: userId,
      sender_id: req.user.user_id,
      type: "system_announcement",
      title: "Role Updated",
      message: `Your role has been updated from ${oldRole} to ${role}`,
      priority: "high",
      delivery_method: ["in_app", "email"],
    });

    res.json({
      success: true,
      message: `User role updated from ${oldRole} to ${role} successfully`,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

/**
 * Get pending approvals (gallery items, reviews, role upgrades)
 */
const getPendingApprovals = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can view pending approvals",
      });
    }

    const [pendingGallery, pendingReviews, pendingRoleUpgrades] =
      await Promise.all([
        Gallery.findAll({
          where: { status: "pending" },
          include: [
            {
              model: User,
              as: "uploader",
              attributes: ["user_id", "username"],
              include: [
                {
                  model: UserDetails,
                  as: "profile",
                  attributes: ["firstname", "lastname"],
                },
              ],
            },
          ],
          order: [["created_at", "ASC"]],
          limit: 10,
        }),
        Review.findPendingApproval(),
        User.findAll({
          where: { role: "designer-pending" },
          attributes: ["user_id", "username", "email", "created_at"],
          include: [
            {
              model: UserDetails,
              as: "profile",
              attributes: ["firstname", "lastname", "profile_image"],
            },
          ],
          order: [["created_at", "ASC"]],
        }),
      ]);

    res.json({
      success: true,
      data: {
        pending_gallery: pendingGallery,
        pending_reviews: pendingReviews,
        pending_role_upgrades: pendingRoleUpgrades,
        summary: {
          gallery_count: pendingGallery.length,
          review_count: pendingReviews.length,
          role_upgrade_count: pendingRoleUpgrades.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending approvals",
      error: error.message,
    });
  }
};

/**
 * Approve/reject gallery item
 */
const moderateGalleryItem = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can moderate gallery items",
      });
    }

    const { id } = req.params;
    const { action, is_featured } = req.body; // action: 'approve' or 'reject'

    const galleryItem = await Gallery.findByPk(id);
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";
    const updateData = { status: newStatus };

    if (action === "approve" && is_featured) {
      updateData.is_featured = true;
    }

    await galleryItem.update(updateData);

    // Notify the uploader
    await Notification.createNotification({
      user_id: galleryItem.uploaded_by,
      sender_id: req.user.user_id,
      type: "system_announcement",
      title: `Gallery Item ${action === "approve" ? "Approved" : "Rejected"}`,
      message: `Your gallery item "${galleryItem.title}" has been ${action}d`,
      related_id: galleryItem.gallery_id,
      related_type: "gallery",
      action_url: `/gallery/${galleryItem.gallery_id}`,
      delivery_method: ["in_app", "email"],
    });

    res.json({
      success: true,
      message: `Gallery item ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error moderating gallery item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to moderate gallery item",
      error: error.message,
    });
  }
};

/**
 * Get system activity logs (simplified version)
 */
const getActivityLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can view activity logs",
      });
    }

    const { page = 1, limit = 50, days = 7 } = req.query;
    const offset = (page - 1) * limit;
    const dateFilter = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get recent activities from various tables
    const [recentUsers, recentProjects, recentConsultations, recentReviews] =
      await Promise.all([
        User.findAll({
          where: { created_at: { [Op.gte]: dateFilter } },
          attributes: ["user_id", "username", "email", "role", "created_at"],
          order: [["created_at", "DESC"]],
          limit: 20,
        }),
        Project.findAll({
          where: { created_at: { [Op.gte]: dateFilter } },
          attributes: [
            "project_id",
            "title",
            "status",
            "client_id",
            "created_at",
          ],
          include: [
            {
              model: User,
              as: "client",
              attributes: ["username"],
            },
          ],
          order: [["created_at", "DESC"]],
          limit: 20,
        }),
        Consultation.findAll({
          where: { created_at: { [Op.gte]: dateFilter } },
          attributes: [
            "consultation_id",
            "title",
            "status",
            "client_id",
            "created_at",
          ],
          include: [
            {
              model: User,
              as: "client",
              attributes: ["username"],
            },
          ],
          order: [["created_at", "DESC"]],
          limit: 20,
        }),
        Review.findAll({
          where: { created_at: { [Op.gte]: dateFilter } },
          attributes: [
            "review_id",
            "rating",
            "status",
            "reviewer_id",
            "created_at",
          ],
          include: [
            {
              model: User,
              as: "reviewer",
              attributes: ["username"],
            },
          ],
          order: [["created_at", "DESC"]],
          limit: 20,
        }),
      ]);

    // Combine and sort all activities
    const activities = [
      ...recentUsers.map((user) => ({
        type: "user_registration",
        id: user.user_id,
        description: `New user registered: ${user.username} (${user.role})`,
        timestamp: user.created_at,
        user: user.username,
      })),
      ...recentProjects.map((project) => ({
        type: "project_created",
        id: project.project_id,
        description: `New project created: ${project.title} (${project.status})`,
        timestamp: project.created_at,
        user: project.client?.username,
      })),
      ...recentConsultations.map((consultation) => ({
        type: "consultation_booked",
        id: consultation.consultation_id,
        description: `New consultation booked: ${consultation.title} (${consultation.status})`,
        timestamp: consultation.created_at,
        user: consultation.client?.username,
      })),
      ...recentReviews.map((review) => ({
        type: "review_submitted",
        id: review.review_id,
        description: `New review submitted: ${review.rating} stars (${review.status})`,
        timestamp: review.created_at,
        user: review.reviewer?.username,
      })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const paginatedActivities = activities.slice(
      offset,
      offset + parseInt(limit)
    );

    res.json({
      success: true,
      data: {
        activities: paginatedActivities,
        pagination: {
          total: activities.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(activities.length / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
};

/**
 * Send system announcement to all users
 */
const sendSystemAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can send system announcements",
      });
    }

    const {
      title,
      message,
      priority = "medium",
      target_roles = ["user", "designer"], // Which roles to send to
      expires_at,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // Get target users
    const targetUsers = await User.findAll({
      where: {
        role: { [Op.in]: target_roles },
        is_active: true,
      },
      attributes: ["user_id"],
    });

    const userIds = targetUsers.map((user) => user.user_id);

    // Create notifications
    await Notification.createBulkNotifications(userIds, {
      sender_id: req.user.user_id,
      type: "system_announcement",
      title,
      message,
      priority,
      expires_at: expires_at ? new Date(expires_at) : null,
      delivery_method: ["in_app", "email"],
    });

    res.json({
      success: true,
      message: `System announcement sent to ${userIds.length} users`,
      data: {
        recipients: userIds.length,
        target_roles,
      },
    });
  } catch (error) {
    console.error("Error sending system announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send system announcement",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getPendingApprovals,
  moderateGalleryItem,
  getActivityLogs,
  sendSystemAnnouncement,
};
