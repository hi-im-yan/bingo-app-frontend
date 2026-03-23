# F3.1 — Room Sharing

**Status:** blocked
**Blocked by:** F2.3 (admin-panel-manual)
**Branch:** feature/room-sharing

## Description
Invite link generation + copy to clipboard. QR code display via GET `/api/v1/room/{session-code}/qrcode`. Shareable URL routes player directly to room. i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design sharing UI (link + QR section) | ready | — | Designer |
| 002 | Build ShareRoom component | ready | 001 | Component Builder |
| 003 | Wire QR code fetch + clipboard API | ready | 002 | Logic Writer |
| 004 | Add i18n translations | ready | 002 | Component Builder |

## Decisions
- QR code is a PNG from backend — display as <img> with the endpoint URL as src
- Copy to clipboard uses navigator.clipboard API with fallback
