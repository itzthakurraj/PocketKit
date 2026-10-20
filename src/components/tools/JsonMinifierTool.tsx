import React, { useState } from 'react';
import { Copy, Check, Minimize2, AlertCircle } from 'lucide-react';

export const JsonMinifierTool: React.FC = () => {
  const [input, setInput] = useState(
    '{\n  "project": "Toolkit",\n  "status": "ready",\n  "stats": {\n    "tools": 30,\n    "framework": "React"\n  }\n}'
  );
  const [minified, setMinified] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const res = JSON.stringify(parsed);
      setMinified(res);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const originalBytes = new Blob([input]).size;
  const minifiedBytes = minified ? new Blob([minified]).size : 0;
  const savedBytes = Math.max(0, originalBytes - minifiedBytes);
  const savedPercent = originalBytes > 0 && minified ? Math.round((savedBytes / originalBytes) * 100) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(minified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <button
          onClick={handleMinify}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
          Minify & Compress JSON
        </button>

        {minified && (
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>
              Original: <strong className="text-slate-900 dark:text-white">{originalBytes} B</strong>
            </span>
            <span>
              Minified: <strong className="text-slate-900 dark:text-white">{minifiedBytes} B</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
              Saved {savedPercent}%
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Uncompressed JSON
          </label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Paste formatted JSON here..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Minified Single-Line Output
            </label>
            {minified && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            rows={10}
            readOnly
            value={minified}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono text-xs"
            placeholder="Minified output will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
