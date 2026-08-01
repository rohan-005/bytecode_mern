const getPasswordResetLinkTemplate = (name, resetUrl) => {
  return `
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
};

module.exports = { getPasswordResetLinkTemplate };
