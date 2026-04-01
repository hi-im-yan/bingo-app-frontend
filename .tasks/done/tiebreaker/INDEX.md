# Feature: Tiebreaker (Frontend)

**Status**: ready
**Blocked by feature**: —
**Branch**: feature/tiebreaker

## Description

When multiple players get BINGO simultaneously in automatic rooms, the admin can start a tiebreaker. Each contestant draws a random number from the undrawn pool — highest wins. Numbers are ephemeral (returned to pool after tiebreaker ends). Both admin and players see the tiebreaker in real-time.

## Backend Contract

### WS Send — `/app/start-tiebreak`
```json
{ "session-code": "A3X9K2", "creator-hash": "uuid", "player-count": 3 }
```

### WS Send — `/app/tiebreak-draw`
```json
{ "session-code": "A3X9K2", "creator-hash": "uuid", "slot": 1 }
```

### WS Subscribe — `/room/{sessionCode}/tiebreak`
```json
{
  "status": "STARTED | IN_PROGRESS | FINISHED",
  "playerCount": 3,
  "draws": [{ "slot": 1, "number": 42, "label": "N-42" }],
  "winnerSlot": 3
}
```

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 01 | Types + hook (TiebreakDTO, forms, WS send/subscribe) | done | — | Logic Writer |
| 02 | Tiebreaker overlay component (draws display + winner animation) | done | — | Component Builder |
| 03 | Admin tiebreaker panel (start button, slot draw buttons) | done | — | Component Builder |
| 04 | Wire overlay into player + admin pages | done | — | Component Builder |
| 05 | i18n translations (pt + en) | done | — | Component Builder |

## Decisions
- Tiebreaker button only in AUTOMATIC rooms
- Numbered slots (Draw 1, Draw 2...) instead of player names — supports shared devices
- Player count range: 2–6
- No ties within tiebreaker — all numbers are unique
- Player count: minimum 2, no upper limit
- Numbers are ephemeral — not added to drawnNumbers, returned to pool after tiebreaker
- Backend owns random draw logic — frontend just sends commands
