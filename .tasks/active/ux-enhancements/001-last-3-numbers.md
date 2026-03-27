# 001 — Last 3 Drawn Numbers Component
**Status:** ready
**Blocked by:** none
**Assignee:** Component Builder

## What
Create a new `LastDrawnNumbers` component that displays the three most recently drawn bingo numbers in a horizontal strip. The most recent number is visually prominent (center or leading position, `md` size ball), while the two preceding numbers are smaller (`sm` size) and faded to convey recency order at a glance. This component will be placed directly below `CurrentNumber` in both the admin and player views.

## Acceptance Criteria
- [ ] Component file exists at `components/last-drawn-numbers.tsx`
- [ ] Accepts a `drawnNumbers: number[]` prop (the full drawn list, newest last)
- [ ] Derives the last 3 entries from the array internally; renders nothing (or an empty container) when the array has fewer than 2 entries (CurrentNumber already covers the single-number case)
- [ ] Most recent ball uses `BingoBall` with `size="md"` and full opacity
- [ ] Two preceding balls use `BingoBall` with `size="sm"` and reduced opacity (e.g. `opacity-50`) to fade older entries
- [ ] Each ball is accompanied by its `formatBingoLabel` string (e.g. "B-7") rendered in a small label below it
- [ ] Layout is horizontal (`flex flex-row`) with the most recent ball leading (leftmost or center depending on count)
- [ ] All balls have `drawn` prop set to `true`
- [ ] Section heading uses the i18n key `room.recentDraws` (e.g. "Recent draws")
- [ ] Key `room.recentDraws` is added to `messages/en.json` and `messages/pt.json`
- [ ] Component is marked `"use client"` and uses `useTranslations("room")`
- [ ] Renders no visible layout chrome when `drawnNumbers.length < 2`

## Implementation Notes
- Import path for `BingoBall`: `@/components/ui/bingo-ball`
- Import path for `formatBingoLabel`: `@/lib/constants`
- Derive the slice inside the component: `const recent = drawnNumbers.slice(-3).reverse()` — index 0 is the most recent
- Opacity classes: `opacity-50` for index 1 (second most recent), `opacity-30` for index 2 (oldest of the three). Use Tailwind `cn()` from `@/lib/utils` to compose class strings conditionally
- Do not accept a `limit` prop — three is fixed by design
- The component has no internal state; it is purely derived from props
- English string suggestion: `"recentDraws": "Recent draws"`
- Portuguese string suggestion: `"recentDraws": "Últimos sorteios"`
