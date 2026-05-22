import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CreditCard, Shield, CheckCircle2, AlertCircle, Clock, Users, 
  Trophy, ArrowLeft, Lock, Zap, Smartphone, Laptop
} from "lucide-react";
import { CONTESTS } from "@/data/mock";

// Mock Payment Gateway Component
function PaymentGateway({ amount, onPaymentComplete, onCancel }: any) {
  const [step, setStep] = useState<"card" | "processing" | "success">("card");
  const [cardDetails, setCardDetails] = useState({
    number: "", name: "", expiry: "", cvv: ""
  });
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
      alert("Please fill all card details");
      return;
    }
    setLoading(true);
    setStep("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 2500);
  };

  if (step === "success") {
    return (
      <div className="text-center py-12">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-2xl font-black text-white mb-2">Payment Successful!</h3>
        <p className="text-nova-muted">You're registered for the contest. Redirecting to arena...</p>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6" />
        <h3 className="text-xl font-bold text-white mb-2">Processing Payment...</h3>
        <p className="text-nova-muted text-sm">Please do not close this window</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Amount Display */}
      <div className="glass rounded-2xl p-6 border border-white/10 text-center">
        <div className="text-nova-muted text-sm font-bold uppercase tracking-widest mb-2">Registration Fee</div>
        <div className="text-4xl font-black text-white">₹{amount}</div>
        <div className="text-xs text-nova-muted mt-2 flex items-center justify-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" /> Secure 256-bit SSL Encrypted Payment
        </div>
      </div>

      {/* Card Form */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-nova-muted font-bold uppercase tracking-wider mb-2 block">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nova-muted" />
            <input
              type="text"
              value={cardDetails.number}
              onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-nova-muted/50 outline-none focus:border-violet-500/50 transition font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-nova-muted font-bold uppercase tracking-wider mb-2 block">Cardholder Name</label>
          <input
            type="text"
            value={cardDetails.name}
            onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
            placeholder="John Doe"
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-nova-muted/50 outline-none focus:border-violet-500/50 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-nova-muted font-bold uppercase tracking-wider mb-2 block">Expiry Date</label>
            <input
              type="text"
              value={cardDetails.expiry}
              onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-nova-muted/50 outline-none focus:border-violet-500/50 transition font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-nova-muted font-bold uppercase tracking-wider mb-2 block">CVV</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
              <input
                type="password"
                value={cardDetails.cvv}
                onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})}
                placeholder="123"
                maxLength={4}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-nova-muted/50 outline-none focus:border-violet-500/50 transition font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/5">
        <div className="h-8 px-3 bg-white/5 rounded flex items-center justify-center text-xs text-nova-muted font-bold">VISA</div>
        <div className="h-8 px-3 bg-white/5 rounded flex items-center justify-center text-xs text-nova-muted font-bold">Mastercard</div>
        <div className="h-8 px-3 bg-white/5 rounded flex items-center justify-center text-xs text-nova-muted font-bold">UPI</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition border border-white/10">
          Cancel
        </button>
        <button 
          onClick={handlePay} 
          disabled={loading}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold hover:scale-[1.02] transition shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Shield className="w-5 h-5" /> Pay Now</>}
        </button>
      </div>

      <p className="text-[10px] text-nova-muted text-center leading-relaxed">
        By clicking "Pay Now", you agree to our Terms of Service and Contest Rules. 
        Registration fee is non-refundable after contest starts.
      </p>
    </div>
  );
}

function Loader2({ className }: any) {
  return <div className={`w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ${className}`} />;
}

export default function ContestRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contest = CONTESTS.find(c => c.id === id);
  const [showPayment, setShowPayment] = useState(false);
  const [registered, setRegistered] = useState(false);

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Contest Not Found</h1>
          <Link to="/contests" className="text-violet-400 hover:underline">← Back to Contests</Link>
        </div>
      </div>
    );
  }

  const handleRegistrationComplete = () => {
    setRegistered(true);
    // In real app, save to database here
    localStorage.setItem(`contest_${id}_registered`, 'true');
    localStorage.setItem(`contest_${id}_paid`, 'true');
    
    // Auto-redirect to arena after payment
    setTimeout(() => {
      navigate(`/contest/${id}/arena`);
    }, 2500);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Back Button */}
        <button onClick={() => navigate("/contests")} className="flex items-center gap-2 text-nova-muted hover:text-white mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Contests
        </button>

        {!showPayment ? (
          /* Registration Info Page */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Contest Header */}
            <div className={`relative p-8 bg-gradient-to-br ${contest.banner} overflow-hidden`}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm font-bold uppercase tracking-widest">Paid Contest</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">{contest.title}</h1>
                <div className="flex flex-wrap gap-4 text-white/90 text-sm font-semibold">
                  <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <Clock className="w-4 h-4 text-cyan-400" /> {contest.durationMins} Minutes
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <Users className="w-4 h-4 text-amber-400" /> {contest.participants.toLocaleString()} Registered
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
                    <Zap className="w-4 h-4 text-violet-400" /> Prize: {contest.prize}
                  </span>
                </div>
              </div>
            </div>

            {/* Contest Details */}
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" /> Registration Requirements
                </h2>
                <ul className="space-y-2 text-nova-muted text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Registration fee is <strong className="text-white">₹299</strong> (non-refundable after contest starts)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>You must have a stable internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Once contest starts, you cannot exit until it ends (fullscreen mode enforced)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AI plagiarism detection is active - cheating leads to permanent ban</span>
                  </li>
                </ul>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-5 border border-white/5 text-center">
                  <Laptop className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm">Desktop Required</div>
                  <div className="text-[10px] text-nova-muted mt-1">Mobile not supported</div>
                </div>
                <div className="glass rounded-2xl p-5 border border-white/5 text-center">
                  <Smartphone className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm">Stable Internet</div>
                  <div className="text-[10px] text-nova-muted mt-1">Min 5 Mbps required</div>
                </div>
                <div className="glass rounded-2xl p-5 border border-white/5 text-center">
                  <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-sm">Be On Time</div>
                  <div className="text-[10px] text-nova-muted mt-1">Late entry not allowed</div>
                </div>
              </div>

              {registered ? (
                <div className="glass rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="text-white font-bold">You're Registered!</div>
                      <div className="text-sm text-nova-muted">Payment received. You can now enter the contest arena.</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/contest/${id}/arena`)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black uppercase tracking-wider hover:scale-[1.02] transition shadow-lg shadow-emerald-500/30"
                  >
                    Enter Contest Arena
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowPayment(true)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-black uppercase tracking-wider hover:scale-[1.02] transition shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" /> Register & Pay ₹299
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Payment Modal */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Secure Payment</h2>
              <button onClick={() => setShowPayment(false)} className="text-nova-muted hover:text-white transition">
                ✕
              </button>
            </div>
            <PaymentGateway 
              amount={299} 
              onPaymentComplete={handleRegistrationComplete}
              onCancel={() => setShowPayment(false)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
