# Retriever website

Marketing site and product preview for **Retriever**: identify the opportunity, validate the evidence, advance the technology.

Built with React 18, Vite 5, Tailwind CSS 3 and React Router 6, with an optional minimal Express server.
**Sample data only.** Nothing is saved or sent anywhere: the Book a demo form, sign-in and all dialogs run in the browser.

## Branches

| Branch | Purpose |
| --- | --- |
| `gh-pages` | Live site, published by GitHub Pages. Only finished, approved work goes here. |
| `demo` | New ideas and work in progress. Not published. |

## Project layout

```
.
├── index.html              # built single-file site served by GitHub Pages (npm run build:pages)
├── package.json            # root scripts: dev, build, build:pages, start
├── client/                 # Vite + React + Tailwind app
│   ├── index.html
│   ├── vite.config.js      # normal build -> dist/, `--mode singlefile` -> one self-contained file
│   ├── tailwind.config.js  # navy brand tokens, Hanken Grotesk + IBM Plex Mono
│   ├── scripts/build-pages.mjs
│   └── src/
│       ├── main.jsx        # router selection, fonts bundled locally (no CDN)
│       ├── App.jsx         # routes
│       ├── index.css       # Tailwind layers, theme, glass frames, motion
│       ├── assets/         # logo, favicons, videos and posters
│       ├── data/           # sample data and navigation
│       ├── lib/            # store, motion hooks, format and browser helpers
│       ├── components/     # navbar, sidebar, top bar, charts, video frames, overlays …
│       └── pages/          # landing, book a demo, sign in, shared roadmap, dashboard pages
└── server/                 # optional Express server for local hosting (GET /api/health)
```

## Run locally

Requires Node 18+.

```bash
npm install          # installs root, client and server dependencies
npm run dev          # Vite on http://localhost:5173 + Express on :3001
npm run build        # builds client/dist
npm start            # serves client/dist at http://localhost:3001
```

## Publish to GitHub Pages

```bash
npm run build:pages  # writes the self-contained site to ./index.html
```

The site uses hash URLs (`#/book-demo`, `#/app/readiness`, …) and inlines its fonts, styles, images and videos,
so it works from the repository sub-path (`https://<org>.github.io/retriever-site/`) and when opened straight from disk.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing: editorial hero, readiness video, dashboard preview, "See Retriever in action" showcase (original and new demo videos; all autoplay muted and loop, poster only with reduced motion) |
| `/book-demo` | Book a demo (`?intent=pilot` for the pilot invite variant) |
| `/signin` | Sample sign-in (any email and password) |
| `/shared-roadmap` | Read-only roadmap view |
| `/app/mission-command` | Dashboard: technology snapshot and the 7-step pilot workflow |
| `/app/opportunities` | Opportunity pipeline (Matched → Awarded) and funding matches |
| `/app/readiness`, `/app/readiness-gaps`, `/app/action-plan` | TRL · MRL · IRL with evidence, readiness gaps and readiness actions |
| `/app/knowledge-base`, `/app/commercialization` | Document uploads and opportunity records; Commercialization Trail |
| `/app/technology-profile`, `/app/team` | Four-step Technology Profile; team seats, roles and activity |
| `/app/readiness-questionnaire`, `/app/evidence-reasoning`, `/app/proposal-assistant` | 12-section questionnaire, qualitative findings, proposal template preview |
| `/app/settings` | Plan usage (no prices) and appearance |

Earlier dashboard paths (`/app/evidence`, `/app/funding`, `/app/roadmap`, `/app/action-planning`, `/app/profiles`) redirect to their new pages.
The dashboard uses a fictional organization (Acme Labs). Use "Start a new technology" in the page-header Technology selector to see the empty pilot state.
Tables switch between Table, Cards or Board views, and charts switch type (line, area, bar or donut), grouping and range, or can be hidden. Choices are remembered on the device where storage is available.
Motion (fade-ins, count-up, bar fills) is turned off under `prefers-reduced-motion`, and the landing stays visible without JavaScript.

## Content rules

This repository is public. Do not commit unapproved commercial terms, passwords, keys, `.env` files or client documents.
