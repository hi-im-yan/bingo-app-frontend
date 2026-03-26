# F2.3 — Admin Panel (Manual Mode)

**Status:** done
**Blocked by:** F2.1 (websocket-hook), F2.2 (player-room), F0.3 (design-system), F0.4 (i18n-setup)
**Branch:** feature/admin-panel

## Description
Admin page at /room/[code]/admin. Verifies creator auth via localStorage hash. For MANUAL mode: clickable number grid (1-75) in B/I/N/G/O columns, drawn numbers disabled. Publishes via STOMP to `/app/add-number`. Reuses DrawnNumbersBoard and CurrentNumber from player room. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Build admin page with creator auth check | done | — | Logic Writer |
| 002 | Build ManualDrawPanel component | done | 001 | Component Builder |
| 003 | Wire STOMP publish to /app/add-number | done | 002 | Logic Writer |
| 004 | Add i18n translations | done | 002 | Component Builder |

## Decisions
- Single admin page checks drawMode and renders Manual or Automatic UI (no separate routes)
- ManualDrawPanel: button grid not BingoBall — buttons need click/disabled states
- No confirmation dialog for manual draws (simplicity for elderly users — tap to draw)
- Creator auth: if no creatorHash in localStorage, show error page
- 9 admin page tests, 5 ManualDrawPanel tests
