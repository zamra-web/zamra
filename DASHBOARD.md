# Zamra Travels — Admin Dashboard & Firebase Backend

> Part of the Zamra project. See also: [WEBSITE.md](./WEBSITE.md) | [AGENTS.md](./AGENTS.md)

---

## Overview

The admin dashboard (`web/admin.html`) is a fully Firebase-integrated, auth-gated management panel for Zamra Travels staff. It allows admins to manage agents, flight sectors, airlines, pricing data, and view aggregated reports — all backed by live Firestore data and Cloud Functions.

**Live URL:** https://zamra.vercel.app/admin.html  
**Access:** Requires a Firebase account with `admin: true` custom claim.  
**Current Admin:** `sahal@admin.com`

---

## Firebase Project

| Property | Value |
|---|---|
| Project ID | `zamra-web` |
| Hosting URL | https://zamra.vercel.app |
| Console | https://console.firebase.google.com/project/zamra-web |
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
├── .firebaserc                 # Links CLI to zamra-web project
│
└── functions/                  # Cloud Functions (Node.js 22, 2nd Gen)
    ├── index.js                # 4 callable functions
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
        └── main.js                     # ★ All tab controllers + modal + toast system
```

---

## Dashboard Tabs

### 1. 📊 Dashboard Tab
- **Poster Generator** — select a sector (or 'All Sectors') and optional date range, click **Generate Poster** to preview a shareable fare poster
  - Displays fares sorted by date (up to 10 for single sector, or unlimited for 'All Sectors' with a unified sector column)
  - Layout utilizes a concise, dense row design to fit more fares cleanly into the poster
  - **Airline logos** are pre-fetched as blob URLs before rendering (with case-insensitive, whitespace-trimmed lookups) — sidesteps CORS for `html2canvas`
  - **Download JPEG** — renders poster to canvas at 2× resolution and triggers a `.jpg` download
  - **Download PDF** — converts canvas to mm-based jsPDF page exactly sized to the poster dimensions
  - **Create Video** — generates animated poster slideshow sequences of static screens in 1:1, 9:16, or 16:9 formats. Relies on `Canvas` rendering iteratively and `MediaRecorder` dumping streams to `.mp4` format natively.
  - Export buttons disable during generation and re-enable once done
- Calls `getFares({ sectorId, startDate, endDate, includeHidden: false })` — only live fares shown on posters
- All data from Firestore `agent_fares` + `airlines`

### 2. 👥 Agents Tab
- **Full CRUD** — Add / Edit (modal form) / Delete agents
- **Commission field** — Each agent has a `commission` (₹) value set via the Add/Edit modal. This value is automatically stamped onto every fare ingested for that agent via `ingestFaresFromN8n`. Default is ₹500 if not specified.
- **Table Controls** — "Show N entries" dropdown (10, 25, 50, 100, All) and a real-time Search bar (filters by name, email, phone, or ID).
- **Pagination** — Previous/Next/page-number controls that integrate seamlessly with the search and entries limit.
- **Hide All / Show All** — calls `bulkToggleAgentVisibility` Cloud Function, which updates the agent's `isActive` flag AND toggles `isHidden` on all their fares at once
- Data from Firestore `agents` collection
- **Table columns:** ID · Name · Email · Phone · **Commission** · Status · Actions

### 3. 🗺️ Sectors Tab
- **Full CRUD** — Add / Edit / Delete sectors
- **Pagination** — 10 sectors per page
- **Hide Fares / Show Fares** — calls `bulkToggleSectorVisibility` Cloud Function to toggle `isHidden` on all fares for a route
- Data from Firestore `sectors` collection (fields: `sectorFrom`, `sectorTo`, `sectorCode`)

### 4. ✈️ Flights Tab (Airlines)
- **Full CRUD** — Add / Edit / Delete airlines
- **Pagination** — 10 airlines per page
- **Logo upload** — uploads to Firebase Storage (`/airline_logos/`), stores URL in Firestore
- Data from Firestore `airlines` collection (fields: `name`, `code`, `logoUrl`)

### 5. 📈 Reports Tab
- **Filter Bar** — premium card with icon header. Fields: Sector, Agent (optional), From Date (optional), To Date (optional), and a gradient **Generate Report** button with a lightning icon.
- **Only one filter is required** — pick a sector alone to run a report; agent and dates further narrow the aggregation.
- Calls `generateAgentReport` Cloud Function for summary stats (charts), then fetches raw fares via `getFares()` for the full table.
- **Stat Cards (5)** — appear after a report is generated, showing real-time counts from `_reportFares`:
  - 🎫 **Total Fares** — total count returned
  - 👁️ **Live** — fares where `isHidden === false`
  - 🚫 **Hidden** — fares where `isHidden === true`
  - 👥 **Agents** — unique agent count in the result set
  - 💰 **Avg Fare** — average rate calculated dynamically from the fetched fares
- **Bar Chart — Fares per Agent (SVG)** — interactive gradient bars with tooltips for count/avg rate and dynamic Y-axis. Smooth growing animations.
- **Donut Chart — Fares per Sector (SVG)** — interactive pie segments. Hovering highlights slices, updates the center count/label dynamically, and cross-highlights the respective legend item.
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
  - Columns: **Date · Time · Sector · Airline · Agent · SP Rate · Rate · Comm · Bag · Ex.Bag · Status · Actions**
  - Inline per-row **Delete** and **Hide/Show** — update `_reportFares` in place without re-fetching
- **Export CSV** — greyed out until data is loaded; unlocked automatically after a successful report fetch. Downloads full filtered set (not just current page). All IDs resolved to human-readable names. UTF-8 BOM prefix for correct Excel rendering.

> **Implementation note:** `renderReportCharts()` populates the stat cards and both charts, then wires the CSV button via `cloneNode` to avoid duplicate listeners. `renderReportFaresTable()` injects only the `<table>` + pagination footer into `#report-fares-results` — it does **not** wrap in its own card (the outer HTML card in `admin.html` already wraps it).

### 6. 🗃️ Database Tab
- **Spreadsheet View for `agent_fares`** — dedicated sheet-style table for admins to manage all fare rows in one place.
- **Inline Editing** — editable cells for date, time, agent, sector, airline, **SP Rate + Commission**, baggage, extra baggage, and status.
- **Rate Formula** — `Final Rate` is auto-calculated in-sheet as `SP Rate + Commission` (read-only field).
- **Baggage Inputs** — `Baggage` and `Extra Baggage` use dropdowns powered by the same baggage option set used in the E-Ticket flow.
- **Row Actions** — per-row Save, **Share** (copies WhatsApp-formatted enquiry text to clipboard), Reset, and Delete controls.
- **Bulk Operations** — multi-select checkboxes + **Delete Selected** action.
- **Save All Workflow** — tracks unsaved rows and allows saving all pending edits in one action.
- **Filters + Search** — filter by agent, sector, airline, status, and date range; plus free-text search.
- **Add Fare** — opens a modal form to insert a brand-new fare row into Firestore.

### 7. 📋 Rate Upload Tab
- **AI Rate Intake** — premium step-by-step UI for agent selection and raw fare submission
- **Agent selector** — chips populated from live Firestore `agents` list (manual override supported)
- **Paste raw rate text** — WhatsApp, email, or plain-text fare dumps
- **Live preview** — lightweight client-side parse shows detected entries before submit
- **Submit** — Sends raw text payload securely to the **n8n AI webhook** at `https://n8n.srv1046139.hstgr.cloud/webhook/zamra`. The frontend no longer parses and saves this locally.
- **N8n Processing** — N8n extracts structured flight data via an LLM and then calls the `ingestFaresFromN8n` Cloud Function to securely save fares into `agent_fares` in Firestore.
- **Session cards** — local browser stats (submissions + entries) and recent submissions list stored in `localStorage` (last 15 sessions)
- **Staggered reveal** — cards animate in on tab activation for a premium feel (respects `prefers-reduced-motion`)

### 8. 🎟️ E-Ticket Tab
- **Manual E-Ticket Generator** — issue professional, branded e-tickets directly from the dashboard.
- **Premium Layout System** — ticket output now uses a structured document layout (header meta, route summary cards, flight table, passenger manifest, advisory block) optimized for both on-screen preview and A4 print/PDF.
- **Dynamic Selectors** — pulls active airlines, origins, and destinations from Firestore to pre-populate dropdowns.
- **Airline Logos** — dynamically fetches and embeds airline logos from Firebase Storage into the ticket header.
- **Dynamic Passenger Rows** — allows adding multiple passengers and specifying check-in/carry-on baggage per passenger.
- **Automated Formatting** — precisely structured classic ticket layout with travel details, pax details, passenger flight segments, dynamic baggage mapping, explicit top-level passenger counts, tightened airline PNR spacing, and appended travel rules.
- **Print / PDF Export** — specifically engineered with strict CSS `@media print` overrides (removing borders, shadows, and rounded corners) to guarantee a clean, borderless A4-native document generation via the browser's native print dialog.

### 9. 🛂 Visas Tab
- **Comprehensive Visa Services Management** — Full CRUD management for four distinct service types via isolated inner tabs:
  - **Visas** — standard tourist/business visas (Country, Type, Rate, Processing Time, Optional Flag Image stored in Storage).
  - **Visa Stamping** — country-specific stamping services.
  - **Attestations** — document/certificate attestation services.
  - **Passport Services** — fresh, renewal, and detail update services.
- **Live Sync** — data drives the dynamic tables and modal inquiries directly on the public `visa.html` page.
- **Sub-Tabs** — seamless client-side toggling between the 4 sub-collections without page reload.

