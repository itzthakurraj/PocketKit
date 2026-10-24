import { ToolItem } from '../types';

export interface GeneratedSEO {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: string;
  jsonLd: Record<string, unknown>[];
}

const DEFAULT_TITLE = 'PocketKit - MultiTools Digital Workshop | 100+ Free Online Tools';
const DEFAULT_DESC =
  'PocketKit is your pocket-sized digital workshop: 100+ fast, private client-side online tools for PDF creation, text editing, code formatting, image processing, audio generation, and calculators.';

export function getToolSEO(tool: ToolItem): GeneratedSEO {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pocketkit.app';
  const canonicalUrl = `${origin}/tools/${tool.id}`;

  const title =
    tool.seoTitle ||
    `${tool.name} Online - Free, Fast & Private Tool | PocketKit`;

  const description =
    tool.seoDescription ||
    (tool.description.length >= 120 && tool.description.length <= 160
      ? tool.description
      : `${tool.description} Free, client-side, and no installation required. Export results in one click.`);

  const howToSteps = tool.howToSteps || [
    `Open the ${tool.name} workspace on PocketKit in your browser.`,
    'Enter, paste, or upload your input data using the interactive controls.',
    'Preview the real-time result and download or copy the output instantly.',
  ];

  const faqs = tool.faqs || [
    {
      question: `Is the ${tool.name} completely free to use?`,
      answer: `Yes, ${tool.name} on PocketKit is 100% free with unlimited usage, zero subscriptions, and no account needed.`,
    },
    {
      question: `Are my files and data private when using ${tool.name}?`,
      answer: `All computations and transformations occur locally in your browser. Your data is never uploaded to remote servers.`,
    },
    {
      question: `Does ${tool.name} work on mobile phones and tablets?`,
      answer: `Yes, PocketKit is fully responsive and optimized for touch devices, Android, iOS, and desktop browsers.`,
    },
  ];

  // Schema.org SoftwareApplication structured data
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    headline: tool.seoTitle || `${tool.name} Online`,
    alternateName: `${tool.name} Online`,
    description: description,
    url: canonicalUrl,
    applicationCategory: mapCategoryToSchema(tool.category),
    operatingSystem: 'All (Web Browser, Windows, macOS, Linux, iOS, Android)',
    softwareVersion: '2.1',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.keywords.join(', '),
  };

  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'PocketKit Home',
        item: `${origin}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: formatCategoryName(tool.category),
        item: `${origin}/#category:${tool.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: canonicalUrl,
      },
    ],
  };

  // Schema.org HowTo
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.name}`,
    description: `Step-by-step tutorial on how to use ${tool.name} online for free.`,
    step: howToSteps.map((stepText, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: `Step ${idx + 1}`,
      text: stepText,
    })),
  };

  // Schema.org FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return {
    title,
    description,
    canonicalUrl,
    ogType: 'website',
    jsonLd: [softwareSchema, breadcrumbSchema, howToSchema, faqSchema],
  };
}

function mapCategoryToSchema(category: string): string {
  switch (category) {
    case 'pdf':
    case 'text':
      return 'BusinessApplication';
    case 'development':
      return 'DeveloperApplication';
    case 'image':
      return 'MultimediaApplication';
    case 'audio':
      return 'AudioApplication';
    case 'calculator':
      return 'UtilityApplication';
    case 'encryption':
      return 'SecurityApplication';
    default:
      return 'UtilityApplication';
  }
}

function formatCategoryName(cat: string): string {
  switch (cat) {
    case 'pdf':
      return 'PDF Tools';
    case 'text':
      return 'Text & Docs';
    case 'development':
      return 'Code & Dev';
    case 'image':
      return 'Image & Media';
    case 'audio':
      return 'Audio & Sound';
    case 'calculator':
      return 'Calculators';
    case 'encryption':
      return 'Security & Crypto';
    case 'web':
      return 'Web & Colors';
    default:
      return 'Tools';
  }
}

/**
 * Dynamically synchronizes document <title>, meta tags, canonical link, and JSON-LD scripts.
 */
export function syncDocumentSEO(tool?: ToolItem | null, activeView: string = 'home', categoryName?: string): void {
  if (typeof document === 'undefined') return;

  const origin = window.location.origin;

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESC;
  let canonicalUrl = `${origin}/`;
  let schemas: Record<string, unknown>[] = [];

  if (tool) {
    const seo = getToolSEO(tool);
    title = seo.title;
    description = seo.description;
    canonicalUrl = seo.canonicalUrl;
    schemas = seo.jsonLd;
  } else if (activeView === 'category' && categoryName) {
    title = `${formatCategoryName(categoryName)} Online - Free Tools Suite | PocketKit`;
    description = `Explore high-performance ${formatCategoryName(categoryName).toLowerCase()} online. 100% private, client-side, zero downloads required.`;
    canonicalUrl = `${origin}/#category:${categoryName}`;
  } else if (activeView === 'features') {
    title = 'Features & Architecture - Client-Side Digital Workshop | PocketKit';
    description = 'Discover why PocketKit provides the best free client-side tools worldwide: local offline processing, zero server storage, and rapid conversions.';
    canonicalUrl = `${origin}/features.html`;
  } else if (activeView === 'blog') {
    title = 'Engineering Blog & Guides - Digital Tool Mastery | PocketKit';
    description = 'Read technical tutorials on PDF generation, cryptography, client-side image compression, and developer productivity.';
    canonicalUrl = `${origin}/blog.html`;
  } else if (activeView === 'help') {
    title = 'Help Center & Documentation - PocketKit Digital Workshop';
    description = 'Comprehensive guide and FAQs on using all 70+ PocketKit tools offline, on Android, and in modern desktop browsers.';
    canonicalUrl = `${origin}/help.html`;
  } else if (activeView === 'install') {
    title = 'Install PocketKit - PWA & Android APK Digital Workshop';
    description = 'Install PocketKit as a Progressive Web App or download the Android APK for instant offline access to 70+ utilities.';
    canonicalUrl = `${origin}/public/PocketKit-release.apk`;
  } else {
    // Home view Schema
    schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'PocketKit',
        url: origin,
        description: DEFAULT_DESC,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ];
  }

  // 1. Update Title
  document.title = title;

  // 2. Helper to set meta tags
  const setMeta = (selector: string, attr: 'name' | 'property', val: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, val);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Update Standard & Social Meta
  setMeta('meta[name="description"]', 'name', 'description', description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMeta('meta[property="og:type"]', 'property', 'og:type', tool ? 'article' : 'website');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

  // 4. Update Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  // 5. Update Schema.org JSON-LD scripts
  const existingScripts = document.querySelectorAll('script[data-pocketkit-seo="true"]');
  existingScripts.forEach((s) => s.remove());

  schemas.forEach((schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-pocketkit-seo', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}
