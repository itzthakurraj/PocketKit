import React, { useState, useEffect } from 'react';
import { ActiveView, ToolItem } from './types';
import { TOOLS_DATA } from './data/toolsData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ToolModal } from './components/ToolModal';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { BlogPage } from './pages/BlogPage';
import { HelpPage } from './pages/HelpPage';
import { InstallPage } from './pages/InstallPage';
import { InternetRequiredShield } from './components/InternetRequiredShield';
import { AdBlockDetector } from './components/AdBlockDetector';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { CookieConsent } from './components/CookieConsent';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { useVoiceNavigation } from './hooks/useVoiceNavigation';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { FloatingVoiceButton } from './components/FloatingVoiceButton';
import { StandaloneToolPage } from './pages/StandaloneToolPage';
import { SitemapModal } from './components/SitemapModal';
import { syncDocumentSEO } from './utils/seoUtils';
import { triggerHaptic } from './utils/haptics';


const LEGACY_URL_MAP: Record<string, { toolId?: string; view?: ActiveView; category?: string }> = {
  // HTML legacy files to tool IDs / views
  'agecalculator.html': { toolId: 'age-calculator' },
  'aes_des_encryptdecrypt.html': { toolId: 'aes-des-encrypt' },
  'asciitotext.html': { toolId: 'ascii-to-text' },
  'texttoascii.html': { toolId: 'text-to-ascii' },
  'base64encodedecode.html': { toolId: 'base64-tool' },
  'calculator.html': { toolId: 'scientific-calculator' },
  'capitalizetext.html': { toolId: 'case-converter' },
  'lowercasetext.html': { toolId: 'lowercase-converter' },
  'uppercasetext.html': { toolId: 'uppercase-converter' },
  'charactercount.html': { toolId: 'character-count' },
  'compressimage.html': { toolId: 'image-compressor' },
  'convertfromjpg.html': { toolId: 'convert-from-jpg' },
  'converttojpg.html': { toolId: 'convert-to-jpg' },
  'cropimage.html': { toolId: 'image-cropper' },
  'cssbeautifier.html': { toolId: 'css-beautifier' },
  'cssminify.html': { toolId: 'css-minify' },
  'htmlbeautifier.html': { toolId: 'html-beautifier' },
  'htmlencodedecode.html': { toolId: 'html-encode-decode' },
  'jsbeautifier.html': { toolId: 'js-beautifier' },
  'diffchecker.html': { toolId: 'diff-checker' },
  'documentwizard.html': { toolId: 'document-wizard' },
  'encryption.html': { toolId: 'encryption-hub' },
  'features.html': { view: 'features' },
  'blog.html': { view: 'blog' },
  'help.html': { view: 'help' },
  'gstcalculator.html': { toolId: 'gst-calculator' },
  'hexrgbcolor.html': { toolId: 'hex-to-rgb' },
  'rgbhexcolor.html': { toolId: 'rgb-to-hex' },
  'htmltoimage.html': { toolId: 'html-to-image' },
  'imagetools.html': { toolId: 'image-tools-hub' },
  'jsonbeautifier.html': { toolId: 'json-beautifier' },
  'jsonviewer.html': { toolId: 'json-viewer' },
  'jsonvalidator.html': { toolId: 'json-validator' },
  'jsonminfiy.html': { toolId: 'json-minifier' },
  'jsonminify.html': { toolId: 'json-minifier' },
  'jsontocsv.html': { toolId: 'json-to-csv' },
  'csvto.html': { toolId: 'csvto-pdf' },
  'excelto.html': { toolId: 'excelto-pdf' },
  'jsonto.html': { toolId: 'jsonto-pdf' },
  'jsontoxml.html': { toolId: 'json-to-xml' },
  'xmlto.html': { toolId: 'xmlto-pdf' },
  'loancalculator.html': { toolId: 'loan-calculator' },
  'loremispeumgenerator.html': { toolId: 'lorem-generator' },
  'md5hashdecrypt.html': { toolId: 'md5-hash' },
  'sha256encryptdecrypt.html': { toolId: 'sha256-hash' },
  'passwordgenerator.html': { toolId: 'password-generator' },
  'pdftools.html': { toolId: 'pdf-tools' },
  'pdftocsv.html': { toolId: 'pdftocsv' },
  'pdftoexcel.html': { toolId: 'pdftoexcel' },
  'pdftohtml.html': { toolId: 'pdftohtml' },
  'pdftojpg.html': { toolId: 'pdftojpg' },
  'pdftopng.html': { toolId: 'pdftopng' },
  'pdftotext.html': { toolId: 'pdftotext' },
  'pdftowebp.html': { toolId: 'pdftowebp' },
  'pdftoword.html': { toolId: 'pdftoword' },
  'pdftoxml.html': { toolId: 'pdftoxml' },
  'pdftojson.html': { toolId: 'pdftojson' },
  'pdftozip.html': { toolId: 'pdftozip' },
  'photoedit.html': { toolId: 'photo-editor' },
  'jpgto.html': { toolId: 'jpgto-pdf' },
  'pngto.html': { toolId: 'pngto-pdf' },
  'webpto.html': { toolId: 'webpto-pdf' },
  'htmlto.html': { toolId: 'htmlto-pdf' },
  'textto.html': { toolId: 'textto-pdf' },
  'speechto.html': { toolId: 'speechto-pdf' },
  'sipcalculator.html': { toolId: 'sip-calculator' },
  'typingtest.html': { toolId: 'typing-test' },
  'upscaleimage.html': { toolId: 'image-upscale' },
  'urlencodedecode.html': { toolId: 'url-encoder' },
  'watermarkimage.html': { toolId: 'image-watermark' },
  'web.html': { toolId: 'web-hub' },
  'development.html': { toolId: 'development-hub' },
  'pdfremover.html': { toolId: 'pdf-password-remover' },
  'pdfunlock.html': { toolId: 'pdf-password-remover' },
  'pdfprotect.html': { toolId: 'pdf-password-protect' },
};

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<PolicyTab>('privacy');
  const [sitemapModalOpen, setSitemapModalOpen] = useState(false);

  const handleOpenPolicy = (tab: PolicyTab) => {
    setPolicyTab(tab);
    setPolicyModalOpen(true);
  };

  const {
    language,
    speak,
    stopSpeaking,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
  } = useLanguage();

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // Theme state synced with localStorage & original html data-theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Favorites state synced with localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toolkit_favorites');
      return saved ? JSON.parse(saved) : ['case-converter', 'image-compressor', 'diff-checker'];
    } catch {
      return ['case-converter', 'image-compressor', 'diff-checker'];
    }
  });

  const handleToggleTheme = () => {
    triggerHaptic('medium');
    setIsDark((prev) => !prev);
  };

  const handleToggleFavorite = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleNavigate = (view: ActiveView, category?: string) => {
    triggerHaptic('selection');
    setActiveView(view);
    if (category) {
      setSelectedCategory(category);
      window.location.hash = `category:${category}`;
    } else if (view === 'all-tools') {
      setSelectedCategory('all');
      window.location.hash = '';
    } else if (view === 'features' || view === 'blog' || view === 'help' || view === 'install') {
      window.location.hash = view;
    } else {
      window.location.hash = '';
    }
    setActiveToolId(null);
    setShowingFavoritesOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const handleSelectTool = (id: string | null) => {
    if (id && !isOnline) {
      triggerHaptic('error');
      return;
    }
    triggerHaptic(id ? 'medium' : 'light');
    setActiveToolId(id);
    if (id) {
      try {
        window.history.pushState(null, '', `/tools/${id}`);
      } catch {
        window.location.hash = `/tools/${id}`;
      }
    } else {
      try {
        window.history.pushState(null, '', '/');
      } catch {
        window.location.hash = '';
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize document SEO (Title, Meta, OpenGraph, Twitter, Schema.org JSON-LD)
  useEffect(() => {
    const tool = activeToolId ? TOOLS_DATA.find((t) => t.id === activeToolId) : null;
    syncDocumentSEO(tool, activeView, selectedCategory);
  }, [activeToolId, activeView, selectedCategory]);

  // Accessible Voice Navigation & Audio Assistant
  const voiceNav = useVoiceNavigation({
    currentView: activeView,
    language,
    onNavigate: handleNavigate,
    onSelectTool: handleSelectTool,
    onOpenSearch: () => {
      triggerHaptic('light');
      setIsSearchOpen(true);
    },
    onToggleTheme: handleToggleTheme,
    onToggleHighContrast: () => setHighContrast(!highContrast),
    onChangeFontSize: (action) => {
      if (action === 'increase') {
        setFontSize(fontSize === 'normal' ? 'large' : 'xl');
      } else {
        setFontSize('normal');
      }
    },
    onCloseModal: () => {
      setActiveToolId(null);
      setIsSearchOpen(false);
      setPolicyModalOpen(false);
      setVoiceModalOpen(false);
    },
    speak,
    stopSpeaking,
  });

  // Global Keyboard Shortcut: Alt+V for Voice Navigation
  useEffect(() => {
    const handleVoiceShortcut = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        triggerHaptic('voice');
        setVoiceModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleVoiceShortcut);
    return () => window.removeEventListener('keydown', handleVoiceShortcut);
  }, []);

  // Parse path & hash on initial load and popstate
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();

      // Check legacy path first
      if (path && LEGACY_URL_MAP[path]) {
        const match = LEGACY_URL_MAP[path];
        if (match.toolId) {
          setActiveToolId(match.toolId);
        } else if (match.view) {
          setActiveView(match.view);
          if (match.category) setSelectedCategory(match.category);
        }
        return;
      }

      // Check clean URL path: /tools/:toolId or /tool/:toolId
      const cleanPathMatch = path.match(/^tools?\/(.+)$/);
      if (cleanPathMatch) {
        const rawId = cleanPathMatch[1].replace(/\/$/, '');
        const normalized = rawId.replace(/-/g, '');
        const matched = TOOLS_DATA.find((t) => t.id === rawId || t.id.replace(/-/g, '') === normalized);
        if (matched) {
          setActiveToolId(matched.id);
          return;
        }
      }

      // Check hash
      if (hash) {
        if (hash === 'features') {
          setActiveView('features');
          setActiveToolId(null);
        } else if (hash === 'blog') {
          setActiveView('blog');
          setActiveToolId(null);
        } else if (hash === 'help') {
          setActiveView('help');
          setActiveToolId(null);
        } else if (hash === 'install' || hash === 'download') {
          setActiveView('install');
          setActiveToolId(null);
        } else if (hash.startsWith('category:')) {
          const cat = hash.replace('category:', '');
          setActiveView('category');
          setSelectedCategory(cat);
          setActiveToolId(null);
        } else {
          // Check hash clean format #/tools/:id or #/tool/:id
          const hashPathMatch = hash.match(/^\/?tools?\/(.+)$/);
          const rawHashId = hashPathMatch ? hashPathMatch[1].replace(/\/$/, '') : hash.replace(/^\/?/, '');
          const normalizedHash = rawHashId.replace(/-/g, '');

          // Check if hash matches tool id directly or with dash variation
          const matchedTool = TOOLS_DATA.find(
            (t) => t.id === rawHashId || t.id.toLowerCase() === rawHashId || t.id.replace(/-/g, '') === normalizedHash
          );
          if (matchedTool) {
            setActiveToolId(matchedTool.id);
          } else if (LEGACY_URL_MAP[rawHashId + '.html']) {
            const legacyMatch = LEGACY_URL_MAP[rawHashId + '.html'];
            if (legacyMatch.toolId) setActiveToolId(legacyMatch.toolId);
          }
        }
      } else {
        // No hash and not a tool path
        if (!cleanPathMatch) {
          setActiveToolId(null);
        }
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isDark) {
      html.classList.add('dark');
      body.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('toolkit_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeTool = activeToolId ? TOOLS_DATA.find((t) => t.id === activeToolId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#121826] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        favoritesCount={favorites.length}
        onToggleFavoritesFilter={() => {
          triggerHaptic('light');
          setShowingFavoritesOnly(!showingFavoritesOnly);
          if (activeView !== 'home' && activeView !== 'all-tools') {
            setActiveView('home');
          }
        }}
        showingFavoritesOnly={showingFavoritesOnly}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTool ? (
          <StandaloneToolPage
            tool={activeTool}
            isFavorite={favorites.includes(activeTool.id)}
            onToggleFavorite={handleToggleFavorite}
            onSelectTool={handleSelectTool}
            onNavigateHome={() => handleSelectTool(null)}
          />
        ) : activeView === 'home' || activeView === 'all-tools' || activeView === 'category' ? (
          <HomePage
            tools={TOOLS_DATA}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              triggerHaptic('selection');
              setSelectedCategory(cat);
              window.location.hash = cat === 'all' ? '' : `category:${cat}`;
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectTool={handleSelectTool}
            showingFavoritesOnly={showingFavoritesOnly}
            onClearFavoritesFilter={() => {
              triggerHaptic('light');
              setShowingFavoritesOnly(false);
            }}
          />
        ) : activeView === 'features' ? (
          <FeaturesPage onOpenTool={handleSelectTool} />
        ) : activeView === 'blog' ? (
          <BlogPage />
        ) : activeView === 'help' ? (
          <HelpPage />
        ) : activeView === 'install' ? (
          <InstallPage />
        ) : null}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicy={handleOpenPolicy}
        onOpenSitemap={() => setSitemapModalOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          triggerHaptic('light');
          setIsSearchOpen(false);
        }}
        onSelectTool={handleSelectTool}
        favorites={favorites}
      />

      {/* Sitemap & SEO Index Modal */}
      <SitemapModal
        isOpen={sitemapModalOpen}
        onClose={() => setSitemapModalOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Legal & Policy Compliance Modal */}
      <PolicyModal
        isOpen={policyModalOpen}
        initialTab={policyTab}
        onClose={() => setPolicyModalOpen(false)}
      />

      {/* AdSense Cookie Consent Notice */}
      <CookieConsent onOpenPrivacyPolicy={() => handleOpenPolicy('privacy')} />

      {/* Polite AdBlocker Detection and Whitelist Guide */}
      <AdBlockDetector />

      {/* Online Requirement & AdSense Monetization Shield across all platforms */}
      <InternetRequiredShield onStatusChange={setIsOnline} />

      {/* Floating Accessible Voice Trigger Button */}
      <FloatingVoiceButton
        isListening={voiceNav.isListening}
        onOpenVoiceModal={() => {
          triggerHaptic('voice');
          setVoiceModalOpen(true);
        }}
        isOfflineVoiceReady={voiceNav.isOfflineVoiceReady}
      />

      {/* Voice Assistant & Hands-free Navigation Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => {
          triggerHaptic('light');
          setVoiceModalOpen(false);
        }}
        isListening={voiceNav.isListening}
        transcript={voiceNav.transcript}
        lastCommand={voiceNav.lastCommand}
        statusMessage={voiceNav.statusMessage}
        isSupported={voiceNav.isSupported}
        isOfflineVoiceReady={voiceNav.isOfflineVoiceReady}
        isOnline={voiceNav.isOnline}
        onToggleListening={voiceNav.toggleListening}
        onExecuteCommand={(cmd) => voiceNav.executeVoiceCommand(cmd)}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
