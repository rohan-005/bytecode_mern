const emailService = require('../services/email.service');

const healthCheck = (req, res) => {
  res.json({
    status: 'healthy',
    service: 'email-service',
    timestamp: new Date().toISOString()
  });
};

const handleSendVerificationEmail = async (req, res, next) => {
  try {
    const { email, otp, name } = req.body || {};
    if (!email || !otp || !name) {
      return res.status(400).json({ success: false, message: 'email, otp, and name are required' });
    }
    const result = await emailService.sendVerificationEmail({ email, otp, name });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const handleSendOtpEmail = async (req, res, next) => {
  try {
    const { email, otp, name } = req.body || {};
    if (!email || !otp || !name) {
      return res.status(400).json({ success: false, message: 'email, otp, and name are required' });
    }
    const result = await emailService.sendVerificationEmail({ email, otp, name });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const handleSendPasswordResetOtp = async (req, res, next) => {
  try {
    const { email, otp, name } = req.body || {};
    if (!email || !otp || !name) {
      return res.status(400).json({ success: false, message: 'email, otp, and name are required' });
    }
    const result = await emailService.sendPasswordResetOtpEmail({ email, otp, name });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const handleSendPasswordResetEmail = async (req, res, next) => {
  try {
    const { email, resetToken, name } = req.body || {};
    if (!email || !resetToken || !name) {
      return res.status(400).json({ success: false, message: 'email, resetToken, and name are required' });
    }
    const result = await emailService.sendPasswordResetLinkEmail({ email, resetToken, name });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  healthCheck,
  handleSendVerificationEmail,
  handleSendOtpEmail,
  handleSendPasswordResetOtp,
  handleSendPasswordResetEmail
};
