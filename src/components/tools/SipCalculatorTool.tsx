import React, { useState } from 'react';
import { Volume2, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const SipCalculatorTool: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [returnRate, setReturnRate] = useState(12);
  const [years, setYears] = useState(10);
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const totalMonths = years * 12;
  const monthlyRate = returnRate / 12 / 100;
  const totalInvested = monthlyInvestment * totalMonths;

  // FV = P * [ (1 + i)^n - 1 ] * (1 + i) / i
  const estimatedReturns =
    monthlyRate > 0
      ? monthlyInvestment *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate)
      : totalInvested;

  const totalGains = estimatedReturns - totalInvested;

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(`Investing ${monthlyInvestment} monthly for ${years} years yields an estimated wealth of ${Math.round(estimatedReturns).toLocaleString()}.`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t('sip.instruction', 'Estimate your future compounding wealth through regular monthly SIP investments.')}</span>
        </div>
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? t('a11y.speaking', 'Speaking...') : t('tool.speak', 'Listen Result 🔊')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Monthly Investment
          </label>
          <input
            type="number"
            min={500}
            step={500}
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)}
            className="w-full p-3 font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Expected Return (% p.a.)
          </label>
          <input
            type="number"
            min={1}
            max={40}
            step={0.5}
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value) || 0)}
            className="w-full p-3 font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Time Period (Years)
          </label>
          <input
            type="number"
            min={1}
            max={40}
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 1)}
            className="w-full p-3 font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invested Capital</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {Math.round(totalInvested).toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 text-center">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Est. Wealth Gains</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            +{Math.round(totalGains).toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Future Value</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round(estimatedReturns).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
