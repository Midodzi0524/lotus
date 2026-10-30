import { countWords, validateEdition } from '../pipeline/validate.ts';
import demoEdition from '../data/editions/2026-10-25.json';
import { Edition } from '../src/types/index.ts';

function testValidation() {
  const words = countWords('This is a simple five words');
  if (words !== 6) {
    throw new Error(`Expected 6 words, got ${words}`);
  }

  const result = validateEdition(demoEdition as unknown as Edition);
  if (!result.valid) {
    throw new Error(`Demo edition failed validation: ${result.errors.join(', ')}`);
  }

  console.log(`✓ Validation tests passed. Estimated Browse: ${result.wordCounts.browseEstimated}w, Read: ${result.wordCounts.readEstimated}w.`);
}

testValidation();
