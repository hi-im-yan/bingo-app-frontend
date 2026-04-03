# Task 04: Error Code i18n Mapping + REST Error Fixes

**Status**: done
**Assignee**: Opus

## What was done

### Types
- Added `FieldError` and `ErrorResponse` interfaces to `lib/types.ts`
- Updated `BingoApiError` to carry `code` and `fields`
- Updated `request()` to parse and pass `code`/`fields` from backend response

### i18n error codes
- Added 16 backend error codes to `messages/en.json` and `messages/pt.json`
- Pages use `tErrors.has(error.code)` to resolve code → i18n message, falling back to `error.message`

### REST error handling fixes
- Create room: uses `error.code === "ROOM_NAME_TAKEN"` + handles `VALIDATION_ERROR` with per-field errors
- Join page: uses `error.code === "ROOM_NOT_FOUND"`
- Player room: uses `error.code === "ROOM_NOT_FOUND"`
- Admin room: uses `error.code === "ROOM_NOT_FOUND"`, `getPlayers()` now toasts on non-404 errors instead of silently failing

## Files changed

- `lib/types.ts`
- `lib/api.ts`
- `messages/en.json`
- `messages/pt.json`
- `app/[locale]/create/page.tsx`
- `app/[locale]/join/page.tsx`
- `app/[locale]/room/[code]/page.tsx`
- `app/[locale]/room/[code]/admin/page.tsx`
