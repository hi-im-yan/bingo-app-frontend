# Task 05: Surface Errors as Toasts + Reset Pending UI State

**Status**: done
**Assignee**: Opus

## What was done

Covered by tasks 03 and 04. Both WS server errors and REST errors now surface as i18n toasts. The admin page resets tiebreak pending state on server errors.

## Error flow

1. **WS server errors** → `/user/queue/errors` → `onServerError` → resolve `error.code` via i18n → `toast.error()`
2. **WS transport errors** → `onStompError`/`onWebSocketError` → `onError` → `toast.error()`
3. **REST errors** → `BingoApiError` with `code`/`fields` → page-level catch → inline or toast depending on context
