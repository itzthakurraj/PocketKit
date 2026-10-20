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
import { OfflineIndicator } from './components/OfflineIndicator';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { CookieConsent } from './components/CookieConsent';

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
};

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<PolicyTab>('privacy');

  const handleOpenPolicy = (tab: PolicyTab) => {
    setPolicyTab(tab);
    setPolicyModalOpen(true);
  };

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
        } else if (hash.startsWith('category:')) {
          const cat = hash.replace('category:', '');
          setActiveView('category');
          setSelectedCategory(cat);
          setActiveToolId(null);
        } else {
          // Check if hash matches tool id directly
          const matchedTool = TOOLS_DATA.find((t) => t.id === hash || t.id.toLowerCase() === hash);
          if (matchedTool) {
            setActiveToolId(matchedTool.id);
          } else if (LEGACY_URL_MAP[hash + '.html']) {
            const legacyMatch = LEGACY_URL_MAP[hash + '.html'];
            if (legacyMatch.toolId) setActiveToolId(legacyMatch.toolId);
          }
        }
      } else {
        // No hash and not a legacy tool path -> close modal if open
        setActiveToolId(null);
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

  // Update hash when activeToolId or activeView changes
  const handleSelectTool = (id: string | null) => {
    setActiveToolId(id);
    if (id) {
      window.location.hash = id;
    } else {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  // Apply theme to DOM
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
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

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleToggleFavorite = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleNavigate = (view: ActiveView, category?: string) => {
    setActiveView(view);
    if (category) {
      setSelectedCategory(category);
      window.location.hash = `category:${category}`;
    } else if (view === 'all-tools') {
      setSelectedCategory('all');
      window.location.hash = '';
    } else if (view === 'features' || view === 'blog' || view === 'help') {
      window.location.hash = view;
    } else {
      window.location.hash = '';
    }
    setActiveToolId(null);
    setShowingFavoritesOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTool = activeToolId ? TOOLS_DATA.find((t) => t.id === activeToolId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#121826] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
        onToggleFavoritesFilter={() => {
          setShowingFavoritesOnly(!showingFavoritesOnly);
          if (activeView !== 'home' && activeView !== 'all-tools') {
            setActiveView('home');
          }
        }}
        showingFavoritesOnly={showingFavoritesOnly}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'home' || activeView === 'all-tools' || activeView === 'category' ? (
          <HomePage
            tools={TOOLS_DATA}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              window.location.hash = cat === 'all' ? '' : `category:${cat}`;
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectTool={handleSelectTool}
            showingFavoritesOnly={showingFavoritesOnly}
            onClearFavoritesFilter={() => setShowingFavoritesOnly(false)}
          />
        ) : activeView === 'features' ? (
          <FeaturesPage onOpenTool={handleSelectTool} />
        ) : activeView === 'blog' ? (
          <BlogPage />
        ) : activeView === 'help' ? (
          <HelpPage />
        ) : null}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenPolicy={handleOpenPolicy} />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
        favorites={favorites}
      />

      {/* Active Tool Modal */}
      {activeTool && (
        <ToolModal
          tool={activeTool}
          isFavorite={favorites.includes(activeTool.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => handleSelectTool(null)}
        />
      )}

      {/* Legal & Policy Compliance Modal */}
      <PolicyModal
        isOpen={policyModalOpen}
        initialTab={policyTab}
        onClose={() => setPolicyModalOpen(false)}
      />

      {/* AdSense Cookie Consent Notice */}
      <CookieConsent onOpenPrivacyPolicy={() => handleOpenPolicy('privacy')} />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}

export default App;
