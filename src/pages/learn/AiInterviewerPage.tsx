import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Mic, MicOff, Send, Code2, CheckCircle2, Play, RefreshCw,
  Clock, Award, ChevronRight, Zap, Users, Trophy, Target, X,
} from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";

/* ── Types ────────────────────────────────────────────────────── */
interface Msg { role: "ai" | "user"; text: string }

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  company: string;
  desc: string;
  starter: string;
  language: string;
  category: string;
  expectedApproach: string;
  evaluationCriteria: { name: string; weight: number }[];
}

interface Scorecard {
  overall: number;
  breakdown: { category: string; score: number; feedback: string }[];
  timeSpent: string;
  verdict: string;
  strengths: string[];
  improvements: string[];
}

/* ── Problem Bank ─────────────────────────────────────────────── */
const PROBLEMS: Problem[] = [
  {
    id: "p1", title: "Two Sum", difficulty: "Easy", company: "Google",
    category: "Arrays",
    desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to `target`. You may not use the same element twice.",
    starter: `function twoSum(nums, target) {\n  // Your code here\n  \n}\n// Test: twoSum([2,7,11,15], 9) → [0,1]`,
    language: "javascript",
    expectedApproach: "Hash Map",
    evaluationCriteria: [
      { name: "Algorithm Correctness", weight: 30 },
      { name: "Time Complexity (O(n) expected)", weight: 25 },
      { name: "Space Complexity Analysis", weight: 15 },
      { name: "Communication & Reasoning", weight: 20 },
      { name: "Edge Case Handling", weight: 10 },
    ],
  },
  {
    id: "p2", title: "Valid Parentheses", difficulty: "Easy", company: "Meta",
    category: "Stacks",
    desc: "Given a string containing just `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid. An input string is valid if open brackets are closed in the correct order.",
    starter: `function isValid(s) {\n  // Your code here\n  \n}\n// Test: isValid("()[]{}") → true\n// Test: isValid("(]") → false`,
    language: "javascript",
    expectedApproach: "Stack",
    evaluationCriteria: [
      { name: "Algorithm Correctness", weight: 30 },
      { name: "Stack Usage (correct data structure)", weight: 25 },
      { name: "Time/Space Complexity", weight: 15 },
      { name: "Communication & Reasoning", weight: 20 },
      { name: "Edge Case Handling", weight: 10 },
    ],
  },
  {
    id: "p3", title: "Longest Substring Without Repeating", difficulty: "Medium", company: "Amazon",
    category: "Sliding Window",
    desc: "Given a string `s`, find the length of the longest substring without repeating characters.",
    starter: `function lengthOfLongestSubstring(s) {\n  // Your code here\n  \n}\n// Test: lengthOfLongestSubstring("abcabcbb") → 3\n// Test: lengthOfLongestSubstring("bbbbb") → 1`,
    language: "javascript",
    expectedApproach: "Sliding Window + Hash Set",
    evaluationCriteria: [
      { name: "Algorithm Correctness", weight: 30 },
      { name: "Sliding Window Implementation", weight: 25 },
      { name: "Optimal Time Complexity (O(n))", weight: 15 },
      { name: "Communication & Reasoning", weight: 20 },
      { name: "Edge Case Handling", weight: 10 },
    ],
  },
  {
    id: "p4", title: "LRU Cache", difficulty: "Medium", company: "Apple",
    category: "Design",
    desc: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `get(key)` and `put(key, value)` in O(1) time.",
    starter: `class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n  get(key) {}\n  put(key, value) {}\n}`,
    language: "javascript",
    expectedApproach: "Hash Map + Doubly Linked List",
    evaluationCriteria: [
      { name: "O(1) get/put Correctness", weight: 30 },
      { name: "Hash Map + Linked List Design", weight: 25 },
      { name: "Eviction Logic", weight: 15 },
      { name: "Communication & Reasoning", weight: 20 },
      { name: "Edge Case Handling", weight: 10 },
    ],
  },
  {
    id: "p5", title: "Merge K Sorted Lists", difficulty: "Hard", company: "Google",
    category: "Linked Lists / Heap",
    desc: "Merge k sorted linked lists and return it as one sorted list.",
    starter: `function mergeKLists(lists) {\n  // Your code here\n  \n}`,
    language: "javascript",
    expectedApproach: "Min-Heap / Divide & Conquer",
    evaluationCriteria: [
      { name: "Algorithm Correctness", weight: 25 },
      { name: "Heap / D&C Implementation", weight: 25 },
      { name: "Optimal Time Complexity O(n log k)", weight: 20 },
      { name: "Communication & Reasoning", weight: 20 },
      { name: "Edge Case Handling", weight: 10 },
    ],
  },
];

