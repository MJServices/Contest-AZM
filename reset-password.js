const User = require('./src/models/User');
const { syncDatabase } = require('./src/config/database');
require('dotenv').config();

async function resetUserPassword() {
  try {
    console.log('🔄 Connecting to database...');
    await syncDatabase(false);
    
    const email = 'mjservices410@gmail.com';
    const newPassword = 'password123'; // You can change this to your desired password
    
    console.log(`🔍 Finding user: ${email}`);
    const user = await User.findByEmail(email);
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('✅ User found, updating password...');
    
    // Update password - the beforeUpdate hook will hash it automatically
    await user.update({
      password_hash: newPassword
    });
    
    console.log('✅ Password updated successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log('');
    console.log('You can now login with these credentials.');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  }
  
  process.exit(0)
  
}

resetUserPassword();