# 001 — Types + WebSocket Hook Support for Number Correction

## What to build
Add the `CorrectNumberForm` and `NumberCorrectionDTO` types. Extend `useRoomSubscription` with a `correctNumber()` send function and a `/corrections` topic subscription that fires an `onCorrection` callback.

## Acceptance Criteria
- [ ] `CorrectNumberForm` type exists in `lib/types.ts`
- [ ] `NumberCorrectionDTO` type exists in `lib/types.ts`
- [ ] `useRoomSubscription` exposes a `correctNumber(creatorHash, newNumber)` function
- [ ] `useRoomSubscription` accepts an `onCorrection` callback option
- [ ] When connected, hook subscribes to `/room/{sessionCode}/corrections`
- [ ] When a correction message arrives, `onCorrection` is called with parsed `NumberCorrectionDTO`
- [ ] When `onCorrection` is not provided, no subscription to `/corrections` is made
- [ ] All existing tests still pass
- [ ] New tests cover: correctNumber publish, corrections subscription, onCorrection callback
- [ ] `npm test` passes

## Technical Spec

### Files to MODIFY
| File | Path | Change |
|------|------|--------|
| `types.ts` | `lib/types.ts` | Add `CorrectNumberForm` and `NumberCorrectionDTO` interfaces |
| `use-room-subscription.ts` | `hooks/use-room-subscription.ts` | Add `correctNumber` function, `/corrections` subscription, `onCorrection` option |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `hooks/use-room-subscription.ts` | Existing `addNumber`/`drawNumber` pattern for send functions, existing subscription pattern |
| `hooks/use-stomp-client.ts` | `subscribe` and `publish` API signatures |
| `hooks/__tests__/use-room-subscription.test.ts` | Test patterns for hook — mock setup, subscribe/publish assertions |
| `lib/types.ts` | Existing type patterns (`AddNumberForm`, `DrawNumberForm`) |

### New Types

```typescript
// In lib/types.ts

export interface CorrectNumberForm {
  "session-code": string;
  "creator-hash": string;
  "new-number": number;
}

export interface NumberCorrectionDTO {
  oldNumber: number;
  oldLabel: string;
  newNumber: number;
  newLabel: string;
  message: string;
}
```

### Hook Changes

**Options interface** — add optional `onCorrection`:
```typescript
interface UseRoomSubscriptionOptions {
  sessionCode: string;
  initialRoom?: RoomDTO;
  onError?: (error: string) => void;
  onReconnect?: () => void;
  onCorrection?: (correction: NumberCorrectionDTO) => void;  // NEW
}
```

**Return interface** — add `correctNumber`:
```typescript
interface UseRoomSubscriptionReturn {
  room: RoomDTO | null;
  connected: boolean;
  reconnecting: boolean;
  addNumber: (creatorHash: string, number: number) => void;
  drawNumber: (creatorHash: string) => void;
  correctNumber: (creatorHash: string, newNumber: number) => void;  // NEW
}
```

**`correctNumber` function** — follows same pattern as `addNumber`:
```typescript
const correctNumber = useCallback(
  (creatorHash: string, newNumber: number) => {
    const payload: CorrectNumberForm = {
      "session-code": sessionCode,
      "creator-hash": creatorHash,
      "new-number": newNumber,
    };
    publish("/app/correct-number", JSON.stringify(payload));
  },
  [sessionCode, publish],
);
```

**`/corrections` subscription** — add a second `useEffect` that subscribes only when `onCorrection` is provided:
```typescript
useEffect(() => {
  if (!connected || !sessionCode || !onCorrection) return;

  const unsubscribe = subscribe(`/room/${sessionCode}/corrections`, (message) => {
    try {
      const correction: NumberCorrectionDTO = JSON.parse(message.body);
      onCorrection(correction);
    } catch {
      onError?.("Failed to parse correction update");
    }
  });

  return () => {
    unsubscribe?.();
  };
}, [connected, sessionCode, subscribe, onCorrection, onError]);
```

### Conventions (from project CLAUDE.md)
- TypeScript strict mode — all types explicit
- `"use client"` directive on hook files
- Hooks in `hooks/` directory, types in `lib/types.ts`
- Tests use vitest + @testing-library/react
- TDD: write tests first, then implementation
- Do NOT run test/lint manually — hooks handle it

## TDD Sequence
1. Write tests for `CorrectNumberForm` and `NumberCorrectionDTO` types (import assertions)
2. Write tests for `correctNumber` publish — assert it calls `publish` with correct destination and payload
3. Write tests for `/corrections` subscription — assert subscribe is called with correct topic when `onCorrection` provided
4. Write tests for `onCorrection` callback — assert it's called with parsed `NumberCorrectionDTO`
5. Write test that `/corrections` subscription is NOT created when `onCorrection` is omitted
6. Implement types in `lib/types.ts`
7. Implement hook changes in `use-room-subscription.ts`
8. Run `npm test` — all tests must pass

## Done Definition
All acceptance criteria checked. Tests green. No TypeScript errors. Existing tests unbroken.
