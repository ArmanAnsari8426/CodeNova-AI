import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2, Shield, KeyRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sendOtpThunk, clearError, clearSuccess } from "@/redux/slices/authSlice";
import { isValidEmail } from "@/utils/password";

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(s => s.auth);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => { dispatch(clearError()); dispatch(clearSuccess()); }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    const result = await dispatch(sendOtpThunk({ email, purpose: "reset" }));
    if (sendOtpThunk.fulfilled.match(result)) {
      setSent(true);
      setCountdown(60);
    }
  };

  const handleResend = () => {
    dispatch(sendOtpThunk({ email, purpose: "reset" }));
    setCountdown(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* BG effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-nova-bg via-violet-950/10 to-cyan-950/10" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4"><Logo /></div>
        </div>

        <div className="glass-strong rounded-3xl p-8 gradient-border">
          {!sent ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-5">
                <KeyRound className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-center">Forgot password?</h1>
              <p className="text-nova-muted text-sm text-center mt-2">
                No worries. Enter your email and we'll send a 6-digit OTP to reset your password.
              </p>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1.5 block">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@codenova.ai"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-nova-muted/70 outline-none focus:ring-2 focus:ring-violet-500/40 transition"
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading || !isValidEmail(email)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition hover:shadow-violet-500/50">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP…</>
                    : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-center">Check your inbox</h1>
              <p className="text-nova-muted text-sm text-center mt-2">
                We sent a 6-digit OTP to <strong className="text-white">{email}</strong>. Enter it on the next screen to reset your password.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/verify-otp", { state: { email, purpose: "reset" } })}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/50"
                >
                  <Shield className="w-4 h-4" /> Enter OTP
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <span className="text-xs text-nova-muted">Resend OTP in {countdown}s</span>
                  ) : (
                    <button onClick={handleResend} className="text-xs text-violet-300 hover:text-violet-200 transition">
                      Didn't receive it? Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-nova-muted hover:text-white mt-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
