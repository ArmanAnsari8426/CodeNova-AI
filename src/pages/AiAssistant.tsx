import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, Bug, BookOpen, Brain, Zap, FileSearch,
  Copy, ThumbsUp, ThumbsDown, ChevronDown,
  LayoutTemplate, TerminalSquare, Trash2, Settings
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

/* ══════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ══════════════════════════════════════════════════════════════ */
type Msg = { 
  id: string; 
  role: "user" | "ai"; 
  text: string; 
  ts: number; 
  codeSnippet?: string; 
  rating?: "up" | "down";
  suggestedActions?: string[];
};

interface ChatSession {
  id: string;
  title: string;
  messages: Msg[];
  createdAt: number;
  mode: string;
}

const SESSIONS_KEY = "nova_ai_pro_sessions";
const CURRENT_KEY = "nova_ai_pro_current";

const MODES = [
  { id: "mentor", label: "Mentor Mode", icon: Brain, desc: "Step-by-step guidance without giving direct answers.", color: "from-violet-500 to-fuchsia-500", glow: "shadow-violet-500/30" },
  { id: "debug", label: "Debugger", icon: Bug, desc: "Finds bugs, memory leaks, and logic errors in code.", color: "from-rose-500 to-orange-500", glow: "shadow-rose-500/30" },
  { id: "architect", label: "System Architect", icon: LayoutTemplate, desc: "High-level design, database schema, and scaling.", color: "from-cyan-500 to-blue-600", glow: "shadow-cyan-500/30" },
  { id: "reviewer", label: "Code Reviewer", icon: FileSearch, desc: "Analyzes Big-O complexity and code quality.", color: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30" },
];

const SUGGESTED_PROMPTS = [
  { label: "Analyze Complexity", icon: Zap, prompt: "Can you analyze the time and space complexity of my function?" },
  { label: "Find Edge Cases", icon: ShieldAlert, prompt: "What edge cases am I missing in my current implementation?" },
  { label: "Explain like I'm 5", icon: BookOpen, prompt: "Explain how Dynamic Programming works using a simple analogy." },
  { label: "Convert to Python", icon: TerminalSquare, prompt: "Translate this JavaScript logic into Python 3 optimally." },
];

// Fallback for missing icon
function ShieldAlert(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
}

/* ══════════════════════════════════════════════════════════════
   STORAGE HELPERS
   ══════════════════════════════════════════════════════════════ */
function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSessions(sessions: ChatSession[]) {
  try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions)); } catch {}
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function AiAssistant() {
  const user = useAppSelector(s => s.auth.user);
  const initials = (user?.fullName || "Dev").split(" ").map(s => s[0]).join("").slice(0, 2);

  // State
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [currentId, setCurrentId] = useState<string | null>(() => {
    try { return localStorage.getItem(CURRENT_KEY) || null; } catch { return null; }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState("mentor");
  const [showModes, setShowModes] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const current = sessions.find(s => s.id === currentId);
  const messages = current ? current.messages : [];

  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Persist current ID
  useEffect(() => {
    if (currentId) {
      try { localStorage.setItem(CURRENT_KEY, currentId); } catch {}
    }
  }, [currentId]);

  /* ── Chat Actions ─────────────────────────────────────────── */
  const createSession = useCallback((firstMsg: Msg, mMode: string) => {
    const id = "s_" + Date.now().toString(36);
    const title = firstMsg.text.slice(0, 30) + "...";
    
    const welcomeMsg: Msg = {
      id: "m_welcome", role: "ai", ts: Date.now() - 1000,
      text: `Hello ${user?.fullName?.split(" ")[0] || ""}! I'm operating in **${MODES.find(m => m.id === mMode)?.label}**. How can I assist you today?`,
    };

    const session: ChatSession = { id, title, mode: mMode, messages: [welcomeMsg, firstMsg], createdAt: Date.now() };
    const updated = [session, ...sessions];
    setSessions(updated);
    setCurrentId(id);
    saveSessions(updated);
  }, [sessions, user]);

  const appendMsg = useCallback((msg: Msg) => {
    if (!currentId) return;
    const updated = sessions.map(s => s.id === currentId ? { ...s, messages: [...s.messages, msg] } : s);
    setSessions(updated);
    saveSessions(updated);
  }, [currentId, sessions]);

  const startNewChat = () => {
    setCurrentId(null);
    setInput("");
    inputRef.current?.focus();
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
    if (currentId === id) setCurrentId(updated[0]?.id || null);
  };

  /* ── Send Message ─────────────────────────────────────────── */
  const handleSend = (text: string) => {
    if (!text.trim() || typing) return;
    
    const userMsg: Msg = { id: "m_" + Date.now(), role: "user", text: text.trim(), ts: Date.now() };

    if (!currentId) {
      createSession(userMsg, mode);
    } else {
      appendMsg(userMsg);
    }

    setInput("");
    setTyping(true);

    // Dynamic typing delay based on prompt length
    const delay = text.length > 50 ? 1500 : 800;

    setTimeout(() => {
      const { reply, code, actions } = getAIResponse(text, current ? current.mode : mode);
      const aiMsg: Msg = { 
        id: "m_" + Date.now(), role: "ai", text: reply, ts: Date.now(), 
        codeSnippet: code, suggestedActions: actions 
      };
      
      setSessions(prev => {
        const id = currentId || prev[0].id;
        const updated = prev.map(s => s.id === id ? { ...s, messages: [...s.messages, aiMsg] } : s);
        saveSessions(updated);
        return updated;
      });
      setTyping(false);
    }, delay + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const activeModeObj = MODES.find(m => m.id === (current ? current.mode : mode)) || MODES[0];

  return (
    <div className="pt-20 pb-6 px-3 sm:px-4 max-w-[1600px] mx-auto h-screen flex gap-4 overflow-hidden">
      
      {/* ── Left Sidebar (History) ──────────────────────────────── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ width: 0, opacity: 0, x: -20 }}
            animate={{ width: 280, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -20 }}
            className="hidden lg:flex flex-col glass-strong rounded-3xl border border-white/10 overflow-hidden shrink-0 shadow-2xl"
          >
            <div className="p-5 border-b border-white/10 bg-black/20">
              <button 
                onClick={startNewChat}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-sm shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Conversation
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
              <div className="px-3 py-2 text-xs font-bold text-nova-muted uppercase tracking-wider">Recent Chats</div>
              {sessions.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-nova-muted italic">No chat history. Start a new one!</div>
              ) : (
                sessions.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => setCurrentId(s.id)}
                    className={`group p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      currentId === s.id ? "bg-white/10 border border-white/20 shadow-md" : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-white font-semibold truncate">{s.title}</div>
                      <div className="text-[10px] text-nova-muted mt-1 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${MODES.find(m => m.id === s.mode)?.color || "bg-gray-500"}`} />
                        {MODES.find(m => m.id === s.mode)?.label}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => deleteSession(s.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300 transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Chat Area ─────────────────────────────────────── */}
      <div className="flex-1 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-white/10 bg-black/30 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowHistory(!showHistory)} className="hidden lg:block p-2 rounded-xl hover:bg-white/10 text-nova-muted transition">
              <PanelLeft className="w-5 h-5" />
            </button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeModeObj.color} flex items-center justify-center text-white shadow-lg ${activeModeObj.glow}`}>
              <activeModeObj.icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base flex items-center gap-2">
                Nova AI <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] uppercase tracking-wider">{activeModeObj.label}</span>
              </h2>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Advanced GPT-4 Class Engine
              </div>
            </div>
          </div>

          {/* Mode Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowModes(!showModes)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-nova-muted" /> Config Mode <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showModes && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 glass-strong rounded-2xl p-2 border border-white/10 shadow-2xl z-50"
                >
                  {MODES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setMode(m.id); setShowModes(false); }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition ${current?.mode === m.id || (!current && mode === m.id) ? "bg-white/10 border border-white/10" : "hover:bg-white/5 border border-transparent"}`}
                      disabled={!!current} // Prevent changing mode mid-session
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0`}>
                        <m.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">{m.label}</div>
                        <div className="text-[10px] text-nova-muted mt-0.5 leading-snug">{m.desc}</div>
                      </div>
                    </button>
                  ))}
                  {!!current && <div className="p-2 text-[10px] text-amber-400 text-center bg-amber-500/10 rounded-lg mt-2">Start a new chat to change modes.</div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scrollbar-thin bg-gradient-to-b from-[#07070d] to-[#0a0a14]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center animate-fadeIn">
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${activeModeObj.color} flex items-center justify-center shadow-2xl ${activeModeObj.glow} mb-8`}>
                <activeModeObj.icon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-display font-extrabold text-white mb-3">How can I help you code?</h2>
              <p className="text-nova-muted text-center max-w-md mb-10">
                I'm operating in <strong className="text-white">{activeModeObj.label}</strong>. Ask me anything, paste your code, or select a quick action below.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button 
                    key={p.label} onClick={() => handleSend(p.prompt)}
                    className="p-4 rounded-2xl glass border border-white/5 hover:border-violet-500/40 hover:bg-white/[0.04] transition flex items-center gap-3 text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition">
                      <p.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5">{p.label}</div>
                      <div className="text-[10px] text-nova-muted line-clamp-1">{p.prompt}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeModeObj.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                    <activeModeObj.icon className="w-5 h-5" />
                  </div>
                )}
                
                <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-6 py-4 text-[15px] leading-relaxed group ${
                  m.role === "user" 
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-tr-none shadow-xl shadow-violet-500/20" 
                    : "bg-white/[0.03] border border-white/10 text-white/90 rounded-tl-none shadow-lg"
                }`}>
                  <MarkdownRenderer text={m.text} />
                  
                  {m.codeSnippet && (
                    <div className="mt-4 rounded-xl bg-[#080810] border border-white/10 overflow-hidden">
                      <div className="px-4 py-2 bg-black/40 border-b border-white/10 flex items-center justify-between">
                        <span className="text-xs font-mono text-nova-muted">Suggested Code</span>
                        <button onClick={() => navigator.clipboard.writeText(m.codeSnippet!)} className="text-xs text-violet-400 hover:text-white transition flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                      </div>
                      <pre className="p-4 overflow-auto font-mono text-sm text-emerald-300">
                        <code>{m.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {m.suggestedActions.map((action, idx) => (
                        <button 
                          key={idx} onClick={() => handleSend(action)}
                          className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold hover:bg-violet-500/20 hover:text-white transition flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> {action}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message Actions */}
                  {m.role === "ai" && (
                    <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition duration-300">
                      <button onClick={() => navigator.clipboard.writeText(m.text)} className="p-1.5 rounded-lg hover:bg-white/10 text-nova-muted" title="Copy text"><Copy className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-nova-muted hover:text-emerald-400"><ThumbsUp className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-rose-500/20 text-nova-muted hover:text-rose-400"><ThumbsDown className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg">
                    {initials}
                  </div>
                )}
              </motion.div>
            ))
          )}

          {typing && (
            <div className="flex gap-4 items-end animate-fadeIn">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${activeModeObj.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                <activeModeObj.icon className="w-5 h-5" />
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl rounded-tl-none px-6 py-5 flex items-center gap-2 w-24">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-[#07070d] border-t border-white/10 z-20">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-end gap-3 glass-strong rounded-3xl p-2 border border-white/20 bg-black/60 shadow-inner">
              <button className="p-3 rounded-2xl hover:bg-white/10 text-nova-muted hover:text-white transition shrink-0 self-end mb-1">
                <Plus className="w-6 h-6" />
              </button>
              
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask Nova in ${activeModeObj.label}... (Shift+Enter for new line)`}
                rows={Math.min(input.split("\n").length, 8)}
                className="flex-1 max-h-48 py-4 bg-transparent text-white text-[15px] resize-none outline-none placeholder:text-nova-muted/60 scrollbar-thin self-center"
                style={{ minHeight: "56px" }}
              />

              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || typing}
                className="p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-violet-500/50 hover:scale-105 transition-all shrink-0 self-end mb-0.5"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center mt-3 text-[11px] text-nova-muted font-medium">
              Nova AI uses advanced AST parsing and GPT-class models. Code is processed securely.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */
