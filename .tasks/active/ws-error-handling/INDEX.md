# Feature: WebSocket Error Feedback

**Status**: ready
**Blocked by feature**: —
**Branch**: TBD

## Description

When the backend throws an error in response to a STOMP command (draw, tiebreak, etc.), the frontend has no feedback — the UI freezes with no indication of what went wrong. Need to subscribe to the appropriate backend error channel and surface errors as toasts so users aren't left waiting.

## Investigation needed

- Check backend error handling: does it use `@MessageExceptionHandler` → `/user/queue/errors`, send error responses on the same topic, or use STOMP ERROR frames?
- Determine if `/user/queue/errors` works without an authenticated principal (creator uses X-Creator-Hash, players are unauthenticated)
- If user-queue doesn't work, consider a room-scoped error topic like `/room/{code}/errors`

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| F01 | Investigate backend error handling pattern | ready | — | — |
| F02 | Subscribe to error channel in useStompClient or useRoomSubscription | blocked | F01 | — |
| F03 | Surface errors as toasts + reset pending UI state | blocked | F02 | — |

## Scope

This is a general feature — applies to all WS commands (draw, correct, tiebreak, join), not just tiebreaker.
