import React, { useState } from 'react';
import { ActiveView } from '../types';
import { Search, Moon, Sun, Menu, X, Wrench, Sparkles, BookOpen, HelpCircle, Grid } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1a202c]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform bg-indigo-600">
            <img src="/pocketkit-icon.svg" alt="PocketKit Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-baseline">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Pocket<span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">Kit</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              v2.0
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'home' && !showingFavoritesOnly
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('all-tools')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'all-tools'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Grid className="w-4 h-4" />
            All Tools
          </button>
          <button
            onClick={() => onNavigate('features')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'features'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Features
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'blog'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Blog
          </button>
          <button
            onClick={() => onNavigate('help')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeView === 'help'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton compact />

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200/80 dark:border-slate-700/80"
            title="Search tools (Ctrl+K or ⌘K)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Starred / Favorites toggle */}
          {favoritesCount > 0 && (
            <button
              onClick={onToggleFavoritesFilter}
              className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                showingFavoritesOnly
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 ring-2 ring-amber-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Saved favorite tools"
            >
              <span>★</span>
              <span className="text-xs font-semibold">{favoritesCount}</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c] px-4 pt-2 pb-4 space-y-1">
          <div className="pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
            <PWAInstallButton />
          </div>
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('all-tools');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            All Tools
          </button>
          <button
            onClick={() => {
              onNavigate('features');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Features
          </button>
          <button
            onClick={() => {
              onNavigate('blog');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Blog
          </button>
          <button
            onClick={() => {
              onNavigate('help');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Help & Documentation
          </button>
        </div>
      )}
    </header>
  );
};
