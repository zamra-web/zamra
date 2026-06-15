# Zamra Travels — Project Agent Guide

## 📚 Documentation Index

| Document | Contents |
|---|---|
| **[AGENTS.md](./AGENTS.md)** ← you are here | Build system, file structure, AI agent rules |
| **[WEBSITE.md](./WEBSITE.md)** | Public website — pages, features, Firestore reads, styling |
| **[DASHBOARD.md](./DASHBOARD.md)** | Admin dashboard — all tabs, Firebase backend, schema, Cloud Functions, rules |

---

## Overview

Zamra Travels is a premium flight booking and travel services web portal with a full Firebase backend. It has two main surfaces:

1. **Public Website** (`web/index.html`) — Live flight search, sectors, services. Read-only Firestore. See [WEBSITE.md](./WEBSITE.md).
2. **Admin Dashboard** (`web/admin.html`) — E-Ticket Generator, Poster Generator, CRUD for agents/sectors/airlines/fares, reports. Firebase-integrated with Cloud Functions. See [DASHBOARD.md](./DASHBOARD.md).

**Live URL:** https://www.zamratravels.com/  
**Firebase Project:** `zamra-web-01` (Blaze plan)

---

## Build System & Core Tech

| Layer | Technology |
|---|---|
| Build Tool | **Vite 5** |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite` plugin) |
| JavaScript | Vanilla ES Modules (no frontend framework) |
| Database | **Firebase Firestore** |
| File Storage | **Firebase Storage** (us-east region) |
| Backend Logic | **Firebase Cloud Functions** (Node.js 22, asia-south1) |
| Auth | **Firebase Auth** (Email/Password + `admin` custom claim) |
| Hosting | **Firebase Hosting** |
| Poster Export | **html2canvas 1.4.1** + **jsPDF 2.5.1** (loaded via CDN in `admin.html`) |

**Build commands:**
```bash
cd web && npm run dev      # local dev server → http://localhost:5173
cd web && npm run build    # production build → web/dist/
```

**Install commands (first-time or after cleanup):**
```bash
cd web && npm install
cd functions && npm install
```

> Functions expect **Node.js 22**. Use Node 22 locally to avoid engine warnings.

**Deploy commands:**
```bash
# Frontend is on Vercel: push to Git to trigger an automatic frontend deployment.
# Backend (Firebase) from zamra/ root:
npx firebase-tools@latest deploy --only functions,firestore,storage
# If CLI targets the wrong project, add: --project zamra-web-01
```

---

## Repository Structure

```
zamra/                              # Firebase project root — run firebase CLI from here
├── AGENTS.md                       # ← This file (AI agent rules + project index)
├── WEBSITE.md                      # Public website documentation
├── DASHBOARD.md                    # Admin dashboard + Firebase backend documentation
├── firebase.json                   # Firebase services config
├── firestore.rules                 # Firestore security rules
├── firestore.indexes.json          # Compound indexes for agent_fares
├── storage.rules                   # Firebase Storage security rules
├── .firebaserc                     # Links CLI → zamra-web-01 project
│
├── functions/                      # Cloud Functions (Node.js 22)
│   ├── index.js                    # bulkDeleteFares, bulkToggleAgentVisibility,
│   │                               # bulkToggleSectorVisibility, bulkSyncAgentCommission,
│   │                               # generateAgentReport (callable),
│   │                               # ingestFaresFromN8n (HTTPS onRequest)
│   └── package.json                # firebase-admin, firebase-functions
│
├── scripts/                        # One-off maintenance scripts
│   ├── delete-hajj-umrah-tours.cjs # Cleanup helper for legacy tours data
│   ├── migrate-storage-urls.cjs    # Bulk migrate Storage URLs + copy objects to new bucket
│   ├── remove-processing-time.cjs  # REST-based cleanup: removes `processingTime` from visa docs
│   ├── remove-processing-time.js   # Admin SDK variant (legacy)
│   └── set-admin-claim.cjs         # Set admin custom claim by email/uid
│
└── web/                            # ★ Vite project root — all website/dashboard code
    ├── index.html                  # Public homepage
    ├── login.html                  # Admin login
    ├── admin.html                  # Admin dashboard
    ├── visa.html                   # Visa services page
    ├── tours.html                  # Tours listing page
    ├── hajj-umrah.html             # Hajj & Umrah packages page
    ├── vite.config.js              # Multi-page Vite config
    ├── package.json                # vite, tailwindcss, firebase SDK
    │
    ├── public/assets/              # Static assets (images, icons) — all local
    │
    └── src/
        ├── styles/
        │   ├── web/style.css       # Public site CSS — Tailwind @theme design tokens
        │   └── admin/style.css     # Admin-specific CSS
        └── js/
            ├── web/main.js         # Public site logic (flight search, UI)
            ├── web/visa.js         # Visa page logic (tabs, card render, modal)
            ├── web/tours.js        # Tours listing (fetch, filter chips, search)
            ├── web/hajj-umrah.js   # Hajj & Umrah page (fetch, filter, render grid)
            ├── web/site-chrome.js  # Shared header/nav + mobile menu behavior
            └── admin/
                ├── firebase-config.js  # Firebase init (auth, db, storage, functions)
                ├── auth.js             # Auth state helpers
                ├── login.js            # Login page
                ├── db.js               # ★ All Firestore + Storage operations
                ├── video-export.js     # Video poster export (Canvas + MediaRecorder)
                └── main.js             # ★ All dashboard tab controllers
