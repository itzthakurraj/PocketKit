import React, { useState } from 'react';
import { Copy, Check, Sparkles, Minimize2, Trash2 } from 'lucide-react';

export const CodeBeautifierTool: React.FC = () => {
  const [language, setLanguage] = useState<'html' | 'css' | 'js'>('html');
  const [code, setCode] = useState(
    '<!-- Sample HTML -->\n<div class="container"><header><h1>Welcome</h1><p>Toolkit format demo</p></header></div>'
  );
  const [copied, setCopied] = useState(false);

  const formatHtml = (htmlStr: string): string => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    htmlStr.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) {
        indent -= 1;
      }
      formatted += tab.repeat(Math.max(0, indent)) + '<' + element + '>\n';
      if (
        element.match(/^<?\w[^>]*[^\/]$/) &&
        !element.startsWith('input') &&
        !element.startsWith('img') &&
        !element.startsWith('br') &&
        !element.startsWith('hr') &&
        !element.startsWith('meta') &&
        !element.startsWith('link')
      ) {
        indent += 1;
      }
    });
    return formatted.substring(1, formatted.length - 2).trim();
  };

  const formatCss = (cssStr: string): string => {
    return cssStr
      .replace(/\s*([\{\};:])\s*/g, '$1')
      .replace(/\{/g, ' {\n  ')
      .replace(/;/g, ';\n  ')
      .replace(/\s*\}/g, '\n}\n\n')
      .trim();
  };

  const formatJs = (jsStr: string): string => {
    let indent = 0;
    const tab = '  ';
    return jsStr
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('}') || trimmed.startsWith(']')) {
          indent = Math.max(0, indent - 1);
        }
        const indented = tab.repeat(indent) + trimmed;
        if (trimmed.endsWith('{') || trimmed.endsWith('[')) {
          indent += 1;
        }
        return indented;
      })
      .join('\n');
  };

  const handleBeautify = () => {
    if (language === 'html') setCode(formatHtml(code));
    else if (language === 'css') setCode(formatCss(code));
    else setCode(formatJs(code));
  };

  const handleMinify = () => {
    if (language === 'html') {
      setCode(code.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim());
    } else if (language === 'css') {
      setCode(code.replace(/\s*([\{\};:,])\s*/g, '$1').replace(/\/\*.*?\*\//g, '').trim());
    } else {
      setCode(code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '').replace(/\s+/g, ' ').trim());
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => {
                setLanguage('html');
                setCode('<div class="box"><h1>Hello World</h1><p>Sample HTML</p></div>');
              }}
              className={`px-3 py-1.5 transition-colors ${
                language === 'html'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              HTML
            </button>
            <button
              onClick={() => {
                setLanguage('css');
                setCode('body{background:#fff;color:#333;}h1{font-size:2rem;margin:0;}');
              }}
              className={`px-3 py-1.5 transition-colors ${
                language === 'css'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              CSS
            </button>
            <button
              onClick={() => {
                setLanguage('js');
                setCode('function greet(user){if(!user)return "Guest";return "Hello "+user;}');
              }}
              className={`px-3 py-1.5 transition-colors ${
                language === 'js'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              JavaScript
            </button>
          </div>

          <button
            onClick={handleBeautify}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Beautify Code
          </button>
          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Minify Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCode('')}
            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
            title="Clear code"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        rows={12}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`Paste your ${language.toUpperCase()} code here...`}
        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
      />
    </div>
  );
};
