import React, { useState } from 'react';
import { Upload, Download, Image as ImageIcon, Sliders, CheckCircle, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

export const ImageCompressorTool: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.75);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    triggerHaptic('medium');
    setImageFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    compress(url, quality, file.type);
  };

  const compress = (srcUrl: string, q: number, mimeType = 'image/jpeg') => {
    setIsProcessing(true);
    const img = new Image();
    img.src = srcUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              setCompressedUrl(URL.createObjectURL(blob));
              triggerHaptic('success');
            }
            setIsProcessing(false);
          },
          mimeType === 'image/png' ? 'image/png' : 'image/jpeg',
          q
        );
      }
    };
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    triggerHaptic('selection');
    if (previewUrl && imageFile) {
      compress(previewUrl, q, imageFile.type);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const savedPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  const handleSpeakStats = () => {
    triggerHaptic('voice');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(
        `Original photo size ${formatSize(originalSize)}. Compressed size ${formatSize(compressedSize)}, reduced by ${savedPercent} percent.`
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Upload Zone */}
      {!previewUrl ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 transition-colors cursor-pointer text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-slate-800 dark:text-white text-base">
            Select Photo to Compress
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports JPG, PNG, WebP (100% private in browser)
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-4">
          {/* Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Compression Quality</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.95}
                step={0.05}
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSpeakStats}
                className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Stats</span>
              </button>
              <label className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer">
                Change Image
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Original</span>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{formatSize(originalSize)}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Compressed</span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatSize(compressedSize)}</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Saved</span>
              <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">-{savedPercent}%</div>
            </div>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 text-center">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">Original Photo</span>
              <img src={previewUrl} alt="Original" className="max-h-60 mx-auto object-contain rounded-xl" />
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900 p-2 text-center">
              <span className="text-[11px] font-bold text-emerald-500 block mb-2">Optimized Output</span>
              {compressedUrl && (
                <img src={compressedUrl} alt="Compressed" className="max-h-60 mx-auto object-contain rounded-xl" />
              )}
            </div>
          </div>

          {/* Download button with haptic feedback */}
          <div className="flex justify-end">
            <a
              href={compressedUrl || '#'}
              download={`compressed-${imageFile?.name || 'photo.jpg'}`}
              onClick={() => triggerHaptic('success')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md transition-colors cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{t('tool.download', 'Download Compressed Image')}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
