import React, { useState } from 'react';
import { calculateSIP } from '../../utils/calculatorUtils';
import { TrendingUp, DollarSign, PieChart, Sparkles } from 'lucide-react';

export const SipCalculatorTool: React.FC = () => {
  const [monthly, setMonthly] = useState<number>(500);
  const [returnRate, setReturnRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const result = calculateSIP(monthly || 0, returnRate || 0, years || 1);
  const totalVal = Math.max(1, result.totalValue);
  const investedPercent = Math.round((result.investedAmount / totalVal) * 100);
  const returnsPercent = 100 - investedPercent;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            <span>Monthly Deposit ($)</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm font-extrabold">${monthly}</span>
          </div>
          <input
            type="range"
            min={50}
            max={10000}
            step={50}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            <span>Expected Return Rate</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm font-extrabold">{returnRate}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={0.5}
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            <span>Time Horizon (Years)</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm font-extrabold">{years} yrs</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Metrics Result */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-400">Total Invested Capital</div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
            ${Math.round(result.investedAmount).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{investedPercent}% of portfolio</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-400">Est. Compounded Returns</div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            +${Math.round(result.estimatedReturns).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            {returnsPercent}% wealth gain
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white shadow-md">
          <div className="text-xs font-medium text-indigo-100">Expected Total Maturity</div>
          <div className="text-3xl font-extrabold mt-1">
            ${Math.round(result.totalValue).toLocaleString()}
          </div>
          <div className="text-[11px] text-indigo-100 mt-1">Future wealth after {years} years</div>
        </div>
      </div>

      {/* Visual Proportion Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            Invested: ${Math.round(result.investedAmount).toLocaleString()} ({investedPercent}%)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Profit: ${Math.round(result.estimatedReturns).toLocaleString()} ({returnsPercent}%)
          </span>
        </div>

        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="bg-slate-400 dark:bg-slate-600 transition-all duration-300"
            style={{ width: `${investedPercent}%` }}
          />
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${returnsPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
