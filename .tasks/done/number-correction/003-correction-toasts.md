# 003 — Correction Toasts (Player + Admin)

## What to build
Subscribe to the `/corrections` WebSocket topic on both player and admin pages. Show a warning toast when a correction occurs, displaying the correction message (e.g. "GM changed N-42 to B-12"). Board state updates automatically via the existing `/room/{sessionCode}` subscription.

## Acceptance Criteria
- [ ] Player room page passes `onCorrection` callback to `useRoomSubscription`
- [ ] Admin page passes `onCorrection` callback to `useRoomSubscription`
- [ ] Correction triggers a warning toast with the correction message
- [ ] Toast uses `toast.warning()` from sonner
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | Path | Change |
|------|------|--------|
| `page.tsx` | `app/[locale]/room/[code]/page.tsx` | Add `onCorrection` callback that shows warning toast |
| `page.tsx` | `app/[locale]/room/[code]/admin/page.tsx` | Add `onCorrection` callback that shows warning toast |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `app/[locale]/room/[code]/page.tsx` | Existing `handleWsError` / `handleReconnect` callback pattern with `useCallback` |
| `app/[locale]/room/[code]/admin/page.tsx` | Same callback pattern |
| `hooks/use-room-subscription.ts` | `onCorrection` option shape (from task 001) |

### Implementation Details

**Player room page** — add callback and pass to hook:
```typescript
const handleCorrection = useCallback(
  (correction: NumberCorrectionDTO) => toast.warning(correction.message),
  [],
);

const { room, connected, reconnecting } = useRoomSubscription({
  sessionCode: params.code,
  initialRoom: initialRoom ?? undefined,
  onError: handleWsError,
  onReconnect: handleReconnect,
  onCorrection: handleCorrection,  // NEW
});
```

**Admin page** — same pattern:
```typescript
const handleCorrection = useCallback(
  (correction: NumberCorrectionDTO) => toast.warning(correction.message),
  [],
);

// Add onCorrection to existing useRoomSubscription call
const { room, connected, reconnecting, addNumber, drawNumber, correctNumber } = useRoomSubscription({
  sessionCode: params.code,
  initialRoom: initialRoom ?? undefined,
  onError: handleWsError,
  onReconnect: handleReconnect,
  onCorrection: handleCorrection,  // NEW
});
```

Import `NumberCorrectionDTO` from `@/lib/types` in both files.

### Conventions (from project CLAUDE.md)
- `toast` imported from `sonner`
- Callbacks wrapped in `useCallback` with minimal dependencies
- `"use client"` already present on both pages
- Tests use vitest + @testing-library/react
- Component Builder: test after implementation

## TDD Sequence (test-after for Component Builder)
1. Add `handleCorrection` callback to player room page, wire to hook
2. Add `handleCorrection` callback to admin page, wire to hook
3. Write tests: verify `onCorrection` is passed to hook in both pages (mock the hook, assert options)

## Done Definition
All acceptance criteria checked. Tests green. No TypeScript errors. Both pages build successfully (`npm run build`).