```

---

## Repository Hygiene

- `web/dist/` is generated by Vite and should not be committed.
- `node_modules/` (root, `web/`, `functions/`) are generated — reinstall as needed.
- Local caches/logs to ignore: `.firebase/`, `.vercel/`, `firebase-debug.log`, `.DS_Store`.
- Legacy `web/seed.html` has been removed; use the scripts in `scripts/` or the admin UI for seeding.

---

## Instructions for AI Agents

### General Rules
- **Context first:** Always read [WEBSITE.md](./WEBSITE.md) or [DASHBOARD.md](./DASHBOARD.md) before working on a specific surface.
- **Styling:** Use **Tailwind CSS v4** utility classes exclusively. Do not write vanilla CSS unless absolutely necessary (place it in `style.css` inside `@layer components`).
- **Modularity:** Keep logic in `src/js/`. Do not write heavy inline `<script>` or `<style>` in HTML files.
- **No direct Firebase SDK calls in `main.js`** — always go through `db.js`.
- **Update docs:** Whenever you make significant structural changes, update the relevant `.md` file.

### Working on the Public Website
- Edit `web/index.html`, `web/visa.html`, `web/tours.html`, `web/hajj-umrah.html`,  
  `web/src/js/web/main.js`, `web/src/js/web/visa.js`, `web/src/js/web/tours.js`,  
  `web/src/js/web/hajj-umrah.js`, `web/src/styles/web/style.css`
- Use `initSiteChrome()` from `web/src/js/web/site-chrome.js` for header/nav + mobile menu behavior
- Keep header/nav styling consistent via `site-header`, `site-nav-link`, and `btn-primary` classes in `web/src/styles/web/style.css`
- Reference images as `/assets/img/filename` (served from `web/public/assets/img/`)
- Do **not** add external image URLs — add images to `web/public/assets/img/` instead

### Working on the Admin Dashboard
- Edit `web/admin.html`, `web/src/js/admin/main.js`, `web/src/styles/admin/style.css`
- All data operations go through `web/src/js/admin/db.js`
- Bulk operations use Cloud Functions via `callXxx()` wrappers in `db.js`
- Use the `openModal(title, html, wide = false)` helper in `main.js` for any new modal forms. Pass `wide = true` for forms that need extra width (currently: Tours). This toggles the modal between `max-w-lg` (default) and `max-w-2xl`.
- Use the `toast(type, title, msg)` helper for all user feedback
- Admin has a **light/dark theme toggle** (persisted to `localStorage`) that sets `data-theme` on `<html>` — keep new UI compatible with both modes.

### Working on Cloud Functions
- Functions live in `functions/index.js`
- Callable (onCall) functions are HTTPS Callable and require `admin: true` custom claim
- `ingestFaresFromN8n` is an HTTPS onRequest endpoint secured via Bearer token (n8n → Firestore ingest)
- Deploy with: `npx firebase-tools@latest deploy --only functions`

### Security Rules
- Firestore rules are in `firestore.rules` at the project root
- Storage rules are in `storage.rules` at the project root
- Validate with: `npx firebase-tools@latest firestore:rules` before deploying

---

## Asset Management

- **All images are local** — stored in `web/public/assets/img/`
- External images were migrated into `web/public/assets/img/` (no external image URLs)
- Reference in code as `/assets/img/filename.jpg`
- **Shared hero background**: use `/assets/img/hero-banner-bg.png` for hero overlays (Tours, Hajj/Umrah, and admin header background).
- Airline/agent logos are uploaded to **Firebase Storage** via the admin dashboard and stored as URLs in Firestore
- **Country flag images** for the Visas tab are stored in `country_flags/` in Firebase Storage — same pattern as `airline_logos/`
- **Tour cover images** are uploaded via the Tours tab and stored in `tour_images/` in Firebase Storage — URL saved as `coverImageUrl` on the Firestore `tours` document
- **Hajj & Umrah cover images** are uploaded via the admin dashboard and stored in `hajj_umrah_images/` in Firebase Storage.
- **Favicon updates**: update `/assets/img/favicon.webp` and bump the query param (e.g. `?v=3`) in all HTML `<link rel="icon">` references to force cache refresh.

---

## Mobile Optimisation

- Responsive layouts via Tailwind `md:` and `max-sm:` breakpoints
- Mobile hamburger nav uses vanilla CSS in `@layer components` in `web/src/styles/web/style.css`
- Mobile nav open state locks body scroll via `nav-open` and closes automatically on resize in `web/src/js/web/site-chrome.js`
- Admin dashboard is desktop-first but remains usable on tablet and small screens (tightened spacing + touch-friendly controls)
- **Public tours + Hajj/Umrah modals** use a bottom‑sheet layout on mobile for better thumb reach and scrolling.
- **Flight Details modal + live flight results** switch to card layouts on mobile to avoid horizontal scrolling.

---

## Key Gotchas for AI Agents

- **`firebase.json` is at the `zamra/` root**, not inside `web/`. Always run firebase CLI from `zamra/`.
- **Frontend Hosting** is on Vercel (`www.zamratravels.com`). Pushing to Git will auto-deploy the site. Do not use `firebase deploy --only hosting` for the primary frontend.
- **Vercel Hobby deploys are author‑gated** — if the commit **author** doesn’t have access to the Vercel project, deployments are blocked. Ensure the local Git author is set to the owning account before pushing.
- **Vite config is inside `web/`** — build and dev commands run from `web/`.
- **Admin security** depends on the `admin: true` Firebase custom claim — without it, all Firestore writes are blocked even when authenticated.
- **Firestore indexes** — complex queries on `agent_fares` require the indexes in `firestore.indexes.json`. Deploy them before testing queries.
- **Cloud Functions region** is `asia-south1` — this matches the `getFunctions(app, 'asia-south1')` call in `firebase-config.js`. Do not change one without changing the other.
- **Poster export relies on CDN scripts** — `html2canvas` and `jsPDF` are loaded via `<script>` tags in `admin.html` (not npm). Do not import them via ES modules.
- **Airline logos in posters** — `renderPoster()` is `async` and pre-fetches all logos as `blob:` URLs using `fetch()` before building HTML. This sidesteps Firebase Storage CORS for `html2canvas`. Never reintroduce external image URLs (e.g. `weserv.nl` proxy) inside the poster HTML — it breaks canvas export.
- **Poster date floor** — poster generation always clamps the start date to today (even if the input is blank or earlier) to avoid expired fares; keep this behavior intact.
- **Poster dedupe normalization** — posters and poster videos normalize airline + flight time before deduping so duplicates across agents collapse to the cheapest fare.
- **Poster theme variety** — poster exports (JPEG/PDF + video) now generate brand‑safe palettes on the fly (effectively infinite). Do not revert to deterministic per‑sector coloring; the variety is intentional for social sharing.
- **Poster footer contact** — keep the poster footer phone as `+91 9846606739` in both HTML posters and video exports.
- **Poster video slideshow** — if a route spans multiple pages, the video export merges them into one clean poster-page slideshow. Do not re‑introduce per‑page video exports for the same route.
- **Poster video progress** — the Poster UI shows an inline progress pill during video rendering; keep it in sync with generation status.
- **Poster social publishing is Gulf region-driven** — the admin poster page has a compact Social Publishing strip for `Saudi`, `UAE`, `Qatar`, and `Oman`. Selecting a Gulf region reveals the Images/Videos queue actions, and they use the selected date range, not the current preview stack or sector dropdown.
- **Social matching is Gulf-side only** — poster social batching should only include sectors where exactly one side is one of the Gulf regions (`Saudi`, `UAE`, `Qatar`, `Oman`). The publishing bucket must always be the Gulf region, regardless of direction, and non-India routes must stay excluded.
- **Buffer posting is per-Gulf-region** — `social_queue` docs must carry `marketKey`, and the Cloud Function resolves region-specific Buffer secrets/channel IDs from code. The placeholder channel IDs in `functions/buffer/marketConfig.js` plus the Firebase secrets `BUFFER_API_KEY_SAUDI`, `BUFFER_API_KEY_UAE`, `BUFFER_API_KEY_QATAR`, and `BUFFER_API_KEY_OMAN` must be replaced with real values before live posting can succeed.
- **Social publishing skips Buffer verification calls** — do not reintroduce organization lookups, channel verification, or other non-posting Buffer API calls in the live queue path; the daily API cap is reserved for `createPost` calls only.
- **Image batching is feed-only** — Queue Images should create standard Instagram/Facebook feed posts only, with no story variants.
- **Gulf image posting is airport-carousel based** — a single Gulf region Images click should create up to 5 airport carousels only (`Calicut`, `Kochi`, `Kannur`, `Trivandrum`, `Mangalore`), each capped at 10 images, so one Gulf region run stays at a maximum of `10` Buffer `createPost` calls.
- **jsPDF access** — the CDN UMD bundle exposes `window.jspdf.jsPDF`. The code also falls back to `window.jsPDF`. If upgrading jsPDF, verify the UMD global name hasn't changed.
- **CSV export in Reports** — `downloadReportCSV()` reads `_reportFares` (module-level variable). It always exports the full current filtered set, not just the current pagination page. IDs are resolved to names using the in-memory `_agents`, `_sectors`, `_airlines` caches.
- **Reports tab card split** — The fares table card (`bg-white rounded-2xl`) lives in the static `admin.html`. `renderReportFaresTable()` injects only the `<table>` + `#reportFares-pagination-footer` into `#report-fares-results`. Do **not** re-introduce an inner card wrapper in `renderReportFaresTable()` — the outer card already provides the border/shadow/header.
- **Reports pagination bug (fixed)** — `renderReportFaresTable()` must do its own sort + slice. Do **not** pipe the fares array through `applySortAndFilter()` (which also applies `tableLimit` slicing) — doing so double-slices the data and breaks pagination beyond page 1.
- **Reports SVG Charts & Leaderboards** — The Bar and Donut charts in the Reports tab natively render via raw SVG generation in `main.js` and are theme‑aware (dark mode colors + labels). Do **not** introduce external charting libraries (Chart.js, D3, etc.) to keep the bundle lightweight. Leaderboards use array sorting and generic Tailwind progress bars.
- **E-Ticket Generator Output** — The ticket preview strictly uses native HTML/CSS and relies on the browser's native `@media print` rules for generating high-quality PDFs without external heavier canvas libs. This ensures crispy vectors over blurred raster images.
- **`wireXxxActions()` functions must bail early, not re-wire** — All `wireVisaActions`, `wireVisaStampingActions`, `wireAttestationActions`, `wirePassportServiceActions`, `wireSectorActions`, `wireAirlineActions`, `wireTourActions`, `wireHajjUmrahActions` guard with `if (!tbody || tbody.dataset.actionsWired) return;`. Do **not** use the `delete tbody.dataset.actionsWired` + re-set pattern — it bypasses the guard and stacks a new `addEventListener` on every render, causing N confirm dialogs and N toast messages for a single click after N tab refreshes.
- **Visa page styles in `visa.html`** — The premium visa page styles live in a `<style>` block co-located inside `visa.html`, not in `style.css`. This is intentional: they are numerous and only apply to that one page. Design tokens from `style.css` (`--color-primary`, etc.) are still used.
- **Tours itinerary uses a dynamic day-builder UI** — The `itinerary` field on `tours` documents is stored as `Array<{day: string, activities: string[]}>`. The admin modal now uses a card-based builder (Add Day / Remove Day buttons) exactly like the E-Ticket passenger manifest — **do not reintroduce a raw JSON textarea**. Helper functions `_tourItineraryDayHtml`, `_syncTourDayNumbers`, and `_readTourItinerary` in `main.js` manage the UI and serialise the data on submit.
- **Admin modal is scrollable** — `#modal-body` has `overflow-y-auto` and the dialog caps at `max-h-[90vh]`. The header is sticky and stays pinned; the footer uses a sticky gradient to keep primary actions visible. Do not add a fixed height or overflow to `#modal-body` — it is already handled.
- **Tours and Hajj/Umrah listings only show `isActive === true`** — by default filter for active packages on public pages. The admin dashboard fetches all packages to show all entries including hidden ones.
- **Hajj/Umrah public fetch must NOT use `orderBy` alongside `where`** — `hajj-umrah.js` fetches with `where('isActive','==',true)` only (no `orderBy`). Adding an `orderBy` on a different field would require a Firestore composite index that doesn't exist and would silently return empty results. Sort is done **client-side** after fetch.
- **"All Sectors" poster/report queries require the `isHidden + flightDate` index** — When no `sectorId` or `agentId` equality filter is in the query (i.e. the user selected "All Sectors" and "All Agents"), Firestore must use the `isHidden + flightDate` composite index to execute `where('isHidden','==',false) + orderBy('flightDate')`. This index exists in `firestore.indexes.json` and is deployed. If it ever goes missing, the query will fail with "query requires an index" at runtime.
- **Reports tab: all filters are fully optional** — The `generateAgentReport` Cloud Function and the frontend `renderReportsTab` no longer enforce a minimum filter. Passing `sectorId='all'`, `agentId='all'`, and no date range is valid and will aggregate across the entire `agent_fares` collection. Do **not** re-introduce a guard that requires at least one filter to be set.
