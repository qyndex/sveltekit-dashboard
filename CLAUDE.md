# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SvelteKit Dashboard — Production-ready admin dashboard with Supabase auth, real-time stats from a metrics table, Chart.js revenue chart, and searchable user management with role assignment.

Built with SvelteKit 2, Svelte 5, TypeScript, Supabase (auth + PostgreSQL + RLS), and Chart.js.

## Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `PUBLIC_SUPABASE_URL` — Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key (public, safe for browser)
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-only, for admin operations)

**Important:** This project uses `$env/dynamic/public` and `$env/dynamic/private` (NOT `$env/static/*`). This ensures env vars are read at runtime, which is required for Docker deployments where env vars are injected at container start.

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

- `src/routes/` — File-based routing (`+page.svelte`, `+page.server.ts`, `+layout.svelte`)
- `src/routes/auth/` — Login, signup, and OAuth callback routes
- `src/lib/` — Shared library code (`$lib` alias)
- `src/lib/components/` — Reusable Svelte components (StatsCard, RevenueChart, UsersTable, Sidebar, Topbar)
- `src/lib/supabase.ts` — Browser Supabase client (uses `@supabase/ssr`)
- `src/lib/supabase.server.ts` — Server Supabase client + admin client
- `src/lib/types/database.ts` — TypeScript types for database schema
- `src/hooks.server.ts` — Auth session management, route protection
- `src/app.d.ts` — App-level type declarations (Locals, PageData)
- `supabase/migrations/` — Database migrations (profiles, metrics, audit_log)
- `supabase/seed.sql` — Seed data for development
- `e2e/` — Playwright end-to-end tests
- `static/` — Static assets

## Database Schema

Three tables in `public` schema:

- **profiles** — User profiles (id FK auth.users, full_name, role, avatar_url, created_at). Auto-created on signup via trigger.
- **metrics** — Dashboard metrics (metric_name, value, period, recorded_at). Stores revenue, active_users, new_signups, churn_rate.
- **audit_log** — Action audit trail (user_id, action, details jsonb, created_at).

All tables have RLS enabled. Profiles are readable by all authenticated users; metrics are read-only for authenticated users, writable by admins; audit logs are viewable by admins only.

## Auth Flow

- Login: `src/routes/auth/login/` — email+password via Supabase Auth
- Signup: `src/routes/auth/signup/` — creates auth user + auto-creates profile via trigger
- Callback: `src/routes/auth/callback/` — handles email confirmation code exchange
- Session: `src/hooks.server.ts` — checks session on every request, redirects unauthenticated users to login
- Logout: Form action on the dashboard page (`?/logout`)

## Testing

Unit tests live alongside their components as `ComponentName.test.ts`.
Run `npm run test` before committing.

E2E tests live in `e2e/` and are run with Playwright.
`playwright.config.ts` targets `http://localhost:5173` and auto-starts `npm run dev` when not already running.

Key test files:
- `src/lib/components/StatsCard.test.ts` — stat display, trend arrows, ARIA region
- `src/lib/components/UsersTable.test.ts` — render, search/filter, empty state, ARIA, avatar placeholders, edit buttons
- `e2e/home.spec.ts` — full page render, tab switching, search, sidebar, chart canvas

## Rules

- Use `$env/dynamic/public` and `$env/dynamic/private` for env vars — NEVER `$env/static/*`
- Use `+page.server.ts` for server-side data loading and form actions
- TypeScript for all `.ts` files, type annotations in `.svelte` `<script lang="ts">`
- Scoped styles in Svelte components — no custom CSS files for new work
- Use SvelteKit form actions (`use:enhance`) for mutations
- ARIA labels required on all interactive elements and landmark regions
- All components that accept data must handle empty/loading states gracefully
- Database queries go through the Supabase client attached to `event.locals.supabase`
- Role changes require admin role — enforced in the form action
- All destructive operations should be logged to audit_log
