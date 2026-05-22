import crypto from "crypto";
import { supabaseAdmin } from "../config/supabase.js";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/emailService.js";

/* ── Helpers ────────────────────────────────────────────────── */
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

async function createProfile(userId, email, meta = {}) {
  const { data } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    email,
    full_name: meta.full_name || "",
    username: meta.username || email.split("@")[0],
    phone: meta.phone || null,
    role: meta.role || "student",
    provider: meta.provider || "local",
    is_verified: false,
  });
  return data;
}

/* ── Controllers ────────────────────────────────────────────── */

export async function signup(req, res) {
  try {
    const { fullName, username, email, password, phone, role } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username, phone, role },
      },
    });

    if (error) throw error;

    // Create profile
    if (authData.user) {
      await createProfile(authData.user.id, email, { fullName, username, phone, role });
    }

    // Send OTP via Resend
    const otp = generateOtp();
    await sendOtpEmail(email, otp, "verification");

    res.status(201).json({
      message: "Account created. OTP sent to your email.",
      user: authData.user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) throw error;

    // Mark profile as verified
    await supabaseAdmin.from("profiles").update({ is_verified: true }).eq("email", email);

    res.json({ message: "Email verified successfully!", session: data.session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function sendOtpController(req, res) {
  try {
    const { email, purpose } = req.body;
    const otp = generateOtp();
    await sendOtpEmail(email, otp, purpose || "verification");
    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const otp = generateOtp();
    await sendOtpEmail(email, otp, "reset");
    res.json({ message: "Password reset OTP sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
