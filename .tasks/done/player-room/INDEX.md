# F2.2 — Player Room

**Status:** done
**Blocked by:** F2.1 (websocket-hook), F0.3 (design-system), F0.4 (i18n-setup)
**Branch:** feature/player-room

## Description
Live view of drawn numbers via WebSocket subscription. Current number display (big, prominent). All drawn numbers grouped by B/I/N/G/O columns. Connection status indicator. drawMode label shown. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design player room layout | done | — | Designer |
| 002 | Build DrawnNumbersBoard component | done | 001 | Component Builder |
| 003 | Build CurrentNumber display component | done | 001 | Component Builder |
| 004 | Build ConnectionStatus component | done | — | Component Builder |
| 005 | Wire WebSocket subscription + state | done | 002, 003 | Logic Writer |
| 006 | Add i18n translations | done | 002 | Component Builder |

## Decisions
- DrawnNumbersBoard is reusable (shared between player and admin views)
- CurrentNumber shows letter + number (e.g. "N-42") as large BingoBall
- ConnectionStatus shows warning bar when WebSocket disconnected
- Loading skeleton on initial fetch, error state for 404
- 3 tests for CurrentNumber, 4 tests for DrawnNumbersBoard
