import { useEffect, useRef, useCallback, useMemo, memo } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  language?: string;
  fontSize?: number;
  tabSize?: number;
  wordWrap?: boolean;
  placeholder?: string;
  onRun?: () => void;
  onSave?: () => void;
}

// Compact keyword lists — top 50 per language for perf
const KW: Record<string, string[]> = {
  python: ["def","class","return","if","else","elif","for","while","in","not","and","or","import","from","as","with","try","except","finally","raise","lambda","yield","pass","break","continue","True","False","None","self","print","len","range","int","str","float","list","dict","tuple","set"],
  javascript: ["function","const","let","var","return","if","else","for","while","do","switch","case","break","continue","new","class","extends","import","from","export","default","true","false","null","undefined","async","await","try","catch","throw","typeof","this","of","in","console","Math","JSON"],
  typescript: ["function","const","let","var","return","if","else","for","while","do","switch","case","break","continue","new","class","extends","implements","import","from","export","default","true","false","null","undefined","async","await","try","catch","throw","interface","type","enum","string","number","boolean","any","void","never","public","private","protected","static","readonly"],
  html: ["!DOCTYPE","html","head","body","div","span","a","p","h1","h2","h3","h4","h5","h6","button","input","form","script","style","link","meta","title","nav","header","footer","main","section","article","ul","ol","li","table","tr","td","th","img","svg","br","hr","label","select","option","textarea","iframe","canvas"],
  css: ["@import","@media","@keyframes","@font-face","@supports","root","!important","px","em","rem","vh","vw","deg"],
  cpp: ["int","double","float","char","void","long","short","bool","auto","const","static","return","if","else","for","while","do","switch","case","break","continue","class","struct","public","private","protected","namespace","using","include","true","false","nullptr","new","delete","this","template","typename","cout","cin","endl","string","vector"],
  c: ["int","double","float","char","void","long","short","const","static","return","if","else","for","while","do","switch","case","break","continue","struct","typedef","sizeof","include","printf","scanf","true","false","NULL"],
  csharp: ["using","namespace","class","interface","struct","enum","public","private","protected","internal","static","void","string","int","double","float","bool","var","new","return","if","else","for","while","foreach","in","do","switch","case","break","continue","try","catch","finally","throw","true","false","null","Console","async","await"],
  java: ["public","private","protected","class","interface","extends","implements","static","final","void","int","double","float","char","boolean","long","short","return","if","else","for","while","do","switch","case","break","continue","new","this","super","true","false","null","import","package","try","catch","throw","throws","String","System"],
  go: ["func","var","const","type","struct","interface","package","import","return","if","else","for","range","switch","case","break","continue","go","defer","chan","map","true","false","nil","fmt","string","int","make","append","len","cap"],
  rust: ["fn","let","mut","const","static","struct","enum","trait","impl","pub","use","mod","return","if","else","for","while","loop","match","in","true","false","self","Self","as","println","String","i32","u32","u64","Vec","Option","Some","None","Result","Ok","Err","Box"],
  php: ["function","class","interface","trait","extends","implements","public","private","protected","static","abstract","final","var","return","if","else","elseif","for","foreach","while","do","switch","case","break","continue","new","this","true","false","null","echo","print","require","include","use","namespace","try","catch","throw","array"],
  ruby: ["def","class","module","end","do","if","elsif","else","unless","case","when","while","until","for","in","return","yield","begin","rescue","ensure","raise","true","false","nil","self","require","puts","print"],
  swift: ["func","var","let","class","struct","enum","protocol","extension","public","private","fileprivate","internal","static","return","if","else","for","while","switch","case","break","continue","in","true","false","nil","self","import","guard","defer","throw","try","catch","do","as","is","Int","String","Double","Bool","print"],
  kotlin: ["fun","val","var","class","interface","object","data","sealed","open","abstract","override","public","private","protected","internal","return","if","else","for","while","when","in","true","false","null","this","import","package","try","catch","finally","throw","Int","String","Double","Boolean","println"],
  bash: ["if","then","else","elif","fi","for","in","do","done","while","case","esac","function","return","exit","break","continue","echo","read","export","local","source","alias","cd","ls","grep","awk","sed","find","cat","sort","uniq","wc"],
  sql: ["SELECT","FROM","WHERE","INSERT","INTO","UPDATE","DELETE","CREATE","TABLE","DROP","ALTER","INDEX","JOIN","INNER","LEFT","RIGHT","OUTER","ON","GROUP","BY","ORDER","HAVING","LIMIT","OFFSET","AS","AND","OR","NOT","IN","LIKE","BETWEEN","NULL","IS","DISTINCT","COUNT","SUM","AVG","MIN","MAX","PRIMARY","KEY","VALUES","SET","DEFAULT","UNIQUE","CHECK","CASCADE","INTEGER","TEXT","REAL"],
};

