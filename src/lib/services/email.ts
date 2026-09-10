import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Configurable Transporter abstraction (SMTP, Resend, SendGrid, or Console Log in dev)
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `FlowDesk Workspace <${process.env.EMAIL_FROM || "noreply@flowdesk.app"}>`,
      to,
      subject,
      html,
    });

    console.log(`[Email Service] Email sent via SMTP to ${to}`);
  } else {
    // Development / Mock Email Transporter: Logs formatted invitation email
    console.log("==================================================");
    console.log(`[EMAIL DISPATCHER] To: ${to}`);
    console.log(`[EMAIL DISPATCHER] Subject: ${subject}`);
    console.log(`[EMAIL DISPATCHER] Content preview:\n${html}`);
    console.log("==================================================");
  }
}

export async function sendInvitationEmail({
  to,
  workspaceName,
  inviterName,
  inviteUrl,
}: {
  to: string;
  workspaceName: string;
  inviterName: string;
  inviteUrl: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F9FC; color: #111827; margin: 0; padding: 40px 20px; }
          .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #E5E7EB; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .logo { width: 44px; h: 44px; background: linear-gradient(180deg, #635BFF 0%, #4F46E5 100%); color: #ffffff; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; text-decoration: none; margin-bottom: 24px; }
          h2 { font-size: 22px; font-weight: 800; margin-top: 0; }
          p { font-size: 14px; line-height: 1.6; color: #4B5563; }
          .btn { display: inline-block; background: linear-gradient(180deg, #635BFF 0%, #4F46E5 100%); color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 14px; margin-top: 24px; shadow: 0 4px 12px rgba(99,91,255,0.3); }
          .footer { font-size: 12px; color: #9CA3AF; margin-top: 32px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">F</div>
          <h2>You've been invited to join ${workspaceName}</h2>
          <p>Hi there,</p>
          <p><strong>${inviterName}</strong> has invited you to collaborate on projects and tasks in the <strong>${workspaceName}</strong> workspace on FlowDesk.</p>
          <a href="${inviteUrl}" class="btn">Accept Invitation & Join Workspace</a>
          <p style="margin-top: 24px; font-size: 12px; color: #6B7280;">Or copy and paste this URL into your browser:<br><a href="${inviteUrl}" style="color: #635BFF;">${inviteUrl}</a></p>
        </div>
        <div class="footer">FlowDesk Inc. Work flows better together.</div>
      </body>
    </html>
  `;

  await sendEmail({
    to,
    subject: `${inviterName} invited you to join ${workspaceName} on FlowDesk`,
    html,
  });
}
