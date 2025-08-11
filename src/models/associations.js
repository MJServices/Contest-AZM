const User = require('./User');
const UserDetails = require('./UserDetails');
const Gallery = require('./Gallery');
const Project = require('./Project');
const Consultation = require('./Consultation');
const Review = require('./Review');
const Notification = require('./Notification');

/**
 * Define model associations
 * This file establishes relationships between different models
 */

// User and UserDetails association (One-to-One)
User.hasOne(UserDetails, {
  foreignKey: 'user_id',
  as: 'profile',
  onDelete: 'CASCADE'
});

UserDetails.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

// Gallery associations
User.hasMany(Gallery, {
  foreignKey: 'uploaded_by',
  as: 'galleryItems',
  onDelete: 'CASCADE'
});

Gallery.belongsTo(User, {
  foreignKey: 'uploaded_by',
  as: 'uploader'
});

// Project associations
User.hasMany(Project, {
  foreignKey: 'client_id',
  as: 'clientProjects',
  onDelete: 'CASCADE'
});

User.hasMany(Project, {
  foreignKey: 'designer_id',
  as: 'designerProjects',
  onDelete: 'SET NULL'
});

Project.belongsTo(User, {
  foreignKey: 'client_id',
  as: 'client'
});

Project.belongsTo(User, {
  foreignKey: 'designer_id',
  as: 'designer'
});

// Consultation associations
User.hasMany(Consultation, {
  foreignKey: 'client_id',
  as: 'clientConsultations',
  onDelete: 'CASCADE'
});

User.hasMany(Consultation, {
  foreignKey: 'designer_id',
  as: 'designerConsultations',
  onDelete: 'SET NULL'
});

Consultation.belongsTo(User, {
  foreignKey: 'client_id',
  as: 'client'
});

Consultation.belongsTo(User, {
  foreignKey: 'designer_id',
  as: 'designer'
});

// Review associations
User.hasMany(Review, {
  foreignKey: 'reviewer_id',
  as: 'givenReviews',
  onDelete: 'CASCADE'
});

User.hasMany(Review, {
  foreignKey: 'reviewee_id',
  as: 'receivedReviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(User, {
  foreignKey: 'reviewer_id',
  as: 'reviewer'
});

Review.belongsTo(User, {
  foreignKey: 'reviewee_id',
  as: 'reviewee'
});

Project.hasMany(Review, {
  foreignKey: 'project_id',
  as: 'reviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project'
});

Consultation.hasMany(Review, {
  foreignKey: 'consultation_id',
  as: 'reviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(Consultation, {
  foreignKey: 'consultation_id',
  as: 'consultation'
});

// Notification associations
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications',
  onDelete: 'CASCADE'
});

User.hasMany(Notification, {
  foreignKey: 'sender_id',
  as: 'sentNotifications',
  onDelete: 'SET NULL'
});

Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'recipient'
});

Notification.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender'
});

console.log('✅ Model associations established successfully');

module.exports = {
  User,
  UserDetails,
  Gallery,
  Project,
  Consultation,
  Review,
  Notification
};