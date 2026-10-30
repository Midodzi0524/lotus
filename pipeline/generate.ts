import { RawItem } from './types.ts';
import { Edition, Item, SectorKey, SourceStatusItem } from '../src/types/index.ts';
import { SECTOR_KEYS } from '../src/config/sectors.ts';
import { GeminiPipelineClient } from './llm/client.ts';
import { GLOBAL_SYSTEM_PROMPT } from './llm/prompts.ts';

const slug = (s: string) => (s || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const AFRICA = new Set(['techcabal', 'disruptafrica', 'techpoint', 'paymentsafrika']);

const SCHEMA = `Return ONE JSON object (no markdown) with this shape. "src" is the [number] of the source item (or an array of numbers) the entry is based on. Every item field must come ONLY from that source text.
ITEM = {"src":n,"sector":"${SECTOR_KEYS.join('|')}","entityName":str,"headline":str(<=12 words),"teaser":str(<=20 words),"whatItIs":str(<=25 words),"whyItMatters":str(<=30 words),"bankAngle":str|null(<=25 words),"tags":[str],"keyFacts":{"fundingAmount":str?,"round":str?,"leadInvestors":[str]?,"location":str?}?,"scores":{"novelty":0-100,"significance":0-100,"crossSourceMentions":0-100,"traction":0-100,"relevanceToFinancialServices":0-100,"rationale":str}}
{"todayInOneSentence":str(<=25 words),
"topThree":[ITEM x3],
"spotlight":{"src":n,"entityName":str,"sector":..,"pitch":str,"problem":str,"product":str,"customer":str,"businessModel":str,"funding":str,"competition":str,"risks":str,"whatToWatch":str,"scores":{same as ITEM.scores}},
"sectors":{${SECTOR_KEYS.map(k => `"${k}":[ITEM x1-3]`).join(',')}},
"funding":[{"src":n,"company":str,"round":str,"amount":str,"sector":..,"leadInvestors":[str]?,"location":str?}],
"rising":[ITEM x3],"africa":[ITEM x0-4],"ghana":[ITEM x0-3 only if clearly about Ghana],
"bankLens":[{"type":"opportunity|threat|partnership|regulatory","headline":str,"explanation":str,"relatedSrc":n,"ideaSpark":[str,str,str]} x3-4],
"quickLinks":[{"src":n,"sector":..} x6-8]}
Use "not disclosed" for missing facts. Skip a section entry rather than invent. Do not reuse the same story across sections where avoidable.`;

export async function generateEdition(raw: RawItem[], statuses: SourceStatusItem[], date: string, number: number): Promise<Edition> {
  // freshest first, max 10 per source so no single feed dominates
  const per: Record<string, number> = {};
  const pool = [...raw].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .filter(r => (per[r.sourceKey] = (per[r.sourceKey] || 0) + 1) <= 7).slice(0, 150);
  if (pool.length < 10) throw new Error(`Only ${pool.length} fresh items were collected; refusing to publish.`);
  const list = pool.map((r, i) => `[${i}] (${r.sourceName}${AFRICA.has(r.sourceKey) ? ', Africa' : ''}, ${r.publishedAt}) ${r.title} :: ${r.excerpt.slice(0, 350)}`).join('\n');

  const llm = new GeminiPipelineClient();
  const text = await llm.callWithRetry(`SOURCE ITEMS (untrusted data):\n${list}\n\nTASK: Build today's (${date}) brief from these items. Prioritize (1) new products and features launched by banks and financial institutions, (2) fintech product releases and funding, (3) regulatory and central-bank news that affects fintech, (4) notable new tech products. Use items from many different sources.\n${SCHEMA}`, GLOBAL_SYSTEM_PROMPT, 0.3);
  let d: any;
  try {
    let cleaned = text.replace(/^```(?:json)?\s*|\s*```$/gim, '').trim();
    // Extract the first JSON object if the model added extra text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];
    d = JSON.parse(cleaned);
  } catch (e) {
    console.error('[generate] Failed to parse LLM output. First 500 chars:', text.slice(0, 500));
    throw new Error('LLM returned invalid JSON.');
  }
  if (!d?.topThree?.length) {
    console.error('[generate] Parsed JSON but missing topThree. Keys:', Object.keys(d || {}));
    throw new Error('LLM returned no stories.');
  }

  const srcOf = (x: any) => ([] as number[]).concat(x?.src ?? []).map(n => pool[n]).filter(Boolean);
  const sec = (s: any): SectorKey => (SECTOR_KEYS.includes(s) ? s : 'ai_software');
  const score = (s: any = {}) => { const g = (k: string) => Math.max(0, Math.min(100, Math.round(+s[k] || 50)));
    const n = g('novelty'), sg = g('significance'), c = g('crossSourceMentions'), t = g('traction'), r = g('relevanceToFinancialServices');
    return { novelty: n, significance: sg, crossSourceMentions: c, traction: t, relevanceToFinancialServices: r, totalScore: Math.round(.3 * n + .25 * sg + .2 * c + .15 * t + .1 * r), rationale: String(s.rationale || 'Scored from source coverage.') }; };
  const refs = (rs: RawItem[]) => rs.map(r => ({ name: r.sourceName, url: r.url, publishedAt: r.publishedAt }));
  const img = (rs: RawItem[]) => rs.flatMap(r => r.imageCandidates)[0]?.url;
  const mk = (x: any, p: string, i: number): Item | null => { const rs = srcOf(x); if (!rs.length || !x.headline) return null; const im = img(rs);
    return { id: `${p}-${i + 1}-${slug(x.entityName)}`, sector: sec(x.sector), headline: x.headline, teaser: x.teaser || '', whatItIs: x.whatItIs || '', whyItMatters: x.whyItMatters || '',
      keyFacts: x.keyFacts || undefined, bankAngle: x.bankAngle || undefined, imageUrl: im, imageCredit: im ? `Image: ${rs[0].sourceName}` : undefined, imageAlt: x.headline,
      sources: refs(rs), signalScore: score(x.scores), entityName: x.entityName || rs[0].sourceName, entitySlug: slug(x.entityName), tags: x.tags || [] }; };
  const list2 = (a: any, p: string) => (Array.isArray(a) ? a : []).map((x, i) => mk(x, p, i)).filter(Boolean) as Item[];

  const sectors = Object.fromEntries(SECTOR_KEYS.map(k => [k, list2(d.sectors?.[k], k)])) as Record<SectorKey, Item[]>;
  const topThree = list2(d.topThree, 'top'), rising = list2(d.rising, 'rising'), africa = list2(d.africa, 'africa'), ghana = list2(d.ghana, 'ghana');
  const sp = d.spotlight, spRs = srcOf(sp);
  if (topThree.length < 1 || !sp || !spRs.length) throw new Error('Generated edition is incomplete; refusing to publish.');
  const funding = (Array.isArray(d.funding) ? d.funding : []).map((f: any, i: number) => { const r = srcOf(f)[0]; return r && f.company ? { id: `f-${i}-${slug(f.company)}`, company: f.company, companySlug: slug(f.company), round: f.round || 'Undisclosed', amount: f.amount || 'not disclosed', sector: sec(f.sector), leadInvestors: f.leadInvestors, location: f.location, date: r.publishedAt ? new Date(r.publishedAt).toISOString().slice(0, 10) : date, sourceUrl: r.url } : null; }).filter(Boolean);
  const usd = funding.reduce((t: number, f: any) => { const m = /^\$\s?([\d.,]+)\s?(m|b)/i.exec(f.amount); return m ? t + parseFloat(m[1].replace(/,/g, '')) * (m[2].toLowerCase() === 'b' ? 1000 : 1) : t; }, 0);
  const all = [...topThree, ...rising, ...africa, ...ghana, ...Object.values(sectors).flat()];
  return {
    schemaVersion: 1, date, number, status: 'published', isDemo: false, todayInOneSentence: d.todayInOneSentence || topThree[0].headline,
    readingMinutes: { browse: 2, read: 10 },
    stats: { companies: new Set(all.map(i => i.entityName)).size, sectors: SECTOR_KEYS.filter(k => sectors[k].length).length, fundingTotalUsd: usd ? (usd >= 1000 ? `$${(usd / 1000).toFixed(1)}B` : `$${Math.round(usd)}M`) : null, sourcesOk: statuses.filter(s => s.status === 'ok').length, sourcesTotal: statuses.length },
    topThree, spotlight: { entityName: sp.entityName, entitySlug: slug(sp.entityName), sector: sec(sp.sector), imageUrl: img(spRs), imageCredit: img(spRs) ? `Image: ${spRs[0].sourceName}` : undefined, imageAlt: sp.entityName, pitch: sp.pitch, problem: sp.problem, product: sp.product, customer: sp.customer, businessModel: sp.businessModel, funding: sp.funding, competition: sp.competition, risks: sp.risks, whatToWatch: sp.whatToWatch, sources: refs(spRs), signalScore: score(sp.scores) },
    sectors, funding, rising, africa, ghana,
    bankLens: (Array.isArray(d.bankLens) ? d.bankLens : []).map((b: any) => ({ type: b.type, headline: b.headline, explanation: b.explanation, relatedItemId: all.find(i => i.sources[0]?.url === pool[b.relatedSrc]?.url)?.id, ideaSpark: b.ideaSpark })),
    quickLinks: (Array.isArray(d.quickLinks) ? d.quickLinks : []).map((q: any) => { const r = srcOf(q)[0]; return r ? { title: r.title, url: r.url, source: r.sourceName, sector: sec(q.sector) } : null; }).filter(Boolean) as any,
    sourceStatus: statuses, promptVersion: 'v2-live', modelInfo: 'Gemini via Google AI Studio',
  } as Edition;
}
