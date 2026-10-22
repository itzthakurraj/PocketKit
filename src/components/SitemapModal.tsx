import React, { useState } from 'react';
import { TOOLS_DATA, CATEGORIES } from '../data/toolsData';
import { ToolItem } from '../types';
import { IconRenderer } from './IconRenderer';
import { X, Search, ExternalLink, Copy, Check, Globe, FileCode } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (id: string) => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [sitemapCopied, setSitemapCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pocketkit.app';

  const filtered = TOOLS_DATA.filter((tool) => {
    const matchesCat = selectedCat === 'all' || tool.category === selectedCat;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.id.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some((k) => k.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  const handleCopyToolUrl = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('success');
    const url = `${origin}/tools/${toolId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrlId(toolId);
      setTimeout(() => setCopiedUrlId(null), 2000);
    });
  };

  const handleCopyXmlSitemap = () => {
    triggerHaptic('success');
    const urls = TOOLS_DATA.map(
      (t) => `  <url>\n    <loc>${origin}/tools/${t.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${t.isPopular ? '0.9' : '0.8'}</priority>\n  </url>`
    ).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}/</loc>\n    <priority>1.0</priority>\n  </url>\n${urls}\n</urlset>`;

    navigator.clipboard.writeText(xml).then(() => {
      setSitemapCopied(true);
      setTimeout(() => setSitemapCopied(false), 2200);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Worldwide Tools Directory & SEO Index
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct search-engine indexable endpoints for all 70+ client-side tools
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXmlSitemap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
              title="Copy sitemap.xml to clipboard"
            >
              {sitemapCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileCode className="w-3.5 h-3.5" />}
              <span>{sitemapCopied ? 'Sitemap Copied' : 'Export XML'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools by keyword (e.g. text to pdf, json, image)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCat === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching tools found for "{search}".
            </div>
          ) : (
            filtered.map((tool) => (
              <div
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 transition-all hover:shadow-xs cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <IconRenderer name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tool.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        /tools/{tool.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xl">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleCopyToolUrl(tool.id, e)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Copy direct SEO URL"
                  >
                    {copiedUrlId === tool.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Showing {filtered.length} of {TOOLS_DATA.length} indexable tools</span>
          <span>Dual routing supported: /tools/:slug and /#:slug</span>
        </div>
      </div>
    </div>
  );
};
