# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SvelteKit Dashboard — Admin dashboard with collapsible sidebar, live stats cards, Chart.js revenue chart, and searchable user table.

Built with SvelteKit 2, Svelte 5, TypeScript, and Tailwind CSS.

## Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials before running:

```bash
cp .env.example .env.local
```

Required variables: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # svelte-check (type checking)
npm run lint             # ESLint + Prettier
npm run test             # Unit tests (vitest)
npm run test:watch       # Unit tests in watch mode
npm run test:coverage    # Unit tests with v8 coverage report
npm run test:e2e         # Playwright E2E tests (requires dev server or starts one)
npx playwright install   # Install Playwright browsers (first time only)
```

## Architecture

- `src/routes/` — File-based routing (`+page.svelte`, `+page.server.ts`)
- `src/lib/` — Shared library code (`$lib` alias)
- `src/lib/components/` — Reusable Svelte components
- `static/` — Static assets
- `e2e/` — Playwright end-to-end tests

## Testing

Unit tests live alongside their components as `ComponentName.test.ts`.
Run `npm run test` before committing.

E2E tests live in `e2e/` and are run with Playwright.
`playwright.config.ts` targets `http://localhost:5173` and auto-starts `npm run dev` when not already running.

Key test files:
- `src/lib/components/StatsCard.test.ts` — stat display, trend arrows, ARIA region
- `src/lib/components/UsersTable.test.ts` — render, search/filter, empty state, ARIA
- `e2e/home.spec.ts` — full page render, tab switching, search, sidebar, chart canvas

## Rules

- Use `+page.server.ts` for server-side data loading
- TypeScript for all `.ts` files, type annotations in `.svelte` `<script lang="ts">`
- Tailwind utility classes for styling — no custom CSS files for new work
- Use SvelteKit form actions for mutations
- ARIA labels required on all interactive elements and landmark regions
- All components that accept data must handle empty/loading states gracefully
