import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Search, Moon, Sun, Menu, X, Sparkles, BookOpen, HelpCircle, Grid, Smartphone } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView, category?: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  favoritesCount: number;
  onToggleFavoritesFilter: () => void;
  showingFavoritesOnly: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenSearch,
  favoritesCount,
  onToggleFavoritesFilter,
  showingFavoritesOnly,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform bg-indigo-600">
            <img src="/pocketkit-icon.svg" alt="PocketKit Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-baseline">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
              Pocket<span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">Kit</span>
            </span>
            <span className="hidden sm:inline-block ml-1.5 sm:ml-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              v2.0
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeView === 'home' && !showingFavoritesOnly
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {t('nav.home', 'Home')}
          </button>
          <button
            onClick={() => onNavigate('all-tools')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'all-tools'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Grid className="w-4 h-4" />
            {t('nav.allTools', 'All Tools')}
          </button>
          <button
            onClick={() => onNavigate('features')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'features'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t('nav.features', 'Features')}
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'blog'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t('nav.blog', 'Blog')}
          </button>
          <button
            onClick={() => onNavigate('help')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'help'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {t('nav.help', 'Help')}
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop PWA Install Button */}
          <div className="hidden md:block">
            <PWAInstallButton compact />
          </div>

          {/* Search Button: full pill on tablet/desktop, compact icon on mobile */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
            title={t('header.searchTitle', 'Search tools (Ctrl+K or ⌘K)')}
            aria-label="Search tools"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{t('header.searchPlaceholder', 'Search tools...')}</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Starred / Favorites toggle */}
          {favoritesCount > 0 && (
            <button
              onClick={onToggleFavoritesFilter}
              className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                showingFavoritesOnly
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 ring-2 ring-amber-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={t('header.favoritesTitle', 'Saved favorite tools')}
            >
              <span className="text-amber-500">★</span>
              <span className="text-xs font-semibold">{favoritesCount}</span>
            </button>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher compact={false} />

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t('header.toggleTheme', 'Toggle theme')}
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-0.5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#1a202c]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          {/* Dedicated Install App Section in Mobile View with Generous Space */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/70 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-600 text-white flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">PocketKit Mobile App</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">100+ tools offline, full-screen & zero delay</p>
              </div>
            </div>
            <div className="pt-1">
              <PWAInstallButton fullWidth />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeView === 'home' && !showingFavoritesOnly
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🏠</span>
              <span>{t('nav.home', 'Home')}</span>
            </button>
            <button
              onClick={() => {
                onNavigate('all-tools');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeView === 'all-tools'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Grid className="w-4 h-4 text-indigo-500" />
              <span>{t('nav.allTools', 'All Tools')}</span>
            </button>
            <button
              onClick={() => {
                onNavigate('features');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeView === 'features'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>{t('nav.features', 'Features')}</span>
            </button>
            <button
              onClick={() => {
                onNavigate('blog');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeView === 'blog'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>{t('nav.blog', 'Blog')}</span>
            </button>
            <button
              onClick={() => {
                onNavigate('help');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeView === 'help'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>{t('nav.helpDocs', 'Help & Documentation')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
