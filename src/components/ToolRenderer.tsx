import React from 'react';
import { ToolItem } from '../types';

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
import {
  MarkdownPreviewerTool,
  SlugGeneratorTool,
  DuplicateLineRemoverTool,
  TextSorterTool,
  TextToBinaryTool,
  Rot13CipherTool,
  MorseCodeTool,
  UuidGeneratorTool,
  TimestampConverterTool,
  JwtDecoderTool,
  HtmlEntityTool,
  UrlParserTool,
  SqlFormatterTool,
  RegexTesterTool,
  ChmodCalculatorTool,
  UnitConverterTool,
  PercentageCalculatorTool,
  CompoundInterestTool,
  DiscountCalculatorTool,
  TipCalculatorTool,
  BmiCalculatorTool,
  DateDifferenceTool,
  CssBoxShadowTool,
  CssGradientTool,
  QrCodeGeneratorTool,
  AspectRatioTool,
} from './tools/NewToolsSuite';

interface ToolRendererProps {
  tool: ToolItem;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ tool }) => {
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

    // Extra High-Value Tools
    case 'markdown-previewer':
      return <MarkdownPreviewerTool />;
    case 'slug-generator':
      return <SlugGeneratorTool />;
    case 'duplicate-line-remover':
      return <DuplicateLineRemoverTool />;
    case 'text-sorter':
      return <TextSorterTool />;
    case 'text-to-binary':
      return <TextToBinaryTool />;
    case 'rot13-cipher':
      return <Rot13CipherTool />;
    case 'morse-code':
      return <MorseCodeTool />;
    case 'uuid-generator':
      return <UuidGeneratorTool />;
    case 'timestamp-converter':
      return <TimestampConverterTool />;
    case 'jwt-decoder':
      return <JwtDecoderTool />;
    case 'html-entities':
      return <HtmlEntityTool />;
    case 'url-parser':
      return <UrlParserTool />;
    case 'sql-formatter':
      return <SqlFormatterTool />;
    case 'regex-tester':
      return <RegexTesterTool />;
    case 'chmod-calculator':
      return <ChmodCalculatorTool />;
    case 'unit-converter':
      return <UnitConverterTool />;
    case 'percentage-calculator':
      return <PercentageCalculatorTool />;
    case 'compound-interest':
      return <CompoundInterestTool />;
    case 'discount-calculator':
      return <DiscountCalculatorTool />;
    case 'tip-calculator':
      return <TipCalculatorTool />;
    case 'bmi-calculator':
      return <BmiCalculatorTool />;
    case 'date-difference':
      return <DateDifferenceTool />;
    case 'box-shadow':
      return <CssBoxShadowTool />;
    case 'gradient-generator':
      return <CssGradientTool />;
    case 'qr-code-generator':
      return <QrCodeGeneratorTool />;
    case 'aspect-ratio':
      return <AspectRatioTool />;

    default:
      return (
        <div className="text-center py-12">
          <p className="text-slate-500">Tool workspace ready. Select an action above to begin.</p>
        </div>
      );
  }
};
