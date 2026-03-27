# F1.1 — Home Page

**Status:** done
**Blocked by:** F0.3 (design-system), F0.4 (i18n-setup)
**Branch:** feature/home-page

## Description
Landing page with two CTAs: Create Room / Join Room. App branding and layout using design system. i18n for all labels. Responsive mobile-first.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design home page layout | done | — | Designer |
| 002 | Build home page component | done | 001 | Component Builder |
| 003 | Add i18n translations | done | 002 | Component Builder |

## Decisions
- Create Room is a link styled as button with inline Tailwind (NOT buttonVariants — server component boundary)
- Join Room inline form on home page + standalone /join page
- JoinRoomForm is a client component (form state), home page is server component
- 5 tests covering rendering, navigation, form behavior
