import React, { useEffect, useState } from 'react';
import { ToolItem } from '../types';
import { IconRenderer } from './IconRenderer';
import { ToolRenderer } from './ToolRenderer';
import { X, Star, ArrowLeft, Share2, Check, Volume2, VolumeX } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedTool } from '../utils/toolLocalization';
import { triggerHaptic } from '../utils/haptics';

interface ToolModalProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onClose,
}) => {
  const { language, t, speak, isSpeaking, stopSpeaking } = useLanguage();
  const [copiedShare, setCopiedShare] = useState(false);
  const localized = getLocalizedTool(tool, language, t);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerHaptic('light');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleShare = () => {
    triggerHaptic('success');
    const url = `${window.location.origin}/#${tool.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  const handleToggleVoice = () => {
    triggerHaptic('voice');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(`${localized.localizedName}. ${localized.localizedDescription}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center shrink-0">
                <IconRenderer name={tool.icon} className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                  {localized.localizedName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {localized.localizedDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Accessible Audio Guide (Reads Tool Description & Instructions) */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-red-500 text-white animate-pulse border-red-400 ring-2 ring-red-400/40'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700'
                }`}
                title={isSpeaking ? t('a11y.stopSpeaking', 'Stop Voice') : t('tool.readInstructions', 'Listen to Instructions (Voice)')}
                aria-label={isSpeaking ? t('a11y.stopSpeaking', 'Stop Voice') : t('tool.readInstructions', 'Listen to Instructions')}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title={t('tool.share', 'Share Tool')}
              >
                {copiedShare ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={(e) => {
                  triggerHaptic('light');
                  onToggleFavorite(tool.id, e);
                }}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-500 border-amber-300'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-amber-400'
                }`}
                title={isFavorite ? t('tool.removeFavorite', 'Remove favorite') : t('tool.addFavorite', 'Save to favorites')}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title={`${t('tool.close', 'Close')} (ESC)`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Tool Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          <ToolRenderer tool={tool} />
          {/* AdSense In-Tool Banner */}
          <AdBanner slotId="1000000002" format="auto" className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800" />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {t('nav.allTools', 'All Tools')}
          </button>
          <span>{t('hero.stat2Label', '100% Client-Side Private')}</span>
        </div>
      </div>
    </div>
  );
};
