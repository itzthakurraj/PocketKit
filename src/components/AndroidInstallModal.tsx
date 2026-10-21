import React from 'react';
import {
  Smartphone,
  CheckCircle,
  X,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onTriggerPWAInstall: () => Promise<any>;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  onTriggerPWAInstall,
}) => {
  if (!isOpen) return null;

  const handleInstantPWAInstall = async () => {
    triggerHaptic('heavy');
    try {
      const res = await onTriggerPWAInstall();
      if (res?.outcome === 'accepted') {
        onClose();
      }
    } catch (e) {
      console.debug('PWA prompt fallback:', e);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Install on Android
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Universal
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Google WebAPK (Direct to Home Screen)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official WebAPK 1-Tap (Recommended - Solves Parse Error) */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-900 border-2 border-indigo-500/40 shadow-sm relative">
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>Recommended</span>
          </div>

          <h4 className="text-sm font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
            1-Tap Instant Install (No Parse Errors)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Google Chrome and Samsung Internet generate a verified, system-signed Android WebAPK directly onto your device. No &quot;unknown sources&quot; warnings or parse errors!
          </p>

          <div className="mt-3.5 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleInstantPWAInstall}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isInstallable ? 'Install Now to Home Screen' : 'Add to Android Home Screen'}</span>
            </button>
          </div>

          {/* Chrome Manual Instructions fallback */}
          <div className="mt-3 pt-3 border-t border-indigo-200/50 dark:border-indigo-900/50 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Or install manually via Chrome / Samsung Internet:
            </p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Tap the three dots (<strong>⋮</strong>) in the top-right of your browser.</li>
              <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
              <li>Tap <strong>&quot;Install&quot;</strong> to place PocketKit on your phone.</li>
            </ol>
          </div>
        </div>

        {/* Benefits of WebAPK vs Sideloaded APK */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Why 1-Tap WebAPK is Better than Raw APK Files:</span>
          </h4>
          <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Zero Parsing Errors:</strong> Built by Android&apos;s OS engine specifically for your phone version.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>No Sideload Warning:</strong> Doesn&apos;t require dangerous &quot;Install Unknown Apps&quot; permissions.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Always Up-to-Date:</strong> Receives newest tools and bug fixes automatically without reinstalling.</span>
            </li>
          </ul>
        </div>

        {/* Online & AdSense Notice */}
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 text-[11px] text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-500" />
          <span>
            PocketKit tools require active internet on Android to show Google AdSense ads and keep all tools 100% free forever.
          </span>
        </div>
      </div>
    </div>
  );
};
