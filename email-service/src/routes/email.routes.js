const express = require('express');
const emailController = require('../controllers/email.controller');

const router = express.Router();

router.get('/health', emailController.healthCheck);
router.post('/send-verification-email', emailController.handleSendVerificationEmail);
router.post('/send-otp-email', emailController.handleSendOtpEmail);
router.post('/send-password-reset-otp', emailController.handleSendPasswordResetOtp);
router.post('/send-password-reset-email', emailController.handleSendPasswordResetEmail);

module.exports = router;
