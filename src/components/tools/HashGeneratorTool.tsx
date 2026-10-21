import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Copy, Check, Hash, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const HashGeneratorTool: React.FC = () => {
  const [text, setText] = useState('PocketKit Secure 2026');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { t } = useLanguage();

  const md5Hash = CryptoJS.MD5(text).toString();
  const sha1Hash = CryptoJS.SHA1(text).toString();
  const sha256Hash = CryptoJS.SHA256(text).toString();
  const sha512Hash = CryptoJS.SHA512(text).toString();

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const hashes = [
    { name: 'MD5 (128-bit)', key: 'md5', val: md5Hash },
    { name: 'SHA-1 (160-bit)', key: 'sha1', val: sha1Hash },
    { name: 'SHA-256 (256-bit)', key: 'sha256', val: sha256Hash },
    { name: 'SHA-512 (512-bit)', key: 'sha512', val: sha512Hash },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
          Input Text / String
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to hash..."
          className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-3">
        {hashes.map((item) => (
          <div
            key={item.key}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
              <button
                onClick={() => handleCopy(item.val, item.key)}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === item.key ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy')}
              </button>
            </div>
            <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/80 dark:border-slate-800">
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
