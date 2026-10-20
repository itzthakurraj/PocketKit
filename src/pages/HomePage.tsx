import React, { useState, useMemo } from 'react';
import { ToolItem, ToolCategory } from '../types';
import { CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/ToolCard';
import { IconRenderer } from '../components/IconRenderer';
import { AdBanner } from '../components/AdBanner';
import { useLanguage } from '../i18n/LanguageContext';

import {
  Search,
  Sparkles,
  Shield,
  Zap,
  Flame,
  Star,
  CheckCircle,
  LayoutGrid,
  Layers,
  ArrowRight,
  Filter,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Lock,
  Calculator,
  Code2,
  Palette,
  Keyboard,
  Clock,
  Trash2,
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
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'grid'>('grouped');

  // Filter tools based on search and category
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
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q)) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
      );
    });
  }, [tools, showingFavoritesOnly, favorites, selectedCategory, searchQuery]);

  const popularTools = useMemo(() => tools.filter((t) => t.isPopular), [tools]);

  // Group tools by category for grouped view
  const categoryGroups = useMemo(() => {
    const groups: { category: (typeof CATEGORIES)[number]; tools: ToolItem[] }[] = [];
    CATEGORIES.filter((c) => c.id !== 'all').forEach((cat) => {
      const catTools = filteredTools.filter((t) => t.category === cat.id);
      if (catTools.length > 0) {
        groups.push({ category: cat, tools: catTools });
      }
    });
    return groups;
  }, [filteredTools]);

  // Original 8 Featured Suites from the GitHub Repo
  const FEATURED_SUITES = [
    {
      id: 'text',
      title: 'Text Tools',
      desc: 'Edit, format, transform case, count characters, and inspect text documents effortlessly.',
      icon: 'FileText',
      linkText: 'Explore Text Tools',
      categoryTarget: 'text',
      primaryToolId: 'case-converter',
      count: tools.filter((t) => t.category === 'text').length,
    },
    {
      id: 'image',
      title: 'Image Tools',
      desc: 'Compress, convert formats, crop, resize, watermark, and filter photos without quality loss.',
      icon: 'Image',
      linkText: 'Explore Image Tools',
      categoryTarget: 'image',
      primaryToolId: 'image-compressor',
      count: tools.filter((t) => t.category === 'image').length,
    },
    {
      id: 'pdf',
      title: 'PDF Magic Suite',
      desc: 'Convert PDFs to Word, Excel, CSV, Text, Images & vice-versa with client-side privacy.',
      icon: 'FileSpreadsheet',
      linkText: 'Explore PDF Suite',
      categoryTarget: 'pdf',
      primaryToolId: 'pdf-tools',
      count: tools.filter((t) => t.category === 'pdf').length,
    },
    {
      id: 'typing',
      title: 'Typing Test & Tutor',
      desc: 'Test your typing speed (WPM), accuracy, and fluency with real-time feedback and lessons.',
      icon: 'Keyboard',
      linkText: 'Start Typing Test',
      categoryTarget: 'text',
      primaryToolId: 'typing-test',
      badge: 'Interactive',
      count: 1,
    },
    {
      id: 'encryption',
      title: 'Encryption & Security',
      desc: 'Protect data with AES-256, DES, Base64, MD5/SHA hashes, and strong password generation.',
      icon: 'Lock',
      linkText: 'Explore Security Tools',
      categoryTarget: 'encryption',
      primaryToolId: 'aes-des-encrypt',
      count: tools.filter((t) => t.category === 'encryption').length,
    },
    {
      id: 'web',
      title: 'Web & Colors',
      desc: 'Convert HEX to RGB, generate palettes, inspect CSS styles, and optimize frontend design.',
      icon: 'Palette',
      linkText: 'Explore Color Tools',
      categoryTarget: 'web',
      primaryToolId: 'color-converter',
      count: tools.filter((t) => t.category === 'web').length,
    },
    {
      id: 'development',
      title: 'Developer Tools',
      desc: 'JSON beautifier, validator, minifier, CSV/XML converters, and multi-language code formatters.',
      icon: 'Code2',
      linkText: 'Explore Dev Tools',
      categoryTarget: 'development',
      primaryToolId: 'json-beautifier',
      count: tools.filter((t) => t.category === 'development').length,
    },
    {
      id: 'calculator',
      title: 'Calculators & Finance',
      desc: 'Calculate exact age, GST/VAT tax, EMI loan repayment, and compounding SIP returns.',
      icon: 'Calculator',
      linkText: 'Explore Calculators',
      categoryTarget: 'calculator',
      primaryToolId: 'loan-calculator',
      count: tools.filter((t) => t.category === 'calculator').length,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section matching original style */}
      <section className="text-center pt-8 pb-4 max-w-4xl mx-auto space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>PocketKit • {tools.length} {t('hero.stat1Label', 'Tools')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent leading-tight sm:leading-tight">
          {t('hero.titlePre', '70+ Powerful Tools in Your')}{' '}
          <span className="underline decoration-indigo-400/40">{t('hero.titleHighlight', 'Pocket')}</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle', 'PocketKit is your pocket-sized digital workshop. 100% private, client-side tools for text editing, code formatting, image manipulation, PDF tasks, calculators, and cryptography.')}
        </p>

        {/* Hero Search Bar */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('hero.searchPlaceholder', 'Search across all tools (e.g. PDF to Word, compress image, diff checker, loan calculator)...')}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
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

        {/* Badges / Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
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

      {/* AdSense Top Leaderboard */}
      <AdBanner slotId="1000000001" format="horizontal" className="my-4" />

      {/* 8 Original Iconic Category Hubs (Shown on clean home view) */}
      {selectedCategory === 'all' && !searchQuery && !showingFavoritesOnly && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Featured Tool Suites
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">8 Core Categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_SUITES.map((suite) => (
              <div
                key={suite.id}
                onClick={() => onSelectCategory(suite.categoryTarget)}
                className="group relative bg-white dark:bg-[#1a202c] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-80" />

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                      <IconRenderer name={suite.icon} className="w-6 h-6" />
                    </div>
                    {suite.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                        {suite.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {suite.count} tools
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {suite.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {suite.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>{suite.linkText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter Pills & View Mode Bar */}
      <section className="sticky top-16 z-30 bg-slate-50/95 dark:bg-[#121826]/95 backdrop-blur-md py-3 border-y border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {showingFavoritesOnly && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>Favorites ({favorites.length})</span>
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
              const catTitle = cat.id === 'all' ? t('cat.all', cat.name) : t(`cat.${cat.id}`, cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (showingFavoritesOnly) onClearFavoritesFilter();
                    onSelectCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <IconRenderer name={cat.icon} className="w-3.5 h-3.5" />
                  <span>{catTitle}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View mode toggle */}
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
                {t('tools.viewGrouped', 'By Category')}
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
                {t('tools.viewGrid', 'Full Grid')}
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
              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <IconRenderer name={category.icon} className="w-4 h-4" />
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
                      {groupTitle}
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
                {filteredTools.length} {t('tools.searchFound', 'tools found')}
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
