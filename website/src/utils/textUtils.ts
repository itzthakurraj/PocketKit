export function convertCase(
  text: string,
  type:
    | 'uppercase'
    | 'lowercase'
    | 'title'
    | 'sentence'
    | 'camel'
    | 'snake'
    | 'kebab'
    | 'pascal'
    | 'alternating'
    | 'inverse'
): string {
  if (!text) return '';

  switch (type) {
    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'title':
      return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );

    case 'sentence':
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    case 'camel': {
      const words = text
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .trim()
        .split(/\s+/);
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('');
    }

    case 'pascal': {
      const words = text
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .trim()
        .split(/\s+/);
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }

    case 'snake':
      return text
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\W-]+/g, '_')
        .toLowerCase();

    case 'kebab':
      return text
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s\W_]+/g, '-')
        .toLowerCase();

    case 'alternating':
      return text
        .split('')
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join('');

    case 'inverse':
      return text
        .split('')
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join('');

    default:
      return text;
  }
}

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  topWords: { word: string; count: number }[];
}

export function computeTextStats(text: string): TextStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      topWords: [],
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  const rawWords = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const words = rawWords.length;

  const sentences = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;

  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  const readingTimeMinutes = Math.max(0.1, Number((words / 200).toFixed(1)));
  const speakingTimeMinutes = Math.max(0.1, Number((words / 130).toFixed(1)));

  // Word frequency
  const freqMap: Record<string, number> = {};
  rawWords.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 2) {
      freqMap[clean] = (freqMap[clean] || 0) + 1;
    }
  });

  const topWords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences: sentences || (characters > 0 ? 1 : 0),
    paragraphs: paragraphs || (characters > 0 ? 1 : 0),
    readingTimeMinutes,
    speakingTimeMinutes,
    topWords,
  };
}

export function textToAscii(
  text: string,
  delimiter = ' ',
  format: 'dec' | 'bin' | 'hex' = 'dec'
): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (format === 'bin') return code.toString(2).padStart(8, '0');
      if (format === 'hex') return code.toString(16).toUpperCase().padStart(2, '0');
      return code.toString(10);
    })
    .join(delimiter);
}

export function asciiToText(
  ascii: string,
  delimiter = ' ',
  format: 'dec' | 'bin' | 'hex' = 'dec'
): string {
  if (!ascii.trim()) return '';
  const tokens = delimiter
    ? ascii.trim().split(delimiter)
    : ascii.trim().split(/\s+/);

  return tokens
    .map((token) => {
      let code = NaN;
      if (format === 'bin') code = parseInt(token, 2);
      else if (format === 'hex') code = parseInt(token, 16);
      else code = parseInt(token, 10);
      return !isNaN(code) && code >= 0 ? String.fromCharCode(code) : '';
    })
    .join('');
}

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
}

export function computeSimpleDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const result: DiffLine[] = [];

  let i = 0;
  let j = 0;

  while (i < origLines.length || j < modLines.length) {
    if (i < origLines.length && j < modLines.length) {
      if (origLines[i] === modLines[j]) {
        result.push({
          type: 'unchanged',
          content: origLines[i],
          originalLineNum: i + 1,
          modifiedLineNum: j + 1,
        });
        i++;
        j++;
      } else {
        // Look ahead
        const nextInMod = modLines.indexOf(origLines[i], j);
        const nextInOrig = origLines.indexOf(modLines[j], i);

        if (nextInMod !== -1 && (nextInOrig === -1 || nextInMod - j <= nextInOrig - i)) {
          // Lines in modified were added
          while (j < nextInMod) {
            result.push({
              type: 'added',
              content: modLines[j],
              modifiedLineNum: j + 1,
            });
            j++;
          }
        } else if (nextInOrig !== -1) {
          // Lines in original were removed
          while (i < nextInOrig) {
            result.push({
              type: 'removed',
              content: origLines[i],
              originalLineNum: i + 1,
            });
            i++;
          }
        } else {
          result.push({
            type: 'removed',
            content: origLines[i],
            originalLineNum: i + 1,
          });
          result.push({
            type: 'added',
            content: modLines[j],
            modifiedLineNum: j + 1,
          });
          i++;
          j++;
        }
      }
    } else if (i < origLines.length) {
      result.push({
        type: 'removed',
        content: origLines[i],
        originalLineNum: i + 1,
      });
      i++;
    } else if (j < modLines.length) {
      result.push({
        type: 'added',
        content: modLines[j],
        modifiedLineNum: j + 1,
      });
      j++;
    }
  }

  return result;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export function generateLoremIpsum(
  type: 'paragraphs' | 'sentences' | 'words',
  count: number,
  htmlWrapper = false
): string {
  const getWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const getSentence = () => {
    const length = 8 + Math.floor(Math.random() * 8);
    const words = Array.from({ length }, getWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  };

  const getParagraph = () => {
    const sentenceCount = 4 + Math.floor(Math.random() * 4);
    return Array.from({ length: sentenceCount }, getSentence).join(' ');
  };

  if (type === 'words') {
    const words = Array.from({ length: count }, getWord).join(' ');
    return htmlWrapper ? `<p>${words}</p>` : words;
  }

  if (type === 'sentences') {
    const sentences = Array.from({ length: count }, getSentence).join(' ');
    return htmlWrapper ? `<p>${sentences}</p>` : sentences;
  }

  const paras = Array.from({ length: count }, getParagraph);
  if (htmlWrapper) {
    return paras.map((p) => `<p>${p}</p>`).join('\n\n');
  }
  return paras.join('\n\n');
}
