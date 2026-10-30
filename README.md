# Lotus — Daily Intelligence Brief

> Automated, zero-cost ($0/month) 10-minute startup and venture innovation digest for banking, fintech, and corporate technology leaders.

Lotus automatically monitors 8 primary startup directories and RSS publishers every morning, extracts sourced factual points, balances coverage across 8 industry sectors, calculates a 5-factor signal score, translates technical releases into banking implications (Bank Lens), and publishes an edition to a public static website via GitHub Pages and GitHub Actions.

---

## Highlights

- **$0 Total Recurring Running Cost:** Runs purely on GitHub Actions (scheduled free cron), GitHub Pages (free static hosting), and Google Gemini API (Free Tier without credit card).
- **Image-Led, Calm Editorial Design:** Warm nude palette (cream `#F4EFE6`, ivory `#FAF7F1`, espresso `#1E1A16`, cocoa `#7A5A41`), refined serif typography, and zero visual clutter.
- **Browse vs Read Modes:**
  - **Browse Mode (2 min):** Clean scan of headlines (max 12 words) and teasers (max 20 words), totaling 500–700 words.
  - **Read Mode (10 min):** In-place expanded view with "What it is", "Why it matters", key facts, banking angle, and signal rationale, totaling 2,000–2,500 words.
- **Fail-Safe Visuals:** Hotlinks source thumbnails with visible attribution, automatically falling back to programmatic SVG typographic covers so no item is ever imageless or broken.
- **Bank Lens & Idea Spark:** Evaluates daily startups through 4 commercial lenses: Commercial Opportunity, Disintermediation Threat, Partnership Angle, and Regulatory/Model Governance.
- **Privacy & Offline First:** Zero analytics, zero cookies, zero user tracking. Bookmarks and watchlists are stored entirely in local browser storage, with PWA offline caching.

---

## Repository Structure

```
├── .github/workflows/
│   ├── daily.yml       # Daily run at 05:00 UTC + Pages build & deploy
│   ├── watchdog.yml    # Health check at 07:00 UTC with auto-recovery
│   └── ci.yml          # Automated linting and tests
├── data/
│   ├── editions/       # JSON storage for each daily edition
│   ├── index.json      # Master archive catalog
│   ├── companies.json  # Tracked company profiles
│   ├── funding.json    # Venture rounds directory
│   ├── glossary.json   # Industry jargon definitions
│   └── trends.json     # Tracked macro trends
├── pipeline/
│   ├── sources/        # Source adapters (YC, TechCrunch, Product Hunt, etc.)
│   ├── llm/            # Gemini client with exponential backoff & disk cache
│   ├── daily.ts        # Main 12-step pipeline executor
│   ├── score.ts        # 5-factor signal scoring formula
│   └── validate.ts     # Zod schema, word budget, and fact-checking audit
├── src/                # Modern React + Vite application
│   ├── components/     # ItemCard, Masthead, TopThree, Spotlight, etc.
│   └── views/          # Archive, Search, Companies, Funding, Saved, etc.
└── public/             # PWA manifest, service worker, and RSS/Atom feed
```

---

## Documentation

- **[SETUP.md](./SETUP.md):** The 7 manual steps to configure and launch Lotus click-by-click.
- **[RUNBOOK.md](./RUNBOOK.md):** Troubleshooting failed runs, handling rate limits, and editing past editions.
- **[ARCHITECTURE.md](./ARCHITECTURE.md):** System architecture diagram and zero-cost design principles.
- **[METHODOLOGY.md](./METHODOLOGY.md):** Source ingestion rules and signal scoring formulation.
- **[CONTENT-STYLE-GUIDE.md](./CONTENT-STYLE-GUIDE.md):** Word budgets, banned hype words, and editorial standards.
- **[DECISIONS.md](./DECISIONS.md):** Architecture and design decision log.
