import React, { useState } from 'react';
import { ActiveView, ThemeMode } from '../types';
import { Moon, Sun, Monitor, Menu, X, Sparkles, BookOpen, HelpCircle, Grid, Smartphone, Download, Star } from 'lucide-react';
import { InstallDropdown } from './InstallDropdown';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView, category?: string) => void;
  isDark: boolean;
  themeMode?: ThemeMode;
  onToggleTheme: () => void;
  onSetThemeMode?: (mode: ThemeMode) => void;
  onOpenSearch?: () => void;
  favoritesCount: number;
  onToggleFavoritesFilter: () => void;
  showingFavoritesOnly: boolean;
  onOpenVoiceModal?: () => void;
  isVoiceListening?: boolean;
  onOpenSitemap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  isDark,
  themeMode = 'system',
  onToggleTheme,
  onSetThemeMode,
  favoritesCount,
  onToggleFavoritesFilter,
  showingFavoritesOnly,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121826]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform bg-indigo-600">
            <img src="/pocketkit-icon.svg" alt="PocketKit Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-baseline">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              Pocket<span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">Kit</span>
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              v2.0
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeView === 'home' && !showingFavoritesOnly
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {t('nav.home', 'Home')}
          </button>
          <button
            onClick={() => onNavigate('all-tools')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'all-tools'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Grid className="w-4 h-4 text-indigo-500" />
            <span>{t('nav.allTools', 'All Tools')}</span>
          </button>
          <button
            onClick={() => onNavigate('features')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'features'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{t('nav.features', 'Features')}</span>
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'blog'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>{t('nav.blog', 'Blog')}</span>
          </button>
          <button
            onClick={() => onNavigate('help')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeView === 'help'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>{t('nav.help', 'Help')}</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Starred / Favorites toggle */}
          {favoritesCount > 0 && (
            <button
              onClick={onToggleFavoritesFilter}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border ${
                showingFavoritesOnly
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              title={t('header.favoritesTitle', 'Saved favorite tools')}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{favoritesCount}</span>
            </button>
          )}

          {/* Desktop Install App Button */}
          <button
            onClick={() => onNavigate('install')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
            title={t('header.installApp', 'Install App')}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('header.installApp', 'Install App')}</span>
          </button>

          {/* Compact Language Switcher */}
          <LanguageSwitcher compact={true} />

          {/* Theme Toggle Button (Cycles: Light -> Dark -> System Auto) */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleTheme();
            }}
            className="px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            aria-label={t('header.toggleTheme', 'Toggle theme')}
            title={`Current theme: ${themeMode === 'light' ? 'Light' : themeMode === 'dark' ? 'Dark' : 'System Auto'} (click to cycle)`}
          >
            {themeMode === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : themeMode === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Monitor className="w-4 h-4 text-emerald-500" />
            )}
            <span className="hidden lg:inline text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {themeMode === 'system' ? 'Auto' : themeMode === 'light' ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#121826]/98 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {/* Mobile Install App Quick CTA */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/60 dark:from-indigo-950/50 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">PocketKit Mobile</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Offline & full-screen</p>
              </div>
            </div>
            <button
              onClick={() => {
                onNavigate('install');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
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
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
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
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
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
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
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
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeView === 'help'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>{t('nav.help', 'Help & Documentation')}</span>
            </button>
          </div>

          {/* Mobile Theme Switcher Bar */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Appearance</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => onSetThemeMode ? onSetThemeMode('light') : onToggleTheme()}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  themeMode === 'light'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => onSetThemeMode ? onSetThemeMode('dark') : onToggleTheme()}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  themeMode === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => onSetThemeMode ? onSetThemeMode('system') : onToggleTheme()}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                <span>Auto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
