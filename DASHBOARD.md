# Zamra Travels — Admin Dashboard & Firebase Backend

> Part of the Zamra project. See also: [WEBSITE.md](./WEBSITE.md) | [AGENTS.md](./AGENTS.md)

---

## Overview

The admin dashboard (`web/admin.html`) is a fully Firebase-integrated, auth-gated management panel for Zamra Travels staff. It allows admins to manage agents, flight sectors, airlines, pricing data, and view aggregated reports — all backed by live Firestore data and Cloud Functions.

**Live URL:** https://www.zamratravels.com/admin.html  
**Access:** Requires a Firebase account with `admin: true` custom claim.  
If reports or database tabs show “missing permissions,” set claims with `scripts/set-admin-claim.cjs`
(user must sign out/in to refresh tokens).

**Local setup:**
- `cd web && npm install`
- `cd functions && npm install`
- Functions expect **Node.js 22** (use Node 22 locally to avoid engine warnings).

---

## Firebase Project

| Property | Value |
|---|---|
| Project ID | `zamra-web-01` |
| Hosting URL | https://www.zamratravels.com/ |
| Console | https://console.firebase.google.com/project/zamra-web-01 |
| Plan | **Blaze (pay-as-you-go)** |
| Auth | Email/Password |

---

## Firebase Services in Use

| Service | Purpose | Status |
|---|---|---|
| **Firestore** | Primary database for all data | ✅ Live |
| **Firebase Storage** | Logo uploads (agents, airlines) | ✅ Live (us-east) |
| **Cloud Functions** | Bulk operations + report generation | ✅ Live (asia-south1, Node 22) |
| **Firebase Auth** | Admin login (email/password) | ✅ Live |

---

## Project File Structure (Backend)

```
zamra/                          # Firebase project root
├── firebase.json               # Firebase service config (all services)
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Compound indexes for agent_fares queries
├── storage.rules               # Firebase Storage security rules
├── .firebaserc                 # Links CLI to zamra-web-01 project
│
└── functions/                  # Cloud Functions (Node.js 22, 2nd Gen)
    ├── index.js                # Core callable + scheduled exports (reports, fare ops, social pipeline)
    ├── .eslintrc.js             # Functions lint config
    ├── buffer/                  # Buffer create-post client + static market helpers
    ├── poster/                  # Server-side daily poster render/upload helpers
    ├── scheduled/               # Cron-driven jobs (daily poster generation)
    ├── social/                  # Social publishing pipeline helpers + queue logic
    └── package.json            # firebase-admin, firebase-functions deps
```

---

## Dashboard File Structure (Frontend)

```
web/
├── admin.html                          # Dashboard HTML — all tab panels + modal dialog
└── src/
    ├── styles/admin/style.css          # Admin-specific CSS + shared UI system (`admin-panel`, `admin-control`, `admin-btn`, `admin-action-btn`, `admin-status-pill`)
    └── js/admin/
        ├── firebase-config.js          # Firebase init — exports: auth, db, storage, functions
        ├── auth.js                     # onAuthChange(), logoutUser()
        ├── login.js                    # Login page logic
        ├── db.js                       # ★ Firestore + Storage service layer (all CRUD)
        ├── social-publishing.js        # Social publishing UI/controller for the Socials tab
        ├── video-export.js             # Video poster export (Canvas + MediaRecorder, shared poster-page slideshow renderer)
        └── main.js                     # ★ All tab controllers + modal + toast system
```

---

## Navigation (Desktop + Mobile)

- Desktop uses the top nav links (`.nav-link`) to switch tabs.
- Mobile uses the `#admin-tab-select` dropdown (shown only on small screens) to switch tabs.
- A light/dark **theme toggle** sits beside Logout and persists to `localStorage` (defaults to system theme if no preference set).
- `initTabs()` in `web/src/js/admin/main.js` keeps the dropdown and active tab in sync. If you add/remove tabs, update both the nav links and the dropdown options in `web/admin.html`.
- Small-screen spacing, controls, and tables are tuned in `web/src/styles/admin/style.css` to keep the dashboard usable on mobile with touch-friendly controls and smooth horizontal scrolling for wide tables.

---

## Dashboard Tabs

### 1. 📊 Dashboard Tab
- **Poster Generator** — select a sector, shortcut, or `All Sectors` and optional date range, click **Generate Poster** to preview a shareable fare poster
  - **Country + airport shortcuts first** — the sector dropdown now shows `Saudi`, `UAE`, `Qatar`, `Oman`, `Kuwait`, `Bahrain`, plus `Calicut (CCJ)`, `Kochi (COK)`, `Kannur (CNN)`, `Trivandrum (TRV)`, and `Mangalore (IXE)` above the individual routes; picking one bundles all matching sectors in either direction (`from` or `to`)
  - Displays fares sorted by date
  - **Default date floor = today** — poster fetches always start from today to avoid expired fares (even if the date input is blank or earlier)
  - **All Sectors** renders **one poster per sector** (instead of mixing sectors into a single table)
  - Layout utilizes a concise, dense row design to fit more fares cleanly into the poster
  - **Consistent canvas, adaptive composition** — posters keep a fixed export size, but the fare card/header/footer spacing now rebalance to give the table more room instead of relying on large dead zones
  - **15-row image/poster capacity profile** — preview, JPEG, and PDF posters switch to an extra-tight composition so up to 15 fares still fit on one image, and the visible poster preview rebalances row heights after mount so exports use the fuller vertical spacing
  - **Ratio-aware video pagination** — slideshow videos now paginate independently from static posters: `9:16` portrait videos can carry up to 16 fares per slide, while `16:9` widescreen videos favor a tighter 9-row cap with rebalanced header/footer sizing for cleaner composition
  - **Auto-page** — sectors split into additional poster/video pages automatically once the active format’s row cap is reached
  - **Deduplicates identical flights** (same sector, airline, date, and time), guaranteeing only the cheapest rate is shown — airline + time are normalized so duplicates across agents collapse reliably
  - **Airline logos** are pre-fetched as blob URLs before rendering (with case-insensitive, whitespace-trimmed lookups) — sidesteps CORS for `html2canvas`
  - **Dynamic brand themes** — each generation creates a brand‑safe palette on the fly (effectively infinite variety) so posters feel fresh when shared
  - **Footer contact** — poster footer phone is `+91 9846606739`
  - **Video slideshow** — if a route spans multiple pages, the video export merges them into a single poster-page slideshow
  - **Video exports are native to each ratio** — `1:1`, `9:16`, and `16:9` videos now render dedicated poster compositions sized specifically for that aspect ratio before encoding, so the slideshow fades between full-frame layouts instead of boxing the standard portrait poster inside a blurred backdrop
  - **Video progress** — inline status pill updates during rendering (e.g. `Rendering 3/8 · CCJ DXB`)
  - **Copy Text** — copies the currently generated poster fares into a plain-text share format (for quick WhatsApp/status posting). Exposes a dropdown with options to copy the entire set (**Copy All Routes**), country-specific subsets (e.g. **Copy Saudi to Calicut (CCJ)** under **Country Copy**), or individual routes (e.g. **Copy KOZHIKKODE TO RIYADH** under **Route Copy**), allowing operators to easily choose and share specific segments.
  - **Download JPEG** — renders poster(s) to canvas at 2× resolution and triggers a `.jpg` download (downloads one file per sector for All Sectors)
  - **Download PDF** — converts poster canvas to a mm-based jsPDF page exactly sized to the poster dimensions (downloads one file per sector for All Sectors)
  - **Create Video** — generates simple poster-page slideshow videos in 1:1, 9:16, or 16:9 formats from the same rendered poster frames used by preview/export work, so direct downloads and social-queued videos stay visually consistent and cleaner to encode. Uses the same deduping logic as posters. When a route spans multiple pages, merges them into a single slideshow video. Relies on `Canvas` rendering iteratively and `MediaRecorder` dumping streams to `.mp4` format natively, and layers in the bundled `/assets/music/bg_music.mp3` track across all rendered video exports. (Downloads one video per sector for All Sectors.)
  - Export buttons disable during generation and re-enable once done
- Social queueing now lives in the dedicated **Socials** tab so poster generation stays focused on preview/export work
- Calls `getFares({ sectorId, startDate, endDate, includeHidden: false })` — only live fares shown on posters
- All data from Firestore `agent_fares` + `airlines`

### 2. 📣 Socials Tab
- **Social Publishing workspace** — five airport-group cards (`Calicut (CCJ)`, `Kochi (COK)`, `Kannur (CNN)`, `Trivandrum (TRV)`, `Mangalore (IXE)`) drive the publishing queue from a dedicated tab instead of the Poster screen
- **Independent date range controls** — image and video queue actions use the Socials tab’s selected start/end dates rather than the current poster preview
- **Setup-aware publishing controls** — the tab reads the saved posting setup from Firestore `config/socialPublishing`; action buttons disable automatically when the required airport-specific channel IDs are missing
- **Current Activity card** — shows the live stage, current route/ratio, and `Created` / `Posted` counters while a publishing batch is rendering/uploading/dispatching
- **Recent Publishing Jobs** — last 25 jobs from the past 3 days are listed inline with `Created` / `Posted` counts; opening a job shows item-level status, error details, and retry actions
- **Queue Images** — one click per airport group builds up to 6 standard Instagram/Facebook feed carousels only, grouped by destination country in this fixed order: `Saudi`, `UAE`, `Oman`, `Qatar`, `Bahrain`, `Kuwait`
- **Country carousel cap** — each airport-country image post keeps only the first 10 rendered poster frames so one airport run stays capped at `6 queue items` and `12 Buffer createPost` calls
- **Queue Videos** — batches eligible India ↔ international sectors by India-side airport group into two uploads per destination country: `9:16` country reels for Instagram/Facebook/YouTube Shorts and `16:9` country videos for YouTube only
- **Country video cap** — each airport-country video batch uses one shared 9-row page plan across both ratios and keeps only the first `19` slides so country reels remain reliable; `16:9` YouTube uploads are best-effort and may fail independently without blocking the matching reel item
- **Airport routing** — social queueing always groups by the India-side airport in either direction (for example `CCJ DMM` and `DMM CCJ` both publish under `Calicut (CCJ)`), and still excludes non-India routes like `DOH DXB`
- **Durable queue pipeline** — every batch creates a `social_jobs/{jobId}` record plus `social_jobs/{jobId}/items/*`; uploaded media is written to `social_queue` with retry/lease metadata, then dispatched by scheduled workers
- **Operator-facing status stays simple** — Social job cards and detail views now show only `Created` and `Posted`. Internal queue retry/failure states remain behind the scenes for recovery, and final success is still Buffer `createPost` acceptance only.

### 3. 👥 Agents Tab
- **Full CRUD** — Add / Edit (modal form) / Delete agents
- **Commission field** — Each agent has a `commission` (₹) value set via the Add/Edit modal. This value is automatically stamped onto every fare ingested for that agent via `ingestFaresFromN8n`. Default is ₹500 if not specified.
- **Table Controls** — "Show N entries" dropdown (10, 25, 50, 100, All) and a real-time Search bar (filters by name, email, phone, or ID).
- **Pagination** — Previous/Next/page-number controls that integrate seamlessly with the search and entries limit.
- **Hide All / Show All** — calls `bulkToggleAgentVisibility` Cloud Function, which updates the agent's `isActive` flag AND toggles `isHidden` on all their fares at once
- Data from Firestore `agents` collection
- **Table columns:** ID · Name · Email · Phone · **Commission** · Status · Actions

### 4. 🗺️ Sectors Tab
- **Full CRUD** — Add / Edit / Delete sectors
- **Custom Priority Ordering** — a dedicated Reorder Mode exposes the full sector list with drag-and-drop so admins can persist a custom display priority across the dashboard and other sector selectors
- **Pagination** — 10 sectors per page
- **Hide Fares / Show Fares** — calls `bulkToggleSectorVisibility` Cloud Function to toggle `isHidden` on all fares for a route
- Data from Firestore `sectors` collection (fields: `sectorFrom`, `sectorTo`, `sectorCode`, `sortOrder`)

### 5. ✈️ Flights Tab (Airlines)
- **Full CRUD** — Add / Edit / Delete airlines
- **Pagination** — 10 airlines per page
- **Logo upload** — uploads to Firebase Storage (`/airline_logos/`), stores URL in Firestore
- Data from Firestore `airlines` collection (fields: `name`, `code`, `logoUrl`)

### 6. 📈 Reports Tab
- **Filter Bar** — premium card with icon header. Fields: Sector (optional), Agent (optional), From Date (optional), To Date (optional), and a gradient **Generate Report** button with a lightning icon.
- **All filters are fully optional** — leave everything at their defaults (`All Sectors`, `All Agents`, no dates) to generate a full-dataset report across the entire timeline. Any combination of filters is valid.
- Calls `generateAgentReport` Cloud Function for summary stats (charts), then fetches raw fares via `getFares()` for the full table.
- **Stat Cards (5)** — appear after a report is generated, showing real-time counts from `_reportFares`:
  - 🎫 **Total Fares** — total count returned
  - 👁️ **Live** — fares where `isHidden === false`
  - 🚫 **Hidden** — fares where `isHidden === true`
  - 👥 **Agents** — unique agent count in the result set
  - 💰 **Avg Fare** — average rate calculated dynamically from the fetched fares
- **Bar Chart — Fares per Agent (SVG)** — interactive gradient bars with tooltips for count/avg rate and dynamic Y-axis. Smooth growing animations. Theme-aware colors for dark mode readability.
- **Donut Chart — Fares per Sector (SVG)** — interactive pie segments. Hovering highlights slices, updates the center count/label dynamically, and cross-highlights the respective legend item. Theme-aware colors for dark mode readability.
- **Leaderboards** — Two ranking cards generated below charts:
  - 🏆 **Top Agents** (ranked by highest volume of fares)
  - 🏷️ **Cheapest Sectors** (ranked by lowest average fare, includes progress bars)
- **Fares Table** — rendered inside the outer table card (no inner wrapper card). Features:
  - Alternating row striping (`bg-slate-50/60` on odd rows)
  - Sector codes shown as blue pill badges (`bg-primary/10`)
  - `● Live` / `● Hidden` status badges with contextual colours
  - **Hide/Show** button is green when fare is hidden; slate when live
  - **Del** button beside each row
  - Fully sortable (click column headers), paginated, and filterable. Rate and fare fields are read-only in Reports.
  - **Entries limit control** — Show 10/25/50/100/All results per page.
  - Columns: **Date · Time · Sector · Airline · Agent · SP Rate · Rate · Comm · Bag · Ex.Bag · Status · Actions**
  - Inline per-row **Delete** and **Hide/Show** — update `_reportFares` in place without re-fetching
- **Export CSV** — greyed out until data is loaded; unlocked automatically after a successful report fetch. Downloads full filtered set (not just current page). All IDs resolved to human-readable names. UTF-8 BOM prefix for correct Excel rendering.
- **Export PDF** — one-click PDF download of the report results table (multi-page when needed).

> **Implementation note:** `renderReportCharts()` populates the stat cards and both charts, then wires the CSV button via `cloneNode` to avoid duplicate listeners. `renderReportFaresTable()` injects only the `<table>` + pagination footer into `#report-fares-results` — it does **not** wrap in its own card (the outer HTML card in `admin.html` already wraps it).

### 7. 🗃️ Database Tab
- **Spreadsheet View for `agent_fares`** — dedicated sheet-style table for admins to manage all fare rows in one place.
- **Read-Only Default View** — Rows default to a concise, plain-text view (similar to the Reports tab) to avoid horizontal scrolling and improve readability.
- **Togglable Inline Editing** — Admins can click the **Edit** button on any row to seamlessly swap the row into edit mode, revealing dropdowns and input fields for date, time, agent, sector, airline, **SP Rate + Commission**, baggage, extra baggage, and status.
- **Rate Formula** — `Final Rate` is auto-calculated as `SP Rate + Commission` (read-only field).
- **Row Actions** — per-row **Edit** / **Save** / **Cancel** / **Reset**, **Share** (copies WhatsApp-formatted enquiry text to clipboard), and Delete controls.
- **Bulk Operations** — multi-select checkboxes + **Delete Selected** action.
- **Save All Workflow** — tracks unsaved rows and allows saving all pending edits in one action.
- **Filters + Search** — filter by agent, sector, airline, status, and date range; plus free-text search.
- **Add Fare** — opens a modal form to insert a brand-new fare row into Firestore.

### 8. 📋 Rate Upload Tab
- **AI Rate Intake** — premium step-by-step UI for agent selection and raw fare submission
- **Agent selector** — chips populated from live Firestore `agents` list (manual override supported)
- **Paste raw rate text** — WhatsApp, email, or plain-text fare dumps
- **Upload rate sheet images** — click, drag-and-drop, or paste a screenshot straight into the textarea. Thumbnails are removable, capped at 10 images / 8 MB each / 20 MB total, and held in memory only (nothing is written to Storage or `localStorage`). Text and images can be submitted together or independently — images alone enable the submit button, since `quickParse` reads text only and the AI parser handles the images.
- **Live preview** — lightweight client-side parse shows detected entries before submit
- **Submit** — Sends raw text payload (plus lightweight parsed preview rows and any images) securely to the **n8n AI webhook** at `https://n8n.srv1491832.hstgr.cloud/webhook/zamra-rates`. Images travel as `images: [{ name, mime_type, size, data }]` where `data` is bare base64 (n8n rebuilds `data:<mime_type>;base64,<data>` if it needs a data URL). The UI stays in “processing” state until the workflow completes, then shows success/failure + the `saved` count returned by the final node.
- **N8n Processing** — The workflow fetches the live route catalogue from `exportFlightDetailsForN8n`, sends the text and images to `gpt-5-mini` (vision + strict structured outputs) constrained to those sector/airline codes, validates and dedupes the extracted rows, then calls `ingestFaresFromN8n` to save them to `agent_fares`. The deployed workflow is mirrored in [n8n/](n8n/) with its rollback procedure; its Code nodes are covered by `functions/tests/n8n-workflow.test.js`.
- **Session cards** — local browser stats (submissions + entries) and recent submissions list stored in `localStorage` (last 15 sessions)
- **Staggered reveal** — cards animate in on tab activation for a premium feel (respects `prefers-reduced-motion`)

