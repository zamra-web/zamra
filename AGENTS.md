# Zamra Travels — Project Agent Guide

## 📚 Documentation Index

| Document | Contents |
|---|---|
| **[AGENTS.md](./AGENTS.md)** ← you are here | Build system, file structure, AI agent rules |
| **[WEBSITE.md](./WEBSITE.md)** | Public website — pages, features, Firestore reads, styling |
| **[DASHBOARD.md](./DASHBOARD.md)** | Admin dashboard — all tabs, Firebase backend, schema, Cloud Functions, rules |
| **[mobile/README.md](./mobile/README.md)** | Android apps — the two flavours, download bridge, signing, icon generation |

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

cd mobile && ./scripts/build-apks.sh   # signed Android APKs → mobile/dist/
```

**Install commands (first-time or after cleanup):**
```bash
cd web && npm install
cd functions && npm install
cd mobile && npm install   # only needed to build the Android apps
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
│   ├── soto/                       # SOTO live fares (/soto) — provider call, cache,
│   │                               # committed places.json + airlines.json datasets
│   ├── index.js                    # bulkDeleteFares, bulkToggleAgentVisibility,
│   │                               # bulkToggleSectorVisibility, bulkSyncAgentCommission,
│   │                               # generateAgentReport (callable),
│   │                               # ingestFaresFromN8n (HTTPS onRequest)
│   └── package.json                # firebase-admin, firebase-functions
│
├── mobile/                         # Android apps (Capacitor) — see mobile/README.md
│   ├── capacitor.config.json       # Base config only; flavours override it at build time
│   ├── www/offline.html            # The one local page — shown when the network is down
│   ├── scripts/                    # build-apks.sh, build-brand-assets.mjs
│   └── android/app/src/
│       ├── main/                   # Shared shell: MainActivity, ZamraNative, SaveSession,
│       │                           # ZamraWebViewClient, res/raw/zamra_shim.js
│       ├── admin/                  # Zamra Admin: start URL, name, navy icon
│       └── b2b/                    # Zamra B2B: start URL, name, orange icon
│
├── scripts/                        # One-off maintenance scripts
│   ├── build-soto-reference.cjs    # Regenerates functions/soto/places.json + airlines.json
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
    ├── deals.html                  # Curated live-fare deal page (/deals/<slug>)
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
            ├── web/deals.js        # Deal-link page (calls getPublicDeals; no Firebase SDK)
            ├── shared/             # ★ Pure, testable logic shared across surfaces
            │   ├── airline-baggage.js    # Baggage policy (CJS mirror in functions/)
            │   ├── flight-schedule.js    # Date-ranged schedules (CJS mirror in functions/)
            │   ├── fare-text-list.js     # WhatsApp text columns + lowest-fare marker
            │   ├── fare-price-history.js # Price-drop detection (edits + re-uploads)
            │   ├── enquiry-alerts.js     # Enquiry↔fare matching + target alerts
            │   ├── visa-rate-cards.js    # B2B tourist-visa price sheets (shape + formatting)
            │   ├── b2b-offers.js         # Portal promo cards (shape + card markup; CJS mirror in functions/)
            │   └── deal-links.js         # Slug/window/chunking rules for deal links
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
- **WhatsApp logic lives in n8n, not here.** `functions/whatsapp/` only proxies and mirrors. Scheduled broadcasts use n8n's Schedule Trigger — never add a fourth `onSchedule`, which starts Cloud Scheduler billing.
- **Rate intake batches on `whatsapp_messages`, not in a queue doc.** The batch is derived at claim time by grouping `rateIntakeStatus == "pending"` by `chatId`. Do not reintroduce an append-to-`items[]` queue document: it is a hot doc, it needs a transaction on the webhook hot path, and because it would have to bucket by time it splits one supplier's screenshot burst across two vision calls — the exact failure the feature exists to prevent.
- **The intake flag is written only on `event.event === "message"`.** `SUBSCRIBED_EVENTS` carries both `message` and `message.any`, and WAHA fires both for the same id into the same doc id. Merging `"pending"` a second time resets an already-claimed message and ingests the sheet twice.
- **Never follow `whatsapp_messages.mediaUrl`.** WAHA builds it from `WHATSAPP_API_HOSTNAME`, which the VPS never sets, so the stored value is `http://localhost:3000/...` and means nothing outside that container. `wahaMediaPath()` returns the path and rejects anything outside `/api/files/` — without that allow-list a crafted `media.url` is an SSRF primitive aimed at `http://n8n:5678` from inside `n8n_default`, and the value came from a webhook payload.
- **An expired rate-intake lease marks the batch `stale` and stops.** Unlike `social_queue` it must never auto-retry: `ingestFaresFromN8n` writes a new auto-id doc per row and never dedupes, so retrying a batch that already ingested republishes every fare at whatever price the model read the second time. Retry and Discard are human buttons in the WhatsApp tab.
- **The WhatsApp intake workflow calls the `zamra-rates` webhook rather than extracting anything.** That is why the vision prompt, the closed sector/airline vocabulary and the rate band exist exactly once. `functions/tests/n8n-intake-workflow.test.js` runs the intake payload through the real `Build Vision Request` node — if the two contracts drift, that test fails instead of production.
- **The WAHA proxy projects, it does not pass through.** `GET /api/sessions/{name}` returns the session config, and that config contains `webhooks[].hmac.key` — our own webhook signing secret. `projectSession()` is an allow-list for exactly that reason; there is a test asserting the secret cannot appear in its output.
- **Webhook HMAC is computed over `req.rawBody`**, never `JSON.stringify(req.body)`. Re-serialising emits canonical JSON and drops the sender's whitespace, so the digest never byte-matches. The algorithm header must also be pinned to `sha512` — trusting it is algorithm confusion.
- **Admin tabs are deep-linkable.** Adding a tab means four edits, not two: nav link, `#admin-tab-select` option, `ADMIN_TAB_ROUTES` in `tab-routes.js`, and the `renderActiveTab()` branch. `web/tests/admin-tab-routes.test.js` enforces the first three.
- **Cloud Functions region** is `asia-south1` — this matches the `getFunctions(app, 'asia-south1')` call in `firebase-config.js`. Do not change one without changing the other.
- **Baggage weights are policy, never data** — hand and check-in allowances are derived from the airline IATA code, not from the fare row or the n8n payload. The rules live in two mirrored modules that must be edited together: `web/src/js/shared/airline-baggage.js` (ESM) and `functions/airlineBaggage.js` (CJS); paired test suites assert the full table in both. `agent_fares.baggage` is check-in kg and `agent_fares.extraBaggage` is hand kg — do not reintroduce the old "total = baggage + extraBaggage" label, they are different bags. Full table in `DASHBOARD.md`. **Display strings also come from those modules** — `formatCheckInBaggageText()`, `formatHandBaggageText()`, `formatBaggageAllowanceShort()` and `formatBaggageKg()`. Do not hand-build `${kg} KG` at a call site: the public site, B2B portal, e-ticket table and e-ticket allowance card each had their own spelling (`30 KG`, `30Kg`, `30 + 7KG`) before this was centralised.
- **Poster export relies on CDN scripts** — `html2canvas` and `jsPDF` are loaded via `<script>` tags in `admin.html` (not npm). Do not import them via ES modules.
- **Every new file export must work in the Android apps too** — the apps load the live site in a WebView, and a WebView silently ignores `<a download>` when the href is a `blob:` or `data:` URL. Nothing happens: no file, no error. `mobile/android/app/src/main/res/raw/zamra_shim.js` is injected into every page and covers the three ways this codebase clicks a download link — `link.click()`, `dispatchEvent(new MouseEvent('click'))` on a **detached** anchor (jsPDF's `saveAs`), and a real tap on an `a[download]`. If you add an export that produces files another way (`window.open`, a service worker, `showSaveFilePicker`), it will work in Chrome and do nothing in the apps until the shim is extended.
- **The Android apps point at production, not a bundled build** — `server.url` in each flavour's `capacitor.config.json` is the live URL, so a Vercel deploy reaches installed apps immediately. The upside is no APK release per web change; the catch is that a broken deploy breaks the apps too, and any change to the `/admin` or `/b2b-login` routes must keep those exact paths reachable. `mobile/tests/flavors.test.js` guards the URLs.
- **Airline logos in posters** — `renderPoster()` is `async` and pre-fetches all logos as `blob:` URLs using `fetch()` before building HTML. This sidesteps Firebase Storage CORS for `html2canvas`. Never reintroduce external image URLs (e.g. `weserv.nl` proxy) inside the poster HTML — it breaks canvas export.
- **Poster date floor** — poster generation always clamps the start date to today (even if the input is blank or earlier) to avoid expired fares; keep this behavior intact.
- **Poster dedupe normalization** — posters and poster videos normalize airline + flight time before deduping so duplicates across agents collapse to the cheapest fare.
- **Flight time survives the n8n round-trip in several shapes** — `ingestFaresFromN8n` must keep accepting split `time_start`/`time_end` *and* a combined `flight_time`/`flightTime`/`timing`/`time` key, then fall back to the configured `flight_details` value. Reading only the split keys is the bug that made every ingested fare store `''` and every poster print `—` in the Time column. Helpers are in `functions/flightTime.js` (tested in `functions/tests/flight-time.test.js`); `exportFlightDetailsForN8n` emits both shapes so either round-trips.
- **Posters fall back to `flight_details` for times** — `dedupeAndSortPosterFares()` (admin: preview, JPEG/PDF, video, social, clipboard) and `functions/poster/fetchFares.js` (daily auto-poster) resolve an empty `agent_fares.flightTime` from the configured airline+sector mapping at render time, so pre-fix rows display without a backfill. `loadGlobalData()` must keep loading `_flightDetails` or the admin fallback silently no-ops.
- **The public site and B2B portal need that fallback too** — they did not have it, which is why SpiceJet CCJ–DXB printed `TBA` on the site while the time was correctly configured in the backend. `web/src/js/web/main.js` passes `resolveFlightTime` (from `buildFlightTimeResolver()`) into `dedupeAndSortFares()`, and `getB2BFares` fills blank times before pricing. **Resolve before deduping** — flight time is part of the grouping key, so resolving afterwards groups rows that then render differently. The `flight_details` fetch is cached per page load; a failed read degrades to the fare's own value rather than blanking the list.
- **Flight-detail lookups are case-insensitive** — always key them with `buildFlightDetailKey(airlineId, sectorId)`. A fare whose `airlineId` differed only in case from its `flight_details` doc used to miss the fallback silently.
- **Date-ranged flight schedules resolve narrowest-window-first** — `flight_details.schedules[]` holds `{startDate, endDate, flightTime}` overrides of the doc's default `flightTime`. The narrowest window covering a travel date wins, ties break on the later `startDate` (so the newer schedule takes a shared changeover day), and falling through every window yields the default. Rules live in mirrored modules that must be edited together: `web/src/js/shared/flight-schedule.js` (ESM) and `functions/flightSchedule.js` (CJS), each with its own test suite. Overlaps are legal but warned about in the Flights-tab editor rather than silently resolved.
- **Poster theme variety** — poster exports (JPEG/PDF + video) now generate brand‑safe palettes on the fly (effectively infinite). Do not revert to deterministic per‑sector coloring; the variety is intentional for social sharing.
- **`ingestFaresFromN8n` creates a NEW document per row, every upload** — it calls `db.collection("agent_fares").doc()` with no ID and never updates or dedupes. Re-uploading a rate sheet therefore produces duplicate rows for the same sector+airline+date+time, and every downstream surface copes by collapsing to the cheapest. This is why a price drop cannot be read off a single document: `annotateFarePriceDrops()` in `web/src/js/shared/fare-price-history.js` handles the edit case (`previousFinalRate` + `rateChangedAt`, written by `updateFare`) *and* the re-upload case (compare each row against its strictly-older siblings in the same group). Do not "fix" the ingest to update in place without checking what depends on the duplicates.
- **Price-drop detection must see every loaded row, not the filtered view** — the older row that proves a drop is frequently filtered out. `getDatabaseDropMap()` runs over all of `_databaseFares` and caches against the **array identity**, which is only safe because that array is always reassigned, never mutated in place. Keep it that way.
- **WhatsApp text formatting has two hard rules** — the lowest-fare marker goes at *end of line* (a prefix shifts every column out of alignment inside the ``` fence), and the bold `🔥 *LOWEST: …*` summary must sit *outside* the fence, because WhatsApp does not render `*bold*` inside a code block. Both live in `web/src/js/shared/fare-text-list.js`; `buildPosterClipboardSections()` delegates to it so the poster's Copy Text and the standalone text generator cannot drift.
- **`wa.me` links have a practical length ceiling** — roughly 1500 characters. Past that the URL silently fails or truncates, so both WhatsApp send buttons refuse and tell the operator to use Copy instead. Do not remove the guard.
- **An unauthenticated query over `agent_fares` MUST carry `where('isHidden','==',false)`** — the rule is a *document-level* condition, so a query missing the predicate is rejected outright rather than filtered. `getFares()` adds it whenever `includeHidden` is falsy. `getPublicDeals` keeps it too even though the Admin SDK bypasses rules: hidden fares must never reach a public page.
- **Firestore rules are OR-ed across every matching `match` block, so a narrower deny never overrides a broader allow** — this is why `config/b2b_secure` (the key that encrypts stored B2B passwords) is excluded inside the existing rule as `allow read, write: if isAdmin() && configId != 'b2b_secure'` rather than with a separate `match /config/b2b_secure { allow read: if false }`, which would have done nothing. Same shape applies to any future carve-out under a wildcard path.
- **B2B passwords are stored reversibly on purpose, and the presence windows are mirrored** — admins asked to re-read an agent's current password at any time, which Firebase Auth cannot do, so `b2b_credentials/{agentId}` keeps an AES-256-GCM copy that `firestore.rules` denies to *every* client (only the Admin SDK inside `getB2BAgentCredentials` reads it). Treat it as protected-at-rest behind an admin claim, never as hashing. Separately, the Online/Idle thresholds live in two files that must be edited together — `ONLINE_WINDOW_MS` / `IDLE_WINDOW_MS` in `functions/b2bCredentials.js` (CJS) and `web/src/js/shared/b2b-presence.js` (ESM), each with its own test suite. Drift makes agents flicker offline with the portal open.
- **B2B featured offers store their travel date as a `'YYYY-MM-DD'` string, not a Timestamp** — the card prints a bare calendar day ("02 AUG 2026"), and a Timestamp rendered through `new Date(...)` prints the *previous* day for anyone west of UTC. `toDateKey()` / `formatOfferDate()` parse the key by hand for exactly that reason; do not "improve" this to a Date. Expiry is a string compare against the day in **IST** (`todayKeyIST()`), because deals are sold on Indian calendar days. The rules are mirrored and must be edited together: `web/src/js/shared/b2b-offers.js` (ESM) and `functions/b2bOffers.js` (CJS), each with its own test suite. The portal must keep receiving offers via `getB2BPortalContext` rather than reading `b2b_offers` directly — that is what keeps expiry server-side.
- **Firestore `in` caps at 30 values and fails the whole query when exceeded** — a country-wide deal link can cover more sectors than that. Use `chunkSectorIds()` and run the chunks in parallel. It exists in **both** mirrors: `web/src/js/shared/deal-links.js` (ESM) and `functions/dealLinks.js` (CJS), with paired test suites — edit them together, like the baggage and flight-schedule modules.
- **The `/deals` page never touches Firestore, and that is the point** — `agent_fares` rows carry `specialRate`, `commission` and the supplier `agentId`, and this page is broadcast to thousands of people. `getPublicDeals` (`functions/publicDeals.js`) projects fares to a display-only allow-list server-side. `functions/tests/public-deals.test.js` pins that exact key list *and* names the forbidden fields, so widening `projectDealFare()` fails the suite instead of silently publishing supplier economics. Do not "simplify" this back to a direct Firestore read. It also keeps the whole page at ~11 kB of JS with no Firebase SDK.
- **No `.html` in any `web/vercel.json` rewrite or redirect path** — `cleanUrls: true` indexes built pages *without* the extension (hence `/deals.html` → 308 → `/deals`), and rewrites resolve their destination against that extensionless table after the filesystem misses. A destination of `/deals.html` therefore targets a path that does not exist and returns a bare **404: NOT_FOUND**. It shipped that way and killed *every* rewrite in the file at once — `/deals/<slug>`, `/gcc`, `/admin/*` — while `redirects`, `cleanUrls` and `/deals` itself kept working, so it reads as a broken page rather than a broken config. Nothing in the build catches it: the JSON stays valid and the page still builds. `web/tests/vercel-routing.test.js` is the guard.
- **Travelpayouts answers in ROUBLES when no currency is passed** — and it does so silently: the numbers just come back ~2.5× too large with `"currency": "rub"` on each row, which reads as a pricing bug rather than a config one. `resolveCurrency()` in `functions/soto/normalize.js` defaults to `inr` and `provider.js` always sets the parameter; `currency` is also part of `buildCacheKey()`, so a rupee search can never be served a cached rouble result. Two tests in `functions/tests/soto.test.js` pin this.
- **SOTO cards must never render a baggage allowance** — `shared/airline-baggage.js` returns a **30 kg default for any IATA code it does not recognise**. That table is calibrated to Zamra's India/Gulf carriers, so on a worldwide low-cost carrier the default is a confident lie, and the provider tells us nothing about baggage anyway. This is the main reason `/soto` has its own `web/src/js/web/soto-card.js` instead of reusing `buildFlightCardHtml`. `web/tests/soto-card.test.js` asserts the rendered HTML contains no `kg`.
- **Only `buildFlightCardHtml`'s wide block skips escaping — every other card builder escapes** — that legacy block interpolates raw, which is safe only because its inputs are admin-controlled Firestore rows. Its own compact row, `buildCompactFlightCardHtml` (B2B), `buildFlightDetailsSheetHtml`, and `buildSotoCardHtml` all run every field through `escapeHtml()`; SOTO in particular *must*, since that data comes from a third-party API. Do not "unify" the card builders without fixing the raw block first.
- **`TRAVELPAYOUTS_TOKEN` is a `defineSecret` and must stay server-side** — it is quota-metered and identifies our affiliate account. That is the whole reason `/soto` calls an endpoint instead of the provider directly. The provider row also carries a `link` field containing an Aviasales deep link **with our marker embedded**; `projectSotoFare()` allow-lists it out and `functions/tests/soto.test.js` names it explicitly as forbidden, so widening the projection fails the suite rather than handing every visitor a working referral URL.
- **A `config/soto.markup` change must invalidate `soto_cache`** — markup is not a query parameter, so it cannot go in the cache key. The cache doc stores the markup it was priced at and a mismatch counts as a miss. Drop that check and the page keeps quoting the old selling price until every entry ages out.
- **Provider timestamps are parsed by regex, never through `Date`** — `departure_at` arrives as `2026-09-12T03:45:00+04:00`, and that offset is the *departure airport's*, so the wall clock in the string is already the local departure time. Round-tripping it through `Date` rebases it onto the server zone and prints the wrong hour, sometimes the wrong day. `splitProviderTimestamp()` and `formatSotoDate()` both read the string by hand — same reasoning as `toDateKey()` in `b2bOffers.js`.
- **`functions/soto/places.json` and `airlines.json` are committed build artefacts** — regenerate with `node scripts/build-soto-reference.cjs`, never hand-edit. Fetching the 4.7 MB of Travelpayouts reference JSON at cold start would stall the first search of the day. They are deliberately *not* merged into `web/src/js/shared/airports.js`, which stays at Zamra's 25 India/Gulf airports because it ships to every page and its tests assert that exact table.
- **`deal_links` is admin-only in the rules even though it powers a public page** — the public path is the endpoint, not the collection. That is also what makes `viewCount` possible: counting from the browser would need a publicly writable field on a publicly readable document.
- **Deal-link slugs are immutable once created** — the whole point of the feature is that a link shared on WhatsApp keeps working while its contents change. The edit form makes the slug read-only; coverage, window, title and active state stay editable against the same URL. The slug is the **document ID**, so a lookup is one `getDoc` and no index.
- **New admin tab? Four edits, plus four dispatch chains** — nav link, mobile `#admin-tab-select` option, and the `.tab-content` section (all in `web/admin.html`), plus an `else if` in `renderActiveTab()`. A sortable/paginated table additionally needs entries in `tableSort` / `tableSearch` / `tablePage` / `tableLimit`, the sort-header click delegation, and the `renderPaginationFooter` re-render chain. Miss one and the symptom is a silently dead control, not an error.
- **`tableLimit` defaults must match an option in the matching `<select>`** — `databaseFares` defaulted to `25` while `#database-limit` only offered 20/50/100/250, so the select rendered blank on first paint. Fixed to `20`; keep them in step.
- **Poster footer contact** — keep the poster footer phone as `+91 9846606739` in both HTML posters and video exports.
- **Poster video slideshow** — if a route spans multiple pages, the video export merges them into one clean poster-page slideshow. Do not re‑introduce per‑page video exports for the same route.
- **Poster video progress** — the Poster UI shows an inline progress pill during video rendering; keep it in sync with generation status.
- **Poster social publishing is Gulf region-driven** — the admin poster page has a compact Social Publishing strip for `Saudi`, `UAE`, `Qatar`, and `Oman`. Selecting a Gulf region reveals the Images/Videos queue actions, and they use the selected date range, not the current preview stack or sector dropdown.
- **Social matching is Gulf-side only** — poster social batching should only include sectors where exactly one side is one of the Gulf regions (`Saudi`, `UAE`, `Qatar`, `Oman`). The publishing bucket must always be the Gulf region, regardless of direction, and non-India routes must stay excluded.
- **Buffer posting is per-Gulf-region** — `social_queue` docs must carry `marketKey`, and the Cloud Function resolves region-specific Buffer secrets/channel IDs from code. The placeholder channel IDs in `functions/buffer/marketConfig.js` plus the Firebase secrets `BUFFER_API_KEY_SAUDI`, `BUFFER_API_KEY_UAE`, `BUFFER_API_KEY_QATAR`, and `BUFFER_API_KEY_OMAN` must be replaced with real values before live posting can succeed.
- **Social publishing skips Buffer verification calls** — do not reintroduce organization lookups, channel verification, or other non-posting Buffer API calls in the live queue path; the daily API cap is reserved for `createPost` calls only.
- **Image batching is feed-only** — Queue Images should create standard Instagram/Facebook feed posts only, with no story variants.
- **Gulf image posting is airport-carousel based** — a single Gulf region Images click should create up to 5 airport carousels only (`Calicut`, `Kochi`, `Kannur`, `Trivandrum`, `Mangalore`), each capped at 10 images, so one Gulf region run stays at a maximum of `10` Buffer `createPost` calls.
- **Rate Upload images are memory-only** — attached rate sheet screenshots live in the module-level `rateImages` array and are base64'd into the n8n webhook payload. Do **not** persist them to Storage, Firestore, or `localStorage` (the `zt_hist` history is capped at 15 entries and would blow its quota). `validate()` must keep enabling submit for images without text — `quickParse()` reads text only, so an image-only upload legitimately previews zero rows.
- **Rate Upload images are downscaled before encoding** — `compressRateImage()` caps the long edge at 1600 px and re-encodes to JPEG q0.82. Base64 inflates by ~33%, so ten untouched phone screenshots blew past n8n's body limit and the webhook rejected the whole submission. The total budget (`RATE_IMAGE_MAX_TOTAL_BYTES`) is checked against the **compressed** size, since that is what actually ships. Decode failures (HEIC, SVG) fall back to the original bytes rather than dropping the file.
- **The rate-sheet file input sits inside its own drop zone** — `imageInput.click()` bubbles back into the drop zone's click handler and reopens the picker, so the dialog flickers or never opens. The input stops propagation on click and the drop zone ignores clicks originating from it. Do not remove either guard.
- **n8n sends only what the rate sheet prints** — `firebaseData` rows carry `agent_id`, `sector_code`, `flight_code`, `date`, `sp_rate`, `show` and nothing else. `finalRate` (= `sp_rate` + commission), `commission`, baggage, and `flightTime` are all derived inside `ingestFaresFromN8n`; asserting them from n8n reintroduces the drift the server-side resolution exists to prevent. Note `sector_code` is space-separated (`CCJ JED`) while `exportFlightDetailsForN8n` keys its route map without the space (`IX_CCJJED`) — the workflow translates between them, so don't "fix" one side alone. The workflow lives in [n8n/](n8n/) and its Code nodes are tested by `functions/tests/n8n-workflow.test.js`.
- **The n8n webhook must always respond** — the Rate Upload UI blocks on the response and only accepts `{ success: true, saved: <finite number> }`. Every fallible node in the workflow routes its error output to a Respond node; a node that fails without responding leaves the admin on a spinner until the HTTP timeout. `saved: 0` is a valid answer — an empty `firebaseData` array is accepted by the ingest endpoint.
- **jsPDF access** — the CDN UMD bundle exposes `window.jspdf.jsPDF`. The code also falls back to `window.jsPDF`. If upgrading jsPDF, verify the UMD global name hasn't changed.
- **CSV export in Reports** — `downloadReportCSV()` reads `_reportFares` (module-level variable). It always exports the full current filtered set, not just the current pagination page. IDs are resolved to names using the in-memory `_agents`, `_sectors`, `_airlines` caches.
- **Exports are ordered by sector, not by Firestore's return order** — `sortFaresForExport()` in `web/src/js/admin/report-export.js` orders rows **sector (POS `sortOrder`) → date → departure time → airline → rate → id** so a downloaded sheet matches what the POS displays. The Reports table defaults to the same order (`tableSort.reportFares.key === 'sectorOrder'`). Rows with no parseable time sort **last within their day**, not first — do not "simplify" that to a `0` default. The module deliberately imports nothing from the DOM or Firebase so `web/tests/report-export.test.js` can test it directly.
- **Reports tab card split** — The fares table card (`bg-white rounded-2xl`) lives in the static `admin.html`. `renderReportFaresTable()` injects only the `<table>` + `#reportFares-pagination-footer` into `#report-fares-results`. Do **not** re-introduce an inner card wrapper in `renderReportFaresTable()` — the outer card already provides the border/shadow/header.
- **Reports pagination bug (fixed)** — `renderReportFaresTable()` must do its own sort + slice. Do **not** pipe the fares array through `applySortAndFilter()` (which also applies `tableLimit` slicing) — doing so double-slices the data and breaks pagination beyond page 1.
- **Reports SVG Charts & Leaderboards** — The Bar and Donut charts in the Reports tab natively render via raw SVG generation in `main.js` and are theme‑aware (dark mode colors + labels). Do **not** introduce external charting libraries (Chart.js, D3, etc.) to keep the bundle lightweight. Leaderboards use array sorting and generic Tailwind progress bars.
- **E-Ticket Generator Output** — The ticket preview strictly uses native HTML/CSS and relies on the browser's native `@media print` rules for generating high-quality PDFs without external heavier canvas libs. This ensures crispy vectors over blurred raster images.
- **E-Ticket colours must be literal hex** — the ticket markup uses `bg-[#0f2a55]`-style arbitrary values, never Tailwind palette classes. Tailwind v4 compiles its palette to `oklch()`, which html2canvas cannot parse, so a palette class silently exports as black on the Download PDF path. Gradients and box-shadows are stripped by `injectCanvasSafeStyles()` too — keep the ticket on flat fills and real borders.
- **`normalizeCanvasColor()` must resolve colours through a canvas pixel, never `getComputedStyle`** — this is the fix for tickets and reports that exported as **solid black blocks**. Chrome *serializes an `oklch()` colour back as `oklch()`*, so the old "ask for the computed value, then check whether it still looks like a colour function" approach always failed, and the caller substituted `#000000` for every colour it could not resolve — including `background-color`. Painting onto a 1×1 canvas and reading the pixel back cannot fail that way: whatever the browser can parse, it can rasterize. Fallbacks are now `transparent` for backgrounds and `inherit` for text (`safeCanvasColor()`) — **never black**, because an unstyled element is recoverable and a black-filled one is not.
- **Never capture the e-ticket while CSS `zoom` is applied** — html2canvas 1.4.1 has no `zoom` support: it measures the element zoomed but lays children out unzoomed, cropping the ticket to a corner of the navy frame (the other "black block" report). `downloadETicketPDF()` calls `resetETicketPrintFit()`, waits two `requestAnimationFrame`s for the reflow, then pins `width`/`height`/`windowWidth`/`windowHeight` to the un-zoomed box. Print-fit zoom is for the print stylesheet only.
- **Scope `sanitizeUnsupportedColorFunctions()` at the export target, never `doc.body`** — it reads every computed property of every node, so passing the whole cloned dashboard is ~10k nodes × ~340 properties per download. That is slow enough to look like a hang and can leave the export blank.
- **E-Ticket / report white-label** — the "Hide agency details" toggles must remove the **margin columns as well as the branding**. Hiding the letterhead while leaving `SP Rate` / `Commission` in the sheet defeats the entire point. The PDF path derives which columns to drop from the rendered header row rather than hard-coded indexes, so reordering the table cannot leak one back. Ticket branding is marked with `data-brand-identity` and hidden via `visibility: hidden` (not `display: none`) so the A4 layout does not reflow.
- **E-Ticket IATA codes come from the resolver, not from slicing the city name** — `resolveETicketRouteCodes()` walks explicit label code → matched `sectorCode` → `shared/airports.js` directory → sibling sector → first three letters. Do not reintroduce the old "only look at sectors when the route did *not* match" branch; that is what printed `CAL`/`DUB` instead of `CCJ`/`DXB`. New airports go in `web/src/js/shared/airports.js` only — `social-markets.js` derives its label→code map from it.
- **Zero baggage is an e-ticket-only concession** — `buildHandBagOptionsHtml()` / `buildCheckInBagOptionsHtml()` take an `allowZero` flag that is passed *only* by the E-Ticket builder's Child/Infant rows. Fare uploads, the Database editor, and the flight-defaults modal must keep calling them without it, so adult weights stay fixed airline policy.
- **`wireXxxActions()` functions must bail early, not re-wire** — All `wireVisaActions`, `wireVisaStampingActions`, `wireAttestationActions`, `wirePassportServiceActions`, `wireSectorActions`, `wireAirlineActions`, `wireTourActions`, `wireHajjUmrahActions` guard with `if (!tbody || tbody.dataset.actionsWired) return;`. Do **not** use the `delete tbody.dataset.actionsWired` + re-set pattern — it bypasses the guard and stacks a new `addEventListener` on every render, causing N confirm dialogs and N toast messages for a single click after N tab refreshes.
- **Visa page styles in `visa.html`** — The premium visa page styles live in a `<style>` block co-located inside `visa.html`, not in `style.css`. This is intentional: they are numerous and only apply to that one page. Design tokens from `style.css` (`--color-primary`, etc.) are still used.
- **Tours itinerary uses a dynamic day-builder UI** — The `itinerary` field on `tours` documents is stored as `Array<{day: string, activities: string[]}>`. The admin modal now uses a card-based builder (Add Day / Remove Day buttons) exactly like the E-Ticket passenger manifest — **do not reintroduce a raw JSON textarea**. Helper functions `_tourItineraryDayHtml`, `_syncTourDayNumbers`, and `_readTourItinerary` in `main.js` manage the UI and serialise the data on submit.
- **Admin modal is scrollable** — `#modal-body` has `overflow-y-auto` and the dialog caps at `max-h-[90vh]`. The header is sticky and stays pinned; the footer uses a sticky gradient to keep primary actions visible. Do not add a fixed height or overflow to `#modal-body` — it is already handled.
- **Tours and Hajj/Umrah listings only show `isActive === true`** — by default filter for active packages on public pages. The admin dashboard fetches all packages to show all entries including hidden ones.
- **Hajj/Umrah public fetch must NOT use `orderBy` alongside `where`** — `hajj-umrah.js` fetches with `where('isActive','==',true)` only (no `orderBy`). Adding an `orderBy` on a different field would require a Firestore composite index that doesn't exist and would silently return empty results. Sort is done **client-side** after fetch.
- **"All Sectors" poster/report queries require the `isHidden + flightDate` index** — When no `sectorId` or `agentId` equality filter is in the query (i.e. the user selected "All Sectors" and "All Agents"), Firestore must use the `isHidden + flightDate` composite index to execute `where('isHidden','==',false) + orderBy('flightDate')`. This index exists in `firestore.indexes.json` and is deployed. If it ever goes missing, the query will fail with "query requires an index" at runtime.
- **Reports tab: all filters are fully optional** — The `generateAgentReport` Cloud Function and the frontend `renderReportsTab` no longer enforce a minimum filter. Passing `sectorId='all'`, `agentId='all'`, and no date range is valid and will aggregate across the entire `agent_fares` collection. Do **not** re-introduce a guard that requires at least one filter to be set.
