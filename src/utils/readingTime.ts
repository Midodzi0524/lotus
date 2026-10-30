import { Item } from '../types/index.ts';

export interface ReadingTimeResult {
  wordCount: number;
  minutes: number;
  seconds: number;
  label: string;
  fullReadLabel: string;
}

/**
 * Calculates estimated reading time for an article card based on word count.
 * Uses 200 words per minute average reading speed.
 */
export function calculateCardReadingTime(item: Item, isExpanded: boolean = false): ReadingTimeResult {
  // Base text visible in browse mode
  const browseText = `${item.headline} ${item.teaser}`;
  
  // Full text when expanded
  let fullText = `${browseText} ${item.whatItIs} ${item.whyItMatters} ${item.bankAngle || ''}`;
  if (item.keyFacts) {
    const { fundingAmount, round, location, traction, businessModel } = item.keyFacts;
    fullText += ` ${fundingAmount || ''} ${round || ''} ${location || ''} ${traction || ''} ${businessModel || ''}`;
  }

  const activeText = isExpanded ? fullText : browseText;
  const wordCount = activeText.trim().split(/\s+/).filter(Boolean).length;
  const fullWordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  const seconds = Math.max(10, Math.round((wordCount / 200) * 60));
  const minutes = Math.ceil(seconds / 60);

  const fullSeconds = Math.max(15, Math.round((fullWordCount / 200) * 60));
  const fullMinutes = Math.ceil(fullSeconds / 60);

  const label = seconds < 60 ? `${seconds}s read` : `${minutes}m read`;
  const fullReadLabel = fullSeconds < 60 ? `${fullSeconds}s full read` : `${fullMinutes}m full read`;

  return {
    wordCount,
    minutes,
    seconds,
    label,
    fullReadLabel,
  };
}
