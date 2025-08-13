const express = require('express');
const router = express.Router();

// Import controllers
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  assignDesigner,
  submitProject,
  getUnassignedProjects,
  getProjectStats
} = require('../controllers/projectController');

// Import middleware
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiting configurations
const projectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    success: false,
    message: 'Too many project requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const createProjectLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit project creation
  message: {
    success: false,
    message: 'Too many project creations, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation middleware
const validateProjectCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must not exceed 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  
  body('category')
    .isIn(['living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'office', 'outdoor', 'full_home', 'other'])
    .withMessage('Valid category is required'),
  
  body('style_preference')
    .optional()
    .isIn(['modern', 'contemporary', 'traditional', 'minimalist', 'industrial', 'scandinavian', 'bohemian', 'rustic', 'art_deco', 'mid_century', 'other'])
    .withMessage('Invalid style preference'),
  
  body('budget_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  
  body('budget_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  
  body('timeline_start')
    .optional()
    .isISO8601()
    .withMessage('Timeline start must be a valid date'),
  
  body('timeline_end')
    .optional()
    .isISO8601()
    .withMessage('Timeline end must be a valid date'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Requirements must not exceed 2000 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters')
];

const validateProjectUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must not exceed 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  
  body('category')
    .optional()
    .isIn(['living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'office', 'outdoor', 'full_home', 'other'])
    .withMessage('Invalid category'),
  
  body('style_preference')
    .optional()
    .isIn(['modern', 'contemporary', 'traditional', 'minimalist', 'industrial', 'scandinavian', 'bohemian', 'rustic', 'art_deco', 'mid_century', 'other'])
    .withMessage('Invalid style preference'),
  
  body('status')
    .optional()
    .isIn(['draft', 'submitted', 'in_review', 'assigned', 'in_progress', 'design_review', 'revision_requested', 'approved', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('completion_percentage')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Completion percentage must be between 0 and 100'),
  
  body('budget_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  
  body('budget_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number')
];

const validateDesignerAssignment = [
  body('designer_id')
    .isInt({ min: 1 })
    .withMessage('Valid designer ID is required')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Protected routes (all project routes require authentication)

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects with filtering
 * @access  Private
 */
router.get('/', 
  projectLimiter,
  authenticateToken,
  getProjects
);

/**
 * @route   GET /api/v1/projects/stats
 * @desc    Get project statistics
 * @access  Private
 */
router.get('/stats',
  projectLimiter,
  authenticateToken,
  getProjectStats
);

/**
 * @route   GET /api/v1/projects/unassigned
 * @desc    Get unassigned projects (for designers)
 * @access  Private (Designer/Admin only)
 */
router.get('/unassigned',
  projectLimiter,
  authenticateToken,
  requireRole(['designer', 'admin']),
  getUnassignedProjects
);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', 
  projectLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid project ID is required'),
  handleValidationErrors,
  getProjectById
);

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', 
  createProjectLimiter,
  authenticateToken,
  validateProjectCreation,
  handleValidationErrors,
  createProject
);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put('/:id', 
  projectLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid project ID is required'),
  validateProjectUpdate,
  handleValidationErrors,
  updateProject
);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete a project
 * @access  Private (Owner or Admin only)
 */
router.delete('/:id', 
  projectLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid project ID is required'),
  handleValidationErrors,
  deleteProject
);

/**
 * @route   POST /api/v1/projects/:id/assign
 * @desc    Assign designer to project
 * @access  Private (Designer self-assignment or Admin)
 */
router.post('/:id/assign', 
  projectLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid project ID is required'),
  validateDesignerAssignment,
  handleValidationErrors,
  assignDesigner
);

/**
 * @route   POST /api/v1/projects/:id/submit
 * @desc    Submit project for review
 * @access  Private (Owner only)
 */
router.post('/:id/submit', 
  projectLimiter,
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Valid project ID is required'),
  handleValidationErrors,
  submitProject
);

module.exports = router;