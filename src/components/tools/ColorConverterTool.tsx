import React, { useState } from 'react';
import {
  parseHex,
  rgbToHex,
  getColorInfoFromRgb,
  getColorHarmonies,
  ColorInfo,
} from '../../utils/colorUtils';
import { Copy, Check, Palette, Sparkles } from 'lucide-react';

export const ColorConverterTool: React.FC = () => {
  const [hexInput, setHexInput] = useState('#4F46E5');
  const [r, setR] = useState(79);
  const [g, setG] = useState(70);
  const [b, setB] = useState(229);
  const [alpha, setAlpha] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const info: ColorInfo = getColorInfoFromRgb(r, g, b, alpha);
  const harmonies = getColorHarmonies(info.hex);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = parseHex(val);
    if (parsed) {
      setR(parsed.r);
      setG(parsed.g);
      setB(parsed.b);
      setAlpha(parsed.a);
    }
  };

  const handleRgbChange = (newR: number, newG: number, newB: number) => {
    setR(newR);
    setG(newG);
    setB(newB);
    setHexInput(rgbToHex(newR, newG, newB));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Color Display Swatch */}
      <div
        className="h-36 sm:h-44 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col justify-end p-5 transition-colors relative overflow-hidden"
        style={{ backgroundColor: info.rgbaString }}
      >
        <div
          className={`flex items-center justify-between backdrop-blur-md px-4 py-2.5 rounded-xl border ${
            info.isLight
              ? 'bg-black/20 text-slate-900 border-white/40'
              : 'bg-white/20 text-white border-white/20'
          }`}
        >
          <div>
            <div className="font-mono text-xl font-bold">{info.hex}</div>
            <div className="text-xs opacity-90">{info.rgbaString}</div>
          </div>

          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/40 backdrop-blur cursor-pointer text-xs font-bold transition-colors">
            <Palette className="w-4 h-4" />
            <span>Pick Color</span>
            <input
              type="color"
              value={info.hex.slice(0, 7)}
              onChange={(e) => handleHexChange(e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* HEX Input */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Hexadecimal (HEX) Code
          </label>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#4F46E5"
            className="w-full px-3.5 py-2.5 font-mono text-base font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Opacity / Alpha: {Math.round(alpha * 100)}%</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-32 accent-indigo-600"
            />
          </div>
        </div>

        {/* RGB Sliders */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            RGB Channels
          </label>
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="w-4 text-rose-500">R</span>
              <input
                type="range"
                min={0}
                max={255}
                value={r}
                onChange={(e) => handleRgbChange(Number(e.target.value), g, b)}
                className="flex-1 accent-rose-500"
              />
              <span className="w-8 text-right font-mono text-slate-700 dark:text-slate-300">{r}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 text-emerald-500">G</span>
              <input
                type="range"
                min={0}
                max={255}
                value={g}
                onChange={(e) => handleRgbChange(r, Number(e.target.value), b)}
                className="flex-1 accent-emerald-500"
              />
              <span className="w-8 text-right font-mono text-slate-700 dark:text-slate-300">{g}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 text-blue-500">B</span>
              <input
                type="range"
                min={0}
                max={255}
                value={b}
                onChange={(e) => handleRgbChange(r, g, Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="w-8 text-right font-mono text-slate-700 dark:text-slate-300">{b}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyable CSS Code Snippets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'HEX', code: info.hex, key: 'hex' },
          { label: 'RGB', code: info.rgbString, key: 'rgb' },
          { label: 'RGBA', code: info.rgbaString, key: 'rgba' },
          { label: 'HSL', code: info.hslString, key: 'hsl' },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => handleCopy(item.code, item.key)}
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-indigo-500 cursor-pointer transition-colors group flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</div>
              <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                {item.code}
              </div>
            </div>
            <button className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {copiedKey === item.key ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Color Harmonies */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" /> Color Harmonies
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div
            onClick={() => handleHexChange(harmonies.complementary)}
            className="p-3 rounded-lg text-center cursor-pointer border border-slate-200 dark:border-slate-700 transition-transform hover:scale-105"
            style={{ backgroundColor: harmonies.complementary }}
          >
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 text-white font-mono">
              Complementary
            </span>
          </div>
          <div
            onClick={() => handleHexChange(harmonies.analogous1)}
            className="p-3 rounded-lg text-center cursor-pointer border border-slate-200 dark:border-slate-700 transition-transform hover:scale-105"
            style={{ backgroundColor: harmonies.analogous1 }}
          >
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 text-white font-mono">
              Analogous 1
            </span>
          </div>
          <div
            onClick={() => handleHexChange(harmonies.analogous2)}
            className="p-3 rounded-lg text-center cursor-pointer border border-slate-200 dark:border-slate-700 transition-transform hover:scale-105"
            style={{ backgroundColor: harmonies.analogous2 }}
          >
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 text-white font-mono">
              Analogous 2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
