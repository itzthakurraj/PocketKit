import React, { useState } from 'react';
import { calculateAgeDetails, AgeBreakdown } from '../../utils/calculatorUtils';
import { Calendar, Cake, Compass, Clock, Award } from 'lucide-react';

export const AgeCalculatorTool: React.FC = () => {
  const [dob, setDob] = useState('2000-01-01');
  const details = calculateAgeDetails(dob);

  return (
    <div className="space-y-6">
      {/* Date Picker Input */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Select Your Date of Birth:
          </span>
          <input
            type="date"
            value={dob}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDob(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {details && (
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Next Birthday in {details.daysUntilNextBirthday} days! 🎂
          </div>
        )}
      </div>

      {details ? (
        <div className="space-y-6">
          {/* Main Primary Age Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white shadow-lg text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">
              Your Current Age
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {details.years} <span className="text-base font-normal text-indigo-100">Years</span> {details.months}{' '}
              <span className="text-base font-normal text-indigo-100">Months</span> {details.days}{' '}
              <span className="text-base font-normal text-indigo-100">Days</span>
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
              <div className="text-xs text-slate-400 font-medium mt-0.5">Total Days Lived</div>
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
              <div className="text-xs text-slate-400 font-medium mt-0.5">Days to Birthday</div>
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
