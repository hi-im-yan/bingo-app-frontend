# F3.2 — Delete Room

**Status:** blocked
**Blocked by:** F2.3 (admin-panel-manual)
**Branch:** feature/delete-room

## Description
Delete button on admin panel (creator only). Confirmation dialog. DELETE to backend with X-Creator-Hash. Redirect to home on success. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Build delete button + confirmation dialog | ready | — | Component Builder |
| 002 | Wire DELETE API call + redirect | ready | 001 | Logic Writer |
| 003 | Add i18n translations | ready | 001 | Component Builder |

## Decisions
- Delete button only visible to creator (creatorHash in localStorage matches)
- Destructive action requires explicit confirmation dialog
