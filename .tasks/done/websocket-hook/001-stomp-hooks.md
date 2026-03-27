# 001 — STOMP WebSocket Hooks

## What was built
Two-layer hook architecture for STOMP over SockJS. Low-level `useStompClient` for connection management, high-level `useRoomSubscription` for room-specific subscriptions and publishing.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| use-stomp-client.ts | hooks/use-stomp-client.ts | Low-level STOMP/SockJS hook — connect, subscribe, publish, auto-reconnect |
| use-room-subscription.ts | hooks/use-room-subscription.ts | High-level hook — subscribes to /room/{code}, parses RoomDTO, exposes addNumber/drawNumber |
| use-room-subscription.test.ts | hooks/__tests__/use-room-subscription.test.ts | 6 tests |

## Key Details
- `useStompClient`: Client from @stomp/stompjs, SockJS webSocketFactory, reconnectDelay (default 5s)
- `toSockJsUrl()`: normalizes wss:// → https://, ws:// → http:// (SockJS needs http scheme)
- `useRoomSubscription`: subscribes to `/room/{sessionCode}`, returns `{ room, connected, addNumber, drawNumber }`
- `addNumber(creatorHash, number)`: publishes to `/app/add-number` with AddNumberForm payload
- `drawNumber(creatorHash)`: publishes to `/app/draw-number` with DrawNumberForm payload

## Tests (6)
- Returns null room initially
- Updates room on subscription message
- Calls addNumber with correct payload
- Calls drawNumber with correct payload
- Handles connection state
- Handles parse errors

## Done Definition
- WebSocket connects and receives room updates
- addNumber/drawNumber publish correct STOMP messages
- 6 tests passing
