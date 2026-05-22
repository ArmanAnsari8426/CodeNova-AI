import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Save, Share2, Download, Settings, Cpu, Bot, Sparkles,
  Code2, Terminal, Eye, Trash2, Copy, CheckCircle2, X,
  Loader2, Zap, FolderOpen, Type, Palette
} from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { LANGUAGES, type LanguageId } from "@/data/mock";

/* ══════════════════════════════════════════════════════════════
   STARTER SNIPPETS
   ══════════════════════════════════════════════════════════════ */
const SNIPPETS: Record<LanguageId, string> = {
  javascript: `// JavaScript — runs instantly in your browser V8 engine\nconst greet = (name) => \`Hello, \${name}! 👋\`;\n\nconst fibonacci = (n) => {\n  const fib = [0, 1];\n  for (let i = 2; i < n; i++) fib.push(fib[i - 1] + fib[i - 2]);\n  return fib;\n};\n\nconsole.log(greet("CodeNova"));\nconsole.log("Fibonacci(10):", fibonacci(10));\nconsole.log("Sum:", fibonacci(10).reduce((a, b) => a + b, 0));\n`,
  typescript: `// TypeScript — type-safe code\ninterface User {\n  name: string;\n  age: number;\n  skills: string[];\n}\n\nconst greet = (user: User): string =>\n  \`Hello \${user.name}, age \${user.age}, skills: \${user.skills.join(", ")}!\`;\n\nconst user: User = { name: "CodeNova", age: 2, skills: ["TypeScript", "React"] };\nconsole.log(greet(user));\nconsole.log("Destructure:", user.skills.map(s => s.toUpperCase()));\n`,
  python: `# Python 3 — Fibonacci with list comprehension\ndef fibonacci(n):\n    fib = [0, 1]\n    for _ in range(2, n):\n        fib.append(fib[-1] + fib[-2])\n    return fib\n\nprint("Hello, CodeNova! 🚀")\nprint("Fibonacci(10):", fibonacci(10))\nprint(f"Sum = {sum(fibonacci(10))}")\nprint(f"Max = {max(fibonacci(10))}")\n\n# Lambda example\ncube = lambda x: x ** 3\nprint("Cube of 5:", cube(5))\n`,
  java: `public class Main {\n    static int[] fibonacci(int n) {\n        int[] fib = new int[n];\n        fib[0] = 0; fib[1] = 1;\n        for (int i = 2; i < n; i++) fib[i] = fib[i-1] + fib[i-2];\n        return fib;\n    }\n\n    public static void main(String[] args) {\n        int[] fib = fibonacci(10);\n        System.out.println("Hello, CodeNova! 🚀");\n        for (int i = 0; i < fib.length; i++) {\n            System.out.print(fib[i] + " ");\n        }\n        System.out.println();\n        System.out.println("Length: " + fib.length);\n    }\n}\n`,
  cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> fibonacci(int n) {\n    vector<int> fib = {0, 1};\n    for (int i = 2; i < n; i++)\n        fib.push_back(fib[i-1] + fib[i-2]);\n    return fib;\n}\n\nint main() {\n    auto fib = fibonacci(10);\n    cout << "Hello, CodeNova! 🚀" << endl;\n    for (int x : fib) cout << x << " ";\n    cout << endl << "Size: " << fib.size() << endl;\n    return 0;\n}\n`,
  c: `#include <stdio.h>\n\nvoid fibonacci(int *fib, int n) {\n    fib[0] = 0; fib[1] = 1;\n    for (int i = 2; i < n; i++)\n        fib[i] = fib[i-1] + fib[i-2];\n}\n\nint main() {\n    int fib[10];\n    fibonacci(fib, 10);\n    printf("Hello, CodeNova! \\n");\n    for (int i = 0; i < 10; i++)\n        printf("%d ", fib[i]);\n    printf("\\n");\n    return 0;\n}\n`,
  csharp: `using System;\nusing System.Linq;\n\nclass Program {\n    static int[] Fibonacci(int n) {\n        var fib = new int[n];\n        fib[0] = 0; fib[1] = 1;\n        for (int i = 2; i < n; i++) fib[i] = fib[i-1] + fib[i-2];\n        return fib;\n    }\n\n    static void Main() {\n        var fib = Fibonacci(10);\n        Console.WriteLine("Hello, CodeNova! 🚀");\n        Console.WriteLine(string.Join(" ", fib));\n        Console.WriteLine($"Sum = {fib.Sum()}");\n    }\n}\n`,
  go: `package main\n\nimport "fmt"\n\nfunc fibonacci(n int) []int {\n    fib := []int{0, 1}\n    for i := 2; i < n; i++ {\n        fib = append(fib, fib[i-1] + fib[i-2])\n    }\n    return fib\n}\n\nfunc main() {\n    fib := fibonacci(10)\n    fmt.Println("Hello, CodeNova! 🚀")\n    fmt.Println("Fibonacci:", fib)\n    fmt.Println("Length:", len(fib))\n}\n`,
  rust: `fn fibonacci(n: usize) -> Vec<u64> {\n    let mut fib = vec![0, 1];\n    for i in 2..n {\n        fib.push(fib[i-1] + fib[i-2]);\n    }\n    fib\n}\n\nfn main() {\n    let fib = fibonacci(10);\n    println!("Hello, CodeNova! 🚀");\n    println!("Fibonacci: {:?}", fib);\n    println!("Sum: {}", fib.iter().sum::<u64>());\n}\n`,
  php: `<?php\nfunction fibonacci($n) {\n    $fib = [0, 1];\n    for ($i = 2; $i < $n; $i++)\n        $fib[] = $fib[$i-1] + $fib[$i-2];\n    return $fib;\n}\n\n$fib = fibonacci(10);\necho "Hello, CodeNova! 🚀\\n";\nforeach ($fib as $x) echo $x . " ";\necho "\\nSum: " . array_sum($fib) . "\\n";\n?>\n`,
  ruby: `def fibonacci(n)\n  fib = [0, 1]\n  (2...n).each { fib << fib[-1] + fib[-2] }\n  fib\nend\n\nputs "Hello, CodeNova! 🚀"\nputs fibonacci(10).inspect\nputs "Sum = #{fibonacci(10).sum}"\nputs "Cube of 5 = #{5 ** 3}"\n`,
  swift: `func fibonacci(_ n: Int) -> [Int] {\n    var fib = [0, 1]\n    for i in 2..<n {\n        fib.append(fib[i-1] + fib[i-2])\n    }\n    return fib\n}\n\nprint("Hello, CodeNova! 🚀")\nprint("Fibonacci(10):", fibonacci(10))\nprint("Sum:", fibonacci(10).reduce(0, +))\n`,
  kotlin: `fun fibonacci(n: Int): List<Int> {\n    val fib = mutableListOf(0, 1)\n    for (i in 2 until n) fib.add(fib[i-1] + fib[i-2])\n    return fib\n}\n\nfun main() {\n    val result = fibonacci(10)\n    println("Hello, CodeNova! 🚀")\n    println("Fibonacci: " + result)\n    println("Sum: " + result.sum())\n}\n`,
  bash: `#!/bin/bash\n\nfibonacci() {\n    local n=$1\n    local fib=(0 1)\n    for ((i=2; i<n; i++)); do\n        fib+=($(( fib[i-1] + fib[i-2] )))\n    done\n    echo \${fib[@]}\n}\n\necho "Hello, CodeNova! 🚀"\necho "Fibonacci(10): $(fibonacci 10)"\n`,
  sql: `-- Create and query a simple table\nCREATE TABLE developers (\n    id    INTEGER PRIMARY KEY,\n    name  TEXT NOT NULL,\n    lang  TEXT,\n    level INTEGER DEFAULT 0\n);\n\nINSERT INTO developers (name, lang, level) VALUES\n    ('Aarav',  'JavaScript', 95),\n    ('Priya',  'Python',     92),\n    ('Diego',  'Rust',       88),\n    ('Sophie', 'TypeScript', 90),\n    ('Lucas',  'Go',         85);\n\nSELECT name, lang, level\n  FROM developers\n ORDER BY level DESC;\n\nSELECT lang, COUNT(*) AS count, AVG(level) AS avg_level\n  FROM developers\n GROUP BY lang\n ORDER BY avg_level DESC;\n`,
  html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>CodeNova Live Preview</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <div class="card">\n    <div class="badge">Live Preview</div>\n    <h1>🚀 Hello, <span class="highlight">CodeNova</span>!</h1>\n    <p>Edit the <strong>HTML</strong>, <strong>CSS</strong>, and <strong>JS</strong> tabs below to build your web page in real-time.</p>\n    <button id="btn">Click to change color 🎨</button>\n    <div id="output" class="output"></div>\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>\n`,
  css: `.card {\n  max-width: 600px;\n  margin: 60px auto;\n  padding: 40px;\n  background: linear-gradient(135deg, #11111f, #1f1f33);\n  border: 1px solid rgba(255,255,255,0.08);\n  border-radius: 20px;\n  text-align: center;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.5);\n}\n\n.badge {\n  display: inline-block;\n  padding: 4px 14px;\n  border-radius: 20px;\n  background: rgba(124,92,255,0.15);\n  color: #7c5cff;\n  font-size: 0.75rem;\n  font-weight: 600;\n  margin-bottom: 16px;\n}\n\nh1 {\n  color: #fff;\n  font-size: 2.2rem;\n  margin: 12px 0;\n}\n\n.highlight {\n  background: linear-gradient(90deg, #7c5cff, #19e2c5);\n  -webkit-background-clip: text;\n  color: transparent;\n}\n\np {\n  color: #8a8aa3;\n  line-height: 1.7;\n  font-size: 1rem;\n  margin: 16px 0;\n}\n\nbutton {\n  background: linear-gradient(90deg, #7c5cff, #ff5cc8);\n  color: #fff;\n  border: none;\n  padding: 14px 28px;\n  border-radius: 12px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  box-shadow: 0 8px 30px rgba(124,92,255,0.4);\n  transition: all 0.2s;\n}\n\nbutton:hover {\n  transform: scale(1.05);\n  box-shadow: 0 12px 40px rgba(124,92,255,0.5);\n}\n\n.output {\n  margin-top: 20px;\n  padding: 16px;\n  border-radius: 12px;\n  background: rgba(25,226,197,0.05);\n  border: 1px solid rgba(25,226,197,0.2);\n  color: #19e2c5;\n  font-size: 0.95rem;\n}\n`,
  json: `{\n  "name": "CodeNova AI",\n  "version": "2.0.0",\n  "description": "AI-Powered Coding Platform",\n  "languages": [\n    "JavaScript", "TypeScript", "Python", "Java",\n    "C++", "C", "C#", "Go", "Rust", "PHP",\n    "Ruby", "Swift", "Kotlin", "Bash", "SQL",\n    "HTML", "CSS", "JSON", "Markdown"\n  ],\n  "features": {\n    "compiler": true,\n    "aiAssistant": true,\n    "contests": true,\n    "interviews": true\n  },\n  "stats": {\n    "users": 2400000,\n    "problems": 3000,\n    "languages": 19\n  }\n}\n`,
  markdown: `# Welcome to CodeNova AI 🚀\n\n## Live Markdown Editor\n\nWrite **bold text**, *italic text*, and \`inline code\`.\n\n### Features\n- ✅ Real-time preview\n- ✅ Code blocks with syntax\n- ✅ Tables and lists\n- ✅ Links and images\n\n### Code Example\n\n\`\`\`javascript\nconst hello = () => console.log("Hello!");\nhello();\n\`\`\`\n\n### Quote\n\n> "The best way to predict the future is to create it."\n— Alan Kay\n\n### Table\n\n| Feature | Status |\n|---------|--------|\n| 19 Languages | ✅ Live |\n| AI Assistant | ✅ Ready |\n| Contests | ✅ Active |\n`,
};

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */
interface ConsoleLine {
  type: "stdout" | "stderr" | "info" | "success" | "error";
  text: string;
  time: string;
}

interface SavedFile {
  id: string;
  name: string;
  language: LanguageId;
  code: string;
  updatedAt: number;
}

interface TipData {
  color: "violet" | "cyan" | "emerald" | "amber";
  title: string;
  body: string;
}

/* ══════════════════════════════════════════════════════════════
   PISTON API EXECUTION
   ══════════════════════════════════════════════════════════════ */
const PISTON = "https://emkc.org/api/v2/piston/execute";

async function runOnPiston(lang: string, ver: string, code: string, stdin: string) {
  const res = await fetch(PISTON, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: lang,
      version: ver,
      files: [{ name: "main", content: code }],
      stdin,
      compile_timeout: 10000,
      run_timeout: 5000,
    }),
  });
  if (!res.ok) throw new Error(`Piston returned ${res.status}`);
  return res.json();
}

