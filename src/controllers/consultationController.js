const Consultation = require('../models/Consultation');
const User = require('../models/User');
const {
  sendConsultationBookingEmail,
  sendConsultationStatusEmail,
  sendConsultationReminderEmail
} = require('../services/emailService');
const { Op } = require('sequelize');

/**
 * Get all consultations for a user (client or designer)
 */
const getConsultations = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    const { status, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filter by role
    if (role === 'designer') {
      whereClause.designer_id = user_id;
    } else {
      whereClause.client_id = user_id;
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    const consultations = await Consultation.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number']
          }]
        },
        {
          model: User,
          as: 'designer',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number']
          }]
        }
      ],
      order: [['scheduled_date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        consultations: consultations.rows,
        pagination: {
          total: consultations.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(consultations.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations',
      error: error.message
    });
  }
};

/**
 * Get a specific consultation by ID
 */
const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.user;

    const consultation = await Consultation.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number']
          }]
        },
        {
          model: User,
          as: 'designer',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname', 'contact_number']
          }]
        }
      ]
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Check if user has access to this consultation
    const hasAccess = (role === 'designer' && consultation.designer_id === user_id) ||
                     (role !== 'designer' && consultation.client_id === user_id) ||
                     role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation',
      error: error.message
    });
  }
};

/**
 * Create a new consultation booking
 */
const createConsultation = async (req, res) => {
  try {
    const { user_id } = req.user;
    const {
      designer_id,
      title,
      description,
      consultation_type,
      meeting_type,
      scheduled_date,
      duration_minutes,
      client_requirements,
      budget_discussed
    } = req.body;

    // Validate required fields
    if (!title || !scheduled_date) {
      return res.status(400).json({
        success: false,
        message: 'Title and scheduled date are required'
      });
    }

    // Check if designer exists and is active
    if (designer_id) {
      const designer = await User.findByPk(designer_id);
      if (!designer || designer.role !== 'designer' || !designer.is_active) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or inactive designer'
        });
      }
    }

    // Check for scheduling conflicts
    const scheduledDateTime = new Date(scheduled_date);
    const endTime = new Date(scheduledDateTime.getTime() + (duration_minutes || 60) * 60000);

    if (designer_id) {
      const conflictingConsultation = await Consultation.findOne({
        where: {
          designer_id,
          status: ['confirmed', 'rescheduled'],
          scheduled_date: {
            [Op.between]: [
              new Date(scheduledDateTime.getTime() - 60 * 60000), // 1 hour buffer
              endTime
            ]
          }
        }
      });

      if (conflictingConsultation) {
        return res.status(409).json({
          success: false,
          message: 'Designer is not available at the selected time'
        });
      }
    }

    // Create consultation
    const consultation = await Consultation.create({
      client_id: user_id,
      designer_id: designer_id || null,
      title,
      description,
      consultation_type: consultation_type || 'initial_consultation',
      meeting_type: meeting_type || 'video_call',
      scheduled_date: scheduledDateTime,
      duration_minutes: duration_minutes || 60,
      client_requirements,
      budget_discussed,
      status: designer_id ? 'requested' : 'requested'
    });

    // Send notification emails
    try {
      const client = await User.findByPk(user_id, {
        include: [{
          model: require('../models/UserDetails'),
          as: 'profile'
        }]
      });

      if (designer_id) {
        const designer = await User.findByPk(designer_id, {
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile'
          }]
        });

        // Send emails to both client and designer
        await sendConsultationRequestEmail(client, designer, consultation);
      } else {
        // Send confirmation to client for general request
        await sendConsultationConfirmationEmail(client, consultation);
      }
    } catch (emailError) {
      console.error('Error sending notification emails:', emailError);
      // Don't fail the request if email fails
    }

    // Fetch the created consultation with associations
    const createdConsultation = await Consultation.findByPk(consultation.consultation_id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        },
        {
          model: User,
          as: 'designer',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      data: createdConsultation
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create consultation',
      error: error.message
    });
  }
};

/**
 * Update consultation status or details
 */
const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.user;
    const updates = req.body;

    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Check permissions
    const canUpdate = (role === 'designer' && consultation.designer_id === user_id) ||
                     (role !== 'designer' && consultation.client_id === user_id) ||
                     role === 'admin';

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Handle status updates with business logic
    if (updates.status) {
      switch (updates.status) {
        case 'confirmed':
          if (role !== 'designer' && role !== 'admin') {
            return res.status(403).json({
              success: false,
              message: 'Only designers can confirm consultations'
            });
          }
          break;
        case 'cancelled':
          // Anyone involved can cancel
          break;
        case 'completed':
          if (role !== 'designer' && role !== 'admin') {
            return res.status(403).json({
              success: false,
              message: 'Only designers can mark consultations as completed'
            });
          }
          break;
      }
    }

    // Update consultation
    await consultation.update(updates);

    // Send notification emails for status changes
    try {
      if (updates.status && ['confirmed', 'cancelled', 'rescheduled'].includes(updates.status)) {
        const client = await User.findByPk(consultation.client_id, {
          include: [{ model: require('../models/UserDetails'), as: 'profile' }]
        });
        const designer = consultation.designer_id ? await User.findByPk(consultation.designer_id, {
          include: [{ model: require('../models/UserDetails'), as: 'profile' }]
        }) : null;

        await sendConsultationStatusUpdateEmail(client, designer, consultation, updates.status);
      }
    } catch (emailError) {
      console.error('Error sending status update emails:', emailError);
    }

    // Fetch updated consultation
    const updatedConsultation = await Consultation.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        },
        {
          model: User,
          as: 'designer',
          attributes: ['user_id', 'username', 'email'],
          include: [{
            model: require('../models/UserDetails'),
            as: 'profile',
            attributes: ['firstname', 'lastname']
          }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: updatedConsultation
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation',
      error: error.message
    });
  }
};

