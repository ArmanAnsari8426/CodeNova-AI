import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute, GuestRoute } from "@/components/auth/ProtectedRoute";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthFromSession } from "@/redux/slices/authSlice";
import { authAPI } from "@/services/authAPI";

import Landing from "@/pages/Landing";
import Problems from "@/pages/Problems";
import ProblemDetail from "@/pages/ProblemDetail";
import Compiler from "@/pages/Compiler";
import Contests from "@/pages/Contests";
import Leaderboard from "@/pages/Leaderboard";
import AiAssistant from "@/pages/AiAssistant";
import Blog from "@/pages/Blog";
import Dashboard from "@/pages/Dashboard";
import Pricing from "@/pages/Pricing";

// Learn pages
import RoadmapPage from "@/pages/learn/RoadmapPage";
import InterviewPrepPage from "@/pages/learn/InterviewPrepPage";
import ResumeBuilderPage from "@/pages/learn/ResumeBuilderPage";
import AiInterviewerPage from "@/pages/learn/AiInterviewerPage";

// Company pages
import AboutPage from "@/pages/company/AboutPage";
import CareersPage from "@/pages/company/CareersPage";
import ContactPage from "@/pages/company/ContactPage";
import PressPage from "@/pages/company/PressPage";

// Contest pages
import ContestRegistration from "@/pages/ContestRegistration";
import ContestArena from "@/pages/ContestArena";

// Legal pages
import LegalPage from "@/pages/legal/LegalPage";
import SecurityPage from "@/pages/legal/SecurityPage";
import StatusPage from "@/pages/legal/StatusPage";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "@/pages/auth/VerifyOtpPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

/* ── Route config ───────────────────────────────────────────── */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/verify-otp", "/reset-password"];
const NO_FOOTER = ["/compiler", "/ai-assistant", "/dashboard", "/ai-interviewer"];

/* ── Helpers ────────────────────────────────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

const TITLES: Record<string, string> = {
  "/": "CodeNova AI — AI-Powered Online Coding Platform",
  "/login": "Sign in · CodeNova AI",
  "/signup": "Create account · CodeNova AI",
  "/forgot-password": "Forgot password · CodeNova AI",
  "/verify-otp": "Verify OTP · CodeNova AI",
  "/reset-password": "Reset password · CodeNova AI",
  "/problems": "Problems · CodeNova AI",
  "/compiler": "Online Compiler · CodeNova AI",
  "/contests": "Contests · CodeNova AI",
  "/leaderboard": "Leaderboard · CodeNova AI",
  "/ai-assistant": "Nova AI · CodeNova AI",
  "/blog": "Blog · CodeNova AI",
  "/dashboard": "Dashboard · CodeNova AI",
  "/pricing": "Pricing · CodeNova AI",
  "/roadmap": "DSA Roadmap · CodeNova AI",
  "/interview-prep": "Interview Prep · CodeNova AI",
  "/resume-builder": "Resume Builder · CodeNova AI",
  "/ai-interviewer": "AI Interviewer · CodeNova AI",
  "/about": "About Us · CodeNova AI",
  "/careers": "Careers · CodeNova AI",
  "/contact": "Contact Us · CodeNova AI",
  "/press": "Press & Media · CodeNova AI",
  "/privacy": "Privacy Policy · CodeNova AI",
  "/terms": "Terms of Service · CodeNova AI",
  "/cookies": "Cookie Policy · CodeNova AI",
  "/security": "Security & Trust · CodeNova AI",
  "/status": "System Status · CodeNova AI",
};

function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const base = TITLES[pathname];
    if (base) document.title = base;
    else if (pathname.startsWith("/problems/")) document.title = "Solve · CodeNova AI";
    else document.title = "CodeNova AI";
  }, [pathname]);
  return null;
}

/* ══════════════════════════════════════════════════════════════
   Supabase Session Bootstrap
   ══════════════════════════════════════════════════════════════ */
function SupabaseBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        const session: any = await authAPI.session();
        if (!session || !mounted) return;

        const me: any = await authAPI.me();
        if (!me?.user || !mounted) return;

        const u = me.user;
        const p = me.profile;

        const mappedUser = {
          _id: u?.id || "",
          fullName: p?.full_name || u?.user_metadata?.full_name || u?.user_metadata?.name || "CodeNova User",
          username: p?.username || u?.user_metadata?.username || u?.email?.split("@")[0] || "user",
          email: u?.email || p?.email || "",
          avatar: p?.avatar_url || u?.user_metadata?.avatar_url || u?.user_metadata?.picture || "",
          phone: p?.phone || u?.user_metadata?.phone || "",
          role: p?.role || u?.user_metadata?.role || "student",
          provider: p?.provider || u?.app_metadata?.provider || u?.user_metadata?.provider || "local",
          isVerified: !!(p?.is_verified ?? u?.email_confirmed_at ?? true),
          createdAt: p?.created_at || u?.created_at || new Date().toISOString(),
        };

        dispatch(setAuthFromSession({ user: mappedUser as any, token: session?.access_token || null }));
      } catch {
        // keep app usable in demo mode if Supabase not ready
      }
    };

    boot();
    return () => { mounted = false; };
  }, [dispatch]);

  return null;
}

/* ── App shell ──────────────────────────────────────────────── */
function Shell() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);
  const isContestArena = pathname.startsWith("/contest/") && pathname.endsWith("/arena");
  const noFooter = NO_FOOTER.some((p) => pathname === p) || isContestArena;

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuth && !isContestArena && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Platform */}
          <Route path="/" element={<Landing />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Learn Section */}
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/interview-prep" element={<InterviewPrepPage />} />
          <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/ai-interviewer" element={<AiInterviewerPage />} />

          {/* Company Section */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/press" element={<PressPage />} />

          {/* Legal Section */}
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/cookies" element={<LegalPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/status" element={<StatusPage />} />

          {/* Auth */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Contest System */}
          <Route path="/contest/:id/register" element={<ContestRegistration />} />
          <Route path="/contest/:id/arena" element={<ContestArena />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      {!isAuth && !noFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <SupabaseBootstrap />
      <ScrollToTop />
      <PageTitle />
      <Shell />
    </HashRouter>
  );
}
