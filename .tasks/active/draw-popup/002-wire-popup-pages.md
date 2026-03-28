# 002 — Wire Popup into Player + Admin Pages

## What to build
Add the DrawPopup component to both the player room page and admin page. Trigger it when a new number is drawn using the existing `prevDrawnCountRef` detection pattern.

## Acceptance Criteria
- [ ] Player page shows popup when a new number is drawn
- [ ] Admin page shows popup when a new number is drawn
- [ ] Popup does NOT show on initial page load (only on live draws)
- [ ] Popup shows the last drawn number
- [ ] Popup auto-dismisses and state resets to null
- [ ] Sound still plays alongside the popup (existing behavior preserved)
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/[locale]/room/[code]/page.tsx` | Add popup state + DrawPopup component |
| `app/[locale]/room/[code]/admin/page.tsx` | Add popup state + DrawPopup component |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/draw-popup.tsx` | Props interface, usage pattern |

### Implementation Details

**Both pages — same pattern:**

Add state:
```typescript
const [popupNumber, setPopupNumber] = useState<number | null>(null);
```

Modify the existing `useEffect` that detects new draws (the one with `prevDrawnCountRef`):
```typescript
useEffect(() => {
  if (!displayRoom) return;
  const count = displayRoom.drawnNumbers.length;
  if (count > prevDrawnCountRef.current && prevDrawnCountRef.current > 0) {
    playSound();
    setPopupNumber(displayRoom.drawnNumbers[count - 1]);
  }
  prevDrawnCountRef.current = count;
}, [displayRoom, playSound]);
```

Add dismiss handler:
```typescript
const handlePopupDismiss = useCallback(() => setPopupNumber(null), []);
```

Add component in JSX (inside the return, before or after the main content):
```tsx
<DrawPopup number={popupNumber} onDismiss={handlePopupDismiss} />
```

**Import:**
```typescript
import { DrawPopup } from "@/components/draw-popup";
```

### Conventions
- `useCallback` for the dismiss handler
- Popup renders at the page level (not nested inside a section)
- Existing sound behavior untouched — popup is additive

## TDD Sequence
1. Read both pages to confirm current detection logic
2. Add popup state, modify useEffect, add DrawPopup to JSX
3. Run test suite to verify no regressions

## Done Definition
All acceptance criteria checked. Tests green. Existing sound and draw detection still works.
