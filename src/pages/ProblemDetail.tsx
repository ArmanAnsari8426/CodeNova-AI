import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Play, Send, Bot, ChevronRight, CheckCircle2, XCircle,
  BookOpen, Bookmark, Share2,
  Terminal, Zap, Layout, RefreshCw,
  FileCode, MessageCircle, ListChecks
} from "lucide-react";
import { PROBLEMS, type LanguageId } from "@/data/mock";
import CodeEditorPro from "@/components/CodeEditorPro";

type TabType = "description" | "editorial" | "submissions" | "discuss";
type ConsoleTab = "testcase" | "output";
type RunStatus = "idle" | "running" | "success" | "failed";

export default function ProblemDetail() {
  const { slug } = useParams();
  const problem = PROBLEMS.find(p => p.slug === slug) ?? PROBLEMS[0];

  const [lang, setLang] = useState<LanguageId>("python");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>("testcase");
  const [stdin, setStdin] = useState(problem.testCases[0]?.input ?? "");
  const [runStatus, setRunStatus] = useState<RunStatus>("idle");
  const [output, setOutput] = useState("");
  const [aiOpen, setAiOpen] = useState(false);

  // Sync code with language change
  useEffect(() => {
    const starter = problem.starterCode[lang] || "";
    setCode(starter);
    setRunStatus("idle");
    setOutput("");
  }, [lang, problem.slug]);

  const run = async (submit = false) => {
    setRunStatus("running");
    setConsoleTab("output");
    setOutput("");
    await new Promise(r => setTimeout(r, 1200));
    
    const ok = Math.random() > 0.2;
    if (submit) {
      if (ok) {
        setRunStatus("success");
        setOutput(`✅ Accepted\nRuntime: ${Math.floor(Math.random() * 50) + 20} ms\nMemory: 16.4 MB\n\nAll test cases passed!`);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else {
        setRunStatus("failed");
        setOutput(`❌ Wrong Answer\nInput: ${problem.testCases[0]?.input || "[2,7,11,15]\\n9"}\nExpected: ${problem.testCases[0]?.expected || "[0,1]"}\nOutput: [1,2]`);
      }
    } else {
      setRunStatus(ok ? "success" : "failed");
      setOutput(ok ? `→ ${problem.testCases[0]?.expected || "[0,1]"}\nExecution: 24ms` : `RuntimeError: index out of range`);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) run(true); else run(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-300 overflow-hidden pt-16">
      
      {/* Top Navigation Bar for Problem */}
      <div className="h-14 border-b border-white/5 bg-[#09090b] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition">
            <Layout className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">{problem.number}. {problem.title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              problem.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              problem.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}>{problem.difficulty}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition"><Bookmark className="w-5 h-5" /></button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition"><Share2 className="w-5 h-5" /></button>
          <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold hover:bg-violet-500/20 transition">
            <Bot className="w-4 h-4" /> AI Mentor
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: Problem Description */}
        <div className="w-[45%] flex flex-col border-r border-white/5 bg-[#0c0c0e]">
          {/* Tabs */}
          <div className="flex border-b border-white/5 bg-[#09090b]">
            {[
              { id: "description", label: "Description", icon: BookOpen },
              { id: "editorial", label: "Editorial", icon: FileCode },
              { id: "submissions", label: "Submissions", icon: ListChecks },
              { id: "discuss", label: "Discuss", icon: MessageCircle },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabType)}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                  activeTab === t.id ? "border-violet-500 text-white bg-white/5" : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === "description" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-300 leading-relaxed text-sm">{problem.description}</p>
                  
                  <div className="space-y-6 mt-6">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="space-y-2">
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">Example {i + 1}:</h3>
                        <div className="p-4 rounded-xl bg-[#18181b] border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                          <div><span className="text-zinc-500">Input:</span> {ex.input}</div>
                          <div><span className="text-zinc-500">Output:</span> {ex.output}</div>
                          {ex.explanation && <div className="text-zinc-500 italic mt-2">Explanation: {ex.explanation}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-6">
                    <h3 className="text-white font-bold text-sm">Constraints:</h3>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-zinc-400">
                      {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "editorial" && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <FileCode className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Premium Editorial Locked</h3>
                <p className="text-zinc-500 text-sm max-w-xs">Unlock Nova Pro to view step-by-step solutions and optimal approaches.</p>
                <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-lg shadow-violet-500/20">Unlock Now</button>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="space-y-3 animate-fadeIn">
                {[1,2,3].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/10 transition">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-white font-bold text-sm">Accepted</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">Python 3 · 42ms · 16.4 MB</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Editor & Console */}
        <div className="flex-1 flex flex-col bg-[#09090b]">
          
          {/* Editor Area */}
          <div className="flex-1 min-h-0 flex flex-col border-b border-white/5">
            <CodeEditorPro 
              value={code} 
              onChange={setCode} 
              language={lang} 
              onLanguageChange={setLang}
              onRun={() => run(false)}
              onSubmit={() => run(true)}
              isRunning={runStatus === "running"}
              isSubmitted={runStatus === "success"}
            />
          </div>

          {/* Console Area */}
          <div className="h-[35%] flex flex-col bg-[#0c0c0e]">
            {/* Console Tabs */}
            <div className="flex items-center justify-between px-4 border-b border-white/5 bg-[#09090b]">
              <div className="flex">
                {[
                  { id: "testcase", label: "Testcases", icon: Terminal },
                  { id: "output", label: "Test Result", icon: Zap },
                ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setConsoleTab(t.id as ConsoleTab)}
                    className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                      consoleTab === t.id ? "border-violet-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <t.icon className="w-3.5 h-3.5" /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {consoleTab === "testcase" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex gap-2">
                    {problem.testCases.map((tc, i) => (
                      <button 
                        key={i} 
                        onClick={() => setStdin(tc.input)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                          stdin === tc.input 
                            ? "bg-violet-500/10 border-violet-500/30 text-violet-300" 
                            : "bg-[#18181b] border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        Case {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Custom Input</label>
                    <textarea 
                      value={stdin} 
                      onChange={e => setStdin(e.target.value)}
                      className="w-full h-24 p-3 rounded-xl bg-[#18181b] border border-white/10 text-zinc-300 text-xs font-mono outline-none focus:border-violet-500/50 resize-none"
                    />
                  </div>
                </div>
              )}

              {consoleTab === "output" && (
                <div className="h-full flex flex-col animate-fadeIn">
                  {runStatus === "idle" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                      <Play className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-xs">Click "Run" to see the result.</p>
                    </div>
                  )}
                  {runStatus === "running" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-violet-400">
                      <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                      <p className="text-xs font-bold">Running testcases...</p>
                    </div>
                  )}
                  {(runStatus === "success" || runStatus === "failed") && (
                    <div className={`p-4 rounded-xl border font-mono text-xs whitespace-pre-wrap ${
                      runStatus === "success" 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" 
                        : "bg-rose-500/5 border-rose-500/20 text-rose-300"
                    }`}>
                      {runStatus === "success" && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
                      {runStatus === "failed" && <XCircle className="w-4 h-4 inline mr-2" />}
                      {output}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Drawer Overlay */}
      <AnimatePresence>
        {aiOpen && <AiDrawer onClose={() => setAiOpen(false)} problemTitle={problem.title} />}
      </AnimatePresence>
    </div>
  );
}

/* ── AI Drawer Overlay ───────────────────────────────────────── */
function AiDrawer({ onClose, problemTitle }: { onClose: () => void; problemTitle: string }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "ai", text: `I'm **Nova**, your mentor. Need a hint for **${problemTitle}**? 🤖` }
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMsgs(m => [...m, { role: "ai", text: "Consider using a Hash Map to store indices for O(N) time complexity. ✨" }]);
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "spring", damping: 25 }} onClick={e => e.stopPropagation()} className="w-full max-w-md h-full bg-[#0c0c0e] border-l border-white/10 flex flex-col shadow-2xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#09090b]">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg"><Bot className="w-6 h-6" /></div>
              <div>
                <div className="text-white font-bold text-sm">Nova AI Mentor</div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online</div>
              </div>
           </div>
           <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
           {msgs.map((m, i) => (
             <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-violet-500 text-white font-medium shadow-lg shadow-violet-500/20" : "bg-[#18181b] text-zinc-300 border border-white/5"}`}>
                   {m.text}
                </div>
             </div>
           ))}
        </div>
        <div className="p-5 border-t border-white/10 bg-[#09090b]">
           <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask for a hint..." className="flex-1 px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              <button onClick={send} className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20"><Send className="w-5 h-5" /></button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}