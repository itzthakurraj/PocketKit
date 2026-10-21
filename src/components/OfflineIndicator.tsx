import React from 'react';
import { InternetRequiredShield } from './InternetRequiredShield';

/**
 * Replaced by InternetRequiredShield:
 * Enforces active internet requirement across all platforms (Android, Windows, macOS, Linux, Web)
 * to ensure Google AdSense advertisement impressions and viewability.
 */
export const OfflineIndicator: React.FC = () => {
  return <InternetRequiredShield />;
};

