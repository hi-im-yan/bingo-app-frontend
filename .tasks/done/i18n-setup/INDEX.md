# F0.4 — i18n Setup

**Status:** done
**Blocked by:** —
**Branch:** feature/i18n-setup

## Description
Install and configure next-intl with App Router. Set up routing middleware for locale detection. Create message files (pt.json, en.json). Wrap layout with NextIntlClientProvider. Define translation keys structure for all planned features.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Install next-intl and configure middleware | done | — | Logic Writer |
| 002 | Create message files with key structure | done | 001 | Logic Writer |
| 003 | Wrap layout and verify routing | done | 002 | Component Builder |

## Decisions
- next-intl: best App Router support, type-safe messages
- PT as default locale, EN as secondary
- Message keys organized by feature/page (e.g., home.createRoom, admin.drawNumber)
- `[locale]` segment in app/ routes, middleware.ts for locale detection
- i18n/routing.ts, i18n/request.ts, i18n/navigation.ts for centralized config
