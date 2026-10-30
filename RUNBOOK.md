# OPERATIONAL RUNBOOK: Lotus Daily Brief

This runbook guides repository maintenance, failure mitigation, source updates, and zero-cost operation.

---

## 1. Automated Failure Alerts & Issues

When a daily workflow run fails:
1. GitHub automatically sends an email notification to the repository owner.
2. The workflow step `Handle Pipeline Failure` opens a new GitHub Issue titled:
   `Daily run failed YYYY-MM-DD`
   containing direct links to the failure execution logs.
3. **Site Resiliency:** Visitors to the website will continuously see yesterday's edition with a polite banner:
   *"Today's brief is delayed. Showing yesterday's edition."*

---

## 2. Diagnosing & Resolving Pipeline Issues

### Scenario A: Gemini Free-Tier Rate Limits (HTTP 429)
- **Symptom:** Logs show `ResourceExhausted: 429 Rate limit exceeded`.
- **Mitigation:**
  - Lotus batches items (10 per batch) and waits 2,200ms between requests to stay below the 15 Requests Per Minute limit.
  - All successful extractions are cached on disk by sha256 input hash in `data/cache/`.
  - To re-run, navigate to **Actions** → **Daily Brief Pipeline & Deploy** → **Run workflow**. Because successful items were cached, the retry only queries missing items.

### Scenario B: A Broken or Unresponsive Source
- **Symptom:** Source adapter log reports `HTTP 503` or timeout.
- **Resiliency:** A single failing source **never** fails the pipeline. The adapter marks the source as `not_available_today` or `error` in `SourceStatus`, and proceeds with the remaining feeds.
- If a source changes its RSS URL, discover the new feed link from the site's `<link rel="alternate" type="application/rss+xml">` tag and update `src/config/sources.ts`.

---

## 3. Re-Running a Specific Historical Date

The pipeline is completely idempotent. Re-running a date overwrites that date's JSON file cleanly without duplicate entries.
To re-run locally:
```bash
export GEMINI_API_KEY="your-key-here"
npm run pipeline:daily
```

---

## 4. Rolling Back an Edition

If bad data was published:
1. In GitHub, go to your repository commit history.
2. Revert the commit that published `data/editions/YYYY-MM-DD.json`.
3. Alternatively, delete the specific `YYYY-MM-DD.json` file. The website will automatically display the preceding published edition.

---

## 5. Adding or Removing a Source

All sources are defined modularly in `src/config/sources.ts`:
```typescript
{
  key: 'mysource',
  name: 'My New Source',
  homepageUrl: 'https://example.com',
  feedUrl: 'https://example.com/feed.xml',
  category: 'bonus',
  enabled: true, // Set to false to disable without code deletion
  rateLimitMs: 1500,
  description: 'Publisher description'
}
```
No pipeline orchestrator code needs to be modified.

---

## 6. Safeguarding Against GitHub 60-Day Inactive Schedule Pauses

GitHub automatically disables scheduled Actions workflows in repositories that have had no commit activity for 60 consecutive days.
**Lotus Safeguard:**
- The daily scheduled workflow commits a small update to `data/last-run.json` every single day, even on quiet days or when no new stories meet quality thresholds.
- This guaranteed daily commit keeps the repository active permanently, ensuring GitHub never suspends the schedule.
