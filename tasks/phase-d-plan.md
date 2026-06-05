# Phase D: Build Astro App — Execution Plan

## Approach
- `output: 'static'` (default) — pages prerender at build, served from Cloudflare edge
- `prerender = false` only on the 3 API routes (contact, agent, booking-calendar)
- Cloudflare Pages Functions handle dynamic parts
- No `output: 'server'` — static is more performant for content-heavy marketing site

## Config Setup

### 1. Update `astro/astro.config.mjs`
```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [react()],
});
```

### 2. Add Tailwind v4 to Astro
Need `postcss.config.mjs` in `astro/`:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

---

## Directory Structure to Create

```
astro/src/
├── lib/
│   ├── contact-handlers.ts   # Copy from next/lib/contact-handlers.ts
│   └── api.ts                # TanStack Query hook (useContactSubmit)
├── components/
│   ├── QueryProvider.tsx     # React Query provider (client:load)
│   ├── home/
│   │   ├── Header.tsx        # Copy from next/components/home/
│   │   ├── Hero.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Services.tsx
│   │   ├── CallToAction.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── form.tsx
│   │   ├── card.tsx
│   │   └── ... (all shadcn components)
│   ├── contact/
│   │   └── ContactForm.tsx   # client:load (interactive form)
│   ├── ElevenLabsWidget.tsx  # client:idle
│   ├── WhatsAppWidget.tsx    # client:visible
│   ├── Pricing.tsx
│   ├── ErrorBoundary.tsx
│   ├── theme-provider.tsx
│   ├── booking-calendar/
│   │   └── booking-widget.tsx
│   └── calendar/
│       └── (calendar components)
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro           # Home page
│   ├── calendar.astro        # Booking calendar
│   ├── gallery.astro         # Gallery
│   ├── maintenance.astro     # Maintenance page
│   └── api/
│       ├── contact.ts       # prerender = false
│       ├── agent.ts          # prerender = false
│       └── booking-calendar.ts # prerender = false
└── styles/
    └── globals.css          # Copy from next/app/globals.css
```

---

## Step-by-Step Execution

### Phase 1: Config + Tailwind
- [ ] Update `astro/astro.config.mjs` with `output: 'static'` + Cloudflare adapter
- [ ] Create `astro/postcss.config.mjs` with Tailwind v4 (`@tailwindcss/postcss`)
- [ ] Create `astro/src/styles/` directory

### Phase 2: Lib files
- [ ] Copy `next/lib/contact-handlers.ts` → `astro/src/lib/contact-handlers.ts`
- [ ] Create `astro/src/lib/api.ts` (useContactSubmit hook)
- [ ] Create `astro/src/lib/queryClient.ts` (QueryClient instance)

### Phase 3: Layout + Providers
- [ ] Create `astro/src/layouts/BaseLayout.astro`
  - Include font preloads (same as next/app/layout.tsx)
  - Include QueryProvider with `client:load`
  - Include Toaster (sonner)
  - Include ErrorBoundary
  - Include WhatsAppWidget
- [ ] Create `astro/src/components/QueryProvider.tsx`

### Phase 4: API Routes (prerender = false)
- [ ] Create `astro/src/pages/api/contact.ts` — POST endpoint, validates with @car-wala/schemas
- [ ] Create `astro/src/pages/api/agent.ts` — GET services proxy (reads env vars)
- [ ] Create `astro/src/pages/api/booking-calendar.ts` — GET slots, POST book/cancel/reschedule

### Phase 5: Copy React Components
- [ ] Copy `next/components/home/` → `astro/src/components/home/`
- [ ] Copy `next/components/ui/` → `astro/src/components/ui/` (all shadcn components)
- [ ] Copy `next/components/contact/` → `astro/src/components/contact/`
- [ ] Copy `next/components/booking-calendar/` → `astro/src/components/booking-calendar/`
- [ ] Copy `next/components/calendar/` → `astro/src/components/calendar/`
- [ ] Copy `ElevenLabsWidget.tsx`, `WhatsAppWidget.tsx`, `Pricing.tsx`, `ErrorBoundary.tsx`, `theme-provider.tsx`

### Phase 6: Pages
- [ ] Create `astro/src/pages/index.astro` — Home page with all sections
- [ ] Create `astro/src/pages/calendar.astro` — Booking calendar
- [ ] Create `astro/src/pages/gallery.astro` — Gallery page
- [ ] Create `astro/src/pages/maintenance.astro` — Maintenance page

### Phase 7: Static Assets
- [ ] Copy `next/public/` → `astro/public/` (fonts, media files)
- [ ] Copy `next/app/globals.css` → `astro/src/styles/globals.css`

### Phase 8: Build + Verify
- [ ] Run `bun --filter astro build` — must pass with zero type errors
- [ ] Verify no tRPC/superjson references in astro/
- [ ] Verify no 'use client' directives in astro/ files

---

## Client Directive Mapping

| Component | Directive | Reason |
|-----------|-----------|--------|
| QueryProvider | `client:load` | Must hydrate early for TanStack Query |
| ContactForm | `client:load` | Interactive form, critical path |
| Header | `client:load` | Nav with interactivity |
| ElevenLabsWidget | `client:idle` | Non-critical, defer until idle |
| WhatsAppWidget | `client:visible` | Heavy, only when scrolled into view |
| BookingWidget | `client:load` | Interactive calendar |
| Hero, WhyChooseUs, Services, Footer | none (static) | No interactivity |

---

## Dependencies to Install in astro/
Already installed via `astro add react`, `astro add cloudflare`, and `bun add`:
- @astrojs/react, @astrojs/cloudflare, react, react-dom
- @tanstack/react-query, zod, sonner, googleapis, nodemailer
- motion, @tsparticles/react, @tsparticles/slim, recharts
- embla-carousel-react, react-day-picker
- @radix-ui/* components
- class-variance-authority, clsx, tailwind-merge, lucide-react
- tailwindcss, @tailwindcss/postcss, postcss

Still needed:
- @car-wala/schemas (workspace:*)

---

## Verification Commands
```bash
# Build
bun --filter astro build

# No tRPC leakage check
grep -r "@trpc" --include="*.ts" --include="*.tsx" astro/src/
grep -r "superjson" --include="*.ts" --include="*.tsx" astro/src/
grep -r "'use client'" --include="*.astro" astro/src/

# Should return empty for all three
```