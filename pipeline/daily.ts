import fs from 'fs';
import path from 'path';
import { SOURCES } from '../src/config/sources.ts';
import { fetchFromSource } from './sources/adapters.ts';
import { generateEdition } from './generate.ts';
import { addLongForm } from './longform.ts';
import { updateJobsFile } from './jobs/fetch.ts';
import { validateEdition } from './validate.ts';
import { SourceStatusItem } from '../src/types/index.ts';

async function run() {
  const t0 = Date.now(); const today = new Date().toISOString().split('T')[0];
  console.log(`[LOTUS] Building edition ${today}`);
  const statuses: SourceStatusItem[] = []; const raw: any[] = [];
  const results = await Promise.all(SOURCES.filter(s => s.enabled).map(async s => ({ s, r: await fetchFromSource(s) })));
  for (const { s, r } of results) {
    statuses.push({ sourceKey: s.key, name: s.name, status: r.status, itemsCount: r.items.length, lastFetchedAt: new Date().toISOString(), notes: r.error }); raw.push(...r.items); }
  console.log(`[LOTUS] Collected ${raw.length} items from ${statuses.length} sources`);

  const dir = path.resolve('data/editions'); const idxPath = path.resolve('data/index.json');
  const index: any[] = JSON.parse(fs.readFileSync(idxPath, 'utf-8'));
  const prev = index.filter(e => !e.isDemo && e.date !== today).sort((a, b) => b.date.localeCompare(a.date))[0];
  const number = (prev?.number ?? 104) + 1;

  const ed = await generateEdition(raw, statuses, today, number);
  await addLongForm(ed);
  try { await updateJobsFile(); } catch (e: any) { console.warn('[JOBS] Failed:', e.message); }
  const v = validateEdition(ed); console.log(v.valid ? '[LOTUS] Validation passed' : '[LOTUS] Validation warnings:', v.valid ? '' : v.errors);
  fs.writeFileSync(path.join(dir, `${today}.json`), JSON.stringify(ed, null, 2));

  const entry = { date: today, number, status: 'published', isDemo: false, todayInOneSentence: ed.todayInOneSentence, thumbnail: ed.topThree[0]?.imageUrl || ed.spotlight.imageUrl || '', companiesCount: ed.stats.companies, sectorsCount: ed.stats.sectors, fundingTotalUsd: ed.stats.fundingTotalUsd };
  fs.writeFileSync(idxPath, JSON.stringify([entry, ...index.filter(e => e.date !== today)], null, 2));
  fs.writeFileSync(path.resolve('data/last-run.json'), JSON.stringify({ lastRunAt: new Date().toISOString(), status: 'success', publishedEdition: today, sources: statuses, sourcesPolled: statuses.length, sourcesSuccessful: statuses.filter(s => s.status === 'ok').length, totalItemsCollected: raw.length, deduplicatedItems: raw.length, selectedItems: ed.topThree.length + ed.rising.length + Object.values(ed.sectors).flat().length, runDurationSeconds: Math.round((Date.now() - t0) / 1000), note: 'Published from live sources.' }, null, 2));
  console.log('[LOTUS] Done');
}
run().catch(e => { console.error('[LOTUS] FAILED:', e.message || e); process.exit(1); });
