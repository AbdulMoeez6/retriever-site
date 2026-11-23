# Retriever — Astro site (Pinwheel-based)

The Retriever marketing site and sample workspace, migrated from the single-file
`Retriever_Template.html` build into a static [Astro](https://astro.build) site that uses the
[Pinwheel Astro](https://github.com/themefisher/pinwheel-astro) template as its foundation.

- **Pinwheel provides** the layout system and architecture: `Base` layout, header and footer
  partials, CTA band, page header with breadcrumb, Bootstrap-style `row`/`col` grid, `btn` styles,
  pricing card structure, theme tokens in `src/config/theme.json`, and content collections.
- **Retriever provides** the identity and everything on the pages: navy palette, Hanken Grotesk and
  IBM Plex Mono fonts, aurora/dot-grid backgrounds, glass video frames, all copy, sample data and
  every interactive feature.

## Run it

Requires Node 18.20+ (tested on Node 24).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/ locally
```

## Deploy

`npm run build` produces a fully static `dist/` folder. Upload it to any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3...). Before deploying:

- Set `site.base_url` in `src/config/config.json` to the real domain (used for canonical URLs, Open
  Graph tags and the sitemap).
- If the site is served from a sub-path (e.g. GitHub Pages project URL `/retriever-site/`), set
  `site.base_path` too.

## Pages

| Original route (SPA) | Astro page | Pinwheel structure used |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Base layout, banner (hero), CTA band, footer |
| `/pricing` | `src/pages/pricing.astro` | Page header + breadcrumb, pricing cards grid |
| `/book-demo` (`?intent=pilot`) | `src/pages/book-demo.astro` | Contact page layout (intro + form columns) |
| `/signin` | `src/pages/signin.astro` | Sign-in layout (form + gradient banner) |
| `/shared-roadmap` | `src/pages/shared-roadmap.astro` | Page header + breadcrumb |
| `/app` | redirect → `/app/mission-command` (`astro.config.mjs`) | — |
| `/app/<screen>` (9 screens) | `src/pages/app/[screen].astro` | Own workspace layout (`AppLayout.astro`) |
| unknown routes | `src/pages/404.astro` (redirects home, like the original) | Pinwheel 404 |

## Features carried over

- Light/dark theme toggle, remembered in `localStorage` (`retriever-theme`), applied before paint.
- Hero and product videos: scroll reveal, pointer tilt, hover to play (tap / Enter / Space on touch
  and keyboard).
- Live dashboard preview on the homepage (greeting, KPI count-up, readiness chart).
- Five-question quick assessment (homepage and Readiness screen).
- Pricing monthly/annual toggle with the sliding pill and price-swap animation; "Contact sales"
  toasts; Founding Partner Pilot link to `/book-demo?intent=pilot`.
- Book-a-demo form: same validation rules and messages, time-slot radio chips, pilot copy variant,
  animated success state. Nothing is sent (sample page, as before).
- Sample sign-in (any email + password) into the workspace.
- Workspace: sidebar, search (⌘/Ctrl+K), notifications, Mission Command, Readiness, Opportunities,
  Evidence (filters, upload), Funding (filters, CSV export), Roadmap (Gantt, share link), Action
  planning (add, toggle status), Profiles (add, detail tabs), Settings (usage limits, theme,
  sign-out), detail drawers, modals, Escape to close, toasts.

## Architecture notes

```
src/
  config/            site config, menu, theme tokens (Pinwheel pattern)
  content/           homepage + pricing content collections
  layouts/
    Base.astro       marketing layout (Pinwheel)
    AppLayout.astro  workspace layout
    partials/        Head, Header, Footer, Cta
    components/      Logo, PageHeader, PricingCard, ThemeToggle, VideoShowcase
    function-components/
      app/           React workspace: AppShell, shell/, screens/, ui/
      DashboardPreview.jsx, QuickAssessmentLauncher.jsx  homepage islands
  lib/               store (workspace state), sample data, formatting, theme, toast, session
  scripts/           plain JS for marketing pages (site, pricing, book-demo, video-showcase)
  styles/            Pinwheel CSS layers + retriever.css (brand components/animations)
public/              images, videos, favicon
```

- Marketing pages are plain Astro + small vanilla scripts; React loads only where the original
  app's React components are reused (dashboard preview, quick assessment, shared roadmap, workspace).
  React is already part of the Pinwheel template (`@astrojs/react`).
- The original was one in-memory single-page app. Each route is now a real static page, so the
  workspace state (added actions/documents/profiles, selected technology, filters, sign-in flag) is
  kept in `sessionStorage` (`src/lib/store.js`) and survives navigation within the tab.
- Single-file packaging workarounds from the original (hash-router fallback, data-URI video to blob
  conversion, form-submit shim for sandboxed previews) are no longer needed and were dropped; assets
  are real files in `public/`.
- The workspace sidebar becomes a slide-over menu below 1024px so the workspace works on phones and
  tablets.
