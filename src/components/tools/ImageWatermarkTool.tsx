import React, { useState } from 'react';
import { Upload, Download, Stamp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ImageWatermarkTool: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('PocketKit Protected');
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(0.7);
  const [color, setColor] = useState('#FFFFFF');
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const u = URL.createObjectURL(f);
    setPreview(u);
    applyWatermark(u, watermarkText, fontSize, opacity, color);
  };

  const applyWatermark = (src: string, text: string, size: number, op: number, col: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.save();
        ctx.globalAlpha = op;
        ctx.font = `bold ${size}px sans-serif`;
        ctx.fillStyle = col;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 6;
        ctx.fillText(text, canvas.width - 30, canvas.height - 30);
        ctx.restore();

        canvas.toBlob((b) => {
          if (b) setWatermarkedUrl(URL.createObjectURL(b));
        }, 'image/png');
      }
    };
  };

  const handleUpdate = () => {
    if (preview) applyWatermark(preview, watermarkText, fontSize, opacity, color);
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 cursor-pointer">
          <Stamp className="w-8 h-8 text-rose-500 mb-2" />
          <span className="font-bold text-sm text-slate-800 dark:text-white">Choose Photo for Watermarking</span>
          <span className="text-xs text-slate-400 mt-1">Add client-side custom text stamps or copyright labels</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="sm:col-span-2">
              <label className="block mb-1">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => {
                  setWatermarkText(e.target.value);
                  if (preview) applyWatermark(preview, e.target.value, fontSize, opacity, color);
                }}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Font Size ({fontSize}px)</label>
              <input
                type="range"
                min={16}
                max={96}
                value={fontSize}
                onChange={(e) => {
                  setFontSize(Number(e.target.value));
                  if (preview) applyWatermark(preview, watermarkText, Number(e.target.value), opacity, color);
                }}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <label className="block mb-1">Opacity ({Math.round(opacity * 100)}%)</label>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={opacity}
                onChange={(e) => {
                  setOpacity(Number(e.target.value));
                  if (preview) applyWatermark(preview, watermarkText, fontSize, Number(e.target.value), color);
                }}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center overflow-hidden">
            {watermarkedUrl && (
              <img src={watermarkedUrl} alt="Watermarked" className="max-h-72 mx-auto object-contain rounded-xl shadow-md" />
            )}
          </div>

          <div className="flex justify-end">
            <a
              href={watermarkedUrl || '#'}
              download="watermarked-photo.png"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t('tool.download', 'Download Watermarked Image')}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
