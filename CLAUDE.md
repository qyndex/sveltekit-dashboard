# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SvelteKit Dashboard — Admin dashboard with collapsible sidebar, live stats cards, Chart.js revenue chart, and searchable user table.

Built with SvelteKit 2, Svelte 5, TypeScript, and Tailwind CSS.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # svelte-check (type checking)
npm run lint             # ESLint + Prettier
```

## Architecture

- `src/routes/` — File-based routing (`+page.svelte`, `+server.ts`)
- `src/lib/` — Shared library code (`$lib` alias)
- `src/lib/components/` — Reusable Svelte components
- `static/` — Static assets

## Rules

- Use `+page.server.ts` for server-side data loading
- TypeScript for all `.ts` files, type annotations in `.svelte` `<script lang="ts">`
- Tailwind utility classes for styling
- Use SvelteKit form actions for mutations
