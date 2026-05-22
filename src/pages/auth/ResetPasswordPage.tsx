import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2, Shield, XCircle, PartyPopper } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetPasswordThunk, clearError, clearSuccess } from "@/redux/slices/authSlice";
import { checkPasswordStrength } from "@/utils/password";

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector(s => s.auth);

  const state = location.state as { email?: string } | null;
  const email = state?.email || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const pwStrength = checkPasswordStrength(password);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
    dispatch(clearError());
    dispatch(clearSuccess());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwStrength.score < 3 || password !== confirm) return;
    const result = await dispatch(resetPasswordThunk({ email, newPassword: password }));
    if (resetPasswordThunk.fulfilled.match(result)) setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nova-bg via-emerald-950/10 to-cyan-950/10" />
        <div className="absolute inset-0 grid-bg" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md text-center"
        >
          <div className="glass-strong rounded-3xl p-10 gradient-border">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6"
            >
              <PartyPopper className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="font-display text-3xl font-bold">Password reset!</h1>
            <p className="text-nova-muted mt-2">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>

            <button
              onClick={() => navigate("/login", { replace: true })}
              className="mt-8 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/50"
            >
              <ArrowRight className="w-4 h-4" /> Sign in now
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-nova-bg via-amber-950/10 to-violet-950/10" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4"><Logo /></div>
        </div>

        <div className="glass-strong rounded-3xl p-8 gradient-border">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <h1 className="font-display text-2xl font-bold text-center">Reset your password</h1>
          <p className="text-nova-muted text-sm text-center mt-2">
            Create a new, strong password for <strong className="text-white">{email}</strong>.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-nova-muted font-medium mb-1.5 block">New password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-nova-muted/70 outline-none focus:ring-2 focus:ring-violet-500/40 transition"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nova-muted hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="mt-2 space-y-1.5">
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
            </div>

            <div>
              <label className="text-xs text-nova-muted font-medium mb-1.5 block">Confirm new password</label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border text-white text-sm placeholder:text-nova-muted/70 outline-none focus:ring-2 transition ${
                    confirm && confirm !== password ? "border-rose-500/50 focus:ring-rose-500/40" : "border-white/10 focus:ring-violet-500/40"
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nova-muted hover:text-white">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-[11px] text-rose-300 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
            </div>

            <button type="submit" disabled={loading || pwStrength.score < 3 || password !== confirm}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition hover:shadow-violet-500/50">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</>
                : <>Reset password <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-nova-muted hover:text-white mt-6 transition">
            ← Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
