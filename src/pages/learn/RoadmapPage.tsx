import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Map, CheckCircle2, Circle, ArrowRight, Sparkles, BookOpen, Brain, Trophy, ChevronDown, Award } from "lucide-react";

const ROADMAP_STAGES = [
  {
    id: "stage-1",
    title: "Stage 1: Programming Foundations",
    desc: "Master the syntax, basic data types, loops, functions, and memory basics in your chosen language.",
    time: "2-3 Weeks",
    xp: "+500 XP",
    topics: [
      { name: "Variables, Data Types & Memory Allocation", done: true, count: 12 },
      { name: "Control Flow (If/Else, Loops, Switch)", done: true, count: 18 },
      { name: "Functions, Scope & Recursion Basics", done: true, count: 15 },
      { name: "Arrays, Strings & Basic Pointers", done: true, count: 24 },
    ],
  },
  {
    id: "stage-2",
    title: "Stage 2: Core Data Structures",
    desc: "Understand how data is stored, accessed, and manipulated efficiently in memory.",
    time: "3-4 Weeks",
    xp: "+1,200 XP",
    topics: [
      { name: "Hash Tables & Collision Resolution", done: true, count: 32 },
      { name: "Singly & Doubly Linked Lists", done: true, count: 28 },
      { name: "Stacks, Queues & Monotonic Stacks", done: false, count: 20 },
      { name: "Binary Trees & Binary Search Trees (BST)", done: false, count: 45 },
    ],
  },
  {
    id: "stage-3",
    title: "Stage 3: Essential Algorithms",
    desc: "Learn algorithmic paradigms to solve complex computational problems with optimal complexity.",
    time: "4-5 Weeks",
    xp: "+2,000 XP",
    topics: [
      { name: "Sorting (Merge, Quick, Heap) & Binary Search", done: false, count: 38 },
      { name: "Two Pointers & Sliding Window Paradigms", done: false, count: 42 },
      { name: "Breadth-First Search (BFS) & Depth-First Search (DFS)", done: false, count: 50 },
      { name: "Greedy Algorithms & Backtracking", done: false, count: 35 },
    ],
  },
  {
    id: "stage-4",
    title: "Stage 4: Advanced Algorithms & DP",
    desc: "Tackle hard interview topics, overlapping subproblems, and advanced graph theory.",
    time: "6-8 Weeks",
    xp: "+3,500 XP",
    topics: [
      { name: "1D & 2D Dynamic Programming (Memoization + Tabulation)", done: false, count: 65 },
      { name: "Advanced Graphs (Dijkstra, Bellman-Ford, Union Find)", done: false, count: 48 },
      { name: "Tries, Segment Trees & Fenwick Trees", done: false, count: 25 },
      { name: "Bit Manipulation & Mathematical Algorithms", done: false, count: 30 },
    ],
  },
  {
    id: "stage-5",
    title: "Stage 5: System Design & Architecture",
    desc: "Scale your applications from single-instance to distributed, fault-tolerant microservices.",
    time: "4-6 Weeks",
    xp: "+4,000 XP",
    topics: [
      { name: "Horizontal vs Vertical Scaling & Load Balancing", done: false, count: 10 },
      { name: "Database Sharding, Replication & CAP Theorem", done: false, count: 14 },
      { name: "Caching Strategies (Redis, Memcached, LRU/LFU)", done: false, count: 16 },
      { name: "Message Queues (Kafka, RabbitMQ) & Event-Driven Design", done: false, count: 18 },
    ],
  },
];

export default function RoadmapPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "stage-1": true,
    "stage-2": true,
    "stage-3": true,
  });

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Map className="w-3.5 h-3.5 text-violet-400" /> Curated Learning Tracks
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            The Ultimate <span className="gradient-text">DSA Roadmap</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg max-w-2xl mx-auto">
            A structured, step-by-step curriculum designed by FAANG tech leads to take you from zero coding knowledge to acing top-tier technical interviews.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-white font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Guided Pacing
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-white font-medium">
              <Brain className="w-4 h-4 text-cyan-400" /> 350+ Practice Problems
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs text-white font-medium">
              <Trophy className="w-4 h-4 text-emerald-400" /> Verified Certificate
            </div>
          </div>
        </div>

        {/* Roadmap Stages */}
        <div className="space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[28px] sm:left-[36px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-violet-500 via-cyan-500 to-rose-500 opacity-30 hidden sm:block" />

          {ROADMAP_STAGES.map((stage, index) => {
            const isExpanded = expanded[stage.id];
            const completedCount = stage.topics.filter(t => t.done).length;
            const isFullyDone = completedCount === stage.topics.length;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 overflow-hidden group"
              >
                {/* Stage Header */}
                <div className="flex items-start sm:items-center justify-between gap-4 cursor-pointer" onClick={() => toggle(stage.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-lg shadow-lg shrink-0 z-10 ${
                      isFullyDone
                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-emerald-500/20"
                        : "bg-white/10 text-white border border-white/10 group-hover:border-violet-500/50 transition"
                    }`}>
                      {isFullyDone ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{stage.title}</h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-nova-muted font-mono">{stage.time}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold">{stage.xp}</span>
                      </div>
                      <p className="text-nova-muted text-sm mt-1 max-w-xl">{stage.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-semibold text-white">{completedCount} / {stage.topics.length}</span>
                      <span className="text-[10px] text-nova-muted">Topics done</span>
                    </div>
                    <button className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nova-muted hover:text-white transition transform ${isExpanded ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Topics List */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-3"
                  >
                    {stage.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition group/item">
                        <div className="flex items-center gap-3 min-w-0">
                          {topic.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-nova-muted/40 group-hover/item:text-violet-400 transition shrink-0" />
                          )}
                          <span className={`text-sm truncate ${topic.done ? "text-white/80 line-through decoration-white/30" : "text-white font-medium"}`}>
                            {topic.name}
                          </span>
                        </div>
                        <Link
                          to="/problems"
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-violet-300 hover:text-violet-200 transition shrink-0 ml-2"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> {topic.count}
                        </Link>
                      </div>
                    ))}

                    <div className="sm:col-span-2 mt-4 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-violet-400 shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-white">Need a personalized study plan for this stage?</h4>
                          <p className="text-xs text-nova-muted">Let Nova AI analyze your current strengths and generate custom daily practice tasks.</p>
                        </div>
                      </div>
                      <Link
                        to="/ai-assistant"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition shrink-0 inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Generate AI Plan
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Certificate Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 sm:p-12 rounded-3xl glass-strong gradient-border flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div className="flex items-center gap-6 flex-col sm:flex-row">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 shrink-0">
              <Award className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">DSA Master Certification</h2>
              <p className="text-nova-muted text-sm mt-2 max-w-xl leading-relaxed">
                Complete all 5 stages and solve at least 150 roadmap problems to unlock your cryptographically verified CodeNova AI Professional DSA Certification.
              </p>
            </div>
          </div>
          <Link
            to="/problems"
            className="px-6 py-3.5 rounded-xl bg-white text-nova-bg font-semibold text-sm shadow-lg hover:bg-white/90 transition inline-flex items-center gap-2 shrink-0 hover:scale-[1.02]"
          >
            Start Solving Now <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