function Plus(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>;
}
function PanelLeft(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18"/></svg>;
}

function MarkdownRenderer({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text.split("\n\n").map((paragraph, i) => {
        let html = paragraph;
        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-bold'>$1</strong>");
        // Inline code
        html = html.replace(/`([^`]+)`/g, "<code class='font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded-md border border-cyan-500/20 text-[13px]'>$1</code>");
        
        // List items
        if (html.trim().startsWith("•") || html.trim().startsWith("-")) {
          const items = html.split("\n").map(li => `<li class="ml-4 mb-1">${li.replace(/^[•-]\s*/, "")}</li>`).join("");
          return <ul key={i} className="list-disc list-outside" dangerouslySetInnerHTML={{ __html: items }} />;
        }
        
        return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}

/* ── Smart Fake AI Engine ───────────────────────────────────── */
function getAIResponse(prompt: string, mode: string) {
  const p = prompt.toLowerCase();
  let reply = "I analyzed your request. Based on the context, here is the optimal approach.";
  let code = undefined;
  let actions = [];

  if (mode === "debug" || p.includes("bug") || p.includes("error") || p.includes("not working")) {
    reply = "I found the bug! 🐛\n\nThe issue occurs because of an **Out of Bounds Exception** when the input array is empty. You are trying to access `array[0]` without checking the length first.\n\nHere is the corrected and safe implementation:";
    code = `function getFirstElement(arr) {\n  // Guard clause to prevent undefined access\n  if (!arr || arr.length === 0) return null;\n  return arr[0];\n}`;
    actions = ["Explain guard clauses", "How to write unit tests for this?"];
  } 
  else if (mode === "architect" || p.includes("design") || p.includes("scale") || p.includes("architecture")) {
    reply = "Excellent question regarding System Design. 🏗️\n\nIf you want to scale this service to handle **1 Million Requests Per Second (RPS)**, a monolithic database will become a bottleneck.\n\n**Recommended Architecture:**\n• **Load Balancer:** Nginx or AWS ALB to distribute traffic.\n• **Caching Layer:** Redis cluster to serve 90% of read requests (O(1) latency).\n• **Database Sharding:** Horizontally partition PostgreSQL by `user_id`.\n• **Message Queue:** Apache Kafka for asynchronous background processing (e.g., sending emails).";
    actions = ["Tell me more about Redis caching", "How does Database Sharding work?"];
  }
  else if (mode === "reviewer" || p.includes("review") || p.includes("complexity") || p.includes("optimize")) {
    reply = "Code Review Complete ✅\n\n**Complexity Analysis:**\n• **Time Complexity:** O(N²) because of the nested `for` loop.\n• **Space Complexity:** O(1) as no extra memory is allocated.\n\n**Optimization Tip:**\nWe can reduce the time complexity to **O(N)** by trading space for time. By using a Hash Map to store previously seen values, we can eliminate the inner loop entirely.";
    code = `// Optimized O(N) Approach\nfunction optimizedFunction(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}`;
    actions = ["Explain Hash Maps", "What if the array is already sorted?"];
  }
  else {
    // Default Mentor Mode
    if (p.includes("dp") || p.includes("dynamic programming")) {
      reply = "**Dynamic Programming (DP)** is a method for solving complex problems by breaking them down into simpler, overlapping subproblems.\n\nThink of it like caching: If you calculate `Fibonacci(5)` once, you save the result in a table (Memoization). Next time you need `Fib(5)`, you just read it from the table instead of recalculating it.\n\nThe two main approaches are:\n1. **Top-Down (Memoization):** Recursion + Caching\n2. **Bottom-Up (Tabulation):** Iteration + Array";
      actions = ["Show me a Bottom-Up DP example", "What is the difference between DP and Divide & Conquer?"];
    } else {
      reply = "That's a great question! 🤔\n\nTo give you the most accurate answer, could you clarify:\n1. Are you stuck on a specific error message?\n2. What language are you currently coding in?\n3. Are there any space/time constraints I should know about?\n\nPaste your code snippet if you have one, and I'll analyze it immediately.";
      actions = ["I want to learn Algorithms", "Help me debug a React issue", "Mock interview me for Google"];
    }
  }

  return { reply, code, actions };
}
