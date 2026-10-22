import React, { useState, useEffect } from 'react';
import { ToolItem } from '../types';
import { IconRenderer } from '../components/IconRenderer';
import { ToolRenderer } from '../components/ToolRenderer';
import {
  Star,
  Share2,
  Check,
  Volume2,
  VolumeX,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Globe2,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedTool } from '../utils/toolLocalization';
import { triggerHaptic } from '../utils/haptics';
import { getToolSEO } from '../utils/seoUtils';
import { TOOLS_DATA } from '../data/toolsData';

interface StandaloneToolPageProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectTool: (id: string | null) => void;
  onNavigateHome: () => void;
}

export const StandaloneToolPage: React.FC<StandaloneToolPageProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onSelectTool,
  onNavigateHome,
}) => {
  const { language, t, speak, isSpeaking, stopSpeaking } = useLanguage();
  const [copiedShare, setCopiedShare] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const localized = getLocalizedTool(tool, language, t);
  const seo = getToolSEO(tool);

  // Scroll to top when tool changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id]);

  const handleShare = () => {
    triggerHaptic('success');
    const url = `${window.location.origin}/tools/${tool.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
    });
  };

  const handleToggleVoice = () => {
    triggerHaptic('voice');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(`${localized.localizedName}. ${localized.localizedDescription}`);
    }
  };

  // Find related tools
  const relatedTools = (tool.relatedToolIds || [])
    .map((id) => TOOLS_DATA.find((t) => t.id === id))
    .filter((t): t is ToolItem => Boolean(t))
    .slice(0, 4);

  // Default fallback if no specific related tools specified
  const displayRelatedTools =
    relatedTools.length > 0
      ? relatedTools
      : TOOLS_DATA.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={onNavigateHome}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PocketKit</span>
        </button>
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
        <button
          onClick={() => {
            window.location.hash = `category:${tool.category}`;
          }}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider font-semibold cursor-pointer"
        >
          {localized.localizedCategory}
        </button>
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px] sm:max-w-none">
          {localized.localizedName}
        </span>
      </nav>

      {/* Tool Header & Hero Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
              <IconRenderer name={tool.icon} className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {localized.localizedName}
                </h1>
                {tool.badge && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Clean Unboxed Metadata Discipline */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">{localized.localizedCategory}</span>
                <span aria-hidden="true">·</span>
                <span>100% Client-Side</span>
                <span aria-hidden="true">·</span>
                <span>Zero Server Uploads</span>
                <span aria-hidden="true">·</span>
                <span>Free & Unlimited</span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl pt-1">
                {localized.localizedDescription}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            {/* Audio Guide */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-red-500 text-white animate-pulse border-red-400 ring-2 ring-red-400/40'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-slate-200 dark:border-slate-700'
              }`}
              title={isSpeaking ? 'Stop Voice' : 'Listen to Audio Instructions'}
              aria-label="Listen to Audio Guide"
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Favorite Button */}
            <button
              onClick={(e) => onToggleFavorite(tool.id, e)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle Favorite"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Share Tool URL */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-semibold cursor-pointer"
              title="Share clean URL"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">URL Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Workbench */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <ToolRenderer tool={tool} />
      </div>

      {/* Step-by-Step Usage Guide (How-To SEO Rich Snippet Target) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            How to use {tool.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            Follow these easy steps to get fast, accurate results directly in your web browser.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(tool.howToSteps || [
              `Input or upload your source data into the ${tool.name} workbench.`,
              'Adjust configuration options, formats, and customization preferences.',
              'Preview the rendered output in real time and download or copy with one click.',
            ]).map((step, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {`0${idx + 1}. Step ${idx + 1}`}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Architecture Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your text, files, and documents are processed locally in browser memory. Never uploaded to external servers.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instant Zero-Latency Execution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No waiting in server queues or uploading big files. Conversions and calculations execute in milliseconds.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Universal & Free Forever</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Accessible worldwide across desktop, Android, and iOS browsers without paywalls or subscriptions.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ Accordion for Rich Snippets) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Everything you need to know about using {tool.name} on PocketKit.
        </p>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {(tool.faqs || [
            {
              question: `Is the ${tool.name} completely free to use?`,
              answer: `Yes, ${tool.name} on PocketKit is 100% free with unlimited usage, zero subscriptions, and no account needed.`,
            },
            {
              question: `Are my files and data private when using ${tool.name}?`,
              answer: `All computations and transformations occur locally in your browser. Your data is never uploaded to remote servers.`,
            },
            {
              question: `Does ${tool.name} work on mobile phones and tablets?`,
              answer: `Yes, PocketKit is fully responsive and optimized for touch devices, Android, iOS, and desktop browsers.`,
            },
          ]).map((faq, index) => {
            const isExpanded = expandedFaqIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-sm text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Tools Carousel */}
      {displayRelatedTools.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Related Online Tools
            </h2>
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Browse All 70+ Tools →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayRelatedTools.map((relTool) => (
              <button
                key={relTool.id}
                onClick={() => onSelectTool(relTool.id)}
                className="group p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <IconRenderer name={relTool.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {relTool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {relTool.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="uppercase tracking-wider font-semibold">{relTool.category}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">Open →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
