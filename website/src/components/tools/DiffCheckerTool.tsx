import React, { useState } from 'react';
import { computeSimpleDiff } from '../../utils/textUtils';
import { GitCompare, ArrowLeftRight, Trash2, Eye } from 'lucide-react';

export const DiffCheckerTool: React.FC = () => {
  const [original, setOriginal] = useState(
    `function calculateTotal(items) {\n  let sum = 0;\n  for (let i = 0; i < items.length; i++) {\n    sum += items[i].price;\n  }\n  return sum;\n}`
  );
  const [modified, setModified] = useState(
    `function calculateTotal(items) {\n  // Optimized using reduce\n  return items.reduce((acc, item) => acc + item.price, 0);\n}`
  );
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const diffs = computeSimpleDiff(original, modified);
  const additions = diffs.filter((d) => d.type === 'added').length;
  const deletions = diffs.filter((d) => d.type === 'removed').length;

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            +{additions} Additions
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
            -{deletions} Deletions
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-medium">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 transition-colors ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 transition-colors ${
                viewMode === 'unified'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Unified
            </button>
          </div>

          <button
            onClick={handleSwap}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Swap Original & Modified"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Original Text / Code
          </label>
          <textarea
            rows={7}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Paste original version..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Modified Text / Code
          </label>
          <textarea
            rows={7}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Paste revised version..."
          />
        </div>
      </div>

      {/* Diff Result Inspection */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-950 font-mono text-xs">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400 flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-400" /> Comparison Diff Output
          </span>
          <span className="text-[11px] text-slate-500">
            {diffs.length} lines analyzed
          </span>
        </div>

        <div className="overflow-x-auto p-2 max-h-96">
          {diffs.map((diff, index) => {
            const isAdded = diff.type === 'added';
            const isRemoved = diff.type === 'removed';

            return (
              <div
                key={index}
                className={`flex items-start py-0.5 px-2 rounded-xs ${
                  isAdded
                    ? 'bg-emerald-950/60 text-emerald-300'
                    : isRemoved
                    ? 'bg-rose-950/60 text-rose-300'
                    : 'text-slate-300'
                }`}
              >
                <span className="w-8 select-none text-right pr-3 text-slate-600 text-[10px]">
                  {diff.originalLineNum || diff.modifiedLineNum || ''}
                </span>
                <span className="w-5 select-none font-bold">
                  {isAdded ? '+' : isRemoved ? '-' : ' '}
                </span>
                <span className="whitespace-pre-wrap break-all flex-1">
                  {diff.content || ' '}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
