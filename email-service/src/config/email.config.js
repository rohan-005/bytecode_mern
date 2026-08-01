const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
  emailFromName: process.env.EMAIL_FROM_NAME || 'ByteCode Auth',
  smtpSecure: process.env.SMTP_SECURE === 'true',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
