import React, { useState } from 'react';
import { Upload, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ImageConverterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const u = URL.createObjectURL(f);
    setPreview(u);
    convertImage(u, targetFormat);
  };

  const convertImage = (src: string, fmt: 'image/jpeg' | 'image/png' | 'image/webp') => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (fmt === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) setConvertedUrl(URL.createObjectURL(blob));
        }, fmt, 0.92);
      }
    };
  };

  const handleFormatChange = (fmt: 'image/jpeg' | 'image/png' | 'image/webp') => {
    setTargetFormat(fmt);
    if (preview) convertImage(preview, fmt);
  };

  const getExtension = () => {
    if (targetFormat === 'image/jpeg') return 'jpg';
    if (targetFormat === 'image/webp') return 'webp';
    return 'png';
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 cursor-pointer">
          <Upload className="w-8 h-8 text-indigo-600 mb-2" />
          <span className="font-bold text-sm text-slate-800 dark:text-white">Choose Image to Convert</span>
          <span className="text-xs text-slate-400 mt-1">Convert PNG, JPG, WebP directly in browser</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Target Format:</span>
              {(['image/png', 'image/jpeg', 'image/webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleFormatChange(fmt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                    targetFormat === fmt
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {fmt.split('/')[1]}
                </button>
              ))}
            </div>

            <label className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
              Choose Another
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-center">
            {convertedUrl && (
              <img src={convertedUrl} alt="Converted" className="max-h-64 mx-auto object-contain rounded-xl" />
            )}
          </div>

          <div className="flex justify-end">
            <a
              href={convertedUrl || '#'}
              download={`converted-image.${getExtension()}`}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t('tool.download', 'Download Converted Image')}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
