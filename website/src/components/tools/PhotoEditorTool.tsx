import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCw, FlipHorizontal, FlipVertical, RotateCcw, Sliders } from 'lucide-react';

export const PhotoEditorTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setBlur(0);
    setGrayscale(0);
    setSepia(0);
    setInvert(0);
    setHueRotate(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%) invert(${invert}%) hue-rotate(${hueRotate}deg)`;
  const transformStyle = `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

  const handleDownload = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const isRotated90or270 = rotation % 180 !== 0;
      canvas.width = isRotated90or270 ? img.height : img.width;
      canvas.height = isRotated90or270 ? img.width : img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = filterStyle;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'edited-photo.png';
      a.click();
    };
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
            <Sliders className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Select a Photo to Edit
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Apply creative filters, adjust brightness & contrast, rotate, and flip images client-side.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Photo Preview */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[420px] overflow-hidden">
            <div className="relative max-h-96 flex items-center justify-center overflow-hidden">
              <img
                src={imageSrc}
                alt="Editor Preview"
                style={{
                  filter: filterStyle,
                  transform: transformStyle,
                  transition: 'all 0.15s ease-out',
                }}
                className="max-h-80 object-contain rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Controls Column */}
          <div className="space-y-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            {/* Top Buttons */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Photo Adjustments
              </span>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-rose-500 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Transform buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-100"
              >
                <RotateCw className="w-3.5 h-3.5" /> 90°
              </button>
              <button
                onClick={() => setFlipH(!flipH)}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 ${
                  flipH
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" /> Flip X
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 ${
                  flipV
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                }`}
              >
                <FlipVertical className="w-3.5 h-3.5" /> Flip Y
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-3.5 text-xs font-medium text-slate-600 dark:text-slate-300 max-h-72 overflow-y-auto pr-1">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Brightness</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Contrast</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Saturation</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{saturate}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={saturate}
                  onChange={(e) => setSaturate(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Grayscale</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Sepia</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{sepia}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Blur</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleDownload}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Save & Download Image
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Select Different Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
