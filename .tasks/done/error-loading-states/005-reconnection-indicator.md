# 005 — Add Reconnection Indicator to WS Hook

**Status:** ready
**Assignee:** Logic Writer
**Blocked by:** —

## Objective
Enhance the WebSocket connection status to distinguish between "disconnected" and "reconnecting" states.

## Implementation

### Step 1: Expose reconnection state from `useStompClient`
**File:** `hooks/use-stomp-client.ts`
- Add a `reconnecting` boolean to the return type
- Set `reconnecting = true` when disconnected but STOMP client has `reconnectDelay` configured (i.e., it will try to reconnect)
- Set `reconnecting = false` when connected or when client is deactivated
- Track with a `wasConnected` ref to know if this is a reconnection (vs initial connection)

### Step 2: Update `useRoomSubscription` return type
**File:** `hooks/use-room-subscription.ts`
- Pass through `reconnecting` from `useStompClient`

### Step 3: Enhance `ConnectionStatus` component
**File:** `components/connection-status.tsx`
- Accept `reconnecting` prop in addition to `connected`
- States:
  - `connected`: render nothing (hidden)
  - `!connected && reconnecting`: warning bar with pulse animation, "Reconnecting..." text
  - `!connected && !reconnecting`: warning bar, static, "Connection lost" text

### Step 4: Update pages using ConnectionStatus
- Player room and admin page: pass `reconnecting` prop

## i18n
- `errors.reconnecting` — "Reconnecting..."
- `errors.connectionLost` — already exists

## Testing
- Verify reconnecting state shows pulsing bar
- Verify disconnected (no reconnect) shows static bar
- Verify connected hides the bar
