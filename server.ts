import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini client with aistudio-build User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API endpoint for Google Search Grounded Intelligence
app.post('/api/search-grounding', async (req, res) => {
  const { prompt, entityName } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  if (!ai) {
    // If no key in local development, return a graceful informational response
    return res.json({
      text: `Live Google Search Grounding requires a valid GEMINI_API_KEY attached in Settings > Secrets. In offline demo mode, queries for "${entityName || prompt}" can be previewed once the API key is connected.`,
      sources: [
        {
          web: {
            title: 'Google Search Documentation',
            uri: 'https://ai.google.dev/gemini-api/docs/grounding',
          },
        },
      ],
      isFallback: true,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert research analyst for banking and technology product executives. Provide concise, high-density, factual intelligence using up-to-date Google Search web data. Include concrete dates, funding figures, metrics, and partnership developments. Be objective and factual.',
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const text = response.text || 'No response generated from search grounding.';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const rawChunks = groundingMetadata?.groundingChunks || [];

    const sources: { title: string; uri: string }[] = [];
    rawChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri,
        });
      }
    });

    const webSearchQueries = groundingMetadata?.webSearchQueries || [];

    return res.json({
      text,
      sources,
      webSearchQueries,
      model: 'gemini-3.8-flash',
      groundedWith: 'Google Search',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API /api/search-grounding] Error:', err);
    let errorMessage = err.message || 'Error executing Google Search Grounding query';
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('ResourceExhausted')) {
      errorMessage = 'The Gemini API rate limit or quota has been reached. Please wait a moment before trying again, or check your API key quota in Google AI Studio.';
    }
    return res.status(500).json({
      error: errorMessage,
    });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lotus server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
