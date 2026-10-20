import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Keyboard, RotateCcw, Trophy, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const LESSONS = {
  quotes: [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect when learning any productive craft.",
    "Success is the sum of small continuous efforts repeated day in and day out.",
    "Code is like humor. When you have to explain it, it is bad.",
    "Simplicity is the soul of efficiency in software design."
  ],
  homeRow: [
    "sad lad fall jazz flash slash hall salad ask dad glad half",
    "all dads fall as salads jazz hall lads ask for flags"
  ],
  topRow: [
    "quiet type power writer upper equip tower queue write quote",
    "pure query write tree root power equip require prioritize"
  ]
};

export const TypingTestTool: React.FC = () => {
  const [category, setCategory] = useState<'quotes' | 'homeRow' | 'topRow'>('quotes');
  const [targetText, setTargetText] = useState(LESSONS.quotes[0]);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [errorsCount, setErrorsCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Pick random sentence
  const resetTest = (cat = category) => {
    const list = LESSONS[cat];
    const picked = list[Math.floor(Math.random() * list.length)];
    setTargetText(picked);
    setInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
    setErrorsCount(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    resetTest(category);
  }, [category]);

  // Timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (startTime && !isFinished) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Check errors
    let errs = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== targetText[i]) {
        errs++;
      }
    }
    setErrorsCount(errs);
    setInput(val);

    if (val === targetText) {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Metrics
  const minutes = Math.max(0.01, (Date.now() - (startTime || Date.now())) / 60000);
  const wordsTyped = input.trim().length / 5;
  const wpm = startTime && input.length > 0 ? Math.round(wordsTyped / minutes) : 0;
  const accuracy =
    input.length > 0
      ? Math.max(0, Math.round(((input.length - errorsCount) / input.length) * 100))
      : 100;

  return (
    <div className="space-y-6">
      {/* Lesson Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lesson Mode:</span>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-medium">
            <button
              onClick={() => {
                setCategory('quotes');
                resetTest('quotes');
              }}
              className={`px-3 py-1.5 transition-colors ${
                category === 'quotes'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              General Quotes
            </button>
            <button
              onClick={() => {
                setCategory('homeRow');
                resetTest('homeRow');
              }}
              className={`px-3 py-1.5 transition-colors ${
                category === 'homeRow'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Home Row (A-S-D-F-J-K-L)
            </button>
            <button
              onClick={() => {
                setCategory('topRow');
                resetTest('topRow');
              }}
              className={`px-3 py-1.5 transition-colors ${
                category === 'topRow'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Top Row (Q-W-E-R-T-Y)
            </button>
          </div>
        </div>

        <button
          onClick={() => resetTest()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Test
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3.5 bg-indigo-50 dark:bg-slate-800/80 rounded-xl border border-indigo-100 dark:border-slate-700">
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {wpm}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">WPM (Words / Min)</div>
        </div>

        <div className="p-3.5 bg-emerald-50 dark:bg-slate-800/80 rounded-xl border border-emerald-100 dark:border-slate-700">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {accuracy}%
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Accuracy</div>
        </div>

        <div className="p-3.5 bg-cyan-50 dark:bg-slate-800/80 rounded-xl border border-cyan-100 dark:border-slate-700">
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {elapsedSeconds}s
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Time Elapsed</div>
        </div>

        <div className="p-3.5 bg-rose-50 dark:bg-slate-800/80 rounded-xl border border-rose-100 dark:border-slate-700">
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {errorsCount}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Mistakes</div>
        </div>
      </div>

      {/* Target Text Display Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed text-lg font-mono select-none">
        {targetText.split('').map((char, i) => {
          let colorClass = 'text-slate-400 dark:text-slate-500';
          let bgClass = '';

          if (i < input.length) {
            if (input[i] === char) {
              colorClass = 'text-emerald-600 dark:text-emerald-400 font-bold';
            } else {
              colorClass = 'text-rose-600 dark:text-rose-400 font-bold';
              bgClass = 'bg-rose-100 dark:bg-rose-950/80';
            }
          } else if (i === input.length) {
            bgClass = 'bg-indigo-500 text-white animate-pulse rounded-xs';
          }

          return (
            <span key={i} className={`${colorClass} ${bgClass} transition-colors px-0.5`}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Active Input Field */}
      <div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Start typing the text above to trigger the timer..."
          disabled={isFinished}
          className="w-full p-4 rounded-xl border-2 border-indigo-500/80 dark:border-indigo-400/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-base focus:outline-none shadow-sm disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800"
        />
      </div>

      {/* Completion Banner */}
      {isFinished && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                Great Job! Test Completed.
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You reached <span className="font-bold text-emerald-600 dark:text-emerald-400">{wpm} WPM</span> with{' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{accuracy}% accuracy</span> in {elapsedSeconds}s!
              </p>
            </div>
          </div>

          <button
            onClick={() => resetTest()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
