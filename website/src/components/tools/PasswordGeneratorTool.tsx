import React, { useState } from 'react';
import { generatePassword, PasswordOptions } from '../../utils/cryptoUtils';
import { RefreshCw, Copy, Check, Shield, Key } from 'lucide-react';

export const PasswordGeneratorTool: React.FC = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  });

  const [generated, setGenerated] = useState(() => generatePassword(options));
  const [copied, setCopied] = useState(false);

  const handleGenerate = (opts = options) => {
    setGenerated(generatePassword(opts));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthColor = {
    Weak: 'bg-rose-500 text-rose-600',
    Medium: 'bg-amber-500 text-amber-600',
    Strong: 'bg-indigo-500 text-indigo-600',
    'Very Strong': 'bg-emerald-500 text-emerald-600',
  }[generated.strength];

  return (
    <div className="space-y-6">
      {/* Generated Display Box */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
        <div className="font-mono text-lg sm:text-xl font-bold text-emerald-400 break-all select-all px-2 text-center sm:text-left">
          {generated.password}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleGenerate()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Generate New Password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Password'}</span>
          </button>
        </div>
      </div>

      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
          <span className={strengthColor.split(' ')[1]}>
            {generated.strength} ({generated.entropy} bits entropy)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthColor.split(' ')[0]} transition-all duration-300`}
            style={{ width: `${Math.min(100, (generated.entropy / 90) * 100)}%` }}
          />
        </div>
      </div>

      {/* Settings Grid */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-5">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Password Length
            </label>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {options.length} chars
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={options.length}
            onChange={(e) => {
              const newOpts = { ...options, length: Number(e.target.value) };
              setOptions(newOpts);
              handleGenerate(newOpts);
            }}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Character Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => {
                const newOpts = { ...options, includeUppercase: e.target.checked };
                setOptions(newOpts);
                handleGenerate(newOpts);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => {
                const newOpts = { ...options, includeLowercase: e.target.checked };
                setOptions(newOpts);
                handleGenerate(newOpts);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => {
                const newOpts = { ...options, includeNumbers: e.target.checked };
                setOptions(newOpts);
                handleGenerate(newOpts);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            />
            <span>Numeric Digits (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => {
                const newOpts = { ...options, includeSymbols: e.target.checked };
                setOptions(newOpts);
                handleGenerate(newOpts);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            />
            <span>Special Symbols (!@#$%)</span>
          </label>

          <label className="sm:col-span-2 flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => {
                const newOpts = { ...options, excludeAmbiguous: e.target.checked };
                setOptions(newOpts);
                handleGenerate(newOpts);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            />
            <span>Exclude Ambiguous Characters (e.g. l, 1, I, 0, O)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
