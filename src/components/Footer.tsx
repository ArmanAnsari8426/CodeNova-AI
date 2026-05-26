import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const Github = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.23.66-.5v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.69.92.69 1.85V21c0 .27.16.59.67.5A10 10 0 0 0 12 2z"/></svg>
);
const Twitter = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2H21l-6.52 7.45L22 22h-6.84l-4.79-6.27L4.8 22H2l7-8L2 2h6.91l4.34 5.74L18.244 2zm-2.4 18h1.66L8.24 4H6.5l9.344 16z"/></svg>
);
const Linkedin = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.71h.05c.53-.96 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.09V21h-4v-5.42c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4V9z"/></svg>
);
const Youtube = (p: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6a3 3 0 0 0 2.1-2.1c.5-1.6.5-4.8.5-4.8s0-3.2-.5-4.8zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>
);

const cols = [
  {
    title: "Platform",
    links: [
      { to: "/problems", label: "Problems" },
      { to: "/compiler", label: "Online Compiler" },
      { to: "/contests", label: "Contests" },
      { to: "/ai-assistant", label: "AI Assistant" },
      { to: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    title: "Learn",
    links: [
      { to: "/blog", label: "Blog & Tutorials" },
      { to: "/roadmap", label: "DSA Roadmap" },
      { to: "/interview-prep", label: "Interview Prep" },
      { to: "/resume-builder", label: "Resume Builder" },
      { to: "/ai-interviewer", label: "AI Interviewer" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/pricing", label: "Pricing" },
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/contact", label: "Contact" },
      { to: "/press", label: "Press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/cookies", label: "Cookie Policy" },
      { to: "/security", label: "Security" },
      { to: "/status", label: "Status" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/10 bg-nova-bg/80 backdrop-blur-md">
      <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-violet-500/80 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-nova-muted max-w-sm leading-relaxed">
              The AI-powered coding platform built for the next generation of developers. Learn programming, practice coding problems, run code online, participate in contests, and prepare for interviews with an AI mentor.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-nova-muted hover:text-white flex items-center justify-center transition hover:scale-110 border border-white/5" aria-label="social">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-sm font-display font-bold text-white tracking-wider uppercase border-b border-white/10 pb-2 inline-block">{col.title}</h4>
              <ul className="space-y-2.5 font-sans">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-nova-muted hover:text-violet-300 transition font-medium flex items-center gap-1 group">
                      <span className="w-1 h-1 rounded-full bg-violet-400 opacity-0 group-hover:opacity-100 transition" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-2">
            <p className="text-xs text-nova-muted font-sans max-w-md">
              © 2026 CodeNova AI, Inc. Crafted with caffeine, GPU cycles, and a love for clean code. All rights reserved.
            </p>
            <p className="text-xs text-nova-muted/70 font-sans">
              Created by{" "}
              <a
                href="https://armanansari8426.github.io/Arman-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 font-semibold transition inline-flex items-center gap-1"
              >
                Arman Ansari
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-4l-8 8m0 0l4-4m-4 4l4 4" />
                </svg>
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-nova-muted font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
            <Link to="/status" className="inline-flex items-center gap-2 hover:text-white transition">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400" />
              <span className="font-sans font-semibold text-emerald-300">All systems operational</span>
            </Link>
            <span className="opacity-30">•</span>
            <span className="text-white/80 font-bold">v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
