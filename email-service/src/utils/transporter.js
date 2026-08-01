const nodemailer = require('nodemailer');
const config = require('../config/email.config');

const createTransporter = () => {
  const cleanPassword = config.emailPass ? config.emailPass.replace(/\s/g, '') : '';

  console.log('🔧 [Email Microservice] Creating email transporter...');
  console.log('User:', config.emailUser);
  console.log('Password length:', cleanPassword.length);

  if (config.emailHost) {
    return nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: config.smtpSecure,
      auth: {
        user: config.emailUser,
        pass: cleanPassword
      }
    });
  }

  return nodemailer.createTransport({
    service: config.emailService,
    auth: {
      user: config.emailUser,
      pass: cleanPassword
    }
  });
};

module.exports = { createTransporter };
