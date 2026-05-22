import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, MessageSquare, Building2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
      alert("📧 Thank you for contacting CodeNova AI! Our support team has received your message and will respond within 24 hours.");
    }, 1500);
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <Mail className="w-3.5 h-3.5 text-violet-400" /> Get In Touch
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Contact <span className="gradient-text">CodeNova AI</span>
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed">
            Have questions about our enterprise team plans, custom Judge0 compiler deployments, or AI mentorship integrations? We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
              <h3 className="font-display text-2xl font-bold text-white mb-2">Direct Support Channels</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">Email Support</h4>
                  <p className="text-xs text-nova-muted mt-0.5">support@codenova.ai</p>
                  <p className="text-[11px] text-nova-muted/80 mt-1">24/7 priority response for Pro and Team tier members.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">Community Discord</h4>
                  <p className="text-xs text-nova-muted mt-0.5">discord.gg/codenova-ai</p>
                  <p className="text-[11px] text-nova-muted/80 mt-1">Connect with 120k+ active community members and moderators.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">Enterprise Sales & Press</h4>
                  <p className="text-xs text-nova-muted mt-0.5">sales@codenova.ai</p>
                  <p className="text-[11px] text-nova-muted/80 mt-1">Custom contracts, SLA agreements, and media kits.</p>
                </div>
              </div>
            </div>

            {/* Global Offices */}
            <div className="glass rounded-3xl p-8 border border-white/10 space-y-4">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-rose-400" /> Global Headquarters
              </h3>
              <div className="space-y-3 text-xs text-nova-muted">
                <div>
                  <strong className="text-white block text-sm">US Engineering Office</strong>
                  100 AI Innovation Way, Suite 400, San Francisco, CA 94107
                </div>
                <div className="pt-2 border-t border-white/5">
                  <strong className="text-white block text-sm">APAC Engineering Hub</strong>
                  TechNova Tower, 5th Floor, Outer Ring Road, Bengaluru, India 560103
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
              <h2 className="font-display text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-xs text-nova-muted mb-8">Fill out the form below and we will route your inquiry to the appropriate engineering or sales department.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Your Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Priya Sharma" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-nova-muted font-medium mb-1 block">Your Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Subject</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50">
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Enterprise Sales">Enterprise Sales & Team Licensing</option>
                    <option value="Technical Support">Technical Support / Judge0 API</option>
                    <option value="AI Mentorship Partnership">AI Mentorship Partnership</option>
                    <option value="Press & Media">Press & Media</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-nova-muted font-medium mb-1 block">Message</label>
                  <textarea rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help you today? Please include any relevant details or account usernames…" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 resize-none" />
                </div>

                <button type="submit" disabled={submitted} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 disabled:opacity-40 transition flex items-center justify-center gap-2">
                  {submitted ? "Sending Message…" : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
