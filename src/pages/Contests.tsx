import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Trophy, Users, Clock, Calendar, Zap, Award, ChevronRight, Radio, 
  CheckCircle2, ScrollText, Target, Play, TrendingUp, CreditCard
} from "lucide-react";
import { CONTESTS, LEADERBOARD } from "@/data/mock";

function useCountdown(target: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) { setT("00:00:00"); return; }
      const h = Math.floor(diff / 3600_000);
      const m = Math.floor((diff % 3600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setT(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

export default function Contests() {
  const live = CONTESTS.find(c => c.status === "Live");
  const upcoming = CONTESTS.filter(c => c.status === "Upcoming");
  const ended = CONTESTS.filter(c => c.status === "Ended");

  // Check localStorage for registered contests
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const registered = new Set<string>();
    CONTESTS.forEach(c => {
      if (localStorage.getItem(`contest_${c.id}_paid`) === 'true') {
        registered.add(c.id);
      }
    });
    setRegisteredIds(registered);
  }, []);

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted border border-white/10 mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Competitive Arena
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              Coding <span className="gradient-text animate-gradient">Contests</span>
            </h1>
            <p className="text-nova-muted mt-3 text-lg max-w-xl">
              Prove your skills. Compete against 2.4M+ developers worldwide. Climb the ELO rankings and win exclusive prizes.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="glass-strong rounded-2xl px-5 py-3 border border-white/10 shadow-lg flex flex-col items-end">
              <div className="text-xs text-nova-muted font-bold uppercase tracking-wider mb-1">Your ELO Rating</div>
              <div className="text-white font-black text-2xl flex items-center gap-2">
                <span className="text-violet-400">2,148</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/20 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +24
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Banner */}
        {live && <LiveBanner contest={live} />}

        <div className="grid lg:grid-cols-12 gap-8 mt-12">
          
          {/* Main Contest Feed */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Upcoming Section */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                <Calendar className="w-5 h-5 text-violet-400" /> Upcoming Battles
              </h2>
              <div className="space-y-4">
                {upcoming.map((c, i) => {
                  const isReg = registeredIds.has(c.id);
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className={`relative overflow-hidden rounded-3xl p-6 border transition-all ${
                        isReg ? "glass-strong border-violet-500/40 shadow-xl shadow-violet-500/10" : "glass border-white/5 hover:border-white/15"
                      }`}
                    >
                      {isReg && <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full pointer-events-none" />}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.banner} flex items-center justify-center shrink-0 shadow-lg`}>
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display text-lg font-bold text-white">{c.title}</h3>
                              {isReg && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">REGISTERED</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-nova-muted font-medium mt-1.5">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(c.startsAt).toLocaleString()}</span>
                              <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {c.problems} Problems ({c.durationMins}m)</span>
                              <span className="flex items-center gap-1 text-amber-300"><Award className="w-3.5 h-3.5" /> Prize: {c.prize}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="px-2.5 py-1 rounded bg-white/5 text-[10px] text-white/80 font-semibold border border-white/10">{c.tag}</span>
                              <span className="flex items-center gap-1 text-[10px] text-nova-muted"><Users className="w-3 h-3" /> {(c.participants + (isReg ? 1 : 0)).toLocaleString()} Reg</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="shrink-0 w-full sm:w-auto">
                          {isReg ? (
                            <Link to={`/contest/${c.id}/arena`} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:scale-[1.02] transition shadow-lg shadow-emerald-500/30">
                              <Play className="w-4 h-4 fill-current" /> Enter Arena
                            </Link>
                          ) : (
                            <Link to={`/contest/${c.id}/register`} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-nova-bg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-200 transition shadow-lg hover:scale-105 active:scale-95">
                              <CreditCard className="w-4 h-4" /> Register & Pay
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Past Contests */}
            <section>
              <h2 className="font-display text-2xl font-bold text-white mt-12 mb-5 flex items-center gap-2 border-b border-white/10 pb-3 opacity-90">
                <ScrollText className="w-5 h-5 text-nova-muted" /> Past Archives
              </h2>
              <div className="space-y-3">
                {ended.map(c => (
                  <div key={c.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-4 opacity-75 hover:opacity-100 transition group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.banner} flex items-center justify-center grayscale group-hover:grayscale-0 transition`}>
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-white font-bold">{c.title}</div>
                        <div className="text-xs text-nova-muted mt-0.5">Ended · {c.participants.toLocaleString()} participated</div>
                      </div>
                    </div>
                    <Link to="/leaderboard" className="px-4 py-2 rounded-lg bg-white/5 text-xs text-white font-semibold hover:bg-white/10 transition border border-white/10 flex items-center gap-1">
                      Results <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Rules & Live Leaderboard */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Contest Rules */}
            <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-xl">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" /> Arena Rules
              </h3>
              <ul className="space-y-3 text-sm text-nova-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Penalties:</strong> 5 minutes added to total time for every wrong submission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Scoring:</strong> ICPC style. Solving problems faster yields a higher rank.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Plagiarism:</strong> AI detection is active. Copied code leads to permanent ban.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Rating:</strong> ELO updates within 2 hours after contest ends.</span>
                </li>
              </ul>
            </div>

            {/* Live Leaderboard Sneak Peek */}
            <div className="glass rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Live Top 5
                </h3>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  <Radio className="w-3 h-3 animate-pulse" /> Live
                </div>
              </div>
              
              <div className="space-y-2">
                {LEADERBOARD.slice(0, 5).map((u, idx) => (
                  <div key={u.rank} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-inner ${
                      idx === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" :
                      idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-white" :
                      idx === 2 ? "bg-gradient-to-br from-orange-700 to-amber-800 text-white" :
                      "bg-white/10 text-nova-muted"
                    }`}>{u.rank}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-bold truncate flex items-center gap-1.5">
                        {u.name} <span className="text-xs">{u.country}</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded">
                      {u.rating}
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/leaderboard" className="w-full mt-4 py-2.5 rounded-xl bg-white/5 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-white/10 transition border border-white/10">
                View Full Leaderboard <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Premium Live Banner Component ───────────────────────────── */
function LiveBanner({ contest }: { contest: typeof CONTESTS[number] }) {
  const endsAt = new Date(new Date(contest.startsAt).getTime() + contest.durationMins * 60_000).toISOString();
  const remaining = useCountdown(endsAt);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] glass-strong gradient-border p-8 sm:p-10 shadow-2xl shadow-violet-500/20"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${contest.banner} opacity-20`} />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-violet-500/30 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 lg:col-span-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black tracking-widest uppercase mb-4 shadow-lg shadow-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" /> LIVE NOW
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-3">
            {contest.title}
          </h2>
          <p className="text-white/80 text-lg font-medium max-w-xl">
            The arena is open. Solve {contest.problems} algorithmic challenges in {contest.durationMins} minutes to claim your share of the {contest.prize} prize pool.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-sm font-semibold text-white/90">
            <span className="inline-flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
              <Users className="w-4 h-4 text-cyan-400" /> {contest.participants.toLocaleString()} active coders
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
              <Zap className="w-4 h-4 text-amber-400" /> {contest.tag}
            </span>
          </div>
        </div>
        
        <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-end justify-center">
          <div className="glass bg-black/40 border border-white/20 p-6 rounded-3xl text-center shadow-2xl backdrop-blur-xl w-full max-w-xs">
            <div className="text-xs text-nova-muted uppercase tracking-widest font-bold mb-2 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-400" /> Time Remaining
            </div>
            <div className="font-mono text-5xl font-black text-white tracking-wider tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {remaining}
            </div>
            <Link to={`/compiler?contest=${contest.id}`} className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:scale-[1.03] active:scale-95 transition-all">
              <Play className="w-5 h-5 fill-current" /> Enter Arena
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
