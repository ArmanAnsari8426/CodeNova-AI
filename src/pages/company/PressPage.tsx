import { motion } from "framer-motion";
import { Newspaper, Download, ExternalLink, Quote } from "lucide-react";

const PRESS_RELEASES = [
  { date: "March 15, 2026", title: "CodeNova AI Announces $25M Series A to Expand Multi-Language Compiler Clusters", source: "TechCrunch" },
  { date: "February 10, 2026", title: "How CodeNova AI is Reshaping Computer Science Education with Conversational AST Mentors", source: "Wired" },
  { date: "January 22, 2026", title: "CodeNova AI Crosses 2.4 Million Active Learners Worldwide", source: "Forbes" },
  { date: "December 05, 2025", title: "Judge0 CE and CodeNova AI Partner to Deliver Isolated Docker Execution at Scale", source: "VentureBeat" },
];

export default function PressPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" /> Press & Media Kit
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            CodeNova AI in the <span className="gradient-text">News</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            Explore our latest press releases, media coverage, brand assets, and official executive leadership bios.
          </p>
        </div>

        {/* Brand Assets Download Section */}
        <div className="glass-strong rounded-3xl p-8 sm:p-10 border border-white/10 mb-20 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">Official Brand Assets</h2>
            <p className="text-nova-muted text-sm leading-relaxed max-w-md">
              Download our official high-resolution logos, brand mark icons, neon gradient swatches, and product UI mockups for press publications.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => alert("📦 Downloading CodeNova AI Brand Kit (ZIP)…")}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Complete Media Kit (.ZIP)
              </button>
              <button
                onClick={() => alert("📦 Downloading High-Res Logos (SVG/PNG)…")}
                className="px-5 py-3 rounded-xl glass text-white font-semibold text-xs hover:bg-white/10 transition inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Logos Only (.SVG / .PNG)
              </button>
            </div>
          </div>
          <div className="glass p-8 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4 bg-nova-bg/50">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center font-display font-extrabold text-white text-2xl shadow-xl">
              CN
            </div>
            <div>
              <div className="font-display font-extrabold text-white tracking-tight text-xl">
                Code<span className="gradient-text">Nova</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-nova-muted mt-0.5">AI Platform</div>
            </div>
          </div>
        </div>

        {/* Press Releases Grid */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-violet-400" /> Recent Press Coverage
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {PRESS_RELEASES.map((pr, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between group hover:border-white/20 transition">
                <div>
                  <div className="flex items-center justify-between text-xs text-nova-muted mb-3">
                    <span className="font-mono">{pr.date}</span>
                    <span className="px-2.5 py-0.5 rounded bg-white/5 text-cyan-300 font-semibold">{pr.source}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-violet-300 transition leading-snug mb-4">{pr.title}</h3>
                </div>
                <button onClick={() => alert(`📰 Opening full press article from ${pr.source}…`)} className="text-xs text-violet-300 hover:text-violet-200 transition font-semibold self-start flex items-center gap-1">
                  Read Full Article <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Founder Quote */}
        <div className="glass-strong rounded-3xl p-10 border border-white/10 relative overflow-hidden text-center max-w-4xl mx-auto">
          <Quote className="w-12 h-12 text-violet-500/20 absolute top-4 left-4 pointer-events-none" />
          <Quote className="w-12 h-12 text-violet-500/20 absolute bottom-4 right-4 pointer-events-none rotate-180" />
          <p className="text-lg sm:text-xl text-white font-medium italic leading-relaxed max-w-2xl mx-auto relative z-10">
            "Our goal is not just to teach people how to write syntax, but how to think like world-class computational architects. By combining real-time cloud compilation with empathetic AI mentoring, we are bridging the gap between beginner tutorials and enterprise software engineering."
          </p>
          <div className="mt-6 font-display font-bold text-white text-base">Aarav Kumar</div>
          <div className="text-xs text-nova-muted">Co-Founder & CEO, CodeNova AI</div>
        </div>
      </div>
    </div>
  );
}
