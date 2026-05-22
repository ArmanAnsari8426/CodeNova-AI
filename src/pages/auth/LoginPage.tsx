import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Sparkles,
  CheckCircle2, Shield, Monitor, Globe,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginThunk, socialLoginThunk, clearError, setRememberMe } from "@/redux/slices/authSlice";

const GoogleSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
);
const GitHubSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.23.66-.5v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.69.92.69 1.85V21c0 .27.16.59.67.5A10 10 0 0 0 12 2z"/></svg>
);

const TIPS = [
  { icon: Monitor, text: "Use keyboard shortcuts to code 3× faster" },
  { icon: Globe, text: "Compete with 2.4M+ developers worldwide" },
  { icon: Shield, text: "Your data is encrypted with AES-256" },
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, rememberMe } = useAppSelector(s => s.auth);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(rememberMe);
  const [tipIndex, setTipIndex] = useState(0);

  const from = (location.state as any)?.from || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    dispatch(clearError());
    const id = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;
    dispatch(loginThunk({ identifier: identifier.trim(), password, remember }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left – marketing panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-700/30 via-violet-500/10 to-fuchsia-500/20" />
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-violet-500/20 blur-3xl" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Welcome back to <span className="gradient-text">CodeNova</span>.
          </h2>
          <p className="text-nova-muted mt-4 text-lg">
            Pick up right where you left off. Your streak, XP, and submissions are all waiting.
          </p>

          {/* Rotating tips */}
          <div className="mt-10 glass rounded-2xl p-5 min-h-[100px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3"
              >
                {(() => { const T = TIPS[tipIndex]; return (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <T.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-sm">{T.text}</p>
                  </>
                ); })()}
              </motion.div>
            </AnimatePresence>
          </div>

          <ul className="mt-8 space-y-2.5 text-sm text-white">
            {["180M+ problems solved", "92M+ AI hints served", "1,200+ live contests/month"].map(t => (
              <li key={t} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right – form */}
      <div className="flex-1 flex flex-col px-6 sm:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="mb-6">
          <Logo />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Welcome back
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-3">
              Sign in to <span className="gradient-text">CodeNova</span>
            </h1>
            <p className="text-nova-muted mt-2 text-sm">
              Continue with your email or social account.
            </p>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearError())} className="ml-auto shrink-0 hover:text-white">×</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button type="button" onClick={() => setShowGoogleModal(true)} disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-strong text-white text-sm font-medium hover:bg-white/10 transition disabled:opacity-50">
                <GoogleSvg /> Google / Gmail
              </button>
              <button type="button" onClick={() => setShowGithubModal(true)} disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-strong text-white text-sm font-medium hover:bg-white/10 transition disabled:opacity-50">
                <GitHubSvg /> GitHub
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-nova-muted uppercase tracking-wider">or sign in with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-nova-muted font-medium mb-1.5 block">Email or Username</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
                  <input
                    type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                    placeholder="you@codenova.ai or arav.dev"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-nova-muted/70 outline-none focus:ring-2 focus:ring-violet-500/40 transition"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-nova-muted font-medium">Password</label>
                  <Link to="/forgot-password" className="text-xs text-violet-300 hover:text-violet-200 transition">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-nova-muted/70 outline-none focus:ring-2 focus:ring-violet-500/40 transition"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nova-muted hover:text-white">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-nova-muted cursor-pointer pt-1">
                <input type="checkbox" checked={remember} onChange={e => { setRemember(e.target.checked); dispatch(setRememberMe(e.target.checked)); }}
                  className="accent-violet-500" />
                Remember me
              </label>

              <button type="submit" disabled={loading || !identifier.trim() || !password}
                className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition hover:shadow-violet-500/50">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                  : <>Sign in <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-nova-muted mt-6">
              New to CodeNova?{" "}
              <Link to="/signup" className="text-white font-medium hover:underline">Create account</Link>
            </p>

            {/* Demo hint */}
            <div className="mt-6 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-xs text-violet-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                Demo: use <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded">demo@codenova.ai</code> / <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded">Demo@1234</code>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Google / Gmail Account Chooser Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-md bg-[#1f1f33] rounded-3xl p-8 border border-white/10 shadow-2xl relative">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <GoogleSvg />
                </div>
                <h3 className="font-display text-xl font-bold text-white">Sign in with Google</h3>
                <p className="text-xs text-nova-muted mt-1">Choose an account or enter your Gmail address to continue to CodeNova AI</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { email: "aarav@gmail.com", name: "Aarav Kumar", avatar: "AK" },
                  { email: "priya.sharma@gmail.com", name: "Priya Sharma", avatar: "PS" },
                ].map((acc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowGoogleModal(false);
                      dispatch(socialLoginThunk({ provider: "google", email: acc.email, name: acc.name, remember }));
                    }}
                    className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-violet-500/50 hover:bg-white/[0.08] transition flex items-center gap-4 text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {acc.avatar}
                    </div>
                    <div>
                      <div className="text-sm text-white font-semibold group-hover:text-violet-300 transition">{acc.name}</div>
                      <div className="text-xs text-nova-muted">{acc.email}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-nova-muted ml-auto group-hover:translate-x-1 group-hover:text-violet-400 transition" />
                  </button>
                ))}
              </div>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-xs text-nova-muted uppercase tracking-wider font-bold">Or Use Custom Gmail</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                if (!customEmail.trim() || !customName.trim()) return;
                setShowGoogleModal(false);
                dispatch(socialLoginThunk({ provider: "google", email: customEmail.trim(), name: customName.trim(), remember }));
              }} className="space-y-4">
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Your Full Name</label>
                  <input type="text" required value={customName} onChange={e => setCustomName(e.target.value)} placeholder="E.g. Rohan Verma" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Your Gmail Address</label>
                  <input type="email" required value={customEmail} onChange={e => setCustomEmail(e.target.value)} placeholder="rohan@gmail.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowGoogleModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition flex items-center justify-center gap-1.5">Continue <ArrowRight className="w-4 h-4" /></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GitHub Account Chooser Modal */}
      <AnimatePresence>
        {showGithubModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-md bg-[#1f1f33] rounded-3xl p-8 border border-white/10 shadow-2xl relative">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <GitHubSvg />
                </div>
                <h3 className="font-display text-xl font-bold text-white">Sign in with GitHub</h3>
                <p className="text-xs text-nova-muted mt-1">Choose an account or enter your GitHub credentials to continue</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { email: "devhero@github.com", name: "Dev Hero", avatar: "DH" },
                  { email: "octocat@github.com", name: "Mona Octocat", avatar: "MO" },
                ].map((acc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowGithubModal(false);
                      dispatch(socialLoginThunk({ provider: "github", email: acc.email, name: acc.name, remember }));
                    }}
                    className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-violet-500/50 hover:bg-white/[0.08] transition flex items-center gap-4 text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {acc.avatar}
                    </div>
                    <div>
                      <div className="text-sm text-white font-semibold group-hover:text-cyan-300 transition">{acc.name}</div>
                      <div className="text-xs text-nova-muted">{acc.email}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-nova-muted ml-auto group-hover:translate-x-1 group-hover:text-cyan-400 transition" />
                  </button>
                ))}
              </div>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-xs text-nova-muted uppercase tracking-wider font-bold">Or Use Custom GitHub</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                if (!customEmail.trim() || !customName.trim()) return;
                setShowGithubModal(false);
                dispatch(socialLoginThunk({ provider: "github", email: customEmail.trim(), name: customName.trim(), remember }));
              }} className="space-y-4">
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Your Full Name</label>
                  <input type="text" required value={customName} onChange={e => setCustomName(e.target.value)} placeholder="E.g. Alex Johnson" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Your GitHub Email</label>
                  <input type="email" required value={customEmail} onChange={e => setCustomEmail(e.target.value)} placeholder="alex@github.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500/50" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowGithubModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition flex items-center justify-center gap-1.5">Continue <ArrowRight className="w-4 h-4" /></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
