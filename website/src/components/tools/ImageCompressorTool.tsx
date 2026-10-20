import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Sliders, Check } from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.75);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [fileName, setFileName] = useState('compressed-image.jpg');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    setFileName(`compressed-${file.name.replace(/\.[^.]+$/, '')}.${format === 'image/webp' ? 'webp' : 'jpg'}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      compressImage(src, quality, format);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (
    src: string,
    q: number,
    fmt: 'image/jpeg' | 'image/webp' | 'image/png'
  ) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setOriginalDimensions({ w: img.width, h: img.height });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill white background for JPEG
      if (fmt === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL(fmt, q);
      setCompressedSrc(dataUrl);

      // Estimate compressed size
      const base64Str = dataUrl.split(',')[1];
      const approxBytes = atob(base64Str).length;
      setCompressedSize(approxBytes);
    };
  };

  const handleQualityChange = (val: number) => {
    setQuality(val);
    if (imageSrc) {
      compressImage(imageSrc, val, format);
    }
  };

  const handleDownload = () => {
    if (!compressedSrc) return;
    const a = document.createElement('a');
    a.href = compressedSrc;
    a.download = fileName;
    a.click();
  };

  const percentReduction =
    originalSize > 0 && compressedSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Upload Header */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-12 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Choose an Image to Compress
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Drag and drop JPEG, PNG, or WebP files here. Processed 100% locally on your machine.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quality:</span>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={quality}
                  onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                  className="w-32 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {Math.round(quality * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Format:</span>
                <select
                  value={format}
                  onChange={(e) => {
                    const fmt = e.target.value as 'image/jpeg' | 'image/webp' | 'image/png';
                    setFormat(fmt);
                    if (imageSrc) compressImage(imageSrc, quality, fmt);
                  }}
                  className="text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/webp">WebP (.webp)</option>
                  <option value="image/png">PNG (.png)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Change Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Optimized ({Math.round(compressedSize / 1024)} KB)
              </button>
            </div>
          </div>

          {/* Stats banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-lg font-bold text-slate-800 dark:text-white">
                {(originalSize / 1024).toFixed(1)} KB
              </div>
              <div className="text-xs text-slate-400">Original Size</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {(compressedSize / 1024).toFixed(1)} KB
              </div>
              <div className="text-xs text-slate-400">Compressed Size</div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {percentReduction > 0 ? `-${percentReduction}%` : '0%'}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300">Space Saved</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-lg font-bold text-slate-800 dark:text-white">
                {originalDimensions.w} × {originalDimensions.h}
              </div>
              <div className="text-xs text-slate-400">Dimensions</div>
            </div>
          </div>

          {/* Side by side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-100 dark:bg-slate-900 text-center space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Original</div>
              <div className="max-h-72 flex items-center justify-center overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-950 p-2">
                <img src={imageSrc} alt="Original" className="max-h-64 object-contain mx-auto" />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/50 dark:border-emerald-500/30 p-3 bg-slate-100 dark:bg-slate-900 text-center space-y-2">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                Optimized Result
              </div>
              <div className="max-h-72 flex items-center justify-center overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-950 p-2">
                {compressedSrc && (
                  <img src={compressedSrc} alt="Compressed" className="max-h-64 object-contain mx-auto" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
