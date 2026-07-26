# Darkroom.id

A photo gallery + photography journal (gear reviews, tutorials, editing guides),
being built toward Google AdSense approval. See `../google-adsense.md`,
`../PRD-google-adsense.md`, `../TRD-google-adsense.md`, and
`../GAP-ASSESSMENT-home.md` for the full context — this README covers the
codebase only.

## What's here vs. what's new

This started as an existing photo-portfolio theme (galleries, collections,
gear list, real original photography by Andrea Ross) with **no article/blog
system, no AdSense compliance infrastructure, and no analytics/consent** — see
`../GAP-ASSESSMENT-home.md` for the full before/after. This pass added, without
touching the existing galleries:

- An `articles` Content Collection (`src/content.config.ts`) with a build-time
  media-rights gate, mirroring the schema in `TRD-google-adsense.md §11.1`.
- A `/journal` section (`src/pages/journal/`) — listing, per-article, and
  per-cluster pages — for the three confirmed clusters: **Gear Reviews & Buying
  Guides**, **Tutorials & Techniques**, **Editing & Post-Processing**.
- Four trust pages (`src/otherPages/about.md`, `privacy-policy.md`, `contact.md`,
  `disclosure.md`) using the site's existing dynamic-page mechanism — no new
  routing needed, they render at `/about`, `/privacy-policy`, `/contact`,
  `/disclosure` automatically.
- `public/ads.txt`, `public/robots.txt` (the `public/` directory didn't exist
  before this).
- Consent management (`src/components/ConsentScripts.astro` +
  `public/klaro-config.js`) — Klaro (self-hosted, MIT-licensed, IAB TCF
  v2.2-compatible) + Google Consent Mode v2 defaults, wired into `BaseHead.astro`.
- GA4 (`gtag.js`, consent-gated) and a Search Console verification meta tag,
  both in `ConsentScripts.astro` / `BaseHead.astro`, configured via `.env`.
- `src/components/AdSlot.astro` — the only place ad markup is emitted, soft-gated
  behind `PUBLIC_ADSENSE_ENABLED` so nothing renders until trust pages + the
  full article set are live.
- `scripts/check-content.mjs` — word count / media-rights / placeholder-text QA.
- `.github/workflows/deploy.yml` + `deploy/Caddyfile` — CI build/check + a
  VPS deploy stub (deploy step disabled until secrets are configured).
- `docs/account-health-log.csv` — monthly AdSense/GA4/Policy-Center tracking
  template.
- **Fixed a real bug**: `.gitignore` blanket-ignored the entire `public/`
  directory, which would have silently excluded `ads.txt`, `robots.txt`, and the
  Klaro config from git.

## Getting started

```sh
npm install
cp .env.example .env   # fill in real GA4/AdSense/Search Console values as you get them
npm run dev             # local dev server
npm run build            # outputs to dist/
npm run preview           # serve the production build locally
npm run check-content    # content QA report
```

## Adding a real article

Copy `src/articles/_TEMPLATE.md` to a new filename (no leading underscore — files
starting with `_` are excluded by the glob loader) and fill it in. Three draft
articles already exist as a starting point — **all still `draft: true`, because
they contain `[ANDREA: ...]` placeholders for firsthand opinion that only the
real author can fill in**:

| File | Cluster | Real gear/photo already wired in |
|---|---|---|
| `panasonic-lumix-gx85-review.md` | Gear Reviews & Buying Guides | Real specs for the Lumix GX85 (actually owned, per `Gears.astro`); hero image is a real digital-gallery photo |
| `how-to-shoot-film-burns.md` | Tutorials & Techniques | Built around the real "Burn Film" analog photo already in the gallery |
| `black-and-white-conversion-workflow.md` | Editing & Post-Processing | Built around a real black-and-white analog photo already in the gallery |

None of these count toward the ≥15-article submission bar yet — they're
structurally complete drafts, not finished, original commentary. Run
`npm run check-content` after filling in the `[ANDREA: ...]` sections and
flipping `draft: false`; it flags thin content, unresolved placeholder text, and
missing media-rights records.

## What still needs a decision or real input

- **Firsthand opinion** in the three draft articles above (marked inline).
- **About page bio** (`src/otherPages/about.md`) — has a TODO comment for real
  background/experience details.
- **Contact email** — currently the real Gmail address already in `siteData.ts`;
  consider a dedicated `@darkroom.id` inbox instead (noted inline).
- **GA4 property + AdSense account** — fill in `.env` once created; the AdSense
  snippet stays disabled (`PUBLIC_ADSENSE_ENABLED=false`) until the soft-gate
  criteria are met.
- **Git hosting + VPS deploy secrets** — `.github/workflows/deploy.yml`'s deploy
  step is disabled until `VPS_HOST`/`VPS_USER`/`VPS_SSH_KEY`/`VPS_DEPLOY_PATH`
  secrets are set.
- **Favicon set** — `public/favicons/favicon.svg` is a placeholder; the PNG/ICO
  variants `BaseHead.astro` references still need generating (e.g. via
  realfavicongenerator.net, per its own code comment) since those are binary
  assets outside what this pass could produce.
- **Lighthouse/Core Web Vitals** — plausible given the existing image-optimization
  tooling, but unverified; a photo-gallery site carries more LCP/CLS risk than a
  text-first blog, so measure before assuming it clears the ≥90 bar.
