# Design System — Bingo App

## Direction
Warm, confident, game-night energy. Built for elderly users, latecomers, and phone-at-arm's-length play. Mobile-first. Accessibility is the design, not a feature.

## Feel
Like a well-lit game hall — warm amber lighting, physical table feel. Playful confidence: trusted at a company event, not boring for a teenager. The drawn number is the star — everything else supports it.

## Font
**Outfit** — geometric, friendly, reads well at large sizes. Excellent number rendering for bingo balls. Not childish, not corporate.

## Palette
Warm amber/gold accent (oklch hue ~70-85) on warm neutral surfaces.

### Light Mode
- Canvas: warm cream `oklch(0.975 0.005 85)` — not clinical white
- Cards: near-white warm `oklch(0.99 0.003 85)`
- Text: warm near-black `oklch(0.16 0.01 55)` — high contrast
- Primary: amber `oklch(0.65 0.18 70)` — the bingo cage
- Borders: warm low-contrast `oklch(0.88 0.015 80)`

### Dark Mode
- Canvas: warm charcoal `oklch(0.16 0.01 55)` — not cold gray
- Cards: elevated warm `oklch(0.21 0.012 55)`
- Text: warm off-white `oklch(0.94 0.008 85)`
- Primary: brighter amber `oklch(0.78 0.16 75)`
- Borders: subtle warm `oklch(1 0 0 / 12%)`

### Semantic
- Success: green — "BINGO!" moment
- Destructive: warm red
- Warning: gold-orange
- All slightly desaturated in dark mode

### Game Tokens
- `--ball` / `--ball-foreground`: undrawn ball default
- `--ball-drawn` / `--ball-drawn-foreground`: drawn ball highlight

## Depth
Subtle shadows. Cards and drawn numbers feel lifted like game pieces on a table. No harsh borders. Shadow-sm on cards, shadow-md on drawn balls.

## Spacing
Base unit: 4px (Tailwind default). Components use generous padding (p-5 on cards, px-4 on page). Touch targets minimum 44px (size-11). Large balls size-16.

## Radius
- Cards: `rounded-2xl` (16px) — friendly, echoes ball shape
- Balls: `rounded-full` — always circles
- Buttons/inputs: inherit shadcn `--radius` (0.75rem / 12px)

## Typography Scale
- Page title: `text-2xl font-bold tracking-tight` / `sm:text-3xl`
- Card title: `text-lg font-semibold`
- Body: `text-base` (16px minimum)
- Ball number (lg): `text-3xl font-bold tabular-nums`
- Ball number (md): `text-lg font-bold tabular-nums`
- Ball number (sm): `text-sm font-bold tabular-nums`

## Layout
No sidebar — full-screen focused flows. Mobile-first single column.
- `PageContainer`: max-w-lg, centered, px-4 py-6
- `PageHeader`: centered text, title + description
- `GameCard`: rounded-2xl, p-5, shadow-sm

## Components

### BingoBall
Circle with number. Three sizes (sm/md/lg). Drawn state toggles amber highlight. `tabular-nums` for alignment. The signature element.

### GameCard
Warm surface card for game content. Header/title/content slots. Generous padding for touch.

### PageContainer
Single-column centered layout. max-w-lg keeps content focused on mobile and readable on desktop.

### PageHeader
Centered title + description. Entry point for each screen.

## Accessibility
- Minimum 16px body text, 14px labels
- Touch targets 44px+
- High contrast: warm near-black on cream (light), warm off-white on charcoal (dark)
- `tabular-nums` on all numbers for readability
- Sound cues planned for draw events
- `maximumScale: 1` on viewport to prevent zoom-fighting on mobile
