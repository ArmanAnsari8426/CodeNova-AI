import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface PaymentGatewayProps {
  amount: number;
  planName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentGateway({ amount, planName, onClose, onSuccess }: PaymentGatewayProps) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, "").length !== 16) {
      newErrors.number = "Please enter a valid 16-digit card number";
    }
    if (!cardDetails.name) {
      newErrors.name = "Cardholder name is required";
    }
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      newErrors.expiry = "Use MM/YY format";
    }
    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#7c5cff", "#19e2c5", "#ff5cc8"]
      });
      setTimeout(() => {
        onSuccess();
      }, 2500);
    }, 2500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-strong rounded-3xl p-10 max-w-md w-full border border-emerald-500/30 text-center bg-[#0c0c0e]"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-black text-white mb-2">Payment Successful!</h2>
          <p className="text-zinc-400 text-sm mb-6">
            You've successfully subscribed to <strong className="text-white">CodeNova AI {planName}</strong>. Welcome aboard!
          </p>
          <div className="bg-[#18181b] p-4 rounded-xl border border-white/5 mb-6">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Transaction ID</div>
            <div className="text-white font-mono text-sm">#TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
          </div>
          <p className="text-emerald-400 text-sm font-medium animate-pulse">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-strong rounded-3xl overflow-hidden max-w-2xl w-full border border-white/10 bg-[#0c0c0e] shadow-2xl"
      >
        {step === "processing" ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Processing Payment...</h3>
            <p className="text-zinc-400 text-sm">Please do not close this window</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-[#09090b] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Secure Payment</h2>
                <p className="text-zinc-400 text-sm mt-0.5">Complete your purchase for CodeNova AI {planName}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2">
              {/* Payment Form */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-400 text-sm">Amount to pay:</span>
                  <span className="text-2xl font-black text-white">${amount}</span>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#18181b] border text-white text-sm placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition font-mono ${errors.number ? "border-rose-500/50" : "border-white/10"}`}
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  </div>
                  {errors.number && <p className="text-[10px] text-rose-400 mt-1">{errors.number}</p>}
                </div>

                <div>
                  <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl bg-[#18181b] border text-white text-sm placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition ${errors.name ? "border-rose-500/50" : "border-white/10"}`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: formatExpiry(e.target.value)})}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-4 py-3 rounded-xl bg-[#18181b] border text-white text-sm placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition font-mono ${errors.expiry ? "border-rose-500/50" : "border-white/10"}`}
                    />
                    {errors.expiry && <p className="text-[10px] text-rose-400 mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">CVV</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3)})}
                        placeholder="123"
                        maxLength={3}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#18181b] border text-white text-sm placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition font-mono ${errors.cvv ? "border-rose-500/50" : "border-white/10"}`}
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    </div>
                    {errors.cvv && <p className="text-[10px] text-rose-400 mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Info Sidebar */}
              <div className="p-6 bg-[#09090b] border-l border-white/5 flex flex-col">
                <h3 className="text-white font-bold mb-4">Payment Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Plan</span>
                    <span className="text-white font-medium">CodeNova AI {planName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Billing Cycle</span>
                    <span className="text-white font-medium">Annual (Save 20%)</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-base">
                    <span className="text-zinc-300 font-bold">Total</span>
                    <span className="text-white font-black text-xl">${amount}</span>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <button
                    onClick={handlePay}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Pay Securely
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <div className="h-6 px-2 bg-white/5 rounded flex items-center justify-center text-[10px] text-zinc-400 font-bold">VISA</div>
                    <div className="h-6 px-2 bg-white/5 rounded flex items-center justify-center text-[10px] text-zinc-400 font-bold">Mastercard</div>
                    <div className="h-6 px-2 bg-white/5 rounded flex items-center justify-center text-[10px] text-zinc-400 font-bold">UPI</div>
                  </div>

                  <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                    By clicking "Pay Securely", you agree to our Terms of Service. Your payment is processed securely with 256-bit SSL encryption.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
