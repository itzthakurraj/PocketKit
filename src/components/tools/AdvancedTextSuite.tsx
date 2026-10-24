import React, { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Trash2,
  Shuffle,
  Eye,
  AlertCircle,
  CheckCircle2,
  ArrowRightLeft,
} from 'lucide-react';

// ==========================================
// 1. ZALGO GLITCH TEXT GENERATOR
// ==========================================
export const ZalgoGlitchTextTool: React.FC = () => {
  const [text, setText] = useState('POCKETKIT CYBER MATRIX');
  const [intensity, setIntensity] = useState(10);
  const [copied, setCopied] = useState(false);

  const zalgoUp = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357'];
  const zalgoMid = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334'];
  const zalgoDown = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324'];

  const glitched = useMemo(() => {
    let result = '';
    for (const char of text) {
      result += char;
      if (char === ' ') continue;
      const count = Math.floor(intensity / 2);
      for (let i = 0; i < count; i++) {
        result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
        result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
        result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
      }
    }
    return result;
  }, [text, intensity]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Zalgo Glitch & Corrupted Text Generator</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(glitched);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy Glitch Text
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Source Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Corruption Level: {intensity}</label>
          <input
            type="range"
            min={1}
            max={25}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      <div className="p-8 bg-slate-900 text-rose-400 font-mono text-lg rounded-2xl min-h-[140px] flex items-center justify-center text-center overflow-hidden break-all select-all">
        {glitched}
      </div>
    </div>
  );
};

// ==========================================
// 2. INVISIBLE CHARACTER DETECTOR & CLEANER
// ==========================================
export const InvisibleCharacterDetectorTool: React.FC = () => {
  const [input, setInput] = useState<string>("Hello\u200BWorld!\uFEFF Hidden zero-width\u200D spaces.");
  const [cleaned, setCleaned] = useState<string>('');

  const detected = useMemo(() => {
    const hiddenMap: Record<string, { name: string; count: number }> = {
      '\u200B': { name: 'Zero-Width Space (U+200B)', count: 0 },
      '\uFEFF': { name: 'Byte Order Mark (BOM U+FEFF)', count: 0 },
      '\u200C': { name: 'Zero-Width Non-Joiner (U+200C)', count: 0 },
      '\u200D': { name: 'Zero-Width Joiner (U+200D)', count: 0 },
      '\u00A0': { name: 'Non-Breaking Space (U+00A0)', count: 0 },
    };

    let totalHidden = 0;
    for (const char of input) {
      if (hiddenMap[char]) {
        hiddenMap[char].count++;
        totalHidden++;
      }
    }

    return {
      totalHidden,
      list: Object.values(hiddenMap).filter(h => h.count > 0),
    };
  }, [input]);

  const cleanText = () => {
    const sanitized = input.replace(/[\u200B\uFEFF\u200C\u200D\u00A0]/g, ' ');
    setCleaned(sanitized);
    setInput(sanitized);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Invisible & Zero-Width Character Sanitizer</span>
        </div>
        <button
          onClick={cleanText}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
        >
          <Trash2 className="w-3.5 h-3.5" /> Strip Hidden Chars
        </button>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 block mb-1">Inspect Raw Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="w-full p-3 font-mono text-xs border rounded-xl dark:bg-slate-900"
        />
      </div>

      <div className={`p-4 rounded-xl border ${detected.totalHidden > 0 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300' : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300'}`}>
        <div className="flex items-center gap-2 font-bold text-xs">
          {detected.totalHidden > 0 ? <AlertCircle className="w-4 h-4 text-amber-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{detected.totalHidden > 0 ? `Detected ${detected.totalHidden} invisible character(s)` : 'Clean text: No invisible zero-width characters found.'}</span>
        </div>
        {detected.list.length > 0 && (
          <div className="mt-2 space-y-1 font-mono text-xs text-amber-900 dark:text-amber-200">
            {detected.list.map((item, i) => (
              <div key={i}>{item.name}: {item.count} instance(s)</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. NATO PHONETIC SPELLER
// ==========================================
export const NatoPhoneticSpellerTool: React.FC = () => {
  const [word, setWord] = useState('POCKETKIT 2026');
  const [copied, setCopied] = useState(false);

  const NATO_DICT: Record<string, string> = {
    A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo',
    F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett',
    K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar',
    P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango',
    U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee',
    Z: 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
    '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight',
    '9': 'Niner',
  };

  const spelled = useMemo(() => {
    return word
      .toUpperCase()
      .split('')
      .map(char => {
        if (char === ' ') return '[SPACE]';
        return NATO_DICT[char] || char;
      })
      .join(' - ');
  }, [word]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">NATO / ICAO Phonetic Alphabet Speller</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(spelled);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy Phonetics
        </button>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 block mb-1">Enter Word or Phrase</label>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900"
        />
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <span className="text-xs text-slate-400 block mb-2 font-medium">Aviation Radio Spelling:</span>
        <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 leading-relaxed select-all">
          {spelled}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. RANDOM NAME & WORD PICKER
// ==========================================
export const RandomWordPickerTool: React.FC = () => {
  const [listText, setListText] = useState("Alex\nJordan\nTaylor\nMorgan\nCasey\nRiley\nSam");
  const [winner, setWinner] = useState<string | null>(null);

  const pickRandom = () => {
    const items = listText.split('\n').map(s => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    const choice = items[Math.floor(Math.random() * items.length)];
    setWinner(choice);
  };

  const shuffleList = () => {
    const items = listText.split('\n').map(s => s.trim()).filter(Boolean);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setListText(items.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Random Name & Team Picker</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={shuffleList} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 border rounded-lg">
            <Shuffle className="w-3.5 h-3.5" /> Shuffle
          </button>
          <button onClick={pickRandom} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Sparkles className="w-3.5 h-3.5" /> Pick Winner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Names / Items (One Per Line)</label>
          <textarea
            value={listText}
            onChange={(e) => setListText(e.target.value)}
            rows={8}
            className="w-full p-2.5 font-mono text-xs border rounded-xl dark:bg-slate-900"
          />
        </div>
        <div className="p-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400">Selected Winner</span>
          <div className="text-4xl font-extrabold text-indigo-900 dark:text-indigo-100">
            {winner || 'Click Pick Winner'}
          </div>
        </div>
      </div>
    </div>
  );
};
