# 005 — Wire UX Enhancements into Admin and Player Views
**Status:** ready
**Blocked by:** 001-last-3-numbers, 003-ball-drop-animation, 004-ball-drop-sound
**Assignee:** Logic Writer

## What
Integrate the new `LastDrawnNumbers` component and `useBallSound` hook into both the admin page (`app/[locale]/room/[code]/admin/page.tsx`) and the player page (`app/[locale]/room/[code]/page.tsx`). The ball drop animation in `CurrentNumber` is self-contained (no changes needed in pages), but sound playback must be triggered from the pages because they own the `drawnNumbers` array and can detect when its length increases.

## Acceptance Criteria
- [ ] `LastDrawnNumbers` is imported and rendered in the admin page directly after `<CurrentNumber ... />`
- [ ] `LastDrawnNumbers` is imported and rendered in the player page directly after `<CurrentNumber ... />`
- [ ] Both pages pass `displayRoom.drawnNumbers` as the `drawnNumbers` prop to `LastDrawnNumbers`
- [ ] `useBallSound` hook is called in the admin page; `playSound` is invoked inside a `useEffect` that fires when `displayRoom.drawnNumbers.length` increases compared to the previous render
- [ ] `useBallSound` hook is called in the player page with the same pattern
- [ ] Sound does NOT play on initial load (when the component first mounts with an already-populated `drawnNumbers` array)
- [ ] Sound does NOT play when `drawnNumbers` length decreases (edge case: room reset)
- [ ] The `useEffect` for sound uses a `useRef` to track the previous length across renders, not a second `useState`, to avoid triggering an extra render cycle
- [ ] No existing functionality in either page is altered (WebSocket subscription, error handling, loading states, draw panels, share section, delete button all remain unchanged)
- [ ] Both pages continue to compile without TypeScript errors

## Implementation Notes
- Import statements to add to each page:
  ```ts
  import { LastDrawnNumbers } from "@/components/last-drawn-numbers";
  import { useBallSound } from "@/hooks/use-ball-sound";
  ```
- Previous length tracking pattern (add near the top of the component, after hooks):
  ```ts
  const { playSound } = useBallSound();
  const prevDrawnLengthRef = useRef<number>(0);

  useEffect(() => {
    const currentLength = displayRoom?.drawnNumbers.length ?? 0;
    if (currentLength > prevDrawnLengthRef.current) {
      playSound();
    }
    prevDrawnLengthRef.current = currentLength;
  }, [displayRoom?.drawnNumbers.length, playSound]);
  ```
- The `useRef` initial value of `0` ensures sound does not fire on first render even if numbers are already present, because the effect only fires when `currentLength > prevDrawnLengthRef.current` — and `prevDrawnLengthRef.current` is set to `currentLength` immediately after, so on the first run `0 > 0` is false.
  - **Correction**: on first render `currentLength` could be > 0 if `initialRoom` has drawn numbers. To suppress this, initialise `prevDrawnLengthRef` lazily inside the effect or set it during the loading phase. Simplest approach: skip sound if `displayRoom` was just loaded (only play on subsequent increases). Use a `hasMountedRef = useRef(false)` sentinel:
    ```ts
    const hasMountedRef = useRef(false);
    useEffect(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        prevDrawnLengthRef.current = displayRoom?.drawnNumbers.length ?? 0;
        return;
      }
      const currentLength = displayRoom?.drawnNumbers.length ?? 0;
      if (currentLength > prevDrawnLengthRef.current) {
        playSound();
      }
      prevDrawnLengthRef.current = currentLength;
    }, [displayRoom?.drawnNumbers.length, playSound]);
    ```
- JSX placement in both pages (inside the `<div className="flex flex-col gap-6">` block):
  ```tsx
  <CurrentNumber number={lastDrawn} />
  <LastDrawnNumbers drawnNumbers={displayRoom.drawnNumbers} />
  ```
- `useRef` is already imported in both pages; add it to the existing import if not present: `import { useEffect, useState, useCallback, useRef } from "react"`
- The `CurrentNumber` component does not need to be modified in this task — animation is handled in task 003
- After changes, run `npm run build` manually (or confirm the `build-check.sh` hook fires) to verify no client/server boundary violations were introduced
