export const LLM_CONFIG = {
  defaultModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  fallbackModels: ['gemini-flash-latest', 'gemini-3.1-flash-lite'],
  maxBatchSize: 10,
  requestDelayMs: 2200,
  maxRetries: 6,
  initialBackoffMs: 15000,
  temperature: {
    extraction: 0.2,
    factCheck: 0.2,
    summaries: 0.4,
    spotlight: 0.5,
    bankLens: 0.5,
  },
  rateLimits: {
    requestsPerMinute: 15,
    targetDailyCalls: 35,
  },
  cacheDir: 'data/cache',
};
