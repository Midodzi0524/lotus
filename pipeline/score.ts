import { calculateSignalScore } from '../src/config/scoring.ts';
import { SignalScoreBreakdown } from '../src/types/index.ts';

export function evaluateSignalScore(item: {
  hasFunding: boolean;
  roundStage?: string;
  crossMentionsCount: number;
  hasTraction: boolean;
  bankRelevance: 'none' | 'low' | 'medium' | 'high';
}): SignalScoreBreakdown {
  const novelty = Math.floor(75 + Math.random() * 20); // 75-95
  const significance = item.hasFunding ? Math.floor(80 + Math.random() * 15) : Math.floor(70 + Math.random() * 15);
  const crossSourceMentions = Math.min(100, item.crossMentionsCount * 30 + 40);
  const traction = item.hasTraction ? Math.floor(80 + Math.random() * 15) : Math.floor(65 + Math.random() * 15);

  const bankScoreMap = {
    high: 95,
    medium: 75,
    low: 50,
    none: 25,
  };
  const relevanceToFinancialServices = bankScoreMap[item.bankRelevance] || 50;

  const totalScore = calculateSignalScore({
    novelty,
    significance,
    crossSourceMentions,
    traction,
    relevanceToFinancialServices,
  });

  let rationale = 'Strong composite score with verified publisher sourcing.';
  if (relevanceToFinancialServices >= 80) {
    rationale = 'High strategic banking relevance combined with verified commercial traction.';
  } else if (significance >= 85) {
    rationale = 'Notable funding round or major technological benchmark.';
  }

  return {
    novelty,
    significance,
    crossSourceMentions,
    traction,
    relevanceToFinancialServices,
    totalScore,
    rationale,
  };
}
