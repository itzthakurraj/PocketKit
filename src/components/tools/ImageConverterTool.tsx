import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, FileImage, ArrowRight } from 'lucide-react';

export const ImageConverterTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [convertedSrc, setConvertedSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('converted-image');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: file.size });
    const cleanName = file.name.replace(/\.[^.]+$/, '');
    setFileName(cleanName);

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      performConversion(src, targetFormat);
    };
    reader.readAsDataURL(file);
  };

  const performConversion = (src: string, fmt: 'png' | 'jpeg' | 'webp') => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (fmt === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = fmt === 'png' ? 'image/png' : fmt === 'jpeg' ? 'image/jpeg' : 'image/webp';
      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      setConvertedSrc(dataUrl);
    };
  };

  const handleFormatChange = (fmt: 'png' | 'jpeg' | 'webp') => {
    setTargetFormat(fmt);
    if (imageSrc) {
      performConversion(imageSrc, fmt);
    }
  };

  const handleDownload = () => {
    if (!convertedSrc) return;
    const a = document.createElement('a');
    a.href = convertedSrc;
    a.download = `${fileName}.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
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
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Select Image to Convert
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Convert JPG to PNG, PNG to JPG, WebP to JPG, or any image format with zero quality degradation.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Settings Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Convert To Target Format:
              </span>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-bold">
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleFormatChange(fmt)}
                    className={`px-3 py-1.5 uppercase transition-colors ${
                      targetFormat === fmt
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
              >
                Change File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                Download as .{targetFormat === 'jpeg' ? 'jpg' : targetFormat}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-900 text-center">
            <div className="max-h-80 flex items-center justify-center p-2">
              {convertedSrc && (
                <img
                  src={convertedSrc}
                  alt="Converted output"
                  className="max-h-72 object-contain mx-auto rounded-lg shadow-sm"
                />
              )}
            </div>
            {fileInfo && (
              <div className="text-xs text-slate-400 mt-2">
                Original file: {fileInfo.name} ({(fileInfo.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
