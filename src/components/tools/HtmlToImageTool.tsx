import React, { useState, useRef } from 'react';
import { Camera, Download, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const HtmlToImageTool: React.FC = () => {
  const [title, setTitle] = useState('PocketKit Studio');
  const [description, setDescription] = useState('70+ Private Client-Side Tools in your pocket.');
  const [badge, setBadge] = useState('100% Client-Side');
  const [bgGradient, setBgGradient] = useState('from-indigo-600 to-emerald-500');
  const previewCardRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, '#4F46E5');
    grad.addColorStop(1, '#10B981');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Dark card overlay
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(100, 100, 1000, 430, 40);
    ctx.fill();

    // Badge
    ctx.fillStyle = '#6366F1';
    ctx.beginPath();
    ctx.roundRect(160, 160, 240, 45, 20);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(badge, 180, 190);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(title, 160, 290);

    // Subtitle
    ctx.fillStyle = '#94A3B8';
    ctx.font = '28px sans-serif';
    ctx.fillText(description, 160, 370);

    // Branding
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('⚡ PocketKit Digital Workshop', 160, 450);

    const a = document.createElement('a');
    a.download = 'social-card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
        <div>
          <label className="block mb-1">Headline Text</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1">Tagline / Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Visual Live Card */}
      <div
        ref={previewCardRef}
        className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-r ${bgGradient} text-white shadow-xl relative overflow-hidden`}
      >
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500 text-xs font-bold uppercase tracking-wider mb-3">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" /> PocketKit Digital Workshop
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>{t('tool.download', 'Export Graphic as PNG')}</span>
        </button>
      </div>
    </div>
  );
};