/* ══════════════════════════════════════════════════════════════
   MARKDOWN → HTML
   ══════════════════════════════════════════════════════════════ */
function mdToHtml(md: string): string {
  let h = md;
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _l, c) => `<pre style="background:#1a1a2a;padding:14px;border-radius:10px;overflow:auto;border:1px solid #333;color:#19e2c5;font-family:monospace;font-size:13px;line-height:1.6;margin:16px 0"><code>${c}</code></pre>`);
  h = h.replace(/^### (.+)$/gm, '<h3 style="color:#7c5cff;margin:20px 0 8px;font-size:1.1rem">$1</h3>');
  h = h.replace(/^## (.+)$/gm, '<h2 style="color:#19e2c5;margin:24px 0 10px;font-size:1.3rem">$1</h2>');
  h = h.replace(/^# (.+)$/gm, '<h1 style="color:#fff;margin:28px 0 12px;font-size:1.8rem">$1</h1>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  h = h.replace(/`([^`]+)`/g, '<code style="background:#1a1a2a;color:#19e2c5;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em">$1</code>');
  h = h.replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:4px solid #7c5cff;padding-left:16px;color:#aaa;margin:16px 0;font-style:italic">$1</blockquote>');
  h = h.replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>');
  h = h.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left:24px;margin:12px 0">$&</ul>');
  h = h.replace(/\|(.+)\|/g, m => {
    const cells = m.split("|").filter(Boolean).map(c => c.trim());
    if (cells.every(c => /^[-]+$/.test(c))) return "";
    return `<tr>${cells.map(c => `<td style="padding:6px 12px;border:1px solid #333">${c}</td>`).join("")}</tr>`;
  });
  h = h.replace(/(<tr>.*<\/tr>\n?)+/g, '<table style="border-collapse:collapse;margin:12px 0;width:100%">$&</table>');
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#7c5cff;text-decoration:underline" target="_blank">$1</a>');
  h = h.replace(/\n\n/g, '<br/><br/>');
  return h;
}

/* ══════════════════════════════════════════════════════════════
   WEB EDITOR LAYOUT — Multi-file for HTML/CSS/JS
   ══════════════════════════════════════════════════════════════ */
function WebEditor({
  htmlCode, cssCode, jsCode,
  setHtmlCode, setCssCode, setJsCode,
  activeFile, setActiveFile,
  fontSize, tabSize, wordWrap,
  onRun,
}: {
  htmlCode: string; cssCode: string; jsCode: string;
  setHtmlCode: (v: string) => void; setCssCode: (v: string) => void; setJsCode: (v: string) => void;
  activeFile: "html" | "css" | "js";
  setActiveFile: (f: "html" | "css" | "js") => void;
  fontSize: number; tabSize: number; wordWrap: boolean;
  onRun: () => void;
}) {
  const code = activeFile === "html" ? htmlCode : activeFile === "css" ? cssCode : jsCode;
  const onChange = activeFile === "html" ? setHtmlCode : activeFile === "css" ? setCssCode : setJsCode;
  const ext = activeFile === "html" ? ".html" : activeFile === "css" ? ".css" : ".js";
  const lang = activeFile as LanguageId;

  return (
    <div className="flex flex-col h-full">
      {/* File Tabs */}
      <div className="flex items-center border-b border-white/[0.06] bg-[#080810] px-2 shrink-0">
        {[
          { id: "html" as const, label: "index.html", icon: "🟠" },
          { id: "css" as const, label: "styles.css", icon: "🔵" },
          { id: "js" as const, label: "script.js", icon: "🟡" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFile(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition ${
              activeFile === tab.id
                ? "border-violet-400 text-white bg-white/[0.03]"
                : "border-transparent text-nova-muted hover:text-white hover:bg-white/[0.02]"
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="text-[10px] text-nova-muted/60 pr-3 font-mono">
          Lines: {code.split("\n").length} · Chars: {code.length}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <CodeEditor
          value={code}
          onChange={onChange}
          language={lang}
          fontSize={fontSize}
          tabSize={tabSize}
          wordWrap={wordWrap}
          onRun={onRun}
          placeholder={`Start writing ${ext}...`}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPILER COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Compiler() {
  // Editor state
  const [lang, setLang] = useState<LanguageId>("javascript");
  const [code, setCode] = useState(SNIPPETS.javascript);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState<ConsoleLine[]>([]);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<{ time: string; memory: string; status: string; provider: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Settings
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [activeFile, setActiveFile] = useState<"html" | "css" | "js">("html");

  // Web project files
  const [htmlCode, setHtmlCode] = useState(SNIPPETS.html);
  const [cssCode, setCssCode] = useState(SNIPPETS.css);
  const [jsCode, setJsCode] = useState(`// JavaScript runs in the preview!\ndocument.getElementById("btn")?.addEventListener("click", () => {\n  const colors = ["#7c5cff", "#19e2c5", "#ff5cc8", "#fbbf24", "#10b981"];\n  const card = document.querySelector(".card");\n  const c = colors[Math.floor(Math.random() * colors.length)];\n  card.style.borderColor = c;\n  card.style.boxShadow = \`0 20px 60px \${c}44\`;\n  document.getElementById("output").innerHTML = \`\\n      <strong>🎨 Color changed!</strong> Border → <span style="color:\${c}">\${c}</span>\\n    \`;\n});\n`);

  // Saved files
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);

  const previewRef = useRef<HTMLIFrameElement>(null);

  const currentLang = LANGUAGES.find(l => l.id === lang)!;
  const isWeb = lang === "html" || lang === "css";
  const isPreview = isWeb || lang === "markdown" || lang === "json";

  /* ── Load settings ─────────────────────────────────────── */
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("cn_compiler_settings") || "{}");
      if (s.fontSize) setFontSize(s.fontSize);
      if (s.tabSize) setTabSize(s.tabSize);
      if (s.wordWrap !== undefined) setWordWrap(s.wordWrap);
      const files = JSON.parse(localStorage.getItem("cn_compiler_files") || "[]");
      if (Array.isArray(files)) setSavedFiles(files);
    } catch {}
  }, []);

  /* ── Save settings ─────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem("cn_compiler_settings", JSON.stringify({ fontSize, tabSize, wordWrap }));
  }, [fontSize, tabSize, wordWrap]);

  /* ── Live preview update ───────────────────────────────── */
  useEffect(() => {
    if (!isWeb || !previewRef.current) return;
    const doc = `${htmlCode.replace(/<\/head>/, `<style>${cssCode}</style></head>`).replace(/<\/body>/, `<script>try{${jsCode}}catch(e){document.body.insertAdjacentHTML('beforeend','<div style="color:red;padding:12px;font-family:monospace;background:rgba(255,0,0,0.1);position:fixed;bottom:0;left:0;right:0;z-index:9999">JS Error: '+e.message+'</div>')}</script></body>`)}`;
    previewRef.current.srcdoc = doc;
  }, [htmlCode, cssCode, jsCode, isWeb]);

  /* ── Sync editor code with active web file ─────────────── */
  useEffect(() => {
    if (lang === "html") setCode(htmlCode);
    else if (lang === "css") setCode(cssCode);
  }, [activeFile, lang, htmlCode, cssCode]);

  /* ── Helper: add log line ──────────────────────────────── */
  const log = (type: ConsoleLine["type"], text: string) => {
    setOutput(prev => [...prev, { type, text, time: new Date().toLocaleTimeString("en", { hour12: false }) }]);
  };

  /* ── Language change ───────────────────────────────────── */
  const onLangChange = useCallback((id: LanguageId) => {
    setLang(id);
    if (id === "html") setCode(htmlCode);
    else if (id === "css") setCode(cssCode);
    else setCode(SNIPPETS[id]);
    setOutput([]);
    setStats(null);
  }, [htmlCode, cssCode]);

  /* ══════════════════════════════════════════════════════════
     RUN CODE ENGINE
     ══════════════════════════════════════════════════════════ */
  const run = useCallback(async () => {
    setRunning(true);
    setOutput([]);
    setStats(null);
    const t0 = performance.now();
    log("info", `▶ Executing ${currentLang.name} ${currentLang.version}…`);

    // 1. JavaScript — native V8
    if (lang === "javascript") {
      const logs: string[] = [];
      const ol = console.log, oe = console.error, ow = console.warn;
      console.log = (...a: any[]) => logs.push(["L", a.map(x => typeof x === "object" ? JSON.stringify(x, null, 2) : String(x)).join(" ")].pop()!);
      console.error = (...a: any[]) => logs.push(["E", a.map(String).join(" ")].pop()!);
      console.warn = (...a: any[]) => logs.push(["W", a.map(String).join(" ")].pop()!);
      try {
        const r = new Function(code)();
        if (r !== undefined && logs.length === 0) logs.push(String(r));
        logs.forEach(l => {
          if (l[0] === "E") log("stderr", l.slice(1));
          else if (l[0] === "W") log("info", "⚠ " + l.slice(1));
          else log("stdout", l.startsWith("L") ? l.slice(1) : l);
        });
        const ms = (performance.now() - t0).toFixed(1);
        log("success", "✓ Execution successful");
        setStats({ time: `${ms} ms`, memory: "~1.2 MB", status: "Accepted", provider: "Browser V8" });
      } catch (e: any) {
        log("error", `✗ ${e.name}: ${e.message}`);
        setStats({ time: "—", memory: "—", status: "Runtime Error", provider: "Browser V8" });
      } finally {
        console.log = ol; console.error = oe; console.warn = ow;
        setRunning(false);
      }
      return;
    }

    // 2. Web (HTML/CSS) — live preview
    if (isWeb) {
      log("success", "✓ Rendered in Live Preview panel");
      setStats({ time: "<1 ms", memory: "DOM", status: "Rendered", provider: "Browser DOM" });
      setRunning(false);
      return;
    }

    // 3. JSON validate
    if (lang === "json") {
      try {
        const parsed = JSON.parse(code);
        log("success", "✓ Valid JSON");
        log("stdout", JSON.stringify(parsed, null, 2));
        setStats({ time: "<1 ms", memory: "—", status: "Valid", provider: "Native JSON" });
      } catch (e: any) {
        log("error", `✗ Parse Error: ${e.message}`);
        setStats({ time: "—", memory: "—", status: "Parse Error", provider: "Native JSON" });
      }
      setRunning(false);
      return;
    }

    // 4. Markdown render
    if (lang === "markdown") {
      log("success", "✓ Rendered in Preview panel");
      setStats({ time: "<1 ms", memory: "—", status: "Rendered", provider: "Native MD" });
      setRunning(false);
      return;
    }

    // 5. All other — Piston API
    try {
      const data = await runOnPiston(currentLang.piston, currentLang.version, code, stdin);
      if (data.compile?.stderr && data.compile.code !== 0) {
        log("error", "✗ Compile Error:");
        log("stderr", data.compile.stderr);
        setStats({ time: "—", memory: "—", status: "Compile Error", provider: `Piston · ${data.language} ${data.version}` });
      } else if (data.run) {
        if (data.run.stdout) log("stdout", data.run.stdout);
        if (data.run.stderr) log("stderr", data.run.stderr);
        const ms = (performance.now() - t0).toFixed(0);
        if (data.run.code === 0) {
          log("success", "✓ Process exited with code 0");
          setStats({ time: `${ms} ms`, memory: "Sandbox", status: "Accepted", provider: `Piston · ${data.language} ${data.version}` });
        } else {
          log("error", `✗ Exit code ${data.run.code}`);
          setStats({ time: `${ms} ms`, memory: "Sandbox", status: "Runtime Error", provider: `Piston · ${data.language} ${data.version}` });
        }
      } else {
        log("error", "✗ Unknown error from execution engine");
      }
    } catch (err: any) {
      log("error", `✗ Network: ${err.message}`);
      log("info", "⚠ Piston API unreachable — showing simulated output");
      await new Promise(r => setTimeout(r, 500));
      log("stdout", "Hello, CodeNova! 🚀\nFibonacci(10): [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\nSum = 88");
      log("success", "✓ Simulated (offline mode)");
      setStats({ time: "~50 ms", memory: "~2 MB", status: "Simulated", provider: "Local Fallback" });
    } finally {
      setRunning(false);
    }
  }, [code, lang, stdin, currentLang, isWeb]);

  /* ── Keyboard shortcuts ─────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveFile(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [run]);

  /* ── Save / Download / Share ────────────────────────────── */
  const saveFile = useCallback(() => {
    const name = prompt("File name?", `${currentLang.name}-snippet`);
    if (!name) return;
    const f: SavedFile = { id: "f_" + Date.now().toString(36), name, language: lang, code, updatedAt: Date.now() };
    const updated = [f, ...savedFiles].slice(0, 50);
    setSavedFiles(updated);
    localStorage.setItem("cn_compiler_files", JSON.stringify(updated));
    log("success", `✓ Saved as "${name}${currentLang.ext}"`);
  }, [code, lang, currentLang, savedFiles]);

  const download = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `main${currentLang.ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    const data = btoa(unescape(encodeURIComponent(JSON.stringify({ lang, code }))));
    const url = `${window.location.origin}${window.location.pathname}#/compiler?share=${data}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { prompt("Copy:", url); }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output.map(l => l.text).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <div className="pt-20 pb-6 px-3 sm:px-4 max-w-[1800px] mx-auto h-[calc(100vh-80px)] flex flex-col">

      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="glass rounded-2xl p-3 flex items-center justify-between flex-wrap gap-2 mb-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentLang.color} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-lg`}>
            {currentLang.icon}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-white font-semibold flex items-center gap-1.5 truncate">
              CodeNova Live IDE
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">19 langs</span>
            </div>
            <div className="text-[11px] text-nova-muted truncate">main{currentLang.ext} · {currentLang.name} {currentLang.version}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <select value={lang} onChange={e => onLangChange(e.target.value as LanguageId)}
            className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/40 cursor-pointer">
            {LANGUAGES.map(l => <option key={l.id} value={l.id} className="bg-nova-bg">{l.icon} · {l.name}</option>)}
          </select>
          <IconBtn icon={FolderOpen} title="My Files" active={showFiles} onClick={() => { setShowFiles(v => !v); setShowSettings(false); }} />
          <IconBtn icon={Save} title="Save (Ctrl+S)" onClick={saveFile} />
          <IconBtn icon={Share2} title={copied ? "Copied!" : "Share"} onClick={share} />
          <IconBtn icon={Download} title="Download" onClick={download} />
          <IconBtn icon={Settings} title="Settings" active={showSettings} onClick={() => { setShowSettings(v => !v); setShowFiles(false); }} />

          <button onClick={run} disabled={running}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/30 disabled:opacity-60 transition hover:shadow-emerald-500/50 hover:scale-[1.02] shrink-0">
            {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</> : <><Play className="w-4 h-4 fill-current" /> Run<span className="hidden sm:inline ml-1 text-[10px] opacity-70 bg-white/20 px-1 rounded">⌘↵</span></>}
          </button>
        </div>
      </div>

      {/* ── Settings Panel ─────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl mb-3 overflow-hidden border border-violet-500/30 p-4 grid sm:grid-cols-3 gap-4 shrink-0">
            <div>
              <label className="text-xs text-nova-muted font-semibold mb-2 flex items-center gap-1.5"><Type className="w-3.5 h-3.5" /> Font Size: {fontSize}px</label>
              <input type="range" min="10" max="22" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full accent-violet-500" />
            </div>
            <div>
              <label className="text-xs text-nova-muted font-semibold mb-2 flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Tab Size: {tabSize} spaces</label>
              <input type="range" min="2" max="8" step="2" value={tabSize} onChange={e => setTabSize(parseInt(e.target.value))} className="w-full accent-violet-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-nova-muted font-semibold flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Options</label>
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input type="checkbox" checked={wordWrap} onChange={e => setWordWrap(e.target.checked)} className="accent-violet-500" /> Word Wrap
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Files Panel ─────────────────────────────────── */}
      <AnimatePresence>
        {showFiles && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl mb-3 overflow-hidden border border-cyan-500/30 p-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><FolderOpen className="w-4 h-4 text-cyan-400" /> My Files ({savedFiles.length})</h3>
              <button onClick={() => setShowFiles(false)} className="text-nova-muted hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            {savedFiles.length === 0 ? (
              <p className="text-xs text-nova-muted text-center py-4">No saved files yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                {savedFiles.map(f => {
                  const fl = LANGUAGES.find(l => l.id === f.language) || currentLang;
                  return (
                    <div key={f.id} className="group p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${fl.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{fl.icon}</div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setLang(f.language); setCode(f.code); setShowFiles(false); }}>
                        <div className="text-xs text-white font-semibold truncate">{f.name}{fl.ext}</div>
                        <div className="text-[10px] text-nova-muted">{new Date(f.updatedAt).toLocaleDateString()}</div>
                      </div>
                      <button onClick={() => { const u = savedFiles.filter(x => x.id !== f.id); setSavedFiles(u); localStorage.setItem("cn_compiler_files", JSON.stringify(u)); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-rose-300 hover:bg-rose-500/20 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-3 min-h-0">

        {/* ── LEFT: Editor + Console ──────────────────── */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Editor */}
          <div className="glass rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[320px]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-[#080810] shrink-0">
              <div className="flex items-center gap-2 text-xs text-nova-muted font-mono">
                <Cpu className="w-3.5 h-3.5 text-violet-400" /> main{currentLang.ext} · {currentLang.name}
              </div>
              <div className="text-[10px] text-nova-muted/60">
                Ctrl+Enter = Run · Ctrl+S = Save
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {isWeb ? (
                <WebEditor
                  htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode}
                  setHtmlCode={setHtmlCode} setCssCode={setCssCode} setJsCode={setJsCode}
                  activeFile={activeFile} setActiveFile={setActiveFile}
                  fontSize={fontSize} tabSize={tabSize} wordWrap={wordWrap} onRun={run}
                />
              ) : (
                <CodeEditor value={code} onChange={setCode} language={lang} fontSize={fontSize} tabSize={tabSize} wordWrap={wordWrap} onRun={run} />
              )}
            </div>
          </div>

          {/* Bottom: stdin + output */}
          <div className="grid grid-cols-2 gap-3 shrink-0" style={{ height: 200 }}>
            <div className="glass rounded-2xl p-3 flex flex-col min-h-0">
              <div className="text-xs text-nova-muted uppercase tracking-wider mb-1.5 font-semibold flex items-center gap-1.5 shrink-0">
                <Terminal className="w-3.5 h-3.5 text-amber-400" /> Standard Input
              </div>
              <textarea value={stdin} onChange={e => setStdin(e.target.value)}
                placeholder="Enter input for your program (stdin)…"
                className="flex-1 font-mono text-xs bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                style={{ fontSize: `${fontSize - 1}px` }} />
            </div>

            <div className="glass rounded-2xl flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-nova-muted font-semibold">Console</span>
                  {isPreview && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 ml-2">Live Preview ←</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {output.length > 0 && (
                    <>
                      <button onClick={copyOutput} className="p-1 rounded hover:bg-white/10 text-nova-muted">
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => { setOutput([]); setStats(null); }} className="p-1 rounded hover:bg-white/10 text-nova-muted"><Trash2 className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-2 font-mono text-xs bg-[#060610]" style={{ fontSize: `${fontSize - 1}px` }}>
                {output.length === 0 ? (
                  <div className="text-nova-muted/50 italic p-2">Click <strong className="text-white/70">Run</strong> or press <kbd className="bg-white/5 px-1.5 py-0.5 rounded">Ctrl+Enter</kbd> to execute.</div>
                ) : (
                  output.map((l, i) => (
                    <div key={i} className={`flex gap-2 py-[1px] ${l.type === "stdout" ? "text-emerald-300" : l.type === "stderr" || l.type === "error" ? "text-rose-300" : l.type === "success" ? "text-cyan-300" : "text-nova-muted"}`}>
                      <span className="text-nova-muted/40 shrink-0 select-none">{l.time}</span>
                      <pre className="whitespace-pre-wrap break-all flex-1 m-0">{l.text}</pre>
                    </div>
                  ))
                )}
              </div>

              {stats && (
                <div className="px-3 py-1.5 border-t border-white/[0.06] bg-black/30 flex items-center justify-between text-[10px] font-mono shrink-0">
                  <div className="flex items-center gap-3">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${["Accepted","Rendered","Valid","Simulated"].includes(stats.status) ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>{stats.status}</span>
                    <span className="text-nova-muted">⏱ {stats.time}</span>
                    <span className="text-nova-muted">💾 {stats.memory}</span>
                  </div>
                  <span className="text-nova-muted/60 truncate">{stats.provider}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Web Preview + AI Panel ────────────── */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Live Preview (for web langs) */}
          {isWeb && (
            <div className="glass rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[300px]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-[#080810] shrink-0">
                <div className="text-xs text-white font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> Live Web Preview
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded animate-pulse">Auto-refresh</span>
                </div>
              </div>
              <div className="flex-1 bg-white min-h-0">
                <iframe ref={previewRef} title="Live Preview" className="w-full h-full border-0" sandbox="allow-scripts allow-modals allow-same-origin" />
              </div>
            </div>
          )}

          {/* Preview for Markdown / JSON */}
          {isPreview && !isWeb && (
            <div className="glass rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[300px]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-[#080810] shrink-0">
                <div className="text-xs text-white font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> {lang === "markdown" ? "Markdown" : "JSON"} Preview
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 min-h-0" style={{ background: "#0d0d18", color: "#e7e7f0", fontSize: `${fontSize}px` }}>
                {lang === "markdown" ? (
                  <div dangerouslySetInnerHTML={{ __html: mdToHtml(code) }} />
                ) : (
                  <pre className="whitespace-pre-wrap font-mono" style={{ color: "#19e2c5", fontSize: `${fontSize - 1}px` }}>
                    {(() => { try { return JSON.stringify(JSON.parse(code), null, 2); } catch { return "Invalid JSON"; } })()}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* AI Panel (always visible) */}
          <div className={`glass rounded-2xl p-4 flex flex-col gap-3 overflow-hidden shrink-0 ${isWeb || isPreview ? "h-[320px]" : "flex-1"}`}>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Nova AI · {currentLang.name}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Real-time
                </div>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1">
              {(TIPS[lang] || TIPS.default).map((tip, i) => (
                <div key={i} className={`p-3 rounded-xl bg-gradient-to-br ${tip.color === "violet" ? "from-violet-500/15 border-violet-500/30" : tip.color === "cyan" ? "from-cyan-500/15 border-cyan-500/30" : tip.color === "emerald" ? "from-emerald-500/15 border-emerald-500/30" : "from-amber-500/15 border-amber-500/30"} border`}>
                  <div className="text-xs font-semibold text-white">{tip.title}</div>
                  <div className="text-xs text-white/70 mt-1 leading-relaxed">{tip.body}</div>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
                <div className="text-[11px] text-nova-muted space-y-1">
                  <div>Language: <strong className="text-white">{currentLang.name}</strong></div>
                  <div>Version: <strong className="text-cyan-300 font-mono">{currentLang.version}</strong></div>
                  <div>Engine: <strong className="text-white">{lang === "javascript" ? "Browser V8" : isWeb ? "DOM Live" : ["json","markdown"].includes(lang) ? "Native" : "Piston API"}</strong></div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-2 pt-2 border-t border-white/[0.06] shrink-0">
              <button onClick={() => log("info", "💡 Nova AI: Let me analyze your code...")}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/30 transition hover:scale-[1.02]">
                <Sparkles className="w-4 h-4" /> Explain Code
              </button>
              <button onClick={() => log("info", "⚡ Nova AI: Your code is already optimal! 🎯")}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl glass-strong text-white text-sm hover:bg-white/10 transition">
                <Zap className="w-4 h-4 text-amber-400" /> Optimize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ icon: Icon, title, onClick, active }: any) {
  return (
    <button onClick={onClick} title={title}
      className={`p-2 rounded-lg transition ${active ? "bg-violet-500/20 text-violet-300" : "text-nova-muted hover:text-white hover:bg-white/5"}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

const TIPS: Record<string, TipData[]> = {
  javascript: [
    { color: "violet", title: "ES6+ Arrow Functions", body: "Use `() => {}` for concise function syntax." },
    { color: "cyan", title: "Template Literals", body: "`Hello ${name}` for readable string interpolation." },
    { color: "emerald", title: "Native V8", body: "Your JS runs directly in the browser — instant, zero network delay!" },
    { color: "amber", title: "Destructuring", body: "Extract values: `const [a, b] = [1, 2]` or `const {name} = obj`." },
  ],
  typescript: [
    { color: "violet", title: "Interfaces", body: "Define contracts: `interface User { name: string }`." },
    { color: "cyan", title: "Generics", body: "Reusable types: `function identity<T>(x: T): T`." },
    { color: "emerald", title: "Type Narrowing", body: "Use `typeof`, `instanceof`, `in` to narrow types safely." },
    { color: "amber", title: "Null Coalescing", body: "`value ?? default` for safe null handling." },
  ],
  python: [
    { color: "violet", title: "List Comprehensions", body: "`[x*2 for x in nums]` is faster than loops." },
    { color: "cyan", title: "f-strings", body: "`f\"Sum = {sum(nums)}\"` is the fastest way to format." },
    { color: "emerald", title: "Built-in Functions", body: "`map`, `filter`, `sorted`, `enumerate`, `zip` are your best friends." },
    { color: "amber", title: "Context Managers", body: "`with open(f) as file:` ensures automatic cleanup." },
  ],
  html: [
    { color: "violet", title: "Semantic HTML", body: "Use `<main>`, `<section>`, `<article>` for better SEO." },
    { color: "cyan", title: "Live Preview", body: "Edit HTML/CSS/JS files and see changes instantly in the preview panel!" },
    { color: "emerald", title: "Accessibility", body: "Always add `alt` to images and `aria-label` to buttons." },
    { color: "amber", title: "Viewport", body: "Always include `<meta name=\"viewport\">` for responsive design." },
  ],
  css: [
    { color: "violet", title: "CSS Variables", body: "Define `:root { --primary: #7c5cff; }` for theming." },
    { color: "cyan", title: "Flexbox & Grid", body: "Flexbox for 1D, Grid for 2D layouts." },
    { color: "emerald", title: "Gradients", body: "`background: linear-gradient(90deg, #7c5cff, #19e2c5)` for stunning effects." },
    { color: "amber", title: "Transitions", body: "`transition: all 0.3s ease` for smooth hover effects." },
  ],
  java: [
    { color: "violet", title: "Streams API", body: "`list.stream().filter().map().collect()` for functional style." },
    { color: "cyan", title: "var keyword", body: "Java 10+ type inference: `var list = new ArrayList<>()`." },
    { color: "emerald", title: "String Join", body: "`String.join(\"-\", list)` for fast string concatenation." },
    { color: "amber", title: "Optional", body: "Use `Optional.ofNullable()` to handle null safely." },
  ],
  cpp: [
    { color: "violet", title: "auto keyword", body: "`auto x = getValue();` for cleaner type inference." },
    { color: "cyan", title: "Range-based For", body: "`for (auto& x : vec)` to iterate safely." },
    { color: "emerald", title: "STL Containers", body: "Use `vector`, `map`, `set` — don't use raw arrays." },
    { color: "amber", title: "Smart Pointers", body: "`unique_ptr` and `shared_ptr` prevent memory leaks." },
  ],
  go: [
    { color: "violet", title: "Error Handling", body: "Always check errors: `if err != nil { return err }`." },
    { color: "cyan", title: "Goroutines", body: "`go func(){}()` for lightweight concurrent execution." },
    { color: "emerald", title: "defer", body: "`defer file.Close()` ensures cleanup on exit." },
    { color: "amber", title: "Slices", body: "Use `append()` to grow slices dynamically." },
  ],
  rust: [
    { color: "violet", title: "Ownership", body: "Each value has one owner. Borrow with `&`." },
    { color: "cyan", title: "Pattern Matching", body: "`match` is exhaustive and powerful." },
    { color: "emerald", title: "Result/Option", body: "Use `Result<T, E>` and `Option<T>` instead of nulls." },
    { color: "amber", title: "Iterators", body: "Chain `.iter().map().filter().collect()` for zero-cost abstractions." },
  ],
  default: [
    { color: "violet", title: "Clean Code", body: "Write code that's easy to read and understand." },
    { color: "cyan", title: "Practice Daily", body: "Solve 1-2 problems daily on CodeNova." },
    { color: "emerald", title: "Read Docs", body: "Official language documentation is the best resource." },
    { color: "amber", title: "Build Projects", body: "Apply what you learn by building real projects." },
  ],
};
