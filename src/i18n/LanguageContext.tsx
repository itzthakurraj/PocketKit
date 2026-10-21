import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, translations, LANGUAGES } from './translations';
import { haptics, triggerHaptic, HapticType } from '../utils/haptics';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  fontSize: 'normal' | 'large' | 'xl';
  setFontSize: (size: 'normal' | 'large' | 'xl') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  // Tactile Haptics state & controls for accessibility
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
  soundAssistance: boolean;
  setSoundAssistance: (enabled: boolean) => void;
  hapticIntensity: 'soft' | 'medium' | 'strong';
  setHapticIntensity: (val: 'soft' | 'medium' | 'strong') => void;
  triggerTactile: (type?: HapticType) => void;
  readCurrentPage: (customText?: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Map app Language code to standard BCP-47 SpeechSynthesis locale tag
export const SPEECH_LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  'en-IN': 'en-IN',
  hi: 'hi-IN',
  bho: 'hi-IN', // Uses Hindi voice engine with regional clarity
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  ur: 'ur-PK',
  or: 'or-IN',
  es: 'es-ES',
  'es-MX': 'es-MX',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-BR',
  ar: 'ar-SA',
  zh: 'zh-CN',
  ja: 'ja-JP',
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pocketkit_lang');
      if (saved && saved in translations) {
        return saved as Language;
      }

      // Check native Android app bridge for device locale
      const androidApp = (window as unknown as { AndroidApp?: { getDeviceLanguage?: () => string; getDeviceLocale?: () => string } }).AndroidApp;
      if (androidApp?.getDeviceLanguage) {
        try {
          const deviceLang = androidApp.getDeviceLanguage();
          if (deviceLang && deviceLang in translations) {
            return deviceLang as Language;
          }
        } catch {
          // ignore
        }
      }

      // Try browser language
      const navLang = navigator.language.split('-')[0] as Language;
      if (navLang && navLang in translations) {
        return navLang;
      }
    }
    return 'en';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xl'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pocketkit_font_size');
      return (saved as 'normal' | 'large' | 'xl') || 'normal';
    }
    return 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pocketkit_high_contrast') === 'true';
    }
    return false;
  });

  const [hapticsEnabled, setHapticsEnabledState] = useState<boolean>(() => {
    return haptics.isEnabled();
  });

  const [soundAssistance, setSoundAssistanceState] = useState<boolean>(() => {
    return haptics.isSoundAssistanceEnabled();
  });

  const [hapticIntensity, setHapticIntensityState] = useState<'soft' | 'medium' | 'strong'>(() => {
    return haptics.getIntensity();
  });

  // Sync language with localStorage, html lang and dir attribute (RTL for Arabic and Urdu)
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocketkit_lang', newLang);
      document.documentElement.lang = newLang;
      // RTL check for Arabic and Urdu
      if (newLang === 'ar' || newLang === 'ur') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }
    triggerHaptic('selection');
  }, []);

  const setFontSize = useCallback((size: 'normal' | 'large' | 'xl') => {
    setFontSizeState(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocketkit_font_size', size);
    }
    triggerHaptic('light');
  }, []);

  const setHighContrast = useCallback((val: boolean) => {
    setHighContrastState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocketkit_high_contrast', val ? 'true' : 'false');
    }
    triggerHaptic(val ? 'heavy' : 'light');
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setHapticsEnabledState(enabled);
    haptics.setEnabled(enabled);
  }, []);

  const setSoundAssistance = useCallback((enabled: boolean) => {
    setSoundAssistanceState(enabled);
    haptics.setSoundAssistanceEnabled(enabled);
  }, []);

  const setHapticIntensity = useCallback((intensity: 'soft' | 'medium' | 'strong') => {
    setHapticIntensityState(intensity);
    haptics.setIntensity(intensity);
  }, []);

  const triggerTactile = useCallback((type: HapticType = 'light') => {
    triggerHaptic(type);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    if (language === 'ar' || language === 'ur') {
      html.setAttribute('dir', 'rtl');
    } else {
      html.setAttribute('dir', 'ltr');
    }
  }, [language]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('font-size-large', 'font-size-xl');
    if (fontSize === 'large') html.classList.add('font-size-large');
    if (fontSize === 'xl') html.classList.add('font-size-xl');
  }, [fontSize]);

  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Global tactile feedback on interactive clicks for users with visual impairments
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // If clicking button, interactive role, tab or card
      const buttonEl = target.closest('button, a, [role="button"], input[type="checkbox"], input[type="radio"]');
      if (buttonEl) {
        // Trigger soft tactile response
        triggerHaptic('light');
      }
    };
    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  // Translation lookup function
  const t = useCallback((key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to base dialect (e.g. bho -> hi, es-MX -> es, en-IN -> en)
    const baseDialectMap: Partial<Record<Language, Language>> = {
      bho: 'hi',
      'es-MX': 'es',
      'en-IN': 'en',
    };
    const fallbackBase = baseDialectMap[language];
    if (fallbackBase && translations[fallbackBase] && translations[fallbackBase][key]) {
      return translations[fallbackBase][key];
    }
    // Fallback to English
    const enDict = translations.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  }, [language]);

  // Accessibility Text-to-Speech support for non-educated & visually challenged users
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();

    if (!text || !text.trim()) {
      setIsSpeaking(false);
      return;
    }

    triggerHaptic('voice');

    const utterance = new SpeechSynthesisUtterance(text);
    const bcpTag = SPEECH_LANG_MAP[language] || 'en-US';
    utterance.lang = bcpTag;
    utterance.rate = 0.92; // Clear, comfortable pace for accessibility
    utterance.pitch = 1.0;

    // Pick a voice that matches language or regional dialect if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang === bcpTag || v.lang.replace('_', '-').toLowerCase() === bcpTag.toLowerCase() || v.lang.startsWith(language.split('-')[0])
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    triggerHaptic('light');
  }, []);

  // Reads the current screen / page aloud for visually impaired users
  const readCurrentPage = useCallback((customText?: string) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    if (customText) {
      speak(customText);
      return;
    }

    const title = document.title || 'PocketKit';
    const activeHeader = document.querySelector('h1, h2')?.textContent || '';
    const welcome = t('hero.subtitle', 'PocketKit is your digital workshop with 70+ client-side tools.');
    const fullText = `${title}. ${activeHeader ? activeHeader + '.' : ''} ${welcome}`;
    speak(fullText);
  }, [isSpeaking, stopSpeaking, speak, t]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speak,
        stopSpeaking,
        isSpeaking,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        hapticsEnabled,
        setHapticsEnabled,
        soundAssistance,
        setSoundAssistance,
        hapticIntensity,
        setHapticIntensity,
        triggerTactile,
        readCurrentPage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
