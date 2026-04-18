# Feature: Room Reset

**Status**: done
**Blocked by feature**: —
**Branch**: feature/room-reset (off develop, PR to develop)

Creator-triggered reset that clears all drawn numbers for the room.
Backend endpoint: `POST /api/v1/room/{session-code}/reset` (X-Creator-Hash
required). On success the backend broadcasts an updated `RoomDTO` with
empty `drawnNumbers` over the existing `/room/{sessionCode}` STOMP
subscription — every connected client (admin + players) sees the reset
and gets a "Game was reset" toast.

Scope: reset only. The PATCH `/api/v1/room/{session-code}` update-info
endpoint shipped in the same backend commit is deferred to a separate
feature.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 01 | `resetRoom` API function + i18n keys | done | — | Sonnet |
| 02 | `onRoomReset` callback in `useRoomSubscription` + hook test | done | 01 | Sonnet |
| 03 | `ResetRoomButton` component + tests | done | 01 | Sonnet |
| 04 | Wire reset into admin + player pages + build check | done | 02, 03 | Sonnet |

## Decisions

- **Detection lives in the hook, as a callback** — `useRoomSubscription` exposes a new `onRoomReset?: () => void` prop and fires it when `drawnNumbers` transitions from non-empty to empty. Matches the hook's existing callback pattern (`onCorrection`, `onPlayerJoin`, `onTiebreakUpdate`). Each consumer (admin + player page) wires `toast.info(t('gameWasReset'))` to keep toast/i18n concerns out of the hook.
- **No separate success toast on the admin side** — the transition-detection toast covers admin and players uniformly.
- **Error differentiation** — 400 with `code === "TIEBREAK_ALREADY_ACTIVE"` shows a specific message ("Finish the tiebreaker before resetting"); everything else shows a generic `resetFailed` toast.
- **Mobile-first button** — icon-only on small screens, icon + label on `sm:` and up, matching project convention.
- **No new types** — response reuses `RoomDTO`; no request body.
