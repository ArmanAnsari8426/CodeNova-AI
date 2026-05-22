import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Flame, Award, Code2, CheckCircle2, XCircle, Clock, Trophy, TrendingUp,
  Calendar, Target, Sparkles, ChevronRight, User as UserIcon,
  Mail, Phone, Edit, Plus, Trash2, Download, FileText, Users,
  BarChart3, DollarSign, ShieldAlert, Layers, Search, AlertCircle
} from "lucide-react";
import { ACHIEVEMENTS, HEATMAP, RECENT_SUBMISSIONS, SKILL_DATA, LEADERBOARD } from "@/data/mock";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateProfileLocal, clearSuccess, type User } from "@/redux/slices/authSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(s => s.auth.user);
  const successMsg = useAppSelector(s => s.auth.success);

  // Fallback demo user if not logged in
  const user: User = authUser || {
    _id: "u_demo",
    fullName: "Aarav Kumar",
    username: "arav.dev",
    email: "demo@codenova.ai",
    avatar: "",
    phone: "+91 98765 43210",
    role: "student",
    provider: "local",
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  // Modals & Interactive States
  const [editModal, setEditModal] = useState(false);
  const [resumeModal, setResumeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "submissions" | "analytics" | "teacher" | "admin">("overview");

  // Dynamic user data states
  const [skills, setSkills] = useState(SKILL_DATA);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillVal, setNewSkillVal] = useState("");
  const [submissions] = useState(RECENT_SUBMISSIONS);
  const [subQuery, setSubQuery] = useState("");
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [toast, setToast] = useState<string | null>(null);

  // Profile Edit Form State
  const [editForm, setEditForm] = useState({
    fullName: user.fullName,
    username: user.username,
    phone: user.phone,
    avatar: user.avatar || "",
  });

  // Teacher / Admin Management states
  const [students, setStudents] = useState([
    { id: "st1", name: "Priya Sharma", email: "priya@codenova.ai", solved: 342, streak: 14, rank: "Pro" },
    { id: "st2", name: "Rohan Verma", email: "rohan@codenova.ai", solved: 189, streak: 5, rank: "Starter" },
    { id: "st3", name: "Ananya Tiwari", email: "ananya@codenova.ai", solved: 512, streak: 28, rank: "Elite" },
  ]);
  const [newContestTitle, setNewContestTitle] = useState("");
  const [newProblemTitle, setNewProblemTitle] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-dismiss Redux success message (login, signup, verify OTP etc.)
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => dispatch(clearSuccess()), 4000);
    return () => clearTimeout(timer);
  }, [successMsg, dispatch]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfileLocal(editForm));
    setEditModal(false);
    showToast("Profile updated successfully!");
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillVal) return;
    const val = Math.min(Math.max(parseInt(newSkillVal) || 50, 10), 100);
    setSkills(s => [...s, { name: newSkillName.trim(), value: val }]);
    setNewSkillName("");
    setNewSkillVal("");
    showToast(`Added skill: ${newSkillName.trim()}`);
  };

  const handleDeleteSkill = (name: string) => {
    setSkills(s => s.filter(x => x.name !== name));
    showToast(`Removed skill: ${name}`);
  };

  const handleClaimAchievement = (id: string) => {
    setAchievements(a => a.map(x => x.id === id ? { ...x, unlocked: true } : x));
    showToast("🎉 Achievement Claimed! +100 XP added.");
  };

  const handleAddStudent = () => {
    const name = prompt("Enter student full name:");
    if (!name) return;
    setStudents(s => [...s, { id: "st_" + Date.now(), name, email: `${name.toLowerCase().replace(/\s+/g, "")}@codenova.ai`, solved: 0, streak: 0, rank: "Starter" }]);
    showToast(`Student ${name} added.`);
  };

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContestTitle.trim()) return;
    showToast(`🏆 Contest "${newContestTitle.trim()}" scheduled successfully!`);
    setNewContestTitle("");
  };

  const handleUploadProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblemTitle.trim()) return;
    showToast(`💻 Problem "${newProblemTitle.trim()}" published to problem bank!`);
    setNewProblemTitle("");
  };

  const filteredSubmissions = submissions.filter(s =>
    s.problem.toLowerCase().includes(subQuery.toLowerCase()) ||
    s.language.toLowerCase().includes(subQuery.toLowerCase()) ||
    s.status.toLowerCase().includes(subQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Toast Notification */}
        <AnimatePresence>
          {(toast || successMsg) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-2xl shadow-emerald-500/30 border border-white/20"
            >
              <CheckCircle2 className="w-5 h-5 animate-bounce" />
              <span>{toast || successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl glass-strong gradient-border p-6 sm:p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-400/20" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-500/30 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-lg opacity-60" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5 overflow-hidden shadow-xl shadow-violet-500/30">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-nova-bg flex items-center justify-center font-display font-extrabold text-3xl text-white">
                    {user.fullName.split(" ").map(s => s[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-nova-bg flex items-center justify-center text-xs font-bold text-white shadow-lg">
                14
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">{user.fullName}</h1>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${
                  user.role === "admin" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                  user.role === "teacher" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                  "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                }`}>
                  {user.role}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  {user.isVerified ? "✓ Verified" : "Unverified"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-nova-muted text-sm mt-2">
                <span className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" /> @{user.username}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                {user.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {user.phone}</span>}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <button
                  onClick={() => setEditModal(true)}
                  className="text-xs px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition inline-flex items-center gap-1.5 font-medium shadow-sm hover:border-violet-500/40"
                >
                  <Edit className="w-3.5 h-3.5 text-violet-400" /> Edit Profile
                </button>
                <button
                  onClick={() => setResumeModal(true)}
                  className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition inline-flex items-center gap-1.5 hover:scale-[1.02]"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Resume Builder
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
              <StatBig icon={Flame} value="32" label="Day streak" color="amber" />
              <StatBig icon={Trophy} value="14,820" label="XP" color="violet" />
              <StatBig icon={CheckCircle2} value="1,284" label="Solved" color="emerald" />
              <StatBig icon={TrendingUp} value="3,148" label="Rating" color="cyan" />
            </div>
          </div>
        </motion.div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2 border-b border-white/10">
          <TabBtn active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={Calendar} label="Overview & Heatmap" />
          <TabBtn active={activeTab === "submissions"} onClick={() => setActiveTab("submissions")} icon={Clock} label="Submissions History" />
          <TabBtn active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} icon={BarChart3} label="Skill Analytics" />
          
          {(user.role === "teacher" || user.role === "admin") && (
            <TabBtn active={activeTab === "teacher"} onClick={() => setActiveTab("teacher")} icon={Users} label="Teacher Dashboard" color="amber" />
          )}
          {user.role === "admin" && (
            <TabBtn active={activeTab === "admin"} onClick={() => setActiveTab("admin")} icon={ShieldAlert} label="Admin Control Panel" color="rose" />
          )}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              {/* Activity Heatmap */}
              <Section title="Activity Heatmap" icon={Calendar} subtitle="1,284 submissions in the last year">
                <Heatmap />
                <div className="mt-3 flex items-center justify-between text-xs text-nova-muted">
                  <span>Less Activity</span>
                  <div className="flex gap-1.5 items-center">
                    {[0,1,2,3,4].map(v => (
                      <span key={v} className="w-3.5 h-3.5 rounded-sm border border-white/5" style={{ background: heatColor(v) }} />
                    ))}
                  </div>
                  <span>More Activity</span>
                </div>
              </Section>

              {/* Skill mastery */}
              <Section title="Skill Mastery & Goals" icon={Target} subtitle="Manage your DSA & Development skill targets">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {skills.map(s => (
                    <div key={s.name} className="group relative glass rounded-xl p-3 border border-white/5 hover:border-white/10 transition">
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-white">{s.name}</span>
                        <span className="text-cyan-300">{s.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(s.name)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-rose-500/20 text-rose-300"
                        title="Remove skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Skill Form */}
                <form onSubmit={handleAddSkill} className="flex flex-wrap gap-2 items-center pt-4 border-t border-white/5">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={e => setNewSkillName(e.target.value)}
                    placeholder="New skill name (e.g. GraphQL, System Design)…"
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50 placeholder:text-nova-muted/60"
                  />
                  <input
                    type="number"
                    value={newSkillVal}
                    onChange={e => setNewSkillVal(e.target.value)}
                    placeholder="Mastery % (10-100)"
                    min="10" max="100"
                    className="w-32 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50 placeholder:text-nova-muted/60"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-md shadow-violet-500/20 hover:shadow-violet-500/40 transition inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Skill
                  </button>
                </form>
              </Section>
            </div>

            {/* Right col */}
            <div className="space-y-5">
              <Section title="Gamification & Badges" icon={Award} subtitle="Tap locked badges to claim XP rewards!">
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map(a => (
                    <button
                      key={a.id}
                      onClick={() => !a.unlocked && handleClaimAchievement(a.id)}
                      className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-2 border transition w-full ${
                        a.unlocked
                          ? "bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-cyan-500/15 border-violet-500/30 shadow-lg shadow-violet-500/10"
                          : "bg-white/[0.02] border-white/5 opacity-50 hover:opacity-100 hover:border-amber-500/40 cursor-pointer"
                      }`}
                    >
                      <div className="text-3xl group-hover:scale-110 transition duration-200">{a.emoji}</div>
                      <div className="text-[10px] font-semibold text-white mt-1.5 leading-tight line-clamp-1">{a.name}</div>
                      {a.unlocked ? (
                        <CheckCircle2 className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[9px] font-bold text-amber-300 p-1">
                          Claim XP
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Top Global Leaderboard" icon={Trophy}>
                <div className="space-y-2">
                  {LEADERBOARD.slice(0, 5).map(u => (
                    <div key={u.rank} className="flex items-center gap-3 p-2.5 rounded-xl glass border border-white/5 hover:border-white/10 transition">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        u.rank === 1 ? "bg-amber-500/30 text-amber-300 border border-amber-500/40" :
                        u.rank === 2 ? "bg-slate-300/30 text-slate-200 border border-slate-300/40" :
                        u.rank === 3 ? "bg-orange-500/30 text-orange-300 border border-orange-500/40" :
                        "bg-white/5 text-nova-muted"
                      }`}>{u.rank}</span>
                      <div className="flex-1 min-w-0 text-sm text-white truncate font-medium">{u.country} {u.name}</div>
                      <span className="text-xs text-violet-300 font-mono font-semibold">{u.rating}</span>
                    </div>
                  ))}
                  <Link to="/leaderboard" className="w-full text-xs text-violet-300 hover:text-violet-200 inline-flex items-center justify-center gap-1 pt-2 font-medium">
                    View Complete Hall of Code <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* Tab 2: Submissions History */}
        {activeTab === "submissions" && (
          <div className="glass rounded-3xl p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-400" /> Submissions History
                </h2>
                <p className="text-xs text-nova-muted mt-1">Review, filter, and analyze your coding problem attempts</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
                <input
                  type="text"
                  value={subQuery}
                  onChange={e => setSubQuery(e.target.value)}
                  placeholder="Filter by problem, lang, status…"
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-nova-muted uppercase tracking-wider border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left font-semibold py-3 px-4">Problem</th>
                    <th className="text-left font-semibold py-3 px-4">Language</th>
                    <th className="text-left font-semibold py-3 px-4">Status</th>
                    <th className="text-right font-semibold py-3 px-4">Runtime</th>
                    <th className="text-right font-semibold py-3 px-4">Memory</th>
                    <th className="text-right font-semibold py-3 px-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSubmissions.map(s => (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition">
                      <td className="py-4 px-4 font-medium text-white">{s.problem}</td>
                      <td className="py-4 px-4 text-nova-muted font-mono text-xs">{s.language}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          s.status === "Accepted" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" :
                          s.status === "Wrong Answer" ? "bg-rose-500/10 text-rose-300 border-rose-500/30" :
                          "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}>
                          {s.status === "Accepted" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                           s.status === "Wrong Answer" ? <XCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-nova-muted font-mono text-xs">{s.runtime}</td>
                      <td className="py-4 px-4 text-right text-nova-muted font-mono text-xs">{s.memory || "16.4 MB"}</td>
                      <td className="py-4 px-4 text-right text-nova-muted text-xs">{s.time}</td>
                    </tr>
                  ))}
                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-nova-muted text-xs">
                        No submissions match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Analytics */}
        {activeTab === "analytics" && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="glass rounded-3xl p-6 border border-white/10">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" /> Problem Solving Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-emerald-300">Easy (512 solved)</span>
                    <span className="text-nova-muted">78% success rate</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: "78%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-amber-300">Medium (642 solved)</span>
                    <span className="text-nova-muted">54% success rate</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: "54%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-rose-300">Hard (130 solved)</span>
                    <span className="text-nova-muted">31% success rate</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: "31%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border border-white/10">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-violet-400" /> Language Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Python", val: 45, col: "bg-violet-500" },
                  { name: "JavaScript / TypeScript", val: 30, col: "bg-cyan-500" },
                  { name: "C++", val: 15, col: "bg-emerald-500" },
                  { name: "Java / Go / Rust", val: 10, col: "bg-amber-500" },
                ].map(l => (
                  <div key={l.name}>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-white">{l.name}</span>
                      <span className="text-nova-muted">{l.val}% of submissions</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full ${l.col}`} style={{ width: `${l.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Teacher Dashboard */}
        {activeTab === "teacher" && (user.role === "teacher" || user.role === "admin") && (
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" /> Teacher Control Panel
                  </h2>
                  <p className="text-xs text-nova-muted mt-1">Manage your classroom students, assign contests, and review performance reports</p>
                </div>
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Student
                </button>
              </div>

              {/* Student Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-nova-muted uppercase tracking-wider border-b border-white/10 bg-white/[0.02]">
                      <th className="text-left font-semibold py-3 px-4">Student Name</th>
                      <th className="text-left font-semibold py-3 px-4">Email</th>
                      <th className="text-right font-semibold py-3 px-4">Problems Solved</th>
                      <th className="text-right font-semibold py-3 px-4">Current Streak</th>
                      <th className="text-center font-semibold py-3 px-4">Tier Rank</th>
                      <th className="text-right font-semibold py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {students.map(st => (
                      <tr key={st.id} className="hover:bg-white/[0.03] transition">
                        <td className="py-4 px-4 font-medium text-white">{st.name}</td>
                        <td className="py-4 px-4 text-nova-muted text-xs">{st.email}</td>
                        <td className="py-4 px-4 text-right text-emerald-300 font-mono font-semibold">{st.solved}</td>
                        <td className="py-4 px-4 text-right text-amber-300 font-mono font-semibold">{st.streak}d</td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/90 border border-white/10 font-medium">
                            {st.rank}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => { setStudents(s => s.filter(x => x.id !== st.id)); showToast(`Student ${st.name} removed.`); }}
                            className="p-1 rounded hover:bg-rose-500/20 text-rose-300 transition"
                            title="Remove student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contest & Problem Creation Forms */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="glass rounded-3xl p-6 border border-white/10">
                <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Schedule Live Contest
                </h3>
                <form onSubmit={handleCreateContest} className="space-y-3">
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Contest Title</label>
                    <input
                      type="text"
                      value={newContestTitle}
                      onChange={e => setNewContestTitle(e.target.value)}
                      placeholder="e.g. AI x Code Nova Hackathon #4"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-nova-muted font-medium mb-1 block">Duration (Minutes)</label>
                      <input type="number" defaultValue="120" className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-nova-muted font-medium mb-1 block">Prize Pool</label>
                      <input type="text" defaultValue="$5,000" className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition">
                    Schedule Contest
                  </button>
                </form>
              </div>

              <div className="glass rounded-3xl p-6 border border-white/10">
                <h3 className="font-display text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-violet-400" /> Upload Coding Problem
                </h3>
                <form onSubmit={handleUploadProblem} className="space-y-3">
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Problem Title</label>
                    <input
                      type="text"
                      value={newProblemTitle}
                      onChange={e => setNewProblemTitle(e.target.value)}
                      placeholder="e.g. Merge K Sorted Linked Lists"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-nova-muted font-medium mb-1 block">Difficulty</label>
                      <select className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-nova-muted font-medium mb-1 block">Category Tags</label>
                      <input type="text" defaultValue="Array, DP" className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-md shadow-violet-500/20 hover:shadow-violet-500/40 transition">
                    Publish Problem
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Admin Control Panel */}
        {activeTab === "admin" && user.role === "admin" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass rounded-3xl p-5 border border-rose-500/30">
                <div className="flex items-center justify-between text-rose-300 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">$142,840</div>
                <div className="text-xs text-nova-muted mt-1">+18.4% from last month</div>
              </div>
              <div className="glass rounded-3xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-cyan-300 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">2.4M+</div>
                <div className="text-xs text-nova-muted mt-1">128k online right now</div>
              </div>
              <div className="glass rounded-3xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-amber-300 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Contests Held</span>
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-white">1,248</div>
                <div className="text-xs text-nova-muted mt-1">Next contest in 30 min</div>
              </div>
              <div className="glass rounded-3xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-violet-300 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">System Health</span>
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">99.99%</div>
                <div className="text-xs text-nova-muted mt-1">All microservices operational</div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border border-rose-500/30">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" /> System Logs & Recent Actions
              </h3>
              <div className="space-y-2.5 font-mono text-xs text-nova-muted">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span>[AUTH] New user registration: ananya@codenova.ai</span>
                  <span className="text-emerald-400">SUCCESS</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span>[JUDGE0] Docker execution container #841 spun up for C++ compilation</span>
                  <span className="text-cyan-400">ISOLATED</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <span>[PAYMENT] Stripe webhook: Subscription upgraded to Pro for arav.dev</span>
                  <span className="text-violet-400">PAID</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Edit Profile */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditModal(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md glass-strong rounded-3xl p-6 sm:p-8 gradient-border shadow-2xl shadow-black/80"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-violet-400" /> Edit Profile Information
                </h3>
                <button onClick={() => setEditModal(false)} className="p-1 rounded-lg hover:bg-white/10 text-nova-muted hover:text-white">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Avatar Image URL</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={e => setEditForm(f => ({ ...f, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Resume Builder */}
      <AnimatePresence>
        {resumeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setResumeModal(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-3xl glass-strong rounded-3xl p-6 sm:p-10 gradient-border shadow-2xl shadow-black/80 my-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-violet-400" /> Professional Developer Resume
                  </h3>
                  <p className="text-xs text-nova-muted mt-1">Generated live from your CodeNova AI learning & contest achievements</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => { window.print(); }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition inline-flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download PDF / Print
                  </button>
                  <button onClick={() => setResumeModal(false)} className="p-2 rounded-xl hover:bg-white/10 text-nova-muted hover:text-white">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Resume Preview Box */}
              <div className="bg-white text-black p-8 rounded-2xl shadow-inner font-sans space-y-6">
                <div className="border-b-2 border-gray-300 pb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{user.fullName}</h1>
                    <p className="text-violet-600 font-semibold text-base mt-1">Senior Full Stack Developer & DSA Specialist</p>
                  </div>
                  <div className="text-right text-xs text-gray-600 space-y-1">
                    <p>📧 {user.email}</p>
                    {user.phone && <p>📞 {user.phone}</p>}
                    <p>🌐 codenova.ai/@{user.username}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Professional Summary</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Accomplished developer with verified top-tier ranking on CodeNova AI. Demonstrated expertise in Data Structures, Algorithms, and Multi-language Cloud Compilation. Active participant in weekly competitive programming contests with a peak rating of 3,148.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Key Metrics</h2>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>🏆 <strong>Global Rating:</strong> 3,148 (Rank #1)</li>
                      <li>💻 <strong>Problems Solved:</strong> 1,284 across 7 languages</li>
                      <li>🔥 <strong>Coding Streak:</strong> 32 Days consecutive</li>
                      <li>⭐ <strong>Total Experience:</strong> 14,820 XP (Level 14)</li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Technical Skills</h2>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {skills.map(s => (
                        <span key={s.name} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-semibold border border-gray-300">
                          {s.name} ({s.value}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3 uppercase tracking-wider">Recent Projects & Contributions</h2>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <h4 className="font-bold text-gray-900">CodeNova AI Multi-language Online Playground</h4>
                      <p className="text-xs text-gray-600">Built using React, TypeScript, Monaco/Custom AST, and Docker Isolated Sandboxes.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Advanced Dynamic Programming Solutions Bank</h4>
                      <p className="text-xs text-gray-600">Authored and verified optimal O(N) time & space complexity solutions for 50+ Hard DSA challenges.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label, color = "violet" }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string; color?: "violet" | "amber" | "rose" }) {
  const colorMap = {
    violet: active ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-violet-500/50 shadow-lg shadow-violet-500/20" : "glass text-nova-muted hover:text-white border-white/5",
    amber: active ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500/50 shadow-lg shadow-amber-500/20" : "glass text-amber-300/80 hover:text-amber-300 border-amber-500/20",
    rose: active ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white border-rose-500/50 shadow-lg shadow-rose-500/20" : "glass text-rose-300/80 hover:text-rose-300 border-rose-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition whitespace-nowrap ${colorMap[color]}`}
    >
      <Icon className="w-4 h-4 shrink-0" /> {label}
    </button>
  );
}

function Section({ title, subtitle, icon: Icon, children }: any) {
  return (
    <div className="glass rounded-3xl p-6 border border-white/10">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Icon className="w-5 h-5 text-violet-400" /> {title}
          </h2>
          {subtitle && <p className="text-xs text-nova-muted mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function StatBig({ icon: Icon, value, label, color }: any) {
  const map = { amber: "text-amber-400", violet: "text-violet-400", emerald: "text-emerald-400", cyan: "text-cyan-400" } as const;
  return (
    <div className="rounded-2xl bg-black/30 border border-white/5 p-4 flex flex-col justify-center shadow-inner">
      <Icon className={`w-5 h-5 mb-2 ${map[color as keyof typeof map]}`} />
      <div className="text-2xl font-extrabold text-white leading-tight">{value}</div>
      <div className="text-xs text-nova-muted mt-0.5">{label}</div>
    </div>
  );
}

function heatColor(v: number) {
  if (v === 0) return "rgba(255,255,255,0.03)";
  if (v === 1) return "rgba(124, 92, 255, 0.25)";
  if (v === 2) return "rgba(124, 92, 255, 0.5)";
  if (v === 3) return "rgba(124, 92, 255, 0.75)";
  return "rgba(25, 226, 197, 1)";
}

function Heatmap() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1" style={{ minWidth: 720 }}>
        {HEATMAP.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day} submissions`}
                className="w-3 h-3 rounded-sm border border-white/5 hover:border-white/40 transition"
                style={{ background: heatColor(day) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
