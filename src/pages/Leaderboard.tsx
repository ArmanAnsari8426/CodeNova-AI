import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Award, Users, Search, ShieldCheck, Zap } from "lucide-react";
import { LEADERBOARD } from "@/data/mock";

const TIME_FILTERS = ["All Time", "This Year", "This Month", "Last Contest"];

function getTier(rating: number) {
  if (rating >= 3000) return { name: "Legendary Grandmaster", color: "text-rose-500", bg: "bg-rose-500/15 border-rose-500/30" };
  if (rating >= 2800) return { name: "Grandmaster", color: "text-rose-400", bg: "bg-rose-400/15 border-rose-400/30" };
  if (rating >= 2600) return { name: "International Master", color: "text-amber-500", bg: "bg-amber-500/15 border-amber-500/30" };
  if (rating >= 2400) return { name: "Master", color: "text-amber-400", bg: "bg-amber-400/15 border-amber-400/30" };
  if (rating >= 2100) return { name: "Candidate Master", color: "text-violet-400", bg: "bg-violet-400/15 border-violet-400/30" };
  if (rating >= 1900) return { name: "Expert", color: "text-blue-400", bg: "bg-blue-400/15 border-blue-400/30" };
  if (rating >= 1600) return { name: "Specialist", color: "text-cyan-400", bg: "bg-cyan-400/15 border-cyan-400/30" };
  if (rating >= 1400) return { name: "Pupil", color: "text-emerald-400", bg: "bg-emerald-400/15 border-emerald-400/30" };
  return { name: "Newbie", color: "text-gray-400", bg: "bg-gray-400/15 border-gray-400/30" };
}

