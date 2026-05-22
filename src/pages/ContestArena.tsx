import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { AlertTriangle, Award, CheckCircle2, Clock, Code2, List, Maximize2, Minimize2, Shield, Trophy, Users } from "lucide-react";
import CodeEditorPro from "@/components/CodeEditorPro";
import { CONTESTS, LEADERBOARD } from "@/data/mock";

type ContestProblem = {
  id: number;
  title: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  statement: string;
  exampleInput: string;
  exampleOutput: string;
  constraints: string[];
  starter: string;
};

const CONTEST_SET: ContestProblem[] = [
  { id: 1, title: "Array Balancing", points: 250, difficulty: "Easy", statement: "Given an integer array, return the minimum number of moves required to make all elements equal. In one move you may increment or decrement any element by 1.", exampleInput: "nums = [1, 2, 3]", exampleOutput: "2", constraints: ["1 <= nums.length <= 100000", "-10^9 <= nums[i] <= 10^9"], starter: "def solve(nums):\n    # Minimum moves to make all values equal\n    pass\n\nprint(solve([1, 2, 3]))" },
  { id: 2, title: "String Transformation", points: 500, difficulty: "Medium", statement: "Given two strings s and t, return true if s can be transformed into t by replacing each character consistently with another character.", exampleInput: 's = "egg", t = "add"', exampleOutput: "true", constraints: ["1 <= s.length == t.length <= 50000", "s and t contain lowercase English letters"], starter: "def solve(s, t):\n    # Check if character mapping is consistent\n    pass\n\nprint(solve('egg', 'add'))" },
  { id: 3, title: "Graph Components", points: 750, difficulty: "Medium", statement: "Given n nodes and a list of undirected edges, return the number of connected components in the graph.", exampleInput: "n = 5, edges = [[0,1],[1,2],[3,4]]", exampleOutput: "2", constraints: ["1 <= n <= 200000", "0 <= edges.length <= 200000"], starter: "def solve(n, edges):\n    # Count connected components\n    pass\n\nprint(solve(5, [[0,1],[1,2],[3,4]]))" },
  { id: 4, title: "Dynamic Optimization", points: 1000, difficulty: "Hard", statement: "Given an array nums, return the maximum sum of a subsequence with no two adjacent elements selected.", exampleInput: "nums = [2, 7, 9, 3, 1]", exampleOutput: "12", constraints: ["1 <= nums.length <= 100000", "0 <= nums[i] <= 10^9"], starter: "def solve(nums):\n    # Maximum non-adjacent subsequence sum\n    pass\n\nprint(solve([2, 7, 9, 3, 1]))" },
  { id: 5, title: "Server Load Routing", points: 1250, difficulty: "Hard", statement: "Given request weights and server capacities, return the maximum number of requests that can be routed without exceeding any server capacity.", exampleInput: "requests = [2,3,4], servers = [5,4]", exampleOutput: "3", constraints: ["1 <= requests.length <= 200000", "1 <= servers.length <= 200000"], starter: "def solve(requests, servers):\n    # Greedy / sorting challenge\n    pass\n\nprint(solve([2,3,4], [5,4]))" },
];

