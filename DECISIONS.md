# DECISIONS LOG: Architecture & Product Tradeoffs

This document logs all key engineering and product choices made during the construction of Lotus.

---

### Decision 1: React SPA with Static Data vs SSR Server
- **Choice:** React 19 + TypeScript + Vite SPA reading versioned static JSON.
- **Rationale:** Preserves zero recurring hosting costs ($0/mo) on GitHub Pages, eliminates runtime server failure modes, and makes the entire editorial archive inspectable directly within the Git repository.

### Decision 2: Native `<details>` for Expand-in-Place Cards
- **Choice:** Native HTML5 `<details>` and `<summary>` tags rather than complex JavaScript accordion state.
- **Rationale:** Works with zero JS overhead, supports assistive screen readers natively, preserves memory, and allows instant global expansion via the `open` attribute during Read mode toggle.

### Decision 3: Local Device Storage vs Cloud Authentication
- **Choice:** Browser `localStorage` with JSON export/import and zero account registration.
- **Rationale:** Guarantees absolute reader privacy (no user tracking or database vulnerabilities) and eliminates the need for user auth databases or paid infrastructure.

### Decision 4: Gemini Flash Free-Tier with Rate-Limit Disk Cache
- **Choice:** Batching 10 items per request, 2,200ms delays, and sha256 input-hash caching in `data/cache/`.
- **Rationale:** Strictly respects the 15 RPM limit on Gemini Free Tier without incurring API expenses.

### Decision 5: Programmatic Typographic SVG Fallback Covers
- **Choice:** Generated SVG covers featuring company initials and sector palette colors for stories lacking clean external images.
- **Rationale:** Guarantees no item ever displays broken image icons or missing graphics, while avoiding reliance on costly AI image generation tools.
