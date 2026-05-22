import { Shield, Lock, Cpu, CheckCircle2, Server, Award, ExternalLink } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Enterprise Trust Center
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Security & <span className="gradient-text">Compliance</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            At CodeNova AI, security is our foundational layer. Explore our multi-layered defense architecture, isolated cloud compiler execution sandboxes, and enterprise compliance standards.
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">AES-256 Encryption</h3>
            <p className="text-nova-muted text-sm leading-relaxed">
              All data at rest within our MongoDB Atlas clusters and data in transit across our TLS 1.3 / HTTPS endpoints is encrypted using military-grade AES-256 encryption algorithms.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Docker Sandbox Isolation</h3>
            <p className="text-nova-muted text-sm leading-relaxed">
              User code submitted to our Judge0 compiler is executed inside ephemeral, unprivileged Docker containers with strict memory, CPU, and network egress limits to prevent breakout attacks.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">DDoS & Rate Limiting</h3>
            <p className="text-nova-muted text-sm leading-relaxed">
              Our API gateway is protected by Cloudflare DDoS mitigation, Helmet.js security headers, and strict Express rate limiting to prevent brute-force credential stuffing and API abuse.
            </p>
          </div>
        </div>

        {/* Compliance Certifications */}
        <div className="glass-strong rounded-3xl p-10 border border-white/10 mb-20 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Award className="w-4 h-4" /> Verified Industry Standards
            </div>
            <h2 className="font-display text-3xl font-extrabold text-white">SOC-2 Type II & GDPR Compliant</h2>
            <p className="text-nova-muted text-sm leading-relaxed">
              We maintain rigorous internal security controls, annual third-party penetration testing, and continuous compliance monitoring to ensure your enterprise team data is handled with the utmost integrity.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-white font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Continuous AWS / GCP vulnerability scanning</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated NoSQL injection & XSS sanitization</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strict Role-Based Access Control (RBAC) audit logging</li>
            </ul>
          </div>
          <div className="md:col-span-5 glass p-8 rounded-2xl border border-white/5 space-y-4 bg-nova-bg/50">
            <h3 className="font-display text-lg font-bold text-white">Bug Bounty Program</h3>
            <p className="text-xs text-nova-muted leading-relaxed">
              We believe in working with the global security research community. If you discover a potential security vulnerability in our compiler or web application, please report it to us.
            </p>
            <button
              onClick={() => alert("🛡️ Directing to CodeNova AI HackerOne Bug Bounty portal…")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition inline-flex items-center justify-center gap-1.5"
            >
              Report a Vulnerability <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
