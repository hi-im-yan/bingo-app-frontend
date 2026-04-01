# F03 — Admin Tiebreaker Panel

## What to build
A tiebreaker control panel for the admin page in automatic rooms. Includes a "Start Tiebreaker" button with a player count selector, and per-slot "Draw" buttons during an active tiebreaker.

## Acceptance Criteria
- [ ] "Start Tiebreaker" button visible on admin page in AUTOMATIC rooms only
- [ ] Player count selector (2–6) shown before starting
- [ ] Clicking start calls `startTiebreak(creatorHash, playerCount)`
- [ ] During active tiebreaker: shows slot draw buttons (Draw 1, Draw 2, etc.)
- [ ] Each slot button calls `tiebreakDraw(creatorHash, slot)` and is disabled after drawn
- [ ] Panel disabled/hidden when no tiebreaker is active and game is not in a state where tiebreaker makes sense
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `tiebreaker-panel.tsx` | `components/` | Admin tiebreaker controls |
| `tiebreaker-panel.test.tsx` | `components/__tests__/` | Tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/automatic-draw-panel.tsx` | GameCard panel pattern, button with cooldown, component structure |
| `components/ui/game-card.tsx` | GameCard compound components |
| `components/ui/button.tsx` | Button variants and sizes |
| `lib/types.ts` | TiebreakDTO, TiebreakStatus types (from F01) |

### Implementation Details

**Props:**
```typescript
"use client";

interface TiebreakerPanelProps {
  tiebreak: TiebreakDTO | null;
  onStart: (playerCount: number) => void;
  onDraw: (slot: number) => void;
}
```

**States:**
1. **Idle** (tiebreak is null): Show "Start Tiebreaker" button + player count stepper (default 2)
2. **Active** (tiebreak STARTED/IN_PROGRESS): Show slot draw buttons, disable already-drawn slots
3. **Finished** (tiebreak FINISHED): Panel returns to idle (overlay handles the result display)

**Player count selector:**
- Simple stepper: minus/plus buttons around a number (2–6 range)
- Or a `<select>` dropdown — keep it simple

**Slot draw buttons:**
- Row of buttons: "Draw 1", "Draw 2", etc.
- Each button disabled if that slot is already in `tiebreak.draws`
- Use `variant="outline"` for undrawn, `variant="default"` for drawn (show the number)

### Conventions
- `"use client"` directive
- `useTranslations("tiebreak")` for i18n keys
- `useState` for player count
- GameCard wrapper for visual consistency with other admin panels
- Tailwind classes matching existing panel patterns

## TDD Sequence
1. Write tests: renders start button, player count defaults to 2 and can increment/decrement, start calls onStart with count, renders slot buttons during active tiebreak, drawn slots disabled, calls onDraw with slot number
2. Implement TiebreakerPanel component
3. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
