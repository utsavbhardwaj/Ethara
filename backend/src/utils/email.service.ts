import nodemailer from 'nodemailer';
import { config } from '../config';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (config.email.enabled) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: false, // TLS
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });
    } else {
      console.warn('⚠️  Email service disabled – BREVO_SMTP_USER/PASS not set in .env');
    }
  }

  private from() {
    return `"${config.email.fromName}" <${config.email.fromAddress}>`;
  }

  async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verify your FlowSphere email</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#16161f;border-radius:20px;border:1px solid rgba(139,92,246,0.2);overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);padding:32px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:white;letter-spacing:-0.5px;">⚡ FlowSphere</div>
            <div style="color:rgba(255,255,255,0.8);font-size:14px;margin-top:4px;">Team Task Manager</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 36px;">
            <h1 style="color:#e2e8f0;font-size:22px;font-weight:700;margin:0 0 12px;">
              Welcome, ${name}! 👋
            </h1>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
              Thanks for signing up. Please verify your email address to activate your account and start managing your team's workflow.
            </p>
            <div style="text-align:center;margin:0 0 28px;">
              <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:600;font-size:15px;">
                Verify Email Address →
              </a>
            </div>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
              Or copy this link into your browser:<br>
              <a href="${verifyUrl}" style="color:#8b5cf6;word-break:break-all;">${verifyUrl}</a>
            </p>
            <hr style="border:none;border-top:1px solid rgba(139,92,246,0.1);margin:28px 0;">
            <p style="color:#64748b;font-size:12px;margin:0;">
              This link expires in <strong style="color:#94a3b8;">24 hours</strong>. If you didn't create an account, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px;border-top:1px solid rgba(139,92,246,0.1);">
            <p style="color:#64748b;font-size:12px;margin:0;text-align:center;">
              © 2026 FlowSphere · Built for modern teams
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    if (!this.transporter) {
      // Dev fallback: log to console
      console.log('\n📧 [EMAIL - Dev Mode] Verification email would be sent:');
      console.log(`  To: ${to}`);
      console.log(`  Verify URL: ${verifyUrl}\n`);
      return;
    }

    await this.transporter.sendMail({
      from: this.from(),
      to,
      subject: 'Verify your FlowSphere email address',
      html,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    if (!this.transporter) return;

    await this.transporter.sendMail({
      from: this.from(),
      to,
      subject: `Welcome to FlowSphere, ${name}! 🚀`,
      html: `
        <div style="font-family:'Inter',sans-serif;background:#0a0a0f;padding:40px;border-radius:20px;">
          <h1 style="color:#e2e8f0;">You're all set, ${name}! ⚡</h1>
          <p style="color:#94a3b8;">Your FlowSphere account is now active. Start by creating your first project.</p>
          <a href="${config.frontendUrl}/dashboard" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 24px;border-radius:10px;text-decoration:none;display:inline-block;margin-top:16px;font-weight:600;">
            Go to Dashboard →
          </a>
        </div>`,
    });
  }
}

export const emailService = new EmailService();
