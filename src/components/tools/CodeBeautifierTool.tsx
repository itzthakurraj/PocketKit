import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Code2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const CodeBeautifierTool: React.FC = () => {
  const [lang, setLang] = useState<'html' | 'css' | 'js'>('html');
  const [input, setInput] = useState('<div class="hero"><h1>Welcome to PocketKit</h1><p>Client-side suite</p><button onClick="start()">Explore</button></div>');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const beautify = () => {
    let res = input.trim();
    if (lang === 'html') {
      res = res
        .replace(/>\s*</g, '>\n<')
        .split('\n')
        .map((line) => {
          return line.trim();
        })
        .join('\n');
    } else if (lang === 'css') {
      res = res
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    } else {
      res = res
        .replace(/\{/g, ' {\n  ')
        .replace(/;/g, ';\n  ')
        .replace(/\}/g, '\n}\n')
        .trim();
    }
    setOutput(res);
  };

  React.useEffect(() => {
    beautify();
  }, [input, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
        {(['html', 'css', 'js'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setLang(mode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
              lang === mode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {mode} Beautifier
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Raw Code
          </label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Formatted Code
          </label>
          <textarea
            readOnly
            rows={10}
            value={output}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy Formatted Code')}</span>
        </button>
      </div>
    </div>
  );
};
