# Zamra Travels — Main Website

> Part of the Zamra project. See also: [DASHBOARD.md](./DASHBOARD.md) | [AGENTS.md](./AGENTS.md)

---

## Overview

The main website (`web/index.html`) is a premium, public-facing flight booking and travel services portal for Zamra Travels. It is fully responsive, mobile-optimised, and driven by live data from Firebase Firestore.

**Live URL:** https://zamra.vercel.app  
**Local dev:** `cd web && npm run dev` → http://localhost:5173

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| JavaScript | Vanilla ES Modules (no framework) |
| Database | Firebase Firestore (read-only from public pages) |
| Hosting | Vercel (`zamra.vercel.app`) |

---

## Pages

| File | Route | Purpose |
|---|---|---|
| `web/index.html` | `/` | Homepage — hero, flight search, sectors, services |
| `web/visa.html` | `/visa.html` | Visa services — tabbed UI for Visas, Stamping, Attestations, Passport Services |
| `web/tours.html` | `/tours.html` | Tours listing page — category filter chips, search, tour card grid |
| `web/tour-detail.html` | `/tour-detail.html?id=<docId>` | Tour detail page — itinerary timeline, inclusions/exclusions, sidebar |
| `web/hajj-umrah.html` | `/hajj-umrah.html` | Hajj & Umrah packages page — filters, search, package grid |
| `web/login.html` | `/login.html` | Admin login page (Firebase Auth) |
| `web/admin.html` | `/admin.html` | Admin dashboard (auth-gated, see DASHBOARD.md) |

---

## File Structure

```
web/
├── index.html                  # Homepage entry point
├── visa.html                   # Visa services page
├── tours.html                  # Tours listing page
├── tour-detail.html            # Tour detail page
├── hajj-umrah.html             # Hajj & Umrah packages page
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
        │   ├── visa.js         # Visa page logic — tab switching, card rendering, modal, WhatsApp link
        │   ├── tours.js        # Tours listing page — fetch, render cards, category filter chips, search
        │   ├── tour-detail.js  # Tour detail page — reads ?id=, fetches single tour + sidebar tours
        │   └── hajj-umrah.js   # Hajj & Umrah page — fetch, render cards, filter by type, search
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

## Visa Page (`visa.html` + `visa.js`)

The visa page is a **fully tabbed, premium-designed** public page served from `visa.html`.

### Tab Navigation
A sticky tab bar sits just below the header (at `top: 80px`) with four tabs:
- **Tourist Visas** — fetches `visas` collection; renders flag-image cards with country name, visa type, processing time, and rate
- **Visa Stamping** — fetches `visa_stamping`; renders service cards
- **Attestations** — fetches `attestations`; renders service cards
- **Passport Services** — fetches `passport_services`; renders service cards

Tabs are client-side only: clicking a tab adds/removes `.active` on `.visa-section-panel` divs — no page reload.

### Cards
- **Visa cards** (`visa-card` class): flag image fills the card header with gradient overlay; country name and arrow button overlay the image; visa type chip, processing time, and rate in the body below.
- **Service cards** (`service-card` class): icon block + title + sub-detail + rate. Icon animates to white-on-blue on hover.
- All cards have `translateY` hover lift with a primary-tinted box shadow.

### Modal (`#visa-modal`)
- Opens for **any** card click (visa, stamping, attestation, or passport)
- Full-screen overlay with `blur(8px)` dark backdrop
- Modal content scales in via CSS `transform: scale(0.97) → scale(1)` animation
- Banner: blurred flag as background + circular flag crop; or icon illustration for service types
- Info rows (Type, Processing Time, Rate) update dynamically per service type
- WhatsApp enquiry link is pre-filled with full service details

### Loading States
Each panel has skeleton shimmer cards while Firestore data is fetching. On error, a red warning state replaces the loader.

### Styling
All visa-page-specific styles live in a `<style>` block inside `visa.html` (not in `style.css`) because they are co-located, numerous, and self-contained to this page. The design tokens (`--color-primary`, `--font-heading`, etc.) from `style.css` are reused throughout.

---

