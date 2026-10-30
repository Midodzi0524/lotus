import { Edition, Item } from '../src/types/index.ts';
import { STYLE_GUIDELINES } from '../src/config/style.ts';
import { SECTOR_KEYS } from '../src/config/sectors.ts';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  wordCounts: {
    browseEstimated: number;
    readEstimated: number;
  };
}

export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function validateEdition(edition: Edition): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check banned hype words
  const checkTextForHype = (text: string, context: string) => {
    const lower = text.toLowerCase();
    for (const banned of STYLE_GUIDELINES.bannedHypeWords) {
      if (lower.includes(banned.toLowerCase())) {
        errors.push(`Banned hype word "${banned}" found in ${context}: "${text}"`);
      }
    }
  };

  // Word budget estimators
  let browseWords = countWords(edition.todayInOneSentence);
  let readWords = countWords(edition.todayInOneSentence);

  // Validate Top Three
  if (!edition.topThree || edition.topThree.length !== 3) {
    errors.push(`Top 3 must have exactly 3 items, found ${edition.topThree?.length || 0}`);
  } else {
    edition.topThree.forEach((item, i) => {
      validateItem(item, `topThree[${i}]`, errors, warnings);
      browseWords += countWords(item.headline) + countWords(item.teaser);
      readWords += countWords(item.headline) + countWords(item.teaser) + countWords(item.whatItIs) + countWords(item.whyItMatters) + countWords(item.bankAngle || '');
    });
  }

  // Validate Spotlight
  if (!edition.spotlight) {
    errors.push('Spotlight company profile missing');
  } else {
    browseWords += countWords(edition.spotlight.pitch);
    readWords += countWords(edition.spotlight.pitch) +
      countWords(edition.spotlight.problem) +
      countWords(edition.spotlight.product) +
      countWords(edition.spotlight.customer) +
      countWords(edition.spotlight.businessModel) +
      countWords(edition.spotlight.funding) +
      countWords(edition.spotlight.competition) +
      countWords(edition.spotlight.risks) +
      countWords(edition.spotlight.whatToWatch);
  }

  // Validate Sectors (2 items per sector = 16 items)
  SECTOR_KEYS.forEach(secKey => {
    const secItems = edition.sectors[secKey] || [];
    if (secItems.length < 1) {
      warnings.push(`Sector ${secKey} has fewer than 1 item`);
    }
    secItems.forEach((item, idx) => {
      validateItem(item, `sectors.${secKey}[${idx}]`, errors, warnings);
      browseWords += countWords(item.headline) + countWords(item.teaser);
      readWords += countWords(item.headline) + countWords(item.teaser) + countWords(item.whatItIs) + countWords(item.whyItMatters) + countWords(item.bankAngle || '');
    });
  });

  // Validate Rising
  if (edition.rising) {
    edition.rising.forEach((item, i) => {
      validateItem(item, `rising[${i}]`, errors, warnings);
      browseWords += countWords(item.headline) + countWords(item.teaser);
      readWords += countWords(item.headline) + countWords(item.teaser) + countWords(item.whatItIs) + countWords(item.whyItMatters);
    });
  }

  // Validate Africa Section if present
  if (edition.africa) {
    edition.africa.forEach((item, i) => {
      validateItem(item, `africa[${i}]`, errors, warnings);
      browseWords += countWords(item.headline) + countWords(item.teaser);
      readWords += countWords(item.headline) + countWords(item.teaser) + countWords(item.whatItIs) + countWords(item.whyItMatters) + countWords(item.bankAngle || '');
    });
  }

  // Validate Ghana Section if present
  if (edition.ghana) {
    edition.ghana.forEach((item, i) => {
      validateItem(item, `ghana[${i}]`, errors, warnings);
      browseWords += countWords(item.headline) + countWords(item.teaser);
      readWords += countWords(item.headline) + countWords(item.teaser) + countWords(item.whatItIs) + countWords(item.whyItMatters) + countWords(item.bankAngle || '');
    });
  }

  // Validate Bank Lens
  if (!edition.bankLens || edition.bankLens.length !== 4) {
    errors.push(`Bank Lens must have 4 bullets, found ${edition.bankLens?.length || 0}`);
  } else {
    edition.bankLens.forEach(b => {
      browseWords += countWords(b.headline);
      readWords += countWords(b.headline) + countWords(b.explanation) + (b.ideaSpark ? b.ideaSpark.map(countWords).reduce((a, b) => a + b, 0) : 0);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    wordCounts: {
      browseEstimated: browseWords,
      readEstimated: readWords,
    },
  };
}

function validateItem(item: Item, path: string, errors: string[], warnings: string[]): void {
  // Check headline length
  const hWords = countWords(item.headline);
  if (hWords > STYLE_GUIDELINES.maxHeadlineWords + 2) {
    errors.push(`${path}: Headline exceeds word limit (${hWords} > ${STYLE_GUIDELINES.maxHeadlineWords})`);
  }

  // Check teaser length
  const tWords = countWords(item.teaser);
  if (tWords > STYLE_GUIDELINES.maxTeaserWords + 3) {
    errors.push(`${path}: Teaser exceeds word limit (${tWords} > ${STYLE_GUIDELINES.maxTeaserWords})`);
  }

  // Check source links
  if (!item.sources || item.sources.length === 0) {
    errors.push(`${path}: Item has no source links`);
  } else {
    item.sources.forEach(s => {
      if (!s.url || !s.url.startsWith('http')) {
        errors.push(`${path}: Source URL is invalid: ${s.url}`);
      }
    });
  }
}
