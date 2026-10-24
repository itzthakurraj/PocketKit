import React, { useEffect, useRef } from 'react';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { useAdBlockDetector } from '../hooks/useAdBlockDetector';
import { triggerHaptic } from '../utils/haptics';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdBannerProps {
  slotId?: string;
  client?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'fluid';
  responsive?: boolean;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'XXXXXXXXXX',
  client = 'ca-pub-7997599838045329',
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const { isAdBlocked } = useAdBlockDetector();

  useEffect(() => {
    // Check if adsbygoogle script is loaded and we haven't pushed this slot yet
    if (adRef.current && !pushedRef.current && !isAdBlocked) {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch {
        // Silently catch adblocker or initialization errors
      }
    }
  }, [isAdBlocked]);

  const handleOpenGuide = () => {
    triggerHaptic('light');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pocketkit:open-adblock-guide'));
    }
  };

  return (
    <div className={`my-6 text-center overflow-hidden ${className}`}>
      {/* Required by AdSense policy: Ads must be clearly marked */}
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
        Sponsored Advertisement
      </span>

      <div className="inline-block w-full max-w-4xl min-h-[90px] rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-2 text-center flex items-center justify-center">
        {isAdBlocked ? (
          // Polite AdBlock detected placeholder in ad slot
          <div className="py-4 px-6 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Ad Space Blocked — Support PocketKit Free Tools
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                We rely exclusively on Google AdSense advertisements to keep all 70+ tools 100% free.
              </p>
            </div>
            <button
              onClick={handleOpenGuide}
              className="mt-2 sm:mt-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
              <span>How to Whitelist</span>
            </button>
          </div>
        ) : (
          <>
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block', minWidth: '250px' }}
              data-ad-client={client}
              data-ad-slot={slotId}
              data-ad-format={format}
              data-full-width-responsive={responsive ? 'true' : 'false'}
            />

            {/* Development preview placeholder if ad does not load (e.g. placeholder client ID) */}
            <div className="hidden only-child:block py-4 px-6 text-xs text-slate-400 dark:text-slate-500">
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Google AdSense Ad Space
              </p>
              <p className="text-[11px] mt-0.5">
                Replace <code className="text-indigo-600 dark:text-indigo-400 font-mono">ca-pub-XXXXXXXXXXXXXXXX</code> with your approved AdSense Publisher ID.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
