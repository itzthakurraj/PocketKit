import React, { useState, useMemo } from 'react';
import { Copy, Check, Target, Search, Maximize, GitBranch, Type, Code2 } from 'lucide-react';

// ==========================================
// 1. CSS SPECIFICITY CALCULATOR
// ==========================================
export const CssSpecificityCalculatorTool: React.FC = () => {
  const [selector, setSelector] = useState('nav.main-nav ul#menu > li.active a:hover');

  const specificity = useMemo(() => {
    let s = selector.trim();
    if (!s) return { inline: 0, ids: 0, classes: 0, elements: 0, score: '0,0,0,0' };

    // IDs count: #id
    const idMatches = s.match(/#[a-zA-Z0-9_-]+/g) || [];
    const ids = idMatches.length;
    s = s.replace(/#[a-zA-Z0-9_-]+/g, ' ');

    // Classes, attributes, pseudo-classes (not :not, :is)
    const classMatches = s.match(/\.[a-zA-Z0-9_-]+/g) || [];
    const attrMatches = s.match(/\[[^\]]+\]/g) || [];
    const pseudoClassMatches = s.match(/:(?!not|is|where|has)[a-zA-Z0-9_-]+/g) || [];
    const classes = classMatches.length + attrMatches.length + pseudoClassMatches.length;

    // Elements & pseudo-elements
    const pseudoElements = s.match(/::[a-zA-Z0-9_-]+/g) || [];
    // remove non-alphanumeric separators
    const cleaned = s.replace(/[\.\:\[\]\>\+\~\*]/g, ' ');
    const words = cleaned.split(/\s+/).filter((w) => w && !/^(not|is|where|has)$/i.test(w));
    const elements = words.length + pseudoElements.length;

    return {
      inline: 0,
      ids,
      classes,
      elements,
      score: `0,${ids},${classes},${elements}`,
    };
  }, [selector]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">CSS Selector Specificity Calculator</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Calculate specificity weights (Inline, IDs, Classes, Elements) with cascade priority</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">CSS Selector</label>
          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            className="w-full mt-1.5 p-3 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Inline Styles</span>
            <div className="text-2xl font-black font-mono mt-1 text-slate-700 dark:text-slate-200 tabular-nums">0</div>
          </div>
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 text-center">
            <span className="text-[11px] font-semibold text-indigo-500 uppercase">IDs (#)</span>
            <div className="text-2xl font-black font-mono mt-1 text-indigo-600 dark:text-indigo-400 tabular-nums">{specificity.ids}</div>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-center">
            <span className="text-[11px] font-semibold text-emerald-500 uppercase">Classes (.)</span>
            <div className="text-2xl font-black font-mono mt-1 text-emerald-600 dark:text-emerald-400 tabular-nums">{specificity.classes}</div>
          </div>
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 text-center">
            <span className="text-[11px] font-semibold text-amber-500 uppercase">Elements</span>
            <div className="text-2xl font-black font-mono mt-1 text-amber-600 dark:text-amber-400 tabular-nums">{specificity.elements}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs flex items-center justify-between border border-slate-800">
          <span className="text-slate-400">Total Specificity Tuple:</span>
          <span className="text-base font-bold text-emerald-400">({specificity.score})</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CSS CLAMP FLUID TYPOGRAPHY CALCULATOR
// ==========================================
export const CssClampCalculatorTool: React.FC = () => {
  const [minWidth, setMinWidth] = useState(375);
  const [maxWidth, setMaxWidth] = useState(1440);
  const [minFontSize, setMinFontSize] = useState(16);
  const [maxFontSize, setMaxFontSize] = useState(24);
  const [copied, setCopied] = useState(false);

  const clampCss = useMemo(() => {
    // slope = (maxFontSize - minFontSize) / (maxWidth - minWidth)
    const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
    const yAxisIntersection = -minWidth * slope + minFontSize;
    const slopeVw = (slope * 100).toFixed(4);
    const interceptRem = (yAxisIntersection / 16).toFixed(4);
    const minRem = (minFontSize / 16).toFixed(4);
    const maxRem = (maxFontSize / 16).toFixed(4);

    return `font-size: clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem);`;
  }, [minWidth, maxWidth, minFontSize, maxFontSize]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">CSS clamp() Fluid Typography Calculator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Calculate responsive font sizes with smooth viewport scaling</p>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(clampCss);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy CSS'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Min Viewport (px)</label>
          <input
            type="number"
            value={minWidth}
            onChange={(e) => setMinWidth(Number(e.target.value))}
            className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Max Viewport (px)</label>
          <input
            type="number"
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Min Font Size (px)</label>
          <input
            type="number"
            value={minFontSize}
            onChange={(e) => setMinFontSize(Number(e.target.value))}
            className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Max Font Size (px)</label>
          <input
            type="number"
            value={maxFontSize}
            onChange={(e) => setMaxFontSize(Number(e.target.value))}
            className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-sm border border-slate-800">
        {clampCss}
      </div>
    </div>
  );
};

// ==========================================
// 3. GENERIC CODE TRANSFORM SUITE RUNNER
// ==========================================
interface CodeTransformSuiteProps {
  toolId?: string;
}

export const CodeTransformSuite: React.FC<CodeTransformSuiteProps> = ({ toolId }) => {
  switch (toolId) {
    case 'css-specificity-calc':
      return <CssSpecificityCalculatorTool />;
    case 'css-clamp-calculator':
      return <CssClampCalculatorTool />;
    default:
      return <CssSpecificityCalculatorTool />;
  }
};
