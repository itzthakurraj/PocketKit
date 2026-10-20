import React, { useState } from 'react';
import { calculateGST } from '../../utils/calculatorUtils';
import { Receipt, Percent, DollarSign } from 'lucide-react';

export const GstCalculatorTool: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const gstRates = [3, 5, 12, 18, 28];
  const result = calculateGST(amount || 0, rate || 0, mode);

  return (
    <div className="space-y-6">
      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            {mode === 'exclusive' ? 'Base / Net Price' : 'Total Price (Inc. GST)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* GST Rate */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            GST / Tax Rate (%)
          </label>
          <div className="flex gap-1.5">
            {gstRates.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRate(r)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                  rate === r
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        {/* Tax Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Calculation Type
          </label>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-bold">
            <button
              onClick={() => setMode('exclusive')}
              className={`flex-1 py-2.5 transition-colors ${
                mode === 'exclusive'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Add GST (Exclusive)
            </button>
            <button
              onClick={() => setMode('inclusive')}
              className={`flex-1 py-2.5 transition-colors ${
                mode === 'inclusive'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Remove GST (Inclusive)
            </button>
          </div>
        </div>
      </div>

      {/* Result Breakdown Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Tax Computation Breakdown
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <div className="text-xs font-medium text-slate-400">Net / Pre-tax Amount</div>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
              ${result.netAmount.toFixed(2)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <div className="text-xs font-medium text-slate-400">Total GST ({rate}%)</div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              ${result.gstAmount.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              CGST: ${result.cgst.toFixed(2)} | SGST: ${result.sgst.toFixed(2)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-600 text-white shadow-md">
            <div className="text-xs font-medium text-indigo-100">Final Gross Total</div>
            <div className="text-3xl font-extrabold mt-1">
              ${result.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
