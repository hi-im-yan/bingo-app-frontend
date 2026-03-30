# Feature: Number Draw Popup

**Status**: ready
**Blocked by feature**: —
**Branch**: feature/draw-popup

## Description

Full-screen overlay popup that shows for 1 second when a number is drawn. Large bingo ball with label (e.g. "B-7") in big text, drop+spin animation, darkened backdrop. Appears on both player and admin pages. Designed for elderly visibility — must be attention-grabbing even with peripheral vision. aria-live announcement for screen readers.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | DrawPopup component (overlay, animated ball, auto-dismiss, aria-live, CSS keyframes) | done | — | Component Builder |
| 002 | Wire popup into player + admin pages | done | — | Component Builder |
| 003 | i18n translations (pt + en) for aria announcement | done | — | Component Builder |

## Decisions
- Backdrop uses bg-black/50 (stronger than dialog's bg-black/10) for elderly visibility
- Ball size: ~160px with ~3rem bold label text
- CSS-only animations — drop+spin in, fade out
- 1s display time, no manual dismiss, purely timed
- Reuses existing BingoBall color tokens
- aria-live="assertive" for screen reader announcement
