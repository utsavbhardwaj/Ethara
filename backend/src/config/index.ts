import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  isDev: process.env.NODE_ENV !== 'production',

  // Brevo SMTP
  email: {
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
    user: process.env.BREVO_SMTP_USER || '',
    pass: process.env.BREVO_SMTP_PASS || '',
    fromName: process.env.EMAIL_FROM_NAME || 'FlowSphere',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@flowsphere.dev',
    enabled: !!(process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS),
  },
};
