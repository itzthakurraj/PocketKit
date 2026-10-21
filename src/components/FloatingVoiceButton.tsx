import React from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

import { triggerHaptic } from '../utils/haptics';

interface FloatingVoiceButtonProps {
  isListening: boolean;
  onOpenVoiceModal: () => void;
  isOfflineVoiceReady: boolean;
}

export const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = ({
  isListening,
  onOpenVoiceModal,
  isOfflineVoiceReady,
}) => {
  const { t } = useLanguage();

  const handleClick = () => {
    triggerHaptic('voice');
    onOpenVoiceModal();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 print:hidden">
      {/* Keyboard Hint Pill */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md border border-white/10 pointer-events-none">
        <Sparkles className="w-3 h-3 text-indigo-400" />
        <span>Voice (Alt+V)</span>
      </div>

      {/* Floating Microphone Trigger */}
      <button
        onClick={handleClick}
        className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all cursor-pointer active:scale-95 ${
          isListening
            ? 'bg-red-500 text-white ring-4 ring-red-400/50 animate-pulse'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30'
        }`}
        title="Open Voice Assistant & Navigation (Alt+V)"
        aria-label="Open Voice Assistant and Navigation (Keyboard shortcut Alt+V)"
      >
        <Mic className="w-6 h-6" />

        {/* Pulse Waves when listening */}
        {isListening && (
          <span className="absolute inset-0 rounded-2xl bg-red-400/40 animate-ping pointer-events-none" />
        )}

        {/* Offline voice badge */}
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
          title="On-device Offline Voice Ready"
        />
      </button>
    </div>
  );
};
