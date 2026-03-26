# F4.2 — Responsive & Accessibility

**Status:** ready
**Blocked by:** — (F4.1 recommended first but not hard blocker)
**Branch:** feature/responsive-a11y

## Description
Mobile-first responsive design audit. Keyboard navigation for number grid. ARIA labels on interactive elements. Screen reader support for drawn numbers announcements.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Responsive audit across all pages | ready | — | Component Builder |
| 002 | Keyboard navigation for NumberGrid | ready | — | Logic Writer |
| 003 | ARIA labels + screen reader support | ready | — | Component Builder |

## Decisions
- Mobile-first: bingo is commonly played on phones
- Number grid: arrow key navigation, Enter to select
- Live region for drawn number announcements (screen readers)

## Notes
- Base design already mobile-first (max-w-lg, px-4, 44px+ touch targets)
- This phase is an audit pass to catch gaps and add keyboard/screen reader support
