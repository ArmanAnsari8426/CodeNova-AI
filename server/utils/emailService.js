import { Resend } from "resend";

/* ══════════════════════════════════════════════════════════════
   CodeNova AI — Email Service (Resend Only)
   https://resend.com/docs
   ══════════════════════════════════════════════════════════════ */

console.log("📧 Email Service Initialization:");

let resend;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("  Resend: ✅ Initialized with API key");
} else {
  console.warn("  Resend: ❌ API_KEY is not set. Email sending is disabled.");
  resend = {
    emails: {
      send: async () => {
        throw new Error("RESEND_API_KEY not configured on server");
      },
    },
  };
}

const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";
console.log(`  From: ${FROM}`);

/* ── Send Helper ────────────────────────────────────────────── */
async function send({ to, subject, html }) {
  try {
    // Validate email
    if (!to || !subject || !html) {
      throw new Error("Missing required email fields: to, subject, html");
    }

    // Normalize email array
    const recipients = Array.isArray(to) ? to : [to];
    if (recipients.length === 0) {
      throw new Error("No recipients provided");
    }

    const { data, error } = await resend.emails.send({
      from: `CodeNova AI <${FROM}>`,
      to: recipients,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend API error:", JSON.stringify(error, null, 2));
      throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
    }

    if (!data?.id) {
      console.warn("⚠️ Email sent but no ID returned");
    }

    console.log(`✅ Email sent → ${recipients.join(", ")} | ID: ${data?.id} | ${subject}`);
    return { id: data?.id, to: recipients, subject };
  } catch (err) {
    console.error(`❌ Email failed for ${to}:`, err.message);
    throw err;
  }
}

/* ── HTML Template ──────────────────────────────────────────── */
function template(title, body, btnText, btnUrl) {
  const btn = btnText
    ? `<div style="text-align:center;margin-top:28px;">
        <a href="${btnUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(90deg,#7c5cff,#ff5cc8);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 8px 30px rgba(124,92,255,0.4);">${btnText} →</a>
       </div>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#07070d;font-family:system-ui,-apple-system,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:48px 24px;">

  <div style="text-align:center;margin-bottom:28px;">
    <span style="font-size:28px;font-weight:800;color:#7c5cff;">Code</span><span style="font-size:28px;font-weight:800;color:#19e2c5;">Nova</span>
    <span style="font-size:28px;font-weight:800;color:#e7e7f0;"> AI</span>
  </div>

  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px;">
    <h2 style="color:#e7e7f0;font-size:20px;margin:0 0 16px;font-weight:700;">${title}</h2>
    ${body}
    ${btn}
  </div>

  <div style="margin-top:28px;text-align:center;">
    <p style="font-size:11px;color:#666;margin:0;">© 2026 CodeNova AI · Sent via Resend</p>
    <p style="font-size:10px;color:#555;margin:6px 0 0;">If you didn't request this, ignore this email.</p>
  </div>
</div></body></html>`;
}

/* ══════════════════════════════════════════════════════════════
   EMAIL FUNCTIONS
   ══════════════════════════════════════════════════════════════ */

// 1. Welcome Email
export async function sendWelcomeEmail(to, fullName) {
  const name = fullName?.split(" ")[0] || "Developer";
  return send({
    to,
    subject: "Welcome to CodeNova AI! 🚀",
    html: template(
      `Welcome, ${name}! 🚀`,
      `<p style="color:#ccc;font-size:14px;line-height:1.8;">
        You just joined <strong style="color:#fff;">2.4M+ developers</strong> leveling up with AI.
      </p>
      <ul style="color:#ccc;font-size:14px;line-height:2.2;padding-left:20px;">
        <li>🧠 3,000+ DSA problems</li>
        <li>⚡ Online compiler — 9 languages</li>
        <li>🤖 AI mentor 24/7</li>
        <li>🏆 Weekly live contests</li>
      </ul>`,
      "Open Dashboard",
      `${process.env.CLIENT_URL || "http://localhost:5173"}/#/dashboard`
    ),
  });
}

// 2. OTP Email
export async function sendOtpEmail(to, otp, purpose = "verification") {
  const isReset = purpose === "reset";
  const title = isReset ? "Reset Your Password 🔐" : "Verify Your Email 📧";
  const action = isReset ? "reset your password" : "verify your account";

  const digits = otp.split("").map(d =>
    `<td style="width:48px;height:58px;text-align:center;font-size:32px;font-weight:800;color:#7c5cff;font-family:monospace;background:rgba(124,92,255,0.08);border:2px solid rgba(124,92,255,0.3);border-radius:10px;">${d}</td>`
  ).join("");

  return send({
    to,
    subject: `${otp} is your CodeNova AI code`,
    html: template(
      title,
      `<p style="color:#ccc;font-size:14px;line-height:1.7;">
        Use this code to ${action}:
      </p>
      <div style="text-align:center;margin:24px 0;">
        <table cellpadding="4" cellspacing="4" align="center"><tr>${digits}</tr></table>
      </div>
      <p style="color:#888;font-size:12px;text-align:center;">
        Expires in <strong style="color:#fff;">10 minutes</strong>. Never share this code.
      </p>`,
      "",
      ""
    ),
  });
}

// 3. Login Alert
export async function sendLoginAlertEmail(to, fullName, ip, device) {
  return send({
    to,
    subject: "⚠️ New login to your CodeNova account",
    html: template(
      "New Login Detected 🔔",
      `<p style="color:#ccc;font-size:14px;line-height:1.7;">
        Hey <strong style="color:#fff;">${fullName}</strong>, we detected a new sign-in:
      </p>
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:16px;margin:16px 0;font-size:13px;color:#ccc;">
        <div style="margin-bottom:6px;">📍 IP: <strong style="color:#19e2c5;">${ip}</strong></div>
        <div style="margin-bottom:6px;">🖥️ Device: <strong style="color:#19e2c5;">${device}</strong></div>
        <div>🕐 Time: <strong style="color:#19e2c5;">${new Date().toLocaleString()}</strong></div>
      </div>
      <p style="color:#ff5cc8;font-size:13px;font-weight:600;">
        If this wasn't you, reset your password immediately!
      </p>`,
      "Reset Password",
      `${process.env.CLIENT_URL || "http://localhost:5173"}/#/forgot-password`
    ),
  });
}

// 4. Password Changed
export async function sendPasswordResetConfirmation(to, fullName) {
  return send({
    to,
    subject: "✅ CodeNova password changed",
    html: template(
      "Password Changed ✅",
      `<p style="color:#ccc;font-size:14px;line-height:1.7;">
        Hey <strong style="color:#fff;">${fullName}</strong>, your password was successfully changed.
      </p>
      <div style="background:rgba(25,226,197,0.05);border:1px solid rgba(25,226,197,0.2);border-radius:10px;padding:14px;margin:16px 0;color:#19e2c5;font-size:13px;">
        ✅ All old sessions invalidated<br/>
        ✅ New password is now active
      </div>
      <p style="color:#ff5cc8;font-size:12px;font-weight:600;">
        Didn't do this? Contact support NOW!
      </p>`,
      "Sign In",
      `${process.env.CLIENT_URL || "http://localhost:5173"}/#/login`
    ),
  });
}

// 5. Test Email
export async function sendTestEmail(to) {
  return send({
    to,
    subject: "✅ CodeNova AI — Email Test Passed!",
    html: template(
      "Test Email Successful! 🎉",
      `<p style="color:#ccc;font-size:14px;line-height:1.7;">
        Your Resend API is working perfectly.
      </p>
      <div style="background:rgba(25,226,197,0.05);border:1px solid rgba(25,226,197,0.2);border-radius:10px;padding:14px;margin:16px 0;color:#19e2c5;font-size:13px;">
        ✅ API Key: Valid<br/>
        ✅ Provider: Resend<br/>
        ✅ From: ${FROM}<br/>
        ✅ Time: ${new Date().toLocaleString()}
      </div>`,
      "Open Dashboard",
      `${process.env.CLIENT_URL || "http://localhost:5173"}/#/dashboard`
    ),
  });
}

// 6. Status Check
export function getEmailProviderStatus() {
  return {
    provider: "Resend",
    configured: !!process.env.RESEND_API_KEY,
    from: FROM,
    keyPrefix: process.env.RESEND_API_KEY?.slice(0, 8) + "...",
  };
}
