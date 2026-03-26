# F4.1 — Error & Loading States

**Status:** ready
**Blocked by:** — (all dependencies done)
**Branch:** feature/error-loading-states

## Description
Global error boundary. Loading skeletons for room data. Toast/notification system for errors (API failures, WS disconnects). Offline/reconnection indicator.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design error and loading state patterns | ready | — | Designer |
| 002 | Build global error boundary | ready | — | Component Builder |
| 003 | Build loading skeletons | ready | 001 | Component Builder |
| 004 | Build toast/notification system | ready | 001 | Component Builder |
| 005 | Add reconnection indicator to WS hook | ready | — | Logic Writer |

## Decisions
- Error boundary at layout level catches unhandled errors
- Skeletons match the shape of actual content (not generic spinners)
- Toast for transient errors, inline for persistent errors

## Notes
- Loading skeletons already exist on player room and admin page (basic implementation)
- ConnectionStatus component already shows warning bar when WebSocket disconnected
- This phase focuses on polishing and adding missing error handling (error boundary, toasts)
