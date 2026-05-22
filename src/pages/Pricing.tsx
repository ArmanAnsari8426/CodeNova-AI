import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Rocket, HelpCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import PaymentGateway from "@/components/PaymentGateway";

const PLANS = [
  {
    name: "Starter",
    priceMonthly: 0,
    priceAnnual: 0,
    cycle: "forever",
    desc: "Everything you need to start grinding.",
    icon: Rocket,
    color: "from-slate-500 to-slate-600",
    features: ["Compiler free forever", "19-language online IDE", "500+ free problems", "Weekly contests", "Basic AI hints (50/day)", "Public profile"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    priceMonthly: 12,
    priceAnnual: 10,
    cycle: "/ month",
    desc: "For serious learners preparing for interviews.",
    icon: Sparkles,
    color: "from-violet-500 to-fuchsia-500",
    features: ["Everything in Starter", "All 3,000+ premium problems", "Unlimited AI mentor", "AI mock interviews", "Custom test cases", "Detailed solutions & video", "Priority Judge0 queue", "Certificate generation"],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Team",
    priceMonthly: 49,
    priceAnnual: 39,
    cycle: "/ seat / month",
    desc: "For bootcamps, teachers, and engineering teams.",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    features: ["Everything in Pro", "Teacher dashboard", "Student management", "Custom contests & problems", "SSO + admin controls", "Analytics & reports", "Dedicated success manager"],
    cta: "Contact sales",
    highlight: false,
  },
];

const COMPARISON_FEATURES = [
  { name: "Curated DSA Problem Bank", starter: "500+ Problems", pro: "3,000+ Problems", team: "3,000+ + Custom" },
  { name: "Cloud Compiler Execution", starter: "Standard Queue", pro: "Priority Isolated V8/Docker", team: "Dedicated Cluster" },
  { name: "Nova AI Mentoring Engine", starter: "50 Hints / Day", pro: "Unlimited 24/7 AST Mentor", team: "Unlimited + Custom Prompts" },
  { name: "AI Mock Interview Simulator", starter: "Basic Text Only", pro: "Full Voice + Whiteboard", team: "Custom Company Scenarios" },
  { name: "Professional CV Builder", starter: "Standard Export", pro: "AI ATS Optimization", team: "Custom Branding" },
  { name: "Verified Certification", starter: "❌", pro: "Cryptographic Certificate", team: "Custom Issuer Branding" },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ amount: 0, name: "" });

  const handleSubscribe = (plan: typeof PLANS[0]) => {
    if (plan.name === "Team") {
      alert("📧 For Team plans, please contact sales@codenova.ai for custom pricing!");
      return;
    }
    setSelectedPlan({ amount: annual ? plan.priceAnnual * 12 : plan.priceMonthly, name: plan.name });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    alert("🎉 Welcome to CodeNova AI Pro! Your premium features are now unlocked.");
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Payment Gateway Modal */}
        {showPayment && (
          <PaymentGateway
            amount={selectedPlan.amount}
            planName={selectedPlan.name}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Simple, transparent pricing
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Invest in your <span className="gradient-text">Future</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg max-w-xl mx-auto leading-relaxed">
            The compiler is always free. Upgrade only if you want unlimited AI mentoring, premium company problem sets, certificates, and FAANG interview simulations.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold ${!annual ? "text-white" : "text-nova-muted"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-16 h-8 rounded-full bg-white/10 p-1 transition border border-white/10"
              aria-label="Toggle annual billing"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-md"
                animate={{ x: annual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${annual ? "text-white" : "text-nova-muted"}`}>Annual</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-pulse">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 items-stretch">
          {PLANS.map((p, i) => {
            const price = annual ? p.priceAnnual : p.priceMonthly;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between ${
                  p.highlight
                    ? "glass-strong gradient-border scale-105 z-10 shadow-2xl shadow-violet-500/10"
                    : "glass border border-white/5 hover:border-white/10 transition"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold shadow-lg shadow-violet-500/40 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg text-white mb-6`}>
                    <p.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-nova-muted mt-1.5 min-h-[36px] leading-relaxed">{p.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mt-6 border-b border-white/10 pb-6">
                    <span className="font-display text-5xl font-extrabold text-white">${price}</span>
                    <span className="text-nova-muted text-xs font-medium">{p.cycle} {annual && p.priceAnnual > 0 ? "(billed annually)" : ""}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-white/90">
                        <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${p.highlight ? "bg-violet-500/30 text-violet-200" : "bg-emerald-500/20 text-emerald-300"}`}>
                          <Check className="w-3 h-3" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(p)}
                  className={`mt-8 w-full py-3.5 rounded-xl text-xs font-semibold tracking-wide transition uppercase flex items-center justify-center gap-1.5 ${
                    p.highlight
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {p.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="glass-strong rounded-3xl p-8 sm:p-10 border border-white/10 mb-20 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <Zap className="w-6 h-6 text-amber-400" />
            <h2 className="font-display text-2xl font-bold text-white">Compare Plan Features</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-nova-muted bg-white/[0.02]">
                  <th className="py-4 px-4 font-bold">Feature Category</th>
                  <th className="py-4 px-4 font-bold">Starter</th>
                  <th className="py-4 px-4 font-bold text-violet-300">Pro</th>
                  <th className="py-4 px-4 font-bold text-amber-300">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white/90">
                {COMPARISON_FEATURES.map((cf, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-4 font-semibold text-white">{cf.name}</td>
                    <td className="py-4 px-4 text-nova-muted">{cf.starter}</td>
                    <td className="py-4 px-4 font-bold text-violet-200 bg-violet-500/5">{cf.pro}</td>
                    <td className="py-4 px-4 font-bold text-amber-200">{cf.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <h2 className="font-display text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto font-sans">
            {[
              { q: "Can I cancel my subscription anytime?", a: "Yes! You can cancel your Pro or Team subscription with a single click from your billing dashboard. You will retain premium access until the end of your current billing cycle." },
              { q: "Is there a student or academic discount?", a: "We offer a 50% discount on the Pro plan for students with a verified .edu email address. Simply sign up with your academic email to automatically apply the discount." },
              { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, Apple Pay, Google Pay, and localized payment methods via Stripe. Enterprise team plans also support invoicing and ACH transfers." },
              { q: "What are the limits on the free Starter tier?", a: "You can run code in the online compiler unlimited times, solve over 500+ foundational DSA challenges, and receive up to 50 AI mentoring hints per day." },
              { q: "Do you offer a money-back guarantee?", a: "Yes, we offer a 30-day no-questions-asked money-back guarantee on all Pro subscriptions. If you are not fully satisfied, email support@codenova.ai for an instant refund." },
              { q: "Is my code and interview data private?", a: "Absolutely. All code submissions, custom test cases, and AI mock interview transcripts are encrypted with AES-256 and remain strictly private to your account." },
            ].map((f, i) => (
              <div key={i} className="glass rounded-3xl p-6 border border-white/5 space-y-2 hover:border-white/10 transition">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> {f.q}
                </h3>
                <p className="text-xs text-nova-muted leading-relaxed pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
