import React, { useState, useMemo } from 'react';
import { Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const CharacterCountTool: React.FC = () => {
  const [text, setText] = useState('');
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const sentences = trimmed ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = trimmed ? text.split(/\n+/).filter(Boolean).length : 0;
    const readingTimeMinutes = Math.ceil(words / 200);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTimeMinutes,
    };
  }, [text]);

  const handleSpeakStats = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const summary = `${stats.words} words, ${stats.characters} characters, ${stats.sentences} sentences, reading time approximately ${stats.readingTimeMinutes} minute.`;
      speak(summary);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-4 h-4" />
          <span>{t('count.instruction', 'Paste text below to see instant word, character, and sentence analytics.')}</span>
        </div>
        <button
          onClick={handleSpeakStats}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? t('a11y.speaking', 'Speaking...') : t('tool.speak', 'Listen Stats 🔊')}</span>
        </button>
      </div>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('count.placeholder', 'Type or paste content here to count words, characters, and sentences...')}
        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.words}</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('character.words', 'Words')}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.characters}</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('character.chars', 'Characters')}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.charactersNoSpaces}</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('character.noSpaces', 'No Spaces')}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.sentences}</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('character.sentences', 'Sentences')}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.paragraphs}</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('character.paragraphs', 'Paragraphs')}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">~{stats.readingTimeMinutes} m</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('character.readTime', 'Read Time')}</div>
        </div>
      </div>

      {text && (
        <div className="flex justify-end">
          <button
            onClick={() => setText('')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('tool.clear', 'Clear')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
