import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, CheckCircle2, Circle, Building2, Tag, ChevronRight } from "lucide-react";
import { PROBLEMS, type Difficulty } from "@/data/mock";

const DIFFS: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];
const TOPICS = ["All", "Array", "String", "Hash Table", "Dynamic Programming", "Tree", "Stack", "Binary Search", "Linked List"];
const COMPANIES = ["All", "Google", "Amazon", "Meta", "Microsoft", "Apple"];

export default function Problems() {
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<Difficulty | "All">("All");
  const [topic, setTopic] = useState("All");
  const [company, setCompany] = useState("All");

  const filtered = useMemo(() => PROBLEMS.filter(p => {
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (diff !== "All" && p.difficulty !== diff) return false;
    if (topic !== "All" && !p.tags.includes(topic)) return false;
    if (company !== "All" && !p.companies.includes(company)) return false;
    return true;
  }), [q, diff, topic, company]);

  const stats = useMemo(() => {
    const solved = 142; 
    const easy = PROBLEMS.filter(p => p.difficulty === "Easy").length;
    const medium = PROBLEMS.filter(p => p.difficulty === "Medium").length;
    const hard = PROBLEMS.filter(p => p.difficulty === "Hard").length;
    return { solved, easy, medium, hard };
  }, []);

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Modern Header with Stats */}
        <div className="grid lg:grid-cols-12 gap-8 mb-10 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-violet-400" /> {PROBLEMS.length}+ Real Interview Questions
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight">
              Problem <span className="gradient-text animate-gradient">Vault</span>
            </h1>
            <p className="text-nova-muted mt-4 text-lg max-w-xl leading-relaxed">
              Master the patterns used by top tech companies. Filter by topic, difficulty, or your dream company.
            </p>
          </div>
          
          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            <StatCard label="Solved" value={stats.solved} total={PROBLEMS.length} color="text-emerald-400" />
            <StatCard label="Streak" value="32" suffix="d" color="text-amber-400" />
            <StatCard label="Rank" value="#1" color="text-violet-400" />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl mb-8 space-y-6">
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-nova-muted" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search by problem name or ID..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-nova-muted/70 outline-none focus:border-violet-500/50 transition-all shadow-inner"
              />
            </div>
            <div className="md:col-span-3">
              <select 
                value={diff} onChange={e => setDiff(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-violet-500/50 cursor-pointer"
              >
                {DIFFS.map(d => <option key={d} value={d} className="bg-nova-bg">{d} Difficulty</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
               <button className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition-all">
                Pick One Random 🎲
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-white/5">
            <span className="text-xs font-bold text-nova-muted uppercase tracking-widest mr-2">Quick Filters:</span>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="Topics" options={TOPICS} active={topic} onSelect={setTopic} icon={Tag} />
              <FilterPill label="Companies" options={COMPANIES} active={company} onSelect={setCompany} icon={Building2} />
            </div>
          </div>
        </div>

        {/* LeetCode-style Problem Table */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="hidden md:grid grid-cols-12 px-6 py-4 border-b border-white/10 text-[11px] uppercase tracking-widest text-nova-muted font-bold bg-white/[0.03]">
            <div className="col-span-1">Status</div>
            <div className="col-span-1">ID</div>
            <div className="col-span-5">Problem Title</div>
            <div className="col-span-1">Acceptance</div>
            <div className="col-span-1">Difficulty</div>
            <div className="col-span-3 text-right">Target Companies</div>
          </div>

          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Link
                    to={`/problems/${p.slug}`}
                    className="grid grid-cols-2 md:grid-cols-12 gap-2 px-6 py-5 hover:bg-white/[0.04] transition-all items-center group relative overflow-hidden"
                  >
                    <div className="md:col-span-1">
                      {i % 3 === 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-nova-muted/30" />}
                    </div>
                    <div className="md:col-span-1 text-nova-muted font-mono text-xs">{p.number}</div>
                    <div className="col-span-2 md:col-span-5">
                      <div className="text-white font-bold group-hover:text-violet-400 transition-colors">{p.title}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {p.tags.map(t => (
                          <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-nova-muted border border-white/5">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-1 font-mono text-xs text-nova-muted">{p.acceptance}%</div>
                    <div className="md:col-span-1">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        p.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        p.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>{p.difficulty}</span>
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-1.5 flex-wrap">
                      {p.companies.map(c => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/10 hover:border-violet-500/40 transition-all">{c}</span>
                      ))}
                    </div>
                    
                    {/* Hover Decoration */}
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-violet-400" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Search className="w-8 h-8 text-nova-muted" />
              </div>
              <h3 className="text-white font-bold text-lg">No problems found</h3>
              <p className="text-nova-muted text-sm">Try adjusting your filters or search query.</p>
              <button onClick={() => { setQ(""); setDiff("All"); setTopic("All"); setCompany("All"); }} className="mt-4 text-violet-400 font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, total, suffix = "", color }: any) {
  return (
    <div className="glass rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all text-center">
      <div className={`text-2xl font-black ${color}`}>{value}{suffix}</div>
      <div className="text-[10px] text-nova-muted uppercase tracking-widest font-bold mt-1">
        {label} {total && <span className="opacity-40">/ {total}</span>}
      </div>
    </div>
  );
}

function FilterPill({ label, options, active, onSelect, icon: Icon }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
          active !== "All" ? "bg-violet-500/20 border-violet-500/50 text-white" : "bg-white/5 border-white/10 text-nova-muted hover:text-white"
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        {active === "All" ? label : active}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 mt-2 w-56 glass-strong rounded-2xl p-2 shadow-2xl z-20 border border-white/10 max-h-72 overflow-y-auto"
            >
              {options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => { onSelect(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-colors ${
                    active === opt ? "bg-violet-500 text-white font-bold" : "text-nova-muted hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
