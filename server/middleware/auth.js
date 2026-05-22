import { verifyAccessToken } from "../utils/tokenService.js";
import User from "../models/User.js";

/**
 * Authenticate middleware - verifies JWT Bearer token
 * Attaches user and token payload to request
 */
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required. Please sign in.",
        code: "NO_TOKEN",
      });
    }

    const token = header.slice(7);
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: "Account no longer exists.",
        code: "USER_NOT_FOUND",
      });
    }

    if (user.isLocked) {
      return res.status(423).json({
        error: "Account temporarily locked. Try again in 30 minutes.",
        code: "ACCOUNT_LOCKED",
      });
    }

    // Update last login info
    user.lastLoginAt = new Date();
    user.lastLoginIp =
      req.ip || req.headers["x-forwarded-for"] || "unknown";
    await user.save({ validateBeforeSave: false });

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired. Please refresh.",
        code: "TOKEN_EXPIRED",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token.",
        code: "TOKEN_INVALID",
      });
    }
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Authentication error." });
  }
}

/**
 * Authorize middleware - role-based access control
 * @param  {...string} roles - allowed roles
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires role: ${roles.join(", ")}`,
        code: "INSUFFICIENT_ROLE",
        requiredRoles: roles,
        currentRole: req.user.role,
      });
    }
    next();
  };
}

/**
 * Optional auth - attaches user if token present, otherwise continues
 */
export function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const decoded = verifyAccessToken(header.slice(7));
      req.tokenPayload = decoded;
    }
  } catch {
    // Token invalid, continue as anonymous
  }
  next();
}
