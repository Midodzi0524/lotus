import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { LLM_CONFIG } from '../../src/config/llm.ts';

export class GeminiPipelineClient {
  private ai: GoogleGenAI | null = null;
  private apiKey: string | null = null;
  private cacheDir: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    }
    this.cacheDir = path.resolve(process.cwd(), LLM_CONFIG.cacheDir);
    if (!fs.existsSync(this.cacheDir)) {
      try {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      } catch {}
    }
  }

  private getHash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  private getFromCache(hash: string): string | null {
    const cacheFile = path.join(this.cacheDir, `${hash}.json`);
    if (fs.existsSync(cacheFile)) {
      try {
        return fs.readFileSync(cacheFile, 'utf-8');
      } catch {
        return null;
      }
    }
    return null;
  }

  private saveToCache(hash: string, data: string): void {
    const cacheFile = path.join(this.cacheDir, `${hash}.json`);
    try {
      fs.writeFileSync(cacheFile, data, 'utf-8');
    } catch {}
  }


  /** Backup providers (OpenAI-compatible): xAI, Groq, OpenRouter, Cloudflare Workers AI. Used when Gemini is overloaded or has no key. No Google Search grounding here. */
  private backups() {
    const list: { name: string; url: string; key: string; models: string[]; maxChars: number }[] = [];
    if (process.env.XAI_API_KEY) list.push({ name: 'xAI', url: 'https://api.x.ai/v1/chat/completions', key: process.env.XAI_API_KEY, models: [process.env.XAI_MODEL || 'grok-4.3'], maxChars: 400000 });
    if (process.env.GROQ_API_KEY) list.push({ name: 'Groq', url: 'https://api.groq.com/openai/v1/chat/completions', key: process.env.GROQ_API_KEY, models: process.env.GROQ_MODEL ? [process.env.GROQ_MODEL] : ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'gemma2-9b-it'], maxChars: Number(process.env.GROQ_MAX_CHARS || 28000) });
    if (process.env.OPENROUTER_API_KEY) list.push({ name: 'OpenRouter', url: 'https://openrouter.ai/api/v1/chat/completions', key: process.env.OPENROUTER_API_KEY, models: process.env.OPENROUTER_MODEL ? [process.env.OPENROUTER_MODEL] : ['openrouter/free', 'google/gemma-4-31b-it:free', 'nvidia/nemotron-3-ultra-550b-a55b:free'], maxChars: Number(process.env.OPENROUTER_MAX_CHARS || 60000) });
    if (process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID) {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      list.push({
        name: 'Cloudflare',
        url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/chat/completions`,
        key: process.env.CLOUDFLARE_API_TOKEN,
        models: process.env.CLOUDFLARE_MODEL ? [process.env.CLOUDFLARE_MODEL] : ['@cf/meta/llama-3.1-8b-instruct', '@cf/openai/gpt-oss-20b', '@cf/google/gemma-4-26b-a4b-it'],
        maxChars: Number(process.env.CLOUDFLARE_MAX_CHARS || 24000),
      });
    }
    return list;
  }

  private async callBackup(prompt: string, systemInstruction: string | undefined, temperature: number, opts: { json?: boolean }, cacheKey: string): Promise<string> {
    let lastErr: any;
    for (const prov of this.backups()) {
      // keep the instructions at the end of the prompt when trimming for small free-tier limits
      const p = prompt.length > prov.maxChars ? `${prompt.slice(0, prov.maxChars - 4000)}\n[...older items trimmed...]\n${prompt.slice(-4000)}` : prompt;
      for (const model of prov.models) {
        for (let i = 0; i < 4; i++) {
          try {
            const res = await fetch(prov.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${prov.key}` },
              body: JSON.stringify({ 
              model, 
              temperature, 
              messages: [
                ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
                { role: 'system', content: opts.json === false ? '' : 'You must respond with ONLY a single valid JSON object. No markdown, no code fences, no extra text before or after.' },
                { role: 'user', content: p }
              ].filter(m => m.content),
              ...(opts.json === false ? {} : { response_format: { type: 'json_object' } })
            }),
            });
            if (res.status === 429 || res.status >= 500) { const wait = Math.min(Number(res.headers.get('retry-after')) || 20 * (i + 1), 90); console.warn(`[${prov.name}Backup] ${model} HTTP ${res.status}; waiting ${wait}s`); await new Promise(r => setTimeout(r, wait * 1000)); continue; }
            if (!res.ok) { lastErr = new Error(`${prov.name} ${model} HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`); console.warn(`[${prov.name}Backup] ${lastErr.message}`); break; }
            const text = ((await res.json()) as any).choices?.[0]?.message?.content;
            if (!text) { lastErr = new Error(`${prov.name} returned empty content`); break; }
            console.log(`[${prov.name}Backup] Answered with ${model}`);
            this.saveToCache(cacheKey, text);
            return text;
          } catch (e: any) { lastErr = e; }
        }
      }
    }
    throw lastErr ?? new Error('Backup providers failed');
  }

  async callWithRetry(prompt: string, systemInstruction?: string, temperature: number = 0.4, opts: { json?: boolean; search?: boolean } = {}): Promise<string> {
    const cacheKey = this.getHash(`${prompt}-${systemInstruction || ''}-${temperature}-${opts.json ?? true}-${opts.search ?? false}`);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    if ((!this.ai || !this.apiKey) && this.backups().length) return this.callBackup(prompt, systemInstruction, temperature, opts, cacheKey);
    if (!this.ai || !this.apiKey) {
      console.warn('[GeminiPipelineClient] No GEMINI_API_KEY present. Skipping live LLM call.');
      return '{}';
    }

    let attempt = 0;
    let delay = LLM_CONFIG.initialBackoffMs;

    const maxAttempts = this.backups().length ? Math.min(3, LLM_CONFIG.maxRetries) : LLM_CONFIG.maxRetries;

    while (attempt < maxAttempts) {
      try {
        // Enforce delay between calls to respect 15 RPM
        await new Promise(resolve => setTimeout(resolve, LLM_CONFIG.requestDelayMs));

        const response = await this.ai.models.generateContent({
          model: [LLM_CONFIG.defaultModel, ...LLM_CONFIG.fallbackModels][attempt % (LLM_CONFIG.fallbackModels.length + 1)],
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || undefined,
            temperature,
            ...(opts.json === false ? {} : { responseMimeType: 'application/json' }),
            ...(opts.search ? { tools: [{ googleSearch: {} }] } : {}),
          },
        });

        const text = response.text || '{}';
        this.saveToCache(cacheKey, text);
        return text;
      } catch (err: any) {
        attempt++;
        const isRateLimit = err.status === 429 || (err.message && err.message.includes('429'));
        console.warn(`[GeminiPipelineClient] Attempt ${attempt} failed: ${err.message}. ${isRateLimit ? 'Rate limit hit, backing off...' : ''}`);

        if (attempt >= maxAttempts) {
          if (this.backups().length) { console.warn('[GeminiPipelineClient] Gemini unavailable, switching to backup provider.'); return this.callBackup(prompt, systemInstruction, temperature, opts, cacheKey); }
          throw err;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, 120000);
      }
    }

    return '{}';
  }
}
