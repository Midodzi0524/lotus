# ARCHITECTURE: Lotus Daily Intelligence Brief

Lotus employs an ultra-lean, **zero-cost static architecture** pairing serverless GitHub scheduled actions with client-side reactive rendering.

---

## Architecture Flow Diagram

```mermaid
flowchart TD
    subgraph Scheduled Execution [GitHub Actions at 05:00 UTC]
        A[Collect: 8 Sources + Feeds] --> B[Normalize & Deduplicate]
        B --> C[Gemini Flash: Batch Extraction & Scoring]
        C --> D[Adversarial Fact-Check & Word Budget Audit]
        D --> E[Write JSON: data/editions/YYYY-MM-DD.json]
        E --> F[Vite Static Build: npm run build]
    end

    subgraph Persistence [Repository Storage]
        E --> G[(data/editions/)]
        E --> H[(data/index.json)]
        E --> I[(data/cache/)]
    end

    subgraph Edge Distribution [GitHub Pages CDN]
        F --> J[Deploy to GitHub Pages]
        J --> K[Public Static Web App]
    end

    subgraph Client-Side Browser [Zero Server Runtime]
        K --> L[Browse vs Read Mode Toggle]
        K --> M[In-Place Native Card Expansion]
        K --> N[Client-Side Search Index]
        K --> O[Offline PWA Storage & Bookmarks]
        K --> P[Web Speech TTS Listen Audio]
    end
```

---

## Core Principles

1. **Zero Recurring Infrastructure Cost ($0.00):**
   - GitHub Actions compute: Free tier (public repository).
   - GitHub Pages hosting: Free tier (unlimited bandwidth for reasonable static assets).
   - Google Gemini API: Free tier (Flash model with rate-limit batching).
   - Database: Plain versioned JSON files committed to Git.

2. **Decoupled Visitor Experience:**
   - Website visitors **never** trigger LLM calls or server compute.
   - All AI synthesis is precomputed at build time. The user loads static JSON in milliseconds.

3. **Deterministic Verification:**
   - Every number, entity, and funding round must exist in raw source excerpts.
   - An adversarial verification step flags any hallucinated claims before publishing.
