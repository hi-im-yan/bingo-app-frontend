# 01 — Add `lookupRooms` + `getStoredCreatorHashes` to `lib/api.ts`

## What to build
Add an API helper that bulk-resolves all creator hashes stored in
`localStorage` (keys shaped `creator-hash:{sessionCode}`) against the backend's
`POST /api/v1/room/lookup` endpoint, and silently prunes stale entries.

## Acceptance Criteria
- [ ] `getStoredCreatorHashes()` exported — returns `{ sessionCode, hash }[]` by
      scanning `localStorage` for keys prefixed `creator-hash:`. Returns `[]` when
      `typeof window === "undefined"`.
- [ ] `api.lookupRooms()` exported — calls `POST /api/v1/room/lookup` with
      `{ creatorHashes: string[] }` built from stored hashes. Returns `RoomDTO[]`.
- [ ] After the response, any stored `sessionCode` whose hash was NOT returned is
      removed from localStorage via `removeCreatorHash(sessionCode)` (stale prune).
- [ ] If there are no stored hashes, returns `[]` immediately without hitting the network.
- [ ] All existing tests in `lib/__tests__/api.test.ts` still pass.
- [ ] New unit tests cover: empty localStorage, multiple stored rooms, partial response (prune),
      and full response (no prune).

## Technical Spec

### Files to MODIFY
| File | Purpose |
|------|---------|
| `lib/api.ts` | Add helpers + new API method |
| `lib/types.ts` | Add `RoomLookupForm` type |
| `lib/__tests__/api.test.ts` | Add tests for new helpers |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `lib/api.ts` | Existing `request<T>` usage, `getCreatorHash/saveCreatorHash/removeCreatorHash` patterns, `api` export shape |
| `lib/__tests__/api.test.ts` | Test setup (fetch mocking, localStorage mocking, `describe/it` style) |
| `lib/types.ts` | `RoomDTO` shape for mocks |

### Implementation Details

**In `lib/types.ts`**, add:
```ts
export interface RoomLookupForm {
  creatorHashes: string[];
}
```

**In `lib/api.ts`**, add a `getStoredCreatorHashes` helper:
```ts
function getStoredCreatorHashes(): { sessionCode: string; hash: string }[] {
  if (typeof window === "undefined") return [];
  const prefix = "creator-hash:";
  const out: { sessionCode: string; hash: string }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      const hash = localStorage.getItem(key);
      if (hash) out.push({ sessionCode: key.slice(prefix.length), hash });
    }
  }
  return out;
}
```

Add `lookupRooms`:
```ts
async function lookupRooms(): Promise<RoomDTO[]> {
  const stored = getStoredCreatorHashes();
  if (stored.length === 0) return [];

  const rooms = await request<RoomDTO[]>("/api/v1/room/lookup", {
    method: "POST",
    body: JSON.stringify({ creatorHashes: stored.map((s) => s.hash) }),
  });

  // Prune any stored hash whose room didn't come back
  const aliveHashes = new Set(rooms.map((r) => r.creatorHash).filter(Boolean) as string[]);
  for (const { sessionCode, hash } of stored) {
    if (!aliveHashes.has(hash)) {
      removeCreatorHash(sessionCode);
    }
  }

  return rooms;
}
```

Export `lookupRooms` on the `api` object and `getStoredCreatorHashes` as a named export.

### Backend contract (from docs/FRONTEND_API.md on backend `develop`)
```
POST /api/v1/room/lookup
Content-Type: application/json
Body: { "creatorHashes": string[] }
Response 200: RoomDTO[] in creator view (includes creatorHash)
No auth header. Unknown/expired hashes silently skipped.
```

### Conventions (from project CLAUDE.md)
- Tabs for indentation.
- All API calls go through `request<T>` in `lib/api.ts` — never raw `fetch` in components.
- Server-safe: guard all `localStorage` access with `typeof window === "undefined"`.

## TDD Sequence
1. Add new tests in `lib/__tests__/api.test.ts`:
   - `getStoredCreatorHashes` returns `[]` when localStorage is empty.
   - `getStoredCreatorHashes` returns all rooms when multiple are stored.
   - `lookupRooms` short-circuits to `[]` when no hashes stored (no fetch).
   - `lookupRooms` posts `{ creatorHashes: [...] }` and returns parsed rooms.
   - `lookupRooms` prunes stored hashes not present in the response.
   - `lookupRooms` does NOT prune when all hashes come back.
2. Implement helpers + export.
3. Tests should go green. Do NOT run tests manually — the hook runs them.

## Done Definition
All acceptance criteria met. New helpers exported. Tests pass. No type errors.
