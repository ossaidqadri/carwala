# Carwala - Professional Car Detailing & Wash

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sirrabeetali-5403s-projects/v0-carwala-car-wash)

A modern, professional car wash and detailing service booking platform built with Next.js 16, React 19, and tRPC.

##  Features

- **Service Showcase** - Display detailing packages (Silver, Gold, Platinum, Deep Detailing)
- **Online Booking** - Real-time appointment scheduling with Cal.com integration
- **Interactive Calendar** - Custom calendar with drag-and-drop event management
- **Contact Form** - Google Sheets integration for lead capture
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Dark Mode** - Full theme support via next-themes
- **Performance Optimized** - Static generation, intersection observer for lazy loading

##  Tech Stack

### Frontend
- **Framework:** Next.js 16.0.10
- **React:** 19.2.0
- **Styling:** Tailwind CSS 4.1.9
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form with Zod validation
- **Calendar:** React Day Picker, custom calendar components
- **Animations:** Tailwind CSS Animate, CSS transitions

### Backend
- **API:** tRPC (end-to-end type safety)
- **Email:** Nodemailer (Gmail SMTP)
- **Data Storage:** Google Sheets API
- **Booking:** Cal.com integration

### Development
- **Language:** TypeScript 5
- **Build Tool:** Next.js compiler
- **Deployment:** Vercel

##  Installation

### Prerequisites
- Node.js 18+ 
- Bun (recommended) or npm

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd car-wala

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Configure the following in `.env.local`:

```env
# Cal.com Booking Integration
NEXT_PUBLIC_CALCOM_EVENT_TYPE_ID=your_silver_package_event_type_id
NEXT_PUBLIC_CALCOM_GOLD_EVENT_TYPE_ID=your_gold_package_event_type_id
NEXT_PUBLIC_CALCOM_PLATINUM_EVENT_TYPE_ID=your_platinum_package_event_type_id
NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID=your_detailed_package_event_type_id

# Google Sheets (Contact Form)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SHEET_ID=your_spreadsheet_id

# Gmail (Email Notifications)
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_app_password
GMAIL_RECIPIENTS=notification_recipients
```

##  Development

```bash
# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linter
bun lint
```

## 📁 Project Structure

```
car-wala/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── calendar/             # Booking calendar page
│   ├── services/             # Services showcase page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── booking-calendar/     # Booking widget & calendar
│   ├── calendar/             # Interactive calendar components
│   ├── home/                 # Home page sections
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── booking-calendar/     # Booking utilities & hooks
│   └── trpc.ts               # tRPC client setup
├── server/
│   ├── routers/              # tRPC routers
│   └── trpc.ts               # tRPC server setup
├── types/                    # TypeScript type definitions
└── styles/                   # Global styles
```

## 🎨 Services

| Package | Duration | Description |
|---------|----------|-------------|
| Silver | 30 min | Essential care - exterior wash, interior vacuum & dashboard wipe |
| Gold | 60 min | Premium treatment - deep clean, seat shampooing & engine bay |
| Platinum | 90 min | Ultimate luxury - polish, paint sealant & leather conditioning |
| Deep Detailing | 120 min | Complete perfection - paint correction, ceramic coating & full detail |

## 🔌 Integrations

### Cal.com
- Real-time availability checking
- Timezone-aware scheduling
- Automatic calendar sync

### Google Sheets
- Contact form submissions
- Lead tracking
- Customer data management

### Gmail
- Automated email notifications
- Contact form alerts
- Booking confirmations

## 📱 Pages

- **Home** (`/`) - Hero, services preview, testimonials, CTA
- **Services** (`/services`) - Detailed package descriptions with pricing
- **Calendar** (`/calendar`) - Interactive booking system
- **Contact** - Contact form with email & Sheets integration

## 🎯 Key Features

### Booking System
- Multi-step booking flow
- Service selection
- Date & time slot picker
- Guest count configuration
- Contact information form
- Real-time availability
- Timezone support

### Calendar Component
- Month, week, day, agenda views
- Drag-and-drop rescheduling
- Event creation/editing
- Multi-day event support
- Collision detection
- Keyboard navigation

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contact

For business inquiries or support, contact through the website contact form.

---

Built with ❤️ by otherdev.com  for Carwala Auto Care
