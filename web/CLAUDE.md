@AGENTS.md

# Shadowlancer Design System

## Design Philosophy
"Calm Design" — minimalist, anxiety-free UX. Eliminate dark patterns, FOMO, and clutter. Interface fades into the background so the user can focus.

---

## Color Palette (Tailwind v4 tokens in globals.css)

### Primary (neutral grey)
- `primary`: #5f5e5e — buttons, icons, accents
- `primary-dim`: #535252 — hover state
- `primary-container`: #e5e2e1 — outline button bg
- `on-primary`: #faf7f6 — text on primary bg
- `on-primary-container`: #525151

### Secondary (blue-grey)
- `secondary`: #585f6d
- `secondary-container`: #dce2f3
- `on-secondary`: #f8f8ff

### Tertiary (blue — used for highlights, badges, charts)
- `tertiary`: #4c5b9c
- `tertiary-container`: #a3b2fa — "Interviewing" badge bg
- `on-tertiary-container`: #1f2f6f — "Interviewing" badge text
- `tertiary-dim`: #404f8f

### Surface scale (light → dark)
- `surface-container-lowest`: #ffffff
- `surface-container-low`: #f1f4f6 — section backgrounds, card hover base
- `surface-container`: #eaeff1 — card backgrounds
- `surface-container-high`: #e2e9ec
- `surface-container-highest`: #dbe4e7 — "Under Review" / "Closed" badge bg
- `surface`: #f8f9fa — page background
- `surface-dim`: #d1dce0
- `surface-variant`: #dbe4e7

### Text
- `on-surface`: #2b3437 — primary body text
- `on-surface-variant`: #586064 — secondary/muted text
- `on-background`: #2b3437

### Utility
- `outline`: #737c7f
- `outline-variant`: #abb3b7 — subtle borders (often used at /10 opacity)
- `error`: #9f403d
- `on-error`: #fff7f6
- `error-container`: #fe8983 — unread count badge

---

## Typography
- **Headline font**: Manrope — weights 600, 700, 800 — used for all headings, logo, large numbers
  - Class: `font-headline`
- **Body font**: Inter — weights 300, 400, 500, 600 — used for paragraphs, nav, labels
  - Class: `font-body` or `font-label`
- Loaded via `next/font/google` with CSS vars `--font-manrope` and `--font-inter`
- Heading tracking: `tracking-tighter` (−0.05em) for display sizes
- Body tracking: normal or `tracking-wide` for uppercase labels

---

## Border Radius (intentionally tight/square)
- Default (`rounded`): 0.125rem — nearly square
- `rounded-lg`: 0.25rem
- `rounded-xl`: 0.5rem — cards, panels
- `rounded-full`: 0.75rem — pills, buttons with rounded style

---

## Component Patterns

### Buttons
- **Primary**: `bg-primary text-on-primary hover:bg-primary-dim` + `rounded-md`
- **Ghost**: `text-primary font-semibold` — often with arrow icon
- **Outline**: `bg-primary-container text-on-primary-container hover:bg-surface-container-highest`
- Font: `font-label font-semibold`

### Cards / Panels
- Background: `bg-surface-container-low` (default), `bg-surface-container-lowest` (elevated)
- Padding: `p-8` standard, `p-10` for feature cards
- Border: `border border-outline-variant/10` (very subtle)
- Radius: `rounded-xl`
- Hover: `hover:bg-surface-container transition-all duration-300`

### Badges (job status)
- "Under Review" / "Closed": `bg-surface-container-highest text-on-surface-variant`
- "Interviewing" / "Active": `bg-tertiary-container text-on-tertiary-container`
- Shape: `rounded-full px-4 py-1.5 text-xs font-semibold`

### Navbar
- Fixed, `h-20`, `bg-surface`
- Logo: `font-headline font-bold text-2xl tracking-tighter text-[#1A1A1A]`
- Nav links: `font-body text-sm font-medium text-on-surface-variant` → active: `font-semibold border-b-2 border-primary`
- Max width: `max-w-[1440px] mx-auto px-8`
- Divider: `bg-surface-container h-[1px]` at bottom

### Footer
- `bg-surface-container-low`
- Logo + copyright left, nav links right
- Links: `text-xs tracking-wide uppercase underline underline-offset-4`

---

## Layout
- Max content width: `max-w-[1440px]` with `mx-auto`
- Horizontal padding: `px-8` (mobile) → `px-24` (desktop hero)
- Bento grids: `grid-cols-12` for dashboard, `grid-cols-4 grid-rows-2` for preview
- Section vertical spacing: `py-32` for major sections, `py-20` for lighter ones

---

## Visual Effects
- **Grayscale images** with `hover:grayscale-0 transition-all duration-700/1000` — images reveal color on hover
- **Ambient blobs**: `bg-tertiary/5 blur-3xl rounded-full` positioned absolutely for depth
- **Frosted glass**: `.frosted-glass` — `rgba(255,255,255,0.7)` + `backdrop-filter: blur(24px)`
- **Material Symbols Outlined**: icon font with `font-variation-settings: 'FILL' 0, 'wght' 400`

---

## Dark Mode
- Strategy: `class` (toggle via `.dark` on `<html>`)
- Dark surface: `dark:bg-slate-950` / `dark:bg-slate-900`
- Dark text: `dark:text-slate-100` / `dark:text-slate-400`
- Not fully implemented — light mode is primary

---

## File Locations
- Tokens: `src/app/globals.css` — `@theme` block
- Layout: `src/app/layout.tsx` — font loading + Material Symbols link
- UI primitives: `src/components/ui/` — Button, Badge, Icon
- Shared layout: `src/components/layout/` — Navbar, Footer
- Types: `src/types/index.ts` — Job, Message, NavItem, JobStatus
- Utilities: `src/lib/cn.ts` — class merging helper

---

## Rules for Contributors
- Never introduce new hex color values — always map to the existing palette tokens above
- Use `font-headline` for all display/heading text, `font-body`/`font-label` for everything else
- All new pages follow the `<Navbar /> + <main> + <Footer />` shell pattern
- Data (arrays, mock content) lives in page files (`app/**/page.tsx`), not in components
