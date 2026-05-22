import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Sparkles, Building2, ChevronRight, CheckCircle2, Heart, Cpu, Globe } from "lucide-react";

const JOBS = [
  { id: "job-1", title: "Senior AI Engineer (LLM Tooling)", dept: "AI Research", loc: "Remote (US / Canada)", type: "Full-time", exp: "5+ Years", salary: "$180k - $240k" },
  { id: "job-2", title: "Staff Full Stack Engineer (React/Node)", dept: "Core Product", loc: "Bengaluru, India / Remote", type: "Full-time", exp: "4+ Years", salary: "$140k - $190k" },
  { id: "job-3", title: "Compiler Systems Architect (Judge0/C++)", dept: "Infrastructure", loc: "Remote (Global)", type: "Full-time", exp: "6+ Years", salary: "$190k - $260k" },
  { id: "job-4", title: "Developer Advocate & DSA Educator", dept: "Community & Growth", loc: "London, UK / Remote", type: "Full-time", exp: "3+ Years", salary: "$120k - $160k" },
];

const PERKS = [
  { icon: Globe, title: "Work From Anywhere", desc: "We are a remote-first company with flexible working hours and co-working stipends." },
  { icon: Heart, title: "Comprehensive Health", desc: "Top-tier medical, dental, and vision insurance for you and your dependents." },
  { icon: Sparkles, title: "AI & Learning Budget", desc: "$3,000 annual stipend for courses, conferences, books, and AI hardware." },
  { icon: Cpu, title: "Latest Tech Stack", desc: "M3 Max MacBook Pros, 4K monitors, and dedicated cloud GPU access." },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setSelectedJob(null);
      alert("🎉 Application Submitted Successfully! Our recruiting team will review your profile and get back to you within 48 hours.");
    }, 1500);
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Join Our Team
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Build the Future of <span className="gradient-text">Developer Ed</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            We are looking for passionate engineers, AI researchers, and community builders who want to make world-class computer science education accessible to millions.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Why Work at CodeNova AI?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map((p, i) => (
              <div key={i} className="glass rounded-3xl p-6 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs text-nova-muted leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="glass-strong rounded-3xl p-8 sm:p-10 border border-white/10">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <Building2 className="w-6 h-6 text-violet-400" />
            <h2 className="font-display text-2xl font-bold text-white">Open Positions</h2>
            <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold ml-auto">
              {JOBS.length} Openings
            </span>
          </div>

          <div className="space-y-4">
            {JOBS.map(job => (
              <div key={job.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded text-nova-muted font-bold uppercase tracking-wider">{job.dept}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded font-semibold">{job.type}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-nova-muted pt-1">
                    <span>📍 {job.loc}</span>
                    <span>💼 {job.exp}</span>
                    <span className="text-cyan-300 font-medium">💰 {job.salary}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(job.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-xs shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition shrink-0 inline-flex items-center gap-1.5"
                >
                  Apply Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-lg glass-strong rounded-3xl p-8 gradient-border shadow-2xl shadow-black/80 relative">
              <h3 className="font-display text-xl font-bold text-white mb-2">Apply for {JOBS.find(j => j.id === selectedJob)?.title}</h3>
              <p className="text-xs text-nova-muted mb-6">Please fill out your details below. Your CodeNova AI profile metrics will be attached automatically.</p>
              
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Full Name</label>
                  <input type="text" required placeholder="Priya Sharma" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Email</label>
                  <input type="email" required placeholder="you@example.com" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">LinkedIn / GitHub / Portfolio URL</label>
                  <input type="url" required placeholder="https://linkedin.com/in/username" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Why do you want to join CodeNova AI?</label>
                  <textarea rows={3} required placeholder="Tell us about your passion for developer tooling and education…" className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 resize-none" />
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> CodeNova AI profile metrics (Rating, Solved count) attached.
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setSelectedJob(null)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={applied} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition">
                    {applied ? "Submitting…" : "Submit Application"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
