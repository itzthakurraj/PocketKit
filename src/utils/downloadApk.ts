import { triggerHaptic } from './haptics';

/**
 * Utility to trigger direct download of the PocketKit Android APK with haptic confirmation.
 */
export function downloadPocketKitApk(): Promise<{ filename: string; size: string }> {
  triggerHaptic('heavy');
  return new Promise((resolve) => {
    const filename = 'PocketKit-release.apk';
    const apkUrl = '/PocketKit-release.apk';

    // Direct anchor download from static public folder
    const a = document.createElement('a');
    a.href = apkUrl;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      triggerHaptic('success');
      resolve({ filename, size: '4.5 MB' });
    }, 250);
  });
}
