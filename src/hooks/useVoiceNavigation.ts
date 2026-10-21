import { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveView } from '../types';
import { TOOLS_DATA } from '../data/toolsData';
import { Language } from '../i18n/translations';
import { playListeningChime, playSuccessChime, playErrorChime } from '../utils/audioFeedback';

export interface UseVoiceNavigationProps {
  currentView: ActiveView;
  language: Language;
  onNavigate: (view: ActiveView, category?: string) => void;
  onSelectTool: (id: string | null) => void;
  onOpenSearch: (query?: string) => void;
  onToggleTheme: () => void;
  onToggleHighContrast: () => void;
  onChangeFontSize: (action: 'increase' | 'reset') => void;
  onCloseModal: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

import { triggerHaptic } from '../utils/haptics';

// Locale mapping for SpeechRecognition with regional dialects
const RECOGNITION_LANG_MAP: Record<Language, string> = {
  en: 'en-US',
  'en-IN': 'en-IN',
  hi: 'hi-IN',
  bho: 'hi-IN',
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

export function useVoiceNavigation({
  currentView,
  language,
  onNavigate,
  onSelectTool,
  onOpenSearch,
  onToggleTheme,
  onToggleHighContrast,
  onChangeFontSize,
  onCloseModal,
  speak,
  stopSpeaking,
}: UseVoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Voice Control Ready');
  const [isSupported, setIsSupported] = useState(true);
  const [isOfflineVoiceReady, setIsOfflineVoiceReady] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);

  // Monitor online / offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for local offline voices in SpeechSynthesis
  useEffect(() => {
    const checkOfflineVoices = () => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setIsOfflineVoiceReady(false);
        return;
      }
      const voices = window.speechSynthesis.getVoices();
      const localVoices = voices.filter((v) => v.localService || (v as any).offline);
      setIsOfflineVoiceReady(localVoices.length > 0 || voices.length > 0);
    };

    checkOfflineVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = checkOfflineVoices;
    }
  }, []);

  // Initialize SpeechRecognition instance
  useEffect(() => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setIsSupported(false);
      setStatusMessage('Speech Recognition not supported in this browser. Quick voice actions available below.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = RECOGNITION_LANG_MAP[language] || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Listening... Speak a command');
        triggerHaptic('voice');
        playListeningChime();
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        const recognizedText = (final || interim).trim();
        if (recognizedText) {
          setTranscript(recognizedText);
        }

        if (final) {
          executeVoiceCommand(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        // Handle network/offline errors gracefully
        if (event.error === 'network') {
          setStatusMessage('Offline Notice: Voice synthesis works 100% offline. Local recognition depends on device speech pack.');
        } else if (event.error === 'not-allowed') {
          setStatusMessage('Microphone access blocked. Please allow microphone permission.');
          setIsListening(false);
          shouldListenRef.current = false;
        } else if (event.error !== 'no-speech') {
          setStatusMessage(`Voice Notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (shouldListenRef.current) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } catch {
      setIsSupported(false);
    }

    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, [language]);

  // Command Execution Engine
  const executeVoiceCommand = useCallback(
    (cmd: string) => {
      const lower = cmd.toLowerCase().trim();
      setLastCommand(cmd);

      // 1. Navigation: Home
      if (
        lower === 'home' ||
        lower.includes('go home') ||
        lower.includes('go to home') ||
        lower.includes('homepage') ||
        lower.includes('होम') ||
        lower.includes('inicio') ||
        lower.includes('accueil')
      ) {
        playSuccessChime();
        onNavigate('home');
        setStatusMessage('Navigated to Home');
        speak('Going to Home');
        return true;
      }

      // 2. Navigation: All Tools
      if (
        lower.includes('all tools') ||
        lower.includes('view all') ||
        lower.includes('show tools') ||
        lower.includes('सारे टूल्स') ||
        lower.includes('todas las herramientas') ||
        lower.includes('tous les outils')
      ) {
        playSuccessChime();
        onNavigate('all-tools');
        setStatusMessage('Showing All Tools');
        speak('Showing all tools');
        return true;
      }

      // 3. Navigation: Features
      if (
        lower.includes('features') ||
        lower.includes('feature') ||
        lower.includes('सुविधाएं') ||
        lower.includes('características')
      ) {
        playSuccessChime();
        onNavigate('features');
        setStatusMessage('Navigated to Features');
        speak('Opening Features');
        return true;
      }

      // 4. Navigation: Blog
      if (
        lower.includes('blog') ||
        lower.includes('articles') ||
        lower.includes('news') ||
        lower.includes('ब्लॉग')
      ) {
        playSuccessChime();
        onNavigate('blog');
        setStatusMessage('Navigated to Blog');
        speak('Opening Blog');
        return true;
      }

      // 5. Navigation: Help
      if (
        lower.includes('help') ||
        lower.includes('faq') ||
        lower.includes('guide') ||
        lower.includes('सहायता') ||
        lower.includes('madad') ||
        lower.includes('ayuda') ||
        lower.includes('aide')
      ) {
        playSuccessChime();
        onNavigate('help');
        setStatusMessage('Navigated to Help & FAQ');
        speak('Opening Help and Guides');
        return true;
      }

      // 6. Navigation: Install App / Download APK
      if (
        lower.includes('install') ||
        lower.includes('download apk') ||
        lower.includes('download app') ||
        lower.includes('डाउनलोड') ||
        lower.includes('इंस्टॉल') ||
        lower.includes('descargar') ||
        lower.includes('installer')
      ) {
        playSuccessChime();
        onNavigate('install');
        setStatusMessage('Opening App Installation Hub');
        speak('Opening Install App and APK Download');
        return true;
      }

      // 7. Categories
      if (lower.includes('text') || lower.includes('टेक्स्ट') || lower.includes('texto')) {
        playSuccessChime();
        onNavigate('category', 'text');
        setStatusMessage('Filtered Text Tools');
        speak('Showing text and document tools');
        return true;
      }
      if (
        lower.includes('developer') ||
        lower.includes('code') ||
        lower.includes('dev') ||
        lower.includes('डेवलपर') ||
        lower.includes('desarrollador')
      ) {
        playSuccessChime();
        onNavigate('category', 'development');
        setStatusMessage('Filtered Developer Tools');
        speak('Showing code and developer tools');
        return true;
      }
      if (
        lower.includes('security') ||
        lower.includes('crypto') ||
        lower.includes('encryption') ||
        lower.includes('सुरक्षा') ||
        lower.includes('seguridad')
      ) {
        playSuccessChime();
        onNavigate('category', 'encryption');
        setStatusMessage('Filtered Security & Crypto Tools');
        speak('Showing encryption and security tools');
        return true;
      }
      if (
        lower.includes('calculator') ||
        lower.includes('finance') ||
        lower.includes('math') ||
        lower.includes('कैलकुलेटर') ||
        lower.includes('calculadora')
      ) {
        playSuccessChime();
        onNavigate('category', 'calculator');
        setStatusMessage('Filtered Calculators');
        speak('Showing calculators and finance tools');
        return true;
      }
      if (
        lower.includes('image') ||
        lower.includes('photo') ||
        lower.includes('media') ||
        lower.includes('फोटो') ||
        lower.includes('imagen')
      ) {
        playSuccessChime();
        onNavigate('category', 'image');
        setStatusMessage('Filtered Image Tools');
        speak('Showing photo and image tools');
        return true;
      }
      if (lower.includes('pdf') || lower.includes('पीडीएफ')) {
        playSuccessChime();
        onNavigate('category', 'pdf');
        setStatusMessage('Filtered PDF Tools');
        speak('Showing PDF tools');
        return true;
      }
      if (lower.includes('color') || lower.includes('web') || lower.includes('रंग')) {
        playSuccessChime();
        onNavigate('category', 'web');
        setStatusMessage('Filtered Web & Color Tools');
        speak('Showing web and color tools');
        return true;
      }

      // 8. Search Command ("search json", "find base64", "khojo age")
      const searchMatch = lower.match(
        /^(?:search|find|look for|khojo|buscar|chercher)\s+(?:for\s+)?(.+)$/i
      );
      if (searchMatch && searchMatch[1]) {
        const query = searchMatch[1].trim();
        playSuccessChime();
        onOpenSearch(query);
        setStatusMessage(`Searching for "${query}"`);
        speak(`Searching tools for ${query}`);
        return true;
      }

      // 9. Open Specific Tool ("open age calculator", "launch json beautifier", "age calculator kholo")
      const openMatch = lower.match(
        /^(?:open|launch|start|show|kholo|abrir|ouvrir)\s+(.+)$/i
      );
      const toolTargetName = openMatch ? openMatch[1].trim() : lower;

      const matchedTool = TOOLS_DATA.find((t) => {
        const tName = t.name.toLowerCase();
        const tId = t.id.toLowerCase().replace(/-/g, ' ');
        return (
          tName.includes(toolTargetName) ||
          toolTargetName.includes(tName) ||
          tId.includes(toolTargetName) ||
          t.keywords.some((k) => k.toLowerCase() === toolTargetName)
        );
      });

      if (matchedTool) {
        playSuccessChime();
        onSelectTool(matchedTool.id);
        setStatusMessage(`Opened ${matchedTool.name}`);
        speak(`Opening ${matchedTool.name}`);
        return true;
      }

      // 10. Actions: Theme Toggle ("dark mode", "light mode", "switch theme")
      if (
        lower.includes('dark mode') ||
        lower.includes('light mode') ||
        lower.includes('toggle theme') ||
        lower.includes('switch theme') ||
        lower.includes('थीम बदलो') ||
        lower.includes('cambiar tema')
      ) {
        playSuccessChime();
        onToggleTheme();
        setStatusMessage('Theme toggled');
        speak('Toggled color theme');
        return true;
      }

      // 11. Actions: High Contrast
      if (
        lower.includes('high contrast') ||
        lower.includes('contrast') ||
        lower.includes('कंट्रास्ट')
      ) {
        playSuccessChime();
        onToggleHighContrast();
        setStatusMessage('Toggled High Contrast');
        speak('Toggled high contrast mode');
        return true;
      }

      // 12. Actions: Font Size
      if (lower.includes('increase font') || lower.includes('bigger text') || lower.includes('larger font')) {
        playSuccessChime();
        onChangeFontSize('increase');
        setStatusMessage('Increased font size');
        speak('Font size increased');
        return true;
      }
      if (lower.includes('reset font') || lower.includes('normal font') || lower.includes('smaller text')) {
        playSuccessChime();
        onChangeFontSize('reset');
        setStatusMessage('Reset font size');
        speak('Font size set to normal');
        return true;
      }

      // 13. Actions: Close Modal ("close", "exit", "band karo")
      if (
        lower === 'close' ||
        lower.includes('close modal') ||
        lower.includes('exit') ||
        lower.includes('बंद करो') ||
        lower.includes('cerrar') ||
        lower.includes('fermer')
      ) {
        playSuccessChime();
        onCloseModal();
        setStatusMessage('Closed modal');
        speak('Closed');
        return true;
      }

      // 14. Actions: Stop Speech ("stop", "mute", "ruko")
      if (lower === 'stop' || lower.includes('stop speaking') || lower.includes('रुक जाओ') || lower.includes('parar')) {
        stopSpeaking();
        setStatusMessage('Stopped speech audio');
        return true;
      }

      // Unrecognized Command
      triggerHaptic('error');
      playErrorChime();
      setStatusMessage(`Unrecognized: "${cmd}". Try "Home", "Calculators", or "Open Age Calculator"`);
      return false;
    },
    [
      onNavigate,
      onSelectTool,
      onOpenSearch,
      onToggleTheme,
      onToggleHighContrast,
      onChangeFontSize,
      onCloseModal,
      speak,
      stopSpeaking,
    ]
  );

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      shouldListenRef.current = true;
      recognitionRef.current.start();
    } catch (err: any) {
      if (err.name !== 'InvalidStateError') {
        setStatusMessage('Could not start microphone');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    lastCommand,
    statusMessage,
    isSupported,
    isOfflineVoiceReady,
    isOnline,
    startListening,
    stopListening,
    toggleListening,
    executeVoiceCommand,
  };
}
