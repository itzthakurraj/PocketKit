import { useState, useEffect, useCallback } from 'react';

const SNOOZE_STORAGE_KEY = 'pocketkit_adblock_snoozed_until';
const SNOOZE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours snooze

export interface AdBlockDetectionResult {
  isAdBlocked: boolean;
  isChecking: boolean;
  isDismissed: boolean;
  checkAdBlocker: () => Promise<boolean>;
  dismissAlert: () => void;
  resetDismiss: () => void;
}

/**
 * Hook to detect if Google AdSense ads are blocked by an extension or browser shield
 * (uBlock Origin, AdBlock Plus, Brave Shields, Pi-Hole, DNS blocker, etc.)
 */
export function useAdBlockDetector(): AdBlockDetectionResult {
  const [isAdBlocked, setIsAdBlocked] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const snoozedUntil = localStorage.getItem(SNOOZE_STORAGE_KEY);
      if (snoozedUntil && Date.now() < parseInt(snoozedUntil, 10)) {
        return true;
      }
    } catch {
      // Storage access fallback
    }
    return false;
  });

  const runDetection = useCallback(async (): Promise<boolean> => {
    // Only detect when user has an active internet connection to avoid false positives
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }

    let blocked = false;

    // --- Vector 1: DOM Bait Element (detects CSS element-hiding cosmetic filters) ---
    try {
      const bait = document.createElement('div');
      bait.setAttribute('id', 'ad-detector-probe');
      bait.className =
        'adsbygoogle pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-banner adsbox ad-placement banner-ad';
      bait.style.cssText =
        'position: absolute !important; left: -9999px !important; top: -9999px !important; width: 10px !important; height: 10px !important; pointer-events: none !important; opacity: 0.1 !important;';
      bait.innerHTML = '&nbsp;';
      document.body.appendChild(bait);

      // Give browser layout engine a brief moment to apply cosmetic filters
      await new Promise((resolve) => setTimeout(resolve, 80));

      const styles = window.getComputedStyle(bait);
      if (
        styles.display === 'none' ||
        styles.visibility === 'hidden' ||
        bait.offsetParent === null ||
        bait.offsetHeight === 0 ||
        bait.offsetWidth === 0 ||
        styles.opacity === '0'
      ) {
        blocked = true;
      }

      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    } catch {
      // Ignore DOM probe error
    }

    // If already detected via DOM bait, no need to probe further
    if (blocked) {
      return true;
    }

    // --- Vector 2: Network Script Request Probe (detects network-level filter rules) ---
    try {
      const probeUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      const request = new Request(probeUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
      });

      const response = await fetch(request);
      // In no-cors mode, successful fetch returns type: 'opaque'.
      // If blocked by adblock, fetch throws TypeError / network failure
      if (!response) {
        blocked = true;
      }
    } catch {
      // Ad blocker blocked the request
      blocked = true;
    }

    return blocked;
  }, []);

  const checkAdBlocker = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const detected = await runDetection();
      setIsAdBlocked(detected);
      return detected;
    } finally {
      setIsChecking(false);
    }
  }, [runDetection]);

  const dismissAlert = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(SNOOZE_STORAGE_KEY, (Date.now() + SNOOZE_DURATION_MS).toString());
    } catch {
      // Storage fallback
    }
  }, []);

  const resetDismiss = useCallback(() => {
    setIsDismissed(false);
    try {
      localStorage.removeItem(SNOOZE_STORAGE_KEY);
    } catch {
      // Storage fallback
    }
  }, []);

  // Run on initial mount after page assets have begun loading
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAdBlocker();
    }, 600);

    return () => clearTimeout(timer);
  }, [checkAdBlocker]);

  return {
    isAdBlocked,
    isChecking,
    isDismissed,
    checkAdBlocker,
    dismissAlert,
    resetDismiss,
  };
}
