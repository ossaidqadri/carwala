# PWA Implementation Plan for Car-Wala

Based on official Next.js docs: https://nextjs.org/docs/app/guides/progressive-web-apps

---

## Step 1: Create Web App Manifest

**File**: `app/manifest.ts`

```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Car-Wala',
    short_name: 'CarWala',
    description: 'Your trusted automotive companion',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

---

## Step 2: Generate PWA Icons

**Location**: `public/` folder

**Required Icons**:
- `icon-192x192.png` - Home screen icon (Android)
- `icon-512x512.png` - Larger icon for splash screens
- `apple-touch-icon.png` - iOS home screen (optional but recommended)
- `favicon.ico` - Browser tab icon

**Tools to Generate**:
- https://realfavicongenerator.net/
- https://app-manifest.firebaseapp.com/
- Or use any favicon generator

**Action**: User needs to provide/generate these PNG icons

---

## Step 3: Create Service Worker

**File**: `public/sw.js`

```javascript
const CACHE_NAME = 'car-wala-v1'
const urlsToCache = [
  '/',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

---

## Step 4: Register Service Worker

**File**: `components/PwaProvider.tsx` (new client component)

```typescript
'use client'

import { useEffect, useState } from 'react'

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [isSupported, setIsSupported] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true)

      // Register service worker
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                  console.log('New content available, please refresh.')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return (
    <>
      {children}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <p>New version available! </p>
          <button
            onClick={() => window.location.reload()}
            className="underline font-bold"
          >
            Refresh
          </button>
        </div>
      )}
    </>
  )
}
```

---

## Step 5: Add PWA Provider to Root Layout

**File**: `app/layout.tsx` (modify existing)

Wrap the app with `PwaProvider`:

```typescript
import { PwaProvider } from '@/components/PwaProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PwaProvider>{children}</PwaProvider>
      </body>
    </html>
  )
}
```

---

## Step 6 (Optional): Push Notification Support

### 6a: Generate VAPID Keys

```bash
bun add -g web-push
web-push generate-vapid-keys
```

Save the output to `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### 6b: Create Push Notification Component

**File**: `components/PushNotificationManager.tsx`

(Will implement subscribe/unsubscribe UI with VAPID)

---

## Testing Steps

1. **Build and run**:
   ```bash
   bun run build
   bun run start
   ```

2. **Check manifest**:
   - Open DevTools → Application → Manifest
   - Verify all fields are correct
   - Check "Add to home screen" prompt appears

3. **Test service worker**:
   - DevTools → Application → Service Workers
   - Verify status is "activated"
   - Test offline mode (check cached resources load)

4. **Test installation**:
   - Chrome: Address bar shows install icon
   - Mobile: "Add to home screen" in browser menu

5. **Test offline**:
   - Disconnect network
   - Reload page - should load from cache

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/manifest.ts` | Create |
| `public/icon-192x192.png` | Add |
| `public/icon-512x512.png` | Add |
| `public/sw.js` | Create |
| `components/PwaProvider.tsx` | Create |
| `app/layout.tsx` | Modify |

---

## Notes

- Service workers only work in **production** or with `https://`
- Local testing: Works on `localhost` but needs production build
- Icons must be in `public/` folder for service worker to cache them
- Manifest is automatically linked by Next.js when using `manifest.ts`
