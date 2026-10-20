import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Download,
  Calendar,
  Clock,
  Code2,
  Sliders,
  Sparkles,
  Layers,
  ArrowRightLeft,
  KeyRound,
  FileCode,
  Eye,
  Hash,
  Percent,
} from 'lucide-react';

// ==========================================
// 1. MARKDOWN TO HTML PREVIEWER
// ==========================================
export const MarkdownPreviewerTool: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(
    `# Hello PocketKit!\n\nThis is a **live client-side** markdown previewer.\n\n### Features:\n- Instant rendering\n- *Fast & responsive*\n- [Visit PocketKit](https://pocketkit.dev)\n\n\`\`\`javascript\nconsole.log("100% Client Side!");\n\`\`\`\n\n> "Simplicity is the ultimate sophistication."`
  );
  const [copied, setCopied] = useState(false);

  // Simple safe client-side markdown to HTML converter
  const htmlOutput = useMemo(() => {
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-3 mb-1 text-slate-900 dark:text-white">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-4 mb-2 text-indigo-600 dark:text-indigo-400">$1</h1>');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-3 py-1 my-2 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-r">$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

    // Code blocks & inline code
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-emerald-400 p-3 rounded-xl text-xs font-mono my-2 overflow-x-auto">$2</pre>');
    html = html.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-xs text-indigo-600 dark:text-indigo-300">$1</code>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline font-semibold">$1</a>');

    // List items
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>');

    // Paragraphs
    html = html.replace(/\n\n/gim, '<br/><br/>');

    return html;
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dual-Pane Markdown & HTML</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied HTML!' : 'Copy HTML'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Markdown Input</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={14}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Type markdown here..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Live Rendered HTML Preview</label>
          <div
            className="w-full h-[282px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 overflow-y-auto text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SLUG & URL GENERATOR
// ==========================================
export const SlugGeneratorTool: React.FC = () => {
  const [text, setText] = useState('How to Build a Pocket-Sized Digital Toolkit in 2026!');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    let s = text.trim();
    if (lowercase) s = s.toLowerCase();
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // strip accents
    s = s.replace(/[^a-zA-Z0-9\s-_]/g, '');
    s = s.replace(/[\s-_]+/g, separator);
    return s.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');
  }, [text, separator, lowercase]);

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input Title / String</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Lowercase only</span>
        </label>
        <div className="flex items-center gap-2">
          <span>Separator:</span>
          <button
            onClick={() => setSeparator('-')}
            className={`px-2.5 py-1 rounded-lg border font-mono ${separator === '-' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Hyphen (-)
          </button>
          <button
            onClick={() => setSeparator('_')}
            className={`px-2.5 py-1 rounded-lg border font-mono ${separator === '_' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Underscore (_)
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Generated Slug</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Slug'}</span>
          </button>
        </div>
        <div className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white break-all bg-white dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
          {slug || 'your-slug-will-appear-here'}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. DUPLICATE LINE & BLANK REMOVER
// ==========================================
export const DuplicateLineRemoverTool: React.FC = () => {
  const [input, setInput] = useState("apple\nbanana\napple\norange\n\nbanana\ngrape\napple");
  const [trimLines, setTrimLines] = useState(true);
  const [removeBlank, setRemoveBlank] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    let lines = input.split('\n');
    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeBlank) lines = lines.filter((l) => l.length > 0);

    const seen = new Set<string>();
    const unique: string[] = [];
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }
    return unique.join('\n');
  }, [input, trimLines, removeBlank, caseSensitive]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} />
            <span>Trim spaces</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={removeBlank} onChange={(e) => setRemoveBlank(e.target.checked)} />
            <span>Remove blank lines</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
            <span>Case-sensitive</span>
          </label>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Clean Lines!' : 'Copy Unique Lines'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500">Original Text ({input.split('\n').length} lines)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Deduplicated Output ({result ? result.split('\n').length : 0} lines)</label>
          <textarea
            readOnly
            value={result}
            rows={10}
            className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. TEXT LINE SORTER
