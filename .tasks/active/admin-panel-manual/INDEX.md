# F2.3 — Admin Panel (Manual Mode)

**Status:** blocked
**Blocked by:** F2.1 (websocket-hook), F2.2 (player-room), F0.3 (design-system), F0.4 (i18n-setup)
**Branch:** feature/admin-panel-manual

## Description
Letter selector (B/I/N/G/O). Number grid (1-75) with drawn numbers disabled/highlighted. Confirmation dialog before publishing. Publishes via STOMP to `/app/add-number`. Reuses DrawnNumbersBoard from player room. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design admin manual mode layout | ready | — | Designer |
| 002 | Build LetterSelector component | ready | 001 | Component Builder |
| 003 | Build NumberGrid component | ready | 001 | Component Builder |
| 004 | Build confirmation dialog + publish logic | ready | 002, 003 | Logic Writer |
| 005 | Add i18n translations | ready | 002 | Component Builder |

## Decisions
- Admin page checks drawMode and renders Manual or Automatic UI accordingly
- NumberGrid disables already-drawn numbers
- Confirmation dialog prevents accidental draws
