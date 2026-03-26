# F3.1 — Room Sharing

**Status:** done
**Blocked by:** F2.3 (admin-panel-manual)
**Branch:** feature/room-sharing

## Description
ShareRoomSection component on admin panel. QR code display via backend endpoint as `<img>` src. Session code display with copy-to-clipboard button. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Build ShareRoomSection component | done | — | Component Builder |
| 002 | Wire QR code image + clipboard API | done | 001 | Logic Writer |
| 003 | Add i18n translations | done | 001 | Component Builder |

## Decisions
- QR code is a PNG from backend — displayed as `<img>` with `api.getQrCodeUrl(sessionCode)` as src
- Copy to clipboard uses `navigator.clipboard.writeText` with "Copied!" feedback (2s timeout)
- Inline section on admin panel, not a dialog
- Implemented as feature/room-sharing branch (combined with F3.2)
- 4 tests for ShareRoomSection
