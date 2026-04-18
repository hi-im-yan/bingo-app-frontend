# 02 — `onRoomReset` callback in `useRoomSubscription`

## What to build

Extend `useRoomSubscription` to detect when a room's `drawnNumbers`
transitions from non-empty to empty and fire a new `onRoomReset`
callback. The hook itself stays UI-agnostic — no `toast`, no `i18n`.
Consumers (admin page, player page) wire the user-facing toast in
task 04.

## Acceptance Criteria

- [ ] `UseRoomSubscriptionOptions` has a new optional prop: `onRoomReset?: () => void`
- [ ] The callback fires exactly once when an incoming `RoomDTO` has `drawnNumbers.length === 0` AND the previous `room` state had `drawnNumbers.length > 0`
- [ ] The callback does NOT fire on initial load, on sessions that started empty, or on unrelated updates (player join, correction, etc.)
- [ ] The callback does NOT fire on re-renders — only on actual state transitions
- [ ] If the consumer does not pass `onRoomReset`, nothing changes — no errors, no warnings
- [ ] All existing hook tests still pass
- [ ] New hook test covers: fires on transition, does not fire on initial load, does not fire when already empty, does not fire on non-empty → non-empty updates
- [ ] `npm test` passes

## Technical Spec

### Files to MODIFY

| File | Change |
|------|--------|
| `hooks/use-room-subscription.ts` | Add `onRoomReset` to options interface; wire detection into the existing room-update handler |
| `hooks/__tests__/use-room-subscription.test.ts` | Add a new `describe` block covering the reset transition callback |

### Files to READ (for patterns — do NOT modify)

| File | What to copy |
|------|-------------|
| `hooks/use-room-subscription.ts` (current file) | Callback pattern used by `onCorrection`, `onPlayerJoin`, `onTiebreakUpdate` |
| `hooks/__tests__/use-room-subscription.test.ts` | Test harness: how STOMP client is mocked, how incoming messages are simulated, how callbacks are asserted |

### Implementation Details

**Where to detect the transition:** inside the existing `subscribe(`/room/${sessionCode}`, ...)` handler in the main `useEffect` (currently around line 48–63). Compare the incoming `updated.drawnNumbers.length` against the previous `room?.drawnNumbers.length` BEFORE calling `setRoom`.

**Use a ref to track previous length** (state in `useState` would lag behind the callback scope within the handler). Sketch:

```typescript
import { useEffect, useRef, useState, useCallback } from "react";

// inside the hook body, near other state:
const prevDrawnCountRef = useRef<number>(initialRoom?.drawnNumbers.length ?? 0);

// in the subscribe handler:
const unsubscribe = subscribe(`/room/${sessionCode}`, (message) => {
	try {
		const updated: RoomDTO = JSON.parse(message.body);
		const prevCount = prevDrawnCountRef.current;
		const nextCount = updated.drawnNumbers.length;
		if (prevCount > 0 && nextCount === 0) {
			onRoomReset?.();
		}
		prevDrawnCountRef.current = nextCount;
		setRoom(updated);
	} catch {
		onError?.("Failed to parse room update");
	}
});
```

Add `onRoomReset` to the effect's dependency array alongside the existing deps.

**Add to options interface:**

```typescript
interface UseRoomSubscriptionOptions {
	// ...existing props...
	onRoomReset?: () => void;
}
```

Destructure `onRoomReset` from the props alongside the other callbacks.

**Do NOT modify the returned shape** — `onRoomReset` is input-only, not output.

### Test plan

Add to `hooks/__tests__/use-room-subscription.test.ts`:

```typescript
describe("onRoomReset callback", () => {
	it("fires when drawnNumbers transitions from non-empty to empty", () => {
		// render hook with onRoomReset mock and a mocked STOMP subscribe
		// first deliver a RoomDTO with drawnNumbers: [5, 12]
		// then deliver one with drawnNumbers: []
		// expect(onRoomReset).toHaveBeenCalledTimes(1)
	});

	it("does NOT fire when initial state is empty and next update is empty", () => {
		// initialRoom with drawnNumbers: []
		// deliver RoomDTO with drawnNumbers: []
		// expect(onRoomReset).not.toHaveBeenCalled()
	});

	it("does NOT fire on non-empty → non-empty updates", () => {
		// deliver [5], then [5, 12]
		// expect(onRoomReset).not.toHaveBeenCalled()
	});

	it("does NOT fire on initial load even if drawnNumbers is empty", () => {
		// render with no initialRoom, deliver first update with drawnNumbers: []
		// expect(onRoomReset).not.toHaveBeenCalled()
	});

	it("is a no-op when callback is not provided", () => {
		// render without onRoomReset, deliver non-empty then empty updates
		// expect no errors thrown
	});
});
```

Match the existing test file's mocking style. If the existing tests
mock `useStompClient` directly or use a fake broker, follow the same
pattern — do NOT invent a new one.

### Conventions (from project CLAUDE.md)

- Tabs for indentation.
- Server components by default — this is a client hook, `"use client"` already in place.
- `npm test` runs automatically via the `run-tests.sh` PostToolUse hook when tasks are marked completed — but you should verify tests pass as part of TDD by re-running them yourself during implementation.
- 80% coverage threshold enforced by `coverage-check.sh` Stop hook.

## TDD Sequence

1. Read `hooks/__tests__/use-room-subscription.test.ts` to learn the mocking style.
2. Write the `describe("onRoomReset callback", ...)` block with all five test cases (they will fail — the feature doesn't exist yet).
3. Run the tests — confirm they fail for the expected reason (callback not called, not a harness error).
4. Implement the `onRoomReset` prop, ref tracking, and transition detection in `hooks/use-room-subscription.ts`.
5. Re-run the tests — they should pass.
6. Run the full hook test file to confirm no regressions.

## Done Definition

All acceptance criteria checked. Tests green (new + existing). No
TypeScript errors. Hook signature documented via the updated
`UseRoomSubscriptionOptions` interface.
