import React, { useState } from 'react';
import { computeTextStats } from '../../utils/textUtils';
import { Clock, Volume2, FileText, AlignLeft, Hash, Copy, Check, Trash2 } from 'lucide-react';

export const CharacterCountTool: React.FC = () => {
  const [text, setText] = useState(
    'Welcome to Toolkit! This tool provides instant, comprehensive metrics for any article, essay, or snippet. It calculates character counts, word density, reading duration, and sentence structures without uploading any data to remote servers.'
  );
  const [copied, setCopied] = useState(false);

  const stats = computeTextStats(text);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-indigo-50 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-slate-700 text-center">
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats.words.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Words</div>
        </div>

        <div className="p-3.5 bg-emerald-50 dark:bg-slate-800/80 rounded-xl border border-emerald-100 dark:border-slate-700 text-center">
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.characters.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Characters</div>
        </div>

        <div className="p-3.5 bg-cyan-50 dark:bg-slate-800/80 rounded-xl border border-cyan-100 dark:border-slate-700 text-center">
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {stats.charactersNoSpaces.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">No Spaces</div>
        </div>

        <div className="p-3.5 bg-amber-50 dark:bg-slate-800/80 rounded-xl border border-amber-100 dark:border-slate-700 text-center">
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {stats.sentences.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Sentences</div>
        </div>

        <div className="p-3.5 bg-purple-50 dark:bg-slate-800/80 rounded-xl border border-purple-100 dark:border-slate-700 text-center">
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Paragraphs</div>
        </div>

        <div className="p-3.5 bg-rose-50 dark:bg-slate-800/80 rounded-xl border border-rose-100 dark:border-slate-700 text-center">
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {stats.readingTimeMinutes} <span className="text-xs font-normal">m</span>
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Read Time</div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        <textarea
          rows={11}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste content to inspect live character and word statistics..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-y"
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
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Auxiliary Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timing Estimates */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Speech & Read Estimates
          </h4>
          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200/50 dark:border-slate-700/50">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-indigo-500" /> Silent Reading Speed (200 wpm)
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              ~{Math.round(stats.readingTimeMinutes * 60)} sec ({stats.readingTimeMinutes} min)
            </span>
          </div>
          <div className="flex items-center justify-between text-sm py-1">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Volume2 className="w-4 h-4 text-emerald-500" /> Speaking Speed (130 wpm)
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              ~{Math.round(stats.speakingTimeMinutes * 60)} sec ({stats.speakingTimeMinutes} min)
            </span>
          </div>
        </div>

        {/* Word Density */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Top Word Frequency
          </h4>
          {stats.topWords.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No repeated key words yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {stats.topWords.map(({ word, count }) => (
                <span
                  key={word}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="font-medium">{word}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                    {count}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
