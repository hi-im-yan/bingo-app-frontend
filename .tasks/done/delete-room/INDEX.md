# F3.2 — Delete Room

**Status:** done
**Blocked by:** F2.3 (admin-panel-manual)
**Branch:** feature/room-sharing

## Description
Delete button on admin panel. Confirmation dialog (Base UI Dialog). DELETE to backend with X-Creator-Hash. Redirect to home on success. Error handling for failed delete. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Build DeleteRoomButton + confirmation dialog | done | — | Component Builder |
| 002 | Wire DELETE API call + redirect | done | 001 | Logic Writer |
| 003 | Add i18n translations | done | 001 | Component Builder |

## Decisions
- Destructive variant button at bottom of admin panel
- Dialog with title, description, cancel/confirm buttons
- Uses `useRouter` from `@/i18n/navigation` for locale-aware redirect to home
- Deleting state disables both buttons in dialog
- Error shown inline in dialog if delete fails
- Implemented in feature/room-sharing branch (combined with F3.1)
- 4 tests for DeleteRoomButton
