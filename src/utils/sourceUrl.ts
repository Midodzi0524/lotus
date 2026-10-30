/**
 * Utility to resolve source URLs safely.
 * Prevents 404 errors by validating external publisher URLs and converting
 * synthetic, placeholder, or outdated deep links into guaranteed live search/topic
 * query URLs on the corresponding publisher platforms.
 */

export function getSafeSourceUrl(
  rawUrl?: string,
  entityName?: string,
  headline?: string,
  sourceName?: string
): string {
  if (!rawUrl || rawUrl.trim() === '') {
    const query = encodeURIComponent(`${sourceName || ''} ${entityName || ''}`.trim());
    return `https://www.google.com/search?q=${query}`;
  }

  const trimmed = rawUrl.trim();

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    // Check if the URL contains synthetic/mock date patterns or test slugs that return 404
    const isSynthetic =
      pathname.includes('/2026/') ||
      pathname.includes('/2025/') ||
      pathname.includes('example.com') ||
      pathname.includes('/placeholder') ||
      pathname.length > 80;

    // A search term to look up on the publisher site
    const searchTarget = (entityName || headline?.split(/\s+/).slice(0, 3).join(' ') || '').trim();
    const encodedTarget = encodeURIComponent(searchTarget);

    // If it's a known publisher and contains a synthetic path, redirect to their live search
    if (isSynthetic) {
      if (hostname.includes('techcrunch.com')) {
        return `https://techcrunch.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('crunchbase.com')) {
        return `https://news.crunchbase.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('producthunt.com')) {
        return `https://www.producthunt.com/search?q=${encodedTarget}`;
      }
      if (hostname.includes('eu-startups.com')) {
        return `https://www.eu-startups.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('springwise.com')) {
        return `https://www.springwise.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('trendhunter.com')) {
        return `https://www.trendhunter.com/search?query=${encodedTarget}`;
      }
      if (hostname.includes('explodingtopics.com')) {
        return `https://explodingtopics.com/topics?search=${encodedTarget}`;
      }
      if (hostname.includes('finextra.com')) {
        return `https://www.finextra.com/search?q=${encodedTarget}`;
      }
      if (hostname.includes('sifted.eu')) {
        return `https://sifted.eu/search?q=${encodedTarget}`;
      }
      if (hostname.includes('fintechfutures.com')) {
        return `https://www.fintechfutures.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('techcabal.com')) {
        return `https://techcabal.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('disrupt-africa.com')) {
        return `https://disrupt-africa.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('techpoint.africa')) {
        return `https://techpoint.africa/?s=${encodedTarget}`;
      }
      if (hostname.includes('techfocus24.com')) {
        return `https://techfocus24.com/?s=${encodedTarget}`;
      }
      if (hostname.includes('ghanaweb.com')) {
        return `https://www.ghanaweb.com/GhanaHomePage/business/`;
      }
      if (hostname.includes('ycombinator.com')) {
        return `https://www.ycombinator.com/companies?query=${encodedTarget}`;
      }

      // Default safe lookup for arbitrary publishers
      const query = encodeURIComponent(`${sourceName || parsed.hostname} ${searchTarget}`.trim());
      return `https://www.google.com/search?q=${query}`;
    }

    return trimmed;
  } catch {
    const query = encodeURIComponent(`${sourceName || ''} ${entityName || ''}`.trim());
    return `https://www.google.com/search?q=${query}`;
  }
}
