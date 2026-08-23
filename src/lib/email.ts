import { Resend } from "resend";

// Real transactional email integration (verification, password reset) —
// closes the "architect it so a provider can be connected cleanly" gap
// from the original prompt (AUDIT.md). Deliberately NOT used for
// newsletter campaign sending — that's bulk marketing mail, a different
// concern (unsubscribe handling, deliverability at volume, rate limits)
// from these one-off transactional sends, and stays out of scope; see
// the newsletter note in AUDIT.md.
//
// Safe with no API key configured: logs a warning and returns without
// throwing, so sign-up/password-reset flows still work end-to-end in an
// environment that hasn't set one up yet — the request just won't
// actually receive an email.
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping email "${subject}" to ${to}. Set RESEND_API_KEY (and optionally EMAIL_FROM) to send for real.`,
    );
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    // A failed email should never crash the auth flow that triggered it
    // (the account still exists / the reset token is still valid) — log
    // and move on rather than throw.
    console.error(`[email] Failed to send "${subject}" to ${to}:`, err);
  }
}

export async function sendVerificationEmail(to: string, url: string) {
  await sendEmail({
    to,
    subject: "Verify your email",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verify your email</h2>
        <p>Click the link below to verify your email address.</p>
        <p><a href="${url}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a></p>
        <p style="color:#666;font-size:13px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  await sendEmail({
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to choose a new password. This link expires shortly.</p>
        <p><a href="${url}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
        <p style="color:#666;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
