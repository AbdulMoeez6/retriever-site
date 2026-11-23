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

### Squeeze pages (campaign landing pages)

Single-offer pages with no site navigation, built on `src/layouts/SqueezeLayout.astro`. They are
`noindex` and left out of the sitemap: send campaign traffic (ads, email, QR codes) to them.

| URL | Offer | HubSpot form key |
| --- | --- | --- |
| `/demo` | Book a demo (same form as `/book-demo`) | `demo` |
| `/pilot` | Founding Partner Pilot invite request | `pilot` |
| `/readiness-check` | Five-question readiness check, then a lead form carrying the answers | `readiness-check` |

`/book-demo` also submits to `demo`, or to `pilot` when opened with `?intent=pilot`.

## Integrations

All IDs live in **`src/config/integrations.json`**. Anything left empty stays switched off and
loads nothing. With every ID empty (the default), no tracking code and no consent banner appear.
Rebuild and redeploy after changing it.

| Tool | Field | Where to find it |
| --- | --- | --- |
| Google Analytics 4 | `ga4.measurement_id` (`G-XXXXXXX`) | GA4 › Admin › Data streams › your web stream |
| Hotjar | `hotjar.site_id` | Hotjar › Sites & Organizations |
| HubSpot | `hubspot.portal_id`, `hubspot.region` (`na1` or `eu1`) | HubSpot › Settings › Account defaults |
| HubSpot forms | `hubspot.forms.demo` / `pilot` / `readiness-check` (form GUIDs) | HubSpot › Marketing › Forms › form › URL / embed code |
| Meta Pixel | `pixels.meta.pixel_id` | Meta Events Manager |
| LinkedIn Insight Tag | `pixels.linkedin.partner_id`, optional `lead_conversion_id` | Campaign Manager › Insight Tag / Conversions |
| Pinterest Tag | `pixels.pinterest.tag_id` | Pinterest Ads › Conversions |
| TikTok Pixel | `pixels.tiktok.pixel_id` | TikTok Events Manager |
| X (Twitter) Pixel | `pixels.x.pixel_id`, optional `lead_event_id` | X Ads › Events manager |
| Reddit Pixel | `pixels.reddit.pixel_id` | Reddit Ads › Events manager |

**Consent.** `consent.enabled` (on by default) shows a banner whenever a cookie-setting tool is
configured: Accept all / Reject all / Customize, with two categories.
- **Analytics:** GA4 and Hotjar.
- **Marketing:** HubSpot tracking and the ad pixels.

GA4 uses Google Consent Mode v2: it loads on every page in cookieless "denied" mode and is upgraded
when the visitor accepts. Hotjar, HubSpot tracking and the pixels load only after consent for their
category. The choice is saved in `localStorage` (`retriever-consent`). "Cookie settings" in the
footer reopens the banner. Set `consent.privacy_url` to link your privacy policy from the banner;
add one before collecting leads.

**HubSpot forms.** The site keeps its own designed forms and posts them to HubSpot's Forms
Submission API (`src/lib/hubspot.js`). Create one HubSpot form per key containing these contact
properties: `firstname`, `lastname`, `email`, `company`, `jobtitle`, `message`. The full name is split
into first and last name. Organization goes to `company`. The preferred demo time, the pilot request
and the readiness-check answers go into `message`. Until a form's GUID is set, that form behaves as a
sample form and sends nothing.

**Events sent** (`src/lib/analytics.js`):
- `generate_lead` (GA4) plus each platform's lead event on every form submission: Meta `Lead`,
  LinkedIn conversion, Pinterest `lead`, TikTok `SubmitForm`, X event, Reddit `Lead`.
- `quick_assessment_complete`
- `readiness_check_complete`
- `video_play`

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
