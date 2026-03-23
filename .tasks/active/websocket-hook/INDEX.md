# F2.1 — WebSocket Hook

**Status:** blocked
**Blocked by:** F0.1 (tooling-setup), F0.5 (types-and-api-client)
**Branch:** feature/websocket-hook

## Description
Custom hook `useStompClient` for STOMP over SockJS connection. Manages connection lifecycle (connect, subscribe, disconnect on unmount). Reconnection logic. Typed message handling (receives RoomDTO). Unit tests.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Write tests for useStompClient hook | ready | — | Logic Writer |
| 002 | Implement useStompClient hook | ready | 001 | Logic Writer |
| 003 | Add reconnection logic | ready | 002 | Logic Writer |

## Decisions
- SockJS + @stomp/stompjs (same libraries, clean implementation)
- Hook returns: { connected, subscribe, publish, disconnect }
- Typed generics for message payloads
