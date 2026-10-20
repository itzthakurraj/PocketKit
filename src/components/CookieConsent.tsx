import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface CookieConsentProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacyPolicy }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('pocketkit_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pocketkit_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {t('cookie.title', 'Privacy & Local Preferences')}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t(
              'cookie.desc',
              'PocketKit operates entirely in your browser. We only use localStorage to store your theme, language choice, and favorite tools.'
            )}{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-700 cursor-pointer"
            >
              {t('cookie.privacy', 'Privacy Details')}
            </button>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
        >
          {t('cookie.accept', 'Got it')}
        </button>
      </div>
    </div>
  );
};
