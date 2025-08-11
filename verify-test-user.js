const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');

async function verifyTestUser() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Finding user john.doe@test.com...');
    const user = await User.findOne({
      where: { email: 'john.doe@test.com' }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('Current user status:');
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Email Verified: ${user.email_verified}`);
    console.log(`   - Active: ${user.is_active}`);
    
    if (user.email_verified) {
      console.log('✓ User email is already verified!');
    } else {
      console.log('Verifying user email...');
      await user.update({
        email_verified: true,
        verification_token: null
      });
      console.log('✓ User email verified successfully!');
    }
    
    await sequelize.close();
    console.log('✓ Database connection closed.');
    console.log('\n🎉 You can now login with:');
    console.log('   Email: john.doe@test.com');
    console.log('   Password: Password123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyTestUser();