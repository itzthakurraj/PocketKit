import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Upload, Download, FileText, FileSpreadsheet, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface PdfToolsSuiteProps {
  initialTab?: 'imagesToPdf' | 'dataToPdf' | 'extractPdf' | 'textToPdf';
}

export const PdfToolsSuite: React.FC<PdfToolsSuiteProps> = ({ initialTab = 'imagesToPdf' }) => {
  const [tab, setTab] = useState<'imagesToPdf' | 'dataToPdf' | 'textToPdf'>(
    initialTab === 'extractPdf' ? 'textToPdf' : initialTab
  );
  const [textInput, setTextInput] = useState('PocketKit Document Notes\n\n- Zero Server Uploads\n- 100% Client-Side Privacy\n- Instant Offline Export');
  const [images, setImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();

  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const generateImagesPdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    const doc = new jsPDF();

    for (let i = 0; i < images.length; i++) {
      if (i > 0) doc.addPage();
      const file = images[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      doc.addImage(dataUrl, 'JPEG', 15, 20, 180, 135);
      doc.setFontSize(10);
      doc.text(`Image ${i + 1} - ${file.name}`, 15, 165);
    }
    doc.save('PocketKit-Images.pdf');
    setIsGenerating(false);
  };

  const generateTextPdf = () => {
    setIsGenerating(true);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('PocketKit Document Export', 15, 20);
    doc.setFontSize(11);

    const splitLines = doc.splitTextToSize(textInput, 180);
    doc.text(splitLines, 15, 35);
    doc.save('PocketKit-Document.pdf');
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setTab('imagesToPdf')}
          className={`px-4 py-2 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
            tab === 'imagesToPdf'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Images to PDF
        </button>
        <button
          onClick={() => setTab('textToPdf')}
          className={`px-4 py-2 font-bold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
            tab === 'textToPdf'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Text & Notes to PDF
        </button>
      </div>

      {tab === 'imagesToPdf' ? (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 cursor-pointer">
            <Upload className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">
              {images.length > 0 ? `${images.length} photos selected` : 'Select JPG, PNG or WebP Images'}
            </span>
            <span className="text-xs text-slate-400 mt-1">Multi-page PDF created 100% in your browser</span>
            <input type="file" multiple accept="image/*" onChange={handleImageFiles} className="hidden" />
          </label>

          {images.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Ready to compile {images.length} page(s) into PDF
              </span>
              <button
                onClick={generateImagesPdf}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Compiling...' : 'Download PDF'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            rows={8}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm leading-relaxed"
            placeholder="Type or paste formatted notes to generate a printable PDF..."
          />
          <div className="flex justify-end">
            <button
              onClick={generateTextPdf}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('tool.download', 'Export Text as PDF')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
