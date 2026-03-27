# F2.4 — Admin Panel (Automatic Mode)

**Status:** done
**Blocked by:** F2.1 (websocket-hook), F2.2 (player-room), F0.3 (design-system), F0.4 (i18n-setup)
**Branch:** feature/admin-panel

## Description
Part of the same admin page as F2.3. For AUTOMATIC mode: single "Draw Number" button. Publishes via STOMP to `/app/draw-number`. Shows "All numbers drawn!" when 75 numbers drawn. Reuses DrawnNumbersBoard and CurrentNumber. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Build AutomaticDrawPanel component | done | — | Component Builder |
| 002 | Wire STOMP publish to /app/draw-number | done | 001 | Logic Writer |
| 003 | Add i18n translations | done | 001 | Component Builder |

## Decisions
- Simpler UI than manual mode — just a button + drawn numbers board
- Disable replaced by "All numbers drawn!" message when drawnNumbers.length >= 75
- Implemented as feature/admin-panel branch (combined with F2.3, not separate branch)
- 3 AutomaticDrawPanel tests
