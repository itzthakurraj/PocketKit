import React, { useState } from 'react';
import { generateLoremIpsum } from '../../utils/textUtils';
import { Copy, Check, RefreshCw, FileText } from 'lucide-react';

export const LoremGeneratorTool: React.FC = () => {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [htmlTags, setHtmlTags] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(() => generateLoremIpsum('paragraphs', 3, false));

  const handleGenerate = () => {
    setResult(generateLoremIpsum(type, count, htmlTags));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Generate:</span>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-medium">
              {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setResult(generateLoremIpsum(t, count, htmlTags));
                  }}
                  className={`px-3 py-1.5 capitalize transition-colors ${
                    type === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Count:</span>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => {
                const val = Math.max(1, Math.min(50, parseInt(e.target.value) || 1));
                setCount(val);
                setResult(generateLoremIpsum(type, val, htmlTags));
              }}
              className="w-16 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-center focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={htmlTags}
              onChange={(e) => {
                setHtmlTags(e.target.checked);
                setResult(generateLoremIpsum(type, count, e.target.checked));
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
            />
            Include &lt;p&gt; tags
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Result Output */}
      <div className="relative">
        <textarea
          rows={11}
          readOnly
          value={result}
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-serif text-sm leading-relaxed resize-y focus:outline-none"
        />
        <div className="text-[11px] text-slate-400 mt-2 text-right">
          {result.split(/\s+/).filter(Boolean).length} words generated
        </div>
      </div>
    </div>
  );
};