### 9. 🎟️ E-Ticket Tab
- **Manual E-Ticket Generator** — issue professional, branded e-tickets directly from the dashboard.
- **Premium Layout System** — ticket output now uses a structured document layout (header meta, route summary cards, flight table, passenger manifest, advisory block) optimized for both on-screen preview and A4 print/PDF.
- **Dynamic Selectors** — pulls active airlines, origins, and destinations from Firestore to pre-populate dropdowns.
- **Airline Logos** — dynamically fetches and embeds airline logos from Firebase Storage into the ticket header.
- **Dynamic Passenger Rows** — allows adding multiple passengers and specifying check-in/carry-on baggage per passenger.
- **Automated Formatting** — precisely structured classic ticket layout with travel details, pax details, passenger flight segments, dynamic baggage mapping, explicit top-level passenger counts, tightened airline PNR spacing, and appended travel rules.
- **Print / PDF Export** — specifically engineered with strict CSS `@media print` overrides (removing borders, shadows, and rounded corners) to guarantee a clean, borderless A4-native document generation via the browser's native print dialog.
- **Download PDF** — one-click PDF download using html2canvas + jsPDF for quick saves, while the Print button remains the crisp, vector-quality option.

### 10. 🛂 Visas Tab
- **Comprehensive Visa Services Management** — Full CRUD management for four distinct service types via isolated inner tabs:
  - **Visas** — standard tourist/business visas (Country, Type, Rate, Processing Time, Optional Flag Image stored in Storage).
  - **Visa Stamping** — country-specific stamping services.
  - **Attestations** — document/certificate attestation services.
  - **Passport Services** — fresh, renewal, and detail update services.
- **Live Sync** — data drives the dynamic tables and modal inquiries directly on the public `visa.html` page.
- **Sub-Tabs** — seamless client-side toggling between the 4 sub-collections without page reload.

### 11. 🗺️ Tours Tab
- **Full CRUD for tour packages** — Add / Edit (modal form) / Delete.
- **Table columns:** Cover Image · Title · Category · Duration · Price · Status (Active / Hidden) · Actions
- **Add/Edit modal fields:**
  - Title, Category (`International` / `Domestic`), Duration
  - Price in ₹ (set `0` for "Call for Price")
  - Active toggle — controls visibility on public `/tours.html`
  - Description, Highlights (newline-separated list)
  - **Itinerary — dynamic day builder** — an "Add Day" button dynamically appends day cards (same UX pattern as the E-Ticket passenger manifest). Each card contains:
    - **Day Label / Title** field (e.g. `Day 1 – Arrival`)
    - **Activities** textarea (one activity per line)
    - **× Remove** button (disabled when only one day remains)
    - Cards are re-numbered automatically after removal. On load, one blank Day 1 card is pre-inserted. When editing an existing tour, all saved `itinerary` days are pre-populated.
    - No JSON input required — the form serialises into the `Array<{day, activities[]}>` structure automatically on submit.
  - Inclusions / Exclusions (newline-separated lists)
  - Cover Image upload → Firebase Storage `tour_images/` folder
- **Live Sync** — data drives `/tours.html` public pages (details open in modal).
- Data from Firestore `tours` collection.

### 12. 🕋 Hajj & Umrah Tab
- **Full CRUD for Hajj & Umrah packages** — Add / Edit (modal form) / Delete.
- **Table columns:** Cover Image · Title · Type · Days/Nights · Price · Status (Active / Hidden) · Actions
- **Add/Edit modal fields:**
  - Title, Type (`Hajj` / `Umrah`), Departure City, Airline, Departure Date
  - Days & Nights numbers
  - Price in ₹ (set `0` for "Call for Price")
  - Active toggle — controls visibility on public `/hajj-umrah.html`
  - Description, Highlights (newline-separated list), Inclusions (newline-separated list)
  - Cover Image upload → Firebase Storage `hajj_umrah_images/` folder
- **Live Sync** — data drives `/hajj-umrah.html` public page.
- Data from Firestore `hajj_umrah_packages` collection.

### 13. 🤝 B2B Agents Tab
Portal logins, pricing controls, and route visibility for `b2b.zamratravels.com`.

> **Naming trap:** `agents` = rate **suppliers** (Mushtaq, Ameen, Lafi…). `b2b_agents` = travel-agency **customers** who log into the portal. The two are unrelated collections.

- **Full CRUD** — Add / Edit / Reset Password / Activate / Delete, all via Cloud Function callables (`createB2BAgent`, `resetB2BAgentPassword`, `setB2BAgentStatus`, `deleteB2BAgent`).
- **Global B2B Settings** — default markup (₹) and portal WhatsApp number, stored on `config/b2b`.
- **Supplier Markup Rules** — per-supplier price adjustments, optionally scoped to a single agent. See the pricing waterfall below.
- **Route Visibility** — hide whole departure airports or individual sectors per agent.
- **Instant Price Adjustments** — per-route ± amount per agent (`routeAdjustments`).
- **Table columns:** Login ID · Name · Agency · Phone · Markup · Restrictions · Status · Actions

> **DOM gotcha:** this tab holds **two** `.admin-table` elements — the Supplier Markup Rules table comes first, the agents table second. Both tbodies carry explicit ids (`#b2b-rules-body`, `#b2b-agents-body`) and the JS must address them by id. A bare `document.querySelector('#b2b-agents-tab .admin-table tbody')` resolves to the **rules** table and silently breaks the tab three ways: agent rows overwrite the rules, the agents table renders empty under a correct row count, and `wireB2BAgentActions()` hits the rules tbody's already-set `actionsWired` flag so Edit / Reset PW / Deactivate / Delete never bind. Fixed in `renderB2BAgentsTab()` and `wireB2BAgentActions()`.

#### B2B pricing waterfall
Computed server-side in [functions/b2b.js](functions/b2b.js) (`computeB2BFares`). B2B agents never receive `specialRate`, `finalRate`, `commission`, or supplier IDs.

```
base                 agent_fares.specialRate
                     (falls back to finalRate − commission when specialRate is 0)
+ agent markup       b2b_agents.markupOverride ?? config/b2b.defaultMarkup
+ supplier rule      b2b_agents.supplierAdjustments[supplierId]
                       ?? config/b2b.supplierDefaults[supplierId]
                       ?? 0
+ route adjustment   b2b_agents.routeAdjustments[sectorId] ?? 0
= price              floored at 0, rounded
```

Supplier rules are **signed** — positive marks up, negative discounts — and **stack on top of** the agent markup rather than replacing it, so a discount alone can never price below the supplier's raw rate. The most specific tier wins: an agent's own rule beats the global supplier default, and an explicit `0` on an agent cancels that default for that agent only.

