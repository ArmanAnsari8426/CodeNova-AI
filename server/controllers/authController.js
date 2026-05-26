import crypto from "crypto";
import { supabaseAdmin, supabasePublic } from "../config/supabase.js";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/emailService.js";

/* ══════════════════════════════════════════════════════════════
   OTP Storage (In-Memory Fallback + Supabase)
   ══════════════════════════════════════════════════════════════ */

// In-memory OTP store for local development (no service role key)
const inMemoryOtps = new Map();

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

async function saveOtp(email, code, purpose, expiresInMinutes = 10) {
  console.log(`💾 saveOtp called: email=${email}, purpose=${purpose}`);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  // Try to save to Supabase if service role key is available
  if (supabaseAdmin) {
    try {
      console.log("  Attempting to save to Supabase...");
      const { error } = await supabaseAdmin.from("otps").upsert({
        email,
        code,
        purpose,
        expires_at: expiresAt.toISOString(),
      });
      if (error) throw error;
      console.log(`  ✅ OTP saved to Supabase for ${email} (${purpose})`);
      return;
    } catch (err) {
      // If table doesn't exist or other error, fall back to in-memory
      console.warn(`  ⚠️ Failed to save OTP to Supabase: ${err.message}`);
      console.warn(`     Using in-memory storage as fallback`);
    }
  } else {
    console.log("  ℹ️ SUPABASE_SERVICE_ROLE_KEY not set, using in-memory");
  }

  // Fall back to in-memory storage
  const key = `${email}:${purpose}`;
  inMemoryOtps.set(key, { code, expiresAt });
  console.log(`  ✅ OTP stored in-memory for ${email} (${purpose})`);
}

async function verifyStoredOtp(email, code, purpose) {
  const key = `${email}:${purpose}`;

  // Try to verify from Supabase first
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("otps")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("purpose", purpose)
        .gt("expires_at", new Date().toISOString())
        .single();

      // PGRST116 = no rows returned (expected if OTP not found)
      // Other errors might indicate table doesn't exist
      if (error && error.code !== "PGRST116") {
        console.warn(`⚠️ Supabase query error: ${error.message}`);
        // Fall through to in-memory check
      }

      if (data) {
        // Delete the OTP after successful verification
        try {
          await supabaseAdmin.from("otps").delete().eq("id", data.id);
        } catch (delErr) {
          console.warn(`⚠️ Could not delete OTP: ${delErr.message}`);
        }
        console.log(`✅ OTP verified from Supabase for ${email}`);
        return true;
      }
    } catch (err) {
      console.warn(`⚠️ Supabase check failed, checking in-memory: ${err.message}`);
    }
  }

  // Fall back to in-memory verification
  const stored = inMemoryOtps.get(key);
  if (!stored) {
    console.log(`❌ No OTP found for ${email}`);
    return false;
  }

  if (stored.expiresAt < new Date()) {
    inMemoryOtps.delete(key);
    console.log(`❌ OTP expired for ${email}`);
    return false;
  }

  if (stored.code !== code) {
    console.log(`❌ Incorrect OTP for ${email}`);
    return false;
  }

  // Valid OTP - delete it
  inMemoryOtps.delete(key);
  console.log(`✅ OTP verified from in-memory for ${email}`);
  return true;
}

/* ── Profile Creation Helper ────────────────────────────────── */
async function createProfile(userId, email, meta = {}) {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin.from("profiles").upsert({
    id: userId,
    email,
    full_name: meta.fullName || "",  // Fixed: use fullName from frontend
    username: meta.username || email.split("@")[0],
    phone: meta.phone || null,
    role: meta.role || "student",
    provider: meta.provider || "local",
    is_verified: false,
  });

  if (error) throw error;
  return data;
}

function getAuthErrorStatus(error) {
  const message = (error?.message || "").toLowerCase();

  if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
    return 409;
  }

  if (
    message.includes("invalid") ||
    message.includes("password") ||
    message.includes("email") ||
    message.includes("missing")
  ) {
    return 400;
  }

  return 500;
}

async function createAuthUser({ email, password, fullName, username, phone, role }) {
  const userMetadata = {
    full_name: fullName,
    username,
    phone,
    role,
    provider: "local",
  };

  return supabasePublic.auth.signUp({
    email,
    password,
    options: {
      data: userMetadata,
    },
  });
}

/* ══════════════════════════════════════════════════════════════
   Controllers
   ══════════════════════════════════════════════════════════════ */

