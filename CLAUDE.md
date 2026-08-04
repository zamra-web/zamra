# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Existing documentation

Detailed docs already exist and are the source of truth for their surfaces — read the relevant one before making changes:

- [AGENTS.md](AGENTS.md) — build system, repo layout, and a long "Key Gotchas" list of hard-won invariants (poster export, social publishing, pagination bugs, event-wiring guards). **Read the gotchas before touching poster, social, or reports code.**
- [WEBSITE.md](WEBSITE.md) — public site pages, features, Firestore reads, styling.
- [DASHBOARD.md](DASHBOARD.md) — admin dashboard tabs, Firestore schema per collection, Cloud Functions, rules.
- [mobile/README.md](mobile/README.md) — the two Android apps (admin + B2B), how the download bridge works, signing and icon generation. **Read it before touching anything under `mobile/`.**

## Commands

All frontend commands run from `web/`; all Firebase CLI commands run from the repo root (that is where `firebase.json` lives).

```bash
cd web && npm install && npm run dev     # dev server → localhost:5173
cd web && npm run build                  # production build → web/dist/
cd web && npm test                       # node --test, discovers web/tests/*.test.js

cd functions && npm install
cd functions && npm test                 # node --test → functions/tests/*.test.js
cd functions && npm run lint             # eslint (google config)

cd mobile && npm install
cd mobile && npm test                    # node --test → mobile/tests/*.test.js
cd mobile && ./scripts/build-apks.sh     # signed release APKs → mobile/dist/
cd mobile && npm run assets              # regenerate launcher icons + splash screens
```

Run a single test file / single test:

```bash
node --test web/tests/flight-results.test.js
node --test --test-name-pattern "carousel" functions/tests/social-pipeline.test.js
```

Deploy (from repo root):

```bash
# Frontend is on Vercel — pushing to git auto-deploys. Do NOT firebase deploy --only hosting.
npx firebase-tools@latest deploy --only functions,firestore,storage --project zamra-web-01
```

Functions require **Node 22** locally to match the deployed runtime.

## Architecture

Vanilla ES modules + Vite 5 multi-page build + Tailwind v4 (`@tailwindcss/vite`, no config file — design tokens are `@theme` blocks in `web/src/styles/web/style.css`). No frontend framework. Firebase project `zamra-web-01`; Cloud Functions region is **`asia-south1`**, which must stay in sync with `getFunctions(app, 'asia-south1')` in [firebase-config.js](web/src/js/admin/firebase-config.js).

Each HTML entry in [vite.config.js](web/vite.config.js) is a separate page bundle. Three distinct surfaces share the codebase:

| Surface | Entries | JS | Auth |
|---|---|---|---|
| Public site | `index/visa/tours/hajj-umrah/connect.html` | `src/js/web/` | none (public Firestore reads) |
| Admin dashboard | `admin.html`, `login.html` | `src/js/admin/` | `admin: true` custom claim |
| B2B agent portal | `b2b.html`, `b2b-login.html` | `src/js/b2b/` | `{ agent: true, b2bAgentId }` claims |

Two of those surfaces also ship as Android apps from [mobile/](mobile/) — `Zamra Admin` and `Zamra B2B`, product flavours of one Capacitor shell. They load the **live production URLs** rather than a bundled build, so a Vercel deploy updates them with no APK release. The one thing that needed native code is file exports: a WebView ignores `<a download>` on `blob:`/`data:` URLs, so jsPDF, html2canvas and CSV downloads only work because of the injected shim described in [mobile/README.md](mobile/README.md). Any new export path in the web app should be checked against it.

**Data access layering.** `src/js/admin/db.js` is the only module that talks to the Firestore/Storage/Functions SDKs for the admin surface — [main.js](web/src/js/admin/main.js) (~13k lines of tab controllers) must call through it, never the SDK directly. Bulk mutations are Cloud Function callables wrapped as `callXxx()` in `db.js`. The B2B portal reads *nothing* from Firestore directly: [b2b/main.js](web/src/js/b2b/main.js) calls the `getB2BPortalContext` / `getB2BFares` callables so pricing stays server-side.