function esc(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "&") out += "&amp;";
    else if (c === "<") out += "&lt;";
    else if (c === ">") out += "&gt;";
    else if (c === '"') out += "&quot;";
    else out += c;
  }
  return out;
}

// FAST tokenizer — single pass, O(n), no regex backtracks
function tokenize(src: string, lang: string): string {
  const kws = KW[lang] || [];
  const isSql = lang === "sql";
  const isCss = lang === "css";

  let out = "";
  let i = 0;
  const len = src.length;

  while (i < len) {
    const c = src[i];

    // Space / tab — pass through quickly
    if (c === " " || c === "\t") {
      out += c; i++;
      continue;
    }

    // Comment: // (JS/TS/C/C++/Java/C#/Go/Rust)
    if (c === "/" && i + 1 < len && src[i + 1] === "/") {
      const start = i;
      while (i < len && src[i] !== "\n") i++;
      out += `<span class="token-com">${esc(src.slice(start, i))}</span>`;
      continue;
    }

    // Comment: /* */
    if (c === "/" && i + 1 < len && src[i + 1] === "*") {
      const start = i;
      i += 2;
      while (i + 1 < len && !(src[i] === "*" && src[i + 1] === "/")) i++;
      if (i + 1 < len) i += 2;
      else i = len;
      out += `<span class="token-com">${esc(src.slice(start, i))}</span>`;
      continue;
    }

    // Comment: # (Python, Ruby, Bash)
    if (c === "#" && !/[a-zA-Z]/.test(src[i + 1] || "") && src[i + 1] !== "{") {
      const start = i;
      while (i < len && src[i] !== "\n") i++;
      out += `<span class="token-com">${esc(src.slice(start, i))}</span>`;
      continue;
    }
    // But CSS #id selectors (next char is alphanumeric)
    if (c === "#" && isCss && /[a-zA-Z]/.test(src[i + 1] || "")) {
      out += "#"; i++;
      while (i < len && /[a-zA-Z0-9\-_]/.test(src[i])) out += src[i++];
      continue;
    }

    // Comment: -- (SQL)
    if (c === "-" && i + 1 < len && src[i + 1] === "-" && isSql) {
      const start = i;
      while (i < len && src[i] !== "\n") i++;
      out += `<span class="token-com">${esc(src.slice(start, i))}</span>`;
      continue;
    }

    // String: "..." or '...'
    if (c === '"' || c === "'") {
      const q = c;
      const start = i;
      i++;
      while (i < len && src[i] !== q) {
        if (src[i] === "\\" && i + 1 < len) i++;
        i++;
      }
      if (i < len) i++;
      out += `<span class="token-str">${esc(src.slice(start, i))}</span>`;
      continue;
    }

    // Template literal: `...`
    if (c === "`") {
      const start = i;
      i++;
      while (i < len && src[i] !== "`") {
        if (src[i] === "\\" && i + 1 < len) i++;
        i++;
      }
      if (i < len) i++;
      out += `<span class="token-str">${esc(src.slice(start, i))}</span>`;
      continue;
    }

    // Number
    if ((c >= "0" && c <= "9") && (i === 0 || /[\s({[+\-*/<=>!&|^~,;:]/.test(src[i - 1] || " "))) {
      const start = i;
      while (i < len && /[\d.eE+\-xboXOa-fA-F_]/.test(src[i])) i++;
      const num = src.slice(start, i);
      if (/^0[xboXO]/i.test(num) || /^\d+(\.\d+)?([eE][+\-]?\d+)?/.test(num)) {
        out += `<span class="token-num">${esc(num)}</span>`;
        continue;
      }
      // Not a valid number, just plain text
      out += esc(num);
      continue;
    }

    // Word / Identifier
    if (/[a-zA-Z_$]/.test(c)) {
      const start = i;
      while (i < len && /[a-zA-Z0-9_$]/.test(src[i])) i++;
      const word = src.slice(start, i);
      const nextChar = src[i] || "";

      if (kws.includes(word)) {
        out += `<span class="token-kw">${esc(word)}</span>`;
      } else if (nextChar === "(") {
        out += `<span class="token-fn">${esc(word)}</span>`;
      } else {
        out += esc(word);
      }
      continue;
    }

    // Operator
    if ("+-*/%=<>!&|^~?:.".includes(c)) {
      const start = i;
      while (i < len && "+-*/%=<>!&|^~?:.".includes(src[i])) i++;
      out += `<span class="token-op">${esc(src.slice(start, i))}</span>`;
      continue;
    }

    // Everything else
    out += esc(c);
    i++;
  }

  return out;
}

export const CodeEditor = memo(function CodeEditor({
  value, onChange, language = "javascript", fontSize = 14, tabSize = 2,
  wordWrap = false, placeholder = "Start coding...", onRun, onSave,
}: Props) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lnRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => Math.max(value.split("\n").length, 1), [value]);
  const html = useMemo(() => tokenize(value, language), [value, language]);

  // Scroll sync
  const sync = useCallback(() => {
    const ta = textRef.current;
    if (!ta) return;
    if (preRef.current) { preRef.current.scrollTop = ta.scrollTop; preRef.current.scrollLeft = ta.scrollLeft; }
    if (lnRef.current) { lnRef.current.scrollTop = ta.scrollTop; }
  }, []);

  useEffect(() => {
    const ta = textRef.current; if (!ta) return;
    ta.addEventListener("scroll", sync, { passive: true });
    return () => ta.removeEventListener("scroll", sync);
  }, [sync]);

  const onKey = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const sp = " ".repeat(tabSize);

    if (e.key === "Tab") {
      e.preventDefault();
      const s = ta.selectionStart, d = ta.selectionEnd;
      if (e.shiftKey) {
        const ls = value.lastIndexOf("\n", s - 1) + 1;
        const pfx = value.slice(ls, ls + tabSize);
        if (pfx === sp) {
          onChange(value.slice(0, ls) + value.slice(ls + tabSize));
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = Math.max(ls, s - tabSize); });
        }
      } else {
        onChange(value.slice(0, s) + sp + value.slice(d));
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + tabSize; });
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const s = ta.selectionStart;
      const ls = value.lastIndexOf("\n", s - 1) + 1;
      const cur = value.slice(ls, s);
      const indent = (cur.match(/^\s*/)?.[0]) || "";
      const lc = cur.trimEnd().slice(-1);
      const extra = ["{", "(", "["].includes(lc) ? sp : "";
      onChange(value.slice(0, s) + "\n" + indent + extra + value.slice(ta.selectionEnd));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 1 + indent.length + extra.length; });
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); onSave?.(); }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); onRun?.(); }
  }, [value, onChange, tabSize, onRun, onSave]);

  const ws: React.CSSProperties = wordWrap
    ? { whiteSpace: "pre-wrap" as const, overflowWrap: "break-word" as const }
    : { whiteSpace: "pre" as const };

  return (
    <div className="relative w-full h-full bg-[#080810] select-none" style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace", fontSize: `${fontSize}px`, lineHeight: 1.7, tabSize: tabSize, MozTabSize: String(tabSize) }}>
      {/* Line numbers */}
      <div ref={lnRef} className="absolute top-0 left-0 bottom-0 overflow-hidden w-[52px] bg-[#080810] border-r border-white/[0.05] z-10 py-3 text-right" style={{ color: "rgba(138,138,163,0.4)" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="pr-3 pl-1 select-none" style={{ lineHeight: 1.7 }}>{i + 1}</div>
        ))}
      </div>

      {/* Code area */}
      <div className="absolute top-0 left-[52px] right-0 bottom-0">
        {/* Highlight layer — behind textarea */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 m-0 py-3 px-4 overflow-auto pointer-events-none border-0 outline-none text-white"
          style={{ fontFamily: "inherit", ...ws }}
          dangerouslySetInnerHTML={{ __html: html + (value.endsWith("\n") ? "\n" : "") }}
        />
        {/* Editable textarea — on top, transparent text */}
        <textarea
          ref={textRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none border-0 m-0 py-3 px-4 overflow-auto"
          style={{ color: "transparent", caretColor: "#a78bfa", fontFamily: "inherit", ...ws }}
        />
      </div>
    </div>
  );
});
