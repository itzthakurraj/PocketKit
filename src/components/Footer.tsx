import React from 'react';
import { ActiveView } from '../types';
import { Heart, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (view: ActiveView, category?: string) => void;
  onOpenPolicy?: (tab: 'privacy' | 'terms' | 'about' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-[#1a202c] border-t border-slate-200 dark:border-slate-800 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-xs bg-indigo-600">
                <img src="/pocketkit-icon.svg" alt="PocketKit Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Pocket<span className="text-indigo-600 dark:text-indigo-400">Kit</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {t(
                'footer.tagline',
                'Your pocket-sized digital workshop. Fast, private, client-side online tools for creators, developers, and everyday tasks.'
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> {t('footer.clientSide', '100% Client-Side')}
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> {t('footer.zeroWait', 'Zero Wait')}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                Google AdSense Powered
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              {t('footer.categories', 'Tool Categories')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('category', 'text')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('cat.text', 'Text & Documents')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'development')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('cat.development', 'Developer & JSON')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'encryption')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('cat.encryption', 'Security & Hashes')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'calculator')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('cat.calculator', 'Finance & Calculators')}
                </button>
              </li>
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              {t('footer.quickLinks', 'Quick Navigation')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('category', 'image')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('cat.image', 'Image & Media')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'pdf')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('cat.pdf', 'PDF Tools')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'web')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('cat.web', 'Web Utilities')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium cursor-pointer"
                >
                  {t('nav.allTools', 'All Tools Directory')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('install')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>⬇</span>
                  <span>{t('header.installApp', 'Download App (APK & iOS)')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Compliance Policies */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              {t('footer.legal', 'Resources & Policies')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('nav.features', 'Features')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('nav.blog', 'Blog')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('nav.help', 'Help & FAQs')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('privacy')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-medium"
                >
                  {t('footer.privacyPolicy', 'Privacy Policy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('terms')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('footer.termsOfService', 'Terms of Service')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('about')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('footer.about', 'About PocketKit')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('contact')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t('footer.contact', 'Contact & Support')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('pocketkit:open-adblock-guide'));
                    }
                  }}
                  className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🛡️</span>
                  <span>Whitelist Guide</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} PocketKit. {t('footer.copyright', 'All rights reserved.')}</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for developers & creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
