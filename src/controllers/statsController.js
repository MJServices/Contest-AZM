const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const Project = require('../models/Project');
const Consultation = require('../models/Consultation');
const Review = require('../models/Review');
const Gallery = require('../models/Gallery');
const Notification = require('../models/Notification');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Get comprehensive platform statistics
 */
const getPlatformStats = async (req, res) => {
  try {
    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // User statistics
    const userStats = await Promise.all([
      User.count(),
      User.count({ where: { role: 'user' } }),
      User.count({ where: { role: 'designer' } }),
      User.count({ where: { role: 'designer-pending' } }),
      User.count({ where: { is_active: true } }),
      User.count({ where: { email_verified: true } }),
      User.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } }),
      User.count({ where: { created_at: { [Op.gte]: sevenDaysAgo } } }),
      User.count({ where: { created_at: { [Op.gte]: yesterday } } })
    ]);

    // Project statistics
    const projectStats = await Promise.all([
      Project.count(),
      Project.count({ where: { status: 'completed' } }),
      Project.count({ where: { status: 'in_progress' } }),
      Project.count({ where: { status: 'cancelled' } }),
      Project.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } }),
      Project.count({ where: { designer_id: null } }),
      Project.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('completion_percentage')), 'avg_completion']
        ]
      })
    ]);

    // Consultation statistics
    const consultationStats = await Promise.all([
      Consultation.count(),
      Consultation.count({ where: { status: 'completed' } }),
      Consultation.count({ where: { status: 'confirmed' } }),
      Consultation.count({ where: { status: 'cancelled' } }),
      Consultation.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } }),
      Consultation.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']
        ],
        where: { rating: { [Op.not]: null } }
      })
    ]);

    // Review statistics
    const reviewStats = await Promise.all([
      Review.count(),
      Review.count({ where: { status: 'approved' } }),
      Review.count({ where: { status: 'pending' } }),
      Review.count({ where: { is_featured: true } }),
      Review.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']
        ],
        where: { status: 'approved' }
      }),
      Review.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } })
    ]);

    // Gallery statistics
    const galleryStats = await Promise.all([
      Gallery.count(),
      Gallery.count({ where: { status: 'approved' } }),
      Gallery.count({ where: { status: 'pending' } }),
      Gallery.count({ where: { is_featured: true } }),
      Gallery.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('view_count')), 'total_views'],
          [sequelize.fn('SUM', sequelize.col('like_count')), 'total_likes']
        ]
      }),
      Gallery.count({ where: { created_at: { [Op.gte]: thirtyDaysAgo } } })
    ]);

    // Top categories and styles
    const [topCategories, topStyles] = await Promise.all([
      Gallery.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('gallery_id')), 'count']
        ],
        where: { status: 'approved' },
        group: ['category'],
        order: [[sequelize.fn('COUNT', sequelize.col('gallery_id')), 'DESC']],
        limit: 5
      }),
      Gallery.findAll({
        attributes: [
          'style',
          [sequelize.fn('COUNT', sequelize.col('gallery_id')), 'count']
        ],
        where: { status: 'approved' },
        group: ['style'],
        order: [[sequelize.fn('COUNT', sequelize.col('gallery_id')), 'DESC']],
        limit: 5
      })
    ]);

    // Most active users (by projects and consultations)
    const mostActiveClients = await User.findAll({
      attributes: [
        'user_id',
        'username',
        [sequelize.fn('COUNT', sequelize.col('clientProjects.project_id')), 'project_count']
      ],
      include: [{
        model: Project,
        as: 'clientProjects',
        attributes: []
      }],
      group: ['User.user_id'],
      order: [[sequelize.fn('COUNT', sequelize.col('clientProjects.project_id')), 'DESC']],
      limit: 5
    });

    const mostActiveDesigners = await User.findAll({
      attributes: [
        'user_id',
        'username',
        [sequelize.fn('COUNT', sequelize.col('designerProjects.project_id')), 'project_count']
      ],
      include: [{
        model: Project,
        as: 'designerProjects',
        attributes: []
      }],
      where: { role: 'designer' },
      group: ['User.user_id'],
      order: [[sequelize.fn('COUNT', sequelize.col('designerProjects.project_id')), 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        users: {
          total: userStats[0],
          clients: userStats[1],
          designers: userStats[2],
          pending_designers: userStats[3],
          active: userStats[4],
          verified: userStats[5],
          new_this_month: userStats[6],
          new_this_week: userStats[7],
          new_today: userStats[8]
        },
        projects: {
          total: projectStats[0],
          completed: projectStats[1],
          in_progress: projectStats[2],
          cancelled: projectStats[3],
          new_this_month: projectStats[4],
          unassigned: projectStats[5],
          avg_completion: parseFloat(projectStats[6]?.dataValues?.avg_completion || 0)
        },
        consultations: {
          total: consultationStats[0],
          completed: consultationStats[1],
          confirmed: consultationStats[2],
          cancelled: consultationStats[3],
          new_this_month: consultationStats[4],
          avg_rating: parseFloat(consultationStats[5]?.dataValues?.avg_rating || 0)
        },
        reviews: {
          total: reviewStats[0],
          approved: reviewStats[1],
          pending: reviewStats[2],
          featured: reviewStats[3],
          avg_rating: parseFloat(reviewStats[4]?.dataValues?.avg_rating || 0),
          new_this_month: reviewStats[5]
        },
        gallery: {
          total: galleryStats[0],
          approved: galleryStats[1],
          pending: galleryStats[2],
          featured: galleryStats[3],
          total_views: parseInt(galleryStats[4]?.dataValues?.total_views || 0),
          total_likes: parseInt(galleryStats[4]?.dataValues?.total_likes || 0),
          new_this_month: galleryStats[5]
        },
        trends: {
          top_categories: topCategories.map(cat => ({
            category: cat.category,
            count: parseInt(cat.dataValues.count)
          })),
          top_styles: topStyles.map(style => ({
            style: style.style,
            count: parseInt(style.dataValues.count)
          })),
          most_active_clients: mostActiveClients.map(user => ({
            user_id: user.user_id,
            username: user.username,
            project_count: parseInt(user.dataValues.project_count)
          })),
          most_active_designers: mostActiveDesigners.map(user => ({
            user_id: user.user_id,
            username: user.username,
            project_count: parseInt(user.dataValues.project_count)
          }))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics',
      error: error.message
    });
  }
};

/**
 * Get user-specific dashboard statistics
 */
const getUserDashboard = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    let dashboardData = {
      user: {
        id: user_id,
        role: role
      }
    };

    if (role === 'user' || role === 'admin') {
      // Client dashboard
      const [projectStats, consultationStats, reviewStats] = await Promise.all([
        Promise.all([
          Project.count({ where: { client_id: user_id } }),
          Project.count({ where: { client_id: user_id, status: 'completed' } }),
          Project.count({ where: { client_id: user_id, status: 'in_progress' } }),
          Project.count({ where: { client_id: user_id, created_at: { [Op.gte]: thirtyDaysAgo } } })
        ]),
        Promise.all([
          Consultation.count({ where: { client_id: user_id } }),
          Consultation.count({ where: { client_id: user_id, status: 'completed' } }),
          Consultation.count({ where: { client_id: user_id, status: 'confirmed' } }),
          Consultation.count({ where: { client_id: user_id, created_at: { [Op.gte]: thirtyDaysAgo } } })
        ]),
        Promise.all([
          Review.count({ where: { reviewer_id: user_id } }),
          Review.count({ where: { reviewee_id: user_id } }),
          Review.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
            where: { reviewee_id: user_id, status: 'approved' }
          })
        ])
      ]);

      dashboardData.client = {
        projects: {
          total: projectStats[0],
          completed: projectStats[1],
          in_progress: projectStats[2],
          new_this_month: projectStats[3]
        },
        consultations: {
          total: consultationStats[0],
          completed: consultationStats[1],
          confirmed: consultationStats[2],
          new_this_month: consultationStats[3]
        },
        reviews: {
          given: reviewStats[0],
          received: reviewStats[1],
          avg_rating: parseFloat(reviewStats[2]?.dataValues?.avg_rating || 0)
        }
      };
    }

    if (role === 'designer' || role === 'admin') {
      // Designer dashboard
      const [designerProjectStats, designerConsultationStats, designerReviewStats, galleryStats] = await Promise.all([
        Promise.all([
          Project.count({ where: { designer_id: user_id } }),
          Project.count({ where: { designer_id: user_id, status: 'completed' } }),
          Project.count({ where: { designer_id: user_id, status: 'in_progress' } }),
          Project.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('completion_percentage')), 'avg_completion']],
            where: { designer_id: user_id }
          })
        ]),
        Promise.all([
          Consultation.count({ where: { designer_id: user_id } }),
          Consultation.count({ where: { designer_id: user_id, status: 'completed' } }),
          Consultation.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
            where: { designer_id: user_id, rating: { [Op.not]: null } }
          })
        ]),
        Review.findOne({
          attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']],
          where: { reviewee_id: user_id, status: 'approved' }
        }),
        Promise.all([
          Gallery.count({ where: { uploaded_by: user_id } }),
          Gallery.count({ where: { uploaded_by: user_id, status: 'approved' } }),
          Gallery.findOne({
            attributes: [
              [sequelize.fn('SUM', sequelize.col('view_count')), 'total_views'],
              [sequelize.fn('SUM', sequelize.col('like_count')), 'total_likes']
            ],
            where: { uploaded_by: user_id }
          })
        ])
      ]);

      dashboardData.designer = {
        projects: {
          total: designerProjectStats[0],
          completed: designerProjectStats[1],
          in_progress: designerProjectStats[2],
          avg_completion: parseFloat(designerProjectStats[3]?.dataValues?.avg_completion || 0)
        },
        consultations: {
          total: designerConsultationStats[0],
          completed: designerConsultationStats[1],
          avg_rating: parseFloat(designerConsultationStats[2]?.dataValues?.avg_rating || 0)
        },
        reviews: {
          avg_rating: parseFloat(designerReviewStats?.dataValues?.avg_rating || 0)
        },
        gallery: {
          total_uploads: galleryStats[0],
          approved_uploads: galleryStats[1],
          total_views: parseInt(galleryStats[2]?.dataValues?.total_views || 0),
          total_likes: parseInt(galleryStats[2]?.dataValues?.total_likes || 0)
        }
      };
    }

    // Get recent notifications
    const recentNotifications = await Notification.findAll({
      where: { user_id: user_id, is_archived: false },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['notification_id', 'title', 'message', 'type', 'is_read', 'created_at']
    });

    dashboardData.notifications = {
      recent: recentNotifications,
      unread_count: await Notification.getUnreadCount(user_id)
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Get analytics data for charts and graphs
 */
const getAnalytics = async (req, res) => {
  try {
    const { period = '30', type = 'overview' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let analyticsData = {};

    if (type === 'overview' || type === 'users') {
      // User registration trends
      const userTrends = await User.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('user_id')), 'count']
        ],
        where: { created_at: { [Op.gte]: startDate } },
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      });

      analyticsData.user_trends = userTrends.map(trend => ({
        date: trend.dataValues.date,
        count: parseInt(trend.dataValues.count)
      }));
    }

    if (type === 'overview' || type === 'projects') {
      // Project creation trends
      const projectTrends = await Project.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('project_id')), 'count']
        ],
        where: { created_at: { [Op.gte]: startDate } },
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      });

      // Project status distribution
      const projectStatusDistribution = await Project.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('project_id')), 'count']
        ],
        group: ['status'],
        order: [[sequelize.fn('COUNT', sequelize.col('project_id')), 'DESC']]
      });

      analyticsData.project_trends = projectTrends.map(trend => ({
        date: trend.dataValues.date,
        count: parseInt(trend.dataValues.count)
      }));

      analyticsData.project_status_distribution = projectStatusDistribution.map(status => ({
        status: status.status,
        count: parseInt(status.dataValues.count)
      }));
    }

    if (type === 'overview' || type === 'gallery') {
      // Gallery upload trends
      const galleryTrends = await Gallery.findAll({
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('gallery_id')), 'count']
        ],
        where: { created_at: { [Op.gte]: startDate } },
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      });

      analyticsData.gallery_trends = galleryTrends.map(trend => ({
        date: trend.dataValues.date,
        count: parseInt(trend.dataValues.count)
      }));
    }

    res.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
};

module.exports = {
  getPlatformStats,
  getUserDashboard,
  getAnalytics
};