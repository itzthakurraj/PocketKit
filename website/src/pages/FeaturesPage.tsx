import React from 'react';
import { Shield, Zap, Lock, Palette, Cpu, RefreshCw, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

interface FeaturesPageProps {
  onOpenTool: (id: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onOpenTool }) => {
  const highlights = [
    {
      icon: Shield,
      title: 'Zero Data Retention (100% Client-Side)',
      description: 'All text operations, file conversions, and cryptographic encryptions are calculated in your browser memory. No data is stored, logged, or uploaded to cloud servers.',
    },
    {
      icon: Zap,
      title: 'Sub-Millisecond Processing',
      description: 'Powered by modern Web APIs (Web Crypto, HTML5 Canvas, Web Speech, and typed arrays) for instantaneous, zero-latency workflows.',
    },
    {
      icon: Lock,
      title: 'Military-Grade Encryption Tools',
      description: 'Strong AES-256 and DES symmetric encryption, SHA-256 and MD5 cryptographic hashes, and entropy-scored random password generation.',
    },
    {
      icon: Palette,
      title: 'Visual Image & Media Studio',
      description: 'Compress JPEG/PNG/WebP, crop with standard aspect ratios, tweak brightness/contrast/saturation, and watermark artwork in seconds.',
    },
    {
      icon: Cpu,
      title: 'Developer Syntax & Schema Suite',
      description: 'Format, validate, and minify JSON, CSV, XML, HTML, CSS, and JavaScript with error pinpointing and tabular inspections.',
    },
    {
      icon: Smartphone,
      title: 'Responsive & Dark Mode Native',
      description: 'Thoughtfully crafted with fluid layout scaling, full keyboard accessibility, dark/light theme persistence, and offline readiness.',
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-6">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Architecture & Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Why Professionals Trust Toolkit
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Built from the ground up for speed, privacy, and uncompromising utility.
        </p>
      </div>

      {/* Grid of Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Comparison Table / Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl font-bold">Privacy Guaranteed by Design</h2>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Unlike other web converter sites that require uploading your private documents and photos to unknown third-party cloud servers, Toolkit processes everything strictly within your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1">
            <div className="text-emerald-400 text-base">✓ 0 Server Uploads</div>
            <p className="text-white/80 font-normal">Files never leave your local browser RAM</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1">
            <div className="text-emerald-400 text-base">✓ Unlimited Free Usage</div>
            <p className="text-white/80 font-normal">No subscriptions, rate limits, or paywalls</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-1">
            <div className="text-emerald-400 text-base">✓ 100% Client-Side</div>
            <p className="text-white/80 font-normal">Standard Web APIs for optimal performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};
