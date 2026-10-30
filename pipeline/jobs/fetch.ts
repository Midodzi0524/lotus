import fs from 'fs';
import path from 'path';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  url: string;
  source: string;
  postedAt?: string;
  tags?: string[];
}

const PRODUCT_KEYWORDS = [
  'product manager', 'product owner', 'product marketing', 'growth product',
  'product lead', 'senior product', 'principal product', 'head of product',
  'product development', 'technical product', 'product marketing manager',
  'pmm', 'pm '
];

function isProductRole(title: string): boolean {
  const t = title.toLowerCase();
  return PRODUCT_KEYWORDS.some(k => t.includes(k));
}

function isRemote(job: any): boolean {
  const loc = (job.location || job.candidate_required_location || job.region || '').toLowerCase();
  const title = (job.title || job.position || '').toLowerCase();
  return loc.includes('remote') || loc.includes('worldwide') || loc.includes('anywhere') ||
         title.includes('remote') || job.remote === true || job.remote === 'true';
}

async function fetchRemoteOK(): Promise<Job[]> {
  try {
    const r = await fetch('https://remoteok.com/api', { headers: { 'User-Agent': 'LotusJobs/1.0' } });
    if (!r.ok) return [];
    const data = await r.json();
    return (data as any[]).slice(1).filter(j => j && isProductRole(j.position || j.title || '') && isRemote(j))
      .map(j => ({
        id: `remoteok-${j.id}`,
        title: j.position || j.title,
        company: j.company,
        location: j.location || 'Remote',
        remote: true,
        url: j.url || j.apply_url || `https://remoteok.com/l/${j.id}`,
        source: 'RemoteOK',
        postedAt: j.date,
        tags: j.tags || []
      })).slice(0, 30);
  } catch { return []; }
}

async function fetchRemotive(): Promise<Job[]> {
  try {
    const r = await fetch('https://remotive.com/api/remote-jobs?search=product&category=product');
    if (!r.ok) return [];
    const data = await r.json();
    return (data.jobs || []).filter((j: any) => isProductRole(j.title) && isRemote(j))
      .map((j: any) => ({
        id: `remotive-${j.id}`,
        title: j.title,
        company: j.company_name,
        location: j.candidate_required_location || 'Remote',
        remote: true,
        url: j.url,
        source: 'Remotive',
        postedAt: j.publication_date,
        tags: j.tags || []
      })).slice(0, 30);
  } catch { return []; }
}

async function fetchWeWorkRemotely(): Promise<Job[]> {
  try {
    const r = await fetch('https://weworkremotely.com/categories/remote-product-jobs.rss');
    if (!r.ok) return [];
    const xml = await r.text();
    const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    const jobs: Job[] = [];
    for (const block of items.slice(0, 40)) {
      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i)?.[1] || block.match(/<title>(.*?)<\/title>/i)?.[1] || '';
      const link = block.match(/<link>(.*?)<\/link>/i)?.[1] || '';
      const company = title.split(':')[0]?.trim() || 'Unknown';
      const cleanTitle = title.split(':').slice(1).join(':').trim() || title;
      if (isProductRole(cleanTitle) || isProductRole(title)) {
        jobs.push({
          id: `wwr-${Buffer.from(link).toString('base64').slice(0, 12)}`,
          title: cleanTitle,
          company,
          location: 'Remote',
          remote: true,
          url: link,
          source: 'We Work Remotely',
        });
      }
    }
    return jobs.slice(0, 25);
  } catch { return []; }
}

async function fetchHimalayas(): Promise<Job[]> {
  try {
    const r = await fetch('https://himalayas.app/jobs/api?q=product%20manager&remote=true');
    if (!r.ok) return [];
    const data = await r.json();
    return (data.jobs || data || []).filter((j: any) => isProductRole(j.title || j.role || '') )
      .map((j: any) => ({
        id: `himalayas-${j.id || j.slug}`,
        title: j.title || j.role,
        company: j.companyName || j.company,
        location: j.location || 'Remote',
        remote: true,
        url: j.url || j.applicationUrl || `https://himalayas.app/jobs/${j.slug}`,
        source: 'Himalayas',
        postedAt: j.pubDate || j.postedAt,
      })).slice(0, 20);
  } catch { return []; }
}

export async function fetchAllJobs(): Promise<Job[]> {
  console.log('[JOBS] Fetching remote product roles...');
  const results = await Promise.all([
    fetchRemoteOK(),
    fetchRemotive(),
    fetchWeWorkRemotely(),
    fetchHimalayas(),
  ]);
  const all = results.flat();
  // Dedupe by url or title+company
  const seen = new Set<string>();
  const unique = all.filter(j => {
    const key = (j.url || `${j.title}|${j.company}`).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`[JOBS] Collected ${unique.length} unique remote product roles`);
  return unique.slice(0, 60);
}

export async function updateJobsFile() {
  const jobs = await fetchAllJobs();
  const out = path.resolve('data/jobs.json');
  fs.writeFileSync(out, JSON.stringify({ updatedAt: new Date().toISOString(), jobs }, null, 2));
  console.log(`[JOBS] Wrote ${jobs.length} jobs to data/jobs.json`);
}
