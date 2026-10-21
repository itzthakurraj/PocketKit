import { triggerHaptic } from './haptics';

export type DesktopOS = 'windows' | 'macos' | 'linux';

/**
 * Detect user's desktop operating system
 */
export function detectDesktopOS(): { os: DesktopOS; name: string; icon: string } {
  if (typeof window === 'undefined') {
    return { os: 'windows', name: 'Windows', icon: 'Monitor' };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = (window.navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform?.toLowerCase() || '';

  if (userAgent.includes('mac') || platform.includes('mac')) {
    return { os: 'macos', name: 'macOS', icon: 'Apple' };
  }
  if (userAgent.includes('linux') || platform.includes('linux')) {
    return { os: 'linux', name: 'Linux', icon: 'Terminal' };
  }
  return { os: 'windows', name: 'Windows', icon: 'Monitor' };
}

/**
 * Trigger download of Windows launcher shortcut (.bat & .url)
 */
export function downloadWindowsLauncher(appUrl: string = 'https://pocketkit.app') {
  triggerHaptic('heavy');
  const batContent = `@echo off
:: PocketKit Desktop PWA Launcher for Windows
title PocketKit Desktop App
echo Starting PocketKit Digital Workshop...

:: Try launching in native app window using Microsoft Edge or Google Chrome
start msedge.exe --app="${appUrl}" 2>nul || start chrome.exe --app="${appUrl}" 2>nul || start "" "${appUrl}"
`;

  const blob = new Blob([batContent], { type: 'application/x-bat;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PocketKit-Windows-Launcher.bat';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerHaptic('success');
  }, 200);
}

/**
 * Trigger download of macOS launcher script (.command)
 */
export function downloadMacLauncher(appUrl: string = 'https://pocketkit.app') {
  triggerHaptic('heavy');
  const shContent = `#!/bin/bash
# PocketKit Desktop App Launcher for macOS
# Makes PocketKit run as a focused standalone desktop application

echo "Launching PocketKit Digital Workshop..."
open -a "Google Chrome" --args --app="${appUrl}" 2>/dev/null || open -a "Microsoft Edge" --args --app="${appUrl}" 2>/dev/null || open "${appUrl}"
`;

  const blob = new Blob([shContent], { type: 'application/x-sh;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'PocketKit-macOS.command';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerHaptic('success');
  }, 200);
}

/**
 * Trigger download of Linux .desktop application entry
 */
export function downloadLinuxDesktopEntry(appUrl: string = 'https://pocketkit.app') {
  triggerHaptic('heavy');
  const desktopContent = `[Desktop Entry]
Version=1.0
Name=PocketKit
Comment=Pocket-sized digital workshop with 70+ client-side tools
Exec=sh -c "google-chrome --app=${appUrl} || chromium --app=${appUrl} || brave-browser --app=${appUrl} || xdg-open ${appUrl}"
Icon=utilities-terminal
Terminal=false
Type=Application
Categories=Utility;Development;Office;
StartupWMClass=pocketkit
`;

  const blob = new Blob([desktopContent], { type: 'application/x-desktop;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pocketkit.desktop';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerHaptic('success');
  }, 200);
}
