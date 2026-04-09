# 03 — `MyRoomsList` component with delete confirm

## What to build
A presentational client component that renders a list of the creator's rooms.
Each row shows the room name + session code, an "Enter as GM" link navigating to
`/room/{sessionCode}/admin`, and a delete button that opens a confirm dialog.

## Acceptance Criteria
- [ ] File `components/my-rooms/my-rooms-list.tsx` with `"use client"` at the top.
- [ ] Accepts props: `{ rooms: RoomDTO[]; loading: boolean; error: string | null; onDelete: (sessionCode: string) => Promise<void>; }`.
- [ ] Renders one row per room: name, session code (monospace), `<Link href={\`/room/${sessionCode}/admin\`}>` labeled via i18n, delete button (icon + accessible label).
- [ ] Delete button opens shadcn `AlertDialog` confirm; on confirm calls `onDelete`.
- [ ] Shows a simple loading state while `loading`.
- [ ] Shows `error` message if present.
- [ ] Does NOT render anything if `rooms.length === 0 && !loading && !error` — parent decides whether to mount.
- [ ] Mobile-first styles (works on small screens).
- [ ] Tests in `components/my-rooms/__tests__/my-rooms-list.test.tsx` cover: renders rows, enter link has correct href, delete opens dialog, confirm calls `onDelete`, cancel does not, loading/error states.

## Technical Spec

### Files to CREATE
| File | Purpose |
|------|---------|
| `components/my-rooms/my-rooms-list.tsx` | List UI |
| `components/my-rooms/__tests__/my-rooms-list.test.tsx` | Tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| Any component using shadcn `AlertDialog` (grep `AlertDialog` under `components/` or `app/`) | Dialog structure, confirm/cancel handlers |
| Existing components that use `Link` from `@/i18n/navigation` | Link usage pattern |
| Existing component tests under `components/` using vitest + testing-library | Test setup, i18n mocking (`next-intl`) |
| `lib/types.ts` | `RoomDTO` shape |
| `components/ui/button.tsx` | Button variants |

### i18n keys (add in task 05)
This task uses these keys — task 05 will add them to the `messages/en.json` / `messages/pt.json`:
- `home.myRooms.title` — "My Rooms"
- `home.myRooms.enterAsGm` — "Enter as GM"
- `home.myRooms.delete` — "Delete"
- `home.myRooms.deleteConfirmTitle` — "Delete this room?"
- `home.myRooms.deleteConfirmDescription` — "This permanently deletes the room for everyone."
- `home.myRooms.confirm` — "Delete"
- `home.myRooms.cancel` — "Cancel"
- `home.myRooms.loading` — "Loading..."
- `home.myRooms.empty` — "No rooms yet"

Use `useTranslations("home.myRooms")` and key as `t("title")` etc. If testing without
the provider, mock `next-intl` the same way other component tests do.

### Sketch
```tsx
"use client";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import type { RoomDTO } from "@/lib/types";

interface MyRoomsListProps {
  rooms: RoomDTO[];
  loading: boolean;
  error: string | null;
  onDelete: (sessionCode: string) => Promise<void>;
}

export function MyRoomsList({ rooms, loading, error, onDelete }: MyRoomsListProps) {
  const t = useTranslations("home.myRooms");
  // loading/error/empty branches + mapped rows
}
```

### Conventions (from project CLAUDE.md)
- Tabs for indentation.
- Client components only when needed — this one is, so `"use client"` goes at the top.
- Mobile-first styles with Tailwind.
- Use `Link` from `@/i18n/navigation`, not `next/link`.

## TDD Sequence
1. Write `my-rooms-list.test.tsx` covering all states.
2. Implement the component.
3. Tests pass (hook runs them).

## Done Definition
All criteria checked. Types clean. Tests green.
