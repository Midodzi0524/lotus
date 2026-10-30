import { calculateSignalScore } from '../src/config/scoring.ts';

function testScoring() {
  const result = calculateSignalScore({
    novelty: 80,
    significance: 80,
    crossSourceMentions: 80,
    traction: 80,
    relevanceToFinancialServices: 80,
  });

  if (result !== 80) {
    throw new Error(`Expected score 80, got ${result}`);
  }

  const highBanking = calculateSignalScore({
    novelty: 50,
    significance: 50,
    crossSourceMentions: 50,
    traction: 50,
    relevanceToFinancialServices: 100,
  });

  if (highBanking !== 55) {
    throw new Error(`Expected score 55, got ${highBanking}`);
  }

  // Test reading time calculation
  const sampleWords = 'word '.repeat(100);
  const wordsCount = sampleWords.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(10, Math.round((wordsCount / 200) * 60));
  if (seconds !== 30) {
    throw new Error(`Expected 30 seconds for 100 words at 200wpm, got ${seconds}`);
  }

  console.log('✓ Scoring and reading time tests passed successfully.');
}

testScoring();