Fares are grouped by sector + airline + date + time keeping the **minimum final price**. Comparing final price rather than raw base matters once supplier rules exist: a supplier with a higher raw rate but a discount rule can undercut a cheaper supplier carrying a markup.

## Baggage rules

Baggage weights are **policy, not data**. They are never typed in freely and never taken from an upload — every surface derives them from the airline's IATA code.

| Flight | Check-in Baggage | Hand Baggage |
|---|---|---|
| IX | 30 | 7 |
| 6E | 30 | 7 |
| G9 | 30 | **10** |
| XY | 30 | 7 |
| WY | 30 | 7 |
| OV | **20, 40** | **5** |
| AI | 30 | 7 |
| SV | **20, 30, 40** | 7 |
| QP | 30 | 7 |
| FZ | 30 | 7 |
| J9 | 30 | 7 |
| SG | 30 | 7 |

Defaults are 30 kg check-in and 7 kg hand for every airline, including any code not listed above; only G9, OV, and SV deviate. OV and SV are the only airlines with more than one allowed check-in weight, so they are the only ones where the check-in dropdown offers a choice — everywhere else it is a single fixed value. `agent_fares.baggage` holds check-in kg and `agent_fares.extraBaggage` holds hand kg.

The rules live in two mirrored modules that **must be edited together**: [web/src/js/shared/airline-baggage.js](web/src/js/shared/airline-baggage.js) (ES module, browser surfaces) and [functions/airlineBaggage.js](functions/airlineBaggage.js) (CommonJS, Cloud Functions). The paired test suites `web/tests/airline-baggage.test.js` and `functions/tests/airline-baggage.test.js` both assert the full table, so drift between the copies fails the build.

Enforcement points:

- **`ingestFaresFromN8n`** overwrites the baggage on every incoming row — hand baggage is always the rule value, check-in is snapped onto the airline's allowed weights. n8n cannot override it.
- **`exportFlightDetailsForN8n`** returns rule-derived `baggage` / `extraBaggage` per mapping, plus `checkInBaggageOptions`, `handBaggage`, and a top-level `baggageRules` table.
- **Admin dashboard** — the Database tab's inline editor, the Add Fare modal, the Flights tab's flight-defaults modal, and the E-Ticket passenger rows all rebuild their baggage dropdowns when the airline changes, and re-derive the values again on submit.
- **Public site, B2B portal, and both poster renderers** resolve baggage from the airline code at render time, so legacy rows with stale weights display correctly without a backfill.

## Flight Time Resolution

`agent_fares.flightTime` is a single display string (`'19:40 - 22:55'`) that posters and the public site render verbatim. The canonical per-route value is configured in the Flights tab and stored on `flight_details`, keyed `<airlineId>_<sectorId>`.

The round-trip through n8n used to drop it: `exportFlightDetailsForN8n` handed out a combined `flightTime` string, but `ingestFaresFromN8n` only read split `time_start` / `time_end` keys, so every ingested fare stored `''` and the poster Time column printed `—`. Resolution now happens in [functions/flightTime.js](functions/flightTime.js), most-specific-first:

1. `row.time_start` + `row.time_end` (or `timeStart` / `timeEnd`)
2. a combined payload key — `flight_time`, `flightTime`, `flight_timing`, `timing`, or `time`
3. the configured `flight_details` value for that airline + sector

Every shape is normalized to 24-hour `HH:MM - HH:MM` (`1940`, `19.40`, `7:40 PM`, en/em dashes and `to` separators all parse; junk like `TBA` resolves to `''` rather than being stored). `exportFlightDetailsForN8n` now emits `time_start` / `time_end` alongside `flightTime` so either shape round-trips.

Both poster renderers apply the same `flight_details` fallback at render time — [functions/poster/fetchFares.js](functions/poster/fetchFares.js) for the daily auto-poster and `dedupeAndSortPosterFares()` in `admin/main.js` for the admin poster, video export, social publishing, and clipboard text. Fares uploaded before the fix therefore show their times without a backfill. `loadGlobalData()` fetches `flight_details` so the fallback works even when the Flights tab was never opened.

## Firestore Database Schema

### `admins`
| Field | Type | Notes |
|---|---|---|
| `uid` | String | Firebase Auth UID (doc ID) |
| `email` | String | |
| `name` | String | |
| `role` | String | e.g. `'Admin'`, `'Editor'` |

### `agents`
| Field | Type | Notes |
|---|---|---|
| `agentId` | String | Manual Custom string (e.g. `AGENT-123`)(doc ID) |
| `name` | String | Display name |
| `contactPhone` | String | |
| `email` | String | |
| `isActive` | Boolean | `false` = all their fares hidden on public site |
| `commission` | Number | Per-agent commission in ₹ (default: 500). Auto-stamped on ingested fares. |
| `createdAt` | Timestamp | Server timestamp |
| `updatedAt` | Timestamp | Server timestamp |

### `sectors`
| Field | Type | Notes |
|---|---|---|
| `sectorId` | String | Auto-generated doc ID |
| `sectorFrom` | String | Origin city/airport e.g. `KOZHIKODE` |
| `sectorTo` | String | Destination e.g. `JEDDAH` |
| `sectorCode` | String | IATA code e.g. `CCJ JED` |
| `sortOrder` | Number | Admin-defined display priority; lower values appear first in sector tables and dropdowns |

### `airlines`
| Field | Type | Notes |
|---|---|---|
| `airlineId` | String | Auto-generated doc ID |
| `name` | String | e.g. `Air India Express` |
| `code` | String | IATA code e.g. `IX` |
| `logoUrl` | String | Firebase Storage download URL |

