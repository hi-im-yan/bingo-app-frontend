# F1.3 — Join Room Page

**Status:** blocked
**Blocked by:** F0.2 (shadcn-ui-setup), F0.3 (design-system), F0.4 (i18n-setup), F0.5 (types-and-api-client)
**Branch:** feature/join-room-page

## Description
Input for session code (6-char). Client-side format validation. GET room from backend to verify existence. Navigate to player room on success. 404 handling. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design join room layout | ready | — | Designer |
| 002 | Build join form with validation | ready | 001 | Component Builder |
| 003 | Wire API verification + navigation | ready | 002 | Logic Writer |
| 004 | Add i18n translations | ready | 002 | Component Builder |

## Decisions
- Validate session code format (6 alphanumeric chars) before hitting API
