import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import 'dotenv/config';
import { sendTestEmail, getEmailProviderStatus } from "./utils/emailService.js";
import { supabaseAdmin, supabasePublic, getSupabaseStatus } from "./config/supabase.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ══════════════════════════════════════════════════════════════
   Security Middleware
   ══════════════════════════════════════════════════════════════ */
app.use(helmet());
app.use(
  cors({
    // Accept specific origins: localhost for dev, Vercel domain for production
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:5173",
        "https://ai-powered-coding-platform.vercel.app",
        "https://code-nova-ai.vercel.app"
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});

app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));

/* ══════════════════════════════════════════════════════════════
   Health / Infra Routes
   ══════════════════════════════════════════════════════════════ */
app.get("/api/v1/health", async (_req, res) => {
  res.json({
    status: "ok",
    runtime: "Express + Supabase",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "3.1.0",
  });
});

app.get("/api/v1/backend-status", async (_req, res) => {
  res.json({
    supabase: getSupabaseStatus(),
    email: getEmailProviderStatus(),
    note: "Frontend auth is fully Supabase-driven. Backend admin endpoints require a real service-role key.",
  });
});

app.get("/api/v1/email-status", (_req, res) => {
  res.json({ status: getEmailProviderStatus() });
});

app.post("/api/v1/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const result = await sendTestEmail(email);
    res.json({ message: "Test email sent successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to send test email" });
  }
});

/* ══════════════════════════════════════════════════════════════
   Optional Supabase-backed admin routes
   ══════════════════════════════════════════════════════════════ */
app.get("/api/v1/profiles", async (_req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({
        error: "Admin database access disabled. Please add a real SUPABASE_SERVICE_ROLE_KEY.",
        status: getSupabaseStatus(),
      });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .limit(20);

    if (error) throw error;
    res.json({ profiles: data });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch profiles" });
  }
});

app.get("/api/v1/public-profiles", async (_req, res) => {
  try {
    const { data, error } = await supabasePublic
      .from("profiles")
      .select("id, full_name, username, role, created_at")
      .limit(10);

    if (error) throw error;
    res.json({ profiles: data });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch public profiles" });
  }
});

/* ══════════════════════════════════════════════════════════════
   Auth Routes
   ══════════════════════════════════════════════════════ */
app.use("/api/v1/auth", authRouter);

/* ── 404 Handler ────────────────────────────────────────────── */
app.use("*", (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

/* ── Global Error Handler ───────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

app.listen(PORT, () => {
  const s = getSupabaseStatus();
  console.log(`🚀 CodeNova AI Server running on port ${PORT} [Supabase mode]`);
  console.log(`🔗 Supabase URL: ${s.url}`);
  console.log(`🔑 Anon key present: ${s.hasAnonKey ? "yes" : "no"}`);
  console.log(`🛡 Service role usable: ${s.serviceRoleUsable ? "yes" : "no"}`);
  if (s.warning) console.warn(`⚠️ ${s.warning}`);
  const e = getEmailProviderStatus();
  console.log(`✉️ Email provider: ${e.provider} | configured: ${e.configured ? "yes" : "no"} | from: ${e.from}`);
  if (!e.configured) console.warn("⚠️ RESEND_API_KEY not set. Email endpoints will fail.");
});

export default app;