### `agent_fares`
| Field | Type | Notes |
|---|---|---|
| `agentId` | String | Ref to `agents` doc ID |
| `sectorId` | String | Ref to `sectors` doc ID |
| `airlineId` | String | Ref to `airlines` doc ID |
| `flightDate` | Timestamp | Date of flight |
| `specialRate` | Number | Base fare in ₹ |
| `finalRate` | Number | Final selling rate |
| `baggage` | Number | **Check-in** allowance in kg — fixed by airline policy, see [Baggage rules](#baggage-rules) |
| `extraBaggage` | Number | **Hand** allowance in kg — fixed by airline policy, see [Baggage rules](#baggage-rules) |
| `commission` | Number | Agent commission in ₹ — sourced from `agents.commission` at ingest time |
| `supplierRate` | Number | Supplier cost (currently always 0) |
| `flightTime` | String | e.g. `'19:40 - 22:55'` |
| `isHidden` | Boolean | `true` = hidden from public site |
| `createdAt` | Timestamp | Server timestamp |
| `updatedAt` | Timestamp | Server timestamp |

### `services`
| Field | Type | Notes |
|---|---|---|
| `serviceType` | String | e.g. `'Visa'`, `'Hotel'` |
| `title` | String | |
| `basePrice` | Number | |
| `isActive` | Boolean | |

### `visas`
| Field | Type | Notes |
|---|---|---|
| `countryName` | String | Country name e.g. `'UAE'` |
| `visaType` | String | Visa type e.g. `'30 Days Tourist'` |
| `rate` | Number | Cost in ₹ |
| `processingTime` | String | e.g. `'2-3 Working Days'` |
| `flagUrl` | String | Optional image URL for flag |

### `visa_stamping`
| Field | Type | Notes |
|---|---|---|
| `country` | String | Country name |
| `description` | String | Description of stamping |
| `cost` | Number | Cost in ₹ |
| `processingTime` | String | Processing details |
| `posterUrl` | String | Optional promo poster (Storage `service_posters/`), shown on the B2B portal card |

### `attestations`
| Field | Type | Notes |
|---|---|---|
| `country` | String | Target country |
| `certificate` | String | Type of certificate e.g. `'Marriage'` |
| `cost` | Number | Cost in ₹ |
| `posterUrl` | String | Optional promo poster (Storage `service_posters/`), shown on the B2B portal card |

### `passport_services`
| Field | Type | Notes |
|---|---|---|
| `type` | String | Service type e.g. `'Fresh / Renewal'` |
| `description` | String | Requirements or process details |
| `cost` | Number | Cost in ₹ |

### `tours`
| Field | Type | Notes |
|---|---|---|
| `title` | String | Tour package name e.g. `'Malaysia 4D/3N'` |
| `category` | String | `'International'` or `'Domestic'` |
| `duration` | String | e.g. `'4 Days / 3 Nights'` |
| `price` | Number | Price in ₹; `0` means "Call for Price" |
| `description` | String | Short overview for the listing page |
| `highlights` | Array\<String\> | Bullet-point highlights |
| `itinerary` | Array\<Object\> | Day-by-day itinerary: `[{day: string, activities: string[]}]` |
| `inclusions` | Array\<String\> | What's included in the package |
| `exclusions` | Array\<String\> | What's not included |
| `coverImageUrl` | String | Firebase Storage download URL for hero image |
| `isActive` | Boolean | `false` = hidden from public listing and denied on detail page |
| `createdAt` | Timestamp | Server timestamp |
| `updatedAt` | Timestamp | Server timestamp |

### `hajj_umrah_packages`
| Field | Type | Notes |
|---|---|---|
| `title` | String | Package title e.g. `'Premium Hajj Package'` |
| `type` | String | `'Hajj'` or `'Umrah'` |
| `departureCity` | String | e.g. `'Kozhikode'` |
| `airline` | String | e.g. `'Saudi Airlines'` |
| `departureDate` | String | e.g. `'2024-06-15'` (Stored as String) |
| `days` | Number | e.g. `14` |
| `nights` | Number | e.g. `13` |
| `price` | Number | Price in ₹; `0` means "Call for Price" |
| `description` | String | Description of the package |
| `highlights` | Array\<String\> | Bullet-point highlights |
| `inclusions` | Array\<String\> | What's included (visa, flights, hotels, etc.) |
| `coverImageUrl` | String | Firebase Storage download URL |
| `isActive` | Boolean | `false` = hidden from public page |
| `createdAt` | Timestamp | Server timestamp |
| `updatedAt` | Timestamp | Server timestamp |

### `b2b_agents`
Travel-agency customers of the B2B portal — **not** the `agents` (supplier) collection.

| Field | Type | Notes |
|---|---|---|
| `loginId` | String | e.g. `ZMR001`; 3–20 letters/digits |
| `loginIdLower` | String | Lowercased, used for the uniqueness check |
| `authUid` | String | Firebase Auth UID; email is `<loginid>@b2b.zamratravels.com` |
| `name` / `agencyName` / `phone` / `place` | String | Profile fields |
| `isActive` | Boolean | `false` disables the Auth account and revokes tokens |
| `markupOverride` | Number \| null | ₹ markup for this agent; `null` uses `config/b2b.defaultMarkup`. `0` is valid |
| `supplierAdjustments` | Map\<supplierId, Number\> | Signed ₹ per supplier for this agent. Explicit `0` cancels the global default |
| `routeAdjustments` | Map\<sectorId, Number\> | Signed ₹ per route |
| `hiddenOrigins` | Array\<String\> | Departure airport codes hidden from this agent |
| `hiddenSectorIds` | Array\<String\> | Individual sectors hidden from this agent |
| `createdAt` / `updatedAt` | Timestamp | Server timestamps |

Passwords are generated server-side, returned once, and never stored.

### `config/b2b`
| Field | Type | Notes |
|---|---|---|
| `defaultMarkup` | Number | Common markup applied when an agent has no `markupOverride`. Defaults to `200` |
| `supplierDefaults` | Map\<supplierId, Number\> | Signed ₹ per supplier, applied to every agent unless overridden. `0` is dropped — with no tier below it, "0" and "unset" are the same rule |
| `whatsappNumber` | String | Digits only; shown in the portal |
| `updatedAt` | Timestamp | Server timestamp |

> Written by `saveB2BConfig()` (scalars, `setDoc` merge) and `saveB2BSupplierDefaults()` (the map, via `updateDoc` so removed suppliers actually disappear — a `setDoc` merge would merge nested maps key-by-key and leave orphans behind).

---

## Firestore Indexes

7 compound indexes on `agent_fares` for dashboard queries:

| Fields | Order | Used By |
|---|---|---|
| `agentId` + `flightDate` | ASC, ASC | Fares filtered by single agent |
| `sectorId` + `flightDate` | ASC, ASC | Fares filtered by single sector |
| `agentId` + `sectorId` + `flightDate` | ASC, ASC, ASC | Fares filtered by agent + sector |
| `isHidden` + `sectorId` + `flightDate` | ASC, ASC, ASC | Public site live fares per sector |
| `agentId` + `isHidden` + `flightDate` | ASC, ASC, ASC | Agent visibility toggle queries |
| `isHidden` + `flightDate` | ASC, ASC | **Poster & Reports — All Sectors** (no sectorId/agentId filter) |
| `agentId` + `sectorId` + `isHidden` + `flightDate` | ASC, ASC, ASC, ASC | Full 4-field filter queries |

> **Important:** The `isHidden + flightDate` index (6th row) is the one required when generating a poster or report for **All Sectors** with no agent or sector constraint. It was added in March 2026 to fix the "Generation Failed — query requires an index" error.

---

## Cloud Functions

Callable functions are **HTTPS Callable**, deployed to `asia-south1`, running on **Node.js 22 (2nd Gen)**.  
They require `admin: true` custom claim — enforced server-side via `requireAdmin()` helper.  
`ingestFaresFromN8n` is an **HTTPS onRequest** endpoint secured via Bearer token (used by n8n).  
`purgeOldFaresDaily` is a **scheduled** function that auto-cleans old fares.

| Function | What it does |
|---|---|
| `bulkDeleteFares` | Batch-deletes `agent_fares` matching optional filters: `agentId`, `sectorId`, `startDate`, `endDate`. At least one filter required. Builds query dynamically. |
| `bulkToggleAgentVisibility` | Sets `isActive` on agent + `isHidden` on all their fares |
| `bulkToggleSectorVisibility` | Sets `isHidden` on all fares for a given `sectorId` |
| `generateAgentReport` | Aggregates fares with fully optional filters (sector, agent, date range). **All filters are optional** — passing no filters returns stats across the entire dataset. Returns per-agent and per-sector stats (counts, totalRate, min/max, avgRate). Used to power charts and leaderboards. |
| `ingestFaresFromN8n` | HTTPS onRequest endpoint. Authenticates payload from n8n via Bearer token. At startup, loads `sectors`, `airlines`, **`agents`**, and **`flight_details`** maps. For each fare row, commission is sourced from the agent's Firestore document (`agents.commission`); falls back to 500 if unset. n8n payload can override commission per-row if explicitly provided. `finalRate` is `sp_rate + commission` unless the payload sends an explicit `rate`. Baggage is forced onto the airline rules and flight time is resolved payload-first with a `flight_details` fallback (see [Flight Time Resolution](#flight-time-resolution)). Batch-writes to `agent_fares`. An empty `firebaseData` array is valid and returns `saved: 0`. |
| `refreshSocialPublishingHealth` | Admin callable. Rebuilds the saved posting setup snapshot from configured/fallback channel IDs and API-key presence without making any Buffer API calls. |
| `runSocialQueueNow` | Admin callable. Immediately dispatches up to 6 due `social_queue` items (max 1 airport group per run) instead of waiting for the next minute cron. |
| `retrySocialJobItem` | Admin callable. Creates a fresh queue item from retained media for a non-posted errored job item without mutating the old queue record. |
| `purgeOldFaresDaily` | Scheduled cleanup. Deletes `agent_fares` with `flightDate` earlier than **today − 2 days** (UTC midnight). Keeps the most recent two days of fares plus today. |

**Social publishing scheduled workers**
- `autoPostDaily` renders scheduled posters, creates `social_jobs` / `social_jobs/*/items`, uploads media, and enqueues queue docs.
- `socialQueueDispatcher` runs every minute, leases due queue docs, and dispatches them to airport-specific Buffer channels with retry backoff (`2m -> 10m -> 30m`, max 3 attempts).
- `purgeSocialPublishing` runs every 5 minutes and removes terminal `social_queue` docs, related `generated_posters/*` media, and expired `social_jobs` after exactly 72 hours.

---

## Security Rules Summary

### Firestore (`firestore.rules`)
- **Public read:** `sectors`, `airlines`, `agent_fares` (only if `isHidden==false` and agent `isActive==true`)
- **Admin read/write:** All collections — requires `request.auth.token.admin == true`

### Storage (`storage.rules`)
- **Public read:** All files
- **Admin write only:** `/agent_logos/**`, `/airline_logos/**`, `/country_flags/**`, `/generated_posters/**`, `/tour_images/**`, `/hajj_umrah_images/**`
- Validates: image MIME type + max 5MB file size (generated_posters exempt from size check)
- `country_flags/` path: stores flag images uploaded via the Visas tab for display on the public visa page
- `tour_images/` path: stores cover images uploaded via the Tours tab for display on public tour pages
- `hajj_umrah_images/` path: stores cover images for the Hajj & Umrah tab for display on its public page

---

## Frontend Service Layer (`db.js`)

`db.js` is the single source of truth for all Firebase interactions. `main.js` never imports the Firebase SDK directly.

**Exported functions:**

```
Agents:   getAgents(), addAgent(), updateAgent(), deleteAgent()
Sectors:  getSectors(), addSector(), updateSector(), deleteSector()
Airlines: getAirlines(), addAirline(), updateAirline(), deleteAirline()
Fares:    getFares(filters), addFare(data), deleteFare(), updateFare()
          getFares({ agentId?, sectorId?, startDate?, endDate?, includeHidden? })
Visas:    getVisas(), addVisa(), updateVisa(), deleteVisa()
          getVisaStampings(), addVisaStamping(), updateVisaStamping(), deleteVisaStamping()
          getAttestations(), addAttestation(), updateAttestation(), deleteAttestation()
          getPassportServices(), addPassportService(), updatePassportService(), deletePassportService()
Tours:    getTours({ includeInactive? }), addTour(data, imageFile?),
          updateTour(id, data, imageFile?), deleteTour(id), getTourById(id)
Hajj/Umrah: getHajjUmrahPackages({ includeInactive? }), addHajjUmrahPackage(data, imageFile?),
            updateHajjUmrahPackage(id, data, imageFile?), deleteHajjUmrahPackage(id)
Storage:  uploadLogo(folder, file), deleteLogo(url)
Functions:
  callToggleAgentVisibility(agentId, isActive)
  callToggleSectorVisibility(sectorId, isHidden)
  callGenerateAgentReport(startDate?, endDate?, sectorId?, agentId?)
    — all params fully optional; passing none returns full-dataset aggregation
  callRefreshSocialPublishingHealth(marketKey?)
  callRunSocialQueueNow()
  callRetrySocialJobItem(jobId, itemId)
Social pipeline:
  createSocialJob(data), updateSocialJob(jobId, data)
  createSocialJobItem(jobId, data), updateSocialJobItem(jobId, itemId, data)
  subscribeSocialPublishingConfig(callback)
  subscribeRecentSocialJobs(callback, maxItems?)
  subscribeSocialJobItems(jobId, callback)
  uploadAndQueueForSocial(blob, filename, meta)
  uploadAndQueueCarousel(items, meta)
```

---

## UI System

- **Modal:** Native `<dialog>` element (`#admin-modal`) — JS sets `#modal-title` and `#modal-body` HTML, then calls `.showModal()`
  - **Width:** defaults to `max-w-lg`; switches to `max-w-2xl` when `openModal()` is called with `wide = true` (used for Tours and similar wide forms)
  - **Scrollable body:** `#modal-body` has `overflow-y-auto`; the header is sticky so it stays pinned while the body scrolls. Max height is `90vh` so tall forms (e.g. tour with many itinerary days) never overflow the viewport.
  - **Sticky footer:** `.admin-modal-footer` stays visible with a soft gradient so action buttons are always in reach.
- **Toasts:** `#toastsEl` container — `toast(type, title, msg)` renders success/error/warning notifications with auto-dismiss (7s)
- **Tables:** `.admin-table` CSS class with alternating row striping and hover states; each tab renders into its own `<div id="[tab]-results">` container
- **Auth guard:** Page is hidden via `document.documentElement.style.visibility = 'hidden'` until `onAuthChange` confirms valid admin session
- **Stat cards** (`#report-stats-row`) — hidden by default; revealed by `renderReportCharts()` after a report is generated
- **Empty states:** All tables and result containers show a styled icon + message when empty, injected directly into the results container `innerHTML`

---

## How to Set Admin Custom Claim

Run once when adding a new admin user (requires a service account key):

```bash
SERVICE_ACCOUNT_PATH="/path/to/service-account.json" \
node scripts/set-admin-claim.cjs --email admin@example.com
```

Or by UID:

```bash
SERVICE_ACCOUNT_PATH="/path/to/service-account.json" \
node scripts/set-admin-claim.cjs --uid USER_UID
```

> **Important:** The service account JSON is **not committed to git**. Download from Firebase Console → Project Settings → Service Accounts when needed, then delete after use. Users must sign out/in (or refresh token) for the claim to take effect.

---

## Deploy Commands

```bash
# Frontend deployment is automated via Vercel (push to Git)

# Deploy Firebase backend services (from zamra/ root)
npx firebase-tools@latest deploy --only firestore
npx firebase-tools@latest deploy --only storage
npx firebase-tools@latest deploy --only functions
# If CLI targets the wrong project, add: --project zamra-web-01
```

---

---

## Known Bugs Fixed

| Bug | Root Cause | Fix |
|---|---|---|
| **Multiple confirm() prompts on delete** | All `wireXxxActions()` functions deleted and re-set the `actionsWired` data attribute on every render, causing a new `addEventListener` to stack on the persistent `<tbody>` element each time. After N tab refreshes, one click triggered N listeners. | Changed all 7 wire functions (`wireVisaActions`, `wireVisaStampingActions`, `wireAttestationActions`, `wirePassportServiceActions`, `wireSectorActions`, `wireAirlineActions`, `wireTourActions`, `wireHajjUmrahActions`) to bail early if `tbody.dataset.actionsWired` is already set — matching the correct pattern already used by `wireAgentActions`. |
| **Multi-page routing broken on refresh** | `firebase.json` had a catch-all rewrite rule (`**` to `/index.html`) spanning the entire site, which directed requests for `/admin.html` to the index page instead. | Removed the catch-all and added specific targeted rewrites for `/admin` and `/login` (while Vercel handles the heavy lifting for multi-page frontend routing normally). |
| **Inefficient `getTourById`** | Used `getDocs` with a `where()` filter instead of direct `getDoc`. | Refactored `getTourById(id)` to use `doc(db, 'tours', id)` and `getDoc()`, optimizing read operations and latency. |
| **PDF E-Ticket Print Margins/UI elements** | The PDF export included UI webpage borders, rounded corners, and box-shadows on the wrapper. | Overrode CSS under `@media print` to force `border: none`, `box-shadow: none`, and `border-radius: 0` inside the printable area container. |
| **Hajj & Umrah packages not showing on public page** | `hajj-umrah.js` used `where('isActive','==',true) + orderBy('createdAt','desc')` — Firestore requires a composite index for this combination which didn't exist, causing silently empty results. | Removed `orderBy` from the Firestore query; packages are now fetched with only `where('isActive','==',true)` (no index needed) and sorted client-side by `departureDate`. |
| **Poster "Generation Failed" on All Sectors** | `getFares({ sectorId: 'all', includeHidden: false })` with no agentId/sectorId equality filter produces `where('isHidden','==',false) + orderBy('flightDate')` — a combination Firestore requires a composite index for. The `isHidden + flightDate` index was missing from `firestore.indexes.json`. | Added `isHidden + flightDate` (ASC, ASC) and `agentId + sectorId + isHidden + flightDate` composite indexes and deployed them via `firebase deploy --only firestore:indexes`. |
| **Reports blocked for All Sectors + All Agents + no dates** | Both the frontend (`renderReportsTab` in `main.js`) and the `generateAgentReport` Cloud Function had a guard that threw an error when all filters were at their defaults, preventing any full-dataset report. | Removed the `'No Filter Selected'` toast guard from `main.js` and the `HttpsError('invalid-argument')` throw from `functions/index.js`. All filters are now fully optional in both layers. |

---

_Last audited: 2026-04-27 — Social publishing uses a durable Firestore-backed job/queue pipeline with saved posting setup snapshots, direct Buffer `createPost` dispatch only, `Created` / `Posted` operator-facing job states, airport-country feed-only image carousels capped at 6 queue items / 12 Buffer calls per airport run, airport-country video batches queued as paired `9:16` reels plus best-effort `16:9` YouTube uploads with a shared 19-slide cap, retryable retained media, inline activity/history UI in the Socials tab, and 72-hour retention for queue/job/media cleanup. Poster generator still keeps infinite brand-safe palettes, video progress feedback, clean poster-page slideshow exports, and merged multi-page videos; poster footer contact remains +91 9846606739._
