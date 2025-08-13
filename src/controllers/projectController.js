const Project = require('../models/Project');
const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const Notification = require('../models/Notification');
const { Op } = require('sequelize');

/**
 * Get all projects with filtering and pagination
 */
const getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      style_preference,
      client_id,
      designer_id,
      priority,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (style_preference) whereClause.style_preference = style_preference;
    if (client_id) whereClause.client_id = client_id;
    if (designer_id) whereClause.designer_id = designer_id;
    if (priority) whereClause.priority = priority;

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { requirements: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Role-based access control
    if (req.user.role === 'user') {
      whereClause.client_id = req.user.user_id;
    } else if (req.user.role === 'designer') {
      whereClause[Op.or] = [
        { designer_id: req.user.user_id },
        { designer_id: null, status: ['submitted', 'in_review'] } // Can see unassigned projects
      ];
    }
    // Admin can see all projects

    const projects = await Project.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number', 'profile_image']
          }]
        },
        {
          model: User,
          as: 'designer',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number', 'profile_image']
          }]
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
        projects: projects.rows,
        pagination: {
          total: projects.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(projects.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

/**
 * Get a specific project by ID
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number', 'profile_image']
          }]
        },
        {
          model: User,
          as: 'designer',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number', 'profile_image']
          }]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check access permissions
    const hasAccess = req.user.role === 'admin' ||
                     project.client_id === req.user.user_id ||
                     project.designer_id === req.user.user_id ||
                     (req.user.role === 'designer' && !project.designer_id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      style_preference,
      budget_min,
      budget_max,
      timeline_start,
      timeline_end,
      priority = 'medium',
      room_dimensions,
      requirements,
      inspiration_images,
      notes
    } = req.body;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    // Validate budget range
    if (budget_min && budget_max && parseFloat(budget_min) > parseFloat(budget_max)) {
      return res.status(400).json({
        success: false,
        message: 'Minimum budget cannot be greater than maximum budget'
      });
    }

    // Validate timeline
    if (timeline_start && timeline_end && new Date(timeline_start) > new Date(timeline_end)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date'
      });
    }

    // Create project
    const project = await Project.create({
      title,
      description,
      client_id: req.user.user_id,
      category,
      style_preference,
      budget_min: budget_min ? parseFloat(budget_min) : null,
      budget_max: budget_max ? parseFloat(budget_max) : null,
      timeline_start: timeline_start ? new Date(timeline_start) : null,
      timeline_end: timeline_end ? new Date(timeline_end) : null,
      priority,
      room_dimensions: room_dimensions ? JSON.parse(room_dimensions) : null,
      requirements,
      inspiration_images: inspiration_images ? JSON.parse(inspiration_images) : null,
      notes,
      status: 'draft'
    });

    // Fetch created project with associations
    const createdProject = await Project.findByPk(project.project_id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: createdProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

/**
 * Update a project
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const canUpdate = req.user.role === 'admin' ||
                     project.client_id === req.user.user_id ||
                     project.designer_id === req.user.user_id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate budget range if provided
    if (updates.budget_min && updates.budget_max && 
        parseFloat(updates.budget_min) > parseFloat(updates.budget_max)) {
      return res.status(400).json({
        success: false,
        message: 'Minimum budget cannot be greater than maximum budget'
      });
    }

    // Parse JSON fields if provided
    if (updates.room_dimensions && typeof updates.room_dimensions === 'string') {
      updates.room_dimensions = JSON.parse(updates.room_dimensions);
    }
    if (updates.inspiration_images && typeof updates.inspiration_images === 'string') {
      updates.inspiration_images = JSON.parse(updates.inspiration_images);
    }
    if (updates.design_files && typeof updates.design_files === 'string') {
      updates.design_files = JSON.parse(updates.design_files);
    }

    // Handle status changes with notifications
    if (updates.status && updates.status !== project.status) {
      await handleStatusChange(project, updates.status, req.user);
    }

    await project.update(updates);

    // Fetch updated project
    const updatedProject = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        },
        {
          model: User,
          as: 'designer',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: UserDetails,
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

/**
 * Delete a project
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only client or admin can delete
    if (project.client_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner or admin can delete this project'
      });
    }

    // Don't allow deletion of active projects
    if (['in_progress', 'design_review', 'approved'].includes(project.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active projects. Cancel the project first.'
      });
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

/**
 * Assign designer to project (admin or designer self-assignment)
 */
const assignDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const { designer_id } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const canAssign = req.user.role === 'admin' ||
                     (req.user.role === 'designer' && req.user.user_id === designer_id);

    if (!canAssign) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate designer
    if (designer_id) {
      const designer = await User.findByPk(designer_id);
      if (!designer || designer.role !== 'designer') {
        return res.status(400).json({
          success: false,
          message: 'Invalid designer'
        });
      }
    }

    // Check if project is available for assignment
    if (!['submitted', 'in_review'].includes(project.status)) {
      return res.status(400).json({
        success: false,
        message: 'Project is not available for assignment'
      });
    }

    await project.assignDesigner(designer_id);

    // Create notification for client
    await Notification.createNotification({
      user_id: project.client_id,
      sender_id: designer_id,
      type: 'project_assigned',
      title: 'Designer Assigned to Your Project',
      message: `A designer has been assigned to your project "${project.title}"`,
      related_id: project.project_id,
      related_type: 'project',
      action_url: `/projects/${project.project_id}`,
      delivery_method: ['in_app', 'email']
    });

    res.json({
      success: true,
      message: 'Designer assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning designer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign designer',
      error: error.message
    });
  }
};

