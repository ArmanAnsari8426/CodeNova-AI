import { Link } from "react-router-dom";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 blur-md opacity-60 group-hover:opacity-100 transition" />
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center font-display font-extrabold text-white shadow-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 h-1/2">
            <path d="M8 6 2 12l6 6" /><path d="m16 6 6 6-6 6" /><path d="m14 4-4 16" />
          </svg>
        </div>
      </div>
      <div className="leading-tight">
        <div className="font-display font-extrabold text-white tracking-tight text-lg">
          Code<span className="gradient-text">Nova</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-nova-muted -mt-0.5">AI Platform</div>
      </div>
    </Link>
  );
}
