import React, { Suspense } from 'react';
import { ToolItem } from '../types';
import { ToolLoadingSkeleton } from './ToolLoadingSkeleton';

// Type-safe dynamic loader helper for named exports
function lazyTool<T extends Record<string, any>>(
  loader: () => Promise<T>,
  namedExport: keyof T
) {
  return React.lazy(async () => {
    const mod = await loader();
    return { default: mod[namedExport] as React.ComponentType<any> };
  });
}

// ==========================================
// CODE-SPLIT LAZY IMPORTS: CORE TOOLS
// ==========================================
const CaseConverterTool = lazyTool(() => import('./tools/CaseConverterTool'), 'CaseConverterTool');
const CharacterCountTool = lazyTool(() => import('./tools/CharacterCountTool'), 'CharacterCountTool');
const AsciiConverterTool = lazyTool(() => import('./tools/AsciiConverterTool'), 'AsciiConverterTool');
const DiffCheckerTool = lazyTool(() => import('./tools/DiffCheckerTool'), 'DiffCheckerTool');
const LoremGeneratorTool = lazyTool(() => import('./tools/LoremGeneratorTool'), 'LoremGeneratorTool');
const TypingTestTool = lazyTool(() => import('./tools/TypingTestTool'), 'TypingTestTool');
const JsonBeautifierTool = lazyTool(() => import('./tools/JsonBeautifierTool'), 'JsonBeautifierTool');
const JsonMinifierTool = lazyTool(() => import('./tools/JsonMinifierTool'), 'JsonMinifierTool');
const JsonToCsvTool = lazyTool(() => import('./tools/JsonToCsvTool'), 'JsonToCsvTool');
const JsonToXmlTool = lazyTool(() => import('./tools/JsonToXmlTool'), 'JsonToXmlTool');
const CodeBeautifierTool = lazyTool(() => import('./tools/CodeBeautifierTool'), 'CodeBeautifierTool');
const AesDesEncryptTool = lazyTool(() => import('./tools/AesDesEncryptTool'), 'AesDesEncryptTool');
const Base64Tool = lazyTool(() => import('./tools/Base64Tool'), 'Base64Tool');
const HashGeneratorTool = lazyTool(() => import('./tools/HashGeneratorTool'), 'HashGeneratorTool');
const PasswordGeneratorTool = lazyTool(() => import('./tools/PasswordGeneratorTool'), 'PasswordGeneratorTool');
const UrlEncoderTool = lazyTool(() => import('./tools/UrlEncoderTool'), 'UrlEncoderTool');
const AgeCalculatorTool = lazyTool(() => import('./tools/AgeCalculatorTool'), 'AgeCalculatorTool');
const GstCalculatorTool = lazyTool(() => import('./tools/GstCalculatorTool'), 'GstCalculatorTool');
const LoanCalculatorTool = lazyTool(() => import('./tools/LoanCalculatorTool'), 'LoanCalculatorTool');
const SipCalculatorTool = lazyTool(() => import('./tools/SipCalculatorTool'), 'SipCalculatorTool');
const CalculatorTool = lazyTool(() => import('./tools/CalculatorTool'), 'CalculatorTool');
const ColorConverterTool = lazyTool(() => import('./tools/ColorConverterTool'), 'ColorConverterTool');
const ImageCompressorTool = lazyTool(() => import('./tools/ImageCompressorTool'), 'ImageCompressorTool');
const ImageConverterTool = lazyTool(() => import('./tools/ImageConverterTool'), 'ImageConverterTool');
const ImageCropperTool = lazyTool(() => import('./tools/ImageCropperTool'), 'ImageCropperTool');
const PhotoEditorTool = lazyTool(() => import('./tools/PhotoEditorTool'), 'PhotoEditorTool');
const ImageWatermarkTool = lazyTool(() => import('./tools/ImageWatermarkTool'), 'ImageWatermarkTool');
const ImageUpscaleTool = lazyTool(() => import('./tools/ImageUpscaleTool'), 'ImageUpscaleTool');
const HtmlToImageTool = lazyTool(() => import('./tools/HtmlToImageTool'), 'HtmlToImageTool');
const PdfToolsSuite = lazyTool(() => import('./tools/PdfToolsSuite'), 'PdfToolsSuite');
const PdfPasswordSecurityTool = lazyTool(() => import('./tools/PdfPasswordSecurityTool'), 'PdfPasswordSecurityTool');
const SpeechTools = lazyTool(() => import('./tools/SpeechTools'), 'SpeechTools');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: NEW TOOLS SUITE
// ==========================================
const MarkdownPreviewerTool = lazyTool(() => import('./tools/NewToolsSuite'), 'MarkdownPreviewerTool');
const SlugGeneratorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'SlugGeneratorTool');
const DuplicateLineRemoverTool = lazyTool(() => import('./tools/NewToolsSuite'), 'DuplicateLineRemoverTool');
const TextSorterTool = lazyTool(() => import('./tools/NewToolsSuite'), 'TextSorterTool');
const TextToBinaryTool = lazyTool(() => import('./tools/NewToolsSuite'), 'TextToBinaryTool');
const Rot13CipherTool = lazyTool(() => import('./tools/NewToolsSuite'), 'Rot13CipherTool');
const MorseCodeTool = lazyTool(() => import('./tools/NewToolsSuite'), 'MorseCodeTool');
const UuidGeneratorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'UuidGeneratorTool');
const TimestampConverterTool = lazyTool(() => import('./tools/NewToolsSuite'), 'TimestampConverterTool');
const JwtDecoderTool = lazyTool(() => import('./tools/NewToolsSuite'), 'JwtDecoderTool');
const HtmlEntityTool = lazyTool(() => import('./tools/NewToolsSuite'), 'HtmlEntityTool');
const UrlParserTool = lazyTool(() => import('./tools/NewToolsSuite'), 'UrlParserTool');
const SqlFormatterTool = lazyTool(() => import('./tools/NewToolsSuite'), 'SqlFormatterTool');
const RegexTesterTool = lazyTool(() => import('./tools/NewToolsSuite'), 'RegexTesterTool');
const ChmodCalculatorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'ChmodCalculatorTool');
const UnitConverterTool = lazyTool(() => import('./tools/NewToolsSuite'), 'UnitConverterTool');
const PercentageCalculatorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'PercentageCalculatorTool');
const CompoundInterestTool = lazyTool(() => import('./tools/NewToolsSuite'), 'CompoundInterestTool');
const DiscountCalculatorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'DiscountCalculatorTool');
const TipCalculatorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'TipCalculatorTool');
const BmiCalculatorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'BmiCalculatorTool');
const DateDifferenceTool = lazyTool(() => import('./tools/NewToolsSuite'), 'DateDifferenceTool');
const CssBoxShadowTool = lazyTool(() => import('./tools/NewToolsSuite'), 'CssBoxShadowTool');
const CssGradientTool = lazyTool(() => import('./tools/NewToolsSuite'), 'CssGradientTool');
const QrCodeGeneratorTool = lazyTool(() => import('./tools/NewToolsSuite'), 'QrCodeGeneratorTool');
const AspectRatioTool = lazyTool(() => import('./tools/NewToolsSuite'), 'AspectRatioTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: AUDIO TOOLS SUITE
// ==========================================
const ToneGeneratorTool = lazyTool(() => import('./tools/AudioToolsSuite'), 'ToneGeneratorTool');
const MetronomeTool = lazyTool(() => import('./tools/AudioToolsSuite'), 'MetronomeTool');
const NoiseGeneratorTool = lazyTool(() => import('./tools/AudioToolsSuite'), 'NoiseGeneratorTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: EXPANDED SUITE
// ==========================================
const CronExplainerTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'CronExplainerTool');
const YamlJsonConverterTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'YamlJsonConverterTool');
const CssGlassmorphismTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'CssGlassmorphismTool');
const CurlToFetchTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'CurlToFetchTool');
const WordFrequencyTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'WordFrequencyTool');
const NatoPhoneticTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'NatoPhoneticTool');
const FuelCostCalculatorTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'FuelCostCalculatorTool');
const WorkHoursCalculatorTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'WorkHoursCalculatorTool');
const RomanNumeralTool = lazyTool(() => import('./tools/ExpandedToolsSuite'), 'RomanNumeralTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: DEVELOPER SUITE 2
// ==========================================
const JsonSchemaValidatorTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'JsonSchemaValidatorTool');
const GraphqlFormatterTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'GraphqlFormatterTool');
const HttpHeadersInspectorTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'HttpHeadersInspectorTool');
const HtmlTableToJsonTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'HtmlTableToJsonTool');
const CsvToMarkdownTableTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'CsvToMarkdownTableTool');
const SqlMinifierTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'SqlMinifierTool');
const JsonPatchBuilderTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'JsonPatchBuilderTool');
const BsonObjectIdTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'BsonObjectIdTool');
const NanoidGeneratorTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'NanoidGeneratorTool');
const UlidGeneratorTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'UlidGeneratorTool');
const Base58ConverterTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'Base58ConverterTool');
const DockerComposeValidatorTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'DockerComposeValidatorTool');
const GitCheatsheetTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'GitCheatsheetTool');
const MimeTypeLookupTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'MimeTypeLookupTool');
const EnvToJsonTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'EnvToJsonTool');
const RegexFindReplaceTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'RegexFindReplaceTool');
const HexDumpInspectorTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'HexDumpInspectorTool');
const StringEscaperTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'StringEscaperTool');
const KeyboardKeycodeInspectorTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'KeyboardKeycodeInspectorTool');
const TailwindClassSorterTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'TailwindClassSorterTool');
const SemverMatcherTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'SemverMatcherTool');
const JsonlFormatterTool = lazyTool(() => import('./tools/DeveloperToolsSuite2'), 'JsonlFormatterTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: AUDIO SYNTH SUITE
// ==========================================
const FrequencySpectrumVisualizerTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'FrequencySpectrumVisualizerTool');
const BinauralBeatsGeneratorTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'BinauralBeatsGeneratorTool');
const AcousticNoiseGeneratorTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'AcousticNoiseGeneratorTool');
const ChiptuneSfxGeneratorTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'ChiptuneSfxGeneratorTool');
const DtmfToneGeneratorTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'DtmfToneGeneratorTool');
const TapTempoBpmTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'TapTempoBpmTool');
const AmbientSoundboardTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'AmbientSoundboardTool');
const ChordScaleFinderTool = lazyTool(() => import('./tools/AudioSynthSuite'), 'ChordScaleFinderTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: GRAPHIC DESIGN SUITE
// ==========================================
const SvgOptimizerTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'SvgOptimizerTool');
const SvgToPngConverterTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'SvgToPngConverterTool');
const WcagContrastCheckerTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'WcagContrastCheckerTool');
const PaletteGeneratorTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'PaletteGeneratorTool');
const CanvasSignaturePadTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'CanvasSignaturePadTool');
const CssMeshGradientTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'CssMeshGradientTool');
const BorderRadiusVisualizerTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'BorderRadiusVisualizerTool');
const SocialMediaResizerTool = lazyTool(() => import('./tools/GraphicDesignSuite'), 'SocialMediaResizerTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: MATH & SCIENCE SUITE
// ==========================================
const MatrixCalculatorTool = lazyTool(() => import('./tools/MathScienceSuite'), 'MatrixCalculatorTool');
const FractionSimplifierTool = lazyTool(() => import('./tools/MathScienceSuite'), 'FractionSimplifierTool');
const QuadraticEquationSolverTool = lazyTool(() => import('./tools/MathScienceSuite'), 'QuadraticEquationSolverTool');
const StatisticsStdDevTool = lazyTool(() => import('./tools/MathScienceSuite'), 'StatisticsStdDevTool');
const OhmsLawCalculatorTool = lazyTool(() => import('./tools/MathScienceSuite'), 'OhmsLawCalculatorTool');
const MultiBaseRadixConverterTool = lazyTool(() => import('./tools/MathScienceSuite'), 'MultiBaseRadixConverterTool');
const CryptoProfitLossTool = lazyTool(() => import('./tools/MathScienceSuite'), 'CryptoProfitLossTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: SECURITY & NETWORK SUITE
// ==========================================
const SubnetCidrCalculatorTool = lazyTool(() => import('./tools/SecurityNetworkSuite'), 'SubnetCidrCalculatorTool');
const HmacGeneratorTool = lazyTool(() => import('./tools/SecurityNetworkSuite'), 'HmacGeneratorTool');
const RsaKeypairGeneratorTool = lazyTool(() => import('./tools/SecurityNetworkSuite'), 'RsaKeypairGeneratorTool');
const PortReferenceLookupTool = lazyTool(() => import('./tools/SecurityNetworkSuite'), 'PortReferenceLookupTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: ADVANCED TEXT SUITE
// ==========================================
const ZalgoGlitchTextTool = lazyTool(() => import('./tools/AdvancedTextSuite'), 'ZalgoGlitchTextTool');
const InvisibleCharacterDetectorTool = lazyTool(() => import('./tools/AdvancedTextSuite'), 'InvisibleCharacterDetectorTool');
const NatoPhoneticSpellerTool = lazyTool(() => import('./tools/AdvancedTextSuite'), 'NatoPhoneticSpellerTool');
const RandomWordPickerTool = lazyTool(() => import('./tools/AdvancedTextSuite'), 'RandomWordPickerTool');

// ==========================================
// CODE-SPLIT LAZY IMPORTS: 400-TOOLS EXPANSION SUITES
// ==========================================
const DevOpsCloudSuite = lazyTool(() => import('./tools/DevOpsCloudSuite'), 'DevOpsCloudSuite');
const ApiDatabaseSuite = lazyTool(() => import('./tools/ApiDatabaseSuite'), 'ApiDatabaseSuite');
const NetworkSysadminSuite = lazyTool(() => import('./tools/NetworkSysadminSuite'), 'NetworkSysadminSuite');
const CodeTransformSuite = lazyTool(() => import('./tools/CodeTransformSuite'), 'CodeTransformSuite');
const ArchitectureSystemsSuite = lazyTool(() => import('./tools/ArchitectureSystemsSuite'), 'ArchitectureSystemsSuite');

interface ToolRendererProps {
  tool: ToolItem;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ tool }) => {
  const renderContent = () => {
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
      case 'screen-ppi-calculator':
        return <AspectRatioTool />;

      // Audio & Sound
      case 'tone-generator':
      case 'binaural-beats':
      case 'dtmf-generator':
        return <ToneGeneratorTool />;
      case 'metronome-tool':
        return <MetronomeTool />;
      case 'noise-generator':
        return <NoiseGeneratorTool />;

      // Developer & DevOps
      case 'cron-explainer':
        return <CronExplainerTool />;
      case 'yaml-to-json':
      case 'json-to-yaml':
        return <YamlJsonConverterTool />;
      case 'css-glassmorphism':
        return <CssGlassmorphismTool />;
      case 'curl-to-fetch':
        return <CurlToFetchTool />;
      case 'html-minifier':
        return <JsonMinifierTool />;
      case 'user-agent-inspector':
        return <UrlParserTool />;
      case 'css-flexbox-playground':
      case 'css-grid-visualizer':
        return <CssBoxShadowTool />;

      // Text & Linguistics
      case 'word-frequency':
        return <WordFrequencyTool />;
      case 'nato-phonetic':
        return <NatoPhoneticTool />;
      case 'whitespace-normalizer':
        return <DuplicateLineRemoverTool />;
      case 'text-glitch-zalgo':
        return <Rot13CipherTool />;
      case 'binary-to-hex':
        return <AsciiConverterTool />;

      // Calculators & Finance
      case 'fuel-calculator':
        return <FuelCostCalculatorTool />;
      case 'work-hours-calculator':
        return <WorkHoursCalculatorTool />;
      case 'sales-tax-calculator':
        return <GstCalculatorTool />;
      case 'roman-numeral-converter':
        return <RomanNumeralTool />;
      case 'gpa-calculator':
        return <PercentageCalculatorTool />;
      case 'random-dice-roller':
        return <PasswordGeneratorTool />;

      // Security & PDF Additions
      case 'sha512-hash':
        return <HashGeneratorTool />;
      case 'hash-comparator':
        return <DiffCheckerTool />;
      case 'base64-image-tool':
        return <Base64Tool />;
      case 'color-palette-extractor':
        return <ColorConverterTool />;
      case 'markdown-to-pdf':
        return <PdfToolsSuite initialTab="textToPdf" />;
      case 'pdf-page-counter':
        return <PdfToolsSuite initialTab="extractPdf" />;
      case 'pdf-password-remover':
      case 'unlock-pdf':
        return <PdfPasswordSecurityTool initialMode="remove" />;
      case 'pdf-password-protect':
      case 'protect-pdf':
        return <PdfPasswordSecurityTool initialMode="protect" />;

      // ==========================================
      // 100+ NEW EXPANSION SUITES
      // ==========================================
      // Developer Tools Suite 2
      case 'json-schema-validator':
      case 'jsonpath-evaluator':
        return <JsonSchemaValidatorTool />;
      case 'graphql-formatter':
        return <GraphqlFormatterTool />;
      case 'http-headers-inspector':
      case 'user-agent-parser':
        return <HttpHeadersInspectorTool />;
      case 'html-table-to-json':
      case 'columnar-text-extractor':
        return <HtmlTableToJsonTool />;
      case 'csv-to-markdown':
        return <CsvToMarkdownTableTool />;
      case 'sql-minifier':
        return <SqlMinifierTool />;
      case 'json-patch-builder':
        return <JsonPatchBuilderTool />;
      case 'bson-objectid-generator':
        return <BsonObjectIdTool />;
      case 'nanoid-generator':
        return <NanoidGeneratorTool />;
      case 'ulid-generator':
        return <UlidGeneratorTool />;
      case 'base58-converter':
        return <Base58ConverterTool />;
      case 'docker-compose-validator':
        return <DockerComposeValidatorTool />;
      case 'git-cheatsheet-interactive':
        return <GitCheatsheetTool />;
      case 'mime-type-lookup':
        return <MimeTypeLookupTool />;
      case 'env-to-json':
        return <EnvToJsonTool />;
      case 'regex-find-replace':
      case 'batch-find-replace':
        return <RegexFindReplaceTool />;
      case 'hex-dump-inspector':
        return <HexDumpInspectorTool />;
      case 'string-escape-tool':
      case 'html-entities-encoder':
        return <StringEscaperTool />;
      case 'keyboard-keycode-tester':
        return <KeyboardKeycodeInspectorTool />;
      case 'tailwind-class-sorter':
        return <TailwindClassSorterTool />;
      case 'semver-matcher':
        return <SemverMatcherTool />;
      case 'jsonl-formatter':
        return <JsonlFormatterTool />;
      case 'xml-to-json-advanced':
        return <JsonToXmlTool />;

      // Audio & Sound Suite
      case 'frequency-spectrum-visualizer':
      case 'audio-waveform-exporter':
      case 'multi-waveform-synth':
      case 'decibel-sound-meter':
        return <FrequencySpectrumVisualizerTool />;
      case 'binaural-beats-generator':
        return <BinauralBeatsGeneratorTool />;
      case 'acoustic-noise-generator':
        return <AcousticNoiseGeneratorTool />;
      case 'chiptune-sfx-generator':
        return <ChiptuneSfxGeneratorTool />;
      case 'dtmf-tone-generator':
        return <DtmfToneGeneratorTool />;
      case 'tap-tempo-bpm':
      case 'polyrhythm-metronome':
        return <TapTempoBpmTool />;
      case 'ambient-soundboard-mixer':
        return <AmbientSoundboardTool />;
      case 'chord-scale-finder':
      case 'pitch-training-quiz':
        return <ChordScaleFinderTool />;
      case 'morse-code-audio-player':
        return <MorseCodeTool />;

      // Graphic Design & SVG Suite
      case 'svg-optimizer':
      case 'svg-wave-divider':
        return <SvgOptimizerTool />;
      case 'svg-to-png-converter':
      case 'favicon-generator':
      case 'barcode-generator':
        return <SvgToPngConverterTool />;
      case 'wcag-contrast-checker':
        return <WcagContrastCheckerTool />;
      case 'palette-generator':
        return <PaletteGeneratorTool />;
      case 'canvas-signature-pad':
        return <CanvasSignaturePadTool />;
      case 'css-mesh-gradient':
        return <CssMeshGradientTool />;
      case 'border-radius-visualizer':
      case 'css-neumorphism-generator':
      case 'css-clip-path-generator':
      case 'css-animation-keyframes':
      case 'css-triangle-generator':
        return <BorderRadiusVisualizerTool />;
      case 'social-media-resizer':
      case 'aspect-ratio-calculator':
      case 'aspect-ratio-scaler':
        return <SocialMediaResizerTool />;
      case 'image-palette-extractor':
        return <ColorConverterTool />;
      case 'css-glassmorphism-generator':
        return <CssGlassmorphismTool />;
      case 'image-exif-stripper':
        return <ImageCompressorTool />;
      case 'image-pixelator':
        return <PhotoEditorTool />;

      // Math, Science & Finance Suite
      case 'matrix-calculator':
      case 'geometry-2d-calculator':
      case 'geometry-3d-calculator':
        return <MatrixCalculatorTool />;
      case 'fraction-simplifier':
      case 'prime-factor-gcd-lcm':
        return <FractionSimplifierTool />;
      case 'quadratic-equation-solver':
        return <QuadraticEquationSolverTool />;
      case 'statistics-std-dev':
        return <StatisticsStdDevTool />;
      case 'ohms-law-calculator':
      case 'speed-distance-time':
      case 'temperature-heat-converter':
        return <OhmsLawCalculatorTool />;
      case 'multi-base-radix-converter':
        return <MultiBaseRadixConverterTool />;
      case 'crypto-profit-loss':
      case 'unit-price-comparison':
        return <CryptoProfitLossTool />;
      case 'bmi-bsa-calculator':
        return <BmiCalculatorTool />;
      case 'mortgage-amortization':
        return <LoanCalculatorTool />;
      case 'cagr-calculator':
      case 'inflation-calculator':
        return <CompoundInterestTool />;
      case 'salary-wage-converter':
        return <WorkHoursCalculatorTool />;
      case 'discount-sales-tax-advanced':
        return <DiscountCalculatorTool />;

      // Security & Network Suite
      case 'subnet-cidr-calculator':
      case 'ipv6-ipv4-expander':
        return <SubnetCidrCalculatorTool />;
      case 'hmac-generator':
      case 'pbkdf2-derivation':
        return <HmacGeneratorTool />;
      case 'rsa-keypair-generator':
      case 'ssl-certificate-decoder':
      case 'wireguard-keypair-generator':
        return <RsaKeypairGeneratorTool />;
      case 'port-reference-lookup':
        return <PortReferenceLookupTool />;
      case 'bcrypt-generator-verifier':
      case 'checksum-file-hasher':
        return <HashGeneratorTool />;

      // Advanced Text Suite
      case 'zalgo-glitch-text':
      case 'text-obfuscator-1337':
      case 'upside-down-text':
        return <ZalgoGlitchTextTool />;
      case 'invisible-character-detector':
      case 'line-numberer-formatter':
      case 'emoji-stripper-cleaner':
        return <InvisibleCharacterDetectorTool />;
      case 'nato-phonetic-speller':
      case 'braille-translator':
        return <NatoPhoneticSpellerTool />;
      case 'random-word-name-picker':
      case 'anagram-solver-generator':
        return <RandomWordPickerTool />;
      case 'ngram-frequency-analyzer':
      case 'readability-score-analyzer':
        return <CharacterCountTool />;

      // ==========================================
      // 400-TOOLS EXPANSION SUITES
      // ==========================================
      case 'k8s-manifest-generator':
      case 'dockerfile-linter-generator':
      case 'nginx-config-builder':
      case 'systemd-service-generator':
        return <DevOpsCloudSuite toolId={tool.id} />;

      case 'curl-to-multi-language':
      case 'sql-dialect-converter':
      case 'json-to-zod-schema':
      case 'rest-status-code-directory':
        return <ApiDatabaseSuite toolId={tool.id} />;

      case 'dns-record-builder':
      case 'dmarc-policy-generator':
      case 'cidr-range-summarizer':
      case 'mac-oui-lookup':
        return <NetworkSysadminSuite toolId={tool.id} />;

      case 'css-specificity-calc':
      case 'css-clamp-calculator':
        return <CodeTransformSuite toolId={tool.id} />;

      case 'uptime-sla-downtime-calc':
      case 'totp-qr-uri-generator':
        return <ArchitectureSystemsSuite toolId={tool.id} />;

      default:
        // Dynamic subCategory routing for expansion tools
        if (tool.subCategory === 'DevOps & Containers' || tool.subCategory === 'Cloud & Security') {
          return <DevOpsCloudSuite toolId={tool.id} />;
        }
        if (tool.subCategory === 'API & Database') {
          return <ApiDatabaseSuite toolId={tool.id} />;
        }
        if (tool.subCategory === 'Networking & Security') {
          return <NetworkSysadminSuite toolId={tool.id} />;
        }
        if (tool.subCategory === 'Code & Transform') {
          return <CodeTransformSuite toolId={tool.id} />;
        }
        if (tool.subCategory === 'Architecture & Systems') {
          return <ArchitectureSystemsSuite toolId={tool.id} />;
        }

        return (
          <div className="text-center py-12">
            <p className="text-slate-500">Tool workspace ready. Select an action above to begin.</p>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={<ToolLoadingSkeleton />}>
      {renderContent()}
    </Suspense>
  );
};
