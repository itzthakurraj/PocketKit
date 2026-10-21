import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, RotateCcw, Volume2, Trophy, Clock, Target } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const SAMPLE_TEXTS = [
  'Technology makes our world smaller and connects people across continents in seconds.',
  'PocketKit provides private client-side utilities without tracking or data leakage.',
  'Practice makes perfect when developing typing speed and programming productivity.',
  'Simplicity and privacy are the core values of modern web application engineering.',
];

export const TypingTestTool: React.FC = () => {
  const [sampleIndex, setSampleIndex] = useState(0);
  const targetText = SAMPLE_TEXTS[sampleIndex];
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, speak } = useLanguage();

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setSampleIndex((prev) => (prev + 1) % SAMPLE_TEXTS.length);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }
    setUserInput(val);

    // Calculate real-time accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) correct++;
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    // Check completion
    if (val.length >= targetText.length) {
      setIsFinished(true);
      const elapsedMinutes = (Date.now() - (startTime || Date.now())) / 60000;
      const wordCount = targetText.split(/\s+/).length;
      const calculatedWpm = Math.max(1, Math.round(wordCount / (elapsedMinutes || 0.05)));
      setWpm(calculatedWpm);
    }
  };

  return (
    <div className="space-y-5">
      {/* Target prompt */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-base sm:text-lg font-mono leading-relaxed select-none">
        {targetText.split('').map((char, index) => {
          let colorClass = 'text-slate-400 dark:text-slate-500';
          if (index < userInput.length) {
            colorClass =
              userInput[index] === char
                ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 rounded-xs'
                : 'text-red-500 font-bold bg-red-100 dark:bg-red-950/60 rounded-xs';
          } else if (index === userInput.length) {
            colorClass = 'underline decoration-indigo-500 decoration-2 text-indigo-600 dark:text-indigo-400';
          }
          return (
            <span key={index} className={colorClass}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Input Field */}
      <div>
        <input
          ref={inputRef}
          type="text"
          disabled={isFinished}
          value={userInput}
          onChange={handleInputChange}
          placeholder={t('typing.placeholder', 'Start typing here as quickly and accurately as you can...')}
          className="w-full p-4 rounded-xl border-2 border-indigo-500/50 dark:border-indigo-500/40 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-mono focus:outline-hidden focus:border-indigo-600"
        />
      </div>

      {/* Live / Final Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Trophy className="w-4 h-4" /> WPM
          </div>
          <div className="text-3xl font-black text-indigo-700 dark:text-indigo-300">
            {isFinished ? wpm : '--'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <Target className="w-4 h-4" /> Accuracy
          </div>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
            {accuracy}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
            <Clock className="w-4 h-4" /> Status
          </div>
          <div className="text-sm font-bold text-amber-700 dark:text-amber-300 mt-2">
            {isFinished ? 'Complete! 🎉' : startTime ? 'Typing...' : 'Ready'}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('typing.newTest', 'New Typing Test')}</span>
        </button>
      </div>
    </div>
  );
};
