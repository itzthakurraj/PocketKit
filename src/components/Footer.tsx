import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  Heart,
  Shield,
  Zap,
  Lock,
  Mail,
  FileText,
  HelpCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (view: ActiveView, category?: string) => void;
  onOpenPolicy?: (tab: 'privacy' | 'terms' | 'about' | 'contact') => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy, onOpenSitemap }) => {
  const { t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('itzthakurraj@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="bg-white dark:bg-[#151c28] border-t border-slate-200/80 dark:border-slate-800/80 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Security Guarantee */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs bg-indigo-600 flex items-center justify-center p-1.5">
                <img src="/pocketkit-icon.svg" alt="PocketKit Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                  Pocket<span className="text-indigo-600 dark:text-indigo-400">Kit</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  100+ Offline Utilities
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'footer.tagline',
                'Your pocket-sized digital workshop. 100% private, client-side online tools for PDF processing, code formatting, security, calculators, and media conversions.'
              )}
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Zero Server Uploads (Client-Side)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Zap className="w-4 h-4 shrink-0" />
                <span>Instant & Offline Ready</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Lock className="w-4 h-4 shrink-0 text-slate-400" />
                <span>No Registration Required</span>
              </div>
            </div>
          </div>

          {/* Column 2: Tool Categories & Suites */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('footer.categories', 'Popular Categories')}</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('category', 'pdf')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>PDF Security & Decrypt Suite</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'text')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('cat.text', 'Text & Document Wizard')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'development')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('cat.development', 'Developer & JSON Formatter')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'encryption')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('cat.encryption', 'Security & Cryptography')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'calculator')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('cat.calculator', 'Calculators & Finance')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'image')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('cat.image', 'Image & Media Converters')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('footer.quickLinks', 'Platform & Guides')}</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('nav.allTools', 'All 104+ Tools Directory')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('nav.features', 'Features & Client Privacy')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('nav.blog', 'Engineering Articles & Blog')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{t('nav.help', 'Help Center & FAQs')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('install')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors flex items-center gap-1.5 cursor-pointer font-semibold group"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('header.installApp', 'Install App (APK & iOS)')}</span>
                </button>
              </li>
              {onOpenSitemap && (
                <li>
                  <button
                    onClick={onOpenSitemap}
                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                    <span>Worldwide SEO Directory & XML</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Legal & Direct Support (Highlighted!) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t('footer.legal', 'Privacy & Direct Support')}</span>
            </h4>

            {/* Quick Policy & Support Navigation Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onOpenPolicy?.('privacy')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-semibold text-xs flex items-center justify-between cursor-pointer shadow-2xs group"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Privacy Policy (Client-Side)</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onOpenPolicy?.('contact')}
                className="w-full text-left px-3 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Contact Support & Feedback</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onOpenPolicy?.('terms')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-between transition-all cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Support Card Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-slate-50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Engineering Support
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <a
                  href="mailto:itzthakurraj@gmail.com?subject=PocketKit%20Support%20Inquiry"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                  title="Send email to itzthakurraj@gmail.com"
                >
                  itzthakurraj@gmail.com
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Questions or feature suggestions? Response typically within 24–48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} PocketKit. {t('footer.copyright', 'All rights reserved.')}</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onOpenPolicy?.('privacy')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onOpenPolicy?.('terms')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
            >
              Terms
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onOpenPolicy?.('contact')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer font-semibold text-indigo-600 dark:text-indigo-400"
            >
              Contact Support
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for global developers & creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
