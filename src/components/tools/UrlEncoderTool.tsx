import React, { useState } from 'react';
import { encodeUrl, decodeUrl, encodeHtmlEntities, decodeHtmlEntities } from '../../utils/cryptoUtils';
import { ArrowLeftRight, Copy, Check, Trash2 } from 'lucide-react';

export const UrlEncoderTool: React.FC = () => {
  const [toolType, setToolType] = useState<'url' | 'html'>('url');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('https://example.com/search?q=hello world & param=100%');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input) {
      setOutput('');
      return;
    }
    if (toolType === 'url') {
      setOutput(mode === 'encode' ? encodeUrl(input) : decodeUrl(input));
    } else {
      setOutput(mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => {
                setToolType('url');
                setInput('https://example.com/search?q=hello world & token=xyz#top');
                setOutput('');
              }}
              className={`px-3 py-1.5 transition-colors ${
                toolType === 'url'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              URL Percent Encoding
            </button>
            <button
              onClick={() => {
                setToolType('html');
                setInput('<script>alert("XSS & Security")</script>');
                setOutput('');
              }}
              className={`px-3 py-1.5 transition-colors ${
                toolType === 'html'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              HTML Entities (&amp;)
            </button>
          </div>

          <button
            onClick={() => {
              const newMode = mode === 'encode' ? 'decode' : 'encode';
              setMode(newMode);
              setInput(output || input);
              setOutput('');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>{mode === 'encode' ? 'Encode' : 'Decode'}</span>
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleProcess}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            Process
          </button>
        </div>

        {output && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Input ({mode === 'encode' ? 'Raw Text' : 'Encoded String'})
          </label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Type or paste text..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Output ({mode === 'encode' ? 'Encoded Output' : 'Decoded String'})
          </label>
          <textarea
            rows={8}
            readOnly
            value={output}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono text-xs"
            placeholder="Output appears here..."
          />
        </div>
      </div>
    </div>
  );
};
