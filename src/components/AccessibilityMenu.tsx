import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  Eye,
  Type,
  Check,
  Zap,
  Activity,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface AccessibilityMenuProps {
  className?: string;
  onOpenVoiceModal?: () => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({
  className = '',
  onOpenVoiceModal,
}) => {
  const {
    t,
    hapticsEnabled,
    setHapticsEnabled,
    soundAssistance,
    setSoundAssistance,
    hapticIntensity,
    setHapticIntensity,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    readCurrentPage,
    isSpeaking,
    stopSpeaking,
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleTestHaptic = () => {
    triggerHaptic('success');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button with prominent tactile icon */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 flex items-center gap-1.5 ${
          isOpen
            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 shadow-xs'
        }`}
        title={t('header.accessibility', 'Accessibility & Haptics')}
        aria-label={t('header.accessibility', 'Accessibility & Haptics')}
        aria-expanded={isOpen}
      >
        <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden xl:inline">{t('header.accessibility', 'Accessibility')}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Accessibility Settings"
          className="absolute right-0 mt-2 w-76 sm:w-84 rounded-3xl bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {t('header.accessibility', 'Accessibility & Haptics')}
                </h4>
                <p className="text-[10px] text-slate-400">Tactile & Audio assistance</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsOpen(false);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Read Page Aloud Button */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                readCurrentPage();
              }}
              className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                isSpeaking
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:from-indigo-700 hover:to-emerald-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? t('a11y.stopSpeaking', 'Stop Voice') : t('a11y.readPage', 'Read Page Aloud')}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">Audio</span>
            </button>
          </div>

          {/* Tactile Haptic Vibration Toggle */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  {t('a11y.haptics', 'Tactile Vibration (Haptics)')}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Tactile buzz on tool and button clicks
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHapticsEnabled(!hapticsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  hapticsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-pressed={hapticsEnabled}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    hapticsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Vibration Intensity Options */}
            {hapticsEnabled && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-slate-500">{t('a11y.intensity', 'Strength')}:</span>
                <div className="flex items-center gap-1">
                  {(['soft', 'medium', 'strong'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setHapticIntensity(lvl)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                        hapticIntensity === lvl
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      {lvl === 'soft' ? t('a11y.intensitySoft', 'Soft') : lvl === 'medium' ? t('a11y.intensityMedium', 'Medium') : t('a11y.intensityStrong', 'Strong')}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleTestHaptic}
                    className="ml-1 px-1.5 py-0.5 text-[10px] text-indigo-600 dark:text-indigo-400 underline font-bold cursor-pointer"
                    title="Test vibration now"
                  >
                    Test
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sound Assistance Toggle (Earcon clicks for visual impairments) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                {t('a11y.soundAssistance', 'Audible Click Assistance')}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Subtle clicks on interactive elements
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSoundAssistance(!soundAssistance)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundAssistance ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-pressed={soundAssistance}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  soundAssistance ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                {t('a11y.highContrast', 'High Contrast Mode')}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Sharp borders & enhanced readability
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                highContrast ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-pressed={highContrast}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  highContrast ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
              {t('a11y.fontSize', 'Text Size Scaling')}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Normal (A)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Large (A+)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xl')}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fontSize === 'xl'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Extra (A++)
              </button>
            </div>
          </div>

          {/* Voice Assistant Shortcut Link */}
          {onOpenVoiceModal && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                setIsOpen(false);
                onOpenVoiceModal();
              }}
              className="w-full py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Open Voice Navigation Modal</span>
              </div>
              <span className="text-[10px] font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-2xs">
                Alt+V
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
