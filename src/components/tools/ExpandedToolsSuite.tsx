import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Download, Sparkles, Sliders, ArrowRightLeft, FileCode, Clock, Fuel, DollarSign, Calculator, Globe, Binary, Eye } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

// ================= 1. CRONTAB EXPLAINER =================
export const CronExplainerTool: React.FC = () => {
  const [cron, setCron] = useState('*/15 * * * *');
  const [copied, setCopied] = useState(false);

  const explanation = useMemo(() => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length < 5) return 'Invalid cron format. Expected 5 fields: minute hour day month weekday';

    const [min, hr, dom, mon, dow] = parts;
    const desc: string[] = [];

    // Minute
    if (min === '*') desc.push('Every minute');
    else if (min.startsWith('*/')) desc.push(`Every ${min.replace('*/', '')} minutes`);
    else desc.push(`At minute ${min}`);

    // Hour
    if (hr === '*') desc.push('every hour');
    else if (hr.startsWith('*/')) desc.push(`every ${hr.replace('*/', '')} hours`);
    else desc.push(`at hour ${hr}:00`);

    // Day of Month
    if (dom !== '*') desc.push(`on day-of-month ${dom}`);

    // Month
    if (mon !== '*') desc.push(`in month ${mon}`);

    // Day of Week
    if (dow === '1-5') desc.push('Monday through Friday');
    else if (dow === '0' || dow === '7') desc.push('on Sunday');
    else if (dow !== '*') desc.push(`on weekday ${dow}`);

    return desc.join(', ');
  }, [cron]);

  const presets = [
    { label: 'Every 5 Mins', exp: '*/5 * * * *' },
    { label: 'Every Hour', exp: '0 * * * *' },
    { label: 'Every Midnight', exp: '0 0 * * *' },
    { label: 'Every Sunday', exp: '0 0 * * 0' },
    { label: 'Weekdays 9 AM', exp: '0 9 * * 1-5' },
    { label: '1st of Month', exp: '0 0 1 * *' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Standard 5-Field Cron Expression
        </label>
        <input
          type="text"
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-lg font-bold text-slate-900 dark:text-white"
          placeholder="* * * * *"
        />
      </div>

      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          Plain English Translation
        </span>
        <div className="text-xl font-bold text-slate-900 dark:text-white capitalize leading-relaxed">
          "{explanation}"
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
        {['Minute (0-59)', 'Hour (0-23)', 'Day (1-31)', 'Month (1-12)', 'Weekday (0-7)'].map((field, idx) => {
          const parts = cron.trim().split(/\s+/);
          return (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="block text-slate-400 text-[10px]">{field}</span>
              <span className="block text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {parts[idx] || '-'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Common Schedules</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.exp}
              onClick={() => {
                setCron(p.exp);
                triggerHaptic('light');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-500 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ================= 2. YAML <-> JSON CONVERTER =================
export const YamlJsonConverterTool: React.FC = () => {
  const [yamlText, setYamlText] = useState(`name: PocketKit\nversion: 2.1\nfeatures:\n  - client-side\n  - private\n  - offline`);
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  const convertYamlToJson = () => {
    try {
      // Clean lightweight client-side YAML parser for key-values and arrays
      const lines = yamlText.split('\n');
      const obj: any = {};
      let currentArrayKey: string | null = null;

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        if (trimmed.startsWith('- ')) {
          const val = trimmed.replace(/^- /, '').trim();
          if (currentArrayKey) {
            if (!Array.isArray(obj[currentArrayKey])) obj[currentArrayKey] = [];
            obj[currentArrayKey].push(val);
          }
        } else if (trimmed.includes(':')) {
          const colonIdx = trimmed.indexOf(':');
          const key = trimmed.slice(0, colonIdx).trim();
          const val = trimmed.slice(colonIdx + 1).trim();

          if (!val) {
            currentArrayKey = key;
            obj[key] = [];
          } else {
            currentArrayKey = null;
            let parsedVal: any = val;
            if (val === 'true') parsedVal = true;
            else if (val === 'false') parsedVal = false;
            else if (!isNaN(Number(val))) parsedVal = Number(val);
            obj[key] = parsedVal;
          }
        }
      });

      setJsonText(JSON.stringify(obj, null, 2));
      triggerHaptic('success');
    } catch {
      setJsonText('Error parsing YAML structure.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">YAML Input</label>
          <textarea
            rows={10}
            value={yamlText}
            onChange={(e) => setYamlText(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">JSON Output</label>
          <textarea
            rows={10}
            readOnly
            value={jsonText}
            placeholder="Click 'Convert YAML to JSON' to see output..."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={convertYamlToJson}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs"
        >
          Convert YAML to JSON
        </button>

        {jsonText && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(jsonText);
              setCopied(true);
              triggerHaptic('success');
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ================= 3. CSS GLASSMORPHISM GENERATOR =================
export const CssGlassmorphismTool: React.FC = () => {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(25);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [copied, setCopied] = useState(false);

  const cssCode = `background: rgba(255, 255, 255, ${opacity / 100});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, ${borderOpacity / 100});\nborder-radius: 16px;`;

  return (
    <div className="space-y-6">
      <div className="relative p-12 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 min-h-[220px]">
        {/* Animated Background Orbs */}
        <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-amber-400 blur-lg opacity-80" />
        <div className="absolute bottom-4 right-8 w-28 h-28 rounded-full bg-emerald-400 blur-lg opacity-80" />

        {/* The Glass Element */}
        <div
          style={{
            background: `rgba(255, 255, 255, ${opacity / 100})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
          }}
          className="relative z-10 p-6 rounded-2xl shadow-xl max-w-sm text-center text-white"
        >
          <h4 className="text-lg font-extrabold tracking-tight">PocketKit Glass Card</h4>
          <p className="text-xs text-white/90 mt-1">
            Real-time frosted glass backdrop simulation with blur({blur}px).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Blur Radius</span>
            <span>{blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={40}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Surface Opacity</span>
            <span>{opacity}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={90}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Border Outline</span>
            <span>{borderOpacity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={borderOpacity}
            onChange={(e) => setBorderOpacity(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Generated CSS Code</label>
          <button
            onClick={() => {
              navigator.clipboard.writeText(cssCode);
              setCopied(true);
              triggerHaptic('success');
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy CSS'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
          {cssCode}
        </pre>
      </div>
    </div>
  );
};

// ================= 4. CURL TO FETCH CONVERTER =================
export const CurlToFetchTool: React.FC = () => {
  const [curl, setCurl] = useState("curl -X POST https://api.example.com/v1/users -H 'Content-Type: application/json' -d '{\"name\":\"Alex\"}'");
  const [copied, setCopied] = useState(false);

  const fetchCode = useMemo(() => {
    try {
      const urlMatch = curl.match(/https?:\/\/[^\s'"]+/);
      const url = urlMatch ? urlMatch[0] : 'https://api.example.com';

      const methodMatch = curl.match(/-X\s+([A-Z]+)/);
      const method = methodMatch ? methodMatch[1] : curl.includes('-d') ? 'POST' : 'GET';

      const headers: Record<string, string> = {};
      const headerMatches = curl.matchAll(/-H\s+['"]([^'"]+)['"]/g);
      for (const m of headerMatches) {
        const parts = m[1].split(':');
        if (parts.length >= 2) {
          headers[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      }

      const bodyMatch = curl.match(/-d\s+['"]([^'"]+)['"]/);
      const body = bodyMatch ? bodyMatch[1] : null;

      let code = `fetch("${url}", {\n  method: "${method}",\n`;
      if (Object.keys(headers).length > 0) {
        code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},\n`;
      }
      if (body) {
        code += `  body: JSON.stringify(${body})\n`;
      }
      code += '})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));';

      return code;
    } catch {
      return '// Could not parse curl command into fetch.';
    }
  }, [curl]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">cURL Command</label>
        <textarea
          rows={3}
          value={curl}
          onChange={(e) => setCurl(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">JavaScript fetch() Equivalent</label>
          <button
            onClick={() => {
              navigator.clipboard.writeText(fetchCode);
              setCopied(true);
              triggerHaptic('success');
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JavaScript'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
          {fetchCode}
        </pre>
      </div>
    </div>
  );
};

// ================= 5. WORD FREQUENCY ANALYZER =================
export const WordFrequencyTool: React.FC = () => {
  const [text, setText] = useState(
    'PocketKit provides fast client-side tools. Fast tools make everyday workflows simpler, and private client-side processing guarantees complete privacy.'
  );

  const stats = useMemo(() => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const freqMap: Record<string, number> = {};
    words.forEach((w) => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });

    const sorted = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    return { total: words.length, sorted };
  }, [text]);

  return (
    <div className="space-y-4">
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white leading-relaxed"
        placeholder="Paste text to analyze word frequencies..."
      />

      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Top Word Frequencies ({stats.total} total words analyzed)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {stats.sorted.map(([word, count]) => {
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={word} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white capitalize">{word}</span>
                <span className="font-mono text-slate-400">{count}× ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ================= 6. NATO PHONETIC ALPHABET =================
export const NatoPhoneticTool: React.FC = () => {
  const [input, setInput] = useState('POCKETKIT');

  const NATO_DICT: Record<string, string> = {
    A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo',
    F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett',
    K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar',
    P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango',
    U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
    '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
    '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
  };

  const phonetic = useMemo(() => {
    return input
      .toUpperCase()
      .split('')
      .map((char) => NATO_DICT[char] || char)
      .join('  ·  ');
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Text to Spell</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white"
        />
      </div>

      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          NATO Phonetic Spelling
        </span>
        <div className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {phonetic}
        </div>
      </div>
    </div>
  );
};

// ================= 7. FUEL TRIP COST CALCULATOR =================
export const FuelCostCalculatorTool: React.FC = () => {
  const [distance, setDistance] = useState(250);
  const [efficiency, setEfficiency] = useState(30); // MPG
  const [pricePerGal, setPricePerGal] = useState(3.60);
  const [passengers, setPassengers] = useState(1);

  const totalFuelGallons = efficiency > 0 ? distance / efficiency : 0;
  const totalCost = totalFuelGallons * pricePerGal;
  const costPerPerson = passengers > 0 ? totalCost / passengers : totalCost;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
          Estimated Trip Fuel Cost
        </span>
        <div className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
          ${totalCost.toFixed(2)}
        </div>
        {passengers > 1 && (
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Split {passengers} ways: <strong className="text-indigo-600">${costPerPerson.toFixed(2)}</strong> per person
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Distance (Miles/KM)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Fuel Efficiency (MPG)</label>
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Fuel Price ($/unit)</label>
          <input
            type="number"
            step="0.01"
            value={pricePerGal}
            onChange={(e) => setPricePerGal(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Passengers</label>
          <input
            type="number"
            min={1}
            value={passengers}
            onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>
      </div>
    </div>
  );
};

// ================= 8. WORK HOURS & TIMECARD =================
export const WorkHoursCalculatorTool: React.FC = () => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMins, setBreakMins] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(25);

  const { totalHours, grossPay } = useMemo(() => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    let diff = endTotal - startTotal - breakMins;
    if (diff < 0) diff += 24 * 60; // Crosses midnight

    const hours = diff / 60;
    return {
      totalHours: hours > 0 ? hours : 0,
      grossPay: (hours > 0 ? hours : 0) * hourlyRate,
    };
  }, [startTime, endTime, breakMins, hourlyRate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-center">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Total Hours Worked</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            {totalHours.toFixed(2)} <span className="text-sm font-normal text-slate-400">hrs</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Gross Earnings</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            ${grossPay.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shift Start</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shift End</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Break (Minutes)</label>
          <input
            type="number"
            value={breakMins}
            onChange={(e) => setBreakMins(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hourly Rate ($)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold"
          />
        </div>
      </div>
    </div>
  );
};

// ================= 9. ROMAN NUMERAL CONVERTER =================
export const RomanNumeralTool: React.FC = () => {
  const [num, setNum] = useState<number>(2026);
  const [roman, setRoman] = useState('MMXXVI');

  const toRoman = (n: number): string => {
    if (n <= 0 || n > 3999) return 'Range: 1 - 3999';
    const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syb = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let r = '';
    for (let i = 0; i < val.length; i++) {
      while (n >= val[i]) {
        r += syb[i];
        n -= val[i];
      }
    }
    return r;
  };

  const handleNumChange = (val: number) => {
    setNum(val);
    setRoman(toRoman(val));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Standard Number (1 - 3999)</label>
          <input
            type="number"
            min={1}
            max={3999}
            value={num}
            onChange={(e) => handleNumChange(Number(e.target.value))}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-2xl font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Roman Numeral</label>
          <div className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {roman}
          </div>
        </div>
      </div>
    </div>
  );
};
