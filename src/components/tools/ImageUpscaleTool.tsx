import React, { useState } from 'react';
import { Upload, Download, Maximize } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ImageUpscaleTool: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [newW, setNewW] = useState(0);
  const [newH, setNewH] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const u = URL.createObjectURL(f);
    setPreview(u);
    const img = new Image();
    img.src = u;
    img.onload = () => {
      setOrigW(img.width);
      setOrigH(img.height);
      setNewW(img.width * 2);
      setNewH(img.height * 2);
      applyResize(u, img.width * 2, img.height * 2);
    };
  };

  const applyResize = (src: string, w: number, h: number) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((b) => {
          if (b) setResizedUrl(URL.createObjectURL(b));
        }, 'image/png');
      }
    };
  };

  const handleWidthChange = (val: number) => {
    setNewW(val);
    if (lockRatio && origW > 0) {
      const calculatedH = Math.round((val / origW) * origH);
      setNewH(calculatedH);
      if (preview) applyResize(preview, val, calculatedH);
    } else {
      if (preview) applyResize(preview, val, newH);
    }
  };

  const handleHeightChange = (val: number) => {
    setNewH(val);
    if (lockRatio && origH > 0) {
      const calculatedW = Math.round((val / origH) * origW);
      setNewW(calculatedW);
      if (preview) applyResize(preview, calculatedW, val);
    } else {
      if (preview) applyResize(preview, newW, val);
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 cursor-pointer">
          <Maximize className="w-8 h-8 text-rose-500 mb-2" />
          <span className="font-bold text-sm text-slate-800 dark:text-white">Choose Image to Resize / Upscale</span>
          <span className="text-xs text-slate-400 mt-1">Scale up 2x, 4x or set custom pixel dimensions</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div>
              <label className="block mb-1">Width (px) - was {origW}</label>
              <input
                type="number"
                min={10}
                value={newW}
                onChange={(e) => handleWidthChange(Number(e.target.value) || 10)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Height (px) - was {origH}</label>
              <input
                type="number"
                min={10}
                value={newH}
                onChange={(e) => handleHeightChange(Number(e.target.value) || 10)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="rounded-xs text-rose-600"
                />
                Lock Aspect Ratio
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center overflow-hidden">
            {resizedUrl && (
              <img src={resizedUrl} alt="Resized" className="max-h-72 mx-auto object-contain rounded-xl shadow-md" />
            )}
          </div>

          <div className="flex justify-end">
            <a
              href={resizedUrl || '#'}
              download={`resized-${newW}x${newH}.png`}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t('tool.download', 'Download Resized Photo')}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
