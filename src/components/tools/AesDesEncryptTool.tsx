import React, { useState } from 'react';
import {
  encryptAES,
  decryptAES,
  encryptDES,
  decryptDES,
} from '../../utils/cryptoUtils';
import { Lock, Unlock, Eye, EyeOff, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export const AesDesEncryptTool: React.FC = () => {
  const [cipher, setCipher] = useState<'AES' | 'DES'>('AES');
  const [action, setAction] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [secretKey, setSecretKey] = useState('SecretPassphrase123!');
  const [showKey, setShowKey] = useState(false);
  const [inputText, setInputText] = useState('Confidential message secured by Toolkit.');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    if (!secretKey) {
      setError('A secret key or passphrase is required');
      return;
    }

    if (action === 'encrypt') {
      const res = cipher === 'AES' ? encryptAES(inputText, secretKey) : encryptDES(inputText, secretKey);
      setOutputText(res);
    } else {
      const res = cipher === 'AES' ? decryptAES(inputText, secretKey) : decryptDES(inputText, secretKey);
      if (res.success) {
        setOutputText(res.result);
      } else {
        setError(res.error || 'Decryption failed');
        setOutputText('');
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration bar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cipher:</span>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setCipher('AES')}
                className={`px-3 py-1.5 transition-colors ${
                  cipher === 'AES'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                AES-256
              </button>
              <button
                onClick={() => setCipher('DES')}
                className={`px-3 py-1.5 transition-colors ${
                  cipher === 'DES'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                DES
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Action:</span>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => {
                  setAction('encrypt');
                  setError(null);
                }}
                className={`px-3.5 py-1.5 flex items-center gap-1.5 transition-colors ${
                  action === 'encrypt'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Encrypt
              </button>
              <button
                onClick={() => {
                  setAction('decrypt');
                  setError(null);
                }}
                className={`px-3.5 py-1.5 flex items-center gap-1.5 transition-colors ${
                  action === 'decrypt'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                Decrypt
              </button>
            </div>
          </div>
        </div>

        {/* Secret Key Input */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Secret Key / Passphrase
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter encryption passphrase..."
              className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Inputs and Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {action === 'encrypt' ? 'Plaintext to Encrypt' : 'Ciphertext to Decrypt'}
          </label>
          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={action === 'encrypt' ? 'Type message to encrypt...' : 'Paste Base64/cipher string...'}
          />
          <button
            onClick={handleProcess}
            className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Execute {cipher} {action === 'encrypt' ? 'Encryption' : 'Decryption'}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {action === 'encrypt' ? 'Encrypted Ciphertext' : 'Decrypted Plaintext'}
            </label>
            {outputText && (
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
            rows={7}
            readOnly
            value={outputText}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono text-xs"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
