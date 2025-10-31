const { Resend } = require('resend');

// Initialize Resend with your API key from Render env vars
let resend;
try {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY is not set in environment variables!");
  }
  resend = new Resend(process.env.RESEND_API_KEY);
} catch (error) {
  console.error("❌ Failed to initialize Resend:", error);
}

// ✅ Generic function to send email safely via Resend
async function sendEmail(to, subject, html) {
  try {
    if (!to) {
      console.error("❌ No recipient email provided! Skipping send.");
      return false;
    }

    console.log("📧 Sending email via Resend...");
    console.log("To:", to);
    console.log("Subject:", subject);

    // Use Resend's default domain
    const fromEmail = "ByteCode <onboarding@resend.dev>";
    console.log("📧 Sending from:", fromEmail);

    const response = await resend.emails.send({
      from: fromEmail,
      to: [to], // ensure it's an array for Resend API
      subject,
      html,
      tags: [{ name: 'category', value: 'auth' }], // for better email analytics
      // reply_to: "onboarding@resend.dev" // Optional: add a reply-to address
    });

    if (response?.error) {
      console.error("❌ Resend API error:", response.error);
      return false;
    }
    
    if (!response?.id) {
      console.warn("⚠️ Resend did not return an ID. Response:", response);
      return false;
    }

    console.log("✅ Email sent successfully with ID:", response.id);
    return true;
  } catch (error) {
    console.error("❌ Error sending email via Resend:", error);
    return false;
  }
}

// ✅ Shared email template generator
const emailTemplate = (title, message, otp, name, themeColor = "#667eea") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    .header {
      background: ${themeColor};
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content { padding: 40px 30px; color: #333; }
    .otp-display {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      padding: 20px;
      border-radius: 10px;
      margin: 30px 0;
      letter-spacing: 8px;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .info-text {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>${title}</h1></div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p class="info-text">${message}</p>
      <div class="otp-display">${otp}</div>
      <p class="info-text">
        This code will expire in <strong>10 minutes</strong>.<br>
        If you didn't request this code, please ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ByteCode. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

// ✅ Send OTP Email (for account verification)
async function sendOTPEmail(email, otp, name) {
  console.log("🧩 Preparing to send verification OTP to:", email);
  const html = emailTemplate(
    "🔐 ByteCode Verification",
    "Welcome to ByteCode! Use the verification code below to complete your registration:",
    otp,
    name,
    "linear-gradient(135deg, #000000 0%, #333333 100%)"
  );
  return sendEmail(email, "Email Verification OTP - ByteCode", html);
}

// ✅ Send Password Reset OTP Email
async function sendPasswordResetOTPEmail(email, otp, name) {
  console.log("🧩 Preparing to send password reset OTP to:", email);
  const html = emailTemplate(
    "🔒 Password Reset - ByteCode",
    "You requested to reset your password. Use the OTP code below to verify your identity:",
    otp,
    name,
    "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)"
  );
  return sendEmail(email, "Password Reset OTP - ByteCode", html);
}

// ✅ Send Password Reset Link Email
async function sendPasswordResetEmail(email, resetToken, name) {
  console.log("🧩 Preparing to send password reset link to:", email);

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #061e88 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666;">This link will expire in <strong>1 hour</strong>.</p>
        <p style="color: #666;">If you didn't request a password reset, please ignore this email.</p>
      </div>
    </div>
  `;
  return sendEmail(email, "Password Reset Request - ByteCode", html);
}

module.exports = {
  sendOTPEmail,
  sendPasswordResetOTPEmail,
  sendPasswordResetEmail,
};
