import React, { useState } from 'react';
import { Copy, Check, RotateCcw, ShieldCheck, KeyRound } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(16);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNumbers, setIncNumbers] = useState(true);
  const [incSymbols, setIncSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const generate = () => {
    let chars = '';
    if (incUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (incNumbers) chars += '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  React.useEffect(() => {
    generate();
  }, [length, incUpper, incLower, incNumbers, incSymbols]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Generated Display */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-3">
        <div className="font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white break-all">
          {password}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={generate}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Generate New"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy')}</span>
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Password Length</span>
          <span className="text-indigo-600 dark:text-indigo-400 text-sm">{length} characters</span>
        </div>
        <input
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={incUpper}
            onChange={(e) => setIncUpper(e.target.checked)}
            className="rounded-xs text-indigo-600"
          />
          ABC (Uppercase)
        </label>
        <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={incLower}
            onChange={(e) => setIncLower(e.target.checked)}
            className="rounded-xs text-indigo-600"
          />
          abc (Lowercase)
        </label>
        <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={incNumbers}
            onChange={(e) => setIncNumbers(e.target.checked)}
            className="rounded-xs text-indigo-600"
          />
          123 (Numbers)
        </label>
        <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={incSymbols}
            onChange={(e) => setIncSymbols(e.target.checked)}
            className="rounded-xs text-indigo-600"
          />
          !@# (Symbols)
        </label>
      </div>
    </div>
  );
};
