import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Code2, Trophy, Bot, ArrowRight, CheckCircle2, Star,
  BookOpen, Play, Brain, BarChart3, Eye, Target,
  Shield, FileText, Briefcase, Building2, Newspaper, Lock, Cpu,
  Map, GraduationCap, DollarSign, HeartHandshake, Flame,
  Rocket, MessageSquare, Scale, Zap, Award, TrendingUp,
} from "lucide-react";
import { TESTIMONIALS, PROBLEMS, BLOG_POSTS, LANGUAGES } from "@/data/mock";

/* ════════════════════════════════════════════════════════════════
   ULTRA-FAST TYPING ANIMATION (multi-language showcase)
   ════════════════════════════════════════════════════════════════ */
const TYPING_DEMOS = [
  {
    lang: "Python",
    color: "from-blue-400 to-yellow-400",
    code: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Print first 10 numbers
print(list(fibonacci(10)))
# → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
  },
  {
    lang: "JavaScript",
    color: "from-yellow-400 to-amber-500",
    code: `const fibonacci = function* () {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
};

const fib = fibonacci();
const seq = Array.from({ length: 10 }, () => fib.next().value);
console.log(seq);`,
  },
  {
    lang: "C++",
    color: "from-blue-600 to-indigo-700",
    code: `#include <iostream>
#include <vector>
using namespace std;

vector<int> fib(int n) {
  vector<int> seq = {0, 1};
  for (int i = 2; i < n; i++)
    seq.push_back(seq[i-1] + seq[i-2]);
  return seq;
}

int main() {
  for (int x : fib(10)) cout << x << " ";
}`,
  },
];

