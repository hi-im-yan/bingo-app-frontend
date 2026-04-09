# 05 — Wire into `app/[locale]/page.tsx` + i18n keys

## What to build
Mount `MyRoomsPanel` (desktop rail) and `MyRoomsMobile` (mobile dialog button) on
the home page, adjusting the layout so the existing centered content stays
centered on mobile and sits alongside the rail on `lg+`. Add the `home.myRooms.*`
i18n keys in English and Portuguese.

## Acceptance Criteria
- [ ] `app/[locale]/page.tsx` remains a server component (no `"use client"`).
- [ ] Layout updated so that on `lg+` the existing content sits in a centered column and `MyRoomsPanel` sits to the right. On smaller screens the layout is unchanged except the `MyRoomsMobile` trigger is visible (e.g., just below the help text or near the create/join section).
- [ ] `MyRoomsPanel` and `MyRoomsMobile` are imported and rendered. Both handle their own empty state (render `null`).
- [ ] `messages/en.json` and `messages/pt.json` (or the actual message files used — check `i18n/` config) include all `home.myRooms.*` keys listed below.
- [ ] `npm run build` succeeds (the `build-check.sh` hook enforces this for `page.tsx` edits).

## Technical Spec

### Files to MODIFY
| File | Purpose |
|------|---------|
| `app/[locale]/page.tsx` | Add layout columns + mount wrappers |
| `messages/en.json` (or equivalent) | Add `home.myRooms.*` keys |
| `messages/pt.json` (or equivalent) | Add `home.myRooms.*` keys |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `app/[locale]/page.tsx` | Current layout and structure |
| `components/page-container.tsx` | Container behavior |
| `messages/*.json` | Existing i18n key structure |
| `components/my-rooms/my-rooms-panel.tsx` (task 04) | Import path |
| `components/my-rooms/my-rooms-mobile.tsx` (task 04) | Import path |

### i18n keys to add (under `home.myRooms`)
```json
"myRooms": {
  "title": "My Rooms",
  "enterAsGm": "Enter as GM",
  "delete": "Delete",
  "deleteConfirmTitle": "Delete this room?",
  "deleteConfirmDescription": "This permanently deletes the room for everyone.",
  "confirm": "Delete",
  "cancel": "Cancel",
  "loading": "Loading...",
  "empty": "No rooms yet"
}
```
Portuguese equivalents (use natural translations; keep keys identical).

### Layout approach
Wrap the existing `PageContainer` in a flex row container that is:
- `flex-col` by default (no visual change on mobile),
- `lg:flex-row lg:items-start lg:justify-center lg:gap-8` on large screens.

Place `MyRoomsPanel` as a sibling to the existing content column on desktop. Place
`MyRoomsMobile` inside the main column (below `HelpText` or near the create button),
using Tailwind `lg:hidden` to hide it on desktop.

Keep the existing `PageContainer` centered content intact — do NOT restructure the
create/join form. Only add the wrapping row + the two new islands.

### Conventions (from project CLAUDE.md)
- Server component by default — do NOT add `"use client"` here; the new islands
  already opt in.
- Tabs for indentation.
- Mobile-first Tailwind.

## TDD Sequence
1. No direct unit test for `page.tsx`. Rely on:
   - `build-check.sh` (PostToolUse) which runs `npm run build` on `page.tsx` edits.
   - Existing wrapper/component tests from tasks 03–04.
2. Add i18n keys.
3. Edit `page.tsx` to mount the wrappers and adjust layout.

## Done Definition
- Build passes (hook enforces).
- All i18n keys present in both languages.
- All tests from previous tasks still pass.
