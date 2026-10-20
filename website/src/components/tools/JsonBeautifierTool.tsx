import React, { useState } from 'react';
import { Copy, Check, Download, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';

const SAMPLE_JSON = `{
  "name": "Toolkit",
  "version": "2.0.0",
  "description": "Multi-tool utility suite",
  "features": [
    "Text manipulation",
    "Image processing",
    "Client-side encryption",
    "Calculators"
  ],
  "settings": {
    "theme": "dark",
    "offlineReady": true
  }
}`;

export const JsonBeautifierTool: React.FC = () => {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indent, setIndent] = useState<number | string>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const space = indent === 'tab' ? '\t' : Number(indent);
      setInput(JSON.stringify(parsed, null, space));
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Indent:</span>
            <select
              value={indent}
              onChange={(e) => {
                const val = e.target.value === 'tab' ? 'tab' : Number(e.target.value);
                setIndent(val);
                try {
                  const parsed = JSON.parse(input);
                  const space = val === 'tab' ? '\t' : Number(val);
                  setInput(JSON.stringify(parsed, null, space));
                  setError(null);
                } catch {}
              }}
              className="text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value="tab">Tab Character</option>
            </select>
          </div>

          <button
            onClick={handleFormat}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            Format & Beautify
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput(SAMPLE_JSON)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Error / Success indicator */}
      {error ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Valid JSON Syntax</span>
        </div>
      )}

      {/* Editor */}
      <div className="relative">
        <textarea
          rows={14}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            try {
              JSON.parse(e.target.value);
              setError(null);
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Invalid JSON');
            }
          }}
          placeholder="Paste or write JSON here..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
        />

        <div className="absolute right-3 bottom-4">
          <button
            onClick={() => {
              setInput('');
              setError(null);
            }}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/80 backdrop-blur rounded-lg border border-slate-700 transition-colors"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
