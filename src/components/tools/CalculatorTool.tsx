import React, { useState } from 'react';
import { Delete, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

export const CalculatorTool: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const handleDigit = (digit: string) => {
    triggerHaptic('light');
    setDisplay((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleOperator = (op: string) => {
    triggerHaptic('medium');
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      triggerHaptic('success');
      const full = `${equation}${display}`;
      // Clean safe math eval
      const cleanExpr = full.replace(/×/g, '*').replace(/÷/g, '/');
      const sanitized = cleanExpr.replace(/[^0-9+\-*/.() ]/g, '');
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(result));
      setEquation('');
      speak(`${t('tool.result', 'Result is')} ${result}`);
    } catch {
      triggerHaptic('error');
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    triggerHaptic('medium');
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    triggerHaptic('light');
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleSpeakEquation = () => {
    triggerHaptic('voice');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(`${display} ${equation ? ', equation ' + equation : ''}`);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Accessible speech instruction */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>{t('cat.calculator', 'Calculators')}</span>
        </div>
        <button
          onClick={handleSpeakEquation}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{t('tool.speak', 'Listen Result')}</span>
        </button>
      </div>

      {/* Display Screen */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white text-right font-mono border-2 border-slate-800 shadow-inner">
        <div className="h-6 text-xs text-slate-400 truncate">{equation}</div>
        <div className="text-3xl sm:text-4xl font-black text-emerald-400 truncate mt-1">
          {display}
        </div>
      </div>

      {/* Calculator Keypad with tactile response */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={handleClear}
          className="p-3.5 rounded-xl font-black text-sm bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-200 cursor-pointer active:scale-95 transition-transform"
        >
          AC
        </button>
        <button
          onClick={handleBackspace}
          className="p-3.5 rounded-xl font-black text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer flex items-center justify-center active:scale-95 transition-transform"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleOperator('%')}
          className="p-3.5 rounded-xl font-black text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer active:scale-95 transition-transform"
        >
          %
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className="p-3.5 rounded-xl font-black text-base bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer active:scale-95 transition-transform"
        >
          ÷
        </button>

        {['7', '8', '9'].map((n) => (
          <button
            key={n}
            onClick={() => handleDigit(n)}
            className="p-3.5 rounded-xl font-black text-base bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('×')}
          className="p-3.5 rounded-xl font-black text-base bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer active:scale-95 transition-transform"
        >
          ×
        </button>

        {['4', '5', '6'].map((n) => (
          <button
            key={n}
            onClick={() => handleDigit(n)}
            className="p-3.5 rounded-xl font-black text-base bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('-')}
          className="p-3.5 rounded-xl font-black text-base bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer active:scale-95 transition-transform"
        >
          -
        </button>

        {['1', '2', '3'].map((n) => (
          <button
            key={n}
            onClick={() => handleDigit(n)}
            className="p-3.5 rounded-xl font-black text-base bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('+')}
          className="p-3.5 rounded-xl font-black text-base bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer active:scale-95 transition-transform"
        >
          +
        </button>

        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 p-3.5 rounded-xl font-black text-base bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform"
        >
          0
        </button>
        <button
          onClick={() => handleDigit('.')}
          className="p-3.5 rounded-xl font-black text-base bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform"
        >
          .
        </button>
        <button
          onClick={handleEqual}
          className="p-3.5 rounded-xl font-black text-base bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          =
        </button>
      </div>
    </div>
  );
};
