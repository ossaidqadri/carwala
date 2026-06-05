# Handoff Document — Car-Wala Astro Migration

## Goal

Migrate `car-wala` from Next.js 16 + tRPC + superjson to a Bun workspace monorepo:
- `next/` — ported to REST (no tRPC, no superjson), kept as fallback
- `astro/` — new Astro 6 + React 19 island app, primary deploy
- `packages/schemas` — shared Zod 4 validation package consumed by both

## Current Progress

### ✅ Phase A — Monorepo Bootstrap (COMPLETE)
- [x] Created root `package.json` with `workspaces: ["next", "astro", "packages/*"]`
- [x] Created `bunfig.toml` with `linker = "isolated"`
- [x] Moved `bun.lock` from `next/` to root
- [x] Created empty `astro/` + `packages/schemas/` directories
- [x] Ran `bun create astro@latest` (minimal template, strict TypeScript, no-git)
- [x] Added `"astro"` back to workspaces after scaffolder
- [x] Renamed `next/package.json` name from `"my-v0-project"` → `"next"`
- [x] Root `bun install` succeeds, all 3 workspaces detected

**`bun pm ls` output:**
```
car-wala-monorepo
├── @car-wala/schemas@workspace:packages/schemas
├── astro@workspace:astro
├── next@workspace:next
└── typescript@5.9.3
```

### ✅ Phase B — Extract Schemas (COMPLETE, committed `8ac9dd0`)
- [x] Created `packages/schemas/package.json` (name: `@car-wala/schemas`, zod: `^4.0.0`)
- [x] Created `packages/schemas/tsconfig.json` (`strict: true`, `moduleResolution: Bundler`)
- [x] Created `packages/schemas/src/contact.ts` with Zod 4 syntax:
  - `contactSchema` using `z.email()` and `z.string().min(n, { error: '...' })`
  - `sanitizeContactInput()` helper (XSS prevention, same logic as original)
  - `ContactInput` type inferred via `z.infer<typeof contactSchema>`
- [x] Created `packages/schemas/src/index.ts` barrel re-export
- [x] Added `typecheck` script to `packages/schemas/package.json`
- [x] Committed as `8ac9dd0`

### ✅ Phase C — Port Next.js to REST (COMPLETE, committed `422328b`)
- [x] Extracted `appendToSheet()` + `sendEmail()` from tRPC router → `next/lib/contact-handlers.ts`
- [x] Created `next/app/api/contact/route.ts` (REST POST, validates via `@car-wala/schemas`)
- [x] Created `next/lib/api.ts` with `useContactSubmit()` TanStack Query hook
- [x] Renamed `TRPCProvider` → `QueryProvider` in `providers.tsx`
- [x] Updated `next/app/layout.tsx` import + JSX to use `QueryProvider`
- [x] Updated `ContactForm.tsx` to use `useContactSubmit()` instead of `trpc.useMutation()`
- [x] Removed `@trpc/*` + `superjson` from `next/package.json`, added `@car-wala/schemas: workspace:*`
- [x] Deleted `next/server/`, `next/lib/trpc.ts`, `next/app/api/trpc/`
- [x] `bun --filter next build` passes with no type errors

### ⏳ Phase D — Build Astro App (NOT STARTED)
### ⏳ Phase E — Vercel Setup (NOT STARTED)
### ⏳ Phase F — Cleanup (NOT STARTED)

---

## What Worked

- **bun workspace globs**: `packages/*` correctly picks up any package in `packages/`. `"astro"` as a literal entry fails until the dir exists — had to temporarily remove it, scaffold Astro, then add it back.
- **PowerShell quoting**: `bun --filter '@car-wala/schemas'` fails in PowerShell ( `@` is splat). Use `bun --filter './packages/schemas'` instead.
- **Astro scaffolder timing**: Decided to run `bun create astro@latest` in Phase A (deviating from plan's Phase D) so we had a real directory to add to workspaces. Worked cleanly.
- **Zod 4 `{ error: ... }` syntax**: Verified via ctx7 `/websites/zod_dev_v4` — Zod 4 deprecates `{ message: ... }` in favor of unified `{ error: ... }` param. Confirmed the plan's syntax was correct.
- **Stale .next cache**: Deleted `.next` directory before rebuild to clear Next.js generated type files referencing deleted routes.
- **Two-layer validation**: Contact form keeps local Zod (react-hook-form) for UX, REST endpoint re-validates with `@car-wala/schemas` for security — correct pattern.
- **Only 2 files used tRPC**: ContactForm.tsx and providers.tsx — scoped migration kept risk low.

## What Didn't Work

- **Workspace `"astro"` in package.json before dir exists**: Bun's workspace validation is strict — the lockfile and `workspaces` array must resolve. Worked around by removing it temporarily.
- **`tsc --noEmit` without tsconfig**: Fell back to dumping help. Fixed by adding `packages/schemas/tsconfig.json`.

## Important Constraints

- **No tRPC, no superjson**: Both must be fully removed from both apps
- **Zod 4 syntax only**: `z.email()`, `z.string().min(n, { error: ... })` — not Zod 3 `{ message: ... }` form
- **Astro version**: `^6.3.1` exactly (not `^6` — v6 has breaking changes from v5)
- **React version**: `^19.2.1`
- **TanStack Query**: `^5.84.1` (v5 object-signature API, not v4)
- **Bun linker**: `linker = "isolated"` in `bunfig.toml`
- **`client:*` directives**: In Astro, never `'use client'` — use `client:load`, `client:idle`, `client:visible` etc.
- **`import.meta.env`**: In Astro endpoints, not `process.env` (server-only env vars don't need `PUBLIC_` prefix in Astro)

## Key File Paths

| Path | Purpose |
|------|---------|
| `D:/work/car-wala/` | Repo root |
| `D:/work/car-wala/next/` | Next.js app (REST-ported) ✅ |
| `D:/work/car-wala/astro/` | Astro 6 app (to be built) |
| `D:/work/car-wala/packages/schemas/` | Shared Zod schemas ✅ done |
| `D:/work/car-wala/plans/` | All 3 plan docs |
| `D:/work/car-wala/bunfig.toml` | `linker = "isolated"` |
| `D:/work/car-wala/next/lib/contact-handlers.ts` | `appendToSheet()` + `sendEmail()` |
| `D:/work/car-wala/next/app/api/contact/route.ts` | REST POST endpoint |
| `D:/work/car-wala/next/lib/api.ts` | `useContactSubmit()` TanStack Query hook |
| `D:/work/car-wala/next/components/providers.tsx` | `QueryProvider` (renamed from TRPCProvider) |
| `D:/work/car-wala/next/components/contact/ContactForm.tsx` | Uses `useContactSubmit()` |

## Next Steps

### Immediate (Phase D — Build Astro)
1. Add React integration to `astro`: `bun --filter astro add react`
2. Add `@astrojs/vercel`, `@tanstack/react-query`, `zod`, `@car-wala/schemas`
3. Update `astro/astro.config.mjs`: `output: 'server'`, Vercel adapter, React integration
4. Copy `contact-handlers.ts`, `api.ts`, `QueryProvider.tsx` from `next/` to `astro/src/lib/`
5. Create Astro REST endpoints: `astro/src/pages/api/contact.ts`, `agent.ts`, `booking-calendar.ts`
6. Create `astro/src/layouts/BaseLayout.astro`
7. Create pages: `index.astro`, `calendar.astro`, `gallery.astro`, `maintenance.astro`
8. Copy React components from `next/components/` (add `client:*` directives)
9. Build, test, deploy

## Related Handoff Files

| File | Purpose |
|------|---------|
| `D:/work/car-wala/plans/HANDOFF-PROMPT.md` | Session handoff prompt — paste into new Claude sessions to resume |
| `D:/work/car-wala/next/HANDOFF.md` | Prior session about Ahmad/ElevenLabs prompt restructure (older, different topic) |

## Decision Log

| Decision | Choice |
|----------|--------|
| Astro scaffolding in Phase A (deviating from plan) | User request — wanted visible `astro/` dir in workspace |
| Package name `my-v0-project` → `next` | User choice — matches plan |
| `bunfig.toml` linker | `"isolated"` (locked decision) |
| `@car-wala/schemas` Zod 4 syntax | `{ error: ... }` — ctx7-verified correct |
