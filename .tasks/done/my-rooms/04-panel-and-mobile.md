# 04 — `MyRoomsPanel` (desktop) + `MyRoomsMobile` (dialog) wrappers

## What to build
Two client wrappers around `useMyRooms` + `MyRoomsList`:
- **`MyRoomsPanel`** — desktop-only right-rail panel. Renders `null` when there are no rooms.
- **`MyRoomsMobile`** — a button ("My rooms (n)") that opens a shadcn `Dialog` containing the list. Button renders `null` when there are no rooms.

## Acceptance Criteria
- [ ] `components/my-rooms/my-rooms-panel.tsx` — `"use client"`. Uses `useMyRooms`. Returns `null` when `!loading && rooms.length === 0 && !error`. Otherwise renders a container with a title (`home.myRooms.title`) and the `MyRoomsList`.
- [ ] `components/my-rooms/my-rooms-mobile.tsx` — `"use client"`. Uses `useMyRooms`. Returns `null` when empty. Otherwise renders a button showing the room count that opens a shadcn `Dialog` with the list inside.
- [ ] Both components forward `removeRoom` as `onDelete` to `MyRoomsList`.
- [ ] Tests in `components/my-rooms/__tests__/`:
  - `my-rooms-panel.test.tsx` — mounts the panel with a mocked `useMyRooms` returning rooms and asserts it renders list; with empty rooms asserts it renders nothing.
  - `my-rooms-mobile.test.tsx` — mounts, clicks button, asserts dialog opens and contains the list. With empty state asserts button is not rendered.

## Technical Spec

### Files to CREATE
| File | Purpose |
|------|---------|
| `components/my-rooms/my-rooms-panel.tsx` | Desktop rail wrapper |
| `components/my-rooms/my-rooms-mobile.tsx` | Mobile dialog wrapper |
| `components/my-rooms/__tests__/my-rooms-panel.test.tsx` | Tests |
| `components/my-rooms/__tests__/my-rooms-mobile.test.tsx` | Tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| Any existing component using shadcn `Dialog` (grep `DialogContent` under `components/` / `app/`) | Dialog structure |
| `components/ui/button.tsx` | Button variants |
| `components/my-rooms/my-rooms-list.tsx` (from task 03) | Component API |
| `hooks/use-my-rooms.ts` (from task 02) | Hook API |
| Existing tests that mock custom hooks | Mock pattern (`vi.mock('@/hooks/use-my-rooms', ...)`) |

### Mobile wrapper sketch
```tsx
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMyRooms } from "@/hooks/use-my-rooms";
import { MyRoomsList } from "./my-rooms-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ListChecks } from "lucide-react";

export function MyRoomsMobile() {
  const t = useTranslations("home.myRooms");
  const { rooms, loading, error, removeRoom } = useMyRooms();
  const [open, setOpen] = useState(false);
  if (!loading && rooms.length === 0 && !error) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <ListChecks className="mr-2 h-4 w-4" />
          {t("title")} ({rooms.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{t("title")}</DialogTitle></DialogHeader>
        <MyRoomsList rooms={rooms} loading={loading} error={error} onDelete={removeRoom} />
      </DialogContent>
    </Dialog>
  );
}
```

### Panel sketch
```tsx
"use client";
import { useTranslations } from "next-intl";
import { useMyRooms } from "@/hooks/use-my-rooms";
import { MyRoomsList } from "./my-rooms-list";

export function MyRoomsPanel() {
  const t = useTranslations("home.myRooms");
  const { rooms, loading, error, removeRoom } = useMyRooms();
  if (!loading && rooms.length === 0 && !error) return null;
  return (
    <aside className="hidden lg:block w-80 rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">{t("title")}</h2>
      <MyRoomsList rooms={rooms} loading={loading} error={error} onDelete={removeRoom} />
    </aside>
  );
}
```

### Conventions (from project CLAUDE.md)
- Tabs for indentation.
- Mobile-first: panel hidden below `lg`, mobile button hidden at `lg+`.
- Client components (`"use client"`).

## TDD Sequence
1. Write tests for both wrappers (mock `useMyRooms`).
2. Implement both components.
3. Tests pass (hook runs them).

## Done Definition
All criteria checked. Types clean. Tests green.