### 10. 🗺️ Tours Tab
- **Full CRUD for tour packages** — Add / Edit (modal form) / Delete.
- **Table columns:** Cover Image · Title · Category · Duration · Price · Status (Active / Hidden) · Actions
- **Add/Edit modal fields:**
  - Title, Category (`International` / `Domestic` / `Hajj-Umrah`), Duration
  - Price in ₹ (set `0` for "Call for Price")
  - Active toggle — controls visibility on public `/tours.html`
  - Description, Highlights (newline-separated list)
  - Itinerary — **JSON array** of day objects `[{"day":"Day 1 – Arrival","activities":[...]}]`; invalid JSON blocked with toast error
  - Inclusions / Exclusions (newline-separated lists)
  - Cover Image upload → Firebase Storage `tour_images/` folder
- **Live Sync** — data drives `/tours.html` and `/tour-detail.html` public pages.
- Data from Firestore `tours` collection.

### 11. 🕋 Hajj & Umrah Tab
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
| `baggage` | String | e.g. `'30kg'` |
| `extraBaggage` | Number | Extra baggage allowance in kg |
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

### `attestations`
| Field | Type | Notes |
|---|---|---|
| `country` | String | Target country |
| `certificate` | String | Type of certificate e.g. `'Marriage'` |
| `cost` | Number | Cost in ₹ |

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
| `category` | String | `'International'`, `'Domestic'`, or `'Hajj-Umrah'` |
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

---

## Firestore Indexes

5 compound indexes on `agent_fares` for dashboard queries:

| Fields | Order |
|---|---|
| `agentId` + `flightDate` | ASC, ASC |
| `sectorId` + `flightDate` | ASC, ASC |
| `agentId` + `sectorId` + `flightDate` | ASC, ASC, ASC |
| `isHidden` + `flightDate` | ASC, ASC |
| `agentId` + `isHidden` + `flightDate` | ASC, ASC, ASC |

---

## Cloud Functions

All 4 functions are **HTTPS Callable**, deployed to `asia-south1`, running on **Node.js 22 (2nd Gen)**.  
All require `admin: true` custom claim — enforced server-side via `requireAdmin()` helper.

| Function | What it does |
|---|---|
| `bulkDeleteFares` | Batch-deletes `agent_fares` matching optional filters: `agentId`, `sectorId`, `startDate`, `endDate`. At least one filter required. Builds query dynamically. |
| `bulkToggleAgentVisibility` | Sets `isActive` on agent + `isHidden` on all their fares |
| `bulkToggleSectorVisibility` | Sets `isHidden` on all fares for a given `sectorId` |
| `generateAgentReport` | Aggregates fares with optional filters (sector, agent, date range). All filters optional individually — at least one required. Returns per-agent and per-sector stats (counts, totalRate, min/max, avgRate). Used to power charts and leaderboards. |
| `ingestFaresFromN8n` | HTTPS onRequest endpoint. Authenticates payload from n8n via Bearer token. At startup, loads `sectors`, `airlines`, and **`agents`** maps. For each fare row, commission is sourced from the agent's Firestore document (`agents.commission`); falls back to 500 if unset. n8n payload can override commission per-row if explicitly provided. Batch-writes to `agent_fares`. |

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
    — all params optional; at least one required
```

---

## UI System

- **Modal:** Native `<dialog>` element (`#admin-modal`) — JS sets `#modal-title` and `#modal-body` HTML, then calls `.showModal()`
- **Toasts:** `#toastsEl` container — `toast(type, title, msg)` renders success/error/warning notifications with auto-dismiss (7s)
- **Tables:** `.admin-table` CSS class with alternating row striping and hover states; each tab renders into its own `<div id="[tab]-results">` container
- **Auth guard:** Page is hidden via `document.documentElement.style.visibility = 'hidden'` until `onAuthChange` confirms valid admin session
- **Stat cards** (`#report-stats-row`) — hidden by default; revealed by `renderReportCharts()` after a report is generated
- **Empty states:** All tables and result containers show a styled icon + message when empty, injected directly into the results container `innerHTML`

---

## How to Set Admin Custom Claim

Run once when adding a new admin user (requires service account key):

```javascript
// save as set-admin-claim.js, run: node set-admin-claim.js
const admin = require('./functions/node_modules/firebase-admin');
const serviceAccount = require('./service-account.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
admin.auth().getUserByEmail('EMAIL@HERE.COM').then(u => {
  admin.auth().setCustomUserClaims(u.uid, { admin: true });
  console.log('Done — user must sign out and back in.');
});
```

> **Important:** The service account JSON is **not committed to git**. Download from Firebase Console → Project Settings → Service Accounts when needed, then delete after use.

---

## Deploy Commands

```bash
# Frontend deployment is automated via Vercel (push to Git)

# Deploy Firebase backend services (from zamra/ root)
npx firebase-tools@latest deploy --only firestore
npx firebase-tools@latest deploy --only storage
npx firebase-tools@latest deploy --only functions
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

---

_Last audited: 2026-03-14 — Added Database row "Share" WhatsApp integration. Poster Generator supports 'All Sectors' and responsive row sizing. E-Ticket generator passenger counters and PDF print improvements._
