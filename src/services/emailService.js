const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send email verification email
 * @param {String} email - Recipient email
 * @param {String} token - Verification token
 * @param {String} firstName - User's first name
 */
const sendVerificationEmail = async (email, token, firstName) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your DecorVista Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to DecorVista!</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Thank you for registering with DecorVista, your premier destination for home interior design inspiration and professional consultation services.</p>
              <p>To complete your registration and start exploring our amazing features, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p><strong>This verification link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with DecorVista, please ignore this email.</p>
              <p>Best regards,<br>The DecorVista Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 DecorVista. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {String} email - Recipient email
 * @param {String} token - Reset token
 * @param {String} firstName - User's first name
 */
const sendPasswordResetEmail = async (email, token, firstName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your DecorVista Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>We received a request to reset the password for your DecorVista account.</p>
              <p>If you made this request, click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <div class="warning">
                <p><strong>⚠️ Important Security Information:</strong></p>
                <ul>
                  <li>This password reset link will expire in 1 hour</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>Your password will remain unchanged until you create a new one</li>
                </ul>
              </div>
              <p>For security reasons, we recommend choosing a strong password that includes:</p>
              <ul>
                <li>At least 8 characters</li>
                <li>A mix of uppercase and lowercase letters</li>
                <li>At least one number</li>
                <li>Special characters</li>
              </ul>
              <p>If you have any questions or concerns, please contact our support team.</p>
              <p>Best regards,<br>The DecorVista Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 DecorVista. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send welcome email to new users
 * @param {String} email - Recipient email
 * @param {String} firstName - User's first name
 * @param {String} role - User's role
 */
const sendWelcomeEmail = async (email, firstName, role) => {
  try {
    const transporter = createTransporter();
    
    const isDesigner = role === 'designer';
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to DecorVista${isDesigner ? ' - Designer Account' : ''}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DecorVista</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to DecorVista!</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Congratulations! Your ${isDesigner ? 'designer' : 'user'} account has been successfully verified and activated.</p>
              
              ${isDesigner ? `
                <p>As a professional interior designer on DecorVista, you now have access to:</p>
                <div class="feature">
                  <h3>🏠 Professional Profile</h3>
                  <p>Showcase your portfolio, experience, and specializations to attract potential clients.</p>
                </div>
                <div class="feature">
                  <h3>📅 Consultation Management</h3>
                  <p>Set your availability and manage client bookings seamlessly.</p>
                </div>
                <div class="feature">
                  <h3>⭐ Client Reviews</h3>
                  <p>Build your reputation with client feedback and ratings.</p>
                </div>
                <div class="feature">
                  <h3>💼 Business Dashboard</h3>
                  <p>Track your consultations, earnings, and client interactions.</p>
                </div>
              ` : `
                <p>You now have access to all DecorVista features:</p>
                <div class="feature">
                  <h3>🎨 Inspiration Gallery</h3>
                  <p>Browse thousands of interior design ideas and save your favorites.</p>
                </div>
                <div class="feature">
                  <h3>🛋️ Product Catalog</h3>
                  <p>Discover furniture and decor items from top brands and retailers.</p>
                </div>
                <div class="feature">
                  <h3>👨‍🎨 Professional Consultations</h3>
                  <p>Book consultations with verified interior designers.</p>
                </div>
                <div class="feature">
                  <h3>🛒 Shopping Cart</h3>
                  <p>Save products and get direct links to purchase from retailers.</p>
                </div>
              `}
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
              </div>
              
              <p>If you have any questions or need assistance, our support team is here to help.</p>
              <p>Happy decorating!</p>
              <p>Best regards,<br>The DecorVista Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 DecorVista. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send consultation booking confirmation email
 * @param {Object} client - Client user object
 * @param {Object} designer - Designer user object (optional)
 * @param {Object} consultation - Consultation object
 */
const sendConsultationBookingEmail = async (client, designer, consultation) => {
  try {
    const transporter = createTransporter();
    
    const clientName = client.profile?.firstname || client.username;
    const designerName = designer ? (designer.profile?.firstname || designer.username) : 'Available Designer';
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: client.email,
      subject: 'Consultation Booking Confirmation - DecorVista',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Consultation Booked!</h1>
            </div>
            <div class="content">
              <h2>Hello ${clientName},</h2>
              <p>Your consultation has been successfully booked with DecorVista!</p>
              
              <div class="booking-details">
                <h3>📅 Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Consultation Title:</span>
                  <span class="detail-value">${consultation.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Designer:</span>
                  <span class="detail-value">${designerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time:</span>
                  <span class="detail-value">${new Date(consultation.scheduled_date).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">${consultation.duration_minutes} minutes</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Meeting Type:</span>
                  <span class="detail-value">${consultation.meeting_type.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">${consultation.status.toUpperCase()}</span>
                </div>
              </div>
              
              ${consultation.description ? `<p><strong>Description:</strong> ${consultation.description}</p>` : ''}
              
              <p>You will receive a confirmation email once the designer accepts your booking request.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/consultations/${consultation.consultation_id}" class="button">View Consultation</a>
              </div>
              
              <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
              <p>Best regards,<br>The DecorVista Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 DecorVista. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Consultation booking email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending consultation booking email:', error);
    throw error;
  }
};

/**
 * Send consultation status update email
 * @param {Object} client - Client user object
 * @param {Object} designer - Designer user object
 * @param {Object} consultation - Consultation object
 * @param {String} status - New status
 */
const sendConsultationStatusEmail = async (client, designer, consultation, status) => {
  try {
    const transporter = createTransporter();
    
    const clientName = client.profile?.firstname || client.username;
    const designerName = designer ? (designer.profile?.firstname || designer.username) : 'Designer';
    
    let statusMessage = '';
    let statusColor = '#667eea';
    
    switch (status) {
      case 'confirmed':
        statusMessage = 'Your consultation has been confirmed!';
        statusColor = '#10b981';
        break;
      case 'cancelled':
        statusMessage = 'Your consultation has been cancelled.';
        statusColor = '#ef4444';
        break;
      case 'rescheduled':
        statusMessage = 'Your consultation has been rescheduled.';
        statusColor = '#f59e0b';
        break;
      case 'completed':
        statusMessage = 'Your consultation has been completed.';
        statusColor = '#8b5cf6';
        break;
      default:
        statusMessage = `Your consultation status has been updated to ${status}.`;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: client.email,
      subject: `Consultation Update - ${status.toUpperCase()} - DecorVista`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${statusColor} 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${statusColor}; }
            .button { display: inline-block; background: ${statusColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Consultation Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${clientName},</h2>
              <p>${statusMessage}</p>
              
              <div class="status-badge">${status.toUpperCase()}</div>
              
              <div class="booking-details">
                <h3>Consultation Details</h3>
                <p><strong>Title:</strong> ${consultation.title}</p>
                <p><strong>Designer:</strong> ${designerName}</p>
                <p><strong>Date & Time:</strong> ${new Date(consultation.scheduled_date).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${consultation.duration_minutes} minutes</p>
                <p><strong>Meeting Type:</strong> ${consultation.meeting_type.replace('_', ' ').toUpperCase()}</p>
              </div>
              
              ${status === 'confirmed' ? `
                <p>🎉 Great news! Your consultation has been confirmed. Please make sure to be available at the scheduled time.</p>
                ${consultation.meeting_type === 'video_call' ? '<p>You will receive the video call link closer to the appointment time.</p>' : ''}
              ` : ''}
              
              ${status === 'cancelled' ? `
                <p>We're sorry that your consultation had to be cancelled. You can book a new consultation anytime.</p>
              ` : ''}
              
              ${status === 'completed' ? `
                <p>Thank you for choosing DecorVista! We hope you had a great consultation experience.</p>
                <p>Don't forget to rate your experience and provide feedback.</p>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/consultations/${consultation.consultation_id}" class="button">View Consultation</a>
              </div>
              
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>The DecorVista Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 DecorVista. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Consultation status email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending consultation status email:', error);
    throw error;
  }
};

/**
 * Send consultation reminder email
 * @param {Object} client - Client user object
 * @param {Object} designer - Designer user object
 * @param {Object} consultation - Consultation object
 */
const sendConsultationReminderEmail = async (client, designer, consultation) => {
  try {
    const transporter = createTransporter();
    
    const clientName = client.profile?.firstname || client.username;
    const designerName = designer ? (designer.profile?.firstname || designer.username) : 'Designer';
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: client.email,
      subject: 'Consultation Reminder - Tomorrow - DecorVista',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f59e0b; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Consultation Reminder</h1>
            </div>
            <div class="content">
              <h2>Hello ${clientName},</h2>
              
              <div class="reminder-box">
                <h3>🗓️ Your consultation is tomorrow!</h3>
                <p>Don't forget about your upcoming consultation with ${designerName}</p>
              </div>
              
              <div class="booking-details">
                <h3>Consultation Details</h3>
                <p><strong>Title:</strong> ${consultation.title}</p>
                <p><strong>Designer:</strong> ${designerName}</p>
                <p><strong>Date & Time:</strong> ${new Date(consultation.scheduled_date).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${consultation.duration_minutes} minutes</p>
                <p><strong>Meeting Type:</strong> ${consultation.meeting_type.replace('_', ' ').toUpperCase()}</p>
              </div>
              
              <h3>📝 Preparation Tips:</h3>
              <ul>
                <li>Prepare any questions you'd like to discuss</li>
                <li>Gather inspiration images or ideas</li>
                <li>Have your budget and timeline ready</li>
                ${consultation.meeting_type === 'video_call' ? '<li>Test your camera and microphone</li>' : ''}
                ${consultation.meeting_type === 'in_person' ? '<li>Confirm the meeting location</li>' : ''}
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/consultations/${consultation.consultation_id}" class="button">View Consultation</a>
              </div>
              
              <p>If you need to reschedule or cancel, please do so as soon as possible.</p>
              <p>Looking forward to your consultation!</p>
              <p>Best regards,<br>The DecorVista Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 DecorVista. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Consultation reminder email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending consultation reminder email:', error);
    throw error;
  }
};

/**
 * Test email configuration
 */
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendConsultationBookingEmail,
  sendConsultationStatusEmail,
  sendConsultationReminderEmail,
  testEmailConfig
};