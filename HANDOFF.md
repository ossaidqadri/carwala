# Handoff Document — Car-Wala Astro Migration

## Goal

Migrate `car-wala` from Next.js 16 + tRPC + superjson to a Bun workspace monorepo:
- `next/` — ported to REST (no tRPC, no superjson), kept as fallback
- `astro/` — new Astro 6 + React 19 island app, primary deploy
- `packages/schemas` — shared Zod 4 validation package consumed by both

## Current Progress

### ✅ Phase A — Monorepo Bootstrap (COMPLETE, committed `24ed9a5`)
- [x] Created root `package.json` with `workspaces: ["next", "astro", "packages/*"]`
- [x] Created `bunfig.toml` with `linker = "isolated"`
- [x] Moved `bun.lock` from `next/` to root
- [x] Created empty `astro/` + `packages/schemas/` directories
- [x] Ran `bun create astro@latest` (minimal template, strict TypeScript, no-git)
- [x] Added `"astro"` back to workspaces after scaffolder
- [x] Renamed `next/package.json` name from `"my-v0-project"` → `"next"`
- [x] Root `bun install` succeeds, all 3 workspaces detected

### ✅ Phase B — Extract Schemas (COMPLETE, committed `8ac9dd0`)
- [x] Created `packages/schemas/src/contact.ts` with Zod 4 syntax
- [x] Created `packages/schemas/src/index.ts` barrel re-export
- [x] Created `packages/schemas/package.json` (name: `@car-wala/schemas`, zod: `^4.0.0`)

### ✅ Phase C — Port Next.js to REST (COMPLETE, committed `422328b`)
- [x] Extracted `appendToSheet()` + `sendEmail()` → `next/lib/contact-handlers.ts`
- [x] Created `next/app/api/contact/route.ts` (REST POST, validates via `@car-wala/schemas`)
- [x] Created `next/lib/api.ts` with `useContactSubmit()` TanStack Query hook
- [x] Renamed `TRPCProvider` → `QueryProvider` in `providers.tsx`
- [x] Removed `@trpc/*` + `superjson` from `next/package.json`
- [x] Deleted `next/server/`, `next/lib/trpc.ts`, `next/app/api/trpc/`

### ✅ Phase D — Build Astro App (COMPLETE, committed `3512843` + `0dc0615`)
- [x] `astro add react` + `astro add cloudflare` — React 5 + Cloudflare adapter 13
- [x] Configured `output: 'static'` with Cloudflare adapter in `astro.config.mjs`
- [x] Created `postcss.config.mjs` with Tailwind v4 (`@tailwindcss/postcss`)
- [x] Created `src/layouts/BaseLayout.astro` with QueryProvider, ErrorBoundary, WhatsAppWidget, Toaster
- [x] Created `src/components/QueryProvider.tsx`
- [x] Copied all lib files: `contact-handlers.ts` (adapted for `import.meta.env`), `api.ts`, `agent/auth.ts`, `agent/defaults.ts`
- [x] Created API routes with `prerender = false`: `contact.ts`, `agent.ts`, `booking-calendar/*`
- [x] Copied all React components: `home/`, `ui/`, `contact/`, `booking-calendar/`, `calendar/`
- [x] Copied `ElevenLabsWidget.tsx`, `WhatsAppWidget.tsx`, `ErrorBoundary.tsx`
- [x] Created all 4 pages: `index.astro`, `calendar.astro`, `gallery.astro`, `maintenance.astro`
- [x] Copied `public/` assets: media (images/videos), fonts, icons
- [x] Copied `styles/globals.css` with all custom fonts
- [x] Fixed `client:load` on `WhyChooseUs` and `Services` (they use `useInView` hooks)
- [x] Fixed `ElevenLabsWidget` default import in `maintenance.astro`
- [x] `bun --filter astro build` passes — all pages prerendered
- [x] No tRPC/superjson/`'use client'` leakage

### ✅ Phase E.1 — Services Page + Booking Calendar Parity (COMPLETE, NOT YET COMMITTED)
- [x] Created `astro/src/pages/services.astro` with full `Pricing` component
- [x] Copied `Pricing.tsx` from next/ with correct imports (`@/components/ui/*`, `@/lib/utils`)
- [x] Copied all 17 booking-calendar React components from next/ to astro
- [x] Rewrote `booking-widget.tsx` with full 5-step flow (calendar → form → success → reschedule/cancel → cancelled)
- [x] Copied `modals/`, `booking-form/`, `calendar-grid/`, `time-slots/` sub-components
- [x] Fixed `next/link` → `<a>` tags throughout
- [x] Fixed `@hookform/resolvers/zod` Zod 4 conflict → plain TypeScript interfaces for booking form
- [x] Configured Vite `@/` alias in `astro.config.mjs`
- [x] Added `@radix-ui/react-alert-dialog`, `@radix-ui/react-separator`
- [x] `bun --filter astro build` passes — all 5 pages prerender: `/`, `/calendar`, `/gallery`, `/maintenance`, `/services`
- [x] Created `astro/.env` from `next/.env.local` with PUBLIC_ env var prefix convention

### ⏳ Phase E.2 — Cloudflare Deployment (NOT STARTED)

### ⏳ Phase F — Cleanup (NOT STARTED)

---

## What Worked

