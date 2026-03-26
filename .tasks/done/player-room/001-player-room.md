# 001 — Player Room Page

## What was built
Player view at `/room/[code]` with live WebSocket updates. Shows current number, drawn numbers board, connection status. Loading skeleton and 404 error state.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| page.tsx | app/[locale]/room/[code]/page.tsx | Client component — fetch room + WebSocket subscription |
| current-number.tsx | components/current-number.tsx | Large BingoBall with formatted label (e.g. "N-42") or waiting message |
| drawn-numbers-board.tsx | components/drawn-numbers-board.tsx | Grid of all 75 numbers in B/I/N/G/O columns, drawn highlighted |
| connection-status.tsx | components/connection-status.tsx | Warning bar when WebSocket disconnected |
| current-number.test.tsx | components/__tests__/current-number.test.tsx | 3 tests |
| drawn-numbers-board.test.tsx | components/__tests__/drawn-numbers-board.test.tsx | 4 tests |

## Key Details
- Initial room fetch via REST API, then WebSocket for live updates
- `displayRoom = room ?? initialRoom` — WebSocket room overrides initial fetch
- CurrentNumber: lg BingoBall + formatBingoLabel when number present, "Waiting for draw..." when null
- DrawnNumbersBoard: B/I/N/G/O columns, each number as sm BingoBall with drawn state, count "X of 75"
- ConnectionStatus: amber warning bar only shown when disconnected
- Reusable components shared with admin panel

## Tests (7)
- CurrentNumber: waiting message, shows number, shows label (3)
- DrawnNumbersBoard: empty message, drawn count, column headers, marks drawn numbers (4)

## Done Definition
- Player room renders with live updates via WebSocket
- 7 tests passing
- npm run build succeeds
