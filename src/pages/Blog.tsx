import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, BookOpen, TrendingUp, Mail, Share2, Sparkles, User, ArrowRight, Bookmark } from "lucide-react";
import { BLOG_POSTS } from "@/data/mock";

const CATS = ["All", "DSA Guide", "AI", "Interview Prep", "Career", "Programming Tips"];

export default function Blog() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [subscribed, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const filtered = BLOG_POSTS.filter(p =>
    (cat === "All" || p.category === cat) &&
    (!q || p.title.toLowerCase().includes(q.toLowerCase()))
  );
  const featured = BLOG_POSTS[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      alert("🎉 Subscribed successfully! You will now receive weekly FAANG interview guides and AI coding tips directly in your inbox.");
    }, 1500);
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-nova-muted">
            <BookOpen className="w-3.5 h-3.5 text-violet-400" /> CodeNova Journal & Engineering Blog
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mt-4">
            Code, <span className="gradient-text">Deeply Explained</span>.
          </h1>
          <p className="text-nova-muted mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
            Long-form technical tutorials, comprehensive DSA roadmaps, AI breakthroughs, and career advice authored by veteran FAANG tech leads.
          </p>
        </div>

        {/* Featured Article Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl glass-strong gradient-border p-8 sm:p-12 mb-16 shadow-2xl"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient} opacity-15`} />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-500/30 blur-3xl rounded-full pointer-events-none" />
          <div className="relative grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" /> Featured · Most Read This Week
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">{featured.title}</h2>
              <p className="text-nova-muted text-base leading-relaxed max-w-xl">{featured.excerpt}</p>
              
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-nova-muted pt-2 border-t border-white/10 max-w-xl">
                <span className="flex items-center gap-1.5 font-medium text-white"><User className="w-3.5 h-3.5 text-violet-400" /> {featured.author}</span>
                <span>📅 {featured.date}</span>
                <span className="flex items-center gap-1 font-semibold text-cyan-300"><Clock className="w-3.5 h-3.5" /> {featured.readMins} min read</span>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => alert(`📖 Opening full article: "${featured.title}"…`)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-xs shadow-lg shadow-violet-500/30 hover:scale-[1.02] transition inline-flex items-center gap-2"
                >
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert("🔗 Article link copied to clipboard!")}
                  className="p-3.5 rounded-xl glass text-white hover:bg-white/10 transition border border-white/10"
                  title="Share Article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="md:col-span-4 flex items-center justify-center">
              <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br ${featured.gradient} flex items-center justify-center text-7xl sm:text-8xl shadow-2xl shadow-violet-500/30 animate-float-slow border border-white/20`}>
                {featured.emoji}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Subscription Box */}
        <div className="glass-strong rounded-3xl p-8 sm:p-10 border border-white/10 mb-16 grid md:grid-cols-12 gap-8 items-center bg-gradient-to-r from-violet-500/10 via-nova-bg to-cyan-500/10">
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> CodeNova AI Weekly Digest
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Get FAANG Interview Guides in Your Inbox</h2>
            <p className="text-xs text-nova-muted leading-relaxed max-w-lg">
              Join 180k+ developers who receive our weekly deep-dive tutorials, system design blueprints, and exclusive Judge0 compiler optimization tips. No spam, unsubscribe anytime.
            </p>
          </div>
          <div className="md:col-span-5">
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address…"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50 placeholder:text-nova-muted/60"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 transition flex items-center justify-center gap-1.5"
              >
                {subscribed ? "Subscribing…" : <><Sparkles className="w-4 h-4" /> Subscribe to Newsletter</>}
              </button>
            </form>
          </div>
        </div>

        {/* Search & Category Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-muted" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search articles by title, keyword, or topic…"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass border border-white/10 text-xs text-white placeholder:text-nova-muted/60 outline-none focus:border-violet-500/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-5 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition border ${
                  cat === c
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-violet-500/50 shadow-lg shadow-violet-500/20"
                    : "glass text-nova-muted hover:text-white border-white/5 hover:border-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-white/20 transition shadow-xl"
            >
              <div>
                <div className={`relative h-48 bg-gradient-to-br ${post.gradient} flex items-center justify-center overflow-hidden border-b border-white/10`}>
                  <div className="absolute inset-0 opacity-20 grid-bg pointer-events-none" />
                  <span className="text-7xl relative z-10 group-hover:scale-110 transition duration-300">{post.emoji}</span>
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-violet-300 transition line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-nova-muted line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-nova-muted">
                  <span className="flex items-center gap-1.5 font-medium text-white/90">
                    <User className="w-3.5 h-3.5 text-violet-400" /> {post.author}
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {post.readMins} min
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`📖 Opening full article: "${post.title}"…`)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 group-hover:bg-violet-500 text-white text-xs font-semibold border border-white/10 group-hover:border-violet-500 transition flex items-center justify-center gap-1"
                  >
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert(`🔖 Article "${post.title}" bookmarked to your CodeNova AI Dashboard!`)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-nova-muted hover:text-white border border-white/10 transition"
                    title="Bookmark Article"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center glass rounded-3xl border border-white/10">
              <BookOpen className="w-12 h-12 text-nova-muted mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-white">No Articles Found</h3>
              <p className="text-xs text-nova-muted mt-1 max-w-md mx-auto">
                No articles match your search query "{q}" in the "{cat}" category. Try adjusting your search keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
