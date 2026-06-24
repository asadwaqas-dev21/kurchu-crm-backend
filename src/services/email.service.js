/**
 * Email Service
 * Sends transactional emails using Nodemailer.
 * Gracefully logs instead of sending when SMTP isn't configured.
 *
 * @module services/email
 */

const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this._initialize();
  }

  /** Initialize Nodemailer transporter if SMTP credentials are available. */
  _initialize() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (SMTP_USER && SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(SMTP_PORT, 10) || 587,
        secure: false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
      this.isConfigured = true;
      logger.info('📧 Email service initialized');
    } else {
      logger.warn('📧 Email service not configured — emails will be logged only');
    }
  }

  /**
   * Send an email. Falls back to logging if SMTP isn't configured.
   * @param {object} options - { to, subject, html, text }
   */
  async send({ to, subject, html, text }) {
    const from = process.env.SMTP_FROM || 'Kurchu CRM <noreply@kurchucrm.com>';

    if (!this.isConfigured) {
      logger.info('📧 [DEV] Email would be sent:', { to, subject, from });
      return { messageId: 'dev-mode', accepted: [to] };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
        text,
      });

      logger.info('📧 Email sent successfully', {
        messageId: info.messageId,
        to,
        subject,
      });

      return info;
    } catch (error) {
      logger.error('📧 Failed to send email', {
        to,
        subject,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Send a password reset email.
   * @param {string} email - Recipient email
   * @param {string} resetToken - Password reset token
   */
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await this.send({
      to: email,
      subject: 'Kurchu CRM — Password Reset Request',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #01a5de;">Password Reset Request</h2>
          <p>You requested a password reset for your Kurchu CRM account.</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #01a5de; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">Kurchu CRM — Customer Relationship Management</p>
        </div>
      `,
      text: `Password Reset Request\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    });
  }

  /**
   * Send a welcome email with temporary password.
   * @param {string} email - Recipient email
   * @param {string} firstName - User's first name
   * @param {string} tempPassword - Temporary password
   */
  async sendWelcomeEmail(email, firstName, tempPassword) {
    const loginUrl = `${process.env.FRONTEND_URL}/login`;

    await this.send({
      to: email,
      subject: 'Welcome to Kurchu CRM — Your Account is Ready',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #01a5de;">Welcome to Kurchu CRM, ${firstName}! 🎉</h2>
          <p>Your account has been created. Here are your login credentials:</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p>⚠️ Please change your password after your first login.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background-color: #01a5de; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Login Now
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">Kurchu CRM — Customer Relationship Management</p>
        </div>
      `,
      text: `Welcome to Kurchu CRM, ${firstName}!\n\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nLogin: ${loginUrl}\n\nPlease change your password after your first login.`,
    });
  }
}

module.exports = new EmailService();
