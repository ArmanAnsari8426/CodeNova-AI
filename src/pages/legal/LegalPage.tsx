import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Shield, FileText, Lock, CheckCircle2 } from "lucide-react";

export default function LegalPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "cookies">("privacy");

  useEffect(() => {
    if (location.pathname.includes("privacy")) setActiveTab("privacy");
    else if (location.pathname.includes("terms")) setActiveTab("terms");
    else if (location.pathname.includes("cookies")) setActiveTab("cookies");
  }, [location.pathname]);

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Shield className="w-3.5 h-3.5 text-violet-400" /> Legal & Compliance
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            CodeNova AI <span className="gradient-text">Legal Center</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            Review our official policies regarding user data privacy, terms of service agreements, and cookie tracking preferences.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold border transition ${
              activeTab === "privacy"
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-violet-500/50 shadow-lg shadow-violet-500/20"
                : "glass text-nova-muted hover:text-white border-white/5"
            }`}
          >
            <Lock className="w-4 h-4 shrink-0" /> Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold border transition ${
              activeTab === "terms"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                : "glass text-nova-muted hover:text-white border-white/5"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" /> Terms of Service
          </button>
          <button
            onClick={() => setActiveTab("cookies")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold border transition ${
              activeTab === "cookies"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500/50 shadow-lg shadow-amber-500/20"
                : "glass text-nova-muted hover:text-white border-white/5"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Cookie Policy
          </button>
        </div>

        {/* Tab Content */}
        <div className="glass-strong rounded-3xl p-8 sm:p-12 border border-white/10 font-sans text-sm text-white/90 space-y-8 leading-relaxed">
          {activeTab === "privacy" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-display text-2xl font-bold text-white mb-1">Privacy Policy</h2>
                <p className="text-xs text-nova-muted">Last Updated: March 20, 2026</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">1. Information We Collect</h3>
                <p className="mb-3">When you register for a CodeNova AI account, we collect your full name, email address, phone number (optional), and GitHub/Google OAuth identity tokens. We also store your submitted code snippets, AST analysis logs, and conversational AI chat transcripts.</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">2. How We Use Your Data</h3>
                <p className="mb-3">We use your data to provide personalized AI mentoring, execute code within isolated Judge0 Docker containers, calculate global leaderboard ELO ratings, and send critical system/login alert emails.</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">3. Data Sharing & Third Parties</h3>
                <p className="mb-3">We never sell your personal information. We share minimal necessary data with verified infrastructure partners such as Judge0 CE (for code execution) and OpenAI (for AST mentoring analysis) via secure, encrypted API endpoints.</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">4. Your GDPR & CCPA Rights</h3>
                <p>You have the right to request a complete export of your personal data or request permanent account deletion from our MongoDB Atlas clusters at any time by contacting support@codenova.ai.</p>
              </div>
            </motion.div>
          )}

          {activeTab === "terms" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-display text-2xl font-bold text-white mb-1">Terms of Service</h2>
                <p className="text-xs text-nova-muted">Last Updated: March 20, 2026</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">1. Acceptance of Terms</h3>
                <p className="mb-3">By accessing or using the CodeNova AI online compiler, problem sets, live contests, or AI assistant, you agree to be bound by these Terms of Service. If you do not agree, do not use our platform.</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">2. User Conduct & Acceptable Use</h3>
                <p className="mb-3">You agree not to use our online compiler or Judge0 API endpoints for malicious purposes, including but not limited to crypto mining, network port scanning, DDoS attacks, or attempting to breach our Docker sandbox isolation.</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">3. Intellectual Property</h3>
                <p className="mb-3">All starter code, problem descriptions, test cases, and UI designs are the intellectual property of CodeNova AI. Code written and submitted by you remains your intellectual property.</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">4. Limitation of Liability</h3>
                <p>CodeNova AI is provided "as is" without warranty of any kind. We are not liable for any lost data, career interview outcomes, or temporary service downtime.</p>
              </div>
            </motion.div>
          )}

          {activeTab === "cookies" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="font-display text-2xl font-bold text-white mb-1">Cookie Policy</h2>
                <p className="text-xs text-nova-muted">Last Updated: March 20, 2026</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">1. What Are Cookies?</h3>
                <p className="mb-3">Cookies are small text files stored on your device that help us remember your authentication session, theme preferences, and editor settings across visits.</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">2. Types of Cookies We Use</h3>
                <ul className="space-y-2 list-disc pl-4 mb-3">
                  <li><strong>Essential Cookies:</strong> Required for JWT refresh token persistence (`refreshToken` HTTP-only cookie) and secure login.</li>
                  <li><strong>Functional Cookies:</strong> Stores your selected compiler language, Monaco/Custom editor theme (`dark`), and tab state.</li>
                  <li><strong>Analytics Cookies:</strong> Anonymous aggregated metrics to help us understand platform performance and page load speeds.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white text-base mb-2">3. Managing Your Cookie Preferences</h3>
                <p>You can instruct your browser to refuse all non-essential cookies. However, disabling essential cookies will prevent you from logging into your CodeNova AI dashboard or persisting your active coding sessions.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
