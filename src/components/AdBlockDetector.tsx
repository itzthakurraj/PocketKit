import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Heart,
  RefreshCw,
  X,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Check,
  Layers,
  ChevronDown,
  Minimize2,
} from 'lucide-react';
import { useAdBlockDetector } from '../hooks/useAdBlockDetector';
import { triggerHaptic } from '../utils/haptics';

type BlockerTab = 'ublock' | 'adblock' | 'brave' | 'safari' | 'chrome';

export const AdBlockDetector: React.FC = () => {
  const { isAdBlocked, isChecking, isDismissed, checkAdBlocker, dismissAlert, resetDismiss } =
    useAdBlockDetector();

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<BlockerTab>('ublock');
  const [isRechecking, setIsRechecking] = useState<boolean>(false);
  const [recheckStatus, setRecheckStatus] = useState<'idle' | 'success' | 'still_blocked'>('idle');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Listen for external guide trigger (e.g. from AdBanner)
  useEffect(() => {
    const handleOpenGuide = () => {
      setIsGuideOpen(true);
      resetDismiss();
      setIsMinimized(false);
    };

    window.addEventListener('pocketkit:open-adblock-guide', handleOpenGuide);
    return () => window.removeEventListener('pocketkit:open-adblock-guide', handleOpenGuide);
  }, [resetDismiss]);

  const handleRecheck = async () => {
    setIsRechecking(true);
    triggerHaptic('medium');
    setRecheckStatus('idle');

    // Run re-check probe
    const blocked = await checkAdBlocker();
    setIsRechecking(false);

    if (!blocked) {
      setRecheckStatus('success');
      triggerHaptic('success');
      setTimeout(() => {
        setIsGuideOpen(false);
        setRecheckStatus('idle');
      }, 2500);
    } else {
      setRecheckStatus('still_blocked');
      triggerHaptic('error');
    }
  };

  // If not blocked or explicitly dismissed (and guide is closed), render nothing
  if ((!isAdBlocked || isDismissed) && !isGuideOpen) {
    return null;
  }

  return (
    <>
      {/* --- Minimized Floating Pill Button --- */}
      {isMinimized && !isGuideOpen && isAdBlocked && (
        <aside
          aria-label="Ad blocker alert"
          className="fixed bottom-4 left-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsMinimized(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>AdBlock Active • Support Free Tools</span>
          </button>
        </aside>
      )}

      {/* --- Main Floating Polite Banner --- */}
      {!isMinimized && !isGuideOpen && isAdBlocked && (
        <aside
          aria-label="Ad blocker notice"
          className="fixed bottom-4 right-4 max-w-md w-[calc(100%-2rem)] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-amber-300/80 dark:border-amber-500/30 shadow-2xl p-4 sm:p-5 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Ad Blocker Detected</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300">
                    Free Tools
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Help keep PocketKit 100% free for everyone
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsMinimized(true);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Minimize banner"
                aria-label="Minimize banner"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  dismissAlert();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Dismiss for 24 hours"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            PocketKit is an ad-supported digital workshop offering <strong>70+ client-side tools</strong>{' '}
            with zero subscription fees. We rely exclusively on non-intrusive Google AdSense advertisements
            to cover hosting, domain, and development costs.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  setIsGuideOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                <span>How to Whitelist</span>
              </button>

              <button
                onClick={handleRecheck}
                disabled={isRechecking}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRechecking ? 'animate-spin text-indigo-500' : ''}`} />
                <span>{isRechecking ? 'Checking...' : 'Re-check'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                dismissAlert();
              }}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors underline cursor-pointer"
            >
              Remind me later
            </button>
          </div>
        </aside>
      )}

      {/* --- Whitelist Guide Modal --- */}
      {isGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="adblock-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1a202c] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                  <Heart className="w-6 h-6 fill-slate-950" />
                </div>
                <div>
                  <h2 id="adblock-guide-title" className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Whitelist PocketKit to Support Free Tools
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Takes just 5 seconds • No intrusive or pop-up ads ever
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsGuideOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Re-check Status Banners */}
              {recheckStatus === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong>Thank you!</strong> Ad blocker is disabled or whitelisted. PocketKit will now load properly.
                  </span>
                </div>
              )}

              {recheckStatus === 'still_blocked' && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>
                    Ad blocker still active. Please make sure to reload the page or turn off shields for{' '}
                    <code>pocketkit.app</code>.
                  </span>
                </div>
              )}

              {/* Why We Ask */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Why we show this message</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  PocketKit runs entirely in your browser with zero paywalls. We partner exclusively with{' '}
                  <strong>Google AdSense</strong> for clean, standardized banner advertisements to cover our
                  infrastructure. Whitelisting us keeps everything accessible to students, developers, and creators worldwide.
                </p>
              </div>

              {/* Selector Tabs */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                  Select Your Ad Blocker or Browser:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {[
                    { id: 'ublock', label: 'uBlock Origin', icon: '🛡️' },
                    { id: 'adblock', label: 'AdBlock / Plus', icon: '🛑' },
                    { id: 'brave', label: 'Brave Shields', icon: '🦁' },
                    { id: 'safari', label: 'Safari', icon: '🧭' },
                    { id: 'chrome', label: 'Chrome / Edge', icon: '🌐' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        triggerHaptic('selection');
                        setActiveTab(tab.id as BlockerTab);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer text-center ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span className="text-[11px] leading-tight">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions per Tab */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                {activeTab === 'ublock' && (
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🛡️</span> How to Whitelist on uBlock Origin
                    </h4>
                    <ol className="space-y-2 list-decimal list-inside leading-relaxed text-slate-600 dark:text-slate-300">
                      <li>
                        Click the <strong>uBlock Origin shield icon</strong> in your browser extension toolbar.
                      </li>
                      <li>
                        Click the large <strong>blue Power button ⏻</strong> in the popup to pause it for this website.
                      </li>
                      <li>
                        Click the <strong>Reload button ↻</strong> or refresh your browser tab.
                      </li>
                    </ol>
                  </div>
                )}

                {activeTab === 'adblock' && (
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🛑</span> How to Whitelist on AdBlock / AdBlock Plus
                    </h4>
                    <ol className="space-y-2 list-decimal list-inside leading-relaxed text-slate-600 dark:text-slate-300">
                      <li>
                        Click the <strong>AdBlock stop sign</strong> icon in your browser toolbar.
                      </li>
                      <li>
                        Select <strong>"Don't run on pages on this domain"</strong> or toggle <strong>"Pause on this site"</strong> to Once or Always.
                      </li>
                      <li>
                        Click <strong>Exclude</strong> and reload the page.
                      </li>
                    </ol>
                  </div>
                )}

                {activeTab === 'brave' && (
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🦁</span> How to Whitelist on Brave Browser
                    </h4>
                    <ol className="space-y-2 list-decimal list-inside leading-relaxed text-slate-600 dark:text-slate-300">
                      <li>
                        Click the <strong>Brave Lion Shield icon</strong> located directly next to the URL address bar.
                      </li>
                      <li>
                        Toggle the main switch from <strong>"Shields are UP"</strong> to <strong>"DOWN"</strong> for this site.
                      </li>
                      <li>
                        Brave will automatically reload PocketKit with advertisements enabled.
                      </li>
                    </ol>
                  </div>
                )}

                {activeTab === 'safari' && (
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🧭</span> How to Whitelist on Apple Safari
                    </h4>
                    <ol className="space-y-2 list-decimal list-inside leading-relaxed text-slate-600 dark:text-slate-300">
                      <li>
                        <strong>On iPhone/iPad:</strong> Tap the <strong>"aA"</strong> button in the Safari address bar and select <strong>"Turn off Content Blockers"</strong>.
                      </li>
                      <li>
                        <strong>On Mac:</strong> Right-click the address bar or choose <strong>Safari &gt; Settings &gt; Websites &gt; Content Blockers</strong>, and turn off for PocketKit.
                      </li>
                      <li>
                        Refresh the page to verify.
                      </li>
                    </ol>
                  </div>
                )}

                {activeTab === 'chrome' && (
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>🌐</span> How to Whitelist on Chrome &amp; Microsoft Edge
                    </h4>
                    <ol className="space-y-2 list-decimal list-inside leading-relaxed text-slate-600 dark:text-slate-300">
                      <li>
                        Click the <strong>tune/sliders or lock icon</strong> to the left of the URL address bar.
                      </li>
                      <li>
                        Select <strong>"Site settings"</strong> or <strong>"Permissions for this site"</strong>.
                      </li>
                      <li>
                        Scroll down to <strong>"Intrusive Ads"</strong> or <strong>"Insecure content"</strong> and set it to <strong>Allow</strong>.
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsGuideOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRecheck}
                  disabled={isRechecking}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${isRechecking ? 'animate-spin' : ''}`} />
                  <span>{isRechecking ? 'Verifying...' : "I've Disabled It — Re-check"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
