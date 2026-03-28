# 001 — DrawPopup Component

## What to build
A full-screen overlay component that displays a large animated bingo ball when a number is drawn. Darkened backdrop, drop+spin animation, auto-dismisses after 1 second. Includes aria-live region for screen reader announcement.

## Acceptance Criteria
- [ ] Renders a fixed full-screen overlay with darkened backdrop when `number` is not null
- [ ] Displays bingo label (e.g. "B-7") in large bold text inside a ball
- [ ] Ball animates in with drop + spin effect (~600ms)
- [ ] Entire overlay fades out and unmounts after 1s
- [ ] `aria-live="assertive"` region announces the drawn number
- [ ] Renders nothing when `number` is null
- [ ] Backdrop is `bg-black/50` — strong enough for elderly peripheral vision
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `draw-popup.tsx` | `components/` | Overlay popup component |
| `draw-popup.test.tsx` | `components/__tests__/` | Tests |

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/globals.css` | Add keyframes: `popup-drop-spin`, `popup-fade-out`, `popup-backdrop-in`, `popup-backdrop-out` |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/current-number.tsx` | How BingoBall + formatBingoLabel are used together |
| `components/ui/bingo-ball.tsx` | Ball styling tokens: `bg-ball-drawn`, `text-ball-drawn-foreground`, shadow |
| `components/ui/dialog.tsx` | Overlay pattern: fixed inset-0, z-50, backdrop styling |
| `app/globals.css` | Existing `ball-drop` keyframe for reference easing curve |
| `lib/constants.ts` | `formatBingoLabel` function |

### Implementation Details

**Component** (`components/draw-popup.tsx`):
```typescript
"use client";

interface DrawPopupProps {
  number: number | null;
  onDismiss: () => void;
}
```

**Behavior:**
- When `number` changes from null to a value: show overlay, start 1s timer
- After 1s: call `onDismiss()` (parent sets number back to null)
- Use `useEffect` with `setTimeout(onDismiss, 1000)` and cleanup on unmount
- If `number` is null, render nothing

**Overlay structure:**
```tsx
<div className="fixed inset-0 z-[60] flex items-center justify-center">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/50" style={{ animation: "popup-backdrop-in 200ms ease-out forwards" }} />

  {/* Ball */}
  <div className="relative z-10 flex flex-col items-center" style={{ animation: "popup-drop-spin 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
    <div className="flex size-40 items-center justify-center rounded-full bg-ball-drawn shadow-2xl">
      <span className="text-5xl font-black tabular-nums text-ball-drawn-foreground">
        {formatBingoLabel(number)}
      </span>
    </div>
  </div>

  {/* Screen reader */}
  <div aria-live="assertive" className="sr-only">
    {t("numberDrawn", { label: formatBingoLabel(number) })}
  </div>
</div>
```

**z-index:** Use `z-[60]` — above the dialog's `z-50` so popup always wins.

**CSS Keyframes** (add to `app/globals.css`):
```css
@keyframes popup-drop-spin {
  0% {
    opacity: 0;
    transform: translateY(-120px) scale(0.5) rotate(-180deg);
  }
  60% {
    opacity: 1;
    transform: translateY(10px) scale(1.1) rotate(10deg);
  }
  80% {
    transform: translateY(-5px) scale(0.95) rotate(-5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

@keyframes popup-fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}

@keyframes popup-backdrop-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes popup-backdrop-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
```

**Fade-out approach:** Use a state to track dismissing phase. At ~700ms mark, switch to fade-out animation class, then call `onDismiss` at 1000ms. This gives a smooth exit:
- 0-600ms: drop+spin in
- 700-1000ms: fade out
- 1000ms: unmount

### Conventions
- `"use client"` directive
- `useTranslations("room")` for aria text
- Tailwind for layout, inline `style={{ animation }}` for keyframes (same pattern as `current-number.tsx`)
- `formatBingoLabel` from `@/lib/constants`
- Ball colors: `bg-ball-drawn`, `text-ball-drawn-foreground` (existing tokens)

## TDD Sequence
1. Write tests: renders nothing when number is null, renders overlay when number provided, displays formatted label, calls onDismiss after timeout, has aria-live region
2. Implement CSS keyframes in globals.css
3. Implement DrawPopup component
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
