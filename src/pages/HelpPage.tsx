import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Smartphone, ShieldCheck, Volume2, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { AdBanner } from '../components/AdBanner';

export const HelpPage: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I install PocketKit on my Android phone?',
      a: 'The easiest, official method is 1-Tap WebAPK installation: open PocketKit in Chrome, Edge, or Samsung Internet, click "Install on Android", or tap the browser menu (⋮) and select "Install app" / "Add to Home screen". This installs a certified app on your phone with zero parse errors. If you prefer downloading the raw APK file, ensure you have enabled "Install unknown apps" in Android Settings > Apps > Chrome.',
    },
    {
      q: 'Why does Android say "There was a problem parsing the package"?',
      a: 'This common Android error occurs when an APK file download is interrupted or when sideloading permissions are disabled. To resolve it instantly without errors, use our recommended 1-Tap WebAPK install directly from your browser menu ("Install app" or "Add to Home screen").',
    },
    {
      q: 'How do I install PocketKit on iPhone or iPad (iOS)?',
      a: 'Open PocketKit in the Safari browser on your iOS device. Tap the Share button (square icon with an arrow pointing up), scroll down in the share sheet, and tap "Add to Home Screen". PocketKit will appear on your home screen as a full-screen app icon.',
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes, 100%. PocketKit operates completely client-side in your device browser. When you encrypt text, compress images, or calculate taxes, nothing leaves your device. We do not operate remote processing servers for your personal data.',
    },
    {
      q: 'Is an active internet connection required to use PocketKit?',
      a: 'Yes. PocketKit provides all 70+ tools completely free without charging subscriptions by partnering with Google AdSense. To display sponsored advertisements that sustain our service and server operations, an active internet connection is required across Android, Windows, macOS, Linux, and Web.',
    },
    {
      q: 'How can visually impaired or non-literate users use the tools?',
      a: 'Every tool includes an accessible audio guide button. Simply click this button and the app will read instructions, tool labels, and calculated results aloud in your selected language.',
    },
    {
      q: 'Can I use keyboard shortcuts?',
      a: 'Yes. Press Ctrl+K (or Command+K on Mac) anywhere to open the rapid search modal. You can also press Escape (ESC) to quickly close any opened tool modal.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Help & Frequently Asked Questions
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Guides for Android installation, desktop apps, audio accessibility, and AdSense sponsorship.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a202c] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <span>{item.q}</span>
              {openIndex === idx ? (
                <ChevronUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sponsored AdSense Placement */}
      <AdBanner slotId="1000000005" format="auto" className="my-6" />
    </div>
  );
};
