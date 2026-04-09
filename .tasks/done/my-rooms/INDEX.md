# Feature: My Rooms

**Status**: ready
**Blocked by feature**: —
**Branch**: feature/my-rooms

Show the player's previously created rooms on the home page, recovered via
`POST /api/v1/room/lookup` using creator hashes stored in localStorage.
Each row offers "Enter as GM" and "Delete". Desktop: right rail on `lg+`.
Mobile: button opens a Dialog.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 01 | Add `lookupRooms` + `getStoredCreatorHashes` to `lib/api.ts` | done | — | sonnet |
| 02 | `useMyRooms` hook | done | 01 | sonnet |
| 03 | `MyRoomsList` component with delete confirm | done | 02 | sonnet |
| 04 | `MyRoomsPanel` (desktop) + `MyRoomsMobile` (dialog) wrappers | done | 03 | sonnet |
| 05 | Wire into `app/[locale]/page.tsx` + i18n keys | done | 04 | sonnet |

## Decisions
- Lookup runs client-side on mount; no SSR (hashes live in localStorage).
- Silent prune: any hash not returned by `/lookup` is removed from localStorage.
- Delete reuses existing `api.deleteRoom` (already cleans localStorage).
- Only render desktop rail / mobile button when `rooms.length > 0`.
- Home page stays a server component — new UI mounted as `"use client"` islands.
- Mobile-first per project convention; right rail is progressive enhancement at `lg`.
