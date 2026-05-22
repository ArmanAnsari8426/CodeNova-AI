import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Menu, Sparkles, X, LogOut, User, LayoutDashboard,
  ChevronDown, Settings, Trophy, Code2, Crown, Flame, Award,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/authSlice";

const NAV = [
  { to: "/problems", label: "Problems" },
  { to: "/compiler", label: "Compiler" },
  { to: "/contests", label: "Contests" },
  { to: "/ai-assistant", label: "AI Assistant" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/blog", label: "Blog" },
];

const FAKE_NOTIFS = [
  { id: "n1", icon: Trophy,  color: "text-amber-400",  title: "Nova Weekly #142 starts in 30 min!", time: "Just now", unread: true },
  { id: "n2", icon: Flame,   color: "text-orange-400", title: "32-day streak — new personal best! 🔥", time: "2h ago", unread: true },
  { id: "n3", icon: Award,   color: "text-violet-400", title: "You unlocked the Streak Master badge", time: "5h ago", unread: true },
  { id: "n4", icon: Code2,   color: "text-cyan-400",   title: "New problem: LRU Cache — Medium", time: "Yesterday", unread: false },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(s => s.auth);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setNotifOpen(false); setProfileOpen(false); }, [location.pathname]);

  const unread = FAKE_NOTIFS.filter(n => n.unread).length;
  const initials = (user?.fullName || "DN").split(" ").map(s => s[0]).join("").slice(0, 2);
  const firstName = (user?.fullName || "Guest").split(" ")[0];

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <nav className={`flex items-center justify-between rounded-2xl px-3 sm:px-4 py-2.5 transition-all duration-300 ${scrolled ? "glass-strong shadow-2xl shadow-black/40" : "bg-transparent"}`}>
          <Logo />

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-1 ml-6">
            {NAV.map(item => (
              <li key={item.to}>
                <NavLink to={item.to}
                  className={({ isActive }) => `relative px-3.5 py-2 text-sm font-medium rounded-lg transition ${isActive ? "text-white" : "text-nova-muted hover:text-white"}`}>
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06] border border-white/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications Bell */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
                className="relative p-2 rounded-lg text-nova-muted hover:text-white hover:bg-white/5 transition">
                <Bell className="w-5 h-5" />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-nova-pink ring-2 ring-nova-bg" />}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl p-2 shadow-2xl shadow-black/60">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-sm font-semibold text-white">Notifications</p>
                      <span className="text-xs text-nova-muted">{unread} unread</span>
                    </div>
                    <ul className="space-y-1 max-h-80 overflow-y-auto">
                      {FAKE_NOTIFS.map(n => {
                        const Icon = n.icon;
                        return (
                          <li key={n.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer ${n.unread ? "bg-white/[0.03]" : ""}`}>
                            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${n.color}`} />
                            <div>
                              <p className="text-sm text-white">{n.title}</p>
                              <p className="text-[11px] text-nova-muted mt-0.5">{n.time}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm text-white font-medium max-w-[100px] truncate">{firstName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-nova-muted hidden sm:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl p-2 shadow-2xl shadow-black/60">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] mb-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white">{initials}</div>
                      <div>
                        <div className="text-sm text-white font-semibold">{user?.fullName || "Guest User"}</div>
                        <div className="text-xs text-nova-muted">@{user?.username || "guest"}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 px-2 py-2 mb-1">
                      <div className="text-center"><div className="text-xs text-amber-400 font-bold">32</div><div className="text-[10px] text-nova-muted">Streak</div></div>
                      <div className="text-center"><div className="text-xs text-violet-400 font-bold">14.8K</div><div className="text-[10px] text-nova-muted">XP</div></div>
                      <div className="text-center"><div className="text-xs text-emerald-400 font-bold">#1</div><div className="text-[10px] text-nova-muted">Rank</div></div>
                    </div>
                    <div className="h-px bg-white/5 mx-2" />
                    <div className="py-1">
                      <ProfileLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                      <ProfileLink to="/dashboard" icon={User} label="Profile" />
                      <ProfileLink to="/contests" icon={Crown} label="My Contests" />
                      <ProfileLink to="/dashboard" icon={Settings} label="Settings" />
                    </div>
                    <div className="h-px bg-white/5 mx-2" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10 transition mt-1">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Get Started Button — always visible */}
            <Link to="/signup"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-violet-500/30 transition">
              <Sparkles className="w-4 h-4" /> Get Started
            </Link>

            {/* Mobile Menu */}
            <button onClick={() => setOpen(v => !v)} className="lg:hidden p-2 rounded-lg text-white hover:bg-white/5" aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 glass-strong rounded-2xl p-3">
              <ul className="space-y-1">
                {NAV.map(item => (
                  <li key={item.to}>
                    <NavLink to={item.to}
                      className={({ isActive }) => `block px-3 py-2.5 rounded-lg text-sm ${isActive ? "bg-white/10 text-white" : "text-nova-muted hover:text-white hover:bg-white/5"}`}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/5 mt-2 pt-2">
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">{initials}</div>
                  <div>
                    <div className="text-sm text-white font-medium">{firstName}</div>
                    <div className="text-xs text-nova-muted">@{user?.username || "guest"}</div>
                  </div>
                </div>
                <NavLink to="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm text-nova-muted hover:text-white hover:bg-white/5">Dashboard</NavLink>
                <NavLink to="/pricing" className="block px-3 py-2.5 rounded-lg text-sm text-nova-muted hover:text-white hover:bg-white/5">Pricing</NavLink>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10 transition">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
                <div className="flex gap-2 mt-2">
                  <Link to="/login" className="flex-1 text-center px-3 py-2 rounded-lg text-sm text-nova-muted hover:text-white border border-white/10">Sign in</Link>
                  <Link to="/signup" className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function ProfileLink({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-nova-muted hover:text-white hover:bg-white/5 transition">
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}
