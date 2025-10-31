const nodemailer = require("nodemailer");

const createTransporter = () => {
  console.log("🔧 Creating Brevo (Sendinblue) email transporter...");

  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",  // Brevo SMTP host
    port: 587,                     // TLS port (works on Render)
    secure: false,                 // false = STARTTLS
    auth: {
      user: process.env.EMAIL_USER, // Usually your Brevo login email
      pass: process.env.EMAIL_PASS, // SMTP key from Brevo dashboard
    },
  });
};

// Common HTML template generator
const generateEmailHTML = (title, contentHTML) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0; padding: 40px 20px;
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
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
      color: white; padding: 30px; text-align: center;
    }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px 30px; color: #333; }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>${title}</h1></div>
    <div class="content">${contentHTML}</div>
    <div class="footer">
      <p>&copy; 2025 ByteCode. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

// Send OTP Email (Registration)
const sendOTPEmail = async (email, otp, name) => {
  try {
    console.log("📧 Sending OTP email to:", email);
    const transporter = createTransporter();

    const html = generateEmailHTML(
      "🔐 ByteCode Verification",
      `
      <h2>Hello ${name},</h2>
      <p>Welcome to ByteCode! Use the verification code below to complete your registration:</p>
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                  color: white; font-size: 32px; font-weight: bold;
                  text-align: center; padding: 20px; border-radius: 10px;
                  margin: 30px 0; letter-spacing: 8px;">
        ${otp}
      </div>
      <p>This code will expire in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
      `
    );

    await transporter.sendMail({
      from: `"ByteCode Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP - ByteCode",
      html,
    });

    console.log("✅ OTP email sent successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return false;
  }
};

// Send Password Reset OTP Email
const sendPasswordResetOTPEmail = async (email, otp, name) => {
  try {
    console.log("📧 Sending password reset OTP to:", email);
    const transporter = createTransporter();

    const html = generateEmailHTML(
      "🔒 Password Reset - ByteCode",
      `
      <h2>Hello ${name},</h2>
      <p>You requested to reset your password. Use the OTP code below:</p>
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                  color: white; font-size: 32px; font-weight: bold;
                  text-align: center; padding: 20px; border-radius: 10px;
                  margin: 30px 0; letter-spacing: 8px;">
        ${otp}
      </div>
      <p>This OTP expires in <strong>10 minutes</strong>. If you didn’t request this, ignore this email.</p>
      `
    );

    await transporter.sendMail({
      from: `"ByteCode Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - ByteCode",
      html,
    });

    console.log("✅ Password reset OTP sent successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset OTP email:", error);
    return false;
  }
};

// Send Password Reset Link (optional)
const sendPasswordResetEmail = async (email, resetToken, name) => {
  try {
    console.log("📧 Sending password reset link to:", email);
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = generateEmailHTML(
      "Password Reset Request - ByteCode",
      `
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Click the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" style="background: linear-gradient(135deg, #061e88 0%, #764ba2 100%);
                  color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </div>
      <p>This link will expire in <strong>1 hour</strong>.</p>
      `
    );

    await transporter.sendMail({
      from: `"ByteCode Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - ByteCode",
      html,
    });

    console.log("✅ Password reset link email sent successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetOTPEmail,
  sendPasswordResetEmail,
};
