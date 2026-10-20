import React, { useState, useRef } from 'react';
import { Upload, Download, Scaling, Lock, Unlock } from 'lucide-react';

export const ImageUpscaleTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [resampleMode, setResampleMode] = useState<'smooth' | 'pixelated'>('smooth');
  const [scaledSrc, setScaledSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setOrigW(img.width);
        setOrigH(img.height);
        setWidth(img.width);
        setHeight(img.height);
        renderScaled(src, img.width, img.height, resampleMode);
      };
    };
    reader.readAsDataURL(file);
  };

  const renderScaled = (
    src: string,
    targetW: number,
    targetH: number,
    mode: 'smooth' | 'pixelated'
  ) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, targetW);
      canvas.height = Math.max(1, targetH);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = mode === 'smooth';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setScaledSrc(canvas.toDataURL('image/png'));
    };
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && origW > 0) {
      const newH = Math.round((val / origW) * origH);
      setHeight(newH);
      if (imageSrc) renderScaled(imageSrc, val, newH, resampleMode);
    } else if (imageSrc) {
      renderScaled(imageSrc, val, height, resampleMode);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && origH > 0) {
      const newW = Math.round((val / origH) * origW);
      setWidth(newW);
      if (imageSrc) renderScaled(imageSrc, newW, val, resampleMode);
    } else if (imageSrc) {
      renderScaled(imageSrc, width, val, resampleMode);
    }
  };

  const handleScalePercent = (pct: number) => {
    if (origW > 0 && origH > 0) {
      const nw = Math.round((origW * pct) / 100);
      const nh = Math.round((origH * pct) / 100);
      setWidth(nw);
      setHeight(nh);
      if (imageSrc) renderScaled(imageSrc, nw, nh, resampleMode);
    }
  };

  const handleDownload = () => {
    if (!scaledSrc) return;
    const a = document.createElement('a');
    a.href = scaledSrc;
    a.download = `resized-${width}x${height}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-12 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Scaling className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Select an Image to Resize & Scale
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Scale up or down by exact pixels or percentage with aspect ratio constraints.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">Width:</span>
                  <input
                    type="number"
                    min={1}
                    max={8000}
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
                    className="w-24 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <span className="text-xs text-slate-400">px</span>
                </div>

                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`p-1.5 rounded-lg border text-xs font-semibold ${
                    lockAspect
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                  }`}
                  title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio free'}
                >
                  {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">Height:</span>
                  <input
                    type="number"
                    min={1}
                    max={8000}
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
                    className="w-24 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <span className="text-xs text-slate-400">px</span>
                </div>
              </div>

              {/* Quick scale presets */}
              <div className="flex items-center gap-1.5">
                {[50, 75, 100, 150, 200].map((p) => (
                  <button
                    key={p}
                    onClick={() => handleScalePercent(p)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Original: {origW} × {origH} px ➔ Target: {width} × {height} px
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Scaled PNG
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-100 dark:bg-slate-900 text-center">
            {scaledSrc && (
              <img
                src={scaledSrc}
                alt="Scaled Preview"
                className="max-h-80 mx-auto object-contain rounded-lg shadow-sm"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
