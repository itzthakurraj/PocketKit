import React, { useState, useRef } from 'react';
import { Upload, Download, Crop, RotateCcw } from 'lucide-react';

export const ImageCropperTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspect, setAspect] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 }); // in percentages
  const [croppedResult, setCroppedResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      performCrop(src, cropBox);
    };
    reader.readAsDataURL(file);
  };

  const performCrop = (src: string, box: { x: number; y: number; width: number; height: number }) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const startX = (box.x / 100) * img.width;
      const startY = (box.y / 100) * img.height;
      const cropW = (box.width / 100) * img.width;
      const cropH = (box.height / 100) * img.height;

      canvas.width = Math.max(1, cropW);
      canvas.height = Math.max(1, cropH);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, startX, startY, cropW, cropH, 0, 0, canvas.width, canvas.height);
      setCroppedResult(canvas.toDataURL('image/png'));
    };
  };

  const handleAspectChange = (newAspect: 'free' | '1:1' | '16:9' | '4:3') => {
    setAspect(newAspect);
    let newBox = { ...cropBox };
    if (newAspect === '1:1') {
      newBox = { x: 15, y: 15, width: 70, height: 70 };
    } else if (newAspect === '16:9') {
      newBox = { x: 5, y: 20, width: 90, height: 50 };
    } else if (newAspect === '4:3') {
      newBox = { x: 10, y: 15, width: 80, height: 60 };
    }
    setCropBox(newBox);
    if (imageSrc) performCrop(imageSrc, newBox);
  };

  const handleDownload = () => {
    if (!croppedResult) return;
    const a = document.createElement('a');
    a.href = croppedResult;
    a.download = 'cropped-image.png';
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
            <Crop className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Select an Image to Crop
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Interactive canvas crop with preset ratios (1:1, 16:9, 4:3) or custom sizing.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Aspect Ratio:</span>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
                {(['free', '1:1', '16:9', '4:3'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleAspectChange(r)}
                    className={`px-3 py-1.5 uppercase transition-colors ${
                      aspect === r
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              >
                Change Image
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
                Download Cropped
              </button>
            </div>
          </div>

          {/* Crop area preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-900 text-center space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Crop Frame Area</div>
              <div className="relative max-h-72 inline-block overflow-hidden rounded-lg">
                <img src={imageSrc} alt="Source" className="max-h-64 object-contain" />
                {/* Crop overlay box */}
                <div
                  className="absolute border-2 border-indigo-500 bg-indigo-500/20 pointer-events-none rounded-xs"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`,
                  }}
                />
              </div>

              {/* Adjust sliders */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2">
                <div>
                  <span className="block text-[10px] font-bold">Width: {cropBox.width}%</span>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={cropBox.width}
                    onChange={(e) => {
                      const nb = { ...cropBox, width: Number(e.target.value) };
                      setCropBox(nb);
                      if (imageSrc) performCrop(imageSrc, nb);
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <span className="block text-[10px] font-bold">Height: {cropBox.height}%</span>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={cropBox.height}
                    onChange={(e) => {
                      const nb = { ...cropBox, height: Number(e.target.value) };
                      setCropBox(nb);
                      if (imageSrc) performCrop(imageSrc, nb);
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/40 p-4 bg-slate-100 dark:bg-slate-900 text-center space-y-2">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                Cropped Output Result
              </div>
              <div className="max-h-72 flex items-center justify-center p-2">
                {croppedResult && (
                  <img src={croppedResult} alt="Cropped" className="max-h-64 object-contain rounded-lg shadow-sm" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