function TypingTerminal() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const current = TYPING_DEMOS[activeIdx];
    const fullText = current.code;

    if (!isDeleting && indexRef.current < fullText.length) {
      const timer = setTimeout(() => {
        indexRef.current += 1;
        setTypedText(fullText.slice(0, indexRef.current));
      }, 18); // Fast typing speed
      return () => clearTimeout(timer);
    }

    if (!isDeleting && indexRef.current === fullText.length) {
      const pause = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(pause);
    }

    if (isDeleting && indexRef.current > 0) {
      const timer = setTimeout(() => {
        indexRef.current -= 1;
        setTypedText(fullText.slice(0, indexRef.current));
      }, 8); // Faster deletion
      return () => clearTimeout(timer);
    }

    if (isDeleting && indexRef.current === 0) {
      setIsDeleting(false);
      setActiveIdx((i) => (i + 1) % TYPING_DEMOS.length);
    }
  }, [typedText, isDeleting, activeIdx]);

  const current = TYPING_DEMOS[activeIdx];
  const lines = typedText.split("\n");

  return (
    <div className="relative rounded-2xl glass-strong overflow-hidden gradient-border shadow-2xl shadow-violet-500/20">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/40">
        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <div className={`ml-3 flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r ${current.color} bg-opacity-20`}>
          <Code2 className="w-3 h-3 text-white" />
          <span className="text-xs text-white font-bold font-mono">{current.lang}</span>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </span>
      </div>

      {/* Code */}
      <div className="p-5 font-mono text-[13px] leading-[1.7] min-h-[320px] max-h-[380px] overflow-hidden bg-[#0a0a14]">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-nova-muted/30 w-7 shrink-0 select-none text-right pr-3">{i + 1}</span>
            <span className="whitespace-pre text-emerald-300/95">
              {line}
              {i === lines.length - 1 && <span className="inline-block w-2 h-4 -mb-0.5 bg-violet-400 animate-caret ml-0.5" />}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-2.5 bg-black/40 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">✓ Output ready</span>
          <span className="text-nova-muted">⏱ 42ms · 💾 14.2 MB</span>
        </div>
        <span className="text-violet-300 flex items-center gap-1 font-medium">
          <Bot className="w-3 h-3" /> AI: Optimal O(n)!
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   FLOATING PARTICLES (background atmosphere)
   ════════════════════════════════════════════════════════════════ */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-400"
          style={{
            left: `${(i * 5.5) % 100}%`,
            animation: `float-up ${10 + (i % 5)}s linear ${i * 0.5}s infinite`,
            boxShadow: "0 0 10px rgba(124, 92, 255, 0.7)",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ════════════════════════════════════════════════════════════════ */
function Counter({ value, suffix = "", duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(value);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const formatNum = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  return <span ref={ref}>{formatNum(count)}{suffix}</span>;
}

/* ════════════════════════════════════════════════════════════════
   INFINITE SCROLLING LANGUAGE MARQUEE
   ════════════════════════════════════════════════════════════════ */
function LanguageMarquee() {
  const duplicated = [...LANGUAGES, ...LANGUAGES];
  return (
    <div className="relative overflow-hidden py-4">
      <div className="flex gap-3 animate-scroll-x" style={{ width: "max-content" }}>
        {duplicated.map((l, i) => (
          <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 glass rounded-xl border border-white/[0.04] shrink-0">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${l.color} flex items-center justify-center text-white font-bold text-[10px] shadow-md`}>
              {l.icon}
            </div>
            <span className="text-sm text-white font-semibold whitespace-nowrap">{l.name}</span>
          </div>
        ))}
      </div>
      {/* Edge fade */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-nova-bg to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-nova-bg to-transparent pointer-events-none" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION HELPERS
   ════════════════════════════════════════════════════════════════ */
function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

function SectionHead({ id, badge, badgeIcon: Icon, title, titleHighlight, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-14 max-w-3xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-nova-muted font-medium mb-4">
        <Icon className="w-3.5 h-3.5 text-violet-400" /> {badge}
      </div>
      <h2 id={`${id}-title`} className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">
        {title} <span className="gradient-text animate-gradient">{titleHighlight}</span>
      </h2>
      {desc && <p className="text-nova-muted mt-4 text-base sm:text-lg leading-relaxed">{desc}</p>}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════ */
const PLATFORM = [
  { icon: BookOpen, title: "3,000+ Problems", desc: "Curated DSA problems tagged by topic, difficulty, and company.", to: "/problems", color: "from-emerald-500 to-teal-500", stat: "3K+" },
  { icon: Code2, title: "Online Compiler", desc: "19-language cloud IDE with Live Web Preview and AI hints.", to: "/compiler", color: "from-cyan-500 to-blue-500", stat: "19" },
  { icon: Trophy, title: "Live Contests", desc: "Weekly contests with real-time leaderboards and cash prizes.", to: "/contests", color: "from-amber-500 to-orange-500", stat: "$25K" },
  { icon: Bot, title: "AI Assistant", desc: "GPT-class mentor that debugs, reviews, and explains algorithms.", to: "/ai-assistant", color: "from-violet-500 to-fuchsia-500", stat: "92M" },
  { icon: BarChart3, title: "Leaderboard", desc: "Global ELO rankings, heatmaps, streaks, and achievements.", to: "/leaderboard", color: "from-rose-500 to-pink-500", stat: "2.4M" },
  { icon: Eye, title: "Web Preview", desc: "Build HTML/CSS/JS with real-time iframe rendering.", to: "/compiler", color: "from-indigo-500 to-violet-500", stat: "Live" },
];

const LEARN = [
  { icon: BookOpen, title: "Blog & Tutorials", desc: "Long-form DSA guides, AI breakthroughs, career advice.", to: "/blog", color: "from-violet-500 to-fuchsia-500" },
  { icon: Map, title: "DSA Roadmap", desc: "5-stage curriculum from arrays to advanced graphs.", to: "/roadmap", color: "from-cyan-500 to-blue-500" },
  { icon: Briefcase, title: "Interview Prep", desc: "Company tracks for Google, Meta, Amazon, Apple.", to: "/interview-prep", color: "from-amber-500 to-orange-500" },
  { icon: FileText, title: "Resume Builder", desc: "ATS-optimized CV with 3 templates and AI keywords.", to: "/resume-builder", color: "from-emerald-500 to-teal-500" },
  { icon: Brain, title: "AI Interviewer", desc: "Live mock interviews with voice and scorecards.", to: "/ai-interviewer", color: "from-rose-500 to-pink-500" },
];

const COMPANY = [
  { icon: DollarSign, title: "Pricing", desc: "Free forever. Pro for unlimited AI. Team for enterprises.", to: "/pricing" },
  { icon: Building2, title: "About Us", desc: "Our mission, vision, and the team behind CodeNova.", to: "/about" },
  { icon: HeartHandshake, title: "Careers", desc: "Remote-first. M3 MacBooks. Join our team.", to: "/careers" },
  { icon: MessageSquare, title: "Contact", desc: "Reach support, sales, or press teams.", to: "/contact" },
  { icon: Newspaper, title: "Press & Media", desc: "Brand assets, press releases, and bios.", to: "/press" },
];

const LEGAL = [
  { icon: Lock, title: "Privacy Policy", desc: "GDPR & CCPA compliant. AES-256 encryption.", to: "/privacy" },
  { icon: Scale, title: "Terms of Service", desc: "Usage agreements and IP rights.", to: "/terms" },
  { icon: Shield, title: "Security", desc: "SOC-2 Type II. Docker sandbox. Bug bounty.", to: "/security" },
  { icon: Cpu, title: "System Status", desc: "Real-time uptime monitoring. 99.99% SLA.", to: "/status" },
];

const PROCESS = [
  { step: "01", icon: Target, title: "Choose Your Track", desc: "DSA, system design, frontend, ML — pick your path." },
  { step: "02", icon: Code2, title: "Write & Execute", desc: "Code in 19 languages with AI hints and debugging." },
  { step: "03", icon: Sparkles, title: "Learn with AI", desc: "Your mentor explains concepts and reviews code." },
  { step: "04", icon: Trophy, title: "Compete & Earn", desc: "Join contests, climb ranks, land your dream job." },
];

const FINAL_TECH = [
  { title: "Frontend", value: "React + Vite + Tailwind + Framer Motion", icon: Code2 },
  { title: "Auth & Database", value: "Supabase Auth, Postgres, RLS policies", icon: Shield },
  { title: "Compiler", value: "Free forever, 19 languages, Piston + Browser V8", icon: Cpu },
  { title: "AI Layer", value: "Nova AI mentor, reviewer, debugger, interviewer", icon: Bot },
  { title: "Email", value: "Resend OTP, alerts, reminders", icon: MessageSquare },
  { title: "Payments", value: "Optional Pro subscriptions + contest registration fees", icon: DollarSign },
];

const TRUSTED_BRANDS = ["Google", "Meta", "Stripe", "Vercel", "Amazon", "MIT", "Netflix", "Airbnb"];

const COMPARISON = [
  {
    title: "Traditional coding sites",
    items: [
      "Problems only",
      "No real AI guidance",
      "Basic compiler experience",
      "Weak interview preparation",
    ],
    accent: "from-slate-500 to-slate-700",
  },
  {
    title: "CodeNova AI",
    items: [
      "Problems + compiler + AI + contests",
      "Real-time AI assistant & interviewer",
      "19-language live IDE with preview",
      "Resume builder + roadmap + rankings",
    ],
    accent: "from-violet-500 to-cyan-500",
  },
];

/* ════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="relative">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 sm:pt-44 pb-24 overflow-hidden">
        <FloatingParticles />
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="lg:pt-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-xs text-nova-muted font-medium"
              >
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 animate-ping opacity-60" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                </span>
                Nova Weekly #142 live · <span className="text-white font-semibold">8,421 online</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.04] tracking-tight mt-5"
              >
                Code better,{" "}
                <span className="gradient-text animate-gradient">learn faster</span>,<br />
                ship bigger.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-nova-muted text-base sm:text-lg mt-5 max-w-lg leading-relaxed"
              >
                The AI-powered platform where <strong className="text-white">2.4M+ developers</strong> practice DSA, run 19 languages live, join contests, and prepare for FAANG interviews — completely free.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-3 mt-8"
              >
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 text-white font-semibold shadow-xl shadow-violet-500/30 hover:shadow-violet-500/60 transition-all hover:scale-[1.05] active:scale-[0.98] overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Sparkles className="w-4 h-4 relative" /> <span className="relative">Start coding free</span>{" "}
                  <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/compiler"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-medium hover:bg-white/[0.08] hover:border-white/20 transition-all hover:scale-[1.03]"
                >
                  <Play className="w-4 h-4 text-emerald-400" fill="currentColor" /> Try compiler
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-xs sm:text-sm text-nova-muted"
              >
                {["No credit card", "19 languages", "Free forever", "AI mentor 24/7"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Animated terminal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-400/20 blur-3xl rounded-3xl pointer-events-none animate-pulse" />
                <TypingTerminal />

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 glass-strong rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xl z-10 border border-white/10"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="text-white font-bold">+50 XP</div>
                    <div className="text-nova-muted">Accepted</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 glass-strong rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xl z-10 border border-white/10"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="text-white font-bold">AI Hint</div>
                    <div className="text-nova-muted">Use hash map</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUSTED BRANDS ═══════════ */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-nova-muted font-bold mb-5">
            Trusted by engineers from
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {TRUSTED_BRANDS.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="panel rounded-2xl p-4 text-center border border-white/[0.04]"
              >
                <div className="text-sm font-display font-bold text-white/80 tracking-tight">{brand}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ANIMATED COUNTER STATS ═══════════ */}
      <section className="py-12 border-y border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: 2400000, suffix: "+", label: "Active Developers" },
            { value: 19, suffix: "", label: "Languages Supported" },
            { value: 3000, suffix: "+", label: "DSA Problems" },
            { value: 92000000, suffix: "+", label: "AI Hints Served" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center glass rounded-2xl p-5 border border-white/[0.04]"
            >
              <div className="font-display text-3xl sm:text-4xl font-extrabold gradient-text animate-gradient">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-white mt-1 font-semibold uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ INFINITE LANGUAGE MARQUEE ═══════════ */}
      <section className="py-8">
        <div className="text-center mb-4">
          <p className="text-xs text-nova-muted uppercase tracking-widest font-bold">
            ⚡ Run code in 19 languages instantly
          </p>
        </div>
        <LanguageMarquee />
      </section>

      {/* ═══════════ FINAL TECH STACK ═══════════ */}
      <Section id="tech-stack" className="bg-gradient-to-b from-transparent via-violet-950/5 to-transparent">
        <SectionHead
          id="tech-stack"
          badge="Final Tech Stack"
          badgeIcon={Rocket}
          title="Built on a"
          titleHighlight="production-ready stack"
          desc="CodeNova AI is designed as a real startup-ready platform: fast frontend, secure auth, scalable database, free compiler, optional subscriptions, and contest payments."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FINAL_TECH.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-6 border border-white/[0.05] hover:border-violet-500/30 hover:bg-white/[0.04] transition"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg mb-4">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-nova-muted leading-relaxed">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl glass-strong border border-emerald-500/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-1">Compiler Promise</div>
            <h3 className="font-display text-2xl font-bold text-white">The online compiler stays free forever.</h3>
            <p className="text-sm text-nova-muted mt-1">Subscriptions are optional for AI Pro tools, interview simulator, premium editorials, certificates, and team dashboards.</p>
          </div>
          <Link to="/compiler" className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition flex items-center gap-2 shrink-0">
            <Play className="w-4 h-4" /> Use Compiler Free
          </Link>
        </div>
      </Section>

      {/* ═══════════ PLATFORM ═══════════ */}
      <Section id="platform">
        <SectionHead id="platform" badge="Core Platform" badgeIcon={Rocket} title="Everything you need to" titleHighlight="level up" desc="From your first hello-world to landing a FAANG offer — one unified platform." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORM.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                to={f.to}
                className="group glass rounded-2xl p-6 border border-white/[0.04] hover:border-violet-500/30 transition-all hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-nova-muted font-mono font-bold">
                    {f.stat}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-nova-muted leading-relaxed flex-1">{f.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-300 mt-4 group-hover:text-violet-200 transition">
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════ LEARN ═══════════ */}
      <Section id="learn" className="bg-gradient-to-b from-transparent via-violet-950/5 to-transparent">
        <SectionHead id="learn" badge="Learning Hub" badgeIcon={GraduationCap} title="Master coding with" titleHighlight="structured paths" desc="Tutorials, roadmaps, interview tracks, resume builder, and AI mock interviews." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARN.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={item.to} className="group glass rounded-2xl p-6 border border-white/[0.04] hover:border-violet-500/30 transition-all hover:-translate-y-1 hover:bg-white/[0.04] flex flex-col h-full">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-nova-muted leading-relaxed flex-1">{item.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-300 mt-4 group-hover:text-violet-200">
                  Start learning <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.36 }}>
            <div className="group glass-strong rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col h-full bg-amber-500/5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-amber-500/30">
                  Pro Plan
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">CodeNova AI Pro</h3>
              <p className="text-sm text-nova-muted leading-relaxed flex-1">Unlock unlimited AI mentoring, FAANG mock interviews, premium problems, and certificates.</p>
              <Link to="/pricing" className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs text-center shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all">
                Upgrade to Pro
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <Section id="process">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs text-nova-muted font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> How it works
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold mt-4 leading-tight">
              From <span className="gradient-text">zero</span> to <span className="gradient-text">hero</span>.
            </h2>
            <p className="text-nova-muted mt-4 text-base max-w-md">
              A structured path with AI guidance at every step. Stop guessing — start building.
            </p>
            <Link to="/roadmap" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl glass-strong border border-white/10 text-white text-sm font-semibold hover:bg-white/[0.06] transition">
              View DSA Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 flex gap-5 items-center border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.04] transition"
              >
                <div className="font-display font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-cyan-400 w-12 text-center shrink-0">
                  {p.step}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <p.icon className="w-4 h-4 text-violet-400" /> {p.title}
                  </div>
                  <p className="text-sm text-nova-muted mt-0.5">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ TRENDING PROBLEMS ═══════════ */}
      <Section id="problems" className="bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs text-nova-muted font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Trending this week
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-3">
              Coding <span className="gradient-text">problems</span>
            </h2>
          </div>
          <Link to="/problems" className="text-sm font-semibold text-violet-300 hover:text-violet-200 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.04]">
          <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b border-white/5 text-[10px] uppercase tracking-wider text-nova-muted font-bold bg-white/[0.02]">
            <div className="col-span-1">#</div><div className="col-span-5">Title</div><div className="col-span-2">Difficulty</div><div className="col-span-3">Tags</div><div className="col-span-1 text-right">Acc.</div>
          </div>
          {PROBLEMS.slice(0, 6).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <Link to={`/problems/${p.slug}`} className="grid grid-cols-2 sm:grid-cols-12 gap-2 px-5 py-3.5 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.03] transition items-center">
                <div className="sm:col-span-1 text-nova-muted font-mono text-xs">{p.number}.</div>
                <div className="col-span-2 sm:col-span-5 text-white font-medium text-sm">{p.title}</div>
                <div className="sm:col-span-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.difficulty === "Easy" ? "text-emerald-300 bg-emerald-500/10" : p.difficulty === "Medium" ? "text-amber-300 bg-amber-500/10" : "text-rose-300 bg-rose-500/10"}`}>
                    {p.difficulty}
                  </span>
                </div>
                <div className="sm:col-span-3 flex flex-wrap gap-1">
                  {p.tags.slice(0, 2).map((t) => <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-nova-muted">{t}</span>)}
                </div>
                <div className="sm:col-span-1 text-right text-[11px] text-nova-muted font-mono">{p.acceptance}%</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════ WHY CODENOVA AI ═══════════ */}
      <Section id="comparison" className="bg-gradient-to-b from-transparent via-slate-950/10 to-transparent">
        <SectionHead id="comparison" badge="Why CodeNova AI" badgeIcon={TrendingUp} title="A smarter alternative to" titleHighlight="traditional platforms" desc="More than coding problems — a complete AI-powered developer growth system." />
        <div className="grid lg:grid-cols-2 gap-5">
          {COMPARISON.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`panel rounded-3xl p-8 border border-white/[0.05] ${i === 1 ? "gradient-border" : ""}`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-white shadow-lg mb-5`}>
                {i === 0 ? <Shield className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-5">{card.title}</h3>
              <div className="space-y-3">
                {card.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.04] p-4">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${i === 0 ? "text-slate-400" : "text-emerald-400"}`} />
                    <span className="text-sm text-white/90 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════ COMPANY ═══════════ */}
      <Section id="company">
        <SectionHead id="company" badge="About CodeNova AI" badgeIcon={Building2} title="The team behind" titleHighlight="your growth" desc="Our mission, pricing, careers, and how to reach us." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPANY.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={item.to} className="group glass rounded-2xl p-6 border border-white/[0.04] hover:border-violet-500/30 transition-all hover:bg-white/[0.04] hover:-translate-y-1 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-nova-muted leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <Section id="testimonials" className="bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
        <SectionHead id="testimonials" badge="Trusted by millions" badgeIcon={Star} title="Built for" titleHighlight="winners" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 flex flex-col h-full border border-white/[0.04] hover:border-amber-500/20 hover:-translate-y-1 transition-all"
            >
              <div className="flex gap-0.5 mb-3">
                {Array(5).fill(0).map((_, n) => <Star key={n} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-white/85 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.04]">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.color} text-white font-bold flex items-center justify-center text-[10px]`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[10px] text-nova-muted">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════ LEGAL & TRUST ═══════════ */}
      <Section id="legal">
        <SectionHead id="legal" badge="Trust & Compliance" badgeIcon={Shield} title="Enterprise-grade" titleHighlight="security" desc="Your code, data, and interviews are encrypted and private. SOC-2 compliant." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEGAL.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={item.to} className="group glass rounded-2xl p-6 border border-white/[0.04] hover:border-emerald-500/20 transition-all hover:bg-white/[0.03] hover:-translate-y-1 flex flex-col h-full">
                <item.icon className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition" />
                <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-nova-muted leading-relaxed flex-1">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════ BLOG ═══════════ */}
      <Section id="blog" className="bg-gradient-to-b from-transparent via-violet-950/5 to-transparent">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs text-nova-muted font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Latest articles
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-3">
              From the <span className="gradient-text">blog</span>
            </h2>
          </div>
          <Link to="/blog" className="text-sm font-semibold text-violet-300 hover:text-violet-200 flex items-center gap-1">
            All posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {BLOG_POSTS.slice(0, 3).map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to="/blog" className="glass rounded-2xl p-5 border border-white/[0.04] hover:border-violet-500/30 transition-all group hover:-translate-y-1 hover:bg-white/[0.04] block h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition`}>
                  {post.emoji}
                </div>
                <div className="text-[10px] text-violet-300 font-bold uppercase tracking-wider mb-1.5">{post.category}</div>
                <h3 className="font-display text-base font-bold text-white group-hover:text-violet-300 transition line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-nova-muted line-clamp-2">{post.excerpt}</p>
                <div className="text-[10px] text-nova-muted mt-3">{post.author} · {post.readMins} min read</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════ CREATOR CREDIT ═══════════ */}
      <Section className="py-12">
        <div className="text-center">
          <div className="glass rounded-3xl p-8 border border-white/10 inline-block max-w-lg">
            <p className="text-nova-muted text-sm mb-3">Created with passion by</p>
            <a
              href="https://armanansari8426.github.io/Arman-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg">
                AA
              </div>
              <div className="text-left">
                <div className="text-xl font-display font-extrabold gradient-text group-hover:opacity-80 transition">
                  Arman Ansari
                </div>
                <div className="text-xs text-nova-muted group-hover:text-white transition">
                  Full-Stack Developer • View Portfolio →
                </div>
              </div>
            </a>
          </div>
        </div>
      </Section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative py-24 overflow-hidden">
        <FloatingParticles />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden glass-strong gradient-border p-10 sm:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-fuchsia-500/10 to-cyan-400/15 animate-gradient pointer-events-none" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-500/30 blur-3xl rounded-full pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs text-white font-semibold backdrop-blur-md">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Join 2.4M+ developers
              </div>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold mt-5 leading-tight">
                Your future self <br />
                <span className="gradient-text animate-gradient">will thank you.</span>
              </h2>
              <p className="text-nova-muted mt-4 text-base sm:text-lg max-w-lg mx-auto">
                Free forever. Upgrade when ready. Cancel anytime. No credit card.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link
                  to="/signup"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-xl shadow-violet-500/25 hover:shadow-violet-500/50 hover:scale-[1.05] transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Start coding free
                </Link>
                <Link
                  to="/pricing"
                  className="px-7 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-semibold hover:bg-white/[0.08] hover:scale-[1.03] transition-all flex items-center gap-2"
                >
                  View pricing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
