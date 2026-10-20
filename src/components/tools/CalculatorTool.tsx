import React, { useState, useEffect } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

export const CalculatorTool: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number>(0);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleDigit = (digit: string) => {
    if (display === '0' || hasCalculated) {
      setDisplay(digit);
      setHasCalculated(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
    setHasCalculated(false);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setHasCalculated(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleEqual = () => {
    try {
      const fullExpression = equation + display;
      // Sanitize equation to only allow numbers, math operators, parens
      const sanitized = fullExpression.replace(/[^0-9+\-*/().]/g, '');
      // Evaluate safely with standard math operators
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setHasCalculated(true);
    } catch {
      setDisplay('Error');
      setHasCalculated(true);
    }
  };

  const handleScientific = (fn: string) => {
    const num = parseFloat(display);
    if (isNaN(num)) return;
    let res = 0;
    switch (fn) {
      case 'sqrt': res = Math.sqrt(num); break;
      case 'sqr': res = Math.pow(num, 2); break;
      case 'sin': res = Math.sin((num * Math.PI) / 180); break;
      case 'cos': res = Math.cos((num * Math.PI) / 180); break;
      case 'tan': res = Math.tan((num * Math.PI) / 180); break;
      case 'log': res = Math.log10(num); break;
      case 'ln': res = Math.log(num); break;
      case 'neg': res = -num; break;
      case 'recip': res = 1 / num; break;
    }
    setDisplay(String(Number(res.toFixed(8))));
    setHasCalculated(true);
  };

  return (
    <div className="max-w-md mx-auto p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
      {/* Screen */}
      <div className="p-4 rounded-xl bg-slate-950 text-right space-y-1">
        <div className="text-xs font-mono text-slate-500 h-4 overflow-hidden">
          {equation}
        </div>
        <div className="text-3xl font-mono font-bold text-emerald-400 overflow-x-auto whitespace-nowrap">
          {display}
        </div>
      </div>

      {/* Memory & Quick Action Row */}
      <div className="grid grid-cols-4 gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
        <button
          onClick={() => setMemory(0)}
          className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
        >
          MC
        </button>
        <button
          onClick={() => setDisplay(String(memory))}
          className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
        >
          MR
        </button>
        <button
          onClick={() => setMemory((prev) => prev + (parseFloat(display) || 0))}
          className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
        >
          M+
        </button>
        <button
          onClick={() => setMemory((prev) => prev - (parseFloat(display) || 0))}
          className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
        >
          M-
        </button>
      </div>

      {/* Scientific Row */}
      <div className="grid grid-cols-5 gap-2 text-xs font-semibold">
        <button
          onClick={() => handleScientific('sin')}
          className="py-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
        >
          sin
        </button>
        <button
          onClick={() => handleScientific('cos')}
          className="py-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
        >
          cos
        </button>
        <button
          onClick={() => handleScientific('tan')}
          className="py-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
        >
          tan
        </button>
        <button
          onClick={() => handleScientific('sqrt')}
          className="py-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
        >
          √x
        </button>
        <button
          onClick={() => handleScientific('sqr')}
          className="py-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
        >
          x²
        </button>
      </div>

      {/* Main Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 text-sm font-bold">
        <button
          onClick={handleClear}
          className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200"
        >
          C
        </button>
        <button
          onClick={handleBackspace}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleScientific('neg')}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
        >
          ±
        </button>
        <button
          onClick={() => handleOperator('/')}
          className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200"
        >
          ÷
        </button>

        {['7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('*')}
          className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200"
        >
          ×
        </button>

        {['4', '5', '6'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('-')}
          className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200"
        >
          −
        </button>

        {['1', '2', '3'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperator('+')}
          className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200"
        >
          +
        </button>

        <button
          onClick={() => handleDigit('0')}
          className="col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
        >
          0
        </button>
        <button
          onClick={() => {
            if (!display.includes('.')) handleDigit('.');
          }}
          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
        >
          .
        </button>
        <button
          onClick={handleEqual}
          className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
        >
          =
        </button>
      </div>
    </div>
  );
};
