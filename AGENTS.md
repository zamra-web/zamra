# Zamra Travels - Web Portal

## Overview
Zamra Travels is a premium flight booking and travel services web portal. It provides users with flight search functionality, routing sectors, and travel details. The application showcases available flights, prices, and statuses dynamically.

## Build System & Core Tech
- **Stack:** Modernized Vite setup with Vanilla HTML, modular JavaScript, and **Tailwind CSS v4**.
- **Build Tool:** Vite (`npm run dev` for local dev server, `npm run build` for production builds).

## File Structure
- **`web/`** - **IMPORTANT:** This folder is the standalone root of the Vite project for the main website. It contains its own `package.json`, `vite.config.js`, and node cache.
  - `index.html` - The primary entry point (homepage), which also handles Live Flight Search.
  - `admin.html` - Standalone page for the Admin Dashboard and the Agent Rate Portal (Agent Sheets).
  - `src/` - Contains all modularized source files.
    - `styles/web/style.css` - The primary CSS file implementing `@theme` and `@import "tailwindcss";`.
    - `styles/admin/style.css` - Custom admin template CSS.
    - `js/web/main.js` - Modular JavaScript file containing site logic for the frontend (including Flight Search).
    - `js/admin/main.js` - JavaScript for the admin and agent functionalities.
  - `public/assets/` - Static local assets (images, icons, etc.) served directly by Vite.
  - `vite.config.js` - Vite multi-page bundler configuration scoped specifically to the `web/` folder, utilizing the `@tailwindcss/vite` plugin.

## Instructions for AI Agents
- **Context:** When working on the main website structure, UI, or content, prioritize the `web/` directory and `web/index.html`. 
- **Styling:** Use **Tailwind CSS v4** utility classes for all styling. Do not write custom Vanilla CSS unless absolutely necessary (and if so, place it in `style.css`).
- **Code Modularity:** Always maintain separation of concerns. Do not mix inline `<style>` and `<script>` heavily in HTML; keep them in the `src/` directory.
- **Continuous Updating:** **Whenever major file structure changes, migrations, or stack updates are made, you MUST update this `AGENTS.md` file to keep it relevant.**

## Asset Management 
- **Local Images:** All external images (from Unsplash, Zamra CDN, etc.) have been migrated to local hosting within `web/public/assets/img/`. All source code must reference these local assets instead of external HTTP links. A helper script named `download_images.sh` was created to automate the initial fetch of these files into the workspace.
- **Component Styling Updates:** The footer and contact headers have been customized utilizing Tailwind text color classes (e.g., `text-white`) without relying strictly on the base theme.
- **Mobile Optimization:** The application has been fully optimized for mobile devices. Responsiveness is primarily handled via Tailwind's `md:` and `max-sm:` utility classes for layouts and spacing. The mobile navigation hamburger menu utilizes vanilla CSS inside `@layer components` in `style.css` to govern the dropdown mechanism.
