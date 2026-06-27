# Car Wala — Premium Car Detailing in Karachi

Professional car wash and detailing website built with **Astro v7** and **React islands architecture**.

## Tech Stack

- **Astro v7** — Static-first framework with islands architecture
- **React 19** — Interactive UI components (hydrated only when needed)
- **Tailwind CSS v4** — Styling via Vite plugin
- **Vercel** — Deployment with ISR support
- **Cal.com** — Booking calendar integration
- **Upstash** — Rate limiting and Redis caching

## Performance Features

- **Native font system** — Self-hosted fonts via `fontProviders.local()` with `font-display: swap`
- **Image optimization** — `<Image />` and `<Picture />` components from `astro:assets`
- **Islands architecture** — Minimal JS: only `client:idle` / `client:visible` / `client:load` where needed
- **CDN caching** — `routeRules` with `staleWhileRevalidate` for static pages
- **ISR** — 5-minute revalidation for booking calendar pages

## Project Structure

```text
/
├── src/
│   ├── assets/fonts/     # Self-hosted fonts (ITC, Mulish, Montserrat, Pixel Operator)
│   ├── components/       # React islands + Astro components
│   │   ├── home/         # Header, Hero, Footer, etc.
│   │   └── ui/           # Reusable UI components
│   ├── layouts/          # BaseLayout with SEO meta tags
│   ├── lib/              # Schemas, utilities
│   ├── pages/            # Routes (index, pricing, gallery, calendar, api/)
│   └── styles/           # globals.css with CSS variables
├── public/
│   ├── fonts/            # Fallback font files
│   └── media/            # Static images and videos
└── astro.config.mjs      # Astro + Vercel adapter configuration
```

## Commands

```sh
bun install              # Install dependencies
bun dev                  # Start dev server at localhost:4321
bun build                # Build for production
bun preview              # Preview production build
```

## SEO

- Sitemap at `/sitemap-index.xml`
- Robots.txt at `/robots.txt`
- Open Graph + Twitter Card meta tags
- Canonical URLs
- `@astrojs/sitemap` integration

## Deployment

Deployed on **Vercel** with:
- Server-side rendering (`output: 'server'`)
- Vercel adapter with image optimization
- ISR for dynamic pages