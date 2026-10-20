import React, { useEffect, useState } from 'react';
import { ToolItem } from '../types';
import { IconRenderer } from './IconRenderer';
import { X, Star, ArrowLeft, Share2, Check } from 'lucide-react';
import { AdBanner } from './AdBanner';

// Tool imports
import { CaseConverterTool } from './tools/CaseConverterTool';
import { CharacterCountTool } from './tools/CharacterCountTool';
import { AsciiConverterTool } from './tools/AsciiConverterTool';
import { DiffCheckerTool } from './tools/DiffCheckerTool';
import { LoremGeneratorTool } from './tools/LoremGeneratorTool';
import { TypingTestTool } from './tools/TypingTestTool';
import { JsonBeautifierTool } from './tools/JsonBeautifierTool';
import { JsonMinifierTool } from './tools/JsonMinifierTool';
import { JsonToCsvTool } from './tools/JsonToCsvTool';
import { JsonToXmlTool } from './tools/JsonToXmlTool';
import { CodeBeautifierTool } from './tools/CodeBeautifierTool';
import { AesDesEncryptTool } from './tools/AesDesEncryptTool';
import { Base64Tool } from './tools/Base64Tool';
import { HashGeneratorTool } from './tools/HashGeneratorTool';
import { PasswordGeneratorTool } from './tools/PasswordGeneratorTool';
import { UrlEncoderTool } from './tools/UrlEncoderTool';
import { AgeCalculatorTool } from './tools/AgeCalculatorTool';
import { GstCalculatorTool } from './tools/GstCalculatorTool';
import { LoanCalculatorTool } from './tools/LoanCalculatorTool';
import { SipCalculatorTool } from './tools/SipCalculatorTool';
import { CalculatorTool } from './tools/CalculatorTool';
import { ColorConverterTool } from './tools/ColorConverterTool';
import { ImageCompressorTool } from './tools/ImageCompressorTool';
import { ImageConverterTool } from './tools/ImageConverterTool';
import { ImageCropperTool } from './tools/ImageCropperTool';
import { PhotoEditorTool } from './tools/PhotoEditorTool';
import { ImageWatermarkTool } from './tools/ImageWatermarkTool';
import { ImageUpscaleTool } from './tools/ImageUpscaleTool';
import { HtmlToImageTool } from './tools/HtmlToImageTool';
import { PdfToolsSuite } from './tools/PdfToolsSuite';
import { SpeechTools } from './tools/SpeechTools';

interface ToolModalProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onClose,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleShare = () => {
    const url = `${window.location.origin}/#${tool.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  const renderToolComponent = () => {
    switch (tool.id) {
      // Text Tools
      case 'case-converter':
      case 'uppercase-converter':
      case 'lowercase-converter':
      case 'document-wizard':
        return <CaseConverterTool />;
      case 'character-count':
        return <CharacterCountTool />;
      case 'ascii-converter':
      case 'text-to-ascii':
      case 'ascii-to-text':
        return <AsciiConverterTool />;
      case 'diff-checker':
        return <DiffCheckerTool />;
      case 'lorem-generator':
        return <LoremGeneratorTool />;
      case 'typing-test':
        return <TypingTestTool />;

      // Developer Tools
      case 'json-beautifier':
      case 'json-viewer':
      case 'json-validator':
        return <JsonBeautifierTool />;
      case 'json-minifier':
        return <JsonMinifierTool />;
      case 'json-to-csv':
        return <JsonToCsvTool />;
      case 'json-to-xml':
        return <JsonToXmlTool />;
      case 'code-beautifier':
      case 'html-beautifier':
      case 'css-beautifier':
      case 'js-beautifier':
      case 'css-minify':
      case 'development-hub':
        return <CodeBeautifierTool />;
      case 'html-encode-decode':
      case 'url-encoder':
        return <UrlEncoderTool />;

      // Encryption & Security
      case 'aes-des-encrypt':
      case 'encryption-hub':
        return <AesDesEncryptTool />;
      case 'base64-tool':
        return <Base64Tool />;
      case 'md5-hash':
      case 'sha256-hash':
        return <HashGeneratorTool />;
      case 'password-generator':
        return <PasswordGeneratorTool />;

      // Calculators
      case 'age-calculator':
        return <AgeCalculatorTool />;
      case 'gst-calculator':
        return <GstCalculatorTool />;
      case 'loan-calculator':
        return <LoanCalculatorTool />;
      case 'sip-calculator':
        return <SipCalculatorTool />;
      case 'scientific-calculator':
        return <CalculatorTool />;

      // Web & Colors
      case 'color-converter':
      case 'hex-to-rgb':
      case 'rgb-to-hex':
      case 'web-hub':
        return <ColorConverterTool />;

      // Image Tools
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'image-converter':
      case 'convert-to-jpg':
      case 'convert-from-jpg':
      case 'image-tools-hub':
        return <ImageConverterTool />;
      case 'image-cropper':
        return <ImageCropperTool />;
      case 'photo-editor':
        return <PhotoEditorTool />;
      case 'image-watermark':
        return <ImageWatermarkTool />;
      case 'image-upscale':
        return <ImageUpscaleTool />;
      case 'html-to-image':
        return <HtmlToImageTool />;

      // PDF & Audio Tools
      case 'jpgto-pdf':
      case 'pngto-pdf':
      case 'webpto-pdf':
        return <PdfToolsSuite initialTab="imagesToPdf" />;
      case 'csvto-pdf':
      case 'excelto-pdf':
      case 'htmlto-pdf':
      case 'jsonto-pdf':
      case 'xmlto-pdf':
        return <PdfToolsSuite initialTab="dataToPdf" />;
      case 'pdftotext':
      case 'pdftojpg':
      case 'pdftopng':
      case 'pdftowebp':
      case 'pdftoword':
      case 'pdftoexcel':
      case 'pdftocsv':
      case 'pdftohtml':
      case 'pdftojson':
      case 'pdftoxml':
      case 'pdftozip':
        return <PdfToolsSuite initialTab="extractPdf" />;
      case 'pdf-tools':
      case 'textto-pdf':
      case 'speechto-pdf':
        return <PdfToolsSuite initialTab="textToPdf" />;
      case 'speech-tools':
        return <SpeechTools />;
      default:
        return <CaseConverterTool />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#1a202c] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="relative p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
                <IconRenderer name={tool.icon} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {tool.name}
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tool.category}
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy direct link to this tool"
              >
                {copiedShare ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={(e) => onToggleFavorite(tool.id, e)}
                className={`p-2 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-500 border-amber-300'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-400'
                }`}
                title={isFavorite ? 'Remove favorite' : 'Save to favorites'}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Close tool (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Tool Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {renderToolComponent()}
          {/* AdSense In-Tool Banner */}
          <AdBanner slotId="1000000002" format="auto" className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800" />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Tools
          </button>
          <span>All computations run client-side in your browser</span>
        </div>
      </div>
    </div>
  );
};
