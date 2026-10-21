import React, { useState, useMemo } from 'react';
import { GitCompare, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const DiffCheckerTool: React.FC = () => {
  const [originalText, setOriginalText] = useState('The quick brown fox jumps over the lazy dog.\nAlways be coding and learning.');
  const [modifiedText, setModifiedText] = useState('The fast brown fox leaps over the lazy dog.\nAlways be building and shipping.');
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const diffLines = useMemo(() => {
    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');
    const maxLen = Math.max(origLines.length, modLines.length);
    const result: Array<{ line: number; orig?: string; mod?: string; status: 'same' | 'changed' | 'added' | 'removed' }> = [];

    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i];
      const mod = modLines[i];

      if (orig === undefined) {
        result.push({ line: i + 1, orig: '', mod, status: 'added' });
      } else if (mod === undefined) {
        result.push({ line: i + 1, orig, mod: '', status: 'removed' });
      } else if (orig === mod) {
        result.push({ line: i + 1, orig, mod, status: 'same' });
      } else {
        result.push({ line: i + 1, orig, mod, status: 'changed' });
      }
    }
    return result;
  }, [originalText, modifiedText]);

  const changedCount = diffLines.filter((l) => l.status !== 'same').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4" />
          <span>{t('diff.instruction', 'Enter original text on the left and revised text on the right to see differences highlighted.')}</span>
        </div>
        <button
          onClick={() => {
            if (isSpeaking) stopSpeaking();
            else speak(`Found ${changedCount} difference lines between original and modified text.`);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{t('tool.speak', 'Listen 🔊')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            {t('diff.original', 'Original Text')}
          </label>
          <textarea
            rows={6}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            {t('diff.modified', 'Modified Text')}
          </label>
          <textarea
            rows={6}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Visual Difference Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden font-mono text-xs">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 font-bold flex items-center justify-between text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            {t('diff.comparison', 'Line Comparison')}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            {changedCount} {t('diff.changes', 'changes')}
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
          {diffLines.map((item) => (
            <div
              key={item.line}
              className={`p-2 grid grid-cols-12 gap-2 items-center ${
                item.status === 'changed'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30'
                  : item.status === 'added'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                  : item.status === 'removed'
                  ? 'bg-red-50/70 dark:bg-red-950/30'
                  : 'bg-white dark:bg-slate-900'
              }`}
            >
              <span className="col-span-1 text-slate-400 font-bold">{item.line}</span>
              <span className="col-span-5 text-red-600 dark:text-red-400 truncate line-through">
                {item.orig || <span className="opacity-40 italic">empty</span>}
              </span>
              <span className="col-span-6 text-emerald-600 dark:text-emerald-400 truncate font-semibold">
                {item.mod || <span className="opacity-40 italic">empty</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