/* ── AI Response Engine ───────────────────────────────────────── */
function getAIResponse(text: string, problem: Problem): string {
  const t = text.toLowerCase();

  if (t.includes("hash map") || t.includes("hashmap") || t.includes("map") || t.includes("set") || t.includes("o(n)") || t.includes("o(1)")) {
    return `Excellent observation! 🎯\n\nUsing a ${problem.expectedApproach} gives us O(1) average lookup time, which brings the overall time complexity down to **O(n)**.\n\n**Key insight:** Instead of checking every pair (O(n²)), we store elements as we go and look up complements in O(1).\n\n**Before you code, let me ask:**\n1. What happens when a duplicate value appears?\n2. What do you return if no valid pair exists?\n3. Walk me through the space complexity analysis.\n\nWhenever you're ready, implement your solution in the whiteboard sandbox and click "Submit & Evaluate"! 🚀`;
  }

  if (t.includes("stack") || t.includes("queue")) {
    return `Great thinking! Using a Stack is the classic approach here. 💡\n\n**Why it works:**\n• Stack follows LIFO — perfect for matching pairs\n• When we see an opening bracket, push it\n• When we see a closing bracket, check if the top matches\n• If stack is empty at the end → valid string\n\n**Edge cases to consider:**\n1. What if the string starts with a closing bracket?\n2. What if there are more opening than closing brackets?\n3. What about an empty string?\n\nGo ahead and code your solution in the whiteboard!`;
  }

  if (t.includes("sliding window") || t.includes("two pointer")) {
    return `That's exactly right! 🎯 The **Sliding Window** technique is optimal here.\n\n**The approach:**\n1. Maintain a window [left, right] with no duplicates\n2. Expand right pointer, track characters in a Set\n3. If duplicate found, shrink from left until unique\n4. Track maximum window size throughout\n\n**Complexity:** O(n) time, O(min(n,m)) space where m = charset size.\n\n**Follow-up question:** How would you modify this if we needed to find the actual substring, not just its length?\n\nCode it up in the sandbox! 💪`;
  }

  if (t.includes("brute force") || t.includes("nested loop") || t.includes("o(n^2)") || t.includes("o(n²)")) {
    return `Good that you identified the brute force! That gives us O(n²) time.\n\n**Can we do better?** 💭\n\nAsk yourself: "Is there any information I can store to avoid re-computation?"\n\nHint: Think about what you're searching for at each step. Is there a way to make that search O(1)?\n\nThe answer involves trading space for time — storing elements we've already seen in a hash structure.\n\nWant me to give you a bigger hint, or would you like to try optimizing it yourself first?`;
  }

  if (t.includes("heap") || t.includes("priority queue")) {
    return `Excellent! A Min-Heap is the right tool here. 🏗️\n\n**The strategy:**\n1. Add the head of each list to a min-heap\n2. Pop the minimum, add it to result\n3. If popped node has a next, add it to the heap\n4. Repeat until heap is empty\n\n**Complexity:** O(N log k) where N = total nodes, k = number of lists.\n\n**Alternative approach:** Divide & Conquer — merge pairs of lists repeatedly until one remains.\n\nBoth approaches give O(N log k) — implement the one you're more comfortable with!`;
  }

  if (t.includes("doubly linked") || t.includes("linked list") || t.includes("cache")) {
    return `Spot on! The Hash Map + Doubly Linked List combo is the classic LRU pattern. 🔥\n\n**Why doubly linked?**\n• O(1) deletion if you have the node reference\n• O(1) insertion at head/tail\n• Hash Map stores {key → node} for O(1) access\n\n**The flow:**\n1. **get(key)**: Find node via map, move to head → return value\n2. **put(key, val)**: If exists, update. If new and full, remove tail. Insert at head.\n\nCode it up! I'll evaluate your design decisions and edge case handling.`;
  }

  if (t.includes("explain") || t.includes("hint") || t.includes("help") || t.includes("how")) {
    return `Of course! Let me break this down for you step by step: 🧠\n\n**Step 1 — Understand the problem:**\n${problem.desc.slice(0, 150)}...\n\n**Step 2 — Identify the pattern:**\nThis problem falls under the **${problem.category}** category. The expected approach is **${problem.expectedApproach}**.\n\n**Step 3 — Think about complexity:**\n• What's the minimum time we MUST spend? (input reading)\n• Can we do it in a single pass?\n• Do we need extra space?\n\n**Step 4 — Consider edge cases:**\n• Empty input\n• Single element\n• All same elements\n• Maximum input size\n\nWould you like me to give a more specific hint, or would you prefer to try coding it first?`;
  }

  return `That's a thoughtful approach! Let me ask a few clarifying questions to deepen your understanding: 🤔\n\n1. **What's the intuition** behind your chosen data structure?\n2. **What's the worst-case time complexity** of your approach?\n3. **Have you considered** what happens with edge cases like empty inputs or duplicates?\n\nTake your time and think out loud — that's exactly what interviewers want to hear. Whenever you're ready, code your solution in the whiteboard above! 💪`;
}

