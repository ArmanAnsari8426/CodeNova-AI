import jwt from "jsonwebtoken";
import crypto from "crypto";

/* ── Configuration ───────────────────────────────────────────── */
const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "cn_access_secret_CHANGE_ME_IN_PRODUCTION";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "cn_refresh_secret_CHANGE_ME_IN_PRODUCTION";

const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Generate short-lived access token (15 min)
 * Contains: id, role, email for quick authorization checks
 */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY, issuer: "codenova-ai", audience: "codenova-client" }
  );
}

/**
 * Generate long-lived refresh token (7 days)
 * Contains: id, unique tokenVersion for revocation
 */
export function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
      tokenVersion: Date.now() + Math.random().toString(36).slice(2),
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY, issuer: "codenova-ai" }
  );
}

/**
 * Verify access token
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET, {
    issuer: "codenova-ai",
    audience: "codenova-client",
  });
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET, { issuer: "codenova-ai" });
}

/**
 * Set HTTP-only refresh token cookie
 */
export function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

/**
 * Clear refresh token cookie (for logout)
 */
export function clearRefreshCookie(res) {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "strict" : "lax",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Generate a secure random token (for password reset, etc.)
 */
export function generateSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}
