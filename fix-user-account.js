const { testConnection } = require('./src/config/database');
const User = require('./src/models/User');
const UserDetails = require('./src/models/UserDetails');

async function fixUserAccount() {
  try {
    console.log('Connecting to database...');
    await testConnection();
    console.log('✅ Database connected');

    const email = 'mjservices410@gmail.com';
    console.log(`\nChecking user: ${email}`);
    
    let user = await User.findOne({ where: { email } });
    
    if (user) {
      console.log('User found:');
      console.log('- Email:', user.email);
      console.log('- Username:', user.username);
      console.log('- Email Verified:', user.email_verified);
      console.log('- Active:', user.is_active);
      console.log('- Role:', user.role);
      
      // Check if email is not verified
      if (!user.email_verified) {
        console.log('\n🔧 Fixing: Email not verified - setting to verified');
        await user.update({ 
          email_verified: true,
          verification_token: null 
        });
        console.log('✅ Email verification fixed');
      }
      
      // Check if account is not active
      if (!user.is_active) {
        console.log('\n🔧 Fixing: Account not active - activating account');
        await user.update({ is_active: true });
        console.log('✅ Account activation fixed');
      }
      
      // Test password validation with a common password
      const testPassword = 'password123';
      const isValidPassword = await user.validatePassword(testPassword);
      console.log(`\n🔍 Testing password '${testPassword}':`, isValidPassword ? '✅ Valid' : '❌ Invalid');
      
      if (!isValidPassword) {
        console.log('\n🔧 Setting new password: "password123"');
        // Use the model's password hashing by updating with plain text
        await user.update({ password_hash: testPassword });
        console.log('✅ Password updated');
      }
      
    } else {
      console.log('❌ User not found. Creating new user...');
      
      // Create new user
      user = await User.create({
        email: email,
        password_hash: 'password123', // Will be hashed by model hook
        username: 'mjservices410',
        role: 'user',
        email_verified: true,
        is_active: true
      });
      
      // Create user details
      await UserDetails.create({
        user_id: user.user_id,
        firstname: 'MJ',
        lastname: 'Services',
        contact_number: '+1234567890'
      });
      
      console.log('✅ New user created and verified');
    }
    
    console.log('\n🎉 User account is ready for login!');
    console.log(`📧 Email: ${email}`);
    console.log('🔑 Password: password123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUserAccount();