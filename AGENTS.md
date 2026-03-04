# Zamra Travels - Web Portal

## Overview
Zamra Travels is a premium flight booking and travel services web portal. It provides users with flight search functionality, routing sectors, and travel details. The application showcases available flights, prices, and statuses dynamically.

## Build System & Core Tech
- **Stack:** Modernized Vite setup with Vanilla HTML, modular JavaScript, and **Tailwind CSS v4**.
- **Build Tool:** Vite (`npm run dev` for local dev server, `npm run build` for production builds).

## File Structure
- **`web/`** - **IMPORTANT:** This folder is the standalone root of the Vite project for the main website. It contains its own `package.json`, `vite.config.js`, and node cache.
  - `index.html` - The primary entry point for the main web portal, utilizing Tailwind CSS utility classes.
  - `src/` - Contains all modularized source files.
    - `styles/web/style.css` - The primary CSS file implementing `@theme` and `@import "tailwindcss";`. All legacy Vanilla CSS files (e.g. `portal.css`) have been removed.
    - `js/web/main.js` - Modular JavaScript file containing site logic and dynamic UI generation (e.g., modals, layout behaviors).
  - `public/assets/` - Static assets (images, icons, etc.) served directly by Vite.
  - `vite.config.js` - Configuration for the Vite bundler scoped specifically to the `web/` folder, utilizing the `@tailwindcss/vite` plugin.

## Instructions for AI Agents
- **Context:** When working on the main website structure, UI, or content, prioritize the `web/` directory and `web/index.html`. 
- **Styling:** Use **Tailwind CSS v4** utility classes for all styling. Do not write custom Vanilla CSS unless absolutely necessary (and if so, place it in `style.css`).
- **Code Modularity:** Always maintain separation of concerns. Do not mix inline `<style>` and `<script>` heavily in HTML; keep them in the `src/` directory.
- **Continuous Updating:** **Whenever major file structure changes, migrations, or stack updates are made, you MUST update this `AGENTS.md` file to keep it relevant.**
