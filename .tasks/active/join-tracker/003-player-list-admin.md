# 003 — Player List Panel in Admin

## What to build
A player list panel on the admin page showing who has joined the room. Initial load via REST, real-time updates via WebSocket subscription. Toast notification when a new player joins.

## Acceptance Criteria
- [ ] Admin page shows a player list section
- [ ] Initial player list loaded via `api.getPlayers(sessionCode)`
- [ ] New joins appear in real-time via `onPlayerJoin` callback
- [ ] Toast shown when a new player joins (e.g. "Alice joined the room")
- [ ] Empty state shown when no players have joined
- [ ] Players displayed with name and join time
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `player-list.tsx` | `components/` | Player list panel component |
| `player-list.test.tsx` | `components/__tests__/` | Tests |

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/[locale]/room/[code]/admin/page.tsx` | Add player list panel, wire onPlayerJoin to toast + state update, fetch initial players |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `app/[locale]/room/[code]/admin/page.tsx` | Current admin page structure, toast pattern, hook wiring |
| `components/share-room-section.tsx` | Section component pattern (heading + content) |
| `components/drawn-numbers-board.tsx` | Grid/list display pattern |

### Implementation Details

**Player list component** (`components/player-list.tsx`):
```typescript
"use client";

interface PlayerListProps {
  players: PlayerDTO[];
  loading?: boolean;
}
```

- Displays player name and formatted join time
- Empty state: message like "No players yet"
- Loading state: Skeleton placeholders
- List sorted by joinDateTime (newest first)
- Use `Intl.DateTimeFormat` for time formatting (locale-aware)

**Admin page changes** (`app/[locale]/room/[code]/admin/page.tsx`):
- Add state: `players: PlayerDTO[]` initialized to `[]`
- Fetch initial players in existing `useEffect` (parallel with `getRoom`): `api.getPlayers(params.code)`
- `onPlayerJoin` callback: append to players state + `toast.info(t("playerJoined", { name: player.name }))`
- Pass `onPlayerJoin` to `useRoomSubscription`
- Render `<PlayerList>` between ShareRoomSection and DrawnNumbersBoard

### Conventions
- `useCallback` for `handlePlayerJoin`
- `toast.info` for join notifications (not warning/error)
- Tailwind classes for layout, match existing card/section patterns
- `useTranslations("admin")` for labels

## TDD Sequence
1. Write tests for PlayerList: renders player names, shows empty state, shows loading state
2. Implement PlayerList component
3. Modify admin page to wire up player list + toast
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
