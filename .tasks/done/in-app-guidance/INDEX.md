# Feature: In-App Guidance

**Status**: ready
**Blocked by feature**: —
**Branch**: feature/in-app-guidance

## Description

App header with home button and help toggle (localStorage persisted). Contextual inline help text on all pages. Help auto-hides after first draw on room pages but can be toggled back on via header. Designed for first-time users and elderly players who need guidance on how to use the app.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | useHelpVisible hook (localStorage, state, toggleHelp, hideHelp) | done | — | Logic Writer |
| 002 | AppHeader component (home link, help toggle, layout integration) | done | — | Component Builder |
| 003 | HelpText component (conditional render wrapper, styled) | done | — | Component Builder |
| 004 | Help text on home + create + join pages | done | — | Component Builder |
| 005 | Help text on player + admin pages (with auto-hide on first draw) | done | — | Component Builder |
| 006 | i18n translations (pt + en) | done | — | Component Builder |

## Decisions
- Help default ON for first-time users, persisted in localStorage as `bingo-help-visible`
- Auto-hide after first draw on room pages (game started = user is oriented)
- User can toggle help back on via header button at any time
- Header is minimal — home icon + help toggle, no app title
- HelpText is inline, subtle styling (muted text, small font) — not modals or tooltips
- Uses locale-aware Link from @/i18n/navigation for home button
