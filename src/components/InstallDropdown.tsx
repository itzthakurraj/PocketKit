import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Smartphone,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Share2,
  X,
  Zap,
  Check,
  Globe,
  ArrowRight,
  Monitor,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../i18n/LanguageContext';
import { downloadPocketKitApk } from '../utils/downloadApk';
import { triggerHaptic } from '../utils/haptics';
import { DesktopInstallModal } from './DesktopInstallModal';
import { AndroidInstallModal } from './AndroidInstallModal';
import {
  downloadWindowsLauncher,
  downloadMacLauncher,
  downloadLinuxDesktopEntry,
} from '../utils/desktopDownload';

interface InstallDropdownProps {
  compact?: boolean;
  fullWidth?: boolean;
  className?: string;
  onNavigateToInstallPage?: () => void;
}

export const InstallDropdown: React.FC<InstallDropdownProps> = ({
  compact = false,
  fullWidth = false,
  className = '',
  onNavigateToInstallPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showPWAModal, setShowPWAModal] = useState(false);
  const [showDesktopModal, setShowDesktopModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [desktopDownloaded, setDesktopDownloaded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isInstallable, isInstalled, isIOS, isAndroid, install, desktopOS, isWindows, isMac, isLinux } = usePWAInstall();
  const { t } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleDownloadApk = async () => {
    setIsDownloadingApk(true);
    try {
      await downloadPocketKitApk();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch {
      // download initiated
    } finally {
      setIsDownloadingApk(false);
      setIsOpen(false);
    }
  };

  const handlePWAInstall = async () => {
    setIsOpen(false);
    if (isInstallable) {
      const res = await install();
      if (res.outcome !== 'accepted') {
        setShowPWAModal(true);
      }
    } else {
      setShowPWAModal(true);
    }
  };

  const handleDesktopInstall = async () => {
    triggerHaptic('heavy');
    setIsOpen(false);

    let downloadedFile = '';
    if (desktopOS === 'windows') {
      downloadWindowsLauncher(currentUrl);
      downloadedFile = 'PocketKit-Windows-Launcher.bat';
    } else if (desktopOS === 'macos') {
      downloadMacLauncher(currentUrl);
      downloadedFile = 'PocketKit-macOS.command';
    } else {
      downloadLinuxDesktopEntry(currentUrl);
      downloadedFile = 'pocketkit.desktop';
    }

    setDesktopDownloaded(downloadedFile);
    setTimeout(() => setDesktopDownloaded(null), 5000);

    if (isInstallable) {
      await install();
    } else {
      setShowDesktopModal(true);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pocketkit.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className={`relative inline-block ${fullWidth ? 'w-full' : ''}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer active:scale-98 ${
          fullWidth
            ? 'w-full py-3 px-5 text-sm bg-gradient-to-r from-indigo-600 via-indigo-600 to-emerald-600 text-white shadow-md hover:from-indigo-700 hover:to-emerald-700 tracking-wide'
            : compact
            ? 'px-3 py-1.5 text-xs bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:from-indigo-700 hover:to-emerald-700 shadow-sm'
            : 'px-4 py-2 text-xs bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-md hover:from-indigo-700 hover:to-emerald-700'
        } ${className}`}
        title="Download APK or Install App"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t('header.installApp', 'Install App')}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Download Success Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 border border-emerald-400">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-sm">PocketKit-release.apk Downloaded!</p>
            <p className="text-emerald-100 mt-0.5">
              Open the downloaded file on your phone to install PocketKit directly.
            </p>
          </div>
        </div>
      )}

      {/* Desktop Download Success Notification */}
      {desktopDownloaded && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 border border-indigo-400">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-sm">Downloaded {desktopDownloaded}!</p>
            <p className="text-indigo-100 mt-0.5">
              Launch the file to run PocketKit as a standalone desktop app on your PC.
            </p>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 bg-gradient-to-r from-indigo-50/80 to-emerald-50/80 dark:from-indigo-950/40 dark:to-emerald-950/40 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{t('download.title', 'Install & Download Options')}</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                100% Free
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your preferred install method for your phone or computer.
            </p>
          </div>

          <div className="p-2 space-y-1">
            {/* Option 1: Android (WebAPK) */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsOpen(false);
                setShowAndroidModal(true);
              }}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Android App (WebAPK)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                    1-Tap
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  Instant WebAPK • Zero parse errors • Direct phone install
                </p>
              </div>
            </button>

            {/* Option 2: Browser PWA Install */}
            <button
              onClick={handlePWAInstall}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Install Web App (PWA)
                  </span>
                  <span className="text-[10px] text-amber-500 font-semibold">Instant</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  Download web app to phone via Chrome / Edge / Brave
                </p>
              </div>
            </button>

            {/* Option 3: iOS Guide */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowIOSModal(true);
              }}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Install on iOS (iPhone / iPad)
                  </span>
                  <span className="text-[10px] text-indigo-500 font-semibold">Safari</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  Add to Home Screen via Safari Share Sheet
                </p>
              </div>
            </button>

            {/* Option 4: Windows, macOS & Linux Desktop App */}
            <button
              onClick={handleDesktopInstall}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Monitor className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Windows, macOS &amp; Linux Desktop App
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-1.5 py-0.2 rounded">
                    {desktopOS === 'macos' ? 'macOS' : desktopOS === 'linux' ? 'Linux' : 'Windows'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  Install PWA &amp; download OS launcher for standalone desktop
                </p>
              </div>
            </button>
          </div>

          {/* Footer View All Page */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigateToInstallPage) {
                  onNavigateToInstallPage();
                } else {
                  window.location.hash = 'install';
                }
              }}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Full Download Page & QR Codes</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PWA Phone Installation Modal */}
      {showPWAModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setShowPWAModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPWAModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Install Web App (PWA)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full offline access directly on your phone
                </p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 space-y-2">
                <p className="font-bold text-amber-800 dark:text-amber-300">
                  To download PocketKit Web App on your phone:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <li>
                    In <strong>Google Chrome</strong> on Android: Tap the <strong>three dots (⋮)</strong> at the top-right corner.
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    PocketKit will be downloaded directly to your phone apps with an app icon!
                  </li>
                </ol>
              </div>

              {/* Direct APK alternative button */}
              <div className="pt-2 text-center space-y-2">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Want the direct Android installer file instead?
                </p>
                <button
                  onClick={() => {
                    setShowPWAModal(false);
                    handleDownloadApk();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer shadow-md"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Download Standalone Android APK (.apk)</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPWAModal(false)}
              className="mt-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('tool.close', 'Close')}
            </button>
          </div>
        </div>
      )}

      {/* iOS Setup Guide Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-md">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Install PocketKit on iOS
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Native full-screen web app for iPhone & iPad
                </p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div className="leading-relaxed">
                  Open <strong>PocketKit</strong> in <strong>Safari</strong> on your iPhone or iPad.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div className="leading-relaxed">
                  Tap the <strong>Share</strong> button <span className="inline-flex items-center px-1.5 py-0.5 border rounded bg-white dark:bg-slate-700 text-[11px] font-mono">⎋</span> in Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div className="leading-relaxed">
                  Scroll down and tap <strong>Add to Home Screen</strong> <span className="inline-block px-1 font-bold">➕</span>, then tap <strong>Add</strong>.
                </div>
              </div>
            </div>

            {/* QR Code to scan with iPhone */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/70 text-center space-y-2">
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Scan with your iPhone Camera:
              </div>
              <div className="inline-block p-2 bg-white rounded-xl shadow-xs">
                <img
                  src={qrCodeUrl}
                  alt="QR Code to open PocketKit on iPhone"
                  className="w-28 h-28 object-contain"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  setShowIOSModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowIOSModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                {t('cookie.accept', 'Got it!')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Desktop Install & Launcher Modal */}
      <DesktopInstallModal
        isOpen={showDesktopModal}
        onClose={() => setShowDesktopModal(false)}
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
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        isInstallable={isInstallable}
        onTriggerPWAInstall={install}
      />
    </div>
  );
};