/**
 * Delete/Cancel a consultation
 */
const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.user;

    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Check permissions
    const canDelete = (consultation.client_id === user_id) ||
                     (role === 'designer' && consultation.designer_id === user_id) ||
                     role === 'admin';

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Instead of deleting, mark as cancelled
    await consultation.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Consultation cancelled successfully'
    });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel consultation',
      error: error.message
    });
  }
};

/**
 * Get available designers
 */
const getAvailableDesigners = async (req, res) => {
  try {
    const { specialization, date, duration = 60 } = req.query;

    const whereClause = {
      role: 'designer',
      is_active: true,
      email_verified: true
    };

    const designers = await User.findAll({
      where: whereClause,
      attributes: ['user_id', 'username', 'email', 'created_at'],
      include: [{
        model: require('../models/UserDetails'),
        as: 'profile',
        attributes: ['firstname', 'lastname'],
        where: {}
      }]
    });

    // If date is provided, filter out unavailable designers
    if (date) {
      const requestedDate = new Date(date);
      const endTime = new Date(requestedDate.getTime() + duration * 60000);

      const availableDesigners = [];

      for (const designer of designers) {
        const conflictingConsultation = await Consultation.findOne({
          where: {
            designer_id: designer.user_id,
            status: ['confirmed', 'rescheduled'],
            scheduled_date: {
              [Op.between]: [
                new Date(requestedDate.getTime() - 60 * 60000), // 1 hour buffer
                endTime
              ]
            }
          }
        });

        if (!conflictingConsultation) {
          // Get designer's rating
          const ratings = await Consultation.findAll({
            where: {
              designer_id: designer.user_id,
              rating: { [Op.not]: null }
            },
            attributes: ['rating']
          });

          const avgRating = ratings.length > 0 
            ? ratings.reduce((sum, r) => sum + parseFloat(r.rating), 0) / ratings.length 
            : 0;

          const consultationCount = await Consultation.count({
            where: {
              designer_id: designer.user_id,
              status: 'completed'
            }
          });

          availableDesigners.push({
            ...designer.toJSON(),
            avgRating: Math.round(avgRating * 10) / 10,
            consultationCount
          });
        }
      }

      return res.json({
        success: true,
        data: availableDesigners
      });
    }

    // If no date filter, return all designers with their stats
    const designersWithStats = await Promise.all(
      designers.map(async (designer) => {
        const ratings = await Consultation.findAll({
          where: {
            designer_id: designer.user_id,
            rating: { [Op.not]: null }
          },
          attributes: ['rating']
        });

        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + parseFloat(r.rating), 0) / ratings.length 
          : 0;

        const consultationCount = await Consultation.count({
          where: {
            designer_id: designer.user_id,
            status: 'completed'
          }
        });

        return {
          ...designer.toJSON(),
          avgRating: Math.round(avgRating * 10) / 10,
          consultationCount
        };
      })
    );

    res.json({
      success: true,
      data: designersWithStats
    });
  } catch (error) {
    console.error('Error fetching available designers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available designers',
      error: error.message
    });
  }
};

/**
 * Get designer's availability for a specific date range
 */
const getDesignerAvailability = async (req, res) => {
  try {
    const { designerId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const bookedSlots = await Consultation.findAll({
      where: {
        designer_id: designerId,
        status: ['confirmed', 'rescheduled'],
        scheduled_date: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      attributes: ['scheduled_date', 'duration_minutes']
    });

    res.json({
      success: true,
      data: {
        bookedSlots: bookedSlots.map(slot => ({
          start: slot.scheduled_date,
          end: new Date(slot.scheduled_date.getTime() + slot.duration_minutes * 60000)
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching designer availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch designer availability',
      error: error.message
    });
  }
};

/**
 * Add rating and feedback to a completed consultation
 */
const rateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Only client can rate and only completed consultations
    if (consultation.client_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the client can rate this consultation'
      });
    }

    if (consultation.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed consultations'
      });
    }

    if (consultation.rating) {
      return res.status(400).json({
        success: false,
        message: 'This consultation has already been rated'
      });
    }

    await consultation.update({ rating, feedback });

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Error rating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: error.message
    });
  }
};

// Email notification functions
const sendConsultationRequestEmail = async (client, designer, consultation) => {
  return await sendConsultationBookingEmail(client, designer, consultation);
};

const sendConsultationConfirmationEmail = async (client, consultation) => {
  return await sendConsultationBookingEmail(client, null, consultation);
};

const sendConsultationStatusUpdateEmail = async (client, designer, consultation, status) => {
  return await sendConsultationStatusEmail(client, designer, consultation, status);
};

module.exports = {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getAvailableDesigners,
  getDesignerAvailability,
  rateConsultation
};
