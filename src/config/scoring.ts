export interface SignalWeights {
  novelty: number;
  significance: number;
  crossSourceMentions: number;
  traction: number;
  relevanceToFinancialServices: number;
}

export const SCORING_WEIGHTS: SignalWeights = {
  novelty: 0.30,
  significance: 0.25,
  crossSourceMentions: 0.20,
  traction: 0.15,
  relevanceToFinancialServices: 0.10,
};

export function calculateSignalScore(factors: {
  novelty: number;
  significance: number;
  crossSourceMentions: number;
  traction: number;
  relevanceToFinancialServices: number;
}): number {
  const score =
    factors.novelty * SCORING_WEIGHTS.novelty +
    factors.significance * SCORING_WEIGHTS.significance +
    factors.crossSourceMentions * SCORING_WEIGHTS.crossSourceMentions +
    factors.traction * SCORING_WEIGHTS.traction +
    factors.relevanceToFinancialServices * SCORING_WEIGHTS.relevanceToFinancialServices;

  return Math.round(Math.min(100, Math.max(0, score)));
}
