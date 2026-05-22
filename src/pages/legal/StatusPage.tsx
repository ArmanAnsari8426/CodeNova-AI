import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, RefreshCw, Layers, Server, Cpu, Bot, Globe } from "lucide-react";

const SERVICES = [
  { name: "API Gateway & Authentication", status: "Operational", uptime: "99.99%", icon: Server },
  { name: "Judge0 CE Cloud Compiler Cluster", status: "Operational", uptime: "99.95%", icon: Cpu },
  { name: "Nova AI AST Mentoring Engine", status: "Operational", uptime: "99.98%", icon: Bot },
  { name: "MongoDB Atlas Core Database", status: "Operational", uptime: "100.0%", icon: Layers },
  { name: "Web Preview Iframe Sandbox", status: "Operational", uptime: "99.99%", icon: Globe },
];

const PAST_INCIDENTS = [
  { date: "March 18, 2026", title: "Elevated latency on Judge0 C++ compilation queue", status: "Resolved", desc: "Successfully scaled up backup Docker execution nodes to handle contest spike." },
  { date: "February 28, 2026", title: "OpenAI API timeout during AI Mock Interview evaluation", status: "Resolved", desc: "Switched to secondary fallback LLM cluster. Zero data loss reported." },
  { date: "January 15, 2026", title: "Scheduled MongoDB Atlas maintenance window", status: "Completed", desc: "Completed routine index optimization and TLS certificate rotation." },
];

export default function StatusPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            System <span className="gradient-text">Status</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            Real-time operational health, uptime metrics, and past incident logs for CodeNova AI microservices.
          </p>
        </div>

        {/* Live Status Box */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 mb-12 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Current Platform Health: 99.98%</h2>
            <p className="text-xs text-nova-muted mt-1">Refreshed automatically every 60 seconds</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-nova-muted hover:text-white transition border border-white/10 disabled:opacity-50"
            title="Refresh Status"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>

        {/* Microservices Grid */}
        <div className="space-y-4 mb-16">
          <h3 className="font-display text-lg font-bold text-white mb-4 px-2">Microservice Status</h3>
          {SERVICES.map((srv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl glass border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-nova-muted shrink-0">
                  <srv.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-base truncate">{srv.name}</div>
                  <div className="text-xs text-nova-muted mt-0.5">Uptime: {srv.uptime}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> {srv.status}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Past Incidents */}
        <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-400" /> Past Incident History
          </h3>
          <div className="space-y-4">
            {PAST_INCIDENTS.map((inc, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-nova-muted flex-wrap gap-2">
                  <span className="font-mono font-semibold">{inc.date}</span>
                  <span className="px-2.5 py-0.5 rounded bg-white/5 text-white/80 font-medium border border-white/10">{inc.status}</span>
                </div>
                <h4 className="font-display text-base font-bold text-white">{inc.title}</h4>
                <p className="text-xs text-nova-muted leading-relaxed">{inc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
