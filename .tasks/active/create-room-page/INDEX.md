# F1.2 — Create Room Page

**Status:** done
**Blocked by:** F0.2 (shadcn-ui-setup), F0.3 (design-system), F0.4 (i18n-setup), F0.5 (types-and-api-client)
**Branch:** feature/create-room-page

## Description
Form with room name (required), description (optional), draw mode selector (MANUAL/AUTOMATIC). Zod validation. POST to backend, store creatorHash in localStorage. Redirect to admin on success. Error handling (409 name conflict, 400 validation). i18n.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design create room form layout | done | — | Designer |
| 002 | Build form with Zod validation | done | 001 | Component Builder |
| 003 | Wire API call + localStorage + redirect | done | 002 | Logic Writer |
| 004 | Add i18n translations | done | 002 | Component Builder |

## Decisions
- Zod for form validation
- react-hook-form + zodResolver for form state management
- Draw mode selector as toggle buttons (not radio or select)
- 409 conflict shown inline on name field
- 5 tests covering form rendering, validation, mode selection, submission, conflict handling
