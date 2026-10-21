import React, { useState } from 'react';
import { Volume2, DollarSign, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const LoanCalculatorTool: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    totalMonths > 0 && monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / (totalMonths || 1);

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(`Monthly loan EMI is ${Math.round(emi)}, with total interest of ${Math.round(totalInterest)} over ${tenureYears} years.`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{t('loan.instruction', 'Calculate your home, car, or personal loan monthly EMI repayment.')}</span>
        </div>
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? t('a11y.speaking', 'Speaking...') : t('tool.speak', 'Listen Result 🔊')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Loan Amount
          </label>
          <input
            type="number"
            min={1000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
            className="w-full p-3 font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min={0.1}
            max={50}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
            className="w-full p-3 font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Tenure (Years)
          </label>
          <input
            type="number"
            min={1}
            max={40}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value) || 1)}
            className="w-full p-3 font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-center">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Monthly EMI</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {Math.round(emi).toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-center">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Total Interest</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {Math.round(totalInterest).toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Payment</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round(totalPayment).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
