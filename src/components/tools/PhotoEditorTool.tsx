import React, { useState } from 'react';
import { Upload, Download, Sliders, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const PhotoEditorTool: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const { t } = useLanguage();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%)`;

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setGrayscale(0);
    setSepia(0);
  };

  const handleDownload = () => {
    if (!preview) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = filterStyle;
        ctx.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = 'edited-photo.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 cursor-pointer">
          <Sliders className="w-8 h-8 text-rose-500 mb-2" />
          <span className="font-bold text-sm text-slate-800 dark:text-white">Choose Photo to Edit</span>
          <span className="text-xs text-slate-400 mt-1">Adjust brightness, contrast, saturation & filters</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div>
              <div className="flex justify-between mb-1">
                <span>Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input type="range" min={0} max={200} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Contrast</span>
                <span>{contrast}%</span>
              </div>
              <input type="range" min={0} max={200} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Saturation</span>
                <span>{saturation}%</span>
              </div>
              <input type="range" min={0} max={200} value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Grayscale</span>
                <span>{grayscale}%</span>
              </div>
              <input type="range" min={0} max={100} value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Sepia</span>
                <span>{sepia}%</span>
              </div>
              <input type="range" min={0} max={100} value={sepia} onChange={(e) => setSepia(Number(e.target.value))} className="w-full accent-rose-500" />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              style={{ filter: filterStyle }}
              className="max-h-72 mx-auto object-contain rounded-xl shadow-md transition-all"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('tool.download', 'Download Edited Photo')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
