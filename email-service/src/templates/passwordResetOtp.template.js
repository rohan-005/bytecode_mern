const getPasswordResetOtpTemplate = (name, otp) => {
  return `
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
                background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
                color: #333;
            }
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
            .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px;
                margin: 20px 0;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔒 Password Reset - ByteCode</h1>
            </div>
            <div class="content">
                <h2>Hello ${name},</h2>
                <p class="info-text">You requested to reset your password. Use the OTP code below to verify your identity:</p>
                
                <div class="otp-display">${otp}</div>
                
                <div class="warning">
                    <strong>Security Notice:</strong> This OTP will expire in <strong>10 minutes</strong>.
                    If you didn't request a password reset, please ignore this email and ensure your account is secure.
                </div>
                
                <p class="info-text">
                    Enter this code in the password reset form to proceed with creating a new password.
                </p>
            </div>
            <div class="footer">
                <p>&copy; 2024 ByteCode. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = { getPasswordResetOtpTemplate };
