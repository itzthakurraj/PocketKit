import React, { useState } from 'react';
import { Copy, Check, Palette } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const ColorConverterTool: React.FC = () => {
  const [hex, setHex] = useState('#4F46E5');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { t } = useLanguage();

  // Convert hex to rgb
  const hexToRgb = (hexStr: string) => {
    let clean = hexStr.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    if (isNaN(num) || clean.length !== 6) return { r: 79, g: 70, b: 229 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const { r, g, b } = hexToRgb(hex);
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const hslString = (() => {
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  })();

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Visual Color Preview */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-800/60">
        <div
          className="w-24 h-24 rounded-2xl shadow-md border-2 border-white dark:border-slate-700 shrink-0"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Pick Color or Enter Hex
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className="flex-1 p-2 font-mono font-bold text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Format Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'HEX', val: hex, key: 'hex' },
          { label: 'RGB', val: rgbString, key: 'rgb' },
          { label: 'HSL', val: hslString, key: 'hsl' },
        ].map((item) => (
          <div
            key={item.key}
            className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</span>
              <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-0.5">{item.val}</div>
            </div>
            <button
              onClick={() => handleCopy(item.val, item.key)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              {copiedKey === item.key ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
