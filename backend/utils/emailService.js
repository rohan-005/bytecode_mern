const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://localhost:5001';

// Helper function to call the Email Microservice with timeout and 1 retry
const callEmailService = async (endpoint, payload) => {
  const baseUrl = EMAIL_SERVICE_URL.replace(/\/$/, '');
  const url = `${baseUrl}${endpoint}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`📧 [Backend -> EmailService] Calling ${endpoint} (Attempt ${attempt}/2)`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success !== false) {
          console.log(`✅ [Backend -> EmailService] ${endpoint} succeeded`);
          return true;
        }
      }
      console.warn(`⚠️ [Backend -> EmailService] ${endpoint} returned status ${response.status}`);
    } catch (error) {
      console.error(`❌ [Backend -> EmailService] Error calling ${endpoint} (Attempt ${attempt}/2):`, error.message);
      if (attempt === 2) {
        return false;
      }
    }
  }
  return false;
};

// Send OTP Email (for email verification)
const sendOTPEmail = async (email, otp, name) => {
  return await callEmailService('/send-otp-email', { email, otp, name });
};

// Send Password Reset OTP Email
const sendPasswordResetOTPEmail = async (email, otp, name) => {
  return await callEmailService('/send-password-reset-otp', { email, otp, name });
};

// Send Password Reset Email (link-based)
const sendPasswordResetEmail = async (email, resetToken, name) => {
  return await callEmailService('/send-password-reset-email', { email, resetToken, name });
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetOTPEmail,
  sendPasswordResetEmail
};