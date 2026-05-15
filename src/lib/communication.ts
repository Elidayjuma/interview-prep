import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Communication module for handling all external notifications (Email, etc.)
 * Designed for scalability and easy template management.
 */
export const CommunicationService = {
  /**
   * Sends a welcome email to new users.
   */
  sendWelcomeEmail: async (email: string, name: string) => {
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return { success: false, error: 'API Key missing' };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.MAIL_FROM || 'InterviewPrep <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to InterviewPrep! 🚀',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px;">
            <h1 style="color: #2563eb; margin-bottom: 24px;">Welcome to the future of job hunting, ${name}!</h1>
            <p style="font-size: 16px;">We're thrilled to have you join <strong>InterviewPrep</strong>. You've just taken the first step toward landing your dream role.</p>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin-top: 0; color: #0f172a;">What's next?</h3>
              <ul style="padding-left: 20px;">
                <li><strong>Build your Resume:</strong> Use our AI to tailor your CV to any job description.</li>
                <li><strong>Practice Interviews:</strong> Get real-time feedback on your answers.</li>
                <li><strong>Cover Letters:</strong> Generate professional letters in seconds.</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.BASE_URL || 'http://localhost:3000'}/dashboard" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Explore Your Dashboard</a>
            </div>

            <p style="font-size: 14px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              If you have any questions, feel free to reply to this email. We're here to help you succeed!
              <br /><br />
              Best regards,<br />
              <strong>The InterviewPrep Team</strong>
            </p>
          </div>
        `
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error('CommunicationService Error:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Sends a password reset email.
   */
  sendPasswordResetEmail: async (email: string, name: string, resetUrl: string) => {
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return { success: false, error: 'API Key missing' };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.MAIL_FROM || 'InterviewPrep <onboarding@resend.dev>',
        to: email,
        subject: 'Reset Your Password - InterviewPrep',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px;">
            <h2 style="color: #2563eb; margin-bottom: 24px;">Password Reset Request</h2>
            <p style="font-size: 16px;">Hi ${name},</p>
            <p style="font-size: 16px;">We received a request to reset your password for your InterviewPrep account. Click the button below to set a new password:</p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
            </div>

            <p style="font-size: 14px; color: #64748b;">This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              Need help? Reply to this email or visit our support center.
              <br /><br />
              Best regards,<br />
              <strong>The InterviewPrep Team</strong>
            </p>
          </div>
        `
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error('CommunicationService Error:', err);
      return { success: false, error: err };
    }
  },

  /**
   * Generic method for sending emails - can be used for custom notifications
   */
  sendCustomEmail: async (to: string, subject: string, html: string) => {
    try {
      return await resend.emails.send({
        from: process.env.MAIL_FROM || 'InterviewPrep <onboarding@resend.dev>',
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error('Custom Email Error:', err);
      throw err;
    }
  }
};
