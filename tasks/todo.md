# Font Optimization Plan

## Discovery Results

### Fonts Actually Used (4)
| Font | Purpose | Weights Needed |
|------|---------|----------------|
| ITC Avant Garde Gothic Pro | Headings (`font-heading`) | 400 (normal), 500, 600, 700 |
| Mulish | Body/sans (`font-body`, `font-sans`) | 400 (variable range 300-700) |
| Montserrat | UI/Accent (`font-accent`, `font-ui`) | 400 (variable range 300-700) |
| Pixel Operator | Logo (`font-pixel`) | 400, 700 |

### Unused — Remove @font-face declarations
- **Karla** — declared, zero usage
- **Poppins** — declared, zero usage  
- **ITC AG Italic variants** — declared but never used (200i, 400i, 500i, 600i, 700i)
- **Geist Mono** — referenced in `@theme inline` but no `@font-face` AND no usage

---

## Implementation Steps

- [ ] 1. Fetch Astro v7 `<Font>` component docs via ctx7
- [ ] 2. Update `astro.config.mjs` — configure fonts in `assets` 
- [ ] 3. Migrate `globals.css` @font-face → use Astro `<Font>` component in BaseLayout
- [ ] 4. Remove unused @font-face declarations (Karla, Poppins, italic variants)
- [ ] 5. Fix Geist Mono reference in `@theme inline` — remove it (broken, unused)
- [ ] 6. Remove `<link rel="preload">` font hints from BaseLayout (Font component handles this)
- [ ] 7. Verify build works and test in browser
