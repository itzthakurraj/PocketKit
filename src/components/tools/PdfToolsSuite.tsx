import React, { useState } from 'react';
import jsPDF from 'jspdf';
import {
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle,
  Sparkles,
  Trash2,
  Copy,
  Check,
  RotateCw,
  FileCode,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { triggerHaptic } from '../../utils/haptics';

interface PdfToolsSuiteProps {
  initialTab?: 'imagesToPdf' | 'dataToPdf' | 'extractPdf' | 'textToPdf';
}

export const PdfToolsSuite: React.FC<PdfToolsSuiteProps> = ({ initialTab = 'textToPdf' }) => {
  const [tab, setTab] = useState<'textToPdf' | 'imagesToPdf' | 'dataToPdf' | 'extractPdf'>(
    initialTab === 'extractPdf' ? 'extractPdf' : initialTab
  );

  // Text to PDF state
  const [docTitle, setDocTitle] = useState('PocketKit Document');
  const [docAuthor, setDocAuthor] = useState('');
  const [fontFamily, setFontFamily] = useState<'helvetica' | 'times' | 'courier'>('helvetica');
  const [fontSize, setFontSize] = useState<number>(11);
  const [pageOrientation, setPageOrientation] = useState<'p' | 'l'>('p');
  const [watermarkText, setWatermarkText] = useState('');
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [textInput, setTextInput] = useState(
    `# Executive Summary\n\nPocketKit is your pocket-sized digital workshop delivering fast, 100% client-side utilities without remote server dependencies.\n\nKey Highlights:\n- 100% Client-Side Privacy: Documents and data are never stored or transmitted.\n- Zero-Latency Performance: PDF compilation happens instantly inside browser memory.\n- Universal Accessibility: Free forever, mobile-optimized, and works across all devices.\n\nThank you for choosing PocketKit!`
  );

  // Images to PDF state
  const [images, setImages] = useState<{ id: string; file: File; preview: string; name: string }[]>([]);
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('contain');

  // Data to PDF state
  const [csvInput, setCsvInput] = useState(
    `Item,Quantity,Unit Price,Total\nWeb Design System,1,$2400,$2400\nSEO Architecture,1,$1200,$1200\nPerformance Optimization,1,$800,$800\nTotal Due,,, $4400`
  );
  const [tableTitle, setTableTitle] = useState('Commercial Invoice & Summary');

  // PDF Text Extraction state
  const [extractedText, setExtractedText] = useState('');
  const [extractedFileName, setExtractedFileName] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();

  // Template loader for Text to PDF
  const loadTemplate = (type: 'notes' | 'letter' | 'invoice') => {
    triggerHaptic('light');
    if (type === 'notes') {
      setDocTitle('Meeting Notes & Action Items');
      setTextInput(
        `Date: ${new Date().toLocaleDateString()}\nAttendees: Design Lead, Full-Stack Engineer, Product Manager\n\nAgenda:\n1. Client-Side SEO Architecture review\n2. Tool benchmark performance testing\n3. Mobile touch responsiveness\n\nAction Items:\n- Deploy clean URL routing with canonical links\n- Validate Schema.org structured data in Google Search Console\n- Verify offline PWA caching`
      );
    } else if (type === 'letter') {
      setDocTitle('Official Letter of Correspondence');
      setTextInput(
        `To Whom It May Concern,\n\nI am writing to confirm the formal delivery of the client-side tool suite on the PocketKit platform. All modules have been verified for zero server dependencies, ensuring complete end-user privacy and instantaneous client execution.\n\nPlease find the attached documentation and feel free to reach out with any inquiries.\n\nSincerely,\nPocketKit Engineering`
      );
    } else if (type === 'invoice') {
      setDocTitle('Statement of Services & Account');
      setTextInput(
        `Client: Universal Web Services\nInvoice Date: ${new Date().toLocaleDateString()}\nStatus: Paid in Full\n\nDescription of Services:\n- Universal SEO & Social Metadata implementation\n- Interactive Standalone Tool Workspaces\n- JSON-LD Schema.org rich search snippet integration\n\nTotal Paid: $0.00 (PocketKit Free Community Tier)`
      );
    }
  };

  // Compile Text to PDF
  const generateTextPdf = () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: pageOrientation,
        unit: 'mm',
        format: 'a4',
      });

      doc.setFont(fontFamily);

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;

      // Header Title
      doc.setFontSize(18);
      doc.setFont(fontFamily, 'bold');
      doc.text(docTitle, margin, margin + 5);

      if (docAuthor) {
        doc.setFontSize(10);
        doc.setFont(fontFamily, 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(`By: ${docAuthor}  ·  Generated: ${new Date().toLocaleDateString()}`, margin, margin + 12);
        doc.setTextColor(30, 30, 30);
      }

      // Divider line
      doc.setDrawColor(220, 225, 230);
      doc.line(margin, margin + 15, pageWidth - margin, margin + 15);

      // Body text
      doc.setFontSize(fontSize);
      doc.setFont(fontFamily, 'normal');

      const startY = margin + 22;
      const splitLines = doc.splitTextToSize(textInput, contentWidth);
      const lineHeight = fontSize * 0.45;

      let currentY = startY;
      let currentPage = 1;

      for (let i = 0; i < splitLines.length; i++) {
        if (currentY + lineHeight > pageHeight - margin - 10) {
          // Add Watermark to completed page if specified
          if (watermarkText) {
            applyWatermark(doc, watermarkText, pageWidth, pageHeight);
          }
          if (includePageNumbers) {
            applyPageNumber(doc, currentPage, pageWidth, pageHeight);
          }

          doc.addPage();
          currentPage++;
          currentY = margin + 10;
        }

        doc.text(splitLines[i], margin, currentY);
        currentY += lineHeight;
      }

      // Add Watermark & page number to the final page
      if (watermarkText) {
        applyWatermark(doc, watermarkText, pageWidth, pageHeight);
      }
      if (includePageNumbers) {
        applyPageNumber(doc, currentPage, pageWidth, pageHeight);
      }

      const filename = `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'document'}.pdf`;
      doc.save(filename);
      triggerHaptic('success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      triggerHaptic('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyWatermark = (doc: jsPDF, text: string, w: number, h: number) => {
    doc.saveGraphicsState();
    doc.setTextColor(210, 210, 210);
    doc.setFontSize(40);
    doc.text(text, w / 2, h / 2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();
    doc.setTextColor(30, 30, 30);
  };

  const applyPageNumber = (doc: jsPDF, pageNum: number, w: number, h: number) => {
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text(`Page ${pageNum}`, w - 20, h - 10, { align: 'right' });
    doc.text('Created with PocketKit', 20, h - 10);
    doc.setTextColor(30, 30, 30);
  };

  // Compile Images to PDF
  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
      setImages((prev) => [...prev, ...newImages]);
      triggerHaptic('light');
    }
  };

  const removeImage = (id: string) => {
    triggerHaptic('light');
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const generateImagesPdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    triggerHaptic('medium');

    try {
      const doc = new jsPDF({
        orientation: pageOrientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        const imgItem = images[i];

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imgItem.file);
        });

        const targetW = pageWidth - margin * 2;
        const targetH = pageHeight - margin * 2 - 15;

        doc.addImage(dataUrl, 'JPEG', margin, margin, targetW, targetH, undefined, 'FAST');
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(`${imgItem.name} · Page ${i + 1} of ${images.length}`, margin, pageHeight - 5);
      }

      doc.save('PocketKit-Images-Album.pdf');
      triggerHaptic('success');
    } catch (err) {
      console.error('Error generating image PDF:', err);
      triggerHaptic('error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Compile CSV/Data to PDF Table
  const generateDataPdf = () => {
    setIsGenerating(true);
    triggerHaptic('medium');

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(tableTitle, margin, 20);

      const rows = csvInput
        .trim()
        .split('\n')
        .map((r) => r.split(',').map((c) => c.trim()));

      let currentY = 32;
      const colWidth = (pageWidth - margin * 2) / (rows[0]?.length || 1);

      rows.forEach((row, rowIndex) => {
        const isHeader = rowIndex === 0;
        doc.setFontSize(isHeader ? 11 : 9);
        doc.setFont('helvetica', isHeader ? 'bold' : 'normal');

        // Row background
        if (isHeader) {
          doc.setFillColor(240, 243, 248);
          doc.rect(margin, currentY - 5, pageWidth - margin * 2, 8, 'F');
        } else if (rowIndex % 2 === 1) {
          doc.setFillColor(250, 250, 252);
          doc.rect(margin, currentY - 5, pageWidth - margin * 2, 8, 'F');
        }

        row.forEach((cell, colIndex) => {
          doc.text(cell, margin + colIndex * colWidth + 2, currentY);
        });

        currentY += 8;
      });

      doc.save(`${tableTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'table-export'}.pdf`);
      triggerHaptic('success');
    } catch (err) {
      console.error('Error creating data PDF:', err);
      triggerHaptic('error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Extract text from text-based file
  const handleExtractFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExtractedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        // Simple clean extraction of printable characters
        const clean = content.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s+/g, ' ');
        setExtractedText(clean.slice(0, 5000));
        triggerHaptic('success');
      };
      reader.readAsText(file);
    }
  };

  const handleCopyExtracted = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const wordCount = textInput.trim() ? textInput.trim().split(/\s+/).length : 0;
  const charCount = textInput.length;
  const estimatedPages = Math.max(1, Math.ceil(textInput.length / 1800));

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => {
            triggerHaptic('selection');
            setTab('textToPdf');
          }}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'textToPdf'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Text & Notes to PDF</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('selection');
            setTab('imagesToPdf');
          }}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'imagesToPdf'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Images to PDF</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('selection');
            setTab('dataToPdf');
          }}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'dataToPdf'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Data & CSV to PDF</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('selection');
            setTab('extractPdf');
          }}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'extractPdf'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Extract Content</span>
        </button>
      </div>

      {/* TAB 1: TEXT & NOTES TO PDF */}
      {tab === 'textToPdf' && (
        <div className="space-y-5">
          {/* Document Settings Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                placeholder="Document Title"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Author / Subtitle
              </label>
              <input
                type="text"
                value={docAuthor}
                onChange={(e) => setDocAuthor(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                placeholder="Optional author name"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="helvetica">Clean Sans (Helvetica)</option>
                <option value="times">Editorial Serif (Times)</option>
                <option value="courier">Monospace Code (Courier)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Page Orientation
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPageOrientation('p')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    pageOrientation === 'p'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setPageOrientation('l')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                    pageOrientation === 'l'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>
          </div>

          {/* Quick Presets & Watermark */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700 dark:text-slate-300">Templates:</span>
              <button
                type="button"
                onClick={() => loadTemplate('notes')}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Meeting Notes
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('letter')}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Official Letter
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('invoice')}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Invoice Note
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Page numbers</span>
              </label>

              <div className="flex items-center gap-1">
                <span className="text-slate-500">Watermark:</span>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. DRAFT"
                  className="w-24 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            rows={12}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm leading-relaxed font-mono focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            placeholder="Type or paste your text, markdown, or notes here..."
          />

          {/* Bottom Bar: Stats + Download CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              <span>{wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span>{charCount} characters</span>
              <span aria-hidden="true">·</span>
              <span>Est. {estimatedPages} page(s)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setTextInput('');
                  triggerHaptic('light');
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={generateTextPdf}
                disabled={isGenerating || !textInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Compiling PDF...' : 'Download PDF Document'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMAGES TO PDF */}
      {tab === 'imagesToPdf' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">
              {images.length > 0 ? `${images.length} photo(s) queued` : 'Select JPG, JPEG, PNG, or WebP Images'}
            </span>
            <span className="text-xs text-slate-400 mt-1">Multi-page PDF compiled 100% in your browser</span>
            <input type="file" multiple accept="image/*" onChange={handleImageFiles} className="hidden" />
          </label>

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800"
                  >
                    <img
                      src={img.preview}
                      alt={img.name}
                      className="w-full h-28 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-2 text-[11px] truncate text-slate-600 dark:text-slate-300 font-mono">
                      Page {idx + 1}: {img.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Ready to compile {images.length} photo(s) into a unified PDF album
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={generateImagesPdf}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGenerating ? 'Compiling PDF...' : 'Download Image PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATA & CSV TO PDF */}
      {tab === 'dataToPdf' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Report / Table Title
            </label>
            <input
              type="text"
              value={tableTitle}
              onChange={(e) => setTableTitle(e.target.value)}
              className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              CSV Table Data (Comma-separated)
            </label>
            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={generateDataPdf}
              disabled={isGenerating || !csvInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Table...' : 'Download Table PDF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: EXTRACT CONTENT */}
      {tab === 'extractPdf' && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">
              {extractedFileName ? extractedFileName : 'Select Text or Document File to Extract'}
            </span>
            <span className="text-xs text-slate-400 mt-1">Read text content instantly client-side</span>
            <input type="file" accept=".txt,.csv,.json,.html,.md" onChange={handleExtractFile} className="hidden" />
          </label>

          {extractedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Extracted Preview ({extractedText.length} characters)
                </span>
                <button
                  type="button"
                  onClick={handleCopyExtracted}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
              <textarea
                rows={8}
                readOnly
                value={extractedText}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono leading-relaxed"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
