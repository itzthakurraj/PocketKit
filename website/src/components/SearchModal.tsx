import React, { useEffect, useState, useRef } from 'react';
import { TOOLS_DATA } from '../data/toolsData';
import { ToolItem } from '../types';
import { Search, X, ArrowRight, Star } from 'lucide-react';
import { IconRenderer } from './IconRenderer';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  favorites: string[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  favorites,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global key listener for Esc
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

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q)) ||
      (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1f2937] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 30+ tools by name, topic, or keyword..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No tools matching "{query}" found</p>
            </div>
          ) : (
            filteredTools.map((tool) => {
              const isFav = favorites.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                      <IconRenderer name={tool.icon} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {tool.name}
                        </h4>
                        {isFav && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-400 truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 capitalize hidden sm:inline">
                      {tool.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{filteredTools.length} tools available</span>
          <span>Tip: Press ESC anytime to dismiss</span>
        </div>
      </div>
    </div>
  );
};
