import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  Monitor,
  HelpCircle,
  QrCode,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../i18n/LanguageContext';
import { triggerHaptic } from '../utils/haptics';
import { DesktopInstallModal } from '../components/DesktopInstallModal';
import { AndroidInstallModal } from '../components/AndroidInstallModal';
import { AdBanner } from '../components/AdBanner';
import {
  DesktopOS,
  downloadWindowsLauncher,
  downloadMacLauncher,
  downloadLinuxDesktopEntry,
} from '../utils/desktopDownload';

export const InstallPage: React.FC = () => {
  const { isInstallable, install, desktopOS, isWindows, isMac, isLinux } = usePWAInstall();
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [pwaPromptOpen, setPwaPromptOpen] = useState(false);
  const [desktopModalOpen, setDesktopModalOpen] = useState(false);
  const [androidModalOpen, setAndroidModalOpen] = useState(false);
  const [desktopDownloaded, setDesktopDownloaded] = useState<string | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pocketkit.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}`;

  const handleCopyLink = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 px-2 sm:px-4 animate-in fade-in duration-300">
      {/* Hero Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Download className="w-3.5 h-3.5" />
          <span>PocketKit Installation Hub</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Get PocketKit on{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            Any Device
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Choose your platform to install PocketKit. Download the standalone Android APK or install
          natively on iOS and Desktop with full offline capabilities and zero tracking.
        </p>

        {/* Quick Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Zero Sign-up Required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-500" /> Instant Offline Ready
          </span>
        </div>
      </section>

      {/* Main Download Options Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- Card 1: Android APK --- */}
        <div className="bg-white dark:bg-[#1a202c] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Android</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50">
                      WebAPK v2.0.4
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official 1-Tap Google WebAPK (No Parse Errors)
                  </p>
                </div>
              </div>
            </div>

            {/* Specs Table */}
            <div className="grid grid-cols-2 gap-2 text-xs p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div>
                <span className="text-slate-400">File Size:</span>{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">&lt; 1 MB</span>
              </div>
              <div>
                <span className="text-slate-400">Target OS:</span>{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">Android 8.0+</span>
              </div>
              <div>
                <span className="text-slate-400">Architecture:</span>{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">Universal</span>
              </div>
              <div>
                <span className="text-slate-400">Permissions:</span>{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Zero Needed</span>
              </div>
            </div>

            {/* Android Install Actions */}
            <div className="space-y-3">
              {/* Primary 1-Tap WebAPK Install */}
              <button
                onClick={async () => {
                  triggerHaptic('heavy');
                  if (isInstallable) {
                    await install();
                  } else {
                    setAndroidModalOpen(true);
                  }
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 text-center"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>Install on Android (1-Tap WebAPK • Recommended)</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setAndroidModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>View WebAPK Installation Guide &amp; Benefits</span>
              </button>
            </div>

            {/* Installation Steps & AdSense Policy Notice */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recommended Android Setup:
              </h4>
              <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Tap <strong>Install on Android</strong> above for instant 1-tap installation.</li>
                <li>Or in Chrome / Samsung Internet, tap menu (<strong>⋮</strong>) &gt; <strong>Install app</strong>.</li>
                <li>This creates a certified WebAPK on your phone with zero parse errors.</li>
              </ol>

              <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Online Policy:</strong> PocketKit on Android requires an active internet connection to serve Google AdSense sponsored advertisements, keeping all 70+ tools completely free without paid subscriptions.
              </div>
            </div>
          </div>

          {/* Android QR Code */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">
              <img src={qrCodeUrl} alt="Scan to download APK on mobile" className="w-16 h-16 object-contain" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Scan with your phone:</p>
              <p>Point your Android camera here to open PocketKit directly on your device.</p>
            </div>
          </div>
        </div>

        {/* --- Card 2: iOS (iPhone & iPad) --- */}
        <div className="bg-white dark:bg-[#1a202c] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-md">
                  <Share2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Apple iOS</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300/50">
                      iPhone & iPad
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Safari Progressive Web App (PWA)
                  </p>
                </div>
              </div>
            </div>

            {/* Specs Table */}
            <div className="grid grid-cols-2 gap-2 text-xs p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div>
                <span className="text-slate-400">Storage Used:</span>{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">&lt; 5 MB Cache</span>
              </div>
              <div>
                <span className="text-slate-400">Target OS:</span>{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">iOS 14.0+</span>
              </div>
              <div>
                <span className="text-slate-400">Access Model:</span>{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Free (Online)</span>
              </div>
              <div>
                <span className="text-slate-400">App Store:</span>{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Zero Login Needed</span>
              </div>
            </div>

            {/* iOS Visual Steps */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-3">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                  3 Simple Steps to Install on iPhone:
                </h4>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Open <strong>Safari</strong> and navigate to PocketKit.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Tap the <strong>Share</strong> button <span className="inline-block px-1 border rounded bg-white dark:bg-slate-800 text-[10px] font-mono">⎋</span> in your Safari toolbar.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Select <strong>Add to Home Screen</strong> <span className="inline-block px-1 font-bold">➕</span>, then tap <strong>Add</strong>.
                    </span>
                  </div>
                </div>
              </div>

              {/* Copy URL Button */}
              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy PocketKit Link to Open on iPhone'}</span>
              </button>
            </div>
          </div>

          {/* iOS QR Code */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">
              <img src={qrCodeUrl} alt="Scan on iPhone" className="w-16 h-16 object-contain" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Scan with iPhone Camera:</p>
              <p>Opens directly in Safari so you can tap Share &gt; Add to Home Screen instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Desktop PWA & Web Browsers (Windows, macOS & Linux) --- */}
      <section className="bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/70 dark:from-slate-900 dark:via-[#1a202c] dark:to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Monitor className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Windows, macOS & Linux Desktop App
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50">
                  Detected: {desktopOS === 'macos' ? 'macOS (Apple)' : desktopOS === 'linux' ? 'Linux' : 'Windows PC'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Install PocketKit as a standalone desktop application on Windows, macOS, or Linux. Launches with full-screen focus, high-speed client execution, and zero browser tab clutter.
              </p>
            </div>
          </div>

          {/* Primary Quick Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={async () => {
                triggerHaptic('heavy');
                // Automatically download the launcher based on detected OS
                if (desktopOS === 'windows') {
                  downloadWindowsLauncher(currentUrl);
                  setDesktopDownloaded('PocketKit-Windows-Launcher.bat');
                } else if (desktopOS === 'macos') {
                  downloadMacLauncher(currentUrl);
                  setDesktopDownloaded('PocketKit-macOS.command');
                } else {
                  downloadLinuxDesktopEntry(currentUrl);
                  setDesktopDownloaded('pocketkit.desktop');
                }
                setTimeout(() => setDesktopDownloaded(null), 4500);

                // Trigger browser PWA install prompt if available
                if (isInstallable) {
                  await install();
                } else {
                  setDesktopModalOpen(true);
                }
              }}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>
                {desktopOS === 'macos'
                  ? 'Install PocketKit for macOS'
                  : desktopOS === 'linux'
                  ? 'Install PocketKit for Linux'
                  : 'Install PocketKit for Windows'}
              </span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setDesktopModalOpen(true);
              }}
              className="px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              All Desktop Options
            </button>
          </div>
        </div>

        {desktopDownloaded && (
          <div className="p-3.5 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>Downloaded {desktopDownloaded}! Launch to run PocketKit on your desktop.</span>
          </div>
        )}

        {/* 3-Column OS Cards Grid for Windows, macOS & Linux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Windows */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              desktopOS === 'windows'
                ? 'bg-white dark:bg-slate-800/90 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'bg-white/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🪟</span>
                {desktopOS === 'windows' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Your System
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold">Windows 10/11</span>
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Windows PC</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Pin to Start Menu & Taskbar using Microsoft Edge or Google Chrome PWA.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <button
                type="button"
                onClick={async () => {
                  triggerHaptic('medium');
                  if (isInstallable) {
                    await install();
                  } else {
                    downloadWindowsLauncher(currentUrl);
                    setDesktopDownloaded('PocketKit-Windows-Launcher.bat');
                    setTimeout(() => setDesktopDownloaded(null), 4500);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>1-Click PWA Install</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadWindowsLauncher(currentUrl);
                  setDesktopDownloaded('PocketKit-Windows-Launcher.bat');
                  setTimeout(() => setDesktopDownloaded(null), 4500);
                }}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .bat Launcher</span>
              </button>
            </div>
          </div>

          {/* Card 2: macOS */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              desktopOS === 'macos'
                ? 'bg-white dark:bg-slate-800/90 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'bg-white/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🍎</span>
                {desktopOS === 'macos' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Your System
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold">Sonoma / Sequoia / Intel</span>
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Apple Mac</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Safari "Add to Dock" makes PocketKit a native Mac app in Launchpad.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <button
                type="button"
                onClick={async () => {
                  triggerHaptic('medium');
                  if (isInstallable) {
                    await install();
                  } else {
                    setDesktopModalOpen(true);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Install via Safari / Chrome</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadMacLauncher(currentUrl);
                  setDesktopDownloaded('PocketKit-macOS.command');
                  setTimeout(() => setDesktopDownloaded(null), 4500);
                }}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .command Script</span>
              </button>
            </div>
          </div>

          {/* Card 3: Linux */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              desktopOS === 'linux'
                ? 'bg-white dark:bg-slate-800/90 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'bg-white/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🐧</span>
                {desktopOS === 'linux' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Your System
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-semibold">Ubuntu / Debian / Fedora</span>
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Linux Desktop</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Chromium PWA or standalone XDG <code>.desktop</code> entry in app menu.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <button
                type="button"
                onClick={async () => {
                  triggerHaptic('medium');
                  if (isInstallable) {
                    await install();
                  } else {
                    downloadLinuxDesktopEntry(currentUrl);
                    setDesktopDownloaded('pocketkit.desktop');
                    setTimeout(() => setDesktopDownloaded(null), 4500);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>1-Click PWA Install</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadLinuxDesktopEntry(currentUrl);
                  setDesktopDownloaded('pocketkit.desktop');
                  setTimeout(() => setDesktopDownloaded(null), 4500);
                }}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .desktop Entry</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsored AdSense Placement */}
      <AdBanner slotId="1000000004" format="auto" className="my-6" />

      {/* --- Section 4: FAQ & Safety Guarantee --- */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a202c] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Is the Android APK &amp; WebAPK safe to install?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes, absolutely. PocketKit is client-side and privacy-respecting. It requires
              zero special Android permissions (no location, no contacts, no camera tracking) and never sends
              your personal files or passwords to external servers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a202c] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Is an active Internet connection required to use PocketKit?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes. PocketKit provides all 70+ tools completely free without paid subscriptions through our partnership with Google AdSense. To display sponsored advertisements that fund our continuous maintenance and operations, an active internet connection is mandatory across Android, Windows, macOS, Linux, and Web.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a202c] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Why install on iOS via Safari instead of App Store?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Apple Safari's "Add to Home Screen" uses modern PWA standards. It gives you the exact same
              full-screen native look, zero App Store download delays, instant updates, and consumes less
              than 5 MB of device storage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a202c] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              How do I receive updates?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The PWA and iOS home-screen app update automatically in the background whenever you're connected.
              For Android APK, you can download newer versions anytime from this page.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Desktop Install & Launcher Modal */}
      <DesktopInstallModal
        isOpen={desktopModalOpen}
        onClose={() => setDesktopModalOpen(false)}
        detectedOS={desktopOS}
        isInstallable={isInstallable}
        onTriggerPWAInstall={async () => {
          if (isInstallable) {
            await install();
          }
        }}
      />

      {/* Official Android WebAPK & APK Installer Modal */}
      <AndroidInstallModal
        isOpen={androidModalOpen}
        onClose={() => setAndroidModalOpen(false)}
        isInstallable={isInstallable}
        onTriggerPWAInstall={install}
      />
    </div>
  );
};
