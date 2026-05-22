import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, Sparkles, Plus, Trash2, CheckCircle2, User, Mail, Phone,
  Globe, LayoutTemplate, Palette, Briefcase, GraduationCap, Award, Check, X
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

type TemplateType = "faang" | "modern" | "executive";
type AccentColor = "violet" | "emerald" | "cyan" | "amber" | "rose" | "slate";

export default function ResumeBuilderPage() {
  const authUser = useAppSelector(s => s.auth.user);
  const user = authUser || {
    fullName: "Aarav Kumar",
    username: "arav.dev",
    email: "demo@codenova.ai",
    phone: "+91 98765 43210",
  };

  // Builder State
  const [template, setTemplate] = useState<TemplateType>("faang");
  const [accent, setAccent] = useState<AccentColor>("violet");
  const [activeTab, setActiveTab] = useState<"personal" | "skills" | "projects" | "experience" | "education">("personal");

  // AI Tailor Modal State
  const [aiModal, setAiModal] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [optimizedNotice, setOptimizedNotice] = useState<string | null>(null);

  // Resume Content State
  const [resumeData, setResumeData] = useState({
    fullName: user.fullName,
    title: "Senior Full Stack Developer & DSA Specialist",
    email: user.email,
    phone: user.phone || "",
    website: `codenova.ai/@${user.username}`,
    location: "Bengaluru, India",
    summary: "Accomplished developer with verified top-tier ranking on CodeNova AI. Demonstrated expertise in Data Structures, Algorithms, and Multi-language Cloud Compilation. Active participant in weekly competitive programming contests with a peak rating of 3,148.",
    skills: ["JavaScript (95%)", "TypeScript (90%)", "React (92%)", "Node.js (88%)", "Python (85%)", "C++ (80%)", "System Design (85%)", "GraphQL (80%)"],
    projects: [
      { name: "CodeNova AI Multi-language Online Playground", desc: "Built using React, TypeScript, Monaco/Custom AST, and Docker Isolated Sandboxes. Executed 1M+ code runs with zero downtime." },
      { name: "Advanced Dynamic Programming Solutions Bank", desc: "Authored and verified optimal O(N) time & space complexity solutions for 50+ Hard DSA challenges. Reduced memory overhead by 35%." },
    ],
    experience: [
      { role: "Senior Software Engineer", company: "TechNova Solutions", duration: "2024 - Present", desc: "Spearheaded microservices migration using Node.js and Docker, reducing API latency by 40%. Mentored 6 junior developers." },
      { role: "Full Stack Developer", company: "StartupX", duration: "2022 - 2024", desc: "Built responsive web applications and integrated Stripe payment gateways, increasing checkout conversions by 25%." },
    ],
    education: [
      { degree: "B.Tech in Computer Science & Engineering", school: "Indian Institute of Technology (IIT)", duration: "2018 - 2022", gpa: "9.2 CGPA" },
    ],
    certifications: [
      { name: "CodeNova AI Professional DSA Master Certification", issuer: "CodeNova AI", year: "2026" },
      { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2025" },
    ]
  });

  // Form Inputs
  const [newSkill, setNewSkill] = useState("");
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newExpRole, setNewExpRole] = useState("");
  const [newExpComp, setNewExpComp] = useState("");
  const [newExpDur, setNewExpDur] = useState("");
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newEduDeg, setNewEduDeg] = useState("");
  const [newEduSch, setNewEduSch] = useState("");
  const [newEduDur, setNewEduDur] = useState("");
  const [newEduGpa, setNewEduGpa] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setResumeData(d => ({ ...d, skills: [...d.skills, newSkill.trim()] }));
    setNewSkill("");
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjDesc.trim()) return;
    setResumeData(d => ({ ...d, projects: [...d.projects, { name: newProjName.trim(), desc: newProjDesc.trim() }] }));
    setNewProjName("");
    setNewProjDesc("");
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpRole.trim() || !newExpComp.trim()) return;
    setResumeData(d => ({ ...d, experience: [...d.experience, { role: newExpRole.trim(), company: newExpComp.trim(), duration: newExpDur.trim() || "2025 - Present", desc: newExpDesc.trim() }] }));
    setNewExpRole(""); setNewExpComp(""); setNewExpDur(""); setNewExpDesc("");
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduDeg.trim() || !newEduSch.trim()) return;
    setResumeData(d => ({ ...d, education: [...d.education, { degree: newEduDeg.trim(), school: newEduSch.trim(), duration: newEduDur.trim() || "2020 - 2024", gpa: newEduGpa.trim() }] }));
    setNewEduDeg(""); setNewEduSch(""); setNewEduDur(""); setNewEduGpa("");
  };

  const handleDeleteSkill = (index: number) => setResumeData(d => ({ ...d, skills: d.skills.filter((_, i) => i !== index) }));
  const handleDeleteProject = (index: number) => setResumeData(d => ({ ...d, projects: d.projects.filter((_, i) => i !== index) }));
  const handleDeleteExperience = (index: number) => setResumeData(d => ({ ...d, experience: d.experience.filter((_, i) => i !== index) }));
  const handleDeleteEducation = (index: number) => setResumeData(d => ({ ...d, education: d.education.filter((_, i) => i !== index) }));

  // AI Actions
  const handleAIOptimize = () => {
    setResumeData(d => ({
      ...d,
      summary: "Architected high-performance distributed systems with verified top-tier ranking on CodeNova AI. Demonstrated mastery in Data Structures, Algorithms, and Multi-language Cloud Compilation. Active participant in weekly competitive programming contests with a peak ELO rating of 3,148.",
      projects: d.projects.map(p => ({
        ...p,
        desc: p.desc.replace("Built", "Architected").replace("Authored", "Spearheaded").replace("Reduced", "Optimized and reduced")
      })),
      experience: d.experience.map(exp => ({
        ...exp,
        desc: exp.desc.replace("Built", "Engineered").replace("Spearheaded", "Spearheaded and scaled")
      }))
    }));
    setOptimizedNotice("✨ AI Optimization Complete: Action verbs upgraded to FAANG tech lead standards! ATS match rate increased to 98%.");
    setTimeout(() => setOptimizedNotice(null), 5000);
  };

  const handleAITailor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    setIsTailoring(true);
    setTimeout(() => {
      setIsTailoring(false);
      setAiModal(false);
      setResumeData(d => ({
        ...d,
        summary: `Highly accomplished developer tailored for ${jobDescription.slice(0, 30)}... Expert in modern cloud architecture, scalable microservices, and high-concurrency systems. Peak rating 3,148 on CodeNova AI.`,
        skills: ["React (Expert)", "TypeScript (Expert)", "Node.js/Express", "System Architecture", "Docker/Kubernetes", "GraphQL", "Data Structures & Algorithms"],
      }));
      setOptimizedNotice("🎯 AI Tailoring Complete: Summary and skills aligned perfectly with your target job description!");
      setTimeout(() => setOptimizedNotice(null), 5000);
    }, 1500);
  };

  // Color mappings
  const accentClasses = {
    violet: { text: "text-[#7c5cff]", bg: "bg-[#7c5cff]", border: "border-[#7c5cff]", lightBg: "bg-[#7c5cff]/10" },
    emerald: { text: "text-[#10b981]", bg: "bg-[#10b981]", border: "border-[#10b981]", lightBg: "bg-[#10b981]/10" },
    cyan: { text: "text-[#06b6d4]", bg: "bg-[#06b6d4]", border: "border-[#06b6d4]", lightBg: "bg-[#06b6d4]/10" },
    amber: { text: "text-[#f59e0b]", bg: "bg-[#f59e0b]", border: "border-[#f59e0b]", lightBg: "bg-[#f59e0b]/10" },
    rose: { text: "text-[#f43f5e]", bg: "bg-[#f43f5e]", border: "border-[#f43f5e]", lightBg: "bg-[#f43f5e]/10" },
    slate: { text: "text-[#475569]", bg: "bg-[#475569]", border: "border-[#475569]", lightBg: "bg-[#475569]/10" },
  };

  const curAccent = accentClasses[accent];

  return (
    <div className="pt-28 pb-24 print:pt-0 print:pb-0 print:bg-white print:text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 print:px-0 print:max-w-none">
        
        {/* Header (Hidden on Print) */}
        <div className="text-center max-w-4xl mx-auto mb-16 print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <FileText className="w-3.5 h-3.5 text-violet-400" /> Interactive FAANG CV Generator
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Professional <span className="gradient-text">Resume Builder</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            Create an ATS-beating developer resume in seconds. Your CodeNova AI competitive metrics, rating, and verified skills are pre-populated to help you land top-tier tech interviews.
          </p>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => window.print()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF / Print Resume
            </button>
            <button
              onClick={handleAIOptimize}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> AI Optimize Keywords
            </button>
            <button
              onClick={() => setAiModal(true)}
              className="px-6 py-3.5 rounded-xl glass-strong text-white font-semibold text-sm hover:bg-white/10 transition inline-flex items-center gap-2 border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI Tailor for Job Description
            </button>
          </div>

          {/* Optimized Toast Notice */}
          <AnimatePresence>
            {optimizedNotice && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 shrink-0" /> {optimizedNotice}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Template & Color Selectors */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8 p-6 rounded-3xl glass border border-white/10 text-left">
            <div>
              <label className="text-xs text-nova-muted font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <LayoutTemplate className="w-4 h-4 text-violet-400" /> Choose Layout Template
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "faang", label: "FAANG Modern", desc: "Clean ATS standard" },
                  { id: "modern", label: "Sidebar Tech", desc: "Sleek accent bar" },
                  { id: "executive", label: "Executive Classic", desc: "Elegant centered" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id as TemplateType)}
                    className={`p-3 rounded-2xl border transition text-left ${
                      template === t.id ? "bg-white/10 border-violet-500 shadow-md shadow-violet-500/20" : "bg-white/[0.02] border-white/5 hover:border-white/10 text-nova-muted hover:text-white"
                    }`}
                  >
                    <div className="font-bold text-xs text-white mb-0.5">{t.label}</div>
                    <div className="text-[10px] text-nova-muted leading-tight">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-nova-muted font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-cyan-400" /> Choose Accent Color
              </label>
              <div className="flex flex-wrap gap-3 pt-1">
                {(["violet", "emerald", "cyan", "amber", "rose", "slate"] as AccentColor[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setAccent(c)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition transform hover:scale-110 ${
                      accent === c ? "ring-4 ring-white scale-110 shadow-lg" : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: c === "violet" ? "#7c5cff" : c === "emerald" ? "#10b981" : c === "cyan" ? "#06b6d4" : c === "amber" ? "#f59e0b" : c === "rose" ? "#f43f5e" : "#475569"
                    }}
                  >
                    {accent === c && <Check className="w-4 h-4 text-white font-bold" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Builder Workspace Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start print:block print:w-full print:gap-0">
          
          {/* Left: Customization Form Tabs (Hidden on Print) */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            {/* Form Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10">
              {[
                { id: "personal", label: "Personal", icon: User },
                { id: "skills", label: "Skills", icon: Sparkles },
                { id: "projects", label: "Projects", icon: FileText },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "education", label: "Education", icon: GraduationCap },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition whitespace-nowrap ${
                    activeTab === tab.id ? "bg-white/10 border-white/20 text-white shadow-sm" : "glass text-nova-muted hover:text-white border-white/5"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Personal Details */}
            {activeTab === "personal" && (
              <div className="glass rounded-3xl p-6 border border-white/10 space-y-4 animate-fadeIn">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-violet-400" /> Personal Details & Summary
                </h3>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Full Name</label>
                  <input type="text" value={resumeData.fullName} onChange={e => setResumeData(d => ({ ...d, fullName: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Professional Title</label>
                  <input type="text" value={resumeData.title} onChange={e => setResumeData(d => ({ ...d, title: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Email</label>
                    <input type="email" value={resumeData.email} onChange={e => setResumeData(d => ({ ...d, email: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Phone</label>
                    <input type="text" value={resumeData.phone} onChange={e => setResumeData(d => ({ ...d, phone: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Website / Portfolio</label>
                    <input type="text" value={resumeData.website} onChange={e => setResumeData(d => ({ ...d, website: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Location</label>
                    <input type="text" value={resumeData.location} onChange={e => setResumeData(d => ({ ...d, location: e.target.value }))} className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Professional Summary</label>
                  <textarea value={resumeData.summary} onChange={e => setResumeData(d => ({ ...d, summary: e.target.value }))} rows={5} className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50 resize-none" />
                </div>
              </div>
            )}

            {/* Tab 2: Skills */}
            {activeTab === "skills" && (
              <div className="glass rounded-3xl p-6 border border-white/10 space-y-4 animate-fadeIn">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Manage Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2 mb-4 max-h-[200px] overflow-y-auto pr-1">
                  {resumeData.skills.map((skill, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-white border border-white/10 group">
                      {skill}
                      <button onClick={() => handleDeleteSkill(i)} className="text-rose-300 hover:text-rose-400 opacity-80 group-hover:opacity-100 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t border-white/5">
                  <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add skill (e.g. Docker, GraphQL, Kubernetes)…" className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan-500/50" />
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-nova-bg font-semibold text-xs hover:bg-cyan-400 transition flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Projects */}
            {activeTab === "projects" && (
              <div className="glass rounded-3xl p-6 border border-white/10 space-y-4 animate-fadeIn">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-amber-400" /> Manage Projects
                </h3>
                <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-1">
                  {resumeData.projects.map((proj, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 group">
                      <div>
                        <h4 className="text-xs font-bold text-white mb-1">{proj.name}</h4>
                        <p className="text-[11px] text-nova-muted leading-relaxed">{proj.desc}</p>
                      </div>
                      <button onClick={() => handleDeleteProject(i)} className="text-rose-300 hover:text-rose-400 mt-0.5 opacity-80 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddProject} className="space-y-2 pt-2 border-t border-white/5">
                  <input type="text" value={newProjName} onChange={e => setNewProjName(e.target.value)} placeholder="Project Name (e.g. Distributed Compiler Sandbox)" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-amber-500/50" />
                  <textarea value={newProjDesc} onChange={e => setNewProjDesc(e.target.value)} rows={3} placeholder="Project Description & Impact metrics…" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-amber-500/50 resize-none" />
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-500 text-nova-bg font-semibold text-xs hover:bg-amber-400 transition flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </form>
              </div>
            )}

            {/* Tab 4: Experience */}
            {activeTab === "experience" && (
              <div className="glass rounded-3xl p-6 border border-white/10 space-y-4 animate-fadeIn">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" /> Manage Work Experience
                </h3>
                <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-1">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 group">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-white mb-1">
                          <span>{exp.role}</span>
                          <span className="text-emerald-400">{exp.duration}</span>
                        </div>
                        <div className="text-[11px] text-white/80 font-medium mb-1">{exp.company}</div>
                        <p className="text-[11px] text-nova-muted leading-relaxed">{exp.desc}</p>
                      </div>
                      <button onClick={() => handleDeleteExperience(i)} className="text-rose-300 hover:text-rose-400 mt-0.5 opacity-80 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddExperience} className="space-y-2 pt-2 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={newExpRole} onChange={e => setNewExpRole(e.target.value)} placeholder="Job Role" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-emerald-500/50" />
                    <input type="text" value={newExpComp} onChange={e => setNewExpComp(e.target.value)} placeholder="Company Name" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-emerald-500/50" />
                  </div>
                  <input type="text" value={newExpDur} onChange={e => setNewExpDur(e.target.value)} placeholder="Duration (e.g. 2023 - Present)" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-emerald-500/50" />
                  <textarea value={newExpDesc} onChange={e => setNewExpDesc(e.target.value)} rows={3} placeholder="Achievements & bullet points…" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-emerald-500/50 resize-none" />
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 text-nova-bg font-semibold text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </form>
              </div>
            )}

            {/* Tab 5: Education */}
            {activeTab === "education" && (
              <div className="glass rounded-3xl p-6 border border-white/10 space-y-4 animate-fadeIn">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-rose-400" /> Manage Education
                </h3>
                <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-1">
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 group">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-white mb-1">
                          <span>{edu.degree}</span>
                          <span className="text-rose-400">{edu.duration}</span>
                        </div>
                        <div className="text-[11px] text-white/80 font-medium mb-1">{edu.school}</div>
                        <div className="text-[11px] text-nova-muted">GPA: {edu.gpa}</div>
                      </div>
                      <button onClick={() => handleDeleteEducation(i)} className="text-rose-300 hover:text-rose-400 mt-0.5 opacity-80 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddEducation} className="space-y-2 pt-2 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={newEduDeg} onChange={e => setNewEduDeg(e.target.value)} placeholder="Degree (e.g. B.Tech CS)" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-rose-500/50" />
                    <input type="text" value={newEduSch} onChange={e => setNewEduSch(e.target.value)} placeholder="University / School" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-rose-500/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={newEduDur} onChange={e => setNewEduDur(e.target.value)} placeholder="Duration (e.g. 2018 - 2022)" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-rose-500/50" />
                    <input type="text" value={newEduGpa} onChange={e => setNewEduGpa(e.target.value)} placeholder="GPA / CGPA" className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-rose-500/50" />
                  </div>
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-semibold text-xs hover:bg-rose-400 transition flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right: Live Resume Preview (Printable area) */}
          <div className="lg:col-span-7 print:block print:w-full print:m-0 print:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className={`bg-white text-black p-8 sm:p-12 rounded-3xl shadow-2xl font-sans space-y-8 border border-white/20 print:p-0 print:shadow-none print:border-none print:rounded-none`}
            >
              {/* Template 1: FAANG Modern */}
              {template === "faang" && (
                <>
                  <div className={`border-b-2 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 ${curAccent.border}`}>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{resumeData.fullName}</h1>
                      <p className={`font-bold text-base mt-1 ${curAccent.text}`}>{resumeData.title}</p>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 font-medium">
                      <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-500" /> {resumeData.email}</p>
                      {resumeData.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-500" /> {resumeData.phone}</p>}
                      <p className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-500" /> {resumeData.website}</p>
                      <p className="flex items-center gap-1.5 text-gray-500">📍 {resumeData.location}</p>
                    </div>
                  </div>

                  <div>
                    <h2 className={`text-xs font-extrabold border-b pb-1 mb-2 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Professional Summary</h2>
                    <p className="text-xs text-gray-700 leading-relaxed font-normal">{resumeData.summary}</p>
                  </div>

                  <div>
                    <h2 className={`text-xs font-extrabold border-b pb-1 mb-2 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Key CodeNova AI Metrics</h2>
                    <ul className="text-xs text-gray-700 space-y-1 font-medium grid sm:grid-cols-2 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200 print:bg-transparent print:border-none print:p-0">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${curAccent.text}`} /> Global Rating: 3,148 (Rank #1)</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${curAccent.text}`} /> Problems Solved: 1,284</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${curAccent.text}`} /> Coding Streak: 32 Days</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className={`w-3.5 h-3.5 ${curAccent.text}`} /> Total Experience: 14,820 XP</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className={`text-xs font-extrabold border-b pb-1 mb-2 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Technical Skills</h2>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {resumeData.skills.map((s, i) => (
                        <span key={i} className={`px-2.5 py-1 text-gray-800 rounded-lg text-xs font-semibold border border-gray-200 ${curAccent.lightBg}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className={`text-xs font-extrabold border-b pb-1 mb-3 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Projects</h2>
                    <div className="space-y-4">
                      {resumeData.projects.map((p, i) => (
                        <div key={i}>
                          <h4 className="font-bold text-gray-900 text-xs">{p.name}</h4>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className={`text-xs font-extrabold border-b pb-1 mb-3 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Work Experience</h2>
                    <div className="space-y-5">
                      {resumeData.experience.map((exp, i) => (
                        <div key={i} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-gray-900 mb-0.5">
                            <span className="text-sm">{exp.role}</span>
                            <span className={`font-semibold ${curAccent.text}`}>{exp.duration}</span>
                          </div>
                          <div className="text-gray-600 font-semibold">{exp.company}</div>
                          <p className="text-gray-700 leading-relaxed pt-0.5">{exp.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className={`text-xs font-extrabold border-b pb-1 mb-3 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Education & Certifications</h2>
                    <div className="space-y-4 text-xs">
                      {resumeData.education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-900">{edu.degree}</div>
                            <div className="text-gray-600">{edu.school} — <span className="font-medium text-gray-800">GPA: {edu.gpa}</span></div>
                          </div>
                          <span className={`font-semibold ${curAccent.text}`}>{edu.duration}</span>
                        </div>
                      ))}
                      <div className="pt-2 space-y-1.5">
                        {resumeData.certifications.map((cert, i) => (
                          <div key={i} className="flex justify-between text-xs text-gray-700">
                            <span className="font-semibold text-gray-900">🏆 {cert.name}</span>
                            <span className="text-gray-500 font-medium">{cert.issuer} ({cert.year})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Template 2: Sidebar Tech */}
              {template === "modern" && (
                <div className="grid grid-cols-12 gap-6 min-h-[800px] print:min-h-0">
                  {/* Left Sidebar */}
                  <div className={`col-span-4 p-6 rounded-2xl text-white flex flex-col justify-between ${curAccent.bg} print:bg-gray-100 print:text-black`}>
                    <div className="space-y-6">
                      <div className="space-y-2 border-b border-white/20 pb-6 print:border-gray-300">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center font-display font-extrabold text-2xl text-white mb-2 print:bg-gray-300 print:text-black">
                          {resumeData.fullName.split(" ").map(s => s[0]).join("")}
                        </div>
                        <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{resumeData.fullName}</h1>
                        <p className="text-xs font-semibold opacity-90">{resumeData.title}</p>
                      </div>

                      <div className="space-y-3 text-xs opacity-90 font-medium border-b border-white/20 pb-6 print:border-gray-300">
                        <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0 opacity-80" /> {resumeData.email}</p>
                        {resumeData.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0 opacity-80" /> {resumeData.phone}</p>}
                        <p className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 shrink-0 opacity-80" /> {resumeData.website}</p>
                        <p className="flex items-center gap-2">📍 {resumeData.location}</p>
                      </div>

                      <div className="space-y-3 border-b border-white/20 pb-6 print:border-gray-300">
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-80">Skills</h3>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {resumeData.skills.map((s, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white/15 rounded-lg text-xs font-semibold print:bg-gray-200 print:text-gray-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-80">CodeNova AI Metrics</h3>
                        <ul className="text-xs space-y-1.5 font-medium opacity-90">
                          <li>⭐ Rating: 3,148 (#1)</li>
                          <li>💻 Solved: 1,284</li>
                          <li>🔥 Streak: 32 Days</li>
                          <li>🏆 XP: 14,820</li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/20 text-[10px] opacity-70 print:border-gray-300">
                      Verified Developer Profile
                    </div>
                  </div>

                  {/* Right Main Content */}
                  <div className="col-span-8 space-y-6 pl-2">
                    <div>
                      <h2 className={`text-xs font-extrabold border-b pb-1 mb-2 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Professional Summary</h2>
                      <p className="text-xs text-gray-700 leading-relaxed font-normal">{resumeData.summary}</p>
                    </div>

                    <div>
                      <h2 className={`text-xs font-extrabold border-b pb-1 mb-3 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Work Experience</h2>
                      <div className="space-y-5">
                        {resumeData.experience.map((exp, i) => (
                          <div key={i} className="text-xs space-y-1">
                            <div className="flex justify-between font-bold text-gray-900 mb-0.5">
                              <span className="text-sm">{exp.role}</span>
                              <span className={`font-semibold ${curAccent.text}`}>{exp.duration}</span>
                            </div>
                            <div className="text-gray-600 font-semibold">{exp.company}</div>
                            <p className="text-gray-700 leading-relaxed pt-0.5">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className={`text-xs font-extrabold border-b pb-1 mb-3 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Projects</h2>
                      <div className="space-y-4">
                        {resumeData.projects.map((p, i) => (
                          <div key={i}>
                            <h4 className="font-bold text-gray-900 text-xs">{p.name}</h4>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{p.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className={`text-xs font-extrabold border-b pb-1 mb-3 uppercase tracking-wider ${curAccent.text} ${curAccent.border}`}>Education & Certifications</h2>
                      <div className="space-y-4 text-xs">
                        {resumeData.education.map((edu, i) => (
                          <div key={i} className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-gray-900">{edu.degree}</div>
                              <div className="text-gray-600">{edu.school} — <span className="font-medium text-gray-800">GPA: {edu.gpa}</span></div>
                            </div>
                            <span className={`font-semibold ${curAccent.text}`}>{edu.duration}</span>
                          </div>
                        ))}
                        <div className="pt-2 space-y-1.5">
                          {resumeData.certifications.map((cert, i) => (
                            <div key={i} className="flex justify-between text-xs text-gray-700">
                              <span className="font-semibold text-gray-900">🏆 {cert.name}</span>
                              <span className="text-gray-500 font-medium">{cert.issuer} ({cert.year})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Template 3: Executive Classic */}
              {template === "executive" && (
                <div className="space-y-8">
                  <div className="text-center border-b-2 border-gray-800 pb-6 space-y-2">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">{resumeData.fullName}</h1>
                    <p className="font-sans font-bold text-sm tracking-widest uppercase text-gray-700">{resumeData.title}</p>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600 font-sans pt-1">
                      <span>{resumeData.email}</span>
                      {resumeData.phone && <span>• {resumeData.phone}</span>}
                      <span>• {resumeData.website}</span>
                      <span>• {resumeData.location}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold font-serif uppercase tracking-widest text-gray-900 border-b border-gray-400 pb-1 mb-2">Executive Summary</h2>
                    <p className="text-xs text-gray-800 leading-relaxed font-sans">{resumeData.summary}</p>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold font-serif uppercase tracking-widest text-gray-900 border-b border-gray-400 pb-1 mb-2">Core Competencies & Verified Metrics</h2>
                    <div className="grid sm:grid-cols-2 gap-4 font-sans text-xs text-gray-800 pt-1">
                      <div>
                        <strong className="text-gray-900 block mb-1 font-serif">Verified CodeNova AI Performance:</strong>
                        <ul className="space-y-1 pl-4 list-disc text-gray-700">
                          <li>Peak ELO Rating: 3,148 (Global Rank #1)</li>
                          <li>1,284 DSA challenges solved across 7 languages</li>
                          <li>32-Day active coding streak</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-gray-900 block mb-1 font-serif">Technical Expertise:</strong>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {resumeData.skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-[11px] font-semibold text-gray-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold font-serif uppercase tracking-widest text-gray-900 border-b border-gray-400 pb-1 mb-3">Professional Experience</h2>
                    <div className="space-y-6 font-sans">
                      {resumeData.experience.map((exp, i) => (
                        <div key={i} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-gray-900 mb-0.5">
                            <span className="text-sm font-serif">{exp.role}</span>
                            <span className="font-semibold text-gray-700">{exp.duration}</span>
                          </div>
                          <div className="text-gray-800 font-semibold">{exp.company}</div>
                          <p className="text-gray-700 leading-relaxed pt-0.5">{exp.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold font-serif uppercase tracking-widest text-gray-900 border-b border-gray-400 pb-1 mb-3">Projects & Architecture</h2>
                    <div className="space-y-4 font-sans">
                      {resumeData.projects.map((p, i) => (
                        <div key={i}>
                          <h4 className="font-bold font-serif text-gray-900 text-xs">{p.name}</h4>
                          <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xs font-bold font-serif uppercase tracking-widest text-gray-900 border-b border-gray-400 pb-1 mb-3">Education & Professional Credentials</h2>
                    <div className="space-y-4 font-sans text-xs">
                      {resumeData.education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-900 font-serif">{edu.degree}</div>
                            <div className="text-gray-700">{edu.school} — <span className="font-medium text-gray-900">GPA: {edu.gpa}</span></div>
                          </div>
                          <span className="font-semibold text-gray-700">{edu.duration}</span>
                        </div>
                      ))}
                      <div className="pt-2 space-y-1.5 border-t border-gray-200">
                        {resumeData.certifications.map((cert, i) => (
                          <div key={i} className="flex justify-between text-xs text-gray-800 font-sans">
                            <span className="font-semibold text-gray-900">🏆 {cert.name}</span>
                            <span className="text-gray-600 font-medium">{cert.issuer} ({cert.year})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Tailor Job Description Modal */}
      <AnimatePresence>
        {aiModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAiModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg glass-strong rounded-3xl p-8 gradient-border shadow-2xl shadow-black/80 relative">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" /> AI Tailor for Job Description
                </h3>
                <button onClick={() => setAiModal(false)} className="p-1 rounded-lg hover:bg-white/10 text-nova-muted hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAITailor} className="space-y-4">
                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1.5 block">Paste Target Job Description (e.g. Senior React Engineer at Stripe)</label>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    rows={6}
                    placeholder="Paste the full job requirements, responsibilities, and required skills here…"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500/50 resize-none"
                    required
                  />
                </div>

                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-center gap-2">
                  <Award className="w-4 h-4 shrink-0" /> Nova AI will instantly align your summary, skills, and project phrasing to match the employer's exact ATS keywords.
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setAiModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isTailoring} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 transition flex items-center justify-center gap-1.5">
                    {isTailoring ? "Tailoring Resume…" : <><Sparkles className="w-4 h-4" /> Tailor Resume</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
