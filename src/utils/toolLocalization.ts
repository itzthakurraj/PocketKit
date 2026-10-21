import { ToolItem } from '../types';
import { Language } from '../i18n/translations';
import { getLocalizedToolContent, FEATURED_SUITE_TRANSLATIONS } from '../i18n/toolTranslations';

export interface LocalizedTool extends ToolItem {
  localizedName: string;
  localizedDescription: string;
  localizedCategory: string;
}

/**
 * Returns a tool object with localized name, description, and category.
 */
export function getLocalizedTool(
  tool: ToolItem,
  language: Language,
  t: (key: string, fallback?: string) => string
): LocalizedTool {
  const content = getLocalizedToolContent(tool.id, tool.name, tool.description, language);
  const localizedCategory = t(`cat.${tool.category}`, tool.category);

  return {
    ...tool,
    localizedName: content.name,
    localizedDescription: content.description,
    localizedCategory,
  };
}

/**
 * Returns localized Featured Suite information based on suite id and language.
 */
export function getLocalizedSuite(
  id: string,
  defaultTitle: string,
  defaultDesc: string,
  defaultLinkText: string,
  language: Language
): { title: string; desc: string; linkText: string } {
  const langSuites = FEATURED_SUITE_TRANSLATIONS[language];
  if (langSuites && langSuites[id]) {
    return langSuites[id];
  }
  const enSuites = FEATURED_SUITE_TRANSLATIONS.en;
  if (enSuites && enSuites[id]) {
    return enSuites[id];
  }
  return {
    title: defaultTitle,
    desc: defaultDesc,
    linkText: defaultLinkText,
  };
}
