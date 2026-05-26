import { motion } from "framer-motion";
import { Users, Sparkles, Building2, Heart, Shield, Globe, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TEAM = [
  { name: "Aarav Kumar", role: "Co-Founder & CEO", bg: "from-violet-500 to-fuchsia-500", desc: "Ex-Google AI Lead. Passionate about democratizing developer education." },
  { name: "Priya Sharma", role: "Co-Founder & CTO", bg: "from-cyan-500 to-blue-600", desc: "Ex-Stripe Architect. Architected the Docker isolated execution sandbox." },
  { name: "Diego Rivera", role: "VP of Engineering", bg: "from-amber-500 to-orange-500", desc: "Ex-Meta Core Infra. Scaling Judge0 compiler clusters for 2.4M+ users." },
  { name: "Mei Chen", role: "Head of AI Research", bg: "from-emerald-500 to-teal-600", desc: "Stanford CS Ph.D. Pioneering conversational AST code mentors." },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Building2 className="w-3.5 h-3.5 text-violet-400" /> About CodeNova AI
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Empowering the Next Generation of <span className="gradient-text">Developers</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            We are building the ultimate AI-powered coding platform. Combining enterprise-grade multi-language compilation with state-of-the-art AI mentoring to make learning, practicing, and competing accessible to everyone.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Our AI Vision</h3>
            <p className="text-nova-muted text-sm leading-relaxed">
              We believe AI should not replace developers, but augment them. Our AI assistant acts as a patient, 24/7 senior mentor that explains concepts, hints at optimal solutions, and reviews code without giving away the answer.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Engineering Excellence</h3>
            <p className="text-nova-muted text-sm leading-relaxed">
              Backed by Judge0 CE and Docker isolated sandboxes, our online compiler executes code across 7 languages in sub-second runtimes, providing accurate memory and CPU benchmarks for serious competitive programmers.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Global Community</h3>
            <p className="text-nova-muted text-sm leading-relaxed">
              With over 2.4M+ active learners across 180+ countries, CodeNova AI hosts weekly live contests, multiplayer coding battles, and maintains a thriving discussion forum where knowledge is shared freely.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">Meet the Leadership Team</h2>
            <p className="text-nova-muted text-sm mt-2 max-w-xl mx-auto">
              A diverse team of veteran engineers, researchers, and educators dedicated to our mission.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-6 border border-white/10 flex flex-col items-center text-center group hover:border-white/20 transition"
              >
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${member.bg} flex items-center justify-center text-white font-display font-extrabold text-3xl shadow-xl mb-4 group-hover:scale-105 transition duration-300`}>
                  {member.name.split(" ").map(s => s[0]).join("")}
                </div>
                <h3 className="font-display text-lg font-bold text-white">{member.name}</h3>
                <div className="text-xs text-violet-300 font-semibold mb-2">{member.role}</div>
                <p className="text-xs text-nova-muted leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust & Values */}
        <div className="glass-strong rounded-3xl p-10 border border-white/10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-400 font-semibold text-sm">
              <Shield className="w-5 h-5" /> Backed by Top Tech Investors
            </div>
            <h2 className="font-display text-3xl font-extrabold text-white">Committed to Open Source & Security</h2>
            <p className="text-nova-muted text-sm leading-relaxed">
              We actively contribute to open-source compiler projects and maintain rigorous SOC-2 compliance standards. Your code submissions, personal data, and AI mentoring sessions are fully encrypted and private.
            </p>
            <div className="pt-2">
              <Link to="/security" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition inline-flex items-center gap-1.5">
                Visit Trust & Security Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2.4M+</div>
              <div className="text-xs text-nova-muted">Active Developers</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">99.8%</div>
              <div className="text-xs text-nova-muted">Learner Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Creator Credit Section */}
        <div className="mt-20 text-center">
          <div className="glass rounded-3xl p-8 border border-white/10 inline-block">
            <p className="text-nova-muted text-sm mb-2">This platform was created by</p>
            <a
              href="https://armanansari8426.github.io/Arman-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-2xl font-display font-extrabold gradient-text hover:opacity-80 transition"
            >
              Arman Ansari
              <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-4l-8 8m0 0l4-4m-4 4l4 4" />
              </svg>
            </a>
            <p className="text-nova-muted text-xs mt-3">
              Software Engineer | Full-Stack Developer | Building AI-Powered Education Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
