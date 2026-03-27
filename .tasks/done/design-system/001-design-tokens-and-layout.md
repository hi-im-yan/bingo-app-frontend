# 001 — Design Tokens and Base Layout Components

## What was built
Warm amber/gold design system for a bingo game targeting elderly users. CSS variables in globals.css, Outfit font, base layout components.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| globals.css | app/globals.css | Complete rewrite with oklch color tokens (light/dark), game tokens |
| page-container.tsx | components/page-container.tsx | Single-column centered layout (max-w-lg, px-4 py-6) |
| page-header.tsx | components/page-header.tsx | PageHeader, PageTitle, PageDescription — centered text entry |
| game-card.tsx | components/ui/game-card.tsx | GameCard, GameCardHeader, GameCardTitle, GameCardContent |
| bingo-ball.tsx | components/ui/bingo-ball.tsx | Signature component — circle with number, 3 sizes, drawn state |
| system.md | .interface-design/system.md | Full design system documentation |

## Files MODIFIED
| File | Change |
|------|--------|
| app/[locale]/layout.tsx | Outfit font (replaced Geist), viewport meta maxScale:1 |

## Key Tokens
- Primary: warm amber `oklch(0.75 0.18 70)` / dark: `oklch(0.82 0.2 70)`
- Canvas: warm cream `oklch(0.97 0.01 80)` / dark: warm charcoal `oklch(0.17 0.02 70)`
- Ball drawn: `--ball-drawn` / `--ball-drawn-foreground` for highlighted numbers
- Semantic: `--success`, `--warning` with foregrounds

## Done Definition
- All tokens render correctly in light and dark mode
- Base components used consistently across all pages
- BingoBall sizes (sm/md/lg) and drawn/undrawn states working
- npm run build succeeds
