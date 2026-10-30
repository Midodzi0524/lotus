# PROGRESS CHECKLIST: LOTUS DAILY BRIEF BUILD

## Section 15 Implementation Status

- [x] **Step 1: Foundation**
  - Project setup, configuration (`config/sources.ts`, `config/sectors.ts`, `config/style.ts`, `config/scoring.ts`, `config/llm.ts`, `config/flags.ts`).
  - Warm nude design tokens in `src/index.css` (cream `#F4EFE6`, ivory `#FAF7F1`, espresso `#1E1A16`, cocoa `#7A5A41`).
  - Strict TypeScript interfaces and Zod schemas (`src/types/index.ts`).
  - Pristine bundled Demo Mode sample edition for 2026-10-25 with 28 companies, 8 sectors, Top 3, Spotlight, Funding, Rising, Bank Lens with Idea Sparks, Quick Links, and Source Status (`data/editions/2026-10-25.json`).
  - Layout shell with Header, Footer, theme toggle, and Browse/Read toggle.

- [x] **Step 2: Reading Experience**
  - 7-section Today page matching Section 5.3 and 8.3.
  - Expandable image cards using native `<details>` for zero-JS fallback and accessible expand-in-place.
  - Browse (2 min / 500-700 words) vs Read (10 min / 2,000-2,500 words) global mode switch.
  - Image fallback engine with programmatic typographic SVG cover generator (`src/components/GeneratedCover.tsx` and `src/components/ImageWithFallback.tsx`).
  - Nude theme with light/dark contrast verification.
  - 2px cocoa reading progress indicator at top of screen.
  - Full keyboard shortcuts (`j`/`k`, `Enter`/`Space`, `s`, `o`, `/`, `b`, `r`, `?`).
  - Listen via Web Speech API (`SpeechSynthesis`).

- [x] **Step 3: Pipeline Engine**
  - Data collection adapters for 8 core sources + bonus European/fintech feeds (`pipeline/sources/adapters.ts`).
  - Normalization, deduplication, and signal scoring engine (`pipeline/score.ts`).
  - Gemini LLM integration with exponential backoff on HTTP 429, batching (10 items/batch), input-hash disk cache (`pipeline/llm/client.ts`).
  - Automated adversarial fact-checking against source excerpts and validation engine (`pipeline/validate.ts`).
  - Complete daily publishing pipeline script (`pipeline/daily.ts`).

- [x] **Step 4: Automation Workflows**
  - `.github/workflows/daily.yml`: Daily scheduled cron at 05:00 UTC + workflow_dispatch, commits data, deploys to GitHub Pages, and opens GitHub issue on failure.
  - `.github/workflows/watchdog.yml`: Runs at 07:00 UTC to verify today's edition exists and triggers fallback run if missing.
  - `.github/workflows/ci.yml`: Runs lint and builds on every push.
  - Keep-alive commit safeguarding 60-day inactivity threshold.

- [x] **Step 5: Browse and Discover**
  - Archive directory (`src/views/ArchiveView.tsx`).
  - Client-side full-text search with sector filter pills (`src/views/SearchView.tsx`).
  - Tracked companies directory and individual profile views (`src/views/CompaniesView.tsx`).
  - Funding rounds tracker with sortable table, CSV export, and sector breakdown chart (`src/views/FundingView.tsx`).
  - Tracked macro trends view (`src/views/TrendsView.tsx`).
  - Jargon glossary with plain-English definitions (`src/views/GlossaryView.tsx`).
  - Sunday Weekly Deep Dive (`src/views/WeeklyView.tsx`).

- [x] **Step 6: Reader Features**
  - Offline localStorage saved bookmarks with notes and tags (`src/views/SavedView.tsx`).
  - JSON export and import for saved items.
  - Custom keyword/entity watchlist (`src/views/WatchlistView.tsx`).
  - Reader preferences and typography sizing (`src/views/SettingsView.tsx`).

- [x] **Step 7: Hardening & PWA**
  - PWA manifest (`public/manifest.json`) and service worker (`public/sw.js`) for offline caching of last 3 editions.
  - Public RSS / Atom feed (`public/feed.xml`).
  - SEO `sitemap.xml` and `robots.txt`.
  - Automated unit test suite (`tests/scoring.test.ts`, `tests/validation.test.ts`).

- [x] **Step 8: Handoff Documentation**
  - `README.md`, `SETUP.md` (click-by-click instructions), `RUNBOOK.md`, `ARCHITECTURE.md`, `METHODOLOGY.md`, `CONTENT-STYLE-GUIDE.md`, `DECISIONS.md`.
