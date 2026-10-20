import React, { useState } from 'react';
import { convertCase } from '../../utils/textUtils';
import { Copy, Check, Trash2, RotateCcw, ArrowRight } from 'lucide-react';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    { label: 'UPPERCASE', type: 'uppercase' as const },
    { label: 'lowercase', type: 'lowercase' as const },
    { label: 'Title Case', type: 'title' as const },
    { label: 'Sentence case', type: 'sentence' as const },
    { label: 'camelCase', type: 'camel' as const },
    { label: 'PascalCase', type: 'pascal' as const },
    { label: 'snake_case', type: 'snake' as const },
    { label: 'kebab-case', type: 'kebab' as const },
    { label: 'aLtErNaTiNg', type: 'alternating' as const },
    { label: 'InVeRsE', type: 'inverse' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap gap-2">
        {actions.map((act) => (
          <button
            key={act.type}
            onClick={() => setText(convertCase(text, act.type))}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 border border-indigo-200/60 dark:border-slate-700 transition-colors shadow-xs"
          >
            {act.label}
          </button>
        ))}
      </div>

      {/* Editor Box */}
      <div className="relative">
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-y"
        />

        <div className="absolute right-3 bottom-4 flex items-center gap-2">
          <button
            onClick={() => setText('')}
            className="p-2 text-slate-400 hover:text-rose-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-xl font-bold text-slate-800 dark:text-white">
            {text.length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Characters</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-xl font-bold text-slate-800 dark:text-white">
            {text.trim() ? text.trim().split(/\s+/).length : 0}
          </div>
          <div className="text-xs text-slate-400 font-medium">Words</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-xl font-bold text-slate-800 dark:text-white">
            {text.replace(/\s/g, '').length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Without Spaces</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-xl font-bold text-slate-800 dark:text-white">
            {text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length}
          </div>
          <div className="text-xs text-slate-400 font-medium">Sentences</div>
        </div>
      </div>
    </div>
  );
};