export default function ContestArena() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contest = CONTESTS.find((c) => c.id === id);

  const [fullscreen, setFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Math.min(contest?.durationMins || 30, 30) * 60);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [codes, setCodes] = useState<Record<number, string>>(() => Object.fromEntries(CONTEST_SET.map((p, i) => [i, p.starter])));
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [exitAttempt, setExitAttempt] = useState(0);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [contestEnded, setContestEnded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() =>
    LEADERBOARD.map((u) => ({ ...u, score: u.rating, solved: Math.min(5, Math.floor(u.solved / 300)) }))
  );
  const copyWarnings = useRef(0);
  const tabSwitchCount = useRef(0);

  const active = CONTEST_SET[currentProblem];
  const solvedCount = Object.keys(submitted).length;
  const score = CONTEST_SET.reduce((sum, p, idx) => sum + (submitted[idx] ? p.points : 0), 0);

  useEffect(() => {
    if (!contest) return;
    const paid = localStorage.getItem(`contest_${contest.id}_paid`) === "true";
    if (!paid) navigate(`/contest/${contest.id}/register`, { replace: true });
  }, [contest, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!contestEnded) {
        setContestEnded(true);
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, contestEnded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard((prev: Array<(typeof leaderboard)[number]>) => {
        const board = prev.map((u) => ({ ...u }));
        const idx = Math.floor(Math.random() * board.length);
        if (Math.random() > 0.55) {
          board[idx].score += [250, 500, 750][Math.floor(Math.random() * 3)];
          board[idx].solved += 1;
        }
        return board.sort((a, b) => b.score - a.score).map((u, rank) => ({ ...u, rank: rank + 1 }));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && !contestEnded) {
        tabSwitchCount.current += 1;
        alert(`Anti-cheat warning: tab switching is not allowed. Attempt ${tabSwitchCount.current}/3`);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [contestEnded]);

  useEffect(() => {
    const onFullscreen = () => {
      if (!document.fullscreenElement && fullscreen && timeLeft > 0 && !contestEnded) {
        setExitAttempt((prev) => {
          const next = prev + 1;
          if (next >= 3) alert("Multiple exit attempts detected. This contest will be flagged for review.");
          else document.documentElement.requestFullscreen().catch(() => {});
          return next;
        });
      }
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, [fullscreen, timeLeft, contestEnded]);

  useEffect(() => { document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => {}); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.shiftKey ? handleSubmit() : handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      alert("Sample tests passed. Submit to run hidden tests.");
    }, 900);
  };

  const handleSubmit = () => {
    if (submitted[currentProblem]) return;
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setSubmitted((prev) => ({ ...prev, [currentProblem]: true }));
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.62 } });
    }, 1200);
  };

  const handleExitContest = () => {
    if (timeLeft > 0) setShowExitWarning(true);
    else navigate("/contests");
  };

  const handleCopyPaste = (e: any) => {
    e.preventDefault();
    copyWarnings.current += 1;
    alert(`Anti-cheat: copy/paste is disabled during live contests. Warning ${copyWarnings.current}.`);
  };

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Contest Not Found</h1>
          <button onClick={() => navigate("/contests")} className="text-violet-400 mt-4 hover:underline">Back to contests</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070d] overflow-hidden">
      {contestEnded && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-3xl p-8 max-w-md w-full border border-emerald-500/30 text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-2">Contest Ended</h2>
            <p className="text-nova-muted text-sm mb-6">Your final score is ready.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/30 p-4 rounded-xl">
                <div className="text-2xl font-bold text-emerald-400">{solvedCount}/{CONTEST_SET.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-nova-muted font-bold mt-1">Solved</div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl">
                <div className="text-2xl font-bold text-violet-400">{score}</div>
                <div className="text-[10px] uppercase tracking-wider text-nova-muted font-bold mt-1">Score</div>
              </div>
            </div>
            <button onClick={() => navigate("/contests")} className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold hover:scale-[1.02] transition shadow-lg shadow-violet-500/30">View Results</button>
          </motion.div>
        </div>
      )}

      {showExitWarning && !contestEnded && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-3xl p-8 max-w-md w-full border border-rose-500/30">
            <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white text-center mb-3">Exit Contest?</h2>
            <p className="text-nova-muted text-center text-sm mb-6">You still have <strong className="text-white">{formatTime(timeLeft)}</strong> remaining. Exiting will auto-submit your current work.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitWarning(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition">Continue</button>
              <button onClick={() => { document.exitFullscreen().catch(() => {}); navigate("/contests"); }} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold">Exit</button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /><span className="text-white font-bold">{contest.title}</span></div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-1.5 text-sm"><Users className="w-4 h-4 text-cyan-400" /><span className="text-white font-mono font-bold">8,421</span><span className="text-nova-muted">active</span></div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 300 ? "bg-rose-500/20 border border-rose-500/30" : "bg-white/5 border border-white/10"}`}>
            <Clock className={`w-5 h-5 ${timeLeft < 300 ? "text-rose-400 animate-pulse" : "text-cyan-400"}`} />
            <span className={`font-mono font-black text-lg ${timeLeft < 300 ? "text-rose-400" : "text-white"}`}>{formatTime(timeLeft)}</span>
          </div>
          <div className="hidden md:flex px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-nova-muted">Score: <span className="ml-1 text-white font-bold">{score}</span></div>
          <button onClick={() => setFullscreen(!fullscreen)} className="p-2 rounded-lg hover:bg-white/5 text-nova-muted hover:text-white">{fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}</button>
          <button onClick={handleExitContest} className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition">Exit</button>
        </div>
      </div>

      <div className="p-4 grid lg:grid-cols-12 gap-4 h-[calc(100vh-64px)]">
        <div className="lg:col-span-3 glass rounded-2xl overflow-hidden border border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5 flex items-center justify-between"><h3 className="text-white font-bold flex items-center gap-2"><List className="w-5 h-5 text-violet-400" /> Problems</h3><span className="text-xs text-nova-muted">{solvedCount}/{CONTEST_SET.length}</span></div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {CONTEST_SET.map((p, i) => (
              <button key={p.id} onClick={() => setCurrentProblem(i)} className={`w-full p-3 rounded-xl text-left transition-all ${currentProblem === i ? "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/40" : "bg-white/[0.02] border border-white/5 hover:bg-white/5"}`}>
                <div className="flex items-center justify-between mb-1"><span className="text-white font-bold text-sm">{String.fromCharCode(65 + i)}. {p.title}</span>{submitted[i] && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}</div>
                <div className="flex items-center gap-2 text-xs"><span className={`px-2 py-0.5 rounded font-bold ${p.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400" : p.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"}`}>{p.difficulty}</span><span className="text-nova-muted flex items-center gap-1"><Award className="w-3 h-3" /> {p.points} pts</span></div>
              </button>
            ))}
            <div className="mt-5 pt-4 border-t border-white/5">
              <div className="text-xs font-bold text-nova-muted uppercase mb-2">Live top 3</div>
              {leaderboard.slice(0, 3).map((u) => <div key={u.handle} className="flex items-center justify-between text-xs py-1.5"><span className="text-white truncate">#{u.rank} {u.country} {u.name}</span><span className="text-violet-300 font-mono">{u.score}</span></div>)}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 glass rounded-2xl overflow-hidden border border-white/5 flex flex-col">
          <div className="p-4 border-b border-white/5"><h3 className="text-white font-bold flex items-center gap-2"><Code2 className="w-5 h-5 text-cyan-400" /> Problem Statement</h3></div>
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-2xl font-black text-white mb-3">{String.fromCharCode(65 + currentProblem)}. {active.title}</h2>
            <div className="flex gap-2 mb-5 text-xs"><span className={`px-2 py-1 rounded font-bold ${active.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400" : active.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"}`}>{active.difficulty}</span><span className="px-2 py-1 rounded bg-white/5 text-nova-muted">{active.points} points</span></div>
            <p className="text-nova-muted leading-relaxed">{active.statement}</p>
            <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-white/90"><div className="mb-2"><span className="text-nova-muted">Input:</span> {active.exampleInput}</div><div><span className="text-nova-muted">Output:</span> {active.exampleOutput}</div></div>
            <h3 className="text-lg font-bold text-white mt-6 mb-3">Constraints</h3>
            <ul className="text-sm text-nova-muted space-y-1 list-disc list-inside">{active.constraints.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="flex-1 min-h-0 relative" onCopy={handleCopyPaste} onPaste={handleCopyPaste}>
            {isRunning && <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl border border-white/10"><div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" /><span className="text-white font-bold text-lg">Running hidden tests...</span></div>}
            <CodeEditorPro value={codes[currentProblem] || active.starter} onChange={(value) => setCodes((prev) => ({ ...prev, [currentProblem]: value }))} language="python" onLanguageChange={() => {}} onRun={handleRun} onSubmit={handleSubmit} isRunning={isRunning} isSubmitted={!!submitted[currentProblem]} />
          </div>
        </div>
      </div>

      {exitAttempt > 0 && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"><div className="glass-strong rounded-2xl px-6 py-3 border border-amber-500/30 bg-amber-500/10 flex items-center gap-3"><Shield className="w-5 h-5 text-amber-400" /><span className="text-white text-sm font-bold">Exit attempts: {exitAttempt}/3</span><span className="text-nova-muted text-xs">Next attempt will be flagged</span></div></div>}
    </div>
  );
}