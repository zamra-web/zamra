# Zamra Travels — Main Website

> Part of the Zamra project. See also: [DASHBOARD.md](./DASHBOARD.md) | [AGENTS.md](./AGENTS.md)

---

## Overview

The main website (`web/index.html`) is a premium, public-facing flight booking and travel services portal for Zamra Travels. It is fully responsive, mobile-optimised, and driven by live data from Firebase Firestore.

**Live URL:** https://zamra-web.web.app  
**Local dev:** `cd web && npm run dev` → http://localhost:5173

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| JavaScript | Vanilla ES Modules (no framework) |
| Database | Firebase Firestore (read-only from public pages) |
| Hosting | Firebase Hosting (`web/dist/` → `zamra-web.web.app`) |

---

## Pages

| File | Route | Purpose |
|---|---|---|
| `web/index.html` | `/` | Homepage — hero, flight search, sectors, services |
| `web/visa.html` | `/visa.html` | Visa services — Visas, Stamping, Attestations, Passport Services |
| `web/login.html` | `/login.html` | Admin login page (Firebase Auth) |
| `web/admin.html` | `/admin.html` | Admin dashboard (auth-gated, see DASHBOARD.md) |

---

## File Structure

```
web/
├── index.html                  # Homepage entry point
├── visa.html                   # Visa services page
├── login.html                  # Admin login page
├── admin.html                  # Admin dashboard (auth-gated)
├── vite.config.js              # Multi-page Vite config (index + login + admin)
├── package.json                # Dependencies: vite, tailwindcss, firebase
│
├── public/
│   └── assets/
│       ├── img/                # All images stored locally (migrated from CDN/Unsplash)
│       └── icons/              # Favicon and app icons
│
└── src/
    ├── styles/
    │   ├── web/style.css       # Main site CSS — Tailwind @theme tokens + @import
    │   └── admin/style.css     # Admin dashboard CSS (chip grid, progress bar, etc.)
    │
    └── js/
        ├── web/
        │   ├── main.js         # All frontend logic (flight search, UI interactions)
        │   └── visa.js         # Visa page logic (services fetch, modal, whatsapp link)
        └── admin/
            ├── firebase-config.js  # Firebase app init — exports auth, db, storage, functions
            ├── auth.js             # onAuthChange, logoutUser helpers
            ├── login.js            # Login page logic
            ├── db.js               # Firestore + Storage service layer
            └── main.js             # Admin dashboard logic (all tabs)
```

---

## Key Frontend Features

### 🔍 Live Flight Search
- Full "From" and "To" origin/destination selection with location swap functionality
- Reads from Firestore `agent_fares` collection in real-time
- Filters by sector, date, and only shows fares where `isHidden == false` and agent `isActive == true`
- Displays cheapest fare per sector, sorted by price
- Implemented in `web/src/js/web/main.js`

### ✈️ Sectors Display (Lowest Fare Flight Tickets)
- Reads `sectors` collection from Firestore
- Groups routes by top-level "Origin" cards (e.g., India to Middle East)
- Clicking an Origin opens a modal with destination Routes
- Clicking a Route opens the **Flight Details modal** with live pricing
  - Modal width: `max-w-[760px]` — wide enough to show all columns (Date, Airlines, Departure, Arrival, Price, Book Now) **without horizontal scrolling**
  - Table `min-w-[680px]` ensures the Book Now button is always immediately visible
- Includes "Back to Destinations" navigation within the modal
- **Book Now** button opens a pre-filled WhatsApp message to the Zamra Travels number

### 🚀 Smooth Scrolling and Navigation
- All local navigation links use `#anchor` tags handled gracefully via custom JavaScript
- Implements smooth scrolling with fixed-header offsets instead of hard page refreshes

### 🛎️ Services Section
- Reads `services` collection from Firestore
- Displays travel services offered by Zamra

### 📱 Mobile Optimisation
- Fully responsive via Tailwind `md:` and `max-sm:` breakpoints
- Mobile hamburger nav uses vanilla CSS `@layer components` in `style.css`

---

## Styling System

The site uses a **Tailwind CSS v4 `@theme` design token system** defined in `web/src/styles/web/style.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: ...;
  --color-navy: ...;
  --color-text-muted: ...;
  --shadow-premium-soft: ...;
  /* etc. */
}
```

All components use these tokens via Tailwind utility classes. Custom vanilla CSS is minimal and limited to the hamburger menu mechanism.

---

## Asset Management

- **All images are local** — stored in `web/public/assets/img/`
- External images (Unsplash, Zamra CDN) were migrated via `download_images.sh`
- Reference assets in HTML/JS as `/assets/img/filename.jpg` (Vite serves `public/` from root)

---

## Firebase (Public Read)

The public website reads from Firestore with these security rules:
- `sectors` — public read ✅
- `airlines` — public read ✅
- `agent_fares` — public read only if `isHidden == false` AND agent `isActive == true` ✅
- All other collections — **admin only** 🔒

---

## Build & Deploy

```bash
# Local development
cd web && npm run dev

# Production build
cd web && npm run build        # outputs to web/dist/

# Deploy hosting only
cd zamra/
npx firebase-tools@latest deploy --only hosting
```

---

## Firestore Collections Read by Website

| Collection | Fields Used |
|---|---|
| `sectors` | `sectorFrom`, `sectorTo`, `sectorCode` |
| `airlines` | `name`, `code`, `logoUrl` |
| `agent_fares` | `sectorId`, `airlineId`, `flightDate`, `finalRate`, `baggage`, `flightTime`, `isHidden` |
| `services` | `serviceType`, `title`, `basePrice`, `isActive` |
| `visas` | `countryName`, `visaType`, `processingTime`, `rate`, `flagUrl` |
| `visa_stamping` | `country`, `description`, `processingTime`, `cost` |
| `attestations` | `country`, `certificate`, `cost` |
| `passport_services` | `type`, `description`, `cost` |
