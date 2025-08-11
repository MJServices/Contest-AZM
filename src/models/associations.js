const User = require('./User');
const UserDetails = require('./UserDetails');

/**
 * Define model associations
 * This file establishes relationships between different models
 */

// User and UserDetails association (One-to-One)
User.hasOne(UserDetails, {
  foreignKey: 'user_id',
  as: 'details',
  onDelete: 'CASCADE'
});

UserDetails.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

console.log('✅ Model associations established successfully');

module.exports = {
  User,
  UserDetails
};