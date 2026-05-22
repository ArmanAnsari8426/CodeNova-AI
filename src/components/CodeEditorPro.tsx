import { useState, useRef, useEffect } from "react";
import { Play, Send, RotateCcw, Type, Terminal } from "lucide-react";
import { LANGUAGES, type LanguageId } from "@/data/mock";

interface CodeEditorProProps {
  value: string;
  onChange: (val: string) => void;
  language: LanguageId;
  onLanguageChange: (lang: LanguageId) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning?: boolean;
  isSubmitted?: boolean;
}

export default function CodeEditorPro({
  value,
  onChange,
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitted = false,
}: CodeEditorProProps) {
  const [fontSize, setFontSize] = useState(14);
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync line numbers
  useEffect(() => {
    const lines = value.split("\n").length;
    setLineCount(lines);
  }, [value]);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d12] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Premium Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#15151e] border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative group">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageId)}
              className="appearance-none bg-[#1e1e2e] text-gray-300 text-xs font-mono py-1.5 pl-3 pr-8 rounded-lg border border-white/10 focus:border-violet-500/50 outline-none cursor-pointer hover:bg-[#252538] transition"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-[#1e1e2e]">
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Font Size Control */}
          <div className="flex items-center gap-1 bg-[#1e1e2e] rounded-lg border border-white/10 p-0.5">
            <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition">
              <Type className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-gray-400 font-mono w-4 text-center">{fontSize}</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition">
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onChange("")} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition" title="Reset Code">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="w-12 bg-[#0d0d12] border-r border-white/5 text-right pr-3 pt-4 text-gray-600 font-mono select-none overflow-hidden"
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.5" }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 bg-transparent text-gray-300 p-4 font-mono resize-none outline-none border-none focus:ring-0 custom-scrollbar"
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.5", tabSize: 4 }}
          placeholder="// Write your code here..."
        />
      </div>

      {/* Action Bar */}
      <div className="px-4 py-3 bg-[#15151e] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          <Terminal className="w-3 h-3" />
          <span>Ctrl + Enter to Run</span>
          <span className="mx-1">|</span>
          <span>Ctrl + Shift + Enter to Submit</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#1e1e2e] text-gray-300 text-xs font-bold border border-white/10 hover:bg-[#252538] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
            Run
          </button>
          
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitted}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-lg text-xs font-bold transition shadow-lg ${
              isSubmitted
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-violet-500/25 hover:scale-[1.02] active:scale-95"
            }`}
          >
            <Send className="w-3 h-3" />
            {isSubmitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}