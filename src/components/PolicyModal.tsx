import React, { useState } from 'react';
import { X, Shield, FileText, Info, Mail, Lock, CheckCircle, ExternalLink } from 'lucide-react';

export type PolicyTab = 'privacy' | 'terms' | 'about' | 'contact';

interface PolicyModalProps {
  isOpen: boolean;
  initialTab?: PolicyTab;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Navigation */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Legal, Policies & Support
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 px-6 bg-white dark:bg-[#1a202c] overflow-x-auto text-xs font-bold gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-2 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-2 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-2 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About PocketKit
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-2 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact & Support
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Privacy Policy (AdSense Compliant) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h3>
              <p className="text-xs text-slate-400">Last updated: October 20, 2026</p>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800 dark:text-emerald-300">
                  <strong className="block font-bold">100% Client-Side Privacy Guarantee:</strong>
                  Your files, text, images, and documents never leave your browser. All conversions and cryptographic operations run locally on your device via JavaScript and WebAssembly.
                </div>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                1. Google AdSense & Third-Party Advertising
              </h4>
              <p>
                We use Google AdSense to serve advertisements when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on PocketKit. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to PocketKit and/or other sites on the Internet.
              </p>
              <p>
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-1"
                >
                  Google Ads Settings <ExternalLink className="w-3 h-3" />
                </a>{' '}
                or by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-1"
                >
                  aboutads.info <ExternalLink className="w-3 h-3" />
                </a>.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                2. Cookies & Web Beacons
              </h4>
              <p>
                PocketKit uses cookies to store user theme preferences (light/dark mode) and favorites locally in your browser’s localStorage. Third-party advertisers like Google may also use cookies, web beacons, and JavaScript in their respective advertisements to measure campaign effectiveness and personalize ad content. PocketKit has no access to or control over cookies used by third-party advertisers.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                3. Log Files & Analytics
              </h4>
              <p>
                Like many websites, our web hosting infrastructure may record standard server logs (IP address, browser type, referral pages, timestamp) solely for security and network diagnostic purposes. These logs are never linked to personal identities.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                4. Contact Information
              </h4>
              <p>
                If you have questions regarding this privacy policy, you may contact us at{' '}
                <strong className="text-indigo-600 dark:text-indigo-400">itzthakurraj@gmail.com</strong>.
              </p>
            </div>
          )}

          {/* Terms of Service */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Terms of Service
              </h3>
              <p className="text-xs text-slate-400">Effective Date: October 20, 2026</p>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                1. Acceptance of Terms
              </h4>
              <p>
                By accessing or using PocketKit (including all tools, utilities, calculators, and converters), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                2. Free Use & License
              </h4>
              <p>
                PocketKit grants you a personal, non-exclusive, worldwide, royalty-free license to use all provided tools for personal, educational, and commercial projects without fee or mandatory account registration.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                3. Disclaimer of Warranties
              </h4>
              <p>
                All utilities, calculators, and converters are provided "AS IS" and "AS AVAILABLE" without warranties of any kind. While we strive for absolute mathematical and technical accuracy, financial and tax calculators (such as GST or EMI) should be independently verified before making major investment or legal decisions.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white pt-2">
                4. User Conduct
              </h4>
              <p>
                You agree not to misuse our utilities to process unlawful, defamatory, or harmful content, or attempt to disrupt the performance of our web infrastructure.
              </p>
            </div>
          )}

          {/* About Us */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                About PocketKit
              </h3>
              <p>
                <strong>PocketKit</strong> is a modern, privacy-first digital workshop featuring over <strong>70+ instant utilities</strong>.
              </p>
              <p>
                Most online tools today require uploading sensitive photos, tax files, contracts, or passwords to cloud servers where they can be logged or leaked. PocketKit was built with a different philosophy:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Local-First:</strong> Processing occurs in browser memory via modern Web APIs, Canvas, and Web Workers.</li>
                <li><strong>No Paywalls:</strong> Completely free to use without requiring an account or subscription.</li>
                <li><strong>Mobile & Desktop Ready:</strong> Optimized as an installable Progressive Web App (PWA) that functions offline.</li>
              </ul>
            </div>
          )}

          {/* Contact Us */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact & Support
              </h3>
              <p>
                Have a question, tool suggestion, or feedback? We’d love to hear from you!
              </p>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">Email Address</span>
                    <a
                      href="mailto:itzthakurraj@gmail.com"
                      className="text-base font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      itzthakurraj@gmail.com
                    </a>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  Response Time: Typically within 24–48 hours for general inquiries and tool feature requests.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
