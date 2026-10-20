import React, { useState } from 'react';
import { encodeBase64, decodeBase64 } from '../../utils/cryptoUtils';
import { ArrowLeftRight, Upload, Copy, Check, FileCode, AlertCircle } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Hello from Toolkit!');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleProcess = () => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      setOutput(encodeBase64(input));
    } else {
      const res = decodeBase64(input.trim());
      if (res.success) {
        setOutput(res.result);
      } else {
        setError(res.error || 'Failed to decode Base64 string');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (mode === 'encode') {
        setOutput(result);
      } else {
        setInput(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const newMode = mode === 'encode' ? 'decode' : 'encode';
              setMode(newMode);
              setInput(output || input);
              setOutput('');
              setError(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <span>{mode === 'encode' ? 'Text ➔ Base64' : 'Base64 ➔ Text'}</span>
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleProcess}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
        </div>

        {/* File to Base64 Upload */}
        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File to Base64</span>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {fileName && (
        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
          <FileCode className="w-4 h-4" />
          Loaded file: {fileName}
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {mode === 'encode' ? 'Plain Text String' : 'Base64 Encoded Input'}
          </label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 payload...'}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {mode === 'encode' ? 'Base64 Encoded String' : 'Decoded Plain Text'}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            rows={8}
            readOnly
            value={output}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono text-xs"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
