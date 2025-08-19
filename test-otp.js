const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testOTPFlow() {
  try {
    console.log('🧪 Testing OTP Flow...\n');

    // Step 1: Login to get OTP
    console.log('1️⃣ Logging in to get OTP...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('✅ Login successful:', loginResponse.data.message);

    // Step 2: Check stored OTP
    console.log('\n2️⃣ Checking stored OTP...');
    const otpCheckResponse = await axios.post(`${BASE_URL}/test-otp`, {
      email: 'test@example.com'
    });
    console.log('📱 Stored OTP:', otpCheckResponse.data.user.otp);
    console.log('⏰ Expires at:', otpCheckResponse.data.user.otpExpiresAt);
    console.log('❌ Is expired:', otpCheckResponse.data.user.isExpired);

    // Step 3: Verify OTP
    console.log('\n3️⃣ Verifying OTP...');
    const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
      email: 'test@example.com',
      otp: otpCheckResponse.data.user.otp
    });
    console.log('✅ OTP verification result:', verifyResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testOTPFlow();
