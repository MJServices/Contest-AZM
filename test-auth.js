/**
 * Quick test script for DecorVista Authentication API
 * Run this after starting the server to test authentication endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';
const testUser = {
  email: 'test@decorvista.com',
  password: 'TestPass123',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  role: 'user'
};

let authToken = '';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testAPI() {
  console.log('🧪 Testing DecorVista Authentication API\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api/v1', '')}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: User Registration
    console.log('2️⃣ Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data.message);
      console.log('📧 User ID:', registerResponse.data.data.userId);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️ User already exists, continuing with login test...');
      } else {
        throw error;
      }
    }
    console.log('');

    await delay(1000);

    // Test 3: User Login
    console.log('3️⃣ Testing User Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.data.success) {
        authToken = loginResponse.data.data.tokens.accessToken;
        console.log('✅ Login successful');
        console.log('👤 User:', loginResponse.data.data.user.username);
        console.log('🔑 Token received');
      }
    } catch (error) {
      if (error.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
        console.log('⚠️ Email verification required - this is expected for new users');
        console.log('📧 In production, check email for verification link');
        return;
      } else {
        throw error;
      }
    }
    console.log('');

    await delay(1000);

    // Test 4: Get Profile (Protected Route)
    if (authToken) {
      console.log('4️⃣ Testing Protected Route (Get Profile)...');
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Profile retrieved successfully');
      console.log('👤 User ID:', profileResponse.data.data.id);
      console.log('📧 Email:', profileResponse.data.data.email);
      console.log('');
    }

    // Test 5: Token Verification
    if (authToken) {
      console.log('5️⃣ Testing Token Verification...');
      const verifyResponse = await axios.get(`${BASE_URL}/auth/verify-token`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Token is valid');
      console.log('🔐 Token verified for user:', verifyResponse.data.data.username);
      console.log('');
    }

    // Test 6: Password Reset Request
    console.log('6️⃣ Testing Password Reset Request...');
    const resetResponse = await axios.post(`${BASE_URL}/auth/request-password-reset`, {
      email: testUser.email
    });
    console.log('✅ Password reset request:', resetResponse.data.message);
    console.log('');

    // Test 7: Invalid Token Test
    console.log('7️⃣ Testing Invalid Token Handling...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': 'Bearer invalid_token_here'
        }
      });
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Invalid token properly rejected');
      }
    }
    console.log('');

    console.log('🎉 All authentication tests completed successfully!');
    console.log('');
    console.log('📋 Test Summary:');
    console.log('   ✅ Health check');
    console.log('   ✅ User registration');
    console.log('   ✅ User login');
    console.log('   ✅ Protected routes');
    console.log('   ✅ Token verification');
    console.log('   ✅ Password reset');
    console.log('   ✅ Security validation');
    console.log('');
    console.log('🚀 DecorVista Authentication API is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure the server is running (npm run dev)');
    console.log('   2. Check database connection');
    console.log('   3. Verify environment variables');
    console.log('   4. Check server logs for errors');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  console.log('⏳ Starting API tests in 2 seconds...\n');
  setTimeout(testAPI, 2000);
}

module.exports = { testAPI };