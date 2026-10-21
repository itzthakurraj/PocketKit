import React, { useEffect, useState, useRef, useMemo } from 'react';
import { TOOLS_DATA } from '../data/toolsData';
import { ToolItem } from '../types';
import {
  Search,
  X,
  ArrowRight,
  Star,
  Code2,
  Image as ImageIcon,
  FileText,
  Calculator,
  Lock,
  Palette,
  Type,
  Filter,
  Check,
  CornerDownLeft,
} from 'lucide-react';
import { IconRenderer } from './IconRenderer';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedTool } from '../utils/toolLocalization';
import { triggerHaptic } from '../utils/haptics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  favorites: string[];
}

interface FilterTag {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const PRIMARY_TAGS: FilterTag[] = [
  { id: 'development', label: 'Developer', icon: Code2 },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'encryption', label: 'Security', icon: Lock },
  { id: 'web', label: 'Web', icon: Palette },
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  favorites,
}) => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Real-time category counts based on current search query
  const categoryCounts = useMemo(() => {
    const q = query.toLowerCase().trim();
    const queryMatched = q
      ? TOOLS_DATA.filter((tool) => {
          const loc = getLocalizedTool(tool, language, t);
          return (
            tool.name.toLowerCase().includes(q) ||
            loc.localizedName.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            loc.localizedDescription.toLowerCase().includes(q) ||
            tool.category.toLowerCase().includes(q) ||
            loc.localizedCategory.toLowerCase().includes(q) ||
            tool.tags.some((t) => t.toLowerCase().includes(q)) ||
            (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
          );
        })
      : TOOLS_DATA;

    const counts: Record<string, number> = {
      all: queryMatched.length,
    };

    for (const tag of PRIMARY_TAGS) {
      counts[tag.id] = queryMatched.filter((t) => t.category === tag.id).length;
    }

    return counts;
  }, [query, language, t]);

  // Final filtered tools combining query and active category filter
  const filteredTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    return TOOLS_DATA.filter((tool) => {
      // Category filter check
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Query filter check
      if (!q) return true;
      const loc = getLocalizedTool(tool, language, t);
      return (
        tool.name.toLowerCase().includes(q) ||
        loc.localizedName.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        loc.localizedDescription.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        loc.localizedCategory.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q)) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    });
  }, [query, selectedCategory, language, t]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Global key listener for ArrowUp, ArrowDown, Enter, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        triggerHaptic('light');
        if (selectedCategory !== 'all') {
          setSelectedCategory('all');
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        triggerHaptic('selection');
        setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        triggerHaptic('selection');
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
      } else if (e.key === 'Enter') {
        if (filteredTools[selectedIndex]) {
          e.preventDefault();
          triggerHaptic('medium');
          onSelectTool(filteredTools[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedCategory, filteredTools, selectedIndex, onClose, onSelectTool]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#1a202c]">
          <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.inputPlaceholder', 'Search all 70+ tools by name, action, or format...')}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 mr-2 cursor-pointer"
              title={t('tool.clear', 'Clear')}
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          {/* Explicit, accessible Close Button for mobile & desktop */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer shrink-0 active:scale-95 shadow-2xs"
            aria-label={t('search.close', 'Close')}
            title={t('search.close', 'Close')}
          >
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>{t('search.close', 'Close')}</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs ml-0.5">
              ESC
            </kbd>
          </button>
        </div>

        {/* Real-time Category Filter Row */}
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            <Filter className="w-3 h-3 text-indigo-500" />
            <span>{t('tools.filterCategory', 'Filter')}:</span>
          </div>

          {/* 'All' tag */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
            }`}
          >
            <span>{t('cat.all', 'All')}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === 'all'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
              }`}
            >
              {categoryCounts.all}
            </span>
          </button>

          {/* Primary Quick Category Filter Tags: Developer, Image, PDF, etc. */}
          {PRIMARY_TAGS.map((tag) => {
            const isSelected = selectedCategory === tag.id;
            const count = categoryCounts[tag.id] || 0;
            const Icon = tag.icon;
            const tagLabel = t(`cat.${tag.id}`, tag.label);

            return (
              <button
                key={tag.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : tag.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-xs ring-1 ring-indigo-400 font-bold'
                    : count > 0
                    ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
                    : 'bg-slate-100/50 dark:bg-slate-900/30 text-slate-400/50 border border-transparent cursor-not-allowed opacity-40'
                }`}
                disabled={count === 0}
                title={`${tagLabel} (${count})`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tagLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Reset filter button if a category is selected */}
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="ml-auto px-2 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear Filter
            </button>
          )}
        </div>

        {/* Results List */}
        <div
          ref={resultListRef}
          className="overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60"
        >
          {filteredTools.length === 0 ? (
            <div className="py-14 text-center text-slate-400 dark:text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30 text-indigo-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('search.noResults', 'No tools found matching')}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {query ? <span className="font-semibold text-indigo-500">"{query}"</span> : null}
                {selectedCategory !== 'all' ? (
                  <span>
                    {' '}
                    ({t(`cat.${selectedCategory}`, selectedCategory)})
                  </span>
                ) : null}
              </p>
              {(query || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                >
                  {t('tools.resetFilters', 'Reset Search & Filters')}
                </button>
              )}
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const isFav = favorites.includes(tool.id);
              const isKeyboardSelected = index === selectedIndex;
              const localized = getLocalizedTool(tool, language, t);

              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all group ${
                    isKeyboardSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-200 dark:ring-indigo-800/60'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isKeyboardSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 scale-105'
                          : 'bg-gradient-to-tr from-indigo-50 to-indigo-100/60 dark:from-slate-800 dark:to-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100/80 dark:border-slate-700/60 group-hover:scale-105'
                      }`}
                    >
                      <IconRenderer name={tool.icon} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold truncate ${
                            isKeyboardSelected
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        >
                          {localized.localizedName}
                        </h4>
                        {isFav && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 leading-normal">
                        {localized.localizedDescription}
                      </p>

                      {/* Interactive Tool Tags */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(tool.category);
                          }}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors capitalize ${
                            selectedCategory === tool.category
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700'
                          }`}
                          title={`Click to filter by ${localized.localizedCategory}`}
                        >
                          {localized.localizedCategory}
                        </button>
                        {tool.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline"
                          >
                            • {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {isKeyboardSelected ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        <span className="hidden sm:inline">Press</span>
                        <kbd className="px-1.5 py-0.5 text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800 font-mono">
                          ↵
                        </kbd>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                        {t('tool.open', 'Open Tool')}
                      </span>
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition-all ${
                        isKeyboardSelected
                          ? 'text-indigo-600 dark:text-indigo-400 translate-x-1'
                          : 'text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {filteredTools.length} {t('hero.stat1Label', 'tools')}
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-indigo-500 font-medium">
                ({t(`cat.${selectedCategory}`, selectedCategory)})
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>{t('search.hint', 'ESC to close, Click to open')}</span>
          </div>
          <button
            onClick={onClose}
            className="sm:hidden flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 py-1 px-2.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t('search.close', 'Close')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
