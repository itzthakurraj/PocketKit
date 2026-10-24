import React, { useState, useRef, useMemo } from 'react';
import {
  Palette,
  Copy,
  Check,
  Download,
  Sparkles,
  Sliders,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Maximize2,
  Brush,
} from 'lucide-react';

// ==========================================
// 1. SVG OPTIMIZER
// ==========================================
export const SvgOptimizerTool: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- Generator: Adobe Illustrator 28.0, SVG Export Plug-In -->
  <g id="Layer_1" data-name="Layer 1">
    <circle cx="50.0000" cy="50.0000" r="40.0000" fill="#6366f1" stroke="#4338ca" stroke-width="4.0000" />
    <path d="M 35.0000 50.0000 L 45.0000 60.0000 L 65.0000 40.0000" fill="none" stroke="#ffffff" stroke-width="6.0000" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`
  );
  const [copied, setCopied] = useState(false);

  const { optimized, originalSize, newSize, savings } = useMemo(() => {
    let out = svgInput
      .replace(/<!--[\s\S]*?-->/g, '') // strip comments
      .replace(/data-name="[^"]*"/g, '')
      .replace(/id="[^"]*"/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([<>={}:;,])\s*/g, '$1')
      .replace(/(\d+\.\d{3,})/g, (m) => Number(m).toFixed(2)) // round floats
      .trim();

    const orig = new Blob([svgInput]).size;
    const opt = new Blob([out]).size;
    const pct = orig > 0 ? Math.max(0, Math.round(((orig - opt) / orig) * 100)) : 0;
    return {
      optimized: out,
      originalSize: orig,
      newSize: opt,
      savings: pct,
    };
  }, [svgInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([optimized], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">SVG Optimizer & Minifier</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold">
            -{savings}% ({originalSize}B → {newSize}B)
          </span>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copy
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Download className="w-3.5 h-3.5" /> Download SVG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Raw SVG Markup</label>
          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Live Preview & Clean Output</label>
          <div className="h-32 mb-2 p-3 bg-slate-100 dark:bg-slate-950 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800"
               dangerouslySetInnerHTML={{ __html: optimized }}
          />
          <textarea
            readOnly
            value={optimized}
            rows={5}
            className="w-full p-2.5 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SVG TO PNG & WEBP CONVERTER
// ==========================================
export const SvgToPngConverterTool: React.FC = () => {
  const [svgData, setSvgData] = useState<string>(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="30" fill="url(#grad)" />
  <circle cx="100" cy="100" r="50" fill="#ffffff" opacity="0.9" />
  <text x="100" y="108" font-size="28" font-family="sans-serif" font-weight="bold" fill="#4f46e5" text-anchor="middle">PK</text>
</svg>`
  );
  const [scale, setScale] = useState<number>(2);

  const convertAndDownload = (format: 'png' | 'webp') => {
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = (img.naturalWidth || 200) * scale;
      canvas.height = (img.naturalHeight || 200) * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL(`image/${format}`, 0.95);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `rendered-vector@${scale}x.${format}`;
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">SVG to High-Res PNG & WebP</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="text-xs px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800"
          >
            <option value={1}>1x Standard</option>
            <option value={2}>2x Retina</option>
            <option value={4}>4x Ultra-HD</option>
          </select>
          <button onClick={() => convertAndDownload('png')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Download className="w-3.5 h-3.5" /> Export PNG
          </button>
          <button onClick={() => convertAndDownload('webp')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
            <Download className="w-3.5 h-3.5" /> Export WebP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">SVG Markup</label>
          <textarea
            value={svgData}
            onChange={(e) => setSvgData(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 mb-2">Live Raster Preview</span>
          <div dangerouslySetInnerHTML={{ __html: svgData }} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. WCAG AAA CONTRAST CHECKER
// ==========================================
export const WcagContrastCheckerTool: React.FC = () => {
  const [fg, setFg] = useState<string>('#1e293b');
  const [bg, setBg] = useState<string>('#f8fafc');

  const hexToLuminance = (hex: string): number => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const rgb = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const ratio = useMemo(() => {
    try {
      const l1 = hexToLuminance(fg);
      const l2 = hexToLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
    } catch {
      return 1;
    }
  }, [fg, bg]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">WCAG 2.1 Color Contrast Checker</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Foreground (Text)</label>
            <div className="flex items-center gap-2">
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
              <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="w-24 p-1.5 text-xs font-mono border rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold">Background</label>
            <div className="flex items-center gap-2">
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
              <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="w-24 p-1.5 text-xs font-mono border rounded" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl flex flex-col items-center justify-center border transition-all" style={{ backgroundColor: bg, color: fg }}>
          <div className="text-4xl font-extrabold font-mono mb-2">{ratio}:1</div>
          <div className="text-sm font-semibold">Preview Headline Text</div>
          <div className="text-xs opacity-90 mt-1">This is how body paragraphs look with this contrast.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'AA Normal Text', min: 4.5, pass: ratio >= 4.5 },
          { label: 'AA Large Text', min: 3.0, pass: ratio >= 3.0 },
          { label: 'AAA Normal Text', min: 7.0, pass: ratio >= 7.0 },
          { label: 'AAA Large Text', min: 4.5, pass: ratio >= 4.5 },
        ].map((item, i) => (
          <div key={i} className={`p-3 rounded-xl border flex items-center justify-between ${item.pass ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300'}`}>
            <div>
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[10px] text-slate-500">Requires {item.min}:1</div>
            </div>
            {item.pass ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. HARMONIC PALETTE GENERATOR
// ==========================================
export const PaletteGeneratorTool: React.FC = () => {
  const [baseColor, setBaseColor] = useState<string>('#6366f1');
  const [copied, setCopied] = useState<string | null>(null);

  const hexToHsl = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    let r = parseInt(c.slice(0, 2), 16) / 255;
    let g = parseInt(c.slice(2, 4), 16) / 255;
    let b = parseInt(c.slice(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h = ((h % 360) + 360) % 360;
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; }
    else if (60 <= h && h < 120) { r = x; g = c; }
    else if (120 <= h && h < 180) { g = c; b = x; }
    else if (180 <= h && h < 240) { g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; b = c; }
    else if (300 <= h && h < 360) { r = c; b = x; }
    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const harmonies = useMemo(() => {
    const [h, s, l] = hexToHsl(baseColor);
    return {
      Complementary: [baseColor, hslToHex(h + 180, s, l)],
      Triadic: [baseColor, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      Analogous: [hslToHex(h - 30, s, l), baseColor, hslToHex(h + 30, s, l)],
      SplitComp: [baseColor, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
    };
  }, [baseColor]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Harmonic Color Palette Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none" />
          <input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-24 p-1.5 text-xs font-mono border rounded" />
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(harmonies).map(([name, colors]) => (
          <div key={name} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{name} Palette</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {colors.map((hex, i) => (
                <div
                  key={i}
                  onClick={() => {
                    navigator.clipboard.writeText(hex);
                    setCopied(hex);
                    setTimeout(() => setCopied(null), 1500);
                  }}
                  className="h-16 rounded-xl flex items-end justify-between p-2 text-white font-mono text-xs font-bold cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                  style={{ backgroundColor: hex }}
                >
                  <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">{hex}</span>
                  <span className="text-[10px]">{copied === hex ? 'Copied!' : 'Click'}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. CANVAS SIGNATURE PAD
// ==========================================
export const CanvasSignaturePadTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1e293b');
  const [lineWidth, setLineWidth] = useState(3);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'signature.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Brush className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Digital Signature Pad</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearCanvas} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 border rounded-lg">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
          <button onClick={downloadPng} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Download className="w-3.5 h-3.5" /> Download PNG
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={220}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="bg-white dark:bg-slate-900 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-xl cursor-crosshair shadow-sm touch-none"
        />
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span>Ink Color:</span>
          {['#0f172a', '#2563eb', '#dc2626', '#059669'].map(c => (
            <button
              key={c}
              onClick={() => setPenColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${penColor === c ? 'ring-2 ring-indigo-500' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span>Stroke: {lineWidth}px</span>
          <input type="range" min={1} max={8} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-24 accent-indigo-600" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. CSS MESH GRADIENT GENERATOR
// ==========================================
export const CssMeshGradientTool: React.FC = () => {
  const [c1, setC1] = useState('#4f46e5');
  const [c2, setC2] = useState('#06b6d4');
  const [c3, setC3] = useState('#f43f5e');
  const [c4, setC4] = useState('#8b5cf6');
  const [copied, setCopied] = useState(false);

  const gradientCss = useMemo(() => {
    return `background-color: ${c1};
background-image: 
  radial-gradient(at 0% 0%, ${c2} 0px, transparent 50%),
  radial-gradient(at 100% 0%, ${c3} 0px, transparent 50%),
  radial-gradient(at 100% 100%, ${c4} 0px, transparent 50%),
  radial-gradient(at 0% 100%, ${c1} 0px, transparent 50%);`;
  }, [c1, c2, c3, c4]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">CSS Radial Mesh Gradient Generator</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(gradientCss);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy CSS
        </button>
      </div>

      <div
        className="h-48 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 flex items-center justify-center text-white font-bold text-lg drop-shadow"
        style={{
          backgroundColor: c1,
          backgroundImage: `radial-gradient(at 0% 0%, ${c2} 0px, transparent 50%), radial-gradient(at 100% 0%, ${c3} 0px, transparent 50%), radial-gradient(at 100% 100%, ${c4} 0px, transparent 50%), radial-gradient(at 0% 100%, ${c1} 0px, transparent 50%)`
        }}
      >
        Live Modern Mesh Canvas
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Color 1 (Bottom Left)', val: c1, set: setC1 },
          { label: 'Color 2 (Top Left)', val: c2, set: setC2 },
          { label: 'Color 3 (Top Right)', val: c3, set: setC3 },
          { label: 'Color 4 (Bottom Right)', val: c4, set: setC4 },
        ].map((item, idx) => (
          <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-500 block truncate">{item.label}</span>
            <div className="flex items-center gap-2">
              <input type="color" value={item.val} onChange={(e) => item.set(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-none" />
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-bold">{item.val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. BORDER RADIUS VISUALIZER (Fancy Blobs)
// ==========================================
export const BorderRadiusVisualizerTool: React.FC = () => {
  const [r1, setR1] = useState(60);
  const [r2, setR2] = useState(40);
  const [r3, setR3] = useState(30);
  const [r4, setR4] = useState(70);
  const [copied, setCopied] = useState(false);

  const radiusCss = `${r1}% ${100 - r1}% ${r3}% ${100 - r3}% / ${r2}% ${r4}% ${100 - r4}% ${100 - r2}%`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">8-Point CSS Border Radius (Blob Maker)</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`border-radius: ${radiusCss};`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy CSS
        </button>
      </div>

      <div className="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-950 rounded-2xl">
        <div
          className="w-56 h-56 bg-gradient-to-tr from-indigo-500 to-rose-500 shadow-xl transition-all duration-300 flex items-center justify-center text-white font-mono text-xs"
          style={{ borderRadius: radiusCss }}
        >
          Dynamic Blob
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-[11px] text-slate-500">Horizontal Top: {r1}%</label>
          <input type="range" min={10} max={90} value={r1} onChange={(e) => setR1(Number(e.target.value))} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="text-[11px] text-slate-500">Vertical Right: {r2}%</label>
          <input type="range" min={10} max={90} value={r2} onChange={(e) => setR2(Number(e.target.value))} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="text-[11px] text-slate-500">Horizontal Bottom: {r3}%</label>
          <input type="range" min={10} max={90} value={r3} onChange={(e) => setR3(Number(e.target.value))} className="w-full accent-indigo-600" />
        </div>
        <div>
          <label className="text-[11px] text-slate-500">Vertical Left: {r4}%</label>
          <input type="range" min={10} max={90} value={r4} onChange={(e) => setR4(Number(e.target.value))} className="w-full accent-indigo-600" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. SOCIAL MEDIA IMAGE RESIZER & PRESETS
// ==========================================
export const SocialMediaResizerTool: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState({ name: 'Instagram Square Post', w: 1080, h: 1080, ratio: '1:1' });

  const PRESETS = [
    { name: 'Instagram Square Post', w: 1080, h: 1080, ratio: '1:1' },
    { name: 'Instagram Story / Reel', w: 1080, h: 1920, ratio: '9:16' },
    { name: 'YouTube Thumbnail', w: 1280, h: 720, ratio: '16:9' },
    { name: 'Twitter/X Post Header', w: 1200, h: 675, ratio: '16:9' },
    { name: 'LinkedIn Banner', w: 1584, h: 396, ratio: '4:1' },
    { name: 'Facebook Event Cover', w: 1920, h: 1080, ratio: '16:9' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Social Media Dimension Standards</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPreset(p)}
            className={`p-3 rounded-xl border text-left transition-all ${selectedPreset.name === p.name ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{p.name}</div>
            <div className="font-mono text-indigo-600 dark:text-indigo-400 text-xs mt-1">{p.w} × {p.h} px</div>
            <div className="text-[10px] text-slate-400">{p.ratio} Aspect Ratio</div>
          </button>
        ))}
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Target Resolution: {selectedPreset.name}</h4>
        <p className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
          {selectedPreset.w}px × {selectedPreset.h}px ({selectedPreset.ratio})
        </p>
        <p className="text-xs text-slate-500">Perfect crisp export dimensions for retina mobile screens.</p>
      </div>
    </div>
  );
};
