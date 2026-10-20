import React, { useEffect, useRef } from 'react';

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
  client = 'ca-pub-XXXXXXXXXXXXXXXX',
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Check if adsbygoogle script is loaded and we haven't pushed this slot yet
    if (adRef.current && !pushedRef.current) {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch (err) {
        // Silently catch adblocker or initialization errors
      }
    }
  }, []);

  return (
    <div className={`my-6 text-center overflow-hidden ${className}`}>
      {/* Required by AdSense policy: Ads must be clearly marked */}
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
        Sponsored Advertisement
      </span>

      <div className="inline-block w-full max-w-4xl min-h-[90px] rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-2 text-center flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px' }}
          data-ad-client={client}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />

        {/* Development preview placeholder if ad does not load (e.g. adblock or placeholder client ID) */}
        <div className="hidden only-child:block py-4 px-6 text-xs text-slate-400 dark:text-slate-500">
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            Google AdSense Ad Space
          </p>
          <p className="text-[11px] mt-0.5">
            Replace <code className="text-indigo-600 dark:text-indigo-400 font-mono">ca-pub-XXXXXXXXXXXXXXXX</code> with your approved AdSense Publisher ID.
          </p>
        </div>
      </div>
    </div>
  );
};
