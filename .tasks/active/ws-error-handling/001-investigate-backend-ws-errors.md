# Task 01: Investigate Backend WS Error Handling Pattern

**Status**: done
**Assignee**: Opus

## What was done

Reviewed backend FRONTEND_API.md documentation. Key findings:

- Backend uses `@MessageExceptionHandler` → sends errors to `/user/queue/errors` personal queue
- Error payload is `ErrorResponse` JSON: `{ status, code, message }`
- Works without authenticated principal (SockJS session-based)
- All error codes documented in the Error Catalog section

## Files reviewed

- Backend: `docs/FRONTEND_API.md` (via GitHub API)
