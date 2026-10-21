import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const handleCopy = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    triggerHaptic('voice');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text || t('tool.emptyText', 'Please enter text first'));
    }
  };

  const toUpper = () => {
    triggerHaptic('medium');
    setText(text.toUpperCase());
  };
  const toLower = () => {
    triggerHaptic('medium');
    setText(text.toLowerCase());
  };
  const toTitle = () => {
    triggerHaptic('medium');
    setText(
      text.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
    );
  };
  const toSentence = () => {
    triggerHaptic('medium');
    setText(
      text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
  };
  const toCamel = () => {
    triggerHaptic('medium');
    setText(
      text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '')
    );
  };
  const toKebab = () => {
    triggerHaptic('medium');
    setText(
      text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    );
  };
  const toSnake = () => {
    triggerHaptic('medium');
    setText(
      text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '_')
    );
  };

  const handleClear = () => {
    triggerHaptic('light');
    setText('');
  };

  return (
    <div className="space-y-4">
      {/* Voice Read Aloud & Instruction Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4" />
          <span>{t('case.instruction', 'Type or paste text below, then tap any case button.')}</span>
        </div>
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
          title={t('a11y.listen', 'Listen to text')}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? t('a11y.speaking', 'Speaking...') : t('tool.speak', 'Listen 🔊')}</span>
        </button>
      </div>

      <div className="relative">
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('case.placeholder', 'Type or paste your text here...')}
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
        />
      </div>

      {/* Action Buttons with high contrast and readable labels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={toUpper}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          UPPERCASE
        </button>
        <button
          onClick={toLower}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          lowercase
        </button>
        <button
          onClick={toTitle}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          Title Case
        </button>
        <button
          onClick={toSentence}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          Sentence case
        </button>
        <button
          onClick={toCamel}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          camelCase
        </button>
        <button
          onClick={toKebab}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          kebab-case
        </button>
        <button
          onClick={toSnake}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          snake_case
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-900/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('tool.clear', 'Clear')}
        </button>
      </div>

      {/* Copy / Stats footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {text.length} {t('character.chars', 'Characters')} | {text.trim() ? text.trim().split(/\s+/).length : 0} {t('character.words', 'Words')}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy Result')}</span>
        </button>
      </div>
    </div>
  );
};
