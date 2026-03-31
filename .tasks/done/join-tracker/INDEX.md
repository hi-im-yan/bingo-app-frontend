# Feature: Join Tracker

**Status**: ready
**Blocked by feature**: —
**Branch**: feature/join-tracker

## Description

Allow players to join rooms with a name. Track who's in the room with real-time updates. Player must enter a name before viewing the board. Admin sees a player list panel with live join notifications.

## Backend Contract

### REST — `GET /api/v1/room/{session-code}/players`
Creator-only (X-Creator-Hash required). Returns `PlayerDTO[]`.

### WS Send — `/app/join-room`
```json
{ "session-code": "A3X9K2", "player-name": "Alice" }
```
Constraints: non-blank, max 50 chars, unique per room.
Errors: `404` room not found, `409` name taken.

### WS Subscribe — `/room/{sessionCode}/players`
Receives `PlayerDTO` on each new join:
```json
{ "name": "Alice", "joinDateTime": "2026-03-28T12:00:00" }
```

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Types + API + hook (PlayerDTO, JoinRoomForm, getPlayers, joinRoom, /players sub) | done | — | Logic Writer |
| 002 | Player name form (gate room view, zod validation, send join-room) | done | — | Component Builder |
| 003 | Player list panel in admin (REST load + real-time updates) | done | — | Component Builder |
| 004 | i18n translations (pt + en) | done | — | Component Builder |

## Decisions
- Player name form gates the room view — must enter name before seeing the board
- Name stored in sessionStorage (per-tab, not persistent)
- Admin gets player list panel with real-time join updates
- Toast on admin page when a new player joins
- 409 (name taken) handled inline on the form
