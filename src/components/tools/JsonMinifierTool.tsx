import React, { useState } from 'react';
import { Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const JsonMinifierTool: React.FC = () => {
  const [input, setInput] = useState('{\n  "app": "PocketKit",\n  "tools": 70,\n  "offline": true\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleMinify = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  React.useEffect(() => {
    handleMinify();
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savedBytes = Math.max(0, input.length - output.length);
  const percentSaved = input.length > 0 ? Math.round((savedBytes / input.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Input JSON ({input.length} bytes)
          </label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Minified JSON ({output.length} bytes)
            </label>
            {output && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Saved {savedBytes} bytes ({percentSaved}%)
              </span>
            )}
          </div>
          {error ? (
            <div className="h-[200px] p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-mono">
              <span className="font-bold">Error:</span> {error}
            </div>
          ) : (
            <textarea
              readOnly
              rows={10}
              value={output}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy Minified')}</span>
        </button>
      </div>
    </div>
  );
};