- **bun workspace globs**: `packages/*` correctly picks up any package in `packages/`
- **PowerShell quoting**: `bun --filter './packages/schemas` works when `@` causes issues
- **Astro CLI for integrations**: `bun run astro add react` and `bun run astro add cloudflare` handle version resolution + config updates automatically
- **Zod 4 `{ error: ... }` syntax**: Verified via ctx7 — `z.email()`, not `z.string().email()`
- **`output: 'static'`**: Pages prerender at build time, only API routes need `prerender = false`
- **`import.meta.env` for Cloudflare Workers**: All env vars use `import.meta.env` not `process.env` in Astro
- **`client:load` for hook-dependent components**: `WhyChooseUs` and `Services` use `useInView` → need `client:load`
- **Default imports for `export default` components**: `ElevenLabsWidget` is `export default` → must use `import ElevenLabsWidget`
- **Vite `@/` alias**: Set in `astro.config.mjs` via `resolve(__dirname, 'src')` for consistent module resolution

---

## What Didn't Work

- **`--filter astro` doesn't match workspace name**: Bun's `--filter` with `astro` doesn't find the workspace. Use `cd astro && bun run astro add ...` or `bun --filter './astro'`
- **`@car-wala/schemas` not on npm**: It's a local workspace package — must use `"@car-wala/schemas": "workspace:*"` in package.json, not `bun add`
- **`sonner` toasts removed then readded**: Subagent reported removing sonner but it was still in package.json and still imported in ContactForm — worked fine since Toaster was in BaseLayout
- **Named import for `export default` component**: `import { ElevenLabsWidget }` fails at build — must use `import ElevenLabsWidget`
- **Relative import depth errors in booking-calendar components**: Many files had incorrect `../..` vs `../../` depth. Resolved by standardizing on `@/` aliases throughout booking-calendar tree

---

## Important Constraints

- **No tRPC, no superjson**: Both must be fully removed from both apps
- **Zod 4 syntax only**: `z.email()`, `z.string().min(n, { error: '...' })` — not Zod 3 `{ message: ... }` form
- **Astro version**: `^6.3.1` — but `bun run astro add` resolved to `6.4.4`
- **React version**: `^19.2.1` — `astro add react` resolved to `19.2.7`
- **`@astrojs/react` v5** (not v6): The integration versioning is separate from Astro core
- **`@astrojs/cloudflare` v13**: Cloudflare adapter
- **TanStack Query**: `^5.84.1` (v5 object-signature API, not v4)
- **Bun linker**: `linker = "isolated"` in `bunfig.toml`
- **`client:*` directives**: In Astro, never `'use client'` — use `client:load`, `client:idle`, `client:visible`
- **`import.meta.env`**: In Astro endpoints, not `process.env` (Cloudflare Workers compatible)
- **`output: 'static'`**: Pages prerender at build — only API routes need `export const prerender = false`
- **`PUBLIC_` prefix**: Client-side env vars in Astro must use `PUBLIC_*` prefix (e.g. `PUBLIC_CALCOM_EVENT_TYPE_ID`)
- **Booking form Zod 4 conflict**: `@hookform/resolvers` v5 uses Zod 3 internally. Solution: use plain TypeScript interfaces + react-hook-form native validation for booking form

---

## Key File Paths

| Path | Purpose |
|------|---------|
| `D:/work/car-wala/` | Repo root |
| `D:/work/car-wala/next/` | Next.js app (REST-ported) ✅ |
| `D:/work/car-wala/astro/` | Astro 6 app (Phase E.1 complete) |
| `D:/work/car-wala/packages/schemas/` | Shared Zod schemas ✅ |
| `D:/work/car-wala/bunfig.toml` | `linker = "isolated"` |
| `D:/work/car-wala/astro/astro.config.mjs` | Astro config with Cloudflare + Vite `@/` alias |

---

## Next Steps

### Phase E.1 — Complete (build passes, all pages prerender)
- Commit all Phase E.1 changes

### Phase E.2 — Cloudflare Deployment
1. Push commits to GitHub
2. Connect repo to Cloudflare Pages (cloudflare.com/pages)
3. Create two Cloudflare Pages projects:
   - **Astro app**: Root directory = `astro`, build command = `bun install && bun run build`, output = `dist`
   - **Next.js fallback**: Root directory = `next`, build command = `bun install && bun run build`, output = `.next`
4. Set env vars in both projects
5. Deploy Astro preview → verify all pages load
6. DNS cutover: point primary domain to Astro project

### Phase F — Cleanup (after Astro stable in production)
1. After 30 days with no incidents, remove `next/` directory
2. Remove Next.js Cloudflare Pages project
3. Update README

---

## Decision Log

| Decision | Choice |
|----------|---------|
| Astro scaffolding in Phase A | User request — wanted visible `astro/` dir in workspace |
| Package name `my-v0-project` → `next` | User choice — matches plan |
| `bunfig.toml` linker | `"isolated"` (locked decision) |
| `@car-wala/schemas` Zod 4 syntax | `{ error: ... }` — ctx7-verified correct |
| `output: 'static'` over `'server'` | More performant for content site, `prerender = false` on API routes |
| Cloudflare over Vercel | User preference |
| `@astrojs/react` v5 | CLI resolved, not v6 — integration versioning differs from Astro core |
| `@astrojs/cloudflare` v13 | Cloudflare adapter |
| Vite `@/` alias | Resolved via `resolve(__dirname, 'src')` in `astro.config.mjs` |
| Booking form Zod 4 conflict | Solved with plain TS interfaces + react-hook-form native validation |

---

## Pending Issues

- **Next.js build failing**: Zod version conflict — `@hookform/resolvers` (v5.2.2) uses Zod 3 internally, `@car-wala/schemas` uses Zod 4. Affects booking-form in Next.js only — not Astro.
- **Phase E.1 not committed**: All Phase E.1 work is in working tree only