export async function signup(req, res) {
  try {
    console.log("📝 Signup request received");
    const { fullName, username, email, password, phone, role } = req.body;
    
    console.log(`  Email: ${email}`);
    console.log(`  Full Name: ${fullName}`);
    console.log(`  Username: ${username}`);

    // Validate required fields
    if (!fullName || !email || !password) {
      console.log("❌ Validation failed: missing fields");
      return res.status(400).json({
        error: "Missing required fields: fullName, email, password",
      });
    }

    console.log("✅ Validation passed");

    // Create user in Supabase Auth
    console.log("🔐 Creating user in Supabase Auth...");
    const { data: authData, error } = await createAuthUser({
      email,
      password,
      fullName,
      username,
      phone,
      role,
    });

    if (error) {
      console.error("❌ Supabase auth signup error:", error);
      return res.status(getAuthErrorStatus(error)).json({
        error: error.message || "Registration failed",
      });
    }

    console.log(`✅ User created in auth: ${authData.user?.id}`);

    // Create profile with correct fullName mapping
    if (authData.user) {
      try {
        console.log("📋 Creating profile...");
        await createProfile(authData.user.id, email, {
          fullName,
          username,
          phone,
          role,
        });
        console.log("✅ Profile created");
      } catch (profileErr) {
        console.warn(`⚠️ Could not create profile: ${profileErr.message}`);
        // Don't throw - signup is still successful, profile can be created later
      }
    }

    console.log("✅ Signup completed successfully");
    res.status(201).json({
      message: "Account created. Check your email for the OTP.",
      user: authData.user,
    });
  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err.message);
    console.error("Stack:", err.stack);
    res.status(getAuthErrorStatus(err)).json({ error: err.message || "Signup failed" });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Missing email or OTP" });
    }

    const { data: verifyData, error: verifyError } = await supabasePublic.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });

    if (verifyError) {
      console.warn(`Supabase signup OTP failed: ${verifyError.message}`);
      return res.status(400).json({ error: verifyError.message || "Invalid or expired OTP" });
    }

    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from("profiles").update({ is_verified: true }).eq("email", email);
      } catch (profileErr) {
        console.warn(`Could not update profile: ${profileErr.message}`);
      }
    }

    res.json({
      message: "Email verified successfully!",
      user: verifyData.user,
      session: verifyData.session,
    });
  } catch (err) {
    console.error("❌ OTP verification error:", err);
    res.status(400).json({ error: err.message });
  }
}

export async function sendOtpController(req, res) {
  try {
    const { email, purpose } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    if (purpose === "reset") {
      const { error } = await supabasePublic.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.CLIENT_URL || "http://localhost:5173",
      });
      if (error) return res.status(400).json({ error: error.message });
    } else {
      const { error } = await supabasePublic.auth.resend({
        type: "signup",
        email,
      });
      if (error) return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("❌ Send OTP error:", err.message);
    res.status(500).json({ error: err.message || "Failed to send OTP" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    const otp = generateOtp();
    try {
      await saveOtp(email, otp, "reset");
      await sendOtpEmail(email, otp, "reset");
    } catch (err) {
      console.warn(`⚠️ Could not send OTP email: ${err.message}`);
      // Still succeed since OTP is stored
    }

    res.json({ message: "Password reset OTP sent to your email" });
  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ error: err.message || "Forgot password request failed" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        error: "Missing required fields: email, newPassword",
      });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        error: "Server configuration error: Supabase admin not available.",
      });
    }

    // Find user by email
    let user;
    try {
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      user = usersData?.users?.find((u) => u.email === email);
    } catch (listErr) {
      console.error("❌ Could not list users:", listErr.message);
      return res.status(500).json({ error: "Could not verify user" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is verified (security check)
    let profile;
    try {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("is_verified")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.warn(`⚠️ Could not get profile: ${profileError.message}`);
        // Proceed anyway - if no profile, we assume unverified
      }
      profile = profileData;
    } catch (err) {
      console.warn(`⚠️ Profile lookup error: ${err.message}`);
    }

    // Only check verification if profile exists
    if (profile && !profile.is_verified) {
      return res.status(400).json({
        error: "Email must be verified before resetting password",
      });
    }

    // Update password
    try {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) throw updateError;
    } catch (updateErr) {
      console.error("❌ Password update error:", updateErr.message);
      return res.status(500).json({ error: "Could not update password" });
    }

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("❌ Reset password error:", err.message);
    res.status(500).json({ error: err.message || "Password reset failed" });
  }
}
