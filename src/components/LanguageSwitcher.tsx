import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/translations';

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false, className = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
          isOpen
            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 ring-2 ring-indigo-500/20'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80'
        }`}
        aria-label={t('header.language', 'Language')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`${t('header.language', 'Language')}: ${currentOption.nativeName}`}
      >
        <span className="text-sm sm:text-base leading-none select-none">{currentOption.flag}</span>
        {!compact && (
          <span className="hidden sm:inline uppercase font-mono text-[11px] tracking-wide text-slate-700 dark:text-slate-200">
            {currentOption.code}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-52 max-h-72 overflow-y-auto rounded-xl bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700/90 shadow-xl shadow-slate-900/10 dark:shadow-black/40 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="sticky top-0 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-xs px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1 z-10 flex items-center justify-between">
            <span>{t('header.language', 'Language')}</span>
            <span className="text-[10px] font-mono text-indigo-500">{LANGUAGES.length}</span>
          </div>
          {LANGUAGES.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                role="menuitem"
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base select-none">{item.flag}</span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                      {item.nativeName}
                    </div>
                    {item.name !== item.nativeName && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">{item.name}</div>
                    )}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
