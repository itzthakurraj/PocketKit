import React, { useState, useMemo } from 'react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/ToolCard';
import { IconRenderer } from '../components/IconRenderer';
import { AdBanner } from '../components/AdBanner';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedSuite, getLocalizedTool } from '../utils/toolLocalization';
import { triggerHaptic } from '../utils/haptics';

import {
  Search,
  Sparkles,
  Shield,
  Zap,
  Star,
  CheckCircle,
  LayoutGrid,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface HomePageProps {
  tools: ToolItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectTool: (id: string) => void;
  showingFavoritesOnly: boolean;
  onClearFavoritesFilter: () => void;
  recentToolIds?: string[];
  onClearRecentTools?: () => void;
}

// Distinct Visual Themes for each Category to maximize visual scanning on Desktop & Mobile
export const CATEGORY_VISUAL_THEMES: Record<
  string,
  {
    name: string;
    icon: string;
    accentGradient: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    activeBg: string;
    glowColor: string;
  }
> = {
  all: {
    name: 'All Tools',
    icon: 'LayoutGrid',
    accentGradient: 'from-indigo-600 via-indigo-500 to-indigo-700',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/70',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    activeBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30',
    glowColor: 'ring-indigo-400',
  },
  text: {
    name: 'Text & Docs',
    icon: 'FileText',
    accentGradient: 'from-blue-600 to-cyan-500',
    iconBg: 'bg-blue-50 dark:bg-blue-950/70',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
    glowColor: 'ring-blue-400',
  },
  development: {
    name: 'Code & Dev',
    icon: 'Code2',
    accentGradient: 'from-emerald-600 to-teal-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    activeBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
    glowColor: 'ring-emerald-400',
  },
  encryption: {
    name: 'Security & Crypto',
    icon: 'Lock',
    accentGradient: 'from-purple-600 to-violet-600',
    iconBg: 'bg-purple-50 dark:bg-purple-950/70',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800',
    activeBg: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
    glowColor: 'ring-purple-400',
  },
  calculator: {
    name: 'Calculators',
    icon: 'Calculator',
    accentGradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/70',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    activeBg: 'bg-amber-600 text-white shadow-md shadow-amber-600/30',
    glowColor: 'ring-amber-400',
  },
  image: {
    name: 'Image & Media',
    icon: 'Image',
    accentGradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-50 dark:bg-rose-950/70',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-200 dark:border-rose-800',
    activeBg: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
    glowColor: 'ring-rose-400',
  },
  pdf: {
    name: 'PDF Tools',
    icon: 'FileSpreadsheet',
    accentGradient: 'from-red-600 to-rose-600',
    iconBg: 'bg-red-50 dark:bg-red-950/70',
    iconColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
    activeBg: 'bg-red-600 text-white shadow-md shadow-red-600/30',
    glowColor: 'ring-red-400',
  },
  web: {
    name: 'Web & Colors',
    icon: 'Palette',
    accentGradient: 'from-cyan-500 to-blue-600',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/70',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    activeBg: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30',
    glowColor: 'ring-cyan-400',
  },
  audio: {
    name: 'Audio & Sound',
    icon: 'Volume2',
    accentGradient: 'from-violet-600 to-indigo-600',
    iconBg: 'bg-violet-50 dark:bg-violet-950/70',
    iconColor: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-200 dark:border-violet-800',
    activeBg: 'bg-violet-600 text-white shadow-md shadow-violet-600/30',
    glowColor: 'ring-violet-400',
  },
};

export const HomePage: React.FC<HomePageProps> = ({
  tools,
  selectedCategory,
  onSelectCategory,
  favorites,
  onToggleFavorite,
  onSelectTool,
  showingFavoritesOnly,
  onClearFavoritesFilter,
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'grid'>('grouped');

  // Filter tools based on search and category (multilingual search matching)
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Favorites check
      if (showingFavoritesOnly && !favorites.includes(tool.id)) {
        return false;
      }
      // Category check
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      // Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const loc = getLocalizedTool(tool, language, t);

      return (
        tool.name.toLowerCase().includes(q) ||
        loc.localizedName.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        loc.localizedDescription.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        loc.localizedCategory.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    });
  }, [tools, showingFavoritesOnly, favorites, selectedCategory, searchQuery, language, t]);

  // Group tools by category for grouped view
  const categoryGroups = useMemo(() => {
    const groups: { category: (typeof CATEGORIES)[number]; tools: ToolItem[] }[] = [];
    CATEGORIES.filter((c) => c.id !== 'all').forEach((cat) => {
      const catTools = filteredTools.filter((tool) => tool.category === cat.id);
      if (catTools.length > 0) {
        groups.push({ category: cat, tools: catTools });
      }
    });
    return groups;
  }, [filteredTools]);

  // 8 Curated Featured Suites with Multilingual Translation
  const FEATURED_SUITES = [
    {
      id: 'text',
      defaultTitle: 'Text Tools',
      defaultDesc: 'Edit, format, transform case, count characters, and inspect text documents effortlessly.',
      icon: 'FileText',
      defaultLink: 'Explore Text Tools',
      categoryTarget: 'text',
      count: tools.filter((t) => t.category === 'text').length,
    },
    {
      id: 'image',
      defaultTitle: 'Image Tools',
      defaultDesc: 'Compress, convert formats, crop, resize, watermark, and filter photos without quality loss.',
      icon: 'Image',
      defaultLink: 'Explore Image Tools',
      categoryTarget: 'image',
      count: tools.filter((t) => t.category === 'image').length,
    },
    {
      id: 'pdf',
      defaultTitle: 'PDF Magic Suite',
      defaultDesc: 'Convert PDFs to Word, Excel, CSV, Text, Images & vice-versa with client-side privacy.',
      icon: 'FileSpreadsheet',
      defaultLink: 'Explore PDF Suite',
      categoryTarget: 'pdf',
      count: tools.filter((t) => t.category === 'pdf').length,
    },
    {
      id: 'typing',
      defaultTitle: 'Typing Test & Tutor',
      defaultDesc: 'Test your typing speed (WPM), accuracy, and fluency with real-time feedback and lessons.',
      icon: 'Keyboard',
      defaultLink: 'Start Typing Test',
      categoryTarget: 'text',
      badge: 'Interactive',
      count: 1,
    },
    {
      id: 'encryption',
      defaultTitle: 'Encryption & Security',
      defaultDesc: 'Protect data with AES-256, DES, Base64, MD5/SHA hashes, and strong password generation.',
      icon: 'Lock',
      defaultLink: 'Explore Security Tools',
      categoryTarget: 'encryption',
      count: tools.filter((t) => t.category === 'encryption').length,
    },
    {
      id: 'web',
      defaultTitle: 'Web & Colors',
      defaultDesc: 'Convert HEX to RGB, generate palettes, inspect CSS styles, and optimize frontend design.',
      icon: 'Palette',
      defaultLink: 'Explore Color Tools',
      categoryTarget: 'web',
      count: tools.filter((t) => t.category === 'web').length,
    },
    {
      id: 'development',
      defaultTitle: 'Developer Tools',
      defaultDesc: 'JSON beautifier, validator, minifier, CSV/XML converters, and multi-language code formatters.',
      icon: 'Code2',
      defaultLink: 'Explore Dev Tools',
      categoryTarget: 'development',
      count: tools.filter((t) => t.category === 'development').length,
    },
    {
      id: 'calculator',
      defaultTitle: 'Calculators & Finance',
      defaultDesc: 'Calculate exact age, GST/VAT tax, EMI loan repayment, and compounding SIP returns.',
      icon: 'Calculator',
      defaultLink: 'Explore Calculators',
      categoryTarget: 'calculator',
      count: tools.filter((t) => t.category === 'calculator').length,
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero Section */}
      <section className="text-center pt-6 sm:pt-8 pb-2 max-w-4xl mx-auto space-y-4 px-2 sm:px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            PocketKit • {tools.length} {t('hero.stat1Label', 'Tools')}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent leading-tight sm:leading-tight">
          {t('hero.titlePre', '100+ Powerful Tools in Your')}{' '}
          <span className="underline decoration-indigo-400/40">{t('hero.titleHighlight', 'Pocket')}</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t(
            'hero.subtitle',
            'PocketKit is your pocket-sized digital workshop. 100% private, client-side tools for text editing, code formatting, image manipulation, PDF tasks, calculators, and cryptography.'
          )}
        </p>

        {/* Hero Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                'hero.searchPlaceholder',
                'Search across all tools (e.g. PDF to Word, compress image, diff checker, loan calculator)...'
              )}
              className="w-full pl-12 pr-16 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {t('tool.clear', 'Clear')}
              </button>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-500" /> {t('hero.stat2Label', '100% Client-Side Private')}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> {t('hero.stat3Label', 'Zero Sign Up Required')}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-500" /> {t('hero.stat4Label', 'Instant & Offline')}
          </span>
        </div>
      </section>

      {/* --- Visual Category Scanning Cards (Hero Deck for Desktop & Mobile) --- */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('tools.filterCategory', 'Quick Category Scan')}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {CATEGORIES.length - 1} {t('footer.categories', 'Categories')}
          </span>
        </div>

        {/* Responsive Visual Scanning Grid with Rich Icons for Desktop & Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id && !showingFavoritesOnly;
            const theme = CATEGORY_VISUAL_THEMES[cat.id] || CATEGORY_VISUAL_THEMES.all;
            const catTitle = cat.id === 'all' ? t('cat.all', cat.name) : t(`cat.${cat.id}`, cat.name);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic('selection');
                  if (showingFavoritesOnly) onClearFavoritesFilter();
                  onSelectCategory(cat.id);
                }}
                className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer flex flex-col justify-between overflow-hidden active:scale-95 ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500 dark:ring-indigo-400 border-indigo-400 dark:border-indigo-500'
                    : 'bg-white dark:bg-[#1a202c] hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-sm hover:-translate-y-0.5'
                }`}
                title={catTitle}
              >
                {/* Active Indicator Top Accent */}
                {isActive && (
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.accentGradient}`}
                  />
                )}

                {/* Visual Category Icon Container */}
                <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
                      isActive ? theme.iconBg : theme.iconBg
                    }`}
                  >
                    <IconRenderer name={cat.icon} className={`w-5 h-5 sm:w-5 sm:h-5 ${theme.iconColor}`} />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>

                {/* Category Label */}
                <div>
                  <h3
                    className={`text-xs font-bold truncate transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                    }`}
                  >
                    {catTitle}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {cat.count} {t('hero.stat1Label', 'tools')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* AdSense Top Banner */}
      <AdBanner slotId="1000000001" format="horizontal" className="my-2" />

      {/* 8 Featured Tool Suites (Visible when browsing all tools without active search) */}
      {selectedCategory === 'all' && !searchQuery && !showingFavoritesOnly && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('tools.featuredSuites', 'Featured Tool Suites')}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              8 {t('footer.categories', 'Core Categories')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_SUITES.map((suite) => {
              const localizedSuite = getLocalizedSuite(
                suite.id,
                suite.defaultTitle,
                suite.defaultDesc,
                suite.defaultLink,
                language
              );
              const theme = CATEGORY_VISUAL_THEMES[suite.id] || CATEGORY_VISUAL_THEMES.all;

              return (
                <div
                  key={suite.id}
                  onClick={() => {
                    triggerHaptic('medium');
                    onSelectCategory(suite.categoryTarget);
                  }}
                  className="group relative bg-white dark:bg-[#1a202c] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.accentGradient} opacity-90`}
                  />

                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${theme.iconBg} ${theme.iconColor}`}
                      >
                        <IconRenderer name={suite.icon} className="w-6 h-6" />
                      </div>
                      {suite.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                          {t(`badge.${suite.badge.toLowerCase()}`, suite.badge)}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {suite.count} {t('hero.stat1Label', 'tools')}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {localizedSuite.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {localizedSuite.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{localizedSuite.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* --- Category Filter Navigation Bar (Sticky with Visual Colored Icons) --- */}
      <section className="sticky top-16 z-30 bg-slate-50/95 dark:bg-[#121826]/95 backdrop-blur-md py-3 border-y border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Scrollable Visual Category Pills with Visual Icons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar px-0.5">
            {showingFavoritesOnly && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0 shadow-xs">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>
                  {t('header.favoritesTitle', 'Favorites')} ({favorites.length})
                </span>
                <button
                  onClick={onClearFavoritesFilter}
                  className="ml-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id && !showingFavoritesOnly;
              const theme = CATEGORY_VISUAL_THEMES[cat.id] || CATEGORY_VISUAL_THEMES.all;
              const catTitle = cat.id === 'all' ? t('cat.all', cat.name) : t(`cat.${cat.id}`, cat.name);

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    triggerHaptic('selection');
                    if (showingFavoritesOnly) onClearFavoritesFilter();
                    onSelectCategory(cat.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? `${theme.activeBg}`
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/70'
                  }`}
                >
                  {/* Category Visual Icon Container */}
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : `${theme.iconBg} ${theme.iconColor}`
                    }`}
                  >
                    <IconRenderer name={cat.icon} className="w-3.5 h-3.5" />
                  </span>

                  <span>{catTitle}</span>

                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View mode toggle (Grouped vs Full Grid) */}
          {selectedCategory === 'all' && !searchQuery && (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shrink-0 self-end sm:self-auto text-xs font-medium">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title={t('tools.viewGrouped', 'Group tools by category')}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('tools.viewGrouped', 'By Category')}</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title={t('tools.viewGrid', 'Show all in one grid')}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{t('tools.viewGrid', 'Full Grid')}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tools Listing Section */}
      <section className="space-y-8">
        {filteredTools.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-3">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              {t('tools.noMatchTitle', 'No matching tools found')}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {t('tools.noMatchDesc', 'Try adjusting your search query or reset category filter to see all utilities.')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                if (showingFavoritesOnly) onClearFavoritesFilter();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white cursor-pointer"
            >
              {t('tools.resetFilters', 'Reset Filters')}
            </button>
          </div>
        ) : selectedCategory === 'all' && !searchQuery && viewMode === 'grouped' && !showingFavoritesOnly ? (
          // Grouped Category View: Every single tool categorized under its category header
          <div className="space-y-12">
            {categoryGroups.map(({ category, tools: catTools }) => {
              const groupTitle = t(`cat.${category.id}`, category.name);
              const theme = CATEGORY_VISUAL_THEMES[category.id] || CATEGORY_VISUAL_THEMES.all;

              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${theme.iconBg} ${theme.iconColor}`}
                      >
                        <IconRenderer name={category.icon} className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {groupTitle}
                      </h2>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {catTools.length} {t('hero.stat1Label', 'tools')}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectCategory(category.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        {t('tools.exploreSuite', 'Explore')} {groupTitle}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {catTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isFavorite={favorites.includes(tool.id)}
                        onToggleFavorite={onToggleFavorite}
                        onSelect={onSelectTool}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Standard / Filtered Grid View
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                {showingFavoritesOnly
                  ? t('tools.showingFavoritesOnly', 'Your Starred Tools')
                  : searchQuery
                  ? `${t('tools.searchFound', 'Search Results')}: "${searchQuery}"`
                  : selectedCategory === 'all'
                  ? t('tools.allCollection', 'All Tools Directory')
                  : t(`cat.${selectedCategory}`, selectedCategory)}
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {filteredTools.length} {t('tools.searchFound', 'tools')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectTool}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
