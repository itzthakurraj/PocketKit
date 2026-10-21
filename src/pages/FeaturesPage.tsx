import React from 'react';
import { Shield, Zap, Smartphone, Globe, Lock, Code2, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { AdBanner } from '../components/AdBanner';

interface FeaturesPageProps {
  onOpenTool?: (id: string | null) => void;
  onNavigateHome?: () => void;
  onOpenInstall?: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigateHome, onOpenInstall }) => {
  const { t, speak } = useLanguage();

  const features = [
    {
      icon: Shield,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
      title: '100% Client-Side Privacy',
      desc: 'All computation, formatting, and file processing happen exclusively inside your device browser. No text or photos are ever transmitted to any external server.',
    },
    {
      icon: Sparkles,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
      title: '100% Free via Google AdSense',
      desc: 'All 70+ tools are funded by non-intrusive Google AdSense advertisements. An active internet connection ensures sponsored ads display so all utilities stay 100% free forever without subscriptions.',
    },
    {
      icon: Smartphone,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
      title: 'Native Android APK & PWA',
      desc: 'Install directly on Android phones as a lightweight native APK, or on iOS and Desktop as an instant Progressive Web App.',
    },
    {
      icon: Globe,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
      title: '14 Global & Indic Languages',
      desc: 'Seamlessly switch between English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia, Spanish, and French.',
    },
    {
      icon: Volume2,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      title: 'Accessibility & Voice Assistance',
      desc: 'Built-in Text-to-Speech audio guide allows non-literate and visually challenged individuals to listen to tool guidance and calculation outcomes aloud.',
    },
    {
      icon: Zap,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60',
      title: '70+ Production Utilities',
      desc: 'Comprehensive suites covering text editors, developers, cryptography, finance math, image optimizers, and PDF generation.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
          <Zap className="w-3.5 h-3.5" /> High Performance & Zero Bloat
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Everything You Need in a <span className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">Digital Toolkit</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Engineered for privacy, speed, and cross-platform accessibility. Built for everyday tasks without accounts, tracking, or fees.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color}`}>
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* AdSense In-Page Banner */}
      <AdBanner slotId="1000000003" format="auto" className="my-8" />

      {/* CTA Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-2xl font-black">Experience PocketKit Everywhere</h2>
          <p className="text-indigo-100 text-sm">Install on Android, Windows, macOS, Linux, and iOS in seconds.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onOpenInstall}
            className="px-6 py-3 rounded-2xl bg-white text-indigo-700 font-extrabold text-sm hover:bg-indigo-50 shadow-md cursor-pointer transition-colors"
          >
            Download / Install App
          </button>
        </div>
      </div>
    </div>
  );
};
