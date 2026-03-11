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
2. **Admin Dashboard** (`web/admin.html`) — Full CRUD management of agents, sectors, airlines, fares, and reports. Firebase-integrated with Cloud Functions. See [DASHBOARD.md](./DASHBOARD.md).

**Live URL:** https://zamra-web.web.app  
**Firebase Project:** `zamra-web` (Blaze plan)

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

**Build commands:**
```bash
cd web && npm run dev      # local dev server → http://localhost:5173
cd web && npm run build    # production build → web/dist/
```

**Deploy command (from `zamra/` root):**
```bash
cd web && npm run build && cd .. && npx firebase-tools@latest deploy
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
├── .firebaserc                     # Links CLI → zamra-web project
│
├── functions/                      # Cloud Functions (Node.js 22)
│   ├── index.js                    # bulkDeleteFares, bulkToggleAgentVisibility,
│   │                               # bulkToggleSectorVisibility, generateAgentReport, ingestFaresFromN8n
│   └── package.json                # firebase-admin, firebase-functions
│
└── web/                            # ★ Vite project root — all website/dashboard code
    ├── index.html                  # Public homepage
    ├── login.html                  # Admin login
    ├── admin.html                  # Admin dashboard
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
            └── admin/
                ├── firebase-config.js  # Firebase init (auth, db, storage, functions)
                ├── auth.js             # Auth state helpers
                ├── login.js            # Login page
                ├── db.js               # ★ All Firestore + Storage operations
                └── main.js             # ★ All dashboard tab controllers
```

---

## Instructions for AI Agents

### General Rules
- **Context first:** Always read [WEBSITE.md](./WEBSITE.md) or [DASHBOARD.md](./DASHBOARD.md) before working on a specific surface.
- **Styling:** Use **Tailwind CSS v4** utility classes exclusively. Do not write vanilla CSS unless absolutely necessary (place it in `style.css` inside `@layer components`).
- **Modularity:** Keep logic in `src/js/`. Do not write heavy inline `<script>` or `<style>` in HTML files.
- **No direct Firebase SDK calls in `main.js`** — always go through `db.js`.
- **Update docs:** Whenever you make significant structural changes, update the relevant `.md` file.

### Working on the Public Website
- Edit `web/index.html`, `web/src/js/web/main.js`, `web/src/styles/web/style.css`
- Reference images as `/assets/img/filename` (served from `web/public/assets/img/`)
- Do **not** add external image URLs — add images to `web/public/assets/img/` instead

### Working on the Admin Dashboard
- Edit `web/admin.html`, `web/src/js/admin/main.js`, `web/src/styles/admin/style.css`
- All data operations go through `web/src/js/admin/db.js`
- Bulk operations use Cloud Functions via `callXxx()` wrappers in `db.js`
- Use the `openModal(title, html)` helper in `main.js` for any new modal forms
- Use the `toast(type, title, msg)` helper for all user feedback

### Working on Cloud Functions
- Functions live in `functions/index.js`
- All functions are HTTPS Callable and require `admin: true` custom claim
- Deploy with: `npx firebase-tools@latest deploy --only functions`

### Security Rules
- Firestore rules are in `firestore.rules` at the project root
- Storage rules are in `storage.rules` at the project root
- Validate with: `npx firebase-tools@latest firestore:rules` before deploying

---

## Asset Management

- **All images are local** — stored in `web/public/assets/img/`
- External images were migrated from Unsplash/CDN using `download_images.sh`
- Reference in code as `/assets/img/filename.jpg`
- Airline/agent logos are uploaded to **Firebase Storage** via the admin dashboard and stored as URLs in Firestore

---

## Mobile Optimisation

- Responsive layouts via Tailwind `md:` and `max-sm:` breakpoints
- Mobile hamburger nav uses vanilla CSS in `@layer components` in `web/src/styles/web/style.css`
- Admin dashboard is desktop-first but remains usable on tablet

---

## Key Gotchas for AI Agents

- **`firebase.json` is at the `zamra/` root**, not inside `web/`. Always deploy from `zamra/`.
- **Vite config is inside `web/`** — build and dev commands run from `web/`.
- **Admin security** depends on the `admin: true` Firebase custom claim — without it, all Firestore writes are blocked even when authenticated.
- **Firestore indexes** — complex queries on `agent_fares` require the indexes in `firestore.indexes.json`. Deploy them before testing queries.
- **Cloud Functions region** is `asia-south1` — this matches the `getFunctions(app, 'asia-south1')` call in `firebase-config.js`. Do not change one without changing the other.
