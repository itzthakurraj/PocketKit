import React, { useState } from 'react';
import { calculateLoan } from '../../utils/calculatorUtils';
import { Landmark, Calendar, DollarSign, Table } from 'lucide-react';

export const LoanCalculatorTool: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(50000);
  const [rate, setRate] = useState<number>(7.5);
  const [years, setYears] = useState<number>(5);

  const result = calculateLoan(principal || 0, rate || 0, years || 1);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Loan Amount ($)
          </label>
          <input
            type="number"
            min={100}
            step={500}
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            min={0.1}
            max={50}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Tenure (Years)
          </label>
          <input
            type="number"
            min={1}
            max={40}
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value) || 1)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Primary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-5 rounded-2xl bg-indigo-600 text-white shadow-md">
          <div className="text-xs font-medium text-indigo-100">Monthly EMI Payment</div>
          <div className="text-3xl font-extrabold mt-1">
            ${result.monthlyEmi.toFixed(2)}
          </div>
          <div className="text-[11px] text-indigo-200 mt-1">
            for {years * 12} installments
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-xs font-medium text-slate-400">Total Interest Payable</div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            ${result.totalInterest.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {((result.totalInterest / (principal || 1)) * 100).toFixed(1)}% of Principal
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-xs font-medium text-slate-400">Total Payment (P + I)</div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            ${result.totalPayment.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Principal + Interest
          </div>
        </div>
      </div>

      {/* Amortization Schedule Preview */}
      {result.amortizationPreview.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Table className="w-4 h-4 text-indigo-500" />
            <span>Repayment Schedule Preview (First Year)</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-56">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                <tr>
                  <th className="p-2.5 font-bold">Month</th>
                  <th className="p-2.5 font-bold">EMI</th>
                  <th className="p-2.5 font-bold">Principal</th>
                  <th className="p-2.5 font-bold">Interest</th>
                  <th className="p-2.5 font-bold">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {result.amortizationPreview.map((item) => (
                  <tr key={item.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300">
                      Month {item.month}
                    </td>
                    <td className="p-2.5 text-slate-900 dark:text-white">${item.emi.toFixed(2)}</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400">${item.principal.toFixed(2)}</td>
                    <td className="p-2.5 text-amber-600 dark:text-amber-400">${item.interest.toFixed(2)}</td>
                    <td className="p-2.5 text-slate-500 font-mono">${item.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
