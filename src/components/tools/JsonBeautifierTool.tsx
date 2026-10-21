import React, { useState } from 'react';
import { Copy, Check, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const JsonBeautifierTool: React.FC = () => {
  const [input, setInput] = useState('{"name":"PocketKit","version":"2.0","features":["100% Client-Side","Offline PWA","Android APK","Zero Tracking"],"stats":{"tools":70,"speedMs":12}}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleBeautify = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
    }
  };

  React.useEffect(() => {
    handleBeautify();
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t('json.instruction', 'Paste raw JSON on the left to validate and format it into clean indented JSON on the right.')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Raw Input JSON
            </label>
            <button
              onClick={() => setInput('')}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
            >
              {t('tool.clear', 'Clear')}
            </button>
          </div>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Beautified Output
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy')}
              </button>
            )}
          </div>
          {error ? (
            <div className="h-[250px] p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Syntax Error:</span>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              rows={12}
              value={output}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
};
