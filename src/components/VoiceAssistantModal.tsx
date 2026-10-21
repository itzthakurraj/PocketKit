import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Check,
  Sparkles,
  Command,
  Wifi,
  WifiOff,
  ShieldCheck,
  HelpCircle,
  Play,
  RotateCcw,
  Sun,
  Moon,
  Home,
  LayoutGrid,
  Download,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  transcript: string;
  lastCommand: string | null;
  statusMessage: string;
  isSupported: boolean;
  isOfflineVoiceReady: boolean;
  isOnline: boolean;
  onToggleListening: () => void;
  onExecuteCommand: (cmd: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  isListening,
  transcript,
  lastCommand,
  statusMessage,
  isSupported,
  isOfflineVoiceReady,
  isOnline,
  onToggleListening,
  onExecuteCommand,
}) => {
  const { t, speak, stopSpeaking, isSpeaking, language, highContrast, setHighContrast, fontSize, setFontSize } = useLanguage();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | 'nav' | 'tools' | 'a11y'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    { label: '🏠 Go to Home', cmd: 'go to home', category: 'nav' },
    { label: '📦 All Tools', cmd: 'all tools', category: 'nav' },
    { label: '🎂 Age Calculator', cmd: 'open age calculator', category: 'tools' },
    { label: '🔤 Case Converter', cmd: 'open case converter', category: 'tools' },
    { label: '🗜️ Image Compressor', cmd: 'open image compressor', category: 'tools' },
    { label: '🔒 Base64 Tool', cmd: 'open base64', category: 'tools' },
    { label: '📊 GST Calculator', cmd: 'open gst calculator', category: 'tools' },
    { label: '📑 PDF Tools', cmd: 'category pdf', category: 'tools' },
    { label: '🌙 Switch Theme', cmd: 'toggle theme', category: 'a11y' },
    { label: '👁️ High Contrast', cmd: 'high contrast', category: 'a11y' },
    { label: '🔍 Search Tools', cmd: 'search json', category: 'tools' },
    { label: '⚡ Download APK', cmd: 'download apk', category: 'nav' },
  ];

  const filteredCommands =
    selectedCategoryTab === 'all'
      ? quickCommands
      : quickCommands.filter((c) => c.category === selectedCategoryTab);

  const handleTestSpeech = () => {
    triggerHaptic('voice');
    speak(
      `PocketKit voice accessibility is ready. You can navigate the app, search, and launch any tool using your voice or tap controls.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500" />

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
            }`}>
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Voice Assistant & Navigation
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Alt+V
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hands-free control for users with limited mobility
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline & Voice Engine Status Banner */}
        <div className="px-5 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100/60 dark:border-indigo-900/40 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Offline Voice Playback: <strong>100% On-Device Ready</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Wifi className="w-3.5 h-3.5" /> Online Speech Engine
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <WifiOff className="w-3.5 h-3.5" /> Offline Mode (Local Voice)
              </span>
            )}
          </div>
        </div>

        {/* Microphone Interactive Area */}
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <button
              onClick={onToggleListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                isListening
                  ? 'bg-red-500 text-white ring-8 ring-red-400/30 shadow-red-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white ring-4 ring-indigo-200 dark:ring-indigo-900/50 shadow-indigo-600/30'
              }`}
              title={isListening ? 'Click to Stop Listening' : 'Click to Start Speaking'}
            >
              {isListening ? <Mic className="w-10 h-10 animate-pulse" /> : <Mic className="w-10 h-10" />}
              {isListening && (
                <span className="absolute -bottom-1 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-white text-red-600 shadow-xs">
                  Active
                </span>
              )}
            </button>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isListening ? 'Listening... Speak now!' : 'Tap microphone to speak'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {statusMessage}
            </p>
          </div>

          {/* Sound Waves Animation */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[16, 28, 20, 32, 18, 30, 22, 34, 16, 26, 18].map((h, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${idx * 0.08}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>
          )}

          {/* Transcript / Last Recognized Display */}
          {(transcript || lastCommand) && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-left space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Recognized Speech:</span>
                {lastCommand && (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> Executed
                  </span>
                )}
              </div>
              <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white break-words">
                "{transcript || lastCommand}"
              </p>
            </div>
          )}
        </div>

        {/* Quick Voice Command Chips (Accessibility switch / tap friendly) */}
        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Quick Voice Commands (or tap):
            </span>
            <button
              onClick={handleTestSpeech}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Audio Voice</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Commands' },
              { id: 'nav', label: 'Navigation' },
              { id: 'tools', label: 'Tools' },
              { id: 'a11y', label: 'Accessibility' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategoryTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
            {filteredCommands.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic('medium');
                  onExecuteCommand(item.cmd);
                }}
                className="p-2 rounded-xl text-left font-semibold text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex items-center justify-between group active:scale-98"
              >
                <span className="truncate">{item.label}</span>
                <Play className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Say "Open [Tool Name]", "Home", "Calculators", or "Dark Mode"</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
