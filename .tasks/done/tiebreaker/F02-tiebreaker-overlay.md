# F02 — Tiebreaker Overlay Component

## What to build
A full-screen overlay that displays the tiebreaker state: player count, each slot's drawn number with animation, and the winner highlight when finished. Visible to both admin and players.

## Acceptance Criteria
- [ ] Overlay appears when tiebreak data is provided (status STARTED/IN_PROGRESS/FINISHED)
- [ ] Shows numbered slots (Draw 1, Draw 2, etc.) matching playerCount
- [ ] Each slot shows a bingo ball animation when its number is drawn
- [ ] Undrawn slots show a placeholder (e.g. "?")
- [ ] Winner slot highlighted when status is FINISHED
- [ ] Overlay dismissable by admin after FINISHED (via close button or callback)
- [ ] Backdrop overlay with z-index above page content
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `tiebreaker-overlay.tsx` | `components/` | Full-screen tiebreaker display |
| `tiebreaker-overlay.test.tsx` | `components/__tests__/` | Tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/draw-popup.tsx` | Full-screen overlay pattern: fixed inset-0, z-[60], backdrop bg-black/50, CSS animations, aria-live |
| `components/current-number.tsx` | Bingo ball rendering pattern (number inside circle with theme colors) |
| `components/ui/game-card.tsx` | GameCard compound component for structured sections |
| `lib/types.ts` | TiebreakDTO, TiebreakDrawEntry, TiebreakStatus types (from F01) |

### Implementation Details

**Props:**
```typescript
"use client";

interface TiebreakerOverlayProps {
  tiebreak: TiebreakDTO | null;
  onDismiss: () => void;
}
```

- When `tiebreak` is null, render nothing
- When `tiebreak` is provided, show full-screen overlay

**Layout:**
```
┌──────────────────────────────┐
│        TIEBREAKER!           │  ← title
│                              │
│   [Draw 1]  [Draw 2]  [Draw 3]  ← slots in a flex row/grid
│    B-7        ?       O-63   │  ← number or placeholder
│                              │
│       🏆 Draw 3 wins!       │  ← winner banner (FINISHED only)
│                              │
│        [Close]               │  ← dismiss button (FINISHED only)
└──────────────────────────────┘
```

**Slot display:**
- Undrawn slot: muted circle with "?" text
- Drawn slot: bingo ball with number and label, entry animation (scale + fade in)
- Winner slot: ring highlight (e.g. `ring-4 ring-primary`) or golden glow

**Animations:**
- Overlay entrance: fade-in backdrop + scale-up content (similar to draw-popup)
- Slot draw: ball drops/scales in when number appears
- Winner: pulse or glow animation on the winning ball

**CSS approach:** Use Tailwind `animate-` classes. Define keyframes in the component or globals.css if needed, following the pattern in draw-popup.tsx.

### Conventions
- `"use client"` directive
- `useTranslations("tiebreak")` for i18n keys (keys added in F05, use raw keys for now)
- `aria-live="polite"` on the overlay for screen reader announcements
- Theme-aware colors: use `bg-ball`, `text-ball-foreground` for bingo balls (existing design tokens)
- Responsive: slots wrap on small screens, row on larger

## TDD Sequence
1. Write tests: renders nothing when tiebreak is null, renders slots matching playerCount, shows "?" for undrawn slots, shows number/label for drawn slots, shows winner banner when FINISHED, calls onDismiss when close clicked
2. Implement TiebreakerOverlay component
3. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
