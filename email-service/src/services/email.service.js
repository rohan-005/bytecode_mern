const { createTransporter } = require('../utils/transporter');
const config = require('../config/email.config');
const { getOtpTemplate } = require('../templates/otp.template');
const { getPasswordResetOtpTemplate } = require('../templates/passwordResetOtp.template');
const { getPasswordResetLinkTemplate } = require('../templates/passwordResetLink.template');

const sendVerificationEmail = async ({ email, otp, name }) => {
  console.log('📧 [Email Microservice] Sending Verification OTP Email to:', email);
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: config.emailFromName,
      address: config.emailFrom
    },
    to: email,
    subject: 'Email Verification OTP - ByteCode',
    html: getOtpTemplate(name, otp)
  };

  await transporter.verify();
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Verification email sent. Message ID:', info.messageId);
  return { success: true, messageId: info.messageId };
};

const sendPasswordResetOtpEmail = async ({ email, otp, name }) => {
  console.log('📧 [Email Microservice] Sending Password Reset OTP Email to:', email);
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: config.emailFromName,
      address: config.emailFrom
    },
    to: email,
    subject: 'Password Reset OTP - ByteCode',
    html: getPasswordResetOtpTemplate(name, otp)
  };

  await transporter.verify();
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Password reset OTP email sent. Message ID:', info.messageId);
  return { success: true, messageId: info.messageId };
};

const sendPasswordResetLinkEmail = async ({ email, resetToken, name }) => {
  console.log('📧 [Email Microservice] Sending Password Reset Link Email to:', email);
  const transporter = createTransporter();
  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

  const mailOptions = {
    from: {
      name: config.emailFromName,
      address: config.emailFrom
    },
    to: email,
    subject: 'Password Reset Request - ByteCode',
    html: getPasswordResetLinkTemplate(name, resetUrl)
  };

  await transporter.verify();
  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Password reset link email sent. Message ID:', info.messageId);
  return { success: true, messageId: info.messageId };
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetOtpEmail,
  sendPasswordResetLinkEmail
};
