import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, Building2, ChevronRight, Sparkles, BookOpen, Brain, Play, Star } from "lucide-react";

const COMPANIES = [
  { id: "google", name: "Google", count: 145, icon: "🌐", color: "from-blue-500 to-indigo-600", desc: "Heavy focus on Graphs, DP, Trees, and complex mathematical problem solving." },
  { id: "meta", name: "Meta", count: 128, icon: "♾️", color: "from-blue-600 to-cyan-500", desc: "Speed and correctness. Frequently tests Two Pointers, Strings, and Arrays." },
  { id: "amazon", name: "Amazon", count: 162, icon: "📦", color: "from-amber-500 to-orange-500", desc: "Object-Oriented Design, BFS/DFS, Leadership Principles, and Sliding Window." },
  { id: "microsoft", name: "Microsoft", count: 110, icon: "🪟", color: "from-emerald-500 to-teal-600", desc: "System Design fundamentals, Linked Lists, BSTs, and String manipulation." },
  { id: "apple", name: "Apple", count: 95, icon: "🍎", color: "from-slate-400 to-slate-600", desc: "Low-level optimization, Memory management, Bit Manipulation, and Tries." },
  { id: "netflix", name: "Netflix", count: 80, icon: "🍿", color: "from-rose-500 to-red-600", desc: "High-concurrency microservices, Concurrency, Caching, and Hard DP." },
  { id: "startups", name: "Top Startups (Y Combinator)", count: 210, icon: "🚀", color: "from-violet-500 to-fuchsia-500", desc: "Practical full-stack coding, API design, rapid debugging, and DOM manipulation." },
];

const BEHAVIORAL_QUESTIONS = [
  { q: "Tell me about a time you had a conflict with a coworker or tech lead.", category: "Collaboration" },
  { q: "Describe a project where you faced tight deadlines and changing requirements.", category: "Adaptability" },
  { q: "Tell me about a time you made a critical technical mistake in production.", category: "Ownership" },
  { q: "How do you handle dissenting opinions during a system design architecture review?", category: "Communication" },
];

export default function InterviewPrepPage() {
  const [selectedCompany, setSelectedCompany] = useState("google");

  const company = COMPANIES.find(c => c.id === selectedCompany)!;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" /> FAANG & Top Tech Preparation
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Ace Your <span className="gradient-text">Technical Interviews</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            Company-specific problem sets, real past interview questions, system design blueprints, and AI mock interview simulations tailored to your target employer.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/ai-interviewer"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Start AI Mock Interview
            </Link>
            <Link
              to="/problems"
              className="px-6 py-3.5 rounded-xl glass-strong text-white font-semibold text-sm hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" /> Browse Company Problems
            </Link>
          </div>
        </div>

        {/* Company Selector Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Company List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nova-muted mb-4 px-2">Select Target Company</h3>
            {COMPANIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCompany(c.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition text-left ${
                  selectedCompany === c.id
                    ? "bg-white/10 border-violet-500 shadow-lg shadow-violet-500/10"
                    : "glass border-white/5 hover:border-white/10 text-nova-muted hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="font-display font-bold text-white text-base">{c.name}</div>
                    <div className="text-xs text-nova-muted">{c.count} verified problems</div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${selectedCompany === c.id ? "text-violet-400" : "text-nova-muted"}`} />
              </button>
            ))}
          </div>

          {/* Right: Company Detail & Problem Track */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-strong rounded-3xl p-8 border border-white/10 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${company.color} opacity-10 blur-3xl rounded-full pointer-events-none`} />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${company.color} flex items-center justify-center text-3xl shadow-xl text-white`}>
                    {company.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-extrabold text-white">{company.name} Interview Track</h2>
                    <p className="text-nova-muted text-sm mt-1 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-violet-400" /> Curated from 2025/2026 real interview feedback
                    </p>
                  </div>
                </div>
                <Link
                  to="/problems"
                  className="px-5 py-2.5 rounded-xl bg-white text-nova-bg font-semibold text-xs shadow-lg hover:bg-white/90 transition shrink-0 inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Solve All {company.count}
                </Link>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Interview Focus & Patterns</h3>
                <p className="text-nova-muted text-base leading-relaxed">{company.desc}</p>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Top Frequently Asked Problems</h3>
              <div className="space-y-3">
                {[
                  { title: "Two Sum", diff: "Easy", acc: "54.2%", tag: "Array", slug: "two-sum" },
                  { title: "Longest Substring Without Repeating Characters", diff: "Medium", acc: "34.8%", tag: "Sliding Window", slug: "longest-substring" },
                  { title: "Median of Two Sorted Arrays", diff: "Hard", acc: "38.1%", tag: "Binary Search", slug: "median-two-sorted" },
                  { title: "LRU Cache", diff: "Medium", acc: "42.5%", tag: "Design", slug: "lru-cache" },
                ].map((p, i) => (
                  <Link
                    key={i}
                    to={`/problems/${p.slug}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs font-mono text-nova-muted w-6">0{i+1}.</span>
                      <div>
                        <div className="text-white font-semibold text-base group-hover:text-violet-300 transition truncate">{p.title}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                            p.diff === "Easy" ? "text-emerald-300 bg-emerald-500/10" :
                            p.diff === "Medium" ? "text-amber-300 bg-amber-500/10" :
                            "text-rose-300 bg-rose-500/10"
                          }`}>{p.diff}</span>
                          <span className="text-nova-muted">Tag: {p.tag}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4 font-mono text-xs text-nova-muted">
                      <span>Acc: {p.acc}</span>
                      <ChevronRight className="w-4 h-4 text-nova-muted group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* AI Mock Interview Box */}
              <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 border border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-violet-500/30">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Simulate a Real {company.name} Interview</h4>
                    <p className="text-xs text-nova-muted mt-1 leading-relaxed max-w-md">
                      Engage in a live timed mock interview with Nova AI. Includes behavioral questions, system design whiteboard prompts, and live coding evaluation.
                    </p>
                  </div>
                </div>
                <Link
                  to="/ai-interviewer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition shrink-0 inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Launch Simulator
                </Link>
              </div>
            </motion.div>

            {/* Behavioral Questions Section */}
            <div className="glass rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-amber-400" />
                <h3 className="font-display text-2xl font-bold text-white">Behavioral & Leadership Prep</h3>
              </div>
              <p className="text-nova-muted text-sm mb-6 leading-relaxed">
                Technical skills get you the interview, but behavioral alignment gets you the offer. Practice the STAR method (Situation, Task, Action, Result) for these verified interview questions.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {BEHAVIORAL_QUESTIONS.map((bq, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3 inline-block">
                        {bq.category}
                      </span>
                      <p className="text-white text-sm font-medium leading-relaxed">{bq.q}</p>
                    </div>
                    <button
                      onClick={() => alert(`💡 STAR Tip for ${bq.category}: Focus on your personal contribution (Action) and quantify the business impact (Result).`)}
                      className="mt-4 text-xs text-violet-300 hover:text-violet-200 transition font-semibold self-start flex items-center gap-1"
                    >
                      View AI STAR Answer Framework →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
