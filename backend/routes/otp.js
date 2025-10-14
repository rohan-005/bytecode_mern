const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

const router = express.Router();

// @desc    Send OTP for email verification
// @route   POST /api/otp/send-verification
// @access  Public
router.post('/send-verification', [
  body('email').isEmail().withMessage('Please include a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate OTP
    const otp = user.generateEmailVerificationOTP();
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp, user.name);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ 
      message: 'OTP sent successfully',
      email: user.email 
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Verify OTP for email verification
// @route   POST /api/otp/verify-email
// @access  Public
router.post('/verify-email', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches and is not expired
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    
    if (user.emailVerificationOTP !== hashedOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.emailVerificationOTPExpire < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpire = undefined;
    await user.save();

    res.json({ 
      message: 'Email verified successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Forgot password - send reset email
// @route   POST /api/otp/forgot-password
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please include a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'If email exists, password reset link will be sent' });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    const emailSent = await sendPasswordResetEmail(user.email, resetToken, user.name);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.json({ message: 'Password reset email sent' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Reset password
// @route   PUT /api/otp/reset-password/:resetToken
// @access  Public
router.put('/reset-password/:resetToken', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resetToken } = req.params;
    const { password } = req.body;

    // Hash token to compare with stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user by reset token and check expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password and clear reset token fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Resend OTP
// @route   POST /api/otp/resend-otp
// @access  Public
router.post('/resend-otp', [
  body('email').isEmail().withMessage('Please include a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = user.generateEmailVerificationOTP();
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp, user.name);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ 
      message: 'OTP resent successfully',
      email: user.email 
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;