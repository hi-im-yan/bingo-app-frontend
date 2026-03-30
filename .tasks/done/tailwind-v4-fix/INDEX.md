# Fix — Tailwind CSS v3 to v4 migration

**Status:** ready
**Blocked by:** —
**Branch:** fix/tailwind-v4-migration
**Priority:** high — build is broken on main

## Description
`npm run build` fails because the project upgraded to Tailwind CSS v4 (via Next.js 16) but still has v3-era configuration. The PostCSS plugin moved to `@tailwindcss/postcss`, `tailwind.config.ts` was removed but `tailwindcss-animate` still references it, and component styles use v3 utility syntax.

## Errors
1. `tailwindcss` can't be used directly as PostCSS plugin — need `@tailwindcss/postcss`
2. `tailwindcss-animate` module not found (removed with `tailwind.config.ts`)
3. Component CSS imports may need updating for v4 `@theme` / `@import` syntax

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Update PostCSS config to use @tailwindcss/postcss | ready | — | Component Builder |
| 002 | Migrate globals.css to v4 @import/@theme syntax | ready | 001 | Component Builder |
| 003 | Replace tailwindcss-animate with v4-compatible approach | ready | 001 | Component Builder |
| 004 | Verify build passes and all pages render correctly | ready | 001, 002, 003 | Component Builder |

## Notes
- Tailwind v4 uses CSS-first config (`@theme` in CSS) instead of `tailwind.config.ts`
- `tailwindcss-animate` may need replacement with `tw-animate-css` or manual keyframes
- shadcn/ui components may need regeneration for v4 compatibility