## Tours Pages (`tours.html` + `tour-detail.html`)

### Tours Listing (`tours.html`)
- **Hero** with animated stats (total tours count, categories).
- **Category filter chips** — All, International, Domestic, Hajj-Umrah — toggle active state and re-filter the card grid.
- **Text search** — debounced 300 ms; searches by title, category, and destination.
- **Skeleton loaders** shown while Firestore fetches; empty-state message when no matches.
- **Tour cards** — cover image, category chip, duration, title, price (or "Call for Price" if `price === 0`), and a "View Details" button linking to `/tour-detail.html?id=<docId>`.
- **CTA strip** — WhatsApp enquiry button for custom packages.
- Logic in `src/js/web/tours.js` — fetches only `isActive === true` tours via `getTours()`.

### Tour Detail (`tour-detail.html?id=<docId>`)
Loads the tour document ID from the URL query param `?id=`.
- **Left column (main content):** hero image, breadcrumbs, title, description, day-by-day itinerary timeline, inclusions list, exclusions list.
- **Right column (sticky sidebar):** price badge (or "Call for Price"), quick info (duration, category), Call Now button, WhatsApp enquiry button, other active tours list for navigation.
- **Meta tags** (title, description) updated dynamically per tour.
- **Not-found state** shown if the tour ID does not exist in Firestore.
- Logic in `src/js/web/tour-detail.js`.

---

## Hajj & Umrah Page (`hajj-umrah.html` + `hajj-umrah.js`)

- **Hero** with animated background image and stats (packages, happy pilgrims, global presence).
- **Category filter chips** — All, Hajj, Umrah — to quickly filter packages.
- **Text search** — debounced 300 ms; searches by title, destination/city, and airline.
- **Skeleton loaders** shown while fetching from Firestore; empty state when no matches.
- **Package cards** — displays cover image, package type (Hajj/Umrah), days/nights, title, and price. Includes a primary CTA button to book via WhatsApp.
- **CTA strip** — Contact buttons for custom Hajj & Umrah packages.
- Logic in `src/js/web/hajj-umrah.js` — fetches only `isActive === true` packages from the `hajj_umrah_packages` collection.

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
- `visa_stamping`, `attestations`, `passport_services` — public read ✅
- `tours` — public read (only `isActive === true` fetched client-side) ✅
- `hajj_umrah_packages` — public read (only `isActive === true` fetched client-side) ✅
- All other collections — **admin only** 🔒

---

## Build & Deploy

```bash
# Local development
cd web && npm run dev

# Production build test
cd web && npm run build        # outputs to web/dist/

# Deployment
# The frontend is hosted on Vercel. Simply push your code to git,
# and Vercel will automatically build and deploy the changes to zamra.vercel.app.
```

---

## Firestore Collections Read by Website

| Collection | Fields Used |
|---|---|
| `sectors` | `sectorFrom`, `sectorTo`, `sectorCode` |
| `airlines` | `name`, `code`, `logoUrl` |
| `agent_fares` | `sectorId`, `airlineId`, `flightDate`, `finalRate`, `baggage`, `extraBaggage`, `flightTime`, `isHidden` |
| `services` | `serviceType`, `title`, `basePrice`, `isActive` |
| `visas` | `countryName`, `visaType`, `processingTime`, `rate`, `flagUrl` |
| `visa_stamping` | `country`, `description`, `processingTime`, `cost` |
| `attestations` | `country`, `certificate`, `cost` |
| `passport_services` | `type`, `description`, `cost` |
| `tours` | `title`, `duration`, `category`, `price`, `description`, `highlights`, `itinerary`, `inclusions`, `exclusions`, `coverImageUrl`, `isActive` |
| `hajj_umrah_packages` | `title`, `type`, `departureCity`, `airline`, `departureDate`, `days`, `nights`, `price`, `description`, `highlights`, `inclusions`, `coverImageUrl`, `isActive` |

---

_Last audited: 2026-03-14 — Verified frontend multi-page routing and premium design consistencies across the site. See DASHBOARD.md for Admin Dashboard E-Ticket, Share functionality, and Poster features._