export default function Leaderboard() {
  const [filter, setFilter] = useState("All Time");
  const [search, setSearch] = useState("");
  const [liveBoard, setLiveBoard] = useState(LEADERBOARD);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveBoard((board) => {
        const next = board.map((u) => ({ ...u }));
        const index = Math.floor(Math.random() * next.length);
        const delta = Math.floor(Math.random() * 18) + 3;
        next[index].rating += Math.random() > 0.35 ? delta : -Math.min(delta, 8);
        next[index].solved += Math.random() > 0.6 ? 1 : 0;
        return next
          .sort((a, b) => b.rating - a.rating || b.solved - a.solved)
          .map((u, idx) => ({ ...u, rank: idx + 1 }));
      });
      setLastUpdate(new Date());
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const filteredBoard = useMemo(() => liveBoard.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.handle.toLowerCase().includes(search.toLowerCase())
  ), [liveBoard, search]);

  const top3 = filteredBoard.slice(0, 3);
  const rest = filteredBoard.slice(3);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-emerald-500/20 text-xs text-emerald-300 font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live ELO Rankings
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-5">
            The <span className="gradient-text animate-gradient">Hall of Code</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            The definitive ranking of the world's top developers. Ratings update live as contest submissions arrive. Last update: {lastUpdate.toLocaleTimeString()}.
          </p>
        </div>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="glass-strong rounded-2xl p-5 border border-white/10 text-center shadow-lg">
            <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-white">2.4M+</div>
            <div className="text-xs text-nova-muted font-bold uppercase mt-1">Ranked Coders</div>
          </div>
          <div className="glass-strong rounded-2xl p-5 border border-white/10 text-center shadow-lg">
            <Award className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-white">{liveBoard[0]?.rating ?? 3148}</div>
            <div className="text-xs text-nova-muted font-bold uppercase mt-1">Highest Rating</div>
          </div>
          <div className="glass-strong rounded-2xl p-5 border border-white/10 text-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-white">142</div>
            <div className="text-xs text-nova-muted font-bold uppercase mt-1">Grandmasters</div>
          </div>
          <div className="glass-strong rounded-2xl p-5 border border-white/10 text-center shadow-lg">
            <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-white">412</div>
            <div className="text-xs text-nova-muted font-bold uppercase mt-1">Active Streaks &gt; 100d</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="glass rounded-full p-1.5 flex w-full md:w-auto overflow-x-auto">
            {TIME_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filter === f ? "bg-white/15 text-white shadow-md" : "text-nova-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search coder or handle..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-nova-muted/70 outline-none focus:border-violet-500/50 transition shadow-inner"
            />
          </div>
        </div>

        {/* Top 3 Podium */}
        {top3.length === 3 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-4xl mx-auto mb-16 items-end px-2">
            <Podium user={top3[1]} place={2} delay={0.1} />
            <Podium user={top3[0]} place={1} delay={0} />
            <Podium user={top3[2]} place={3} delay={0.2} />
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="hidden md:grid grid-cols-12 px-8 py-5 border-b border-white/10 text-xs uppercase tracking-widest text-nova-muted font-black bg-black/40">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Coder</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-2 text-right">Rating</div>
            <div className="col-span-2 text-right">Problems</div>
            <div className="col-span-1 text-right">Streak</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {rest.map((u, i) => {
              const tier = getTier(u.rating);
              return (
                <motion.div
                  key={u.rank}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-3 md:grid-cols-12 px-6 sm:px-8 py-4 hover:bg-white/[0.04] transition-colors items-center text-sm group"
                >
                  {/* Rank */}
                  <div className="col-span-1 text-nova-muted font-mono font-bold text-base md:text-sm">#{u.rank}</div>
                  
                  {/* Name & Handle */}
                  <div className="col-span-2 md:col-span-4 flex items-center gap-3">
                    <span className="text-xl sm:text-2xl drop-shadow-md">{u.country}</span>
                    <div className="min-w-0">
                      <div className={`font-bold truncate text-base ${tier.color} group-hover:brightness-125 transition`}>
                        {u.name}
                      </div>
                      <div className="text-[11px] text-nova-muted font-mono">{u.handle}</div>
                    </div>
                  </div>
                  
                  {/* Tier Badge */}
                  <div className="hidden md:block md:col-span-2">
                    <span className={`px-2.5 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${tier.bg} ${tier.color}`}>
                      {tier.name}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="hidden md:block md:col-span-2 text-right font-mono font-black text-lg text-white">
                    {u.rating}
                  </div>

                  {/* Solved Progress */}
                  <div className="hidden md:flex md:col-span-2 items-center justify-end gap-3">
                    <div className="w-24 h-2 rounded-full bg-black/40 overflow-hidden border border-white/5 hidden lg:block">
                      <div className={`h-full ${tier.bg.split(' ')[0].replace('/15', '')}`} style={{ width: `${Math.min((u.solved / 1500) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs text-white/90 font-bold">{u.solved.toLocaleString()}</span>
                  </div>

                  {/* Streak */}
                  <div className="hidden md:flex md:col-span-1 justify-end items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Flame className="w-4 h-4 fill-amber-400/50" /> {u.streak}d
                  </div>
                </motion.div>
              );
            })}
            
            {rest.length === 0 && (
              <div className="p-12 text-center text-nova-muted font-bold">
                No coders found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Podium Component for Top 3 ──────────────────────────────── */
function Podium({ user, place, delay }: { user: typeof LEADERBOARD[number]; place: 1 | 2 | 3; delay: number }) {
  const colors = {
    1: { ring: "from-amber-400 via-yellow-500 to-orange-500", icon: Trophy, label: "1st", height: "h-48 sm:h-64", glow: "shadow-amber-500/50" },
    2: { ring: "from-slate-300 via-gray-400 to-slate-500", icon: Award, label: "2nd", height: "h-40 sm:h-52", glow: "shadow-slate-500/40" },
    3: { ring: "from-orange-700 via-amber-800 to-amber-900", icon: Award, label: "3rd", height: "h-36 sm:h-44", glow: "shadow-orange-700/40" },
  } as const;
  
  const c = colors[place];
  const tier = getTier(user.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
      className="flex flex-col items-center relative z-10"
    >
      {/* Avatar & Glow */}
      <div className="relative mb-4 group cursor-pointer">
        <div className={`absolute -inset-4 bg-gradient-to-br ${c.ring} blur-2xl opacity-40 group-hover:opacity-70 transition duration-500 rounded-full`} />
        
        <div className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${c.ring} p-1 shadow-2xl ${c.glow} z-10`}>
          <div className="w-full h-full rounded-full bg-nova-bg flex items-center justify-center font-display font-black text-xl sm:text-3xl text-white">
            {user.name.split(" ").map(s => s[0]).join("")}
          </div>
        </div>
        
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${c.ring} flex items-center justify-center shadow-xl z-20 border-2 border-nova-bg`}>
          <c.icon className="w-4 h-4 text-white drop-shadow-md" />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mb-4 relative z-20">
        <div className={`font-black text-sm sm:text-base ${tier.color}`}>{user.name}</div>
        <div className="text-[10px] sm:text-xs text-nova-muted font-mono">{user.handle}</div>
        <div className="font-mono font-black text-white text-lg mt-1">{user.rating}</div>
      </div>

      {/* Podium Pillar */}
      <div className={`w-full ${c.height} rounded-t-2xl bg-gradient-to-t ${c.ring} opacity-80 border-t border-x border-white/20 flex flex-col items-center justify-start pt-6 shadow-2xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <span className="relative z-10 font-display font-black text-4xl sm:text-6xl text-white/90 drop-shadow-xl">{place}</span>
        <span className="relative z-10 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/70 mt-2">{tier.name}</span>
      </div>
    </motion.div>
  );
}
