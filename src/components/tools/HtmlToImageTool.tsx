import React, { useState, useRef } from 'react';
import { Download, Sparkles, Image, Palette } from 'lucide-react';

export const HtmlToImageTool: React.FC = () => {
  const [title, setTitle] = useState('Build Better With Toolkit');
  const [subtitle, setSubtitle] = useState('30+ free client-side online tools for developers and creators.');
  const [tag, setTag] = useState('PRO UTILITY');
  const [themeGradient, setThemeGradient] = useState<'indigo' | 'emerald' | 'sunset' | 'dark'>('indigo');
  const cardRef = useRef<HTMLDivElement>(null);

  const gradients = {
    indigo: 'from-indigo-600 via-indigo-700 to-purple-800 text-white',
    emerald: 'from-emerald-600 via-teal-700 to-cyan-800 text-white',
    sunset: 'from-rose-500 via-amber-500 to-orange-600 text-white',
    dark: 'from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700',
  };

  const handleExportPng = () => {
    // Render using an SVG foreignObject or Canvas drawing
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    if (themeGradient === 'emerald') {
      grad.addColorStop(0, '#059669');
      grad.addColorStop(1, '#0e7490');
    } else if (themeGradient === 'sunset') {
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(1, '#d97706');
    } else if (themeGradient === 'dark') {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
    } else {
      grad.addColorStop(0, '#4f46e5');
      grad.addColorStop(1, '#6d28d9');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative subtle circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(1000, 150, 240, 0, Math.PI * 2);
    ctx.fill();

    // Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.roundRect(100, 120, 200, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(tag.toUpperCase(), 130, 152);

    // Title
    ctx.font = 'bold 64px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    // Word wrap title
    const words = title.split(' ');
    let line = '';
    let y = 260;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 950 && n > 0) {
        ctx.fillText(line, 100, y);
        line = words[n] + ' ';
        y += 75;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 100, y);

    // Subtitle
    ctx.font = '32px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(subtitle, 100, y + 80);

    // Footer brand
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Generated with Toolkit • toolkit.local', 100, 560);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'social-card.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Editor Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Card Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Subtitle / Description
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Gradient Theme
          </label>
          <div className="flex gap-1.5">
            {(['indigo', 'emerald', 'sunset', 'dark'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setThemeGradient(th)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize border ${
                  themeGradient === th
                    ? 'border-indigo-600 ring-2 ring-indigo-400'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={handleExportPng}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" /> Export High-Res PNG (1200×630)
        </button>
      </div>

      {/* Live Card Preview */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <div
          ref={cardRef}
          className={`aspect-[1200/630] rounded-2xl bg-gradient-to-br ${gradients[themeGradient]} p-8 sm:p-14 flex flex-col justify-between shadow-xl relative overflow-hidden`}
        >
          <div className="relative z-10 space-y-4">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-extrabold tracking-widest uppercase text-white border border-white/20">
              {tag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-2xl text-white">
              {title}
            </h2>
            <p className="text-sm sm:text-lg opacity-90 max-w-xl text-white/90">
              {subtitle}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm font-semibold opacity-80 pt-4 border-t border-white/20 text-white">
            <span>🔧 Toolkit Open Suite</span>
            <span>Free Client-Side Tools</span>
          </div>
        </div>
      </div>
    </div>
  );
};
