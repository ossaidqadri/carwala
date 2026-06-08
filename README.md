# Carwala Monorepo

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

A monorepo for **Carwala Auto Care** — a professional car detailing and wash booking platform.

##  Projects

| Workspace | Description | Deployed URL |
|-----------|-------------|--------------|
| `next/` | Main booking platform (Next.js 16) | carwala.vercel.app |
| `astro/` | Marketing site (Astro) | carwala-astro.vercel.app |
| `packages/schemas/` | Shared TypeScript schemas | Internal only |

##  Tech Stack

### Shared
- **Package Manager:** Bun
- **Language:** TypeScript 5.6
- **Monorepo Tool:** Bun workspaces

### Next.js App
- Next.js 16.0.10, React 19.2.0
- Tailwind CSS 4, Radix UI, shadcn/ui
- tRPC (end-to-end type-safe APIs)
- TanStack Query, React Hook Form + Zod
- Cal.com (booking), Google Sheets (leads), Nodemailer (email)

### Astro App
- Astro 6.4.4 with React integration
- @tsparticles (animations), Embla Carousel
- @upstash/redis + @upstash/ratelimit (caching/rate-limiting)
- Vercel adapter (edge deployment)

##  Getting Started

### Prerequisites
- **Node.js** 18+ (Astro requires 22.12.0+)
- **Bun** (recommended) or npm

### Installation

```bash
# Install all workspace dependencies
bun install

# Copy environment files
cp next/.env.example next/.env.local
cp astro/.env.example astro/.env  # if exists
```

### Environment Variables

**Next.js** (`next/.env.local`):
```env
# Cal.com Booking Integration
NEXT_PUBLIC_CALCOM_EVENT_TYPE_ID=your_event_type_id
NEXT_PUBLIC_CALCOM_GOLD_EVENT_TYPE_ID=your_gold_event_type_id
NEXT_PUBLIC_CALCOM_PLATINUM_EVENT_TYPE_ID=your_platinum_event_type_id
NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID=your_detailed_event_type_id

# Google Sheets (Contact Form)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SHEET_ID=your_spreadsheet_id

# Gmail (Email Notifications)
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_app_password
GMAIL_RECIPIENTS=notification_recipients
```

**Astro** (`astro/.env`):
```env
# Upstash Redis
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Google Sheets
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SHEET_ID=your_spreadsheet_id
```

##  Development

```bash
# Start all workspaces in parallel (requires bun)
bun run dev:next
bun run dev:astro

# Or start individual workspaces
bun --filter next dev
bun --filter astro-app dev

# Build all workspaces
bun run build

# Build individual workspaces
bun run build:next
bun run build:astro

# Lint all workspaces
bun run lint

# Type-check all workspaces
bun run typecheck
```

##  Project Structure

```
car-wala/
├── next/                      # Next.js booking platform
│   ├── app/                   # App Router pages
│   │   ├── api/               # tRPC API routes
│   │   ├── calendar/          # Booking calendar page
│   │   └── services/          # Services showcase
│   ├── components/            # React components
│   │   ├── booking-calendar/  # Booking widget
│   │   ├── calendar/          # Interactive calendar
│   │   ├── home/              # Home page sections
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                    # Utilities & tRPC client
│   ├── server/                 # tRPC routers
│   └── types/                  # TypeScript types
│
├── astro/                     # Astro marketing site
│   ├── src/
│   │   ├── pages/             # Astro pages
│   │   └── components/         # Astro/React components
│   └── public/                # Static assets
│
└── packages/
    └── schemas/               # Shared TypeScript schemas
```

##  Services (Next.js App)

| Package | Duration | Description |
|---------|----------|-------------|
| Silver | 30 min | Exterior wash, interior vacuum, dashboard wipe |
| Gold | 60 min | Deep clean, seat shampooing, engine bay |
| Platinum | 90 min | Polish, paint sealant, leather conditioning |
| Deep Detailing | 120 min | Paint correction, ceramic coating, full detail |

##  Integrations

| Service | Purpose |
|---------|----------|
| Cal.com | Real-time booking & scheduling |
| Google Sheets | Contact form leads |
| Gmail SMTP | Email notifications |
| Upstash Redis | Caching & rate limiting |

##  Deployment

Both apps deploy to Vercel:

- **Next.js** — `next/` directory with `vercel.json` config
- **Astro** — `astro/` directory with Vercel adapter

Preview deployments are created automatically for PRs.

##  License

Proprietary software. All rights reserved.
