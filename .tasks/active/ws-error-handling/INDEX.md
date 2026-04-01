# Feature: Backend Error Feedback

**Status**: ready
**Blocked by feature**: —
**Branch**: TBD

## Description

When the backend returns an error — whether via REST (HTTP 500, 4xx) or WebSocket (STOMP command rejection) — the frontend often has no user-facing feedback. The UI freezes or silently fails, leaving users waiting with no indication of what went wrong.

## Investigation needed

- **WS**: Check backend error handling — `@MessageExceptionHandler` → `/user/queue/errors`, error responses on the same topic, or STOMP ERROR frames? Does `/user/queue/errors` work without an authenticated principal?
- **REST**: Audit `lib/api.ts` for unhandled error paths — are 500s and unexpected 4xx surfaced to the user or swallowed?

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| F01 | Investigate backend WS error handling pattern | ready | — | — |
| F02 | Audit REST error handling in api.ts and page-level catch blocks | ready | — | — |
| F03 | Subscribe to WS error channel in useStompClient or useRoomSubscription | blocked | F01 | — |
| F04 | Add global/consistent REST error toast for unhandled 5xx/4xx | blocked | F02 | — |
| F05 | Surface errors as toasts + reset pending UI state | blocked | F03, F04 | — |

## Scope

General feature — applies to all backend interactions (REST and WS), not tied to any specific feature.
