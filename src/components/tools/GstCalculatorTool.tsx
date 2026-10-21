import React, { useState } from 'react';
import { Volume2, Receipt, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

export const GstCalculatorTool: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [rate, setRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const gstAmount = isInclusive
    ? (amount - (amount * (100 / (100 + rate))))
    : (amount * rate) / 100;

  const totalAmount = isInclusive ? amount : amount + gstAmount;
  const netAmount = isInclusive ? amount - gstAmount : amount;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const handleSpeak = () => {
    triggerHaptic('voice');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const speech = `Total amount is ${totalAmount.toFixed(2)}, including GST tax of ${gstAmount.toFixed(2)} at ${rate} percent.`;
      speak(speech);
    }
  };

  return (
    <div className="space-y-5">
      {/* Voice Read Aloud Bar for Accessibility */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{t('gst.instruction', 'Enter base amount and choose tax rate slab to see exact tax split.')}</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Amount (Currency)
          </label>
          <input
            type="number"
            min={0}
            step="any"
            value={amount}
            onChange={(e) => {
              setAmount(Number(e.target.value) || 0);
              triggerHaptic('light');
            }}
            className="w-full p-3 font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Tax Type
          </label>
          <div className="grid grid-cols-2 gap-2 h-[46px]">
            <button
              onClick={() => {
                triggerHaptic('selection');
                setIsInclusive(false);
              }}
              className={`rounded-xl font-bold text-xs transition-colors cursor-pointer active:scale-95 ${
                !isInclusive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Exclusive (Add GST)
            </button>
            <button
              onClick={() => {
                triggerHaptic('selection');
                setIsInclusive(true);
              }}
              className={`rounded-xl font-bold text-xs transition-colors cursor-pointer active:scale-95 ${
                isInclusive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Inclusive (Extract GST)
            </button>
          </div>
        </div>
      </div>

      {/* Tax Slabs */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select Standard GST / VAT Slab
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[5, 12, 18, 28, 0].map((r) => (
            <button
              key={r}
              onClick={() => {
                triggerHaptic('selection');
                setRate(r);
              }}
              className={`py-2 rounded-xl font-black text-sm transition-colors cursor-pointer active:scale-95 ${
                rate === r
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r}%
            </button>
          ))}
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Amount</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {netAmount.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-center">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">GST Tax ({rate}%)</span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
            +{gstAmount.toFixed(2)}
          </div>
          <div className="text-[10px] text-amber-600/80 mt-1">
            CGST: {cgst.toFixed(2)} | SGST: {sgst.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Amount</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
