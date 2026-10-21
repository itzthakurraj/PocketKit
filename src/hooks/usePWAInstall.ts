import { useEffect, useState, useCallback } from 'react';
import { triggerHaptic } from '../utils/haptics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type OSPlatform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'other';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isLinux, setIsLinux] = useState(false);
  const [platform, setPlatform] = useState<OSPlatform>('other');

  useEffect(() => {
    // Detect standalone mode (already running as installed PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect user platform & operating system
    const userAgent = window.navigator.userAgent.toLowerCase();
    const navPlatform = (window.navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform?.toLowerCase() || '';

    const ios = /iphone|ipad|ipod/.test(userAgent);
    const android = /android/.test(userAgent);
    const win = /win/.test(userAgent) || /windows/.test(navPlatform);
    const mac = (/mac/.test(userAgent) || /mac/.test(navPlatform)) && !ios;
    const linux = (/linux/.test(userAgent) || /linux/.test(navPlatform)) && !android;

    setIsIOS(ios);
    setIsAndroid(android);
    setIsWindows(win);
    setIsMac(mac);
    setIsLinux(linux);

    if (android) setPlatform('android');
    else if (ios) setPlatform('ios');
    else if (win) setPlatform('windows');
    else if (mac) setPlatform('macos');
    else if (linux) setPlatform('linux');
    else setPlatform('other');

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      triggerHaptic('success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<{ outcome: 'accepted' | 'dismissed' | 'manual' }> => {
    triggerHaptic('medium');
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          triggerHaptic('success');
          return { outcome: 'accepted' };
        }
        return { outcome: 'dismissed' };
      } catch {
        return { outcome: 'manual' };
      }
    }
    return { outcome: 'manual' };
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isWindows,
    isMac,
    isLinux,
    platform,
    desktopOS: (isMac ? 'macos' : isLinux ? 'linux' : 'windows') as 'windows' | 'macos' | 'linux',
    install,
    deferredPrompt,
  };
}
