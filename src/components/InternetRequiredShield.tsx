import React, { useEffect, useState, useCallback } from 'react';
import {
  WifiOff,
  Wifi,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface InternetRequiredShieldProps {
  onStatusChange?: (isOnline: boolean) => void;
}

export const InternetRequiredShield: React.FC<InternetRequiredShieldProps> = ({
  onStatusChange,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Active connectivity probe function
  const testConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    triggerHaptic('medium');

    try {
      // Fetch with cache busting to verify genuine internet throughput
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`/manifest.json?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const online = response.ok;
      setIsOnline(online);
      onStatusChange?.(online);

      if (online) {
        triggerHaptic('success');
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 4000);
      } else {
        triggerHaptic('error');
      }

      setIsChecking(false);
      return online;
    } catch {
      setIsOnline(false);
      onStatusChange?.(false);
      triggerHaptic('error');
      setIsChecking(false);
      return false;
    }
  }, [onStatusChange]);

  useEffect(() => {
    const handleOnline = () => {
      // Double check genuine internet connectivity
      testConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      onStatusChange?.(false);
      triggerHaptic('heavy');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic heartbeat every 15 seconds to catch silent disconnects
    const interval = setInterval(() => {
      if (!navigator.onLine && isOnline) {
        setIsOnline(false);
        onStatusChange?.(false);
      }
    }, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline, onStatusChange, testConnection]);

  // If user just reconnected, show temporary confirmation toast
  if (isOnline) {
    if (!justReconnected) return null;

    return (
      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl border border-emerald-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Wifi className="w-5 h-5 shrink-0 text-emerald-200 animate-pulse" />
        <div>
          <p className="font-bold text-xs">Internet Connection Restored!</p>
          <p className="text-[11px] text-emerald-100">
            PocketKit tools and sponsored ad services are active.
          </p>
        </div>
      </div>
    );
  }

  // Blocking Shield when offline
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-shield-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-300 select-none"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/15 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 shadow-inner">
          <WifiOff className="w-8 h-8 animate-pulse" />
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Offline — Tools Disabled</span>
        </div>

        {/* Main Title */}
        <h2
          id="offline-shield-title"
          className="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
        >
          Active Internet Connection Required
        </h2>

        {/* Subtitle / Core Explanation */}
        <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          PocketKit delivers <strong>70+ professional tools</strong> completely free of charge.
          To keep our tools free without subscriptions, we partner with{' '}
          <strong className="text-indigo-600 dark:text-indigo-400">Google AdSense</strong>.
        </p>

        {/* Callout Box explaining AdSense Monetization */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Why is internet required on all apps &amp; website?</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-normal">
            Advertisements require an active network connection to display. Because PocketKit earns exclusively through AdSense to sustain high-speed server operations and free access, tools are temporarily disabled while offline.
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Applies to Android, Windows, macOS, Linux, and Web</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={testConnection}
            disabled={isChecking}
            className="flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-70"
          >
            <RefreshCw
              className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`}
            />
            <span>{isChecking ? 'Checking Connection...' : 'Check Connection & Resume'}</span>
          </button>

          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            {showExplanation ? 'Hide Details' : 'Monetization Policy'}
          </button>
        </div>

        {/* Additional AdSense & Policy details */}
        {showExplanation && (
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-400 text-left leading-relaxed animate-in fade-in">
            <p>
              <strong>Publisher Agreement:</strong> All PocketKit desktop launchers, Android packages, and browser sessions are configured to request AdSense ad units. Disabling offline operation ensures full compliance with publisher ad viewability and monetization guidelines.
            </p>
          </div>
        )}

        <div className="mt-4 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <span>Please reconnect to Wi-Fi or cellular mobile data to continue.</span>
        </div>
      </div>
    </div>
  );
};
