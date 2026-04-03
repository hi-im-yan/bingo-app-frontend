# Feature: Backend Error Feedback

**Status**: in-progress
**Blocked by feature**: —
**Branch**: feature/ws-error-handling

## Description

When the backend returns an error — whether via REST (HTTP 500, 4xx) or WebSocket (STOMP command rejection) — the frontend often has no user-facing feedback. The UI freezes or silently fails, leaving users waiting with no indication of what went wrong.

## Investigation needed

- **WS**: Check backend error handling — `@MessageExceptionHandler` → `/user/queue/errors`, error responses on the same topic, or STOMP ERROR frames? Does `/user/queue/errors` work without an authenticated principal?
- **REST**: Audit `lib/api.ts` for unhandled error paths — are 500s and unexpected 4xx surfaced to the user or swallowed?

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 01| Investigate backend WS error handling pattern | done | — | Opus |
| 02| Audit REST error handling in api.ts and page-level catch blocks | done | — | Opus |
| 03| Subscribe to WS error channel in useStompClient | done | 01| Opus |
| 04| Add error code → i18n toast mapping + fix REST error gaps | done | 02| Opus |
| 05| Surface errors as toasts + reset pending UI state | done | 03, 04 | Opus |

## Scope

General feature — applies to all backend interactions (REST and WS), not tied to any specific feature.
