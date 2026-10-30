import { RawItem } from '../types.ts';
import { SOURCES, SourceConfig } from '../../src/config/sources.ts';

export interface SourceFetchResult {
  sourceKey: string;
  sourceName: string;
  status: 'ok' | 'partial' | 'error' | 'not_available_today';
  items: RawItem[];
  error?: string;
}

// Simple XML/RSS regex parser to avoid heavy native dependencies
export function parseRssXml(xmlText: string, source: SourceConfig): RawItem[] {
  const items: RawItem[] = [];
  const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || xmlText.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  for (const itemBlock of itemMatches.slice(0, 20)) {
    const titleMatch = itemBlock.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const linkMatch = itemBlock.match(/<link[^>]*href=["']([^"']+)["']/i) || itemBlock.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const descMatch = itemBlock.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i) || itemBlock.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i);
    const pubDateMatch = itemBlock.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || itemBlock.match(/<published[^>]*>([\s\S]*?)<\/published>/i);
    // Broader image extraction: media:content, media:thumbnail, enclosure, og-style, and img tags in description
    const imageUrls: string[] = [];
    const patterns = [
      /(?:media:content|media:thumbnail|enclosure)[^>]*url=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi,
      /url=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi,
      /<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi,
    ];
    for (const re of patterns) {
      let m;
      while ((m = re.exec(itemBlock)) !== null) {
        if (m[1] && !imageUrls.includes(m[1])) imageUrls.push(m[1]);
      }
    }

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const url = linkMatch ? linkMatch[1].trim() : '';
    const rawDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const excerpt = rawDesc.length > 1500 ? rawDesc.substring(0, 1500) + '...' : rawDesc;
    const publishedAt = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();

    if (title && url) {
      items.push({
        id: `${source.key}-${Buffer.from(url).toString('base64').substring(0, 12)}`,
        sourceKey: source.key,
        sourceName: source.name,
        title,
        url,
        publishedAt,
        excerpt,
        imageCandidates: imageUrls.map(u => ({ url: u })),
        fetchedAt: new Date().toISOString(),
      });
    }
  }

  return items;
}

export async function fetchFromSource(source: SourceConfig): Promise<SourceFetchResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(source.feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'DailyBriefBot/1.0 (+https://daily-brief.github.io/about)',
        'Accept': 'application/rss+xml, application/atom+xml, text/xml, application/xml',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        sourceKey: source.key,
        sourceName: source.name,
        status: 'error',
        items: [],
        error: `HTTP ${response.status} ${response.statusText}`,
      };
    }

    const xml = await response.text();
    const items = parseRssXml(xml, source);

    return {
      sourceKey: source.key,
      sourceName: source.name,
      status: items.length > 0 ? 'ok' : 'partial',
      items,
    };
  } catch (err: any) {
    return {
      sourceKey: source.key,
      sourceName: source.name,
      status: 'error',
      items: [],
      error: err.message || 'Fetch failed',
    };
  }
}
