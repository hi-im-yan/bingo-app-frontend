# F2.2 — Player Room

**Status:** blocked
**Blocked by:** F2.1 (websocket-hook), F0.3 (design-system), F0.4 (i18n-setup)
**Branch:** feature/player-room

## Description
Live view of drawn numbers via WebSocket subscription. Current number display (big, prominent). Previous number. All drawn numbers grouped by B/I/N/G/O columns, sorted ascending. drawMode label shown. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design player room layout | ready | — | Designer |
| 002 | Build DrawnNumbersBoard component | ready | 001 | Component Builder |
| 003 | Build CurrentNumber display component | ready | 001 | Component Builder |
| 004 | Wire WebSocket subscription + state | ready | 002, 003 | Logic Writer |
| 005 | Add i18n translations | ready | 002 | Component Builder |

## Decisions
- DrawnNumbersBoard is reusable (shared between player and admin views)
- CurrentNumber component shows letter + number (e.g. "N-42")
