import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const BlogPage: React.FC = () => {
  const { t } = useLanguage();

  const articles = [
    {
      id: 'client-side-privacy',
      title: 'Why 100% Client-Side Processing Matters for Data Security',
      snippet: 'Discover how WebAssembly, the Web Crypto API, and modern HTML5 canvas enable heavy computation without shipping user data across the wire.',
      date: 'Oct 2026',
      readTime: '4 min read',
      author: 'Security Engineering Team',
      category: 'Privacy',
    },
    {
      id: 'accessibility-digital-divide',
      title: 'Bridging the Literacy Gap with Multilingual Voice Feedback in Web Apps',
      snippet: 'How SpeechSynthesis and intuitive visual cues allow millions of non-literate and visually impaired individuals to utilize digital utility tools with ease.',
      date: 'Oct 2026',
      readTime: '5 min read',
      author: 'Accessibility WG',
      category: 'Inclusion',
    },
    {
      id: 'pwa-vs-apk',
      title: 'Offline PWAs and Android Native Wrappers: The Best of Both Worlds',
      snippet: 'Learn how we designed PocketKit to distribute seamlessly as both a lightweight 4.5MB native Android APK and an instant browser PWA.',
      date: 'Sep 2026',
      readTime: '6 min read',
      author: 'Mobile Infrastructure',
      category: 'Architecture',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          PocketKit Engineering & Product Blog
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Articles on client-side privacy, web cryptography, accessibility, and offline web architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((post) => (
          <article
            key={post.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#1a202c] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                {post.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {post.snippet}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-4">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
