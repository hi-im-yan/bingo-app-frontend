# 005 — Help Text on Player and Admin Room Pages (with Auto-Hide)

## What to build
Add contextual inline help text to the player room page and admin page. Help auto-hides after the first number is drawn (game has started, user is oriented). User can toggle help back on via the header.

## Acceptance Criteria
- [ ] Player page shows help text explaining what to expect
- [ ] Admin page shows help text for drawing, correction, sharing, and broadcast info
- [ ] Help auto-hides when the first draw happens (via `hideHelp()`)
- [ ] User can toggle help back on via header button after auto-hide
- [ ] Manual mode admin shows manual-specific guidance
- [ ] Automatic mode admin shows automatic-specific guidance
- [ ] All strings use i18n keys
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/[locale]/room/[code]/page.tsx` | Add HelpText blocks, call hideHelp on first draw |
| `app/[locale]/room/[code]/admin/page.tsx` | Add HelpText blocks, call hideHelp on first draw |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/help-text.tsx` | HelpText usage |
| `hooks/use-help-visible.ts` | hideHelp function |
| `app/[locale]/room/[code]/page.tsx` | Current player page, prevDrawnCountRef pattern |
| `app/[locale]/room/[code]/admin/page.tsx` | Current admin page, prevDrawnCountRef pattern |
| `components/manual-draw-panel.tsx` | Manual mode UI (to understand what needs guidance) |
| `components/automatic-draw-panel.tsx` | Automatic mode UI |
| `components/correct-number-dialog.tsx` | Correction UI |

### Implementation Details

**Auto-hide mechanism** (same for both pages):
Import and use `useHelpVisible`:
```typescript
const { hideHelp } = useHelpVisible();
```

Modify the existing `useEffect` that detects new draws:
```typescript
useEffect(() => {
  if (!displayRoom) return;
  const count = displayRoom.drawnNumbers.length;
  if (count > prevDrawnCountRef.current && prevDrawnCountRef.current > 0) {
    playSound();
    hideHelp(); // Auto-hide help when game starts
  }
  prevDrawnCountRef.current = count;
}, [displayRoom, playSound, hideHelp]);
```

**Player page help** (`app/[locale]/room/[code]/page.tsx`):
Below PageHeader, before the game content:
```tsx
<HelpText>
  {t("help.playerIntro")}
</HelpText>
```
Content (EN): "The host is drawing numbers. When a number is called, it will appear here. Mark it off on your bingo card!"

When no numbers drawn yet (empty state area):
```tsx
<HelpText className="text-xs">
  {t("help.waitingForHost")}
</HelpText>
```
Content (EN): "Waiting for the host to start drawing numbers. Keep this page open — updates appear in real time."

**Admin page help** (`app/[locale]/room/[code]/admin/page.tsx`):
Below PageHeader:
```tsx
<HelpText>
  {t("help.adminIntro")}
</HelpText>
```
Content (EN): "You're the host. Numbers you draw are shown live to all players in this room."

For MANUAL mode, above the ManualDrawPanel:
```tsx
<HelpText className="text-xs">
  {t("help.manualMode")}
</HelpText>
```
Content (EN): "Click on a number to draw it. Already drawn numbers are disabled."

For AUTOMATIC mode, above the AutomaticDrawPanel:
```tsx
<HelpText className="text-xs">
  {t("help.automaticMode")}
</HelpText>
```
Content (EN): "Click the button to draw a random number."

Near the correction button (manual mode only):
```tsx
<HelpText className="text-xs">
  {t("help.correction")}
</HelpText>
```
Content (EN): "Drew the wrong number? Use the Correct button to fix it."

Near the share section:
```tsx
<HelpText className="text-xs">
  {t("help.shareRoom")}
</HelpText>
```
Content (EN): "Share the room code or QR code with your players so they can follow along."

**i18n namespace:**
- `room.help.playerIntro`, `room.help.waitingForHost`
- `admin.help.adminIntro`, `admin.help.manualMode`, `admin.help.automaticMode`, `admin.help.correction`, `admin.help.shareRoom`

### Conventions
- Import `useHelpVisible` from `@/hooks/use-help-visible`
- Import `HelpText` from `@/components/help-text`
- `hideHelp` added to useEffect dependency array
- Help text placed contextually near the feature it describes
- Mode-specific help gated by `displayRoom.drawMode === "MANUAL"` / `"AUTOMATIC"`
- `text-xs` for secondary hints

## TDD Sequence
1. Read both room pages to understand current structure
2. Add useHelpVisible import, HelpText blocks, and hideHelp call
3. Add i18n keys (placeholder values — task 006 finalizes translations)
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. Help visible by default, auto-hides on first draw, toggleable via header.
