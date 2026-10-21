import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Download,
  X,
  Check,
  Copy,
  Sparkles,
  ExternalLink,
  Laptop,
  Terminal,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  DesktopOS,
  downloadWindowsLauncher,
  downloadMacLauncher,
  downloadLinuxDesktopEntry,
} from '../utils/desktopDownload';
import { useLanguage } from '../i18n/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface DesktopInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedOS: DesktopOS;
  isInstallable: boolean;
  onTriggerPWAInstall: () => Promise<void>;
}

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  isOpen,
  onClose,
  detectedOS,
  isInstallable,
  onTriggerPWAInstall,
}) => {
  const { t } = useLanguage();
  const [selectedOS, setSelectedOS] = useState<DesktopOS>(detectedOS);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    setSelectedOS(detectedOS);
  }, [detectedOS]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        triggerHaptic('light');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pocketkit.app';

  const handleDownloadForOS = (os: DesktopOS) => {
    triggerHaptic('heavy');
    if (os === 'windows') {
      downloadWindowsLauncher(currentUrl);
      setDownloadSuccess('PocketKit-Windows-Launcher.bat');
    } else if (os === 'macos') {
      downloadMacLauncher(currentUrl);
      setDownloadSuccess('PocketKit-macOS.command');
    } else {
      downloadLinuxDesktopEntry(currentUrl);
      setDownloadSuccess('pocketkit.desktop');
    }
    setTimeout(() => setDownloadSuccess(null), 4500);
  };

  const linuxCliCmd = `curl -fsSL ${currentUrl}/PocketKit-release.apk || wget ${currentUrl}/pocketkit.desktop -O ~/.local/share/applications/pocketkit.desktop`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Desktop App & PWA Installation
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Detected: {detectedOS.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Install as a standalone application on Windows, macOS, or Linux
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OS Selector Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
          {[
            { id: 'windows', label: 'Windows (10/11)', icon: '🪟' },
            { id: 'macos', label: 'macOS (Apple Silicon & Intel)', icon: '🍎' },
            { id: 'linux', label: 'Linux (Ubuntu/Debian/Fedora)', icon: '🐧' },
          ].map((tab) => {
            const isTabActive = selectedOS === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedOS(tab.id as DesktopOS);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isTabActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {detectedOS === tab.id && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                      isTabActive ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                    }`}
                  >
                    Your OS
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Download Notification */}
          {downloadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Downloaded {downloadSuccess}! Launch to open PocketKit in native desktop window.</span>
              </div>
            </div>
          )}

          {/* Primary Action Button based on selected OS */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedOS === 'windows' && 'Install PocketKit for Windows (PWA & Desktop)'}
                  {selectedOS === 'macos' && 'Install PocketKit for macOS (PWA & Dock)'}
                  {selectedOS === 'linux' && 'Install PocketKit for Linux (PWA & Desktop Entry)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Full standalone window with zero browser tab clutter and 100% offline access
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Offline Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Option A: Browser Native PWA Install */}
              <button
                type="button"
                onClick={async () => {
                  triggerHaptic('medium');
                  await onTriggerPWAInstall();
                }}
                className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>1-Click Browser PWA Install</span>
              </button>

              {/* Option B: Download OS Desktop Launcher Package */}
              <button
                type="button"
                onClick={() => handleDownloadForOS(selectedOS)}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>
                  {selectedOS === 'windows' && 'Download Windows Launcher (.bat)'}
                  {selectedOS === 'macos' && 'Download macOS Launcher (.command)'}
                  {selectedOS === 'linux' && 'Download .desktop Entry File'}
                </span>
              </button>
            </div>
          </div>

          {/* OS-Specific Step-by-Step Instructions */}
          {selectedOS === 'windows' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                How to Install on Windows 10 & 11:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                    Method 1: Edge / Chrome PWA
                  </span>
                  <ol className="list-decimal list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Look at the right side of the address bar at the top.</li>
                    <li>Click the <strong>"App available - Install"</strong> icon (or 3 dots &gt; <em>Apps</em>).</li>
                    <li>Click <strong>Install</strong> to pin PocketKit to your Start Menu and Taskbar!</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    Method 2: Windows Desktop Launcher
                  </span>
                  <ol className="list-decimal list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Click <strong>"Download Windows Launcher (.bat)"</strong> above.</li>
                    <li>Save it to your Desktop or Documents folder.</li>
                    <li>Double-click anytime to open PocketKit in a dedicated desktop window.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {selectedOS === 'macos' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                How to Install on macOS:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                    Safari "Add to Dock" (Sonoma/Sequoia)
                  </span>
                  <ol className="list-decimal list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Open PocketKit in Safari on your Mac.</li>
                    <li>Click <strong>File</strong> in the top menu bar.</li>
                    <li>Select <strong>"Add to Dock..."</strong> and click <strong>Add</strong>.</li>
                    <li>PocketKit is now a real macOS app in your Dock and Launchpad!</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    Chrome / Edge Standalone App
                  </span>
                  <ol className="list-decimal list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    <li>In Chrome/Edge on macOS, click the <strong>Install</strong> icon in the URL bar.</li>
                    <li>Click <strong>Install</strong> to add PocketKit to <code>~/Applications</code>.</li>
                    <li>Or click <strong>"Download macOS Launcher"</strong> for an instant script.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {selectedOS === 'linux' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                How to Install on Linux (Ubuntu, Debian, Fedora, Arch):
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 block">
                    Option 1: Chrome / Chromium / Brave PWA
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">
                    Open PocketKit in your Chromium-based browser, tap the three dots menu &gt; <strong>Save and Share</strong> &gt; <strong>Install PocketKit</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Option 2: .desktop Entry
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadForOS('linux')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Download pocketkit.desktop
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Download <code>pocketkit.desktop</code> and place it into <code>~/.local/share/applications/</code>:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] flex items-center justify-between">
                    <code>mv ~/Downloads/pocketkit.desktop ~/.local/share/applications/</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('mv ~/Downloads/pocketkit.desktop ~/.local/share/applications/ && chmod +x ~/.local/share/applications/pocketkit.desktop');
                        setCopiedCmd(true);
                        setTimeout(() => setCopiedCmd(false), 2000);
                      }}
                      className="ml-2 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] hover:text-white"
                    >
                      {copiedCmd ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Tracking • Runs 100% Offline in Browser Engine</span>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
