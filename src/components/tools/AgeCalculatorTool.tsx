import React, { useState } from 'react';
import { calculateAgeDetails, AgeBreakdown } from '../../utils/calculatorUtils';
import { Calendar, Cake, Compass, Clock, Award, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

export const AgeCalculatorTool: React.FC = () => {
  const [dob, setDob] = useState('2000-01-01');
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();
  const details = calculateAgeDetails(dob);

  const handleDateChange = (val: string) => {
    setDob(val);
    triggerHaptic('selection');
  };

  const handleSpeak = () => {
    triggerHaptic('voice');
    if (isSpeaking) {
      stopSpeaking();
    } else if (details) {
      speak(
        `${t('tool.age.currentAge', 'Your current age is')} ${details.years} ${t('tool.age.years', 'years')}, ${details.months} ${t('tool.age.months', 'months')}, and ${details.days} ${t('tool.age.days', 'days')}. Next birthday in ${details.daysUntilNextBirthday} days.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Read Aloud Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>{t('tool.age.dob', 'Select Date of Birth to calculate exact age & countdown.')}</span>
        </div>
        {details && (
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? t('a11y.speaking', 'Speaking...') : t('tool.speak', 'Listen Age 🔊')}</span>
          </button>
        )}
      </div>

      {/* Date Picker Input */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('tool.age.dob', 'Select Your Date of Birth')}:
          </span>
          <input
            type="date"
            value={dob}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {details && (
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <Cake className="w-4 h-4" />
            <span>{t('tool.age.nextBirthday', 'Next Birthday in')} {details.daysUntilNextBirthday} {t('tool.age.days', 'days')}!</span>
          </div>
        )}
      </div>

      {details ? (
        <div className="space-y-6">
          {/* Main Primary Age Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white shadow-lg text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">
              {t('tool.age.currentAge', 'Your Current Age')}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {details.years} <span className="text-base font-normal text-indigo-100">{t('tool.age.years', 'Years')}</span>{' '}
              {details.months} <span className="text-base font-normal text-indigo-100">{t('tool.age.months', 'Months')}</span>{' '}
              {details.days} <span className="text-base font-normal text-indigo-100">{t('tool.age.days', 'Days')}</span>
            </div>
            <p className="text-xs text-indigo-100">
              Born on a {details.dayOfWeekBorn} • Zodiac Sign: {details.zodiacSign}
            </p>
          </div>

          {/* Detailed Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {details.totalDays.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{t('tool.age.totalDays', 'Total Days Lived')}</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {details.totalHours.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Total Hours</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {details.totalMinutes.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Total Minutes</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {details.daysUntilNextBirthday}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{t('tool.age.nextBirthday', 'Days to Birthday')}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400">
          Please select a valid past date of birth.
        </div>
      )}
    </div>
  );
};
