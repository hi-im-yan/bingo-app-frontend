# 001 — Types, API Client, and Hook Extensions

## What to build
Add PlayerDTO and JoinRoomForm types, a getPlayers REST method, and extend useRoomSubscription with joinRoom action and /players subscription.

## Acceptance Criteria
- [ ] `PlayerDTO` and `JoinRoomForm` interfaces in `lib/types.ts`
- [ ] `api.getPlayers(sessionCode)` returns `PlayerDTO[]` (requires X-Creator-Hash)
- [ ] `joinRoom(playerName)` action published to `/app/join-room`
- [ ] `onPlayerJoin` callback fires when `/room/{sessionCode}/players` receives a message
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `lib/types.ts` | Add `PlayerDTO`, `JoinRoomForm` |
| `lib/api.ts` | Add `getPlayers` method |
| `hooks/use-room-subscription.ts` | Add `joinRoom` action, `onPlayerJoin` option + subscription |
| `hooks/__tests__/use-room-subscription.test.ts` | Tests for joinRoom and onPlayerJoin |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `lib/types.ts` | Existing DTO pattern (CorrectNumberForm, NumberCorrectionDTO) |
| `lib/api.ts` | `request<T>()` pattern, `getRoom` for authenticated GET |
| `hooks/use-room-subscription.ts` | `correctNumber` action pattern, `onCorrection` subscription pattern |

### Implementation Details

**Types** (`lib/types.ts`):
```typescript
export interface PlayerDTO {
  name: string;
  joinDateTime: string; // ISO datetime
}

export interface JoinRoomForm {
  "session-code": string;
  "player-name": string;
}
```

**API** (`lib/api.ts`):
```typescript
getPlayers: async (sessionCode: string): Promise<PlayerDTO[]> => {
  return request<PlayerDTO[]>(`/api/v1/room/${sessionCode}/players`, {
    sessionCode, // triggers X-Creator-Hash header
  });
}
```

**Hook** (`hooks/use-room-subscription.ts`):
- Add `onPlayerJoin?: (player: PlayerDTO) => void` to options
- Add `joinRoom: (playerName: string) => void` to return type
- `joinRoom` publishes to `/app/join-room` with `{ "session-code": sessionCode, "player-name": playerName }`
- Subscribe to `/room/${sessionCode}/players` when `onPlayerJoin` is provided (same pattern as `onCorrection`)

### Conventions
- Kebab-case keys in WebSocket payloads (`session-code`, `player-name`)
- `useCallback` for memoized actions
- `useEffect` with cleanup for subscriptions
- Parse message body with `JSON.parse`, call `onError` on parse failure

## TDD Sequence
1. Write tests for `joinRoom` publish payload
2. Write tests for `/players` subscription (subscribes when callback provided, doesn't when omitted, parses PlayerDTO)
3. Implement types in `lib/types.ts`
4. Implement `getPlayers` in `lib/api.ts`
5. Implement hook changes — make tests pass

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
