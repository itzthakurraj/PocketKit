import React from 'react';
import { ActiveView } from '../types';
import { Heart, Shield, Zap } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ActiveView, category?: string) => void;
  onOpenPolicy?: (tab: 'privacy' | 'terms' | 'about' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy }) => {
  return (
    <footer className="bg-white dark:bg-[#1a202c] border-t border-slate-200 dark:border-slate-800 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-xs bg-indigo-600">
                <img src="/pocketkit-icon.svg" alt="PocketKit Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Pocket<span className="text-indigo-600 dark:text-indigo-400">Kit</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Your pocket-sized digital workshop. Fast, private, client-side online tools for creators, developers, and everyday tasks.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> 100% Client-Side
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Zero Wait
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('category', 'text')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Text & Documents
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'development')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Developer & JSON
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'encryption')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Security & Hashes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'calculator')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Finance & Calculators
                </button>
              </li>
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Media & Suites
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('category', 'image')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Image Compress & Crop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'pdf')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  PDF & Document Magic
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'web')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Web Colors & CSS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium cursor-pointer"
                >
                  All 72+ Tools Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & AdSense Compliance Policies */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Resources & Policies
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Feature Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Guides & Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('privacy')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-medium"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('terms')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('about')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  About PocketKit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('contact')}
                  className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} PocketKit. All rights reserved. Free & Open Web Utilities.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for developers & creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