function evaluateCode(code: string, problem: Problem): Scorecard {
  const hasLogic = code.length > 30;
  const hasMap = code.includes("Map") || code.includes("map") || code.includes("{}") || code.includes("new Map");
  const hasLoop = code.includes("for") || code.includes("while") || code.includes("forEach");
  const hasReturn = code.includes("return");
  const hasEdgeCheck = code.includes("if") || code.includes("length");

  const totalWeight = problem.evaluationCriteria.reduce((a, c) => a + c.weight, 0);

  const breakdown = problem.evaluationCriteria.map(c => {
    let score = 60;
    if (c.name.includes("Correctness") && hasLogic && hasReturn) score = 85;
    if (c.name.includes("Correctness") && hasLogic && hasReturn && hasLoop) score = 92;
    if (c.name.includes("Complexity") && hasMap && hasLoop) score = 90;
    if (c.name.includes("Complexity") && hasMap && !hasLoop) score = 70;
    if (c.name.includes("Data Structure") && hasMap) score = 92;
    if (c.name.includes("Communication")) score = 82 + Math.floor(Math.random() * 10);
    if (c.name.includes("Edge") && hasEdgeCheck) score = 88;
    if (c.name.includes("Edge") && !hasEdgeCheck) score = 55;
    score = Math.min(score, 98);
    return {
      category: c.name,
      score,
      feedback: score >= 85 ? "Strong performance!" : score >= 70 ? "Good, but could be improved." : "Needs more work.",
    };
  });

  const overall = Math.round(breakdown.reduce((a, b) => a + b.score * (problem.evaluationCriteria.find(c => c.name === b.category)?.weight || 0), 0) / totalWeight);

  return {
    overall,
    breakdown,
    timeSpent: `${Math.floor(Math.random() * 25) + 10}m ${Math.floor(Math.random() * 59) + 1}s`,
    verdict: overall >= 85 ? "Strong Hire" : overall >= 70 ? "Hire" : overall >= 55 ? "Lean Hire" : "Needs Improvement",
    strengths: breakdown.filter(b => b.score >= 85).map(b => b.category),
    improvements: breakdown.filter(b => b.score < 75).map(b => b.category),
  };
}

