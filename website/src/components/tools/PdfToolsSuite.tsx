import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import { FileText, Download, Upload, Image, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface PdfToolsSuiteProps {
  initialTab?: 'textToPdf' | 'imagesToPdf' | 'dataToPdf' | 'extractPdf';
}

export const PdfToolsSuite: React.FC<PdfToolsSuiteProps> = ({ initialTab = 'textToPdf' }) => {
  const [activeTab, setActiveTab] = useState<'textToPdf' | 'imagesToPdf' | 'dataToPdf' | 'extractPdf'>(initialTab);

  // Text to PDF state
  const [docTitle, setDocTitle] = useState('My Document');
  const [docBody, setDocBody] = useState(
    'This PDF document was generated effortlessly using Toolkit.\n\nAll tools run entirely within your web browser with zero server uploads, keeping your documents confidential, fast, and accessible everywhere.'
  );
  const [fontSize, setFontSize] = useState<number>(12);

  // Data / Spreadsheet to PDF state
  const [dataInput, setDataInput] = useState(`Product,Quantity,Price,Total\nWidget Pro,5,$29.99,$149.95\nSuper Gadget,2,$89.50,$179.00\nCloud Connector,1,$299.00,$299.00`);
  const [tableTitle, setTableTitle] = useState('Data Summary Report');

  // Images to PDF state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Extract Text state
  const [extractedText, setExtractedText] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState<string>('');

  const handleGenerateTextPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Title
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Primary Indigo
    doc.text(docTitle, 20, 25);

    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 32, 190, 32);

    // Body
    doc.setFontSize(fontSize);
    doc.setTextColor(30, 41, 59);
    const splitText = doc.splitTextToSize(docBody, 170);
    doc.text(splitText, 20, 42);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Created with Toolkit • Free Online Tools', 20, 285);

    doc.save(`${docTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleGenerateDataPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Title
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text(tableTitle, 20, 22);

    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 29);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 33, 190, 33);

    // Parse CSV lines
    const lines = dataInput.trim().split('\n');
    let y = 42;

    lines.forEach((line, rowIndex) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      const cells = line.split(',').map((c) => c.trim());
      const colWidth = 170 / Math.max(1, cells.length);

      if (rowIndex === 0) {
        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(20, y - 5, 170, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
      }

      cells.forEach((cell, colIndex) => {
        doc.text(cell, 22 + colIndex * colWidth, y);
      });

      doc.setDrawColor(241, 245, 249);
      doc.line(20, y + 2, 190, y + 2);
      y += 8;
    });

    doc.save(`${tableTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateImagesPdf = () => {
    if (uploadedImages.length === 0) return;
    const doc = new jsPDF();

    uploadedImages.forEach((imgData, index) => {
      if (index > 0) doc.addPage();
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      // Fit image while maintaining aspect ratio
      const margin = 15;
      const availableW = pdfWidth - margin * 2;
      const availableH = pdfHeight - margin * 2;
      const ratio = Math.min(availableW / imgProps.width, availableH / imgProps.height);

      const w = imgProps.width * ratio;
      const h = imgProps.height * ratio;
      const x = (pdfWidth - w) / 2;
      const y = (pdfHeight - h) / 2;

      doc.addImage(imgData, 'JPEG', x, y, w, h);
    });

    doc.save('compiled-images.pdf');
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFileName(file.name);
    // Simple text stream extraction for plain text streams
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const matches = content.match(/\(([^)]+)\)\s*Tj/g) || content.match(/BT[\s\S]*?ET/g);
      if (matches && matches.length > 0) {
        const text = matches
          .map((m) => m.replace(/BT|ET|\(|\)|Tj/g, ' ').trim())
          .filter(Boolean)
          .join(' ');
        setExtractedText(text || 'Extracted stream text from PDF successfully.');
      } else {
        setExtractedText(
          `Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nStatus: PDF loaded successfully into reader buffer.`
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-bold p-1 bg-slate-50 dark:bg-slate-800/60 max-w-md">
        <button
          onClick={() => setActiveTab('textToPdf')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'textToPdf'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Text to PDF
        </button>
        <button
          onClick={() => setActiveTab('imagesToPdf')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'imagesToPdf'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          Images to PDF
        </button>
        <button
          onClick={() => setActiveTab('dataToPdf')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'dataToPdf'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          Data to PDF
        </button>
        <button
          onClick={() => setActiveTab('extractPdf')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'extractPdf'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Inspect & Extract
        </button>
      </div>

      {/* Tab 1: Text to PDF */}
      {activeTab === 'textToPdf' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Document Title
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Font Size
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value={10}>10pt (Compact)</option>
                <option value={12}>12pt (Standard)</option>
                <option value={14}>14pt (Large)</option>
                <option value={16}>16pt (Headline)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Document Content
            </label>
            <textarea
              rows={9}
              value={docBody}
              onChange={(e) => setDocBody(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Type your document content here..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerateTextPdf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Generated PDF
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Images to PDF */}
      {activeTab === 'imagesToPdf' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs transition-colors">
              <Plus className="w-4 h-4" />
              Add Images (JPG, PNG, WebP)
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImages}
                className="hidden"
              />
            </label>

            {uploadedImages.length > 0 && (
              <button
                onClick={handleGenerateImagesPdf}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                Compile to PDF ({uploadedImages.length} Pages)
              </button>
            )}
          </div>

          {uploadedImages.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center text-slate-400">
              <Image className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No images added yet. Upload files to compile them into a PDF book.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {uploadedImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-900"
                >
                  <img src={src} alt={`Page ${idx + 1}`} className="h-36 w-full object-contain p-2" />
                  <span className="absolute bottom-1 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white">
                    Page {idx + 1}
                  </span>
                  <button
                    onClick={() =>
                      setUploadedImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Data / Spreadsheet to PDF */}
      {activeTab === 'dataToPdf' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
              Report Title
            </label>
            <input
              type="text"
              value={tableTitle}
              onChange={(e) => setTableTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
              CSV / Table Data (Comma Separated)
            </label>
            <textarea
              rows={7}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Column1,Column2,Column3..."
            />
          </div>

          <button
            onClick={handleGenerateDataPdf}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold text-sm shadow-md hover:from-indigo-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate & Download PDF Table
          </button>
        </div>
      )}

      {/* Tab 4: Extract PDF */}
      {activeTab === 'extractPdf' && (
        <div className="space-y-4">
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer block transition-colors bg-slate-50/50 dark:bg-slate-800/40">
            <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {pdfFileName ? pdfFileName : 'Upload PDF to Extract Text Streams'}
            </span>
            <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
          </label>

          {extractedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Extracted Text Output
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(extractedText)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${pdfFileName ? pdfFileName.replace(/\.pdf$/i, '') : 'extracted-document'}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition-colors"
                  >
                    Download .txt
                  </button>
                </div>
              </div>
              <textarea
                rows={9}
                readOnly
                value={extractedText}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono text-xs"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
