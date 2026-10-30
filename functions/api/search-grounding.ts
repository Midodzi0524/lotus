// Cloudflare Pages Function for /api/search-grounding
// Automatically executed on Cloudflare's edge network when deployed on Cloudflare Pages.

interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as { prompt?: string; entityName?: string };
    const { prompt, entityName } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          text: `Live Google Search Grounding requires a valid GEMINI_API_KEY configured in Cloudflare Pages Settings > Environment variables. In offline demo mode, queries for "${entityName || prompt}" can be previewed once the API key is set.`,
          sources: [
            {
              title: 'Google Search Grounding Docs',
              uri: 'https://ai.google.dev/gemini-api/docs/grounding',
            },
          ],
          isFallback: true,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Call Gemini API with Google Search Grounding enabled
    const MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash'];

    const geminiPayload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        parts: [
          {
            text: 'You are an expert research analyst for banking and technology product executives. Provide concise, high-density, factual intelligence using up-to-date Google Search web data. Include concrete dates, funding figures, metrics, and partnership developments. Be objective and factual.',
          },
        ],
      },
      tools: [{ googleSearch: {} }],
      generationConfig: {
        temperature: 0.3,
      },
    };

    let res: Response = new Response('', { status: 500 });
    let usedModel = MODELS[0];
    for (const m of MODELS) {
      usedModel = m;
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(geminiPayload),
      });
      if (res.ok || ![404, 429, 500, 503].includes(res.status)) break;
    }

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({
          error: `Gemini API error (${res.status}): ${errText}`,
        }),
        {
          status: res.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data: any = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || 'No response generated.';
    const groundingMetadata = candidate?.groundingMetadata;
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

    return new Response(
      JSON.stringify({
        text,
        sources,
        webSearchQueries,
        model: usedModel,
        groundedWith: 'Google Search',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error in Cloudflare Function' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
