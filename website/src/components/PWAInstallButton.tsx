import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white'
            : 'px-3.5 py-2 text-xs bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-md hover:from-indigo-700 hover:to-emerald-700'
        }`}
        title="Install as an App on your phone or desktop"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer ${
            compact
              ? 'px-2.5 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800'
              : 'px-3 py-2 text-xs bg-indigo-600 text-white shadow-sm'
          }`}
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Install on iPhone or iPad
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                <span>1. Tap the <strong>Share</strong> button <span className="inline-block px-1 border rounded text-[10px]">⎋</span> in your Safari toolbar.</span><br />
                <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span><br />
                <span>3. Launch anytime with offline support!</span>
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop browsers before prompt or standard browsers
  return (
    <button
      onClick={() => {
        // Trigger alert-less explanation modal or prompt
        window.dispatchEvent(new CustomEvent('request-pwa-install'));
      }}
      className={`flex items-center gap-1.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer ${
        compact
          ? 'px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          : 'px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
      title="Install this web app"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install App</span>
    </button>
  );
};
