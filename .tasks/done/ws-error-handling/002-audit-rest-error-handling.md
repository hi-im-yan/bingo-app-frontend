# Task 02: Audit REST Error Handling

**Status**: done
**Assignee**: Opus

## What was done

Audited all REST API call sites. Findings:

- `BingoApiError` only carried `status` + `message`, dropped `code` and `fields`
- `ApiError` type was missing `code` and `fields` to match backend `ErrorResponse`
- Create room: checked `status === 409` instead of `code === "ROOM_NAME_TAKEN"`
- Join/player room: checked `status === 404` instead of `code === "ROOM_NOT_FOUND"`
- `getPlayers()`: silently swallowed all errors with `.catch(() => [])`
- Delete room: generic toast only — acceptable

## Files reviewed

- `lib/api.ts`
- `lib/types.ts`
- `app/[locale]/create/page.tsx`
- `app/[locale]/join/page.tsx`
- `app/[locale]/room/[code]/page.tsx`
- `app/[locale]/room/[code]/admin/page.tsx`
- `components/delete-room-button.tsx`