/* ── Component ────────────────────────────────────────────────── */
export default function AiInterviewerPage() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0]);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: `Welcome to your Live AI Mock Interview! 🤖✨\n\nI'm **Nova**, your senior engineering interviewer. Today we'll assess your ${selectedProblem.category} skills.\n\n**Company Focus:** ${selectedProblem.company}\n**Difficulty:** ${selectedProblem.difficulty}\n**Problem:** ${selectedProblem.title}\n\n**Your task:**\n${selectedProblem.desc}\n\nBefore writing any code, walk me through your approach. What data structures would you use? What's the time/space complexity? 🎯` },
  ]);
  const [input, setInput] = useState("");
  const [code, setCode] = useState(selectedProblem.starter);
  const [isRecording, setIsRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [showProblemPicker, setShowProblemPicker] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [round, setRound] = useState(1);
  const [sessionHistory, setSessionHistory] = useState<{ problem: string; score: number; verdict: string }[]>([]);

  const endRef = useRef<HTMLDivElement>(null);
  // Timer
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: getAIResponse(text, selectedProblem) }]);
      setTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend("I would use a Hash Map to store the numbers and their indices as I iterate. For each number, I check if (target - current) exists in the map. This gives O(N) time complexity and O(N) space.");
      }, 4000);
    } else {
      setIsRecording(false);
    }
  };

  const handleEvaluate = () => {
    setTyping(true);
    setTimerRunning(false);

    setTimeout(() => {
      const result = evaluateCode(code, selectedProblem);
      setScorecard(result);
      setSessionHistory(h => [...h, { problem: selectedProblem.title, score: result.overall, verdict: result.verdict }]);
      setTyping(false);
      setMessages(m => [...m, {
        role: "ai",
        text: `🎉 **Interview Complete for "${selectedProblem.title}"!**\n\n**Score: ${result.overall}/100** — Verdict: **${result.verdict}**\n\n**Time Spent:** ${result.timeSpent}\n\nI've generated a detailed breakdown below. ${result.overall >= 85 ? "Excellent work!" : "Let's keep practicing!"}\n\n${result.strengths.length > 0 ? `✅ **Strengths:** ${result.strengths.join(", ")}` : ""}\n${result.improvements.length > 0 ? `💡 **Work on:** ${result.improvements.join(", ")}` : ""}\n\nReady for the next challenge? Pick a problem from the list or hit "Try Another Problem". 🚀`,
      }]);
    }, 2000);
  };

  const selectProblem = (p: Problem) => {
    setSelectedProblem(p);
    setCode(p.starter);
    setScorecard(null);
    setTimerRunning(true);
    setElapsed(0);
    setRound(r => r + 1);
    setShowProblemPicker(false);
    setMessages([{
      role: "ai",
      text: `**Round ${round + 1} — ${p.title}** (${p.difficulty})\n**Company Focus:** ${p.company}\n**Category:** ${p.category}\n\n${p.desc}\n\nTake your time to understand the problem. Walk me through your approach first, then code your solution in the whiteboard sandbox. Let's go! 🎯`,
    }]);
  };

  return (
    <div className="pt-24 pb-6 px-3 sm:px-4 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="glass rounded-2xl p-3 sm:p-4 flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm text-white font-bold font-display flex items-center gap-2">
              Nova AI Mock Interviewer
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">Live</span>
            </div>
            <div className="text-[11px] text-nova-muted">Round {round} · {selectedProblem.company} Track · {selectedProblem.category}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-mono border ${
            timerRunning ? "bg-white/5 border-white/10 text-white" : "bg-rose-500/10 border-rose-500/20 text-rose-300"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(elapsed)}
          </div>

          {/* Problem Picker */}
          <button onClick={() => setShowProblemPicker(v => !v)} className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-violet-400" /> Switch Problem
          </button>

          {/* Session Stats */}
          {sessionHistory.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-white/10 text-xs text-nova-muted">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {sessionHistory.length} solved · Avg: {Math.round(sessionHistory.reduce((a, h) => a + h.score, 0) / sessionHistory.length)}%
            </div>
          )}
        </div>
      </div>

      {/* Problem Picker Dropdown */}
      <AnimatePresence>
        {showProblemPicker && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-3 overflow-hidden">
            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Select Interview Problem
                </h3>
                <button onClick={() => setShowProblemPicker(false)} className="p-1 rounded-lg hover:bg-white/10 text-nova-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {PROBLEMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => selectProblem(p)}
                    className={`p-3 rounded-xl text-left border transition ${
                      selectedProblem.id === p.id
                        ? "bg-violet-500/20 border-violet-500/40"
                        : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        p.difficulty === "Easy" ? "text-emerald-300 bg-emerald-500/10" :
                        p.difficulty === "Medium" ? "text-amber-300 bg-amber-500/10" :
                        "text-rose-300 bg-rose-500/10"
                      }`}>{p.difficulty}</span>
                      <span className="text-[10px] text-nova-muted">{p.company}</span>
                    </div>
                    <div className="text-sm text-white font-semibold">{p.title}</div>
                    <div className="text-[11px] text-nova-muted mt-0.5">{p.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <div className="grid lg:grid-cols-12 gap-3 items-start">
        {/* Left: Chat Feed */}
        <div className="lg:col-span-6 glass rounded-2xl flex flex-col border border-white/10 h-[calc(100vh-200px)] min-h-[500px]">
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Users className="w-4 h-4 text-violet-400" /> Interview Conversation
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                selectedProblem.difficulty === "Easy" ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" :
                selectedProblem.difficulty === "Medium" ? "text-amber-300 bg-amber-500/10 border-amber-500/20" :
                "text-rose-300 bg-rose-500/10 border-rose-500/20"
              }`}>{selectedProblem.difficulty}</span>
              <button onClick={() => {
                setMessages([messages[0]]);
                setScorecard(null);
                setTimerRunning(true);
                setElapsed(0);
                setCode(selectedProblem.starter);
              }} className="p-1.5 rounded-lg hover:bg-white/10 text-nova-muted" title="Reset Interview">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Brain className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap text-sm ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
                    : "bg-white/5 text-white/90 border border-white/5"
                }`}>{m.text}</div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 flex gap-2 items-center">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                  ))}
                  <span className="text-xs text-nova-muted ml-1">Nova is thinking…</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-white/10 bg-white/[0.02]">
            <div className="flex gap-2 items-center">
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-xl transition shrink-0 ${
                  isRecording ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30" : "glass text-nova-muted hover:text-white border border-white/10"
                }`} title={isRecording ? "Stop" : "Voice Answer"}>
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend(input)}
                placeholder={isRecording ? "Listening to your voice…" : "Type your approach, ask for hints, or describe your thought process…"}
                disabled={isRecording}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 placeholder:text-nova-muted/60"
              />
              <button onClick={() => handleSend(input)} disabled={!input.trim() || isRecording}
                className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 disabled:opacity-40 transition shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Code Sandbox + Scorecard */}
        <div className="lg:col-span-6 space-y-3">
          <div className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col h-[calc(100vh-340px)] min-h-[340px]">
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs font-mono text-nova-muted">
                <Code2 className="w-4 h-4 text-cyan-400" /> Whiteboard — {selectedProblem.title}
              </div>
              <button onClick={handleEvaluate} disabled={typing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 transition inline-flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current" /> Submit & Evaluate
              </button>
            </div>
            <div className="flex-1 min-h-[250px]">
              <CodeEditor value={code} onChange={setCode} language={selectedProblem.language} />
            </div>
          </div>

          {/* Scorecard */}
          {scorecard ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-5 border border-emerald-500/40 shadow-xl shadow-emerald-500/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Detailed Interview Scorecard
                </h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-extrabold text-sm">
                    {scorecard.overall}/100
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    scorecard.verdict === "Strong Hire" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                    scorecard.verdict === "Hire" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" :
                    "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>{scorecard.verdict}</div>
                </div>
              </div>

              <div className="text-xs text-nova-muted mb-4">Time Spent: {scorecard.timeSpent} · {selectedProblem.company} Track</div>

              <div className="space-y-3 mb-5">
                {scorecard.breakdown.map((b, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white font-medium">{b.category}</span>
                      <span className={`font-bold ${b.score >= 85 ? "text-emerald-300" : b.score >= 70 ? "text-amber-300" : "text-rose-300"}`}>{b.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${b.score}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${b.score >= 85 ? "bg-emerald-500" : b.score >= 70 ? "bg-amber-500" : "bg-rose-500"}`}
                      />
                    </div>
                    <div className="text-[11px] text-nova-muted mt-0.5">{b.feedback}</div>
                  </div>
                ))}
              </div>

              {scorecard.strengths.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-bold text-emerald-300 mb-1">✅ Strengths:</div>
                  <div className="flex flex-wrap gap-1">{scorecard.strengths.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{s}</span>
                  ))}</div>
                </div>
              )}
              {scorecard.improvements.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-bold text-amber-300 mb-1">💡 Areas to Improve:</div>
                  <div className="flex flex-wrap gap-1">{scorecard.improvements.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">{s}</span>
                  ))}</div>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-white/10">
                <button onClick={() => setShowProblemPicker(true)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition flex items-center justify-center gap-1.5">
                  <ChevronRight className="w-4 h-4" /> Next Problem
                </button>
                <button onClick={() => alert("🏆 Scorecard saved to your CodeNova AI Dashboard!")}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 transition flex items-center justify-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Save to Profile
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-violet-400" /> Evaluation Criteria for "{selectedProblem.title}"
              </h4>
              <div className="space-y-2">
                {selectedProblem.evaluationCriteria.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-white">{c.name}</span>
                    <span className="text-[10px] text-nova-muted font-mono">{c.weight}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-[11px] text-amber-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Write your solution and click "Submit & Evaluate" for a detailed scorecard breakdown.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