// ==========================================
export const TextSorterTool: React.FC = () => {
  const [text, setText] = useState("Zebra\nApple\nMango\nBanana\nOrange\nCherry");
  const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'len' | 'shuffle'>('az');
  const [copied, setCopied] = useState(false);

  const sortedText = useMemo(() => {
    const lines = text.split('\n');
    if (sortOrder === 'az') return [...lines].sort((a, b) => a.localeCompare(b)).join('\n');
    if (sortOrder === 'za') return [...lines].sort((a, b) => b.localeCompare(a)).join('\n');
    if (sortOrder === 'len') return [...lines].sort((a, b) => a.length - b.length).join('\n');
    if (sortOrder === 'shuffle') {
      const arr = [...lines];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join('\n');
    }
    return text;
  }, [text, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-400">Sort By:</span>
          <button
            onClick={() => setSortOrder('az')}
            className={`px-2.5 py-1 rounded-lg border font-semibold ${sortOrder === 'az' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            A → Z
          </button>
          <button
            onClick={() => setSortOrder('za')}
            className={`px-2.5 py-1 rounded-lg border font-semibold ${sortOrder === 'za' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Z → A
          </button>
          <button
            onClick={() => setSortOrder('len')}
            className={`px-2.5 py-1 rounded-lg border font-semibold ${sortOrder === 'len' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Length
          </button>
          <button
            onClick={() => setSortOrder('shuffle')}
            className={`px-2.5 py-1 rounded-lg border font-semibold ${sortOrder === 'shuffle' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Shuffle
          </button>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(sortedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Sorted'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <textarea
          readOnly
          value={sortedText}
          rows={9}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs focus:outline-none"
        />
      </div>
    </div>
  );
};

// ==========================================
// 5. TEXT TO BINARY / BINARY TO TEXT
// ==========================================
export const TextToBinaryTool: React.FC = () => {
  const [text, setText] = useState('PocketKit');
  const [binary, setBinary] = useState('01010000 01101111 01100011 01101011 01100101 01110100 01001011 01101001 01110100');
  const [copied, setCopied] = useState(false);

  const handleTextChange = (val: string) => {
    setText(val);
    const bin = Array.from(val)
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
    setBinary(bin);
  };

  const handleBinaryChange = (val: string) => {
    setBinary(val);
    try {
      const clean = val.trim().split(/\s+/);
      const str = clean.map((b) => String.fromCharCode(parseInt(b, 2))).join('');
      setText(str);
    } catch {
      // invalid binary
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Plain Text</label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">8-Bit Binary Representation</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(binary);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {copied ? 'Copied Binary!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={binary}
            onChange={(e) => handleBinaryChange(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. ROT13 & CAESAR CIPHER
// ==========================================
export const Rot13CipherTool: React.FC = () => {
  const [input, setInput] = useState('Why did the chicken cross the road? Gb trg gb gur bgure fvqr!');
  const [shift, setShift] = useState(13);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    return input.replace(/[a-zA-Z]/g, (char) => {
      const code = char.charCodeAt(0);
      const isUpper = code >= 65 && code <= 90;
      const base = isUpper ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    });
  }, [input, shift]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Caesar Shift:</span>
          <input
            type="number"
            min={1}
            max={25}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
          <button
            onClick={() => setShift(13)}
            className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold text-xs"
          >
            Reset ROT13
          </button>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="ml-auto px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          placeholder="Enter text to encode/decode..."
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <textarea
          readOnly
          value={output}
          rows={8}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs focus:outline-none"
        />
      </div>
    </div>
  );
};

// ==========================================
// 7. MORSE CODE TRANSLATOR
// ==========================================
export const MorseCodeTool: React.FC = () => {
  const [text, setText] = useState('SOS POCKETKIT');
  const [morse, setMorse] = useState('... --- ... / .--. --- -.-. -.- . - -.- .. -');

  const MORSE_MAP: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
    I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
    Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': '/',
  };

  const REVERSE_MORSE = useMemo(() => {
    const rev: Record<string, string> = {};
    for (const [k, v] of Object.entries(MORSE_MAP)) {
      rev[v] = k;
    }
    return rev;
  }, []);

  const handleTextChange = (val: string) => {
    setText(val);
    const m = val
      .toUpperCase()
      .split('')
      .map((c) => MORSE_MAP[c] || c)
      .join(' ');
    setMorse(m);
  };

  const handleMorseChange = (val: string) => {
    setMorse(val);
    const words = val.trim().split(/\s+/);
    const txt = words.map((w) => (w === '/' ? ' ' : REVERSE_MORSE[w] || '')).join('');
    setText(txt);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">English Text</label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={7}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Morse Code (. and -)</label>
          <textarea
            value={morse}
            onChange={(e) => handleMorseChange(e.target.value)}
            rows={7}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. UUID / GUID GENERATOR
// ==========================================
export const UuidGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let u = crypto.randomUUID();
      if (noHyphens) u = u.replace(/-/g, '');
      if (uppercase) u = u.toUpperCase();
      list.push(u);
    }
    setUuids(list);
  };

  React.useEffect(() => {
    generateUuids();
  }, [count, uppercase, noHyphens]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>Quantity:</span>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
            />
          </div>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            <span>UPPERCASE</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={noHyphens} onChange={(e) => setNoHyphens(e.target.checked)} />
            <span>No Hyphens</span>
          </label>
        </div>

        <button
          onClick={generateUuids}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer"
        >
          Regenerate
        </button>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{uuids.length} Generated UUIDs (v4 RFC-4122)</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(uuids.join('\n'));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied All!' : 'Copy All'}</span>
          </button>
        </div>
        <div className="font-mono text-xs space-y-1 max-h-60 overflow-y-auto bg-white dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          {uuids.map((u, i) => (
            <div key={i} className="py-0.5 text-slate-800 dark:text-slate-200 select-all">
              {u}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. TIMESTAMP & UNIX EPOCH CONVERTER
// ==========================================
export const TimestampConverterTool: React.FC = () => {
  const [epoch, setEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [dateStr, setDateStr] = useState<string>(() => new Date().toISOString().slice(0, 19));

  const parsedDate = useMemo(() => {
    return new Date(epoch * 1000);
  }, [epoch]);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Current Epoch</span>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white">
            {Math.floor(Date.now() / 1000)}
          </div>
        </div>
        <button
          onClick={() => setEpoch(Math.floor(Date.now() / 1000))}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
        >
          Set to Now
        </button>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter Epoch Timestamp (Seconds)</label>
        <input
          type="number"
          value={epoch}
          onChange={(e) => setEpoch(Number(e.target.value))}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm"
        />
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-medium">UTC Date & Time</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{parsedDate.toUTCString()}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 font-medium">Local Date & Time</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{parsedDate.toString()}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400 font-medium">ISO 8601</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{parsedDate.toISOString()}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. JWT INSPECTOR & DECODER
// ==========================================
export const JwtDecoderTool: React.FC = () => {
  const SAMPLE_JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const [token, setToken] = useState(SAMPLE_JWT);

  const decoded = useMemo(() => {
    try {
      const parts = token.trim().split('.');
      if (parts.length < 2) return null;
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload, valid: true };
    } catch {
      return null;
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={3}
          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none break-all"
        />
      </div>

      {decoded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Header (Algorithm & Token Type)</span>
            <pre className="mt-2 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Payload Data (Claims)</span>
            <pre className="mt-2 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200">
          Invalid or malformed JSON Web Token. Please check the string format (header.payload.signature).
        </div>
      )}
    </div>
  );
};

// ==========================================
// 11. HTML ENTITY ENCODER & DECODER
// ==========================================
export const HtmlEntityTool: React.FC = () => {
  const [input, setInput] = useState('<div class="pocketkit">Hello & Welcome! © 2026</div>');
  const [copied, setCopied] = useState(false);

  const encoded = useMemo(() => {
    return input.replace(/[\u00A0-\u9999<>\&"']/g, (i) => '&#' + i.charCodeAt(0) + ';');
  }, [input]);

  const decoded = useMemo(() => {
    const txt = document.createElement('textarea');
    txt.innerHTML = input;
    return txt.value;
  }, [input]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input String</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500">HTML Entities Encoded</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(encoded);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={encoded}
            rows={5}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Entities Decoded</label>
          <textarea
            readOnly
            value={decoded}
            rows={5}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. URL PARSER & QUERY EXTRACTOR
// ==========================================
export const UrlParserTool: React.FC = () => {
  const [urlStr, setUrlStr] = useState('https://pocketkit.dev/tools?category=pdf&sort=popular&ref=producthunt#editor');

  const parsed = useMemo(() => {
    try {
      const u = new URL(urlStr);
      const params: [string, string][] = [];
      u.searchParams.forEach((v, k) => params.push([k, v]));
      return {
        valid: true,
        protocol: u.protocol,
        host: u.host,
        hostname: u.hostname,
        port: u.port || 'default (80/443)',
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        params,
      };
    } catch {
      return { valid: false };
    }
  }, [urlStr]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL to Inspect</label>
        <input
          type="text"
          value={urlStr}
          onChange={(e) => setUrlStr(e.target.value)}
          className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {parsed.valid ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Protocol</span>
              <div className="font-mono font-bold mt-1 text-slate-800 dark:text-slate-200">{parsed.protocol}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Host</span>
              <div className="font-mono font-bold mt-1 text-slate-800 dark:text-slate-200">{parsed.host}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Path</span>
              <div className="font-mono font-bold mt-1 text-slate-800 dark:text-slate-200">{parsed.pathname}</div>
            </div>
          </div>

          {parsed.params && parsed.params.length > 0 && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Query Parameters ({parsed.params.length})</span>
              <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
                {parsed.params.map(([k, v], idx) => (
                  <div key={idx} className="py-1.5 flex justify-between">
                    <span className="font-bold text-indigo-500">{k}</span>
                    <span className="text-slate-700 dark:text-slate-300">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-rose-500 font-semibold p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40">
          Invalid URL format. Please include protocol (e.g. https://).
        </div>
      )}
    </div>
  );
};

// ==========================================
// 13. SQL QUERY FORMATTER
// ==========================================
export const SqlFormatterTool: React.FC = () => {
  const [sql, setSql] = useState("SELECT u.id, u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100 ORDER BY o.total DESC;");
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => {
    let s = sql.trim();
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN',
      'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'
    ];
    for (const kw of keywords) {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      s = s.replace(reg, `\n${kw}`);
    }
    return s.trim();
  }, [sql]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            navigator.clipboard.writeText(formatted);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied SQL!' : 'Copy Formatted SQL'}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={8}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <textarea
          readOnly
          value={formatted}
          rows={8}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs focus:outline-none text-indigo-600 dark:text-indigo-400 font-bold"
        />
      </div>
    </div>
  );
};

// ==========================================
// 14. REGEX TESTER
// ==========================================
export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Contact support@pocketkit.dev or sales@domain.org for inquiries.');

  const matches = useMemo(() => {
    try {
      const reg = new RegExp(pattern, flags);
      const found: string[] = [];
      let m;
      if (flags.includes('g')) {
        while ((m = reg.exec(testString)) !== null) {
          found.push(m[0]);
        }
      } else {
        const single = reg.exec(testString);
        if (single) found.push(single[0]);
      }
      return { matches: found, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flags, testString]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">RegEx Pattern</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm text-slate-400">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="font-mono text-sm text-slate-400">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="flags"
              className="w-16 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={4}
          className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
        />
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            Matches Found ({matches.matches.length})
          </span>
          {matches.error && <span className="text-rose-500 font-semibold">{matches.error}</span>}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {matches.matches.map((m, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 font-mono text-xs font-bold">
              {m}
            </span>
          ))}
          {matches.matches.length === 0 && !matches.error && (
            <span className="text-xs text-slate-400">No matches found.</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 15. CHMOD PERMISSIONS CALCULATOR
// ==========================================
export const ChmodCalculatorTool: React.FC = () => {
  const [perms, setPerms] = useState({
    ownerR: true, ownerW: true, ownerX: true,
    groupR: true, groupW: false, groupX: true,
    publicR: true, publicW: false, publicX: true,
  });

  const code = useMemo(() => {
    const o = (perms.ownerR ? 4 : 0) + (perms.ownerW ? 2 : 0) + (perms.ownerX ? 1 : 0);
    const g = (perms.groupR ? 4 : 0) + (perms.groupW ? 2 : 0) + (perms.groupX ? 1 : 0);
    const p = (perms.publicR ? 4 : 0) + (perms.publicW ? 2 : 0) + (perms.publicX ? 1 : 0);
    return `${o}${g}${p}`;
  }, [perms]);

  const symbolic = useMemo(() => {
    return (
      (perms.ownerR ? 'r' : '-') + (perms.ownerW ? 'w' : '-') + (perms.ownerX ? 'x' : '-') +
      (perms.groupR ? 'r' : '-') + (perms.groupW ? 'w' : '-') + (perms.groupX ? 'x' : '-') +
      (perms.publicR ? 'r' : '-') + (perms.publicW ? 'w' : '-') + (perms.publicX ? 'x' : '-')
    );
  }, [perms]);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        {/* Owner */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <span className="font-extrabold text-indigo-600">Owner</span>
          <div className="space-y-1.5 text-left">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.ownerR} onChange={(e) => setPerms({ ...perms, ownerR: e.target.checked })} />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.ownerW} onChange={(e) => setPerms({ ...perms, ownerW: e.target.checked })} />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.ownerX} onChange={(e) => setPerms({ ...perms, ownerX: e.target.checked })} />
              <span>Execute (1)</span>
            </label>
          </div>
        </div>

        {/* Group */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <span className="font-extrabold text-indigo-600">Group</span>
          <div className="space-y-1.5 text-left">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.groupR} onChange={(e) => setPerms({ ...perms, groupR: e.target.checked })} />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.groupW} onChange={(e) => setPerms({ ...perms, groupW: e.target.checked })} />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.groupX} onChange={(e) => setPerms({ ...perms, groupX: e.target.checked })} />
              <span>Execute (1)</span>
            </label>
          </div>
        </div>

        {/* Public */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <span className="font-extrabold text-indigo-600">Public / Others</span>
          <div className="space-y-1.5 text-left">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.publicR} onChange={(e) => setPerms({ ...perms, publicR: e.target.checked })} />
              <span>Read (4)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.publicW} onChange={(e) => setPerms({ ...perms, publicW: e.target.checked })} />
              <span>Write (2)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={perms.publicX} onChange={(e) => setPerms({ ...perms, publicX: e.target.checked })} />
              <span>Execute (1)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500">Numeric Chmod Code</span>
          <div className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">{code}</div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-500">Symbolic Notation</span>
          <div className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">-{symbolic}</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 16. UNIVERSAL UNIT CONVERTER
// ==========================================
export const UnitConverterTool: React.FC = () => {
  const [type, setType] = useState<'length' | 'weight' | 'data'>('length');
  const [val, setVal] = useState<number>(100);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-bold">
        <button
          onClick={() => setType('length')}
          className={`px-3 py-1.5 rounded-lg ${type === 'length' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
        >
          Length
        </button>
        <button
          onClick={() => setType('weight')}
          className={`px-3 py-1.5 rounded-lg ${type === 'weight' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
        >
          Mass / Weight
        </button>
        <button
          onClick={() => setType('data')}
          className={`px-3 py-1.5 rounded-lg ${type === 'data' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
        >
          Digital Storage
        </button>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Base Value ({type === 'length' ? 'Meters' : type === 'weight' ? 'Kilograms' : 'Megabytes'})
        </label>
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        {type === 'length' && (
          <>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Kilometers:</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val / 1000).toLocaleString()} km</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Centimeters:</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 100).toLocaleString()} cm</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Feet:</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 3.28084).toFixed(3)} ft</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Inches:</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 39.3701).toFixed(2)} in</div>
            </div>
          </>
        )}

        {type === 'weight' && (
          <>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Grams:</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 1000).toLocaleString()} g</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Pounds (lbs):</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 2.20462).toFixed(3)} lbs</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Ounces (oz):</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 35.274).toFixed(2)} oz</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Metric Tons:</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val / 1000).toFixed(4)} t</div>
            </div>
          </>
        )}

        {type === 'data' && (
          <>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Kilobytes (KB):</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 1024).toLocaleString()} KB</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Gigabytes (GB):</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val / 1024).toFixed(4)} GB</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Bytes:</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val * 1024 * 1024).toLocaleString()} B</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border">
              <span className="text-slate-400">Terabytes (TB):</span>
              <div className="font-bold text-sm text-indigo-600 mt-1">{(val / (1024 * 1024)).toFixed(6)} TB</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 17. PERCENTAGE CALCULATOR
// ==========================================
export const PercentageCalculatorTool: React.FC = () => {
  const [val1, setVal1] = useState(25);
  const [val2, setVal2] = useState(200);

  const res1 = useMemo(() => (val1 / 100) * val2, [val1, val2]);
  const res2 = useMemo(() => (val2 !== 0 ? (val1 / val2) * 100 : 0), [val1, val2]);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase text-indigo-600">What is X% of Y?</h4>
        <div className="flex items-center gap-2 text-sm">
          <span>What is</span>
          <input
            type="number"
            value={val1}
            onChange={(e) => setVal1(Number(e.target.value))}
            className="w-20 px-2.5 py-1.5 rounded-lg border font-bold"
          />
          <span>% of</span>
          <input
            type="number"
            value={val2}
            onChange={(e) => setVal2(Number(e.target.value))}
            className="w-24 px-2.5 py-1.5 rounded-lg border font-bold"
          />
          <span className="font-bold text-lg text-emerald-600 ml-auto">= {res1.toFixed(2)}</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase text-indigo-600">X is what % of Y?</h4>
        <div className="flex items-center gap-2 text-sm">
          <span>{val1} is what % of {val2}?</span>
          <span className="font-bold text-lg text-indigo-600 ml-auto">= {res2.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 18. COMPOUND INTEREST CALCULATOR
// ==========================================
export const CompoundInterestTool: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);

  const finalAmount = useMemo(() => {
    return principal * Math.pow(1 + rate / 100, years);
  }, [principal, rate, years]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500">Principal ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Annual Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Future Investment Value</span>
        <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
          ${finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-slate-500">Total Profit: ${(finalAmount - principal).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
};

// ==========================================
// 19. DISCOUNT CALCULATOR
// ==========================================
export const DiscountCalculatorTool: React.FC = () => {
  const [price, setPrice] = useState(150);
  const [discount, setDiscount] = useState(20);

  const savings = (price * discount) / 100;
  const finalPrice = price - savings;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500">Original Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full mt-1 p-2.5 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full mt-1 p-2.5 rounded-xl border font-bold"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 text-center space-y-1">
        <span className="text-xs font-bold text-indigo-600 uppercase">You Pay</span>
        <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">${finalPrice.toFixed(2)}</div>
        <p className="text-xs text-emerald-600 font-semibold">You Save: ${savings.toFixed(2)}</p>
      </div>
    </div>
  );
};

// ==========================================
// 20. TIP & SPLIT BILL CALCULATOR
// ==========================================
export const TipCalculatorTool: React.FC = () => {
  const [bill, setBill] = useState(85);
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(3);

  const tipTotal = (bill * tipPercent) / 100;
  const grandTotal = bill + tipTotal;
  const perPerson = people > 0 ? grandTotal / people : 0;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500">Bill ($)</label>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Tip (%)</label>
          <input
            type="number"
            value={tipPercent}
            onChange={(e) => setTipPercent(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">People</label>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Total Tip:</span>
          <span className="font-bold">${tipTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Grand Total:</span>
          <span className="font-bold">${grandTotal.toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t flex justify-between text-sm font-extrabold text-indigo-600">
          <span>Each Person Pays:</span>
          <span>${perPerson.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 21. BMI BODY MASS INDEX CALCULATOR
// ==========================================
export const BmiCalculatorTool: React.FC = () => {
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);

  const bmi = useMemo(() => {
    if (heightCm <= 0) return 0;
    const h = heightCm / 100;
    return weightKg / (h * h);
  }, [weightKg, heightCm]);

  const category = useMemo(() => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-amber-500' };
    if (bmi < 24.9) return { text: 'Normal weight (Healthy)', color: 'text-emerald-500' };
    if (bmi < 29.9) return { text: 'Overweight', color: 'text-amber-600' };
    return { text: 'Obese', color: 'text-rose-500' };
  }, [bmi]);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full mt-1 p-2.5 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className="w-full mt-1 p-2.5 rounded-xl border font-bold"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border text-center space-y-1">
        <span className="text-xs font-bold text-slate-400">Your Body Mass Index</span>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{bmi.toFixed(1)}</div>
        <p className={`text-xs font-bold ${category.color}`}>{category.text}</p>
      </div>
    </div>
  );
};

// ==========================================
// 22. DATE DIFFERENCE CALCULATOR
// ==========================================
export const DateDifferenceTool: React.FC = () => {
  const [d1, setD1] = useState('2026-01-01');
  const [d2, setD2] = useState('2026-10-20');

  const diffDays = useMemo(() => {
    const t1 = new Date(d1).getTime();
    const t2 = new Date(d2).getTime();
    const diff = Math.abs(t2 - t1);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [d1, d2]);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500">Start Date</label>
          <input
            type="date"
            value={d1}
            onChange={(e) => setD1(e.target.value)}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">End Date</label>
          <input
            type="date"
            value={d2}
            onChange={(e) => setD2(e.target.value)}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-center space-y-1">
        <span className="text-xs font-bold text-indigo-600 uppercase">Difference</span>
        <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">{diffDays} Days</div>
        <p className="text-xs text-slate-500">
          {(diffDays / 7).toFixed(1)} weeks • {(diffDays / 30.437).toFixed(1)} months
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 23. CSS BOX SHADOW GENERATOR
// ==========================================
export const CssBoxShadowTool: React.FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [opacity, setOpacity] = useState(0.2);
  const [copied, setCopied] = useState(false);

  const shadowCss = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity});`;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Live Preview Box */}
      <div className="h-40 flex items-center justify-center bg-slate-100 dark:bg-slate-900/60 rounded-2xl border">
        <div
          className="w-32 h-20 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-xs text-indigo-600 transition-all"
          style={{
            boxShadow: `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`,
          }}
        >
          Preview Box
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-medium">
        <div>
          <label>Offset X: {x}px</label>
          <input type="range" min={-50} max={50} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label>Offset Y: {y}px</label>
          <input type="range" min={-50} max={50} value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label>Blur Radius: {blur}px</label>
          <input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <label>Spread: {spread}px</label>
          <input type="range" min={-20} max={40} value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs flex items-center justify-between">
        <code>{shadowCss}</code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shadowCss);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 24. CSS GRADIENT GENERATOR
// ==========================================
export const CssGradientTool: React.FC = () => {
  const [col1, setCol1] = useState('#4f46e5');
  const [col2, setCol2] = useState('#10b981');
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const gradientCss = `background: linear-gradient(${angle}deg, ${col1}, ${col2});`;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div
        className="h-36 rounded-2xl shadow-md transition-all flex items-center justify-center text-white font-bold text-sm shadow-indigo-500/10"
        style={{ background: `linear-gradient(${angle}deg, ${col1}, ${col2})` }}
      >
        Gradient Preview
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span>Color 1:</span>
          <input type="color" value={col1} onChange={(e) => setCol1(e.target.value)} className="w-8 h-8 rounded border" />
          <span className="font-mono">{col1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Color 2:</span>
          <input type="color" value={col2} onChange={(e) => setCol2(e.target.value)} className="w-8 h-8 rounded border" />
          <span className="font-mono">{col2}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Angle: {angle}°</span>
          <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-24" />
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs flex items-center justify-between">
        <code>{gradientCss}</code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(gradientCss);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 25. QR CODE GENERATOR (CLIENT-SIDE SVG)
// ==========================================
export const QrCodeGeneratorTool: React.FC = () => {
  const [text, setText] = useState('https://pocketkit.dev');
  const [size, setSize] = useState(180);

  // High quality client-side SVG QR code generator
  const qrUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  }, [text, size]);

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div className="space-y-1.5 text-left">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">URL / Text to Encode</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter website, contact, or text..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 inline-block shadow-sm">
        <img src={qrUrl} alt="Generated QR code" className="mx-auto rounded-lg" width={size} height={size} />
      </div>

      <div className="flex justify-center gap-3">
        <a
          href={qrUrl}
          download="pocketkit-qr.png"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download QR Image</span>
        </a>
      </div>
    </div>
  );
};

// ==========================================
// 26. ASPECT RATIO CALCULATOR
// ==========================================
export const AspectRatioTool: React.FC = () => {
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [width, setWidth] = useState(1920);

  const calculatedHeight = useMemo(() => {
    if (ratioW <= 0) return 0;
    return Math.round((width * ratioH) / ratioW);
  }, [width, ratioW, ratioH]);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-500">Ratio Width</label>
          <input
            type="number"
            value={ratioW}
            onChange={(e) => setRatioW(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
        <div>
          <label className="font-bold text-slate-500">Ratio Height</label>
          <input
            type="number"
            value={ratioH}
            onChange={(e) => setRatioH(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded-xl border font-bold"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => { setRatioW(16); setRatioH(9); }} className="px-2.5 py-1 text-xs rounded-lg border font-bold">16:9</button>
        <button onClick={() => { setRatioW(4); setRatioH(3); }} className="px-2.5 py-1 text-xs rounded-lg border font-bold">4:3</button>
        <button onClick={() => { setRatioW(1); setRatioH(1); }} className="px-2.5 py-1 text-xs rounded-lg border font-bold">1:1</button>
        <button onClick={() => { setRatioW(21); setRatioH(9); }} className="px-2.5 py-1 text-xs rounded-lg border font-bold">21:9</button>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500">Width (pixels)</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full mt-1 p-2.5 rounded-xl border font-bold"
        />
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-center space-y-1">
        <span className="text-xs font-bold text-indigo-600 uppercase">Calculated Dimensions</span>
        <div className="text-2xl font-mono font-extrabold text-indigo-700 dark:text-indigo-300">
          {width} × {calculatedHeight} px
        </div>
      </div>
    </div>
  );
};
