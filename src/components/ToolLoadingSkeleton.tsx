import React from 'react';

export const ToolLoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-pulse" role="status" aria-label="Loading tool workspace">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-36 sm:w-48" />
            <div className="h-3 bg-slate-200/70 dark:bg-slate-700/60 rounded-md w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-20" />
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-56 sm:h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 p-4 space-y-3">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28" />
          <div className="h-32 bg-slate-200/60 dark:bg-slate-700/40 rounded-xl" />
        </div>
        <div className="h-56 sm:h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 p-4 space-y-3">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28" />
          <div className="h-32 bg-slate-200/60 dark:bg-slate-700/40 rounded-xl" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl w-32" />
      </div>
      <span className="sr-only">Loading workspace tools...</span>
    </div>
  );
};
