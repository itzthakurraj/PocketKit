import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const UrlEncoderTool: React.FC = () => {
  const [input, setInput] = useState('https://pocketkit.dev/search?q=free client-side tools & privacy=100%');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { t } = useLanguage();

  React.useEffect(() => {
    try {
      setEncoded(encodeURIComponent(input));
    } catch {
      setEncoded('Error encoding URL');
    }
    try {
      setDecoded(decodeURIComponent(input));
    } catch {
      setDecoded('Error decoding URL');
    }
  }, [input]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
          Input URL or String
        </label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">URL Encoded</span>
            <button
              onClick={() => handleCopy(encoded, 'encoded')}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              {copiedKey === 'encoded' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'encoded' ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy')}
            </button>
          </div>
          <div className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
            {encoded}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">URL Decoded</span>
            <button
              onClick={() => handleCopy(decoded, 'decoded')}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              {copiedKey === 'decoded' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'decoded' ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy')}
            </button>
          </div>
          <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
            {decoded}
          </div>
        </div>
      </div>
    </div>
  );
};