/**
 * Submit project for review
 */
const submitProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only client can submit
    if (project.client_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can submit for review'
      });
    }

    if (project.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft projects can be submitted'
      });
    }

    await project.updateStatus('submitted');

    // Notify admins about new project submission
    const admins = await User.findAll({ where: { role: 'admin' } });
    const notifications = admins.map(admin => ({
      user_id: admin.user_id,
      sender_id: req.user.user_id,
      type: 'project_update',
      title: 'New Project Submitted',
      message: `A new project "${project.title}" has been submitted for review`,
      related_id: project.project_id,
      related_type: 'project',
      action_url: `/admin/projects/${project.project_id}`,
      delivery_method: ['in_app']
    }));

    await Notification.createBulkNotifications(
      admins.map(admin => admin.user_id),
      notifications[0]
    );

    res.json({
      success: true,
      message: 'Project submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit project',
      error: error.message
    });
  }
};

/**
 * Get unassigned projects (for designers)
 */
const getUnassignedProjects = async (req, res) => {
  try {
    if (req.user.role !== 'designer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only designers and admins can view unassigned projects'
      });
    }

    const projects = await Project.findUnassigned();

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching unassigned projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unassigned projects',
      error: error.message
    });
  }
};

/**
 * Get project statistics
 */
const getProjectStats = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    let whereClause = {};

    // Filter by user role
    if (role === 'user') {
      whereClause.client_id = user_id;
    } else if (role === 'designer') {
      whereClause.designer_id = user_id;
    }
    // Admin sees all projects

    const stats = await Promise.all([
      Project.count({ where: { ...whereClause, status: 'draft' } }),
      Project.count({ where: { ...whereClause, status: 'submitted' } }),
      Project.count({ where: { ...whereClause, status: 'in_progress' } }),
      Project.count({ where: { ...whereClause, status: 'completed' } }),
      Project.count({ where: { ...whereClause, status: 'cancelled' } }),
      Project.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        draft: stats[0],
        submitted: stats[1],
        in_progress: stats[2],
        completed: stats[3],
        cancelled: stats[4],
        total: stats[5]
      }
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics',
      error: error.message
    });
  }
};

/**
 * Handle status change notifications
 */
const handleStatusChange = async (project, newStatus, user) => {
  const statusMessages = {
    'submitted': 'Your project has been submitted for review',
    'in_review': 'Your project is now under review',
    'assigned': 'A designer has been assigned to your project',
    'in_progress': 'Work has started on your project',
    'design_review': 'Your project design is ready for review',
    'revision_requested': 'Revisions have been requested for your project',
    'approved': 'Your project design has been approved',
    'completed': 'Your project has been completed',
    'cancelled': 'Your project has been cancelled'
  };

  const message = statusMessages[newStatus];
  if (!message) return;

  // Notify client if status changed by designer/admin
  if (user.user_id !== project.client_id) {
    await Notification.createNotification({
      user_id: project.client_id,
      sender_id: user.user_id,
      type: 'project_update',
      title: 'Project Status Updated',
      message: message,
      related_id: project.project_id,
      related_type: 'project',
      action_url: `/projects/${project.project_id}`,
      delivery_method: ['in_app', 'email']
    });
  }

  // Notify designer if status changed by client/admin
  if (project.designer_id && user.user_id !== project.designer_id) {
    await Notification.createNotification({
      user_id: project.designer_id,
      sender_id: user.user_id,
      type: 'project_update',
      title: 'Project Status Updated',
      message: `Project "${project.title}" status changed to ${newStatus}`,
      related_id: project.project_id,
      related_type: 'project',
      action_url: `/projects/${project.project_id}`,
      delivery_method: ['in_app']
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  assignDesigner,
  submitProject,
  getUnassignedProjects,
  getProjectStats
};