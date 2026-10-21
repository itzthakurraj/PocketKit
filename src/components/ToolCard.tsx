import React from 'react';
import { ToolItem } from '../types';
import { IconRenderer } from './IconRenderer';
import { Star, ArrowRight, Volume2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedTool } from '../utils/toolLocalization';
import { triggerHaptic } from '../utils/haptics';

interface ToolCardProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const { language, t, speak } = useLanguage();
  const localized = getLocalizedTool(tool, language, t);

  const handleClick = () => {
    triggerHaptic('medium');
    onSelect(tool.id);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('selection');
    speak(`${localized.localizedName}. ${localized.localizedDescription}`);
  };

  return (
    <article
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      onFocus={() => triggerHaptic('selection')}
      className="group relative bg-white dark:bg-[#1f2937] rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top gradient border bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 opacity-90 group-hover:h-1.5 transition-all" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Icon Box */}
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800/90 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-all duration-300 shadow-xs">
            <IconRenderer name={tool.icon} className="w-7 h-7" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                {t(`badge.${tool.badge.toLowerCase()}`, tool.badge)}
              </span>
            )}

            {/* Read aloud button for visually impaired users */}
            <button
              type="button"
              onClick={handleSpeak}
              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              title={t('a11y.listen', 'Listen to tool description')}
              aria-label={`${t('a11y.listen', 'Listen')}: ${localized.localizedName}`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Favorite toggle */}
            <button
              onClick={(e) => {
                triggerHaptic('light');
                onToggleFavorite(tool.id, e);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/50'
                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 dark:hover:text-amber-300'
              }`}
              title={isFavorite ? t('tool.removeFavorite', 'Remove favorite') : t('tool.addFavorite', 'Add to favorites')}
              aria-label={isFavorite ? t('tool.removeFavorite', 'Remove favorite') : t('tool.addFavorite', 'Add to favorites')}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {localized.localizedName}
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {localized.localizedDescription}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 capitalize">
          {localized.localizedCategory}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
          {t('tool.open', 'Open Tool')} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
