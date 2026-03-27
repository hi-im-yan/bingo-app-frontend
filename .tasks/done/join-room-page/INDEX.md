# F1.3 — Join Room Page

**Status:** done
**Blocked by:** F0.2 (shadcn-ui-setup), F0.3 (design-system), F0.4 (i18n-setup), F0.5 (types-and-api-client)
**Branch:** feature/join-room-page

## Description
Input for session code (6-char). Client-side format validation. GET room from backend to verify existence. Navigate to player room on success. 404 handling. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design join room layout | done | — | Designer |
| 002 | Build join form with validation | done | 001 | Component Builder |
| 003 | Wire API verification + navigation | done | 002 | Logic Writer |
| 004 | Add i18n translations | done | 002 | Component Builder |

## Decisions
- Uppercase monospace input, 6-char limit
- API verification (GET room) before navigating to player room
- 404 shown inline, not as page navigation
- 5 tests covering rendering, input formatting, verification, navigation, 404 handling
