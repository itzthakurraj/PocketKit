export type ToolCategory =
  | 'text'
  | 'development'
  | 'encryption'
  | 'calculator'
  | 'image'
  | 'pdf'
  | 'web';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  tags: string[];
  originalFile?: string;
  badge?: string;
  isPopular?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  howToSteps?: string[];
  faqs?: { question: string; answer: string }[];
  relatedToolIds?: string[];
}

export type ActiveView =
  | 'home'
  | 'all-tools'
  | 'category'
  | 'tool'
  | 'features'
  | 'blog'
  | 'help'
  | 'install';

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  content: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}
