# 001 — next-intl Configuration

## What was built
Full i18n setup with next-intl for App Router. Locale routing via `[locale]` segment, middleware for detection, PT default / EN secondary.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| routing.ts | i18n/routing.ts | Locale list + default locale config |
| request.ts | i18n/request.ts | getRequestConfig with locale validation + dynamic message import |
| navigation.ts | i18n/navigation.ts | Exports Link, redirect, usePathname, useRouter from next-intl |
| middleware.ts | middleware.ts | next-intl middleware for locale routing |
| en.json | messages/en.json | English translations (common, home, createRoom, joinRoom, room, admin, errors) |
| pt.json | messages/pt.json | Portuguese translations (same structure) |

## Files MODIFIED
| File | Change |
|------|--------|
| app/[locale]/layout.tsx | NextIntlClientProvider wrapping, locale validation via hasLocale |

## Key Structure
- Locales: `["pt", "en"]`, default: `"pt"`
- Message keys: `common.*`, `home.*`, `createRoom.*`, `joinRoom.*`, `room.*`, `admin.*`, `errors.*`
- All pages under `app/[locale]/` for locale-aware routing
- `useTranslations("namespace")` in components

## Done Definition
- `/pt` and `/en` routes work
- All visible text uses translation keys
- npm run build succeeds
