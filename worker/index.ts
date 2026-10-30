import { onRequestPost } from '../functions/api/search-grounding.ts';

interface Env {
  GEMINI_API_KEY?: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/search-grounding') {
      return request.method === 'POST' ? onRequestPost({ request, env }) : json({ error: 'Use POST' }, 405);
    }
    if (pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404);
    return env.ASSETS.fetch(request);
  },
};
