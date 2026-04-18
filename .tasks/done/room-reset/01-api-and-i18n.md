# 01 — `resetRoom` API function + i18n keys

## What to build

Add `resetRoom(sessionCode)` to the centralized API client and add the
translation keys the reset UI will need. No UI in this task — this is
the foundation tasks 02 and 03 build on.

## Acceptance Criteria

- [ ] `api.resetRoom(sessionCode)` exists and is exported from `lib/api.ts`
- [ ] Calls `POST /api/v1/room/{sessionCode}/reset` with `X-Creator-Hash` header auto-injected
- [ ] Throws `BingoApiError(400, ...)` if no creator hash is stored locally — does NOT make the HTTP call
- [ ] Returns `RoomDTO` on success (the backend returns the updated room body)
- [ ] English and Portuguese translations added for every key listed below
- [ ] `npm run lint` passes

## Technical Spec

### Files to MODIFY

| File | Change |
|------|--------|
| `lib/api.ts` | Add `resetRoom` function, export it inside the `api` object |
| `messages/en.json` | Add keys listed below |
| `messages/pt.json` | Add keys listed below |

### Files to READ (for patterns — do NOT modify)

| File | What to copy |
|------|-------------|
| `lib/api.ts` → `deleteRoom` (around line 107) | Creator-hash guard pattern, `request()` call shape |
| `messages/en.json` / `messages/pt.json` | Existing `admin`, `common`, `errors` namespaces to nest new keys correctly |

### Implementation Details

**`resetRoom` function — mirror `deleteRoom` but POST and returns `RoomDTO`:**

```typescript
async function resetRoom(sessionCode: string): Promise<RoomDTO> {
	const hash = getCreatorHash(sessionCode);
	if (!hash) {
		throw new BingoApiError(400, "No creator hash found for this room");
	}

	return request<RoomDTO>(`/api/v1/room/${sessionCode}/reset`, {
		method: "POST",
		sessionCode,
	});
}
```

Add `resetRoom` to the exported `api` object (the `export const api = { ... }` block near the bottom of the file).

**Backend error shapes** (from the API docs — not to encode here, just so you know what surfaces as `BingoApiError`):
- `400 TIEBREAK_ALREADY_ACTIVE` — tiebreaker active, reset blocked
- `404 ROOM_NOT_FOUND` — bad session code or wrong hash

The `request()` helper already maps these into `BingoApiError` with `code`, `status`, and `message`. No extra handling needed in `resetRoom` itself — the UI layer (task 03) will switch on `code`.

### i18n keys to add

Nest each key under the namespace shown. Match the style of existing
neighbors (sentence case, no trailing punctuation unless the key name
implies a full sentence).

**`admin` namespace** (creator-only UI):

| Key | English | Portuguese |
|-----|---------|------------|
| `resetRoom` | `Reset room` | `Resetar sala` |
| `resetConfirmTitle` | `Reset the game?` | `Resetar o jogo?` |
| `resetConfirmBody` | `All drawn numbers will be cleared. Players will stay in the room. This cannot be undone.` | `Todos os números sorteados serão apagados. Os jogadores permanecerão na sala. Não é possível desfazer.` |
| `resetConfirmCta` | `Reset game` | `Resetar jogo` |

**`room` namespace** (shared admin + player — check if this namespace already exists; if not, create it. If the project already puts player-facing toasts in another namespace like `common` or `game`, use that instead and adjust keys accordingly. When in doubt, put `gameWasReset` in `common`):

| Key | English | Portuguese |
|-----|---------|------------|
| `gameWasReset` | `Game was reset` | `O jogo foi resetado` |

**`errors` namespace**:

| Key | English | Portuguese |
|-----|---------|------------|
| `resetFailed` | `Could not reset the room. Please try again.` | `Não foi possível resetar a sala. Tente novamente.` |
| `tiebreakActive` | `Finish the tiebreaker before resetting the room.` | `Finalize o desempate antes de resetar a sala.` |

### Conventions (from project CLAUDE.md)

- All API calls go through the centralized client in `lib/api.ts` — never call `fetch` directly from components.
- Types come from `lib/types.ts` and match backend DTOs. `RoomDTO` already exists — do NOT add a new type.
- Tabs for indentation (match the rest of `lib/api.ts`).
- `npm run lint` runs automatically via the `lint-fix.sh` PostToolUse hook — you do NOT need to run it manually, but verify it didn't error.

## TDD Sequence

No tests for this task. `resetRoom` is a thin wrapper over `request()`, and it's exercised end-to-end by the component tests in task 03. Adding a dedicated unit test for an 8-line passthrough would be ceremony, not coverage.

## Done Definition

All acceptance criteria checked. `lib/api.ts` exports `resetRoom`; both
locale files have all six keys; ESLint is clean.
