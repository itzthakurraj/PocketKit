import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, ChevronDown, Check, Volume2, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language, RegionGroup } from '../i18n/translations';
import { triggerHaptic } from '../utils/haptics';

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

const REGION_TABS: RegionGroup[] = ['All', 'South Asia', 'Global', 'Americas', 'Europe', 'Middle East', 'East Asia'];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false, className = '' }) => {
  const { language, setLanguage, t, speak } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<RegionGroup>('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter((item) => {
      if (activeRegion !== 'All' && item.region !== activeRegion) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.nativeName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.dialect && item.dialect.toLowerCase().includes(q))
      );
    });
  }, [activeRegion, searchQuery]);

  const handleSelect = (code: Language) => {
    triggerHaptic('medium');
    setLanguage(code);
    setIsOpen(false);
  };

  const handlePreviewVoice = (item: (typeof LANGUAGES)[number], e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('selection');
    const greetings: Record<string, string> = {
      en: 'Welcome to PocketKit',
      'en-IN': 'Namaste, welcome to PocketKit',
      hi: 'पॉकेटकिट में आपका स्वागत है',
      bho: 'पॉकेटकिट में रउआ के स्वागत बा',
      bn: 'PocketKit এ আপনাকে স্বাগতম',
      te: 'పాకెట్‌కిట్‌కు స్వాగతం',
      ta: 'PocketKit-க்கு வரவேற்கிறோம்',
      mr: 'PocketKit मध्ये आपले स्वागत आहे',
      gu: 'PocketKit માં આપનું સ્વાગત છે',
      kn: 'PocketKit ಗೆ ಸುಸ್ವಾಗತ',
      ml: 'PocketKit-ലേക്ക് സ്വാഗതം',
      pa: 'ਪੌਕੇਟਕਿੱਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
      ur: 'پاکٹ کٹ میں خوش آمدید',
      or: 'PocketKit କୁ ସ୍ୱାଗତ',
      es: 'Bienvenido a PocketKit',
      'es-MX': 'Bienvenido a PocketKit',
      fr: 'Bienvenue sur PocketKit',
      de: 'Willkommen bei PocketKit',
      pt: 'Bem-vindo ao PocketKit',
      ar: 'أهلاً بك في بوكيت كيت',
      zh: '欢迎使用 PocketKit',
      ja: 'PocketKit へようこそ',
    };
    const speechText = greetings[item.code] || `Welcome in ${item.name}`;
    speak(speechText);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          triggerHaptic('light');
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-xl text-xs font-semibold transition-all border cursor-pointer active:scale-95 ${
          isOpen
            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 shadow-xs'
        }`}
        aria-label={t('header.language', 'Language & Dialect')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`${t('header.language', 'Language')}: ${currentOption.nativeName} (${currentOption.name})`}
      >
        <span className="text-sm sm:text-base leading-none select-none">{currentOption.flag}</span>
        {!compact && (
          <span className="hidden sm:inline font-bold text-xs tracking-tight text-slate-800 dark:text-slate-100">
            {currentOption.nativeName}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-72 sm:w-84 max-h-[85vh] overflow-hidden rounded-2xl bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        >
          {/* Header */}
          <div className="px-3.5 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {t('header.language', 'Language & Regional Dialects')}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
              {LANGUAGES.length} {t('footer.categories', 'Dialects')}
            </span>
          </div>

          {/* Quick Search */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language or dialect..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Region Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pt-2 no-scrollbar">
              {REGION_TABS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveRegion(region);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    activeRegion === region
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Language Options List */}
          <div className="overflow-y-auto max-h-64 p-1 space-y-0.5">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching languages found
              </div>
            ) : (
              filteredLanguages.map((item) => {
                const isSelected = item.code === language;
                return (
                  <div
                    key={item.code}
                    role="menuitem"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg select-none shrink-0">{item.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {item.nativeName}
                          </span>
                          {item.isRtl && (
                            <span className="text-[9px] uppercase font-mono px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                              RTL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                          <span>{item.name}</span>
                          {item.dialect && (
                            <>
                              <span>•</span>
                              <span className="text-indigo-500 font-medium">{item.dialect}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {/* Audio Voice Sample Button */}
                      <button
                        type="button"
                        onClick={(e) => handlePreviewVoice(item, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        title={`Listen to sample greeting in ${item.nativeName}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>✨ 100% On-Device Translation</span>
            <span className="text-indigo-500 font-bold">APK & Web Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};
