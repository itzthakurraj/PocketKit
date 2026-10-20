import React, { useState } from 'react';
import { textToAscii, asciiToText } from '../../utils/textUtils';
import { ArrowLeftRight, Copy, Check, Trash2 } from 'lucide-react';

export const AsciiConverterTool: React.FC = () => {
  const [mode, setMode] = useState<'textToAscii' | 'asciiToText'>('textToAscii');
  const [format, setFormat] = useState<'dec' | 'bin' | 'hex'>('dec');
  const [delimiter, setDelimiter] = useState(' ');
  const [input, setInput] = useState('Hello, World!');
  const [copied, setCopied] = useState(false);

  const output =
    mode === 'textToAscii'
      ? textToAscii(input, delimiter, format)
      : asciiToText(input, delimiter, format);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'textToAscii' ? 'asciiToText' : 'textToAscii'));
    setInput(output);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Direction:</span>
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs"
          >
            <span>{mode === 'textToAscii' ? 'Text ➔ ASCII' : 'ASCII ➔ Text'}</span>
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Encoding:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'dec' | 'bin' | 'hex')}
              className="text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="dec">Decimal (65 66 67)</option>
              <option value="bin">Binary (01000001)</option>
              <option value="hex">Hexadecimal (41 42 43)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value=" ">Space (" ")</option>
              <option value=",">Comma (",")</option>
              <option value="-">Hyphen ("-")</option>
              <option value="">None (Continuous)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side or Stacked Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {mode === 'textToAscii' ? 'Plain Text Input' : 'ASCII Code Input'}
            </label>
            <button
              onClick={() => setInput('')}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'textToAscii'
                ? 'Type or paste plain text here...'
                : 'Paste numeric ASCII codes separated by spaces...'
            }
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {mode === 'textToAscii' ? 'ASCII Representation' : 'Converted Plain Text'}
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>
          <textarea
            rows={8}
            readOnly
            value={output}
            placeholder="Result will appear here..."
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono text-sm resize-y"
          />
        </div>
      </div>
    </div>
  );
};
