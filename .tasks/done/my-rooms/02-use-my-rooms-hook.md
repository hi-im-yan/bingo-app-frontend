# 02 — `useMyRooms` hook

## What to build
A client hook that loads the creator's rooms via `api.lookupRooms()` on mount and
exposes state + actions to refresh and delete a room.

## Acceptance Criteria
- [ ] File `hooks/use-my-rooms.ts` exports `useMyRooms()`.
- [ ] Returns `{ rooms: RoomDTO[], loading: boolean, error: string | null, refresh: () => Promise<void>, removeRoom: (sessionCode: string) => Promise<void> }`.
- [ ] On mount, calls `api.lookupRooms()` and populates `rooms`. Sets `loading` while pending.
- [ ] `refresh()` re-runs the lookup.
- [ ] `removeRoom(sessionCode)` calls `api.deleteRoom(sessionCode)` and on success removes the room from local state. On failure, sets `error`.
- [ ] Unit tests in `hooks/__tests__/use-my-rooms.test.ts` using `@testing-library/react`'s `renderHook`, mocking `@/lib/api`.

## Technical Spec

### Files to CREATE
| File | Purpose |
|------|---------|
| `hooks/use-my-rooms.ts` | The hook |
| `hooks/__tests__/use-my-rooms.test.ts` | Unit tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `hooks/` (any existing custom hook) | Hook file style, `"use client"` placement if needed (hooks don't need it themselves but the components using them do) |
| `lib/api.ts` | The `api.lookupRooms` and `api.deleteRoom` signatures |
| Any existing `hooks/__tests__/*.test.ts` | Vitest + renderHook setup, mock patterns |

### Implementation sketch
```ts
import { useCallback, useEffect, useState } from "react";
import { api, BingoApiError } from "@/lib/api";
import type { RoomDTO } from "@/lib/types";

export function useMyRooms() {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.lookupRooms();
      setRooms(result);
    } catch (e) {
      setError(e instanceof BingoApiError ? e.message : "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeRoom = useCallback(async (sessionCode: string) => {
    setError(null);
    try {
      await api.deleteRoom(sessionCode);
      setRooms((prev) => prev.filter((r) => r.sessionCode !== sessionCode));
    } catch (e) {
      setError(e instanceof BingoApiError ? e.message : "Failed to delete room");
      throw e;
    }
  }, []);

  return { rooms, loading, error, refresh, removeRoom };
}
```

### Conventions (from project CLAUDE.md)
- Tabs for indentation.
- Never call `fetch` directly — use `api` from `lib/api.ts`.
- TypeScript strict.

## TDD Sequence
1. Write `hooks/__tests__/use-my-rooms.test.ts`:
   - Mounts and calls `api.lookupRooms`, exposes returned rooms once loaded.
   - Sets `loading` → `false` after resolve.
   - Captures error when `lookupRooms` rejects.
   - `removeRoom` calls `api.deleteRoom` then removes room from state.
   - `refresh` triggers a second `lookupRooms` call.
2. Implement the hook.
3. Tests pass (hook runs them).

## Done Definition
All criteria checked. Types clean. Tests green.
