# F01 — Types + Hook Extensions for Tiebreaker

## What to build
Add TiebreakDTO types, WebSocket form types, and extend `useRoomSubscription` with tiebreaker actions (startTiebreak, tiebreakDraw) and subscription (onTiebreakUpdate).

## Acceptance Criteria
- [ ] `TiebreakDTO`, `TiebreakDrawEntry`, `TiebreakStatus` types in `lib/types.ts`
- [ ] `StartTiebreakForm`, `TiebreakDrawForm` types in `lib/types.ts`
- [ ] `startTiebreak(creatorHash, playerCount)` action in hook
- [ ] `tiebreakDraw(creatorHash, slot)` action in hook
- [ ] `onTiebreakUpdate` callback fires when `/room/{sessionCode}/tiebreak` receives a message
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `lib/types.ts` | Add tiebreaker types |
| `hooks/use-room-subscription.ts` | Add tiebreaker actions and subscription |
| `hooks/__tests__/use-room-subscription.test.ts` | Tests for tiebreaker actions and subscription |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `lib/types.ts` | Existing DTO and form patterns (CorrectNumberForm, NumberCorrectionDTO) |
| `hooks/use-room-subscription.ts` | `correctNumber` action pattern, `onCorrection`/`onPlayerJoin` subscription pattern |
| `hooks/__tests__/use-room-subscription.test.ts` | Test patterns for actions and subscriptions |

### Implementation Details

**Types** (`lib/types.ts`):
```typescript
export type TiebreakStatus = "STARTED" | "IN_PROGRESS" | "FINISHED";

export interface TiebreakDrawEntry {
  slot: number;
  number: number;
  label: string;
}

export interface TiebreakDTO {
  status: TiebreakStatus;
  playerCount: number;
  draws: TiebreakDrawEntry[];
  winnerSlot?: number;
}

export interface StartTiebreakForm {
  "session-code": string;
  "creator-hash": string;
  "player-count": number;
}

export interface TiebreakDrawForm {
  "session-code": string;
  "creator-hash": string;
  slot: number;
}
```

**Hook** (`hooks/use-room-subscription.ts`):
- Add `onTiebreakUpdate?: (tiebreak: TiebreakDTO) => void` to options
- Add `startTiebreak: (creatorHash: string, playerCount: number) => void` to return type
- Add `tiebreakDraw: (creatorHash: string, slot: number) => void` to return type
- `startTiebreak` publishes to `/app/start-tiebreak` with `StartTiebreakForm` payload
- `tiebreakDraw` publishes to `/app/tiebreak-draw` with `TiebreakDrawForm` payload
- Subscribe to `/room/${sessionCode}/tiebreak` when `onTiebreakUpdate` is provided (same pattern as `onCorrection`)

### Conventions
- Kebab-case keys in WebSocket payloads
- `useCallback` for memoized actions
- `useEffect` with cleanup for subscriptions
- Parse message body with `JSON.parse`, call `onError` on parse failure

## TDD Sequence
1. Write tests for `startTiebreak` publish payload
2. Write tests for `tiebreakDraw` publish payload
3. Write tests for `/tiebreak` subscription (subscribes when callback provided, doesn't when omitted, parses TiebreakDTO)
4. Implement types in `lib/types.ts`
5. Implement hook changes — make tests pass

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
