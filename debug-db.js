const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');
const UserDetails = require('./src/models/UserDetails');

async function debugDatabase() {
  try {
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection successful!');
    
    console.log('2. Syncing database tables...');
    await sequelize.sync();
    console.log('✓ Database tables synced!');
    
    console.log('3. Checking users count...');
    const count = await User.count();
    console.log(`✓ Total users in database: ${count}`);
    
    if (count > 0) {
      console.log('4. Listing existing users...');
      const users = await User.findAll({
        attributes: ['user_id', 'email', 'username', 'email_verified', 'is_active']
      });
      users.forEach(user => {
        console.log(`   - ID: ${user.user_id}, Email: ${user.email}, Username: ${user.username}, Verified: ${user.email_verified}, Active: ${user.is_active}`);
      });
    } else {
      console.log('4. No users found. Creating test user...');
      
      // Create a test user with email already verified for testing
      const testUser = await User.create({
        email: 'john.doe@test.com',
        password_hash: 'Password123', // Will be hashed by the model hook
        username: 'johndoe',
        role: 'user',
        email_verified: true, // Set to true for testing
        verification_token: null
      });
      
      // Create user details
      await UserDetails.create({
        user_id: testUser.user_id,
        firstname: 'John',
        lastname: 'Doe',
        contact_number: '+1234567890'
      });
      
      console.log('✓ Test user created successfully!');
      console.log(`   - Email: ${testUser.email}`);
      console.log(`   - Username: ${testUser.username}`);
      console.log(`   - Email Verified: ${testUser.email_verified}`);
      console.log('   - Password: Password123');
    }
    
    await sequelize.close();
    console.log('✓ Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.original) {
      console.error('❌ Original error:', error.original.message);
    }
    process.exit(1);
  }
}

debugDatabase();