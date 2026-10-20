import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/blogData';
import { HelpCircle, ChevronDown, ChevronUp, Search, Mail, MessageSquare, ShieldCheck } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-6">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Support & FAQs
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          How Can We Help You?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Answers to frequently asked questions about file privacy, tool usage, and browser compatibility.
        </p>

        {/* Search FAQs */}
        <div className="pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles & FAQs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {faq.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                </div>

                <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact / Help Banner */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Have a question or tool request?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            We are constantly expanding our collection of client-side utilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:support@yourdomain.com"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
