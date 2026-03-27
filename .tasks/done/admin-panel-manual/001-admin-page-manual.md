# 001 — Admin Page + Manual Draw Panel

## What was built
Admin page at `/room/[code]/admin` with creator auth verification. For MANUAL mode: ManualDrawPanel with clickable number grid. Reuses CurrentNumber and DrawnNumbersBoard from player room.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| page.tsx | app/[locale]/room/[code]/admin/page.tsx | Admin page — auth check, mode branching, draw panels |
| manual-draw-panel.tsx | components/manual-draw-panel.tsx | Clickable number grid (1-75) in B/I/N/G/O columns |
| page.test.tsx | app/[locale]/room/[code]/admin/__tests__/page.test.tsx | 9 tests |
| manual-draw-panel.test.tsx | components/__tests__/manual-draw-panel.test.tsx | 5 tests |

## Key Details
- Auth: checks `getCreatorHash(params.code)` — if null, shows error page (not redirect)
- Mode branching: `displayRoom.drawMode === "MANUAL"` → ManualDrawPanel, else AutomaticDrawPanel
- ManualDrawPanel: button per number (not BingoBall), drawn numbers disabled, click calls `onDrawNumber(num)`
- Admin page wires `handleAddNumber` → `addNumber(creatorHash, number)` via useRoomSubscription
- Same loading skeleton and error state pattern as player room

## Tests (14)
- Admin page: loading skeleton, no creator hash error, room name/mode display, number grid rendering, addNumber call, disabled drawn numbers, automatic mode draw button, automatic drawNumber call, all-drawn message (9)
- ManualDrawPanel: column headers, all 75 buttons, disabled drawn, click callback, title (5)

## Done Definition
- Admin page verifies creator auth
- Manual mode shows clickable number grid
- 14 tests passing
- npm run build succeeds
