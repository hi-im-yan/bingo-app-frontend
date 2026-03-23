# F2.4 — Admin Panel (Automatic Mode)

**Status:** blocked
**Blocked by:** F2.1 (websocket-hook), F2.2 (player-room), F0.3 (design-system), F0.4 (i18n-setup)
**Branch:** feature/admin-panel-automatic

## Description
Single "Draw Next Number" button. Publishes via STOMP to `/app/draw-number`. Reuses DrawnNumbersBoard from player room. Button disabled when all 75 numbers drawn. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design admin automatic mode layout | ready | — | Designer |
| 002 | Build DrawNextButton component | ready | 001 | Component Builder |
| 003 | Wire STOMP publish to /app/draw-number | ready | 002 | Logic Writer |
| 004 | Add i18n translations | ready | 002 | Component Builder |

## Decisions
- Simpler UI than manual mode — just a button + drawn numbers board
- Disable button when drawnNumbers.length === 75
