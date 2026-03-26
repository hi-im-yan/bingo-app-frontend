# F2.1 — WebSocket Hook

**Status:** done
**Blocked by:** F0.1 (tooling-setup), F0.5 (types-and-api-client)
**Branch:** feature/websocket-hook

## Description
Custom hook `useStompClient` for STOMP over SockJS connection. Manages connection lifecycle (connect, subscribe, disconnect on unmount). Reconnection logic. Higher-level `useRoomSubscription` hook for room-specific subscriptions and publishing.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Write tests for useStompClient hook | done | — | Logic Writer |
| 002 | Implement useStompClient hook | done | 001 | Logic Writer |
| 003 | Implement useRoomSubscription hook | done | 002 | Logic Writer |
| 004 | Add reconnection logic | done | 002 | Logic Writer |

## Decisions
- SockJS + @stomp/stompjs — SockJS needs http:// URL (not ws://), handles upgrade internally
- toSockJsUrl() normalizes wss:// → https:// and ws:// → http:// as safety net
- Two-layer hooks: useStompClient (low-level) + useRoomSubscription (high-level)
- useRoomSubscription subscribes to /room/{sessionCode}, returns room state + addNumber/drawNumber publishers
- 6 tests for useRoomSubscription
