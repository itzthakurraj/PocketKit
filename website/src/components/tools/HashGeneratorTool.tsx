import React, { useState } from 'react';
import { computeMD5, computeSHA256, computeSHA512 } from '../../utils/cryptoUtils';
import { Copy, Check, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export const HashGeneratorTool: React.FC = () => {
  const [input, setInput] = useState('Verify this data integrity');
  const [verifyHash, setVerifyHash] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const md5 = computeMD5(input);
  const sha256 = computeSHA256(input);
  const sha512 = computeSHA512(input);

  const handleCopy = (hash: string, key: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const cleanVerify = verifyHash.trim().toLowerCase();
  const isMatch =
    cleanVerify.length > 0 &&
    (cleanVerify === md5.toLowerCase() ||
      cleanVerify === sha256.toLowerCase() ||
      cleanVerify === sha512.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
          Input String to Hash
        </label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Enter text here to generate hashes..."
        />
      </div>

      {/* Generated Hashes */}
      <div className="space-y-3">
        {/* SHA-256 */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              SHA-256 (256-bit Secure Hash)
            </span>
            <button
              onClick={() => handleCopy(sha256, 'sha256')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'sha256' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            {sha256 || '...'}
          </p>
        </div>

        {/* MD5 */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              MD5 (128-bit Checksum)
            </span>
            <button
              onClick={() => handleCopy(md5, 'md5')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {copiedKey === 'md5' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'md5' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            {md5 || '...'}
          </p>
        </div>

        {/* SHA-512 */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              SHA-512 (512-bit High Security)
            </span>
            <button
              onClick={() => handleCopy(sha512, 'sha512')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {copiedKey === 'sha512' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'sha512' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            {sha512 || '...'}
          </p>
        </div>
      </div>

      {/* Hash Verifier */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Verify Against an Expected Hash
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={verifyHash}
            onChange={(e) => setVerifyHash(e.target.value)}
            placeholder="Paste hash to compare..."
            className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        {cleanVerify && (
          <div className="pt-1">
            {isMatch ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Hash Match Confirmed!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4" /> Hash Does Not Match
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
