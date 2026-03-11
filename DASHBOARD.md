# Zamra Travels — Admin Dashboard & Firebase Backend

> Part of the Zamra project. See also: [WEBSITE.md](./WEBSITE.md) | [AGENTS.md](./AGENTS.md)

---

## Overview

The admin dashboard (`web/admin.html`) is a fully Firebase-integrated, auth-gated management panel for Zamra Travels staff. It allows admins to manage agents, flight sectors, airlines, pricing data, and view aggregated reports — all backed by live Firestore data and Cloud Functions.

**Live URL:** https://zamra-web.web.app/admin.html  
**Access:** Requires a Firebase account with `admin: true` custom claim.  
**Current Admin:** `sahal@admin.com`

---

## Firebase Project

| Property | Value |
|---|---|
| Project ID | `zamra-web` |
| Hosting URL | https://zamra-web.web.app |
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
| **Firebase Hosting** | Serves the built `web/dist/` | ✅ Live |

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
    ├── styles/admin/style.css          # Admin-specific CSS (chips, progress bar, etc.)
    └── js/admin/
        ├── firebase-config.js          # Firebase init — exports: auth, db, storage, functions
        ├── auth.js                     # onAuthChange(), logoutUser()
        ├── login.js                    # Login page logic
        ├── db.js                       # ★ Firestore + Storage service layer (all CRUD)
        └── main.js                     # ★ All 6 tab controllers + modal + toast system
```

---

## Dashboard Tabs

### 1. 📊 Dashboard Tab
- **Search** fares with flexible optional filters: Sector, Agent, Start Date, End Date
- **Only one filter is required** — select a sector alone to see all its fares; add dates/agent to narrow results
- Displays a full results table with: Date, Sector, Airline, Agent, Rate (₹), Baggage, Status (Live/Hidden)
- Inline **Hide/Show** and **Delete** per fare row
- All data from Firestore `agent_fares`

### 2. 👥 Agents Tab
- **Full CRUD** — Add / Edit (modal form) / Delete agents
- **Pagination** — 10 agents per page with Previous/Next/page-number controls
- **Hide All / Show All** — calls `bulkToggleAgentVisibility` Cloud Function, which updates the agent's `isActive` flag AND toggles `isHidden` on all their fares at once
- **Bulk Delete Fares** — deletes fares matching any combination of optional filters: Agent, Sector, Start Date, End Date. At least one filter must be set. Calls `bulkDeleteFares` Cloud Function.
- Confirm dialog shows a human-readable summary of the exact filter combination before deletion
- Data from Firestore `agents` collection

### 3. 🗺️ Sectors Tab
- **Full CRUD** — Add / Edit / Delete sectors
- **Hide Fares / Show Fares** — calls `bulkToggleSectorVisibility` Cloud Function to toggle `isHidden` on all fares for a route
- Data from Firestore `sectors` collection (fields: `sectorFrom`, `sectorTo`, `sectorCode`)

### 4. ✈️ Flights Tab (Airlines)
- **Full CRUD** — Add / Edit / Delete airlines
- **Logo upload** — uploads to Firebase Storage (`/airline_logos/`), stores URL in Firestore
- Data from Firestore `airlines` collection (fields: `name`, `code`, `logoUrl`)

### 5. 📋 Agent Sheets Tab
- **Agent selector** — chips populated from live Firestore `agents` list
- **Paste raw rate text** — agent-formatted WhatsApp/text fare data
- **Submit** — Sends raw text payload securely to the **n8n AI webhook** at `https://n8n.srv1046139.hstgr.cloud/webhook/zamra`. The frontend no longer parses and saves this locally.
- **N8n Processing** — N8n extracts structured flight data via an LLM and then calls the `ingestFaresFromN8n` Cloud Function to securely save fares into `agent_fares` in Firestore.
- Submission history stored in `localStorage` (last 15 sessions)

### 6. 📈 Reports Tab
- **Sector + Agent filters** (primary) + optional date range
- **Only one filter is required** — pick a sector alone to run a report; agent and dates further narrow the aggregation
- Filter order in UI: Sector → Agent → Start Date → End Date
- Calls `generateAgentReport` Cloud Function
- Renders results as:
  - **Bar chart** — fares per agent (top 8)
  - **Pie chart** — fares per sector (conic-gradient CSS)

---

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
| `isHidden` | Boolean | `true` = hidden from public site |
| `createdAt` | Timestamp | Server timestamp |

### `services`
| Field | Type | Notes |
|---|---|---|
| `serviceType` | String | e.g. `'Visa'`, `'Hotel'` |
| `title` | String | |
| `basePrice` | Number | |
| `isActive` | Boolean | |

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
| `generateAgentReport` | Aggregates fares with optional filters (sector, agent, date range). All filters optional individually — at least one required. Returns per-agent count/avgRate + per-sector count. |
| `ingestFaresFromN8n` | HTTPS onRequest endpoint. Authenticates payload from n8n via Bearer token, maps sector/airline codes, and batch writes to `agent_fares`. |

---

## Security Rules Summary

### Firestore (`firestore.rules`)
- **Public read:** `sectors`, `airlines`, `agent_fares` (only if `isHidden==false` and agent `isActive==true`)
- **Admin read/write:** All collections — requires `request.auth.token.admin == true`

### Storage (`storage.rules`)
- **Public read:** All files
- **Admin write only:** `/agent_logos/**`, `/airline_logos/**`, `/generated_posters/**`
- Validates: image MIME type + max 5MB file size

---

## Frontend Service Layer (`db.js`)

`db.js` is the single source of truth for all Firebase interactions. `main.js` never imports the Firebase SDK directly.

**Exported functions:**

```
Agents:   getAgents(), addAgent(), updateAgent(), deleteAgent()
Sectors:  getSectors(), addSector(), updateSector(), deleteSector()
Airlines: getAirlines(), addAirline(), updateAirline(), deleteAirline()
Fares:    getFares(filters), deleteFare(), updateFare()
          getFares({ agentId?, sectorId?, startDate?, endDate?, includeHidden? })
Storage:  uploadLogo(folder, file), deleteLogo(url)
Functions:
  callBulkDeleteFares(agentId?, startDate?, endDate?, sectorId?)
    — all params optional; at least one required
  callToggleAgentVisibility(agentId, isActive)
  callToggleSectorVisibility(sectorId, isHidden)
  callGenerateAgentReport(startDate?, endDate?, sectorId?, agentId?)
    — all params optional; at least one required
```

---

## UI System

- **Modal:** Native `<dialog>` element (`#admin-modal`) — JS sets `#modal-title` and `#modal-body` HTML, then calls `.showModal()`
- **Toasts:** `#toastsEl` container — `toast(type, title, msg)` renders success/error/warning notifications with auto-dismiss (7s)
- **Tables:** `.admin-table` CSS class with hover states
- **Auth guard:** Page is hidden via `document.documentElement.style.visibility = 'hidden'` until `onAuthChange` confirms valid admin session

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
# Build + deploy everything (from zamra/ root)
cd web && npm run build && cd .. && npx firebase-tools@latest deploy

# Deploy specific services only
npx firebase-tools@latest deploy --only firestore
npx firebase-tools@latest deploy --only storage
npx firebase-tools@latest deploy --only functions
npx firebase-tools@latest deploy --only hosting
```
