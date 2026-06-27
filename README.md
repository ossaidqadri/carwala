# Car Wala — Premium Car Detailing in Karachi

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://carwala.org)

Marketing website for **Car Wala Auto Care** — a professional car detailing and wash booking platform.

## Project

This repo contains the **Astro marketing site** only. The booking platform has been moved to a separate repo.

### Tech Stack

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

## Commands

```sh
bun install              # Install dependencies
bun dev                  # Start dev server at localhost:4321
bun build                # Build for production
bun preview              # Preview production build
```

## Environment Variables

```env
# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Google Sheets (Contact Form)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SHEET_ID=your_spreadsheet_id

# Gmail (Email Notifications)
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_app_password
GMAIL_RECIPIENTS=notification_recipients
```

## Integrations

| Service | Purpose |
|---------|---------|
| Cal.com | Real-time booking & scheduling |
| Google Sheets | Contact form leads |
| Gmail SMTP | Email notifications |
| Upstash Redis | Caching & rate limiting |

## Deployment

Deployed on **Vercel** at [carwala.org](https://carwala.org) with:
- Server-side rendering (`output: 'server'`)
- Vercel adapter with image optimization
- ISR for dynamic pages

## License

Proprietary software. All rights reserved.