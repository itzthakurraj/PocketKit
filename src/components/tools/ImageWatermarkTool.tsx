import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Stamp, Sliders } from 'lucide-react';

export const ImageWatermarkTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('© COPYRIGHT TOOLKIT');
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState('#FFFFFF');
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'tile'>('bottom-right');
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const renderCanvas = () => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Watermark styling
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = 'middle';

      if (position === 'tile') {
        const stepX = 260;
        const stepY = 180;
        ctx.rotate((-25 * Math.PI) / 180);
        for (let x = -img.width; x < img.width * 2; x += stepX) {
          for (let y = -img.height; y < img.height * 2; y += stepY) {
            ctx.fillText(watermarkText, x, y);
          }
        }
      } else {
        let x = 40;
        let y = 40;
        const metrics = ctx.measureText(watermarkText);
        const textWidth = metrics.width;

        if (position === 'center') {
          x = (canvas.width - textWidth) / 2;
          y = canvas.height / 2;
        } else if (position === 'bottom-right') {
          x = canvas.width - textWidth - 40;
          y = canvas.height - 50;
        } else if (position === 'bottom-left') {
          x = 40;
          y = canvas.height - 50;
        } else if (position === 'top-right') {
          x = canvas.width - textWidth - 40;
          y = 50;
        }

        ctx.translate(x + textWidth / 2, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(watermarkText, -textWidth / 2, 0);
      }

      ctx.restore();
    };
  };

  useEffect(() => {
    renderCanvas();
  }, [imageSrc, watermarkText, fontSize, color, opacity, position, rotation]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'watermarked-image.png';
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
            <Stamp className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Upload Image to Add Watermark
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Overlay customized branding, copyright stamps, or diagonal tiled security watermarks.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="tile">Diagonal Tiled Grid</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                <span>Opacity</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min={14}
                max={96}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Choose different image
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" /> Download Watermarked PNG
            </button>
          </div>

          {/* Canvas Preview */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-100 dark:bg-slate-900 text-center">
            <canvas ref={canvasRef} className="max-h-96 max-w-full mx-auto object-contain rounded-lg shadow-sm" />
          </div>
        </div>
      )}
    </div>
  );
};
