import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LANGUAGES } from '../../i18n/translations';

export const SpeechTools: React.FC = () => {
  const [text, setText] = useState('Welcome to PocketKit! You can listen to any text read aloud in multiple languages.');
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const { t, speak, stopSpeaking, isSpeaking, language } = useLanguage();

  const handlePlay = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center gap-3">
        <Volume2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <div className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed font-medium">
          <strong>Accessibility & Audio Guide:</strong> This tool reads text aloud in your chosen language. Ideal for non-literate users, accessibility needs, and auditory learning.
        </div>
      </div>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste any text or document here to listen aloud..."
        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm leading-relaxed"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Speed: {rate}x</span>
          <span>Pitch: {pitch}x</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setText('')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 cursor-pointer"
            title="Clear"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePlay}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? t('a11y.stopSpeaking', 'Stop Speaking') : t('a11y.listen', 'Listen Now 🔊')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
