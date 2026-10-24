import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF, isEncrypted } from '@pdfsmaller/pdf-decrypt';
import {
  Lock,
  Unlock,
  Upload,
  Download,
  Key,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
  Sliders,
  Copy,
  Printer,
  Sparkles,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface PdfPasswordSecurityToolProps {
  initialMode?: 'protect' | 'remove';
}

export const PdfPasswordSecurityTool: React.FC<PdfPasswordSecurityToolProps> = ({
  initialMode = 'protect',
}) => {
  const [activeTab, setActiveTab] = useState<'protect' | 'remove'>(initialMode);

  // File states
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [fileEncryptedInfo, setFileEncryptedInfo] = useState<{
    encrypted: boolean;
    algorithm?: string;
  } | null>(null);

  // Protect PDF inputs
  const [protectPassword, setProtectPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [allowModifying, setAllowModifying] = useState(false);
  const [showProtectPass, setShowProtectPass] = useState(false);

  // Remove Password inputs
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showUnlockPass, setShowUnlockPass] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setStatusMessage({ type: 'error', text: 'Please select a valid PDF document (.pdf)' });
      return;
    }

    triggerHaptic('light');
    setFile(selectedFile);
    setStatusMessage(null);
    setResultBlobUrl(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setFileBytes(bytes);

      // Check encryption status
      const enc = await isEncrypted(bytes);
      setFileEncryptedInfo(enc);

      if (enc.encrypted) {
        setPageCount(null);
        if (activeTab === 'protect') {
          setStatusMessage({
            type: 'info',
            text: 'This PDF is already password-protected. Switch to "Unlock PDF" tab if you want to remove its password.',
          });
        } else {
          setStatusMessage({
            type: 'info',
            text: `Document is encrypted with ${enc.algorithm || 'AES'}. Enter the password below to remove protection.`,
          });
        }
      } else {
        // Count pages if not encrypted
        try {
          const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
          setPageCount(doc.getPageCount());
        } catch {
          setPageCount(null);
        }

        if (activeTab === 'remove') {
          setStatusMessage({
            type: 'info',
            text: 'This PDF is not password-protected. No password removal is needed.',
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Could not read PDF: ' + (err.message || 'Unknown error') });
    }
  };

  // Protect PDF Handler
  const handleProtectPdf = async () => {
    if (!fileBytes || !file) {
      setStatusMessage({ type: 'error', text: 'Please select a PDF file first.' });
      return;
    }

    if (!protectPassword.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a password to protect your PDF.' });
      return;
    }

    if (protectPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please re-enter carefully.' });
      return;
    }

    triggerHaptic('medium');
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      // Encrypt PDF with AES-256 client-side
      const encryptedBytes = await encryptPDF(fileBytes, protectPassword, {
        ownerPassword: ownerPassword.trim() || protectPassword,
        algorithm: 'AES-256',
        allowPrinting: allowPrinting,
        allowCopying: allowCopying,
        allowModifying: allowModifying,
      });

      const blob = new Blob([new Uint8Array(encryptedBytes) as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputName = file.name.replace(/\.pdf$/i, '') + '_protected.pdf';

      setResultBlobUrl(url);
      setResultFileName(outputName);
      setStatusMessage({
        type: 'success',
        text: 'PDF successfully protected with military-grade AES-256 encryption!',
      });
      triggerHaptic('success');
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to encrypt PDF: ' + (err.message || 'Please check document format.'),
      });
      triggerHaptic('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove Password Handler
  const handleRemovePassword = async () => {
    if (!fileBytes || !file) {
      setStatusMessage({ type: 'error', text: 'Please select a PDF file first.' });
      return;
    }

    if (fileEncryptedInfo && !fileEncryptedInfo.encrypted) {
      setStatusMessage({ type: 'info', text: 'This PDF is already unlocked. No decryption required.' });
      return;
    }

    if (!unlockPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter the current document password.' });
      return;
    }

    triggerHaptic('medium');
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      // Decrypt PDF client-side
      const decryptedBytes = await decryptPDF(fileBytes, unlockPassword);

      const blob = new Blob([new Uint8Array(decryptedBytes) as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputName = file.name.replace(/\.pdf$/i, '') + '_unlocked.pdf';

      setResultBlobUrl(url);
      setResultFileName(outputName);
      setStatusMessage({
        type: 'success',
        text: 'Password successfully removed! Your PDF is now unlocked and unrestricted.',
      });
      triggerHaptic('success');
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to unlock PDF: Incorrect password or unsupported encryption type.',
      });
      triggerHaptic('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, text: 'Weak', color: 'bg-red-500 text-red-500' };
    if (score <= 3) return { score: 2, text: 'Good', color: 'bg-amber-500 text-amber-500' };
    return { score: 3, text: 'Strong (AES-256 Ready)', color: 'bg-emerald-500 text-emerald-500' };
  };

  const strength = getPasswordStrength(protectPassword);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => {
            setActiveTab('protect');
            triggerHaptic('light');
            setStatusMessage(null);
            setResultBlobUrl(null);
          }}
          className={`px-4 py-2.5 font-bold text-sm rounded-t-xl flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'protect'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Protect PDF with Password</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('remove');
            triggerHaptic('light');
            setStatusMessage(null);
            setResultBlobUrl(null);
          }}
          className={`px-4 py-2.5 font-bold text-sm rounded-t-xl flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'remove'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>Remove PDF Password (Unlock)</span>
        </button>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Upload Zone */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            1. Select PDF Document
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-base">{file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB {pageCount ? `• ${pageCount} pages` : ''}
                    {fileEncryptedInfo?.encrypted ? ' • 🔒 Encrypted' : ' • 🔓 Unprotected'}
                  </p>
                </div>
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 underline mt-1">
                  Click or drag another file to replace
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <Upload className="w-8 h-8 text-slate-400" />
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Click or Drag & Drop your PDF document here
                </p>
                <p className="text-xs text-slate-400">
                  Files are processed 100% in your browser. Zero cloud upload.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: Protect PDF */}
        {activeTab === 'protect' && (
          <div className="space-y-5 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Set Protection Password
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Password (Required to Open)
                </label>
                <div className="relative">
                  <input
                    type={showProtectPass ? 'text' : 'password'}
                    value={protectPassword}
                    onChange={(e) => setProtectPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowProtectPass(!showProtectPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showProtectPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {protectPassword && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color.split(' ')[0]}`}
                        style={{ width: `${(strength.score / 3) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {strength.text}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showProtectPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Permissions & Security Flags */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                3. Security & Permission Settings
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPrinting}
                    onChange={(e) => setAllowPrinting(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">Allow Printing</span>
                    <span className="text-slate-400 text-[10px]">Permit high-quality printing</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowCopying}
                    onChange={(e) => setAllowCopying(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">Allow Copying</span>
                    <span className="text-slate-400 text-[10px]">Permit text and image copy</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowModifying}
                    onChange={(e) => setAllowModifying(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">Allow Modifications</span>
                    <span className="text-slate-400 text-[10px]">Permit edits & annotations</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-3">
              <button
                onClick={handleProtectPdf}
                disabled={isProcessing || !file}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Encrypting PDF with AES-256...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Encrypt & Protect PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Remove Password */}
        {activeTab === 'remove' && (
          <div className="space-y-5 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Enter Current PDF Password
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password to Unlock & Decrypt Document
              </label>
              <div className="relative max-w-md">
                <input
                  type={showUnlockPass ? 'text' : 'password'}
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowUnlockPass(!showUnlockPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showUnlockPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Once unlocked, the encryption is permanently stripped from the new copy.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-3">
              <button
                onClick={handleRemovePassword}
                disabled={isProcessing || !file}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Removing Password & Decrypting...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Remove Password & Unlock PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Feedback / Status */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 text-sm ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : statusMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium leading-relaxed">{statusMessage.text}</div>
          </div>
        )}

        {/* Download Section if Output Ready */}
        {resultBlobUrl && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-950/50 dark:via-slate-900 dark:to-indigo-950/50 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{resultFileName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready to download • Client-side processed
                </p>
              </div>
            </div>

            <a
              href={resultBlobUrl}
              download={resultFileName}
              onClick={() => triggerHaptic('success')}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>
        )}
      </div>

      {/* Trust & Security Footnote */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2">
        <span className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Zero Server Uploads • 100% Private</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-indigo-500" />
          <span>ISO 32000 AES-256 Compliant</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Unlimited & Free Forever</span>
        </span>
      </div>
    </div>
  );
};
