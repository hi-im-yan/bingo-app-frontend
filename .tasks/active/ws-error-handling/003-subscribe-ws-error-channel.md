# Task 03: Subscribe to WS Error Channel

**Status**: done
**Assignee**: Opus

## What was done

- Added `WsErrorResponse` type and `onServerError` callback to `useStompClient`
- Subscribed to `/user/queue/errors` inside `onConnect` callback (auto-subscribes on connect/reconnect)
- Piped `onServerError` through `useRoomSubscription` to page components
- Admin and player pages now handle `onServerError` with i18n-resolved toast messages

## Files changed

- `hooks/use-stomp-client.ts` — `WsErrorResponse` type, `onServerError` option, `/user/queue/errors` subscription
- `hooks/use-room-subscription.ts` — pass-through `onServerError`
- `app/[locale]/room/[code]/admin/page.tsx` — `handleServerError` callback
- `app/[locale]/room/[code]/page.tsx` — `handleServerError` callback
