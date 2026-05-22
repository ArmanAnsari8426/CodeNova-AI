import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyOtpThunk, sendOtpThunk, clearError, clearSuccess } from "@/redux/slices/authSlice";

export default function VerifyOtpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector(s => s.auth);

  const state = location.state as { email?: string; purpose?: "signup" | "reset" } | null;
  const email = state?.email || "";
  const purpose = state?.purpose || "signup";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
    dispatch(clearError());
    dispatch(clearSuccess());
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  useEffect(() => {
    if (isAuthenticated && purpose === "signup") navigate("/dashboard", { replace: true });
  }, [isAuthenticated, purpose, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(d => d !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
    if (pasted.length === 6) handleSubmit(pasted);
  };

  const handleSubmit = async (code?: string) => {
    const otpStr = code || otp.join("");
    if (otpStr.length !== 6) return;

    const result = await dispatch(verifyOtpThunk({ email, otp: otpStr }));

    if (verifyOtpThunk.fulfilled.match(result)) {
      if (purpose === "reset") {
        navigate("/reset-password", { state: { email } });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  };

  const handleResend = () => {
    dispatch(sendOtpThunk({ email, purpose: "verification" }));
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-nova-bg via-emerald-950/10 to-violet-950/10" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4"><Logo /></div>
        </div>

        <div className="glass-strong rounded-3xl p-8 gradient-border text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-white" />
          </div>

          <h1 className="font-display text-2xl font-bold">Verify your email</h1>
          <p className="text-nova-muted text-sm mt-2">
            Enter the 6-digit code sent to
          </p>
          <p className="text-white font-medium text-sm flex items-center justify-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5" /> {email}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm text-left">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP Input */}
          <div className="mt-8 flex justify-center gap-2.5">
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border-2 text-white outline-none transition ${
                  digit
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-white/10 focus:border-violet-500/60"
                }`}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={loading || otp.some(d => !d)}
            className="w-full mt-8 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition hover:shadow-violet-500/50"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
              : <><CheckCircle2 className="w-4 h-4" /> Verify OTP</>}
          </button>

          <div className="mt-4">
            {countdown > 0 ? (
              <span className="text-xs text-nova-muted">Resend code in {countdown}s</span>
            ) : (
              <button onClick={handleResend} className="text-xs text-violet-300 hover:text-violet-200 transition">
                Didn't receive it? <span className="font-semibold">Resend OTP</span>
              </button>
            )}
          </div>

          <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-nova-muted hover:text-white mt-6 transition">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