**Two meanings of "agent" — this is the most common source of confusion.** The `agents` collection is rate **suppliers** (consolidators Zamra buys fares from). The `b2b_agents` collection is downstream travel-agency **customers** of the B2B portal. One rate upload produces two prices: the B2C price is `agent_fares.finalRate` (supplier special rate + commission), while the B2B price is computed server-side in [functions/b2b.js](functions/b2b.js) as raw `specialRate` + per-agent markup + per-supplier rule + per-route adjustment — B2B agents must never see `specialRate`, `finalRate`, `commission`, or supplier IDs.

Per-supplier rules are signed and **stack on top of** the agent markup rather than replacing it, so a discount alone can never price below the supplier's raw rate. They resolve most-specific-first: `b2b_agents.supplierAdjustments[supplierId]` → `config/b2b.supplierDefaults[supplierId]` → `0`, where an explicit `0` on an agent deliberately cancels the global default. Because rules differ per supplier, `computeB2BFares` dedupes each sector+airline+date+time group by **minimum final price, not minimum raw base** — a pricier supplier carrying a discount can legitimately undercut a cheaper one carrying a markup. See the pricing waterfall in [DASHBOARD.md](DASHBOARD.md). B2B logins use synthetic emails `<loginid>@b2b.zamratravels.com` with reset-and-reveal passwords (plaintext is never stored).

**Cloud Functions** ([functions/index.js](functions/index.js) re-exports everything):
- Admin callables (`bulkDeleteFares`, `reorderSectors`, `generateAgentReport`, …) all gate on the `admin` claim.
- `ingestFaresFromN8n` / `exportFlightDetailsForN8n` are `onRequest` endpoints for the n8n integration, secured by Bearer token.
- Social publishing pipeline: `functions/poster/` renders daily posters (puppeteer-core + @sparticuz/chromium), `functions/social/pipeline.js` is a leased-queue dispatcher over `social_queue` / `social_jobs`, and `functions/buffer/` posts to Buffer. Gulf market → Buffer channel mapping lives in [functions/buffer/marketConfig.js](functions/buffer/marketConfig.js); per-market API keys are Firebase secrets (`BUFFER_API_KEY_SAUDI`, etc.).

**Security rules** ([firestore.rules](firestore.rules)): almost every *content* collection is world-readable with admin-only writes; `b2b_agents` is readable only by an admin or the agent whose `b2bAgentId` matches. The `agents` (supplier) collection is admin-only — it names who Zamra sources from, and only `admin/main.js` reads it.

**`agent_fares` is admin-only, and must stay that way.** It carries `specialRate`, `commission` and the supplier `agentId`; Firestore returns whole documents and has no field-level security, so any public read on it publishes Zamra's buying rates and margins. Every public fare path therefore goes through a server-side projection on the Admin SDK — `getPublicFares` (homepage/search), `getPublicDeals` (`/deals/<slug>`), `getB2BFares` (portal). **Never add a direct `agent_fares` read to a public page, and never re-open that rule** — it would silently undo all three. `getFares()` in `db.js` spreads `...data` and is admin-surface only.

## Conventions

- Tailwind utility classes only. Vanilla CSS goes in `@layer components` in the relevant `style.css` — except `visa.html`, which intentionally keeps a page-local `<style>` block.
- Keep logic in `src/js/`; avoid heavy inline `<script>`/`<style>` in HTML entries.
- Images are local under `web/public/assets/img/`, referenced as `/assets/img/...`. Never add external image URLs — poster canvas export breaks on them.
- Admin UI helpers: `openModal(title, html, wide)` and `toast(type, title, msg)` in `admin/main.js`. Admin supports a light/dark `data-theme` toggle; new UI must work in both.
- The **Admin Modal System** block in `styles/admin/style.css` (`.admin-modal*`, `.admin-form-section*`, `.admin-field`, `.admin-help`, `.admin-toggle`, `.admin-file`) is deliberately top-level and **unlayered** — it was once trapped inside `@media (max-width: 640px)`, which left every modal unstyled on desktop. Don't nest it in a media query or `@layer`, and note that anything overriding it must also be unlayered (`@layer components` loses to unlayered rules regardless of specificity — see `.b2b-rules-head`).
- `wireXxxActions()` handlers guard with `if (!tbody || tbody.dataset.actionsWired) return;` — never clear and re-set that flag, it stacks duplicate listeners.
- Update the relevant `.md` doc when making structural changes.
