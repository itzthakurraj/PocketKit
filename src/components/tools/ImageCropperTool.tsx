import React, { useState } from 'react';
import { Upload, Download, Crop, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ImageCropperTool: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [ratio, setRatio] = useState<string>('1:1');
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const u = URL.createObjectURL(f);
    setPreview(u);
    applyCrop(u, ratio);
  };

  const applyCrop = (src: string, r: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetW = img.width;
      let targetH = img.height;

      if (r === '1:1') {
        const size = Math.min(img.width, img.height);
        targetW = size;
        targetH = size;
      } else if (r === '16:9') {
        targetW = img.width;
        targetH = Math.round((img.width * 9) / 16);
      } else if (r === '4:3') {
        targetW = img.width;
        targetH = Math.round((img.width * 3) / 4);
      }

      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const startX = (img.width - targetW) / 2;
        const startY = (img.height - targetH) / 2;
        ctx.drawImage(img, startX, startY, targetW, targetH, 0, 0, targetW, targetH);
        canvas.toBlob((b) => {
          if (b) setCroppedUrl(URL.createObjectURL(b));
        }, 'image/png');
      }
    };
  };

  const handleRatio = (newRatio: string) => {
    setRatio(newRatio);
    if (preview) applyCrop(preview, newRatio);
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 cursor-pointer">
          <Crop className="w-8 h-8 text-rose-500 mb-2" />
          <span className="font-bold text-sm text-slate-800 dark:text-white">Choose Image to Crop</span>
          <span className="text-xs text-slate-400 mt-1">Crop to 1:1, 16:9, or 4:3 aspect ratios</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Preset Ratio:</span>
            {['1:1', '16:9', '4:3'].map((r) => (
              <button
                key={r}
                onClick={() => handleRatio(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  ratio === r
                    ? 'bg-rose-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center">
            {croppedUrl && (
              <img src={croppedUrl} alt="Cropped" className="max-h-64 mx-auto object-contain rounded-xl shadow-xs" />
            )}
          </div>

          <div className="flex justify-end">
            <a
              href={croppedUrl || '#'}
              download={`cropped-${ratio.replace(':', 'x')}.png`}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t('tool.download', 'Download Cropped Image')}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
