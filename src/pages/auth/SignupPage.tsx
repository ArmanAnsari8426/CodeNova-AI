import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Phone, Eye, EyeOff, Camera, CheckCircle2,
  XCircle, Sparkles, ArrowRight, ArrowLeft, Loader2, Shield, AlertCircle,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { signupThunk, socialLoginThunk, clearError } from "@/redux/slices/authSlice";
import { checkPasswordStrength, isValidEmail, isValidPhone, isValidUsername } from "@/utils/password";

const GoogleSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
);
const GitHubSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.23.66-.5v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.69.92.69 1.85V21c0 .27.16.59.67.5A10 10 0 0 0 12 2z"/></svg>
);

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, otpSent, isAuthenticated } = useAppSelector(s => s.auth);

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "", username: "", email: "", password: "", confirmPassword: "",
    phone: "", role: "student" as "student" | "teacher" | "admin", agree: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const pwStrength = checkPasswordStrength(form.password);

  const fieldError = useCallback((field: string): string | null => {
    if (!touched[field]) return null;
    switch (field) {
      case "fullName": return form.fullName.trim().length < 2 ? "Name must be at least 2 characters." : null;
      case "username": return !isValidUsername(form.username) ? "3-20 chars, letters, numbers, underscores." : null;
      case "email": return !isValidEmail(form.email) ? "Enter a valid email address." : null;
      case "phone": return form.phone && !isValidPhone(form.phone) ? "Enter a valid phone number." : null;
      case "password": return pwStrength.score < 3 ? "Password is too weak." : null;
      case "confirmPassword": return form.confirmPassword !== form.password ? "Passwords do not match." : null;
      default: return null;
    }
  }, [form, touched, pwStrength.score]);

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const touch = (field: string) => setTouched(t => ({ ...t, [field]: true }));

  const step1Valid = form.fullName.trim().length >= 2 && isValidUsername(form.username) && isValidEmail(form.email) && !fieldError("fullName") && !fieldError("username") && !fieldError("email");
  const step2Valid = pwStrength.score >= 3 && form.confirmPassword === form.password && form.agree;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    ["fullName", "username", "email", "phone"].forEach(touch);
    if (step1Valid) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ["password", "confirmPassword"].forEach(touch);
    if (!step2Valid) return;
    dispatch(signupThunk({
      fullName: form.fullName.trim(), username: form.username.trim().toLowerCase(),
      email: form.email.trim().toLowerCase(), password: form.password,
      phone: form.phone, role: form.role, remember: true,
    }));
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (otpSent) navigate("/verify-otp", { state: { email: form.email } });
  }, [otpSent, navigate, form.email]);

  useEffect(() => {
    if (isAuthenticated && !otpSent) navigate("/dashboard");
  }, [isAuthenticated, otpSent, navigate]);

  useEffect(() => { dispatch(clearError()); }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left – form */}
      <div className="flex-1 flex flex-col px-6 sm:px-12 lg:px-20 py-8 overflow-y-auto">
        <div className="mb-6">
          <Logo />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition ${
                    step >= s ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 border-transparent text-white" : "border-white/20 text-nova-muted"
                  }`}>{step > s ? <CheckCircle2 className="w-4 h-4" /> : s}</div>
                  <span className={`text-sm ${step === s ? "text-white" : "text-nova-muted"}`}>
                    {s === 1 ? "Personal info" : "Security"}
                  </span>
                  {s === 1 && <div className={`w-12 h-0.5 ${step > 1 ? "bg-violet-500" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
              Create your <span className="gradient-text">CodeNova</span> account
            </h1>
            <p className="text-nova-muted mt-2 text-sm">
              {step === 1 ? "Start coding, competing, and leveling up today." : "Secure your account with a strong password."}
            </p>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="mt-4"
                >
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearError())} className="ml-auto shrink-0 hover:text-white">×</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social buttons */}
            {step === 1 && (
              <>
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
                  <span className="text-xs text-nova-muted uppercase tracking-wider">or with email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              </>
            )}

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleStep1}
                  className="space-y-3"
                >
                  {/* Avatar upload */}
                  <div className="flex justify-center mb-2">
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="relative group">
                      <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group-hover:border-violet-400 transition">
                        {avatarPreview
                          ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                          : <Camera className="w-6 h-6 text-nova-muted" />}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center border-2 border-nova-bg">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                  </div>

                  <AuthField icon={User} label="Full Name" placeholder="Aarav Kumar"
                    value={form.fullName} onChange={v => set("fullName", v)} onBlur={() => touch("fullName")}
                    error={fieldError("fullName")} />

                  <AuthField icon={User} label="Username" placeholder="arav.dev"
                    value={form.username} onChange={v => set("username", v)} onBlur={() => touch("username")}
                    error={fieldError("username")}
                    hint="3-20 characters. This will be your public handle." />

                  <AuthField icon={Mail} label="Email" type="email" placeholder="you@codenova.ai"
                    value={form.email} onChange={v => set("email", v)} onBlur={() => touch("email")}
                    error={fieldError("email")} />

                  <AuthField icon={Phone} label="Phone (optional)" type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={v => set("phone", v)} onBlur={() => touch("phone")}
                    error={fieldError("phone")} />

                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1.5 block">I am a…</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["student", "teacher", "admin"] as const).map(r => (
                        <button key={r} type="button" onClick={() => set("role", r as string)}
                          className={`px-3 py-2 rounded-xl text-sm capitalize transition ${
                            form.role === r
                              ? "bg-gradient-to-r from-violet-500/30 to-fuchsia-500/20 border border-violet-500/40 text-white"
                              : "bg-white/5 border border-white/10 text-nova-muted hover:text-white hover:bg-white/10"
                          }`}>{r}</button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={!step1Valid}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition hover:shadow-violet-500/50">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  <button type="button" onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-sm text-nova-muted hover:text-white mb-2 transition">
                    <ArrowLeft className="w-4 h-4" /> Back to personal info
                  </button>

                  <div className="relative">
                    <AuthField icon={Lock} label="Password" type={showPw ? "text" : "password"} placeholder="••••••••••"
                      value={form.password} onChange={v => set("password", v)} onBlur={() => touch("password")}
                      error={fieldError("password")} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-[2.1rem] text-nova-muted hover:text-white">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {form.password && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full ${pwStrength.color} ${pwStrength.width} transition-all duration-300`} />
                        </div>
                        <span className={`text-xs font-semibold ${
                          pwStrength.score >= 4 ? "text-emerald-300" : pwStrength.score >= 3 ? "text-amber-300" : "text-rose-300"
                        }`}>{pwStrength.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {pwStrength.requirements.map(r => (
                          <div key={r.text} className={`flex items-center gap-1.5 text-[11px] ${r.met ? "text-emerald-300" : "text-nova-muted"}`}>
                            {r.met ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {r.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <AuthField icon={Shield} label="Confirm Password" type={showConfirm ? "text" : "password"} placeholder="••••••••••"
                      value={form.confirmPassword} onChange={v => set("confirmPassword", v)} onBlur={() => touch("confirmPassword")}
                      error={fieldError("confirmPassword")} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-[2.1rem] text-nova-muted hover:text-white">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-nova-muted cursor-pointer pt-1">
                    <input type="checkbox" checked={form.agree} onChange={e => set("agree", e.target.checked)}
                      className="mt-0.5 accent-violet-500" />
                    <span>I agree to the <a className="text-white underline">Terms of Service</a> and <a className="text-white underline">Privacy Policy</a></span>
                  </label>

                  <button type="submit" disabled={!step2Valid || loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition hover:shadow-violet-500/50">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : <><Sparkles className="w-4 h-4" /> Create account</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-nova-muted mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-white font-medium hover:underline">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right – marketing panel */}
      <SidePanel />

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
                      dispatch(socialLoginThunk({ provider: "google", email: acc.email, name: acc.name, remember: true }));
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
                dispatch(socialLoginThunk({ provider: "google", email: customEmail.trim(), name: customName.trim(), remember: true }));
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
                      dispatch(socialLoginThunk({ provider: "github", email: acc.email, name: acc.name, remember: true }));
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
                dispatch(socialLoginThunk({ provider: "github", email: customEmail.trim(), name: customName.trim(), remember: true }));
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

/* ── Reusable field ──────────────────────────────────────────────── */
interface AuthFieldProps {
  icon: React.ElementType;
  label: string;
  hint?: string;
  error?: string | null;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
}

function AuthField({ icon: Icon, label, hint, error, value, onChange, onBlur, placeholder, type }: AuthFieldProps) {
  return (
    <div>
      <label className="text-xs text-nova-muted font-medium mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border text-white text-sm placeholder:text-nova-muted/70 outline-none focus:ring-2 transition ${
            error ? "border-rose-500/50 focus:ring-rose-500/40" : "border-white/10 focus:ring-violet-500/40"
          }`} />
      </div>
      {hint && !error && <p className="text-[11px] text-nova-muted mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-rose-300 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
}

/* ── Side marketing panel ────────────────────────────────────────── */
function SidePanel() {
  return (
    <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-700/30 via-fuchsia-500/10 to-cyan-500/20" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-cyan-500/20 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-md text-center">
        <h2 className="font-display text-3xl font-extrabold leading-tight">
          Join <span className="gradient-text">2.4M+</span> developers coding smarter with Nova.
        </h2>
        <p className="text-nova-muted mt-4">
          "The AI hints explained dynamic programming better than any textbook. Landed my dream job 4 months later."
        </p>
        <p className="mt-2 text-sm text-white font-medium">Priya Sharma · SDE-2 @ Stripe</p>
        <ul className="mt-8 space-y-2 text-sm text-white text-left max-w-xs mx-auto">
          {["AI mentor in 7 languages", "Live weekly contests", "VS Code in your browser", "Free forever tier"].map(t => (
            <li key={t} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
