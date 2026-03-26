# 001 — Automatic Draw Panel

## What was built
AutomaticDrawPanel component for AUTOMATIC mode rooms. Single "Draw Number" button, all-drawn message. Integrated into admin page via mode branching.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| automatic-draw-panel.tsx | components/automatic-draw-panel.tsx | Draw button + all-drawn message |
| automatic-draw-panel.test.tsx | components/__tests__/automatic-draw-panel.test.tsx | 3 tests |

## Key Details
- Props: `allDrawn: boolean`, `onDraw: () => void`
- When `allDrawn=false`: full-width lg Button "Draw Number"
- When `allDrawn=true`: muted text "All numbers have been drawn!"
- Admin page computes `allDrawn = drawnNumbers.length >= TOTAL_NUMBERS`
- Admin page wires `handleDrawNumber` → `drawNumber(creatorHash)` via useRoomSubscription

## Tests (3)
- Renders draw button when numbers remain
- Calls onDraw on click
- Shows all-drawn message and hides button when allDrawn

## Done Definition
- Automatic mode shows draw button or all-drawn message
- 3 tests passing
- npm run build succeeds
