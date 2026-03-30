# 002 — Correction UI in Admin Panel (Manual Mode)

## What to build
Add an inline "Correct" button near the last drawn number in the admin panel. Clicking it opens a number grid picker (reusing the existing grid pattern from ManualDrawPanel) to select the replacement number. A confirmation dialog asks the GM to confirm before sending the correction via WebSocket.

## Acceptance Criteria
- [ ] "Correct" button visible next to the last drawn number (only in MANUAL mode, only when at least one number is drawn)
- [ ] Clicking "Correct" opens a number grid picker showing available numbers (excludes already-drawn numbers except the one being replaced)
- [ ] Selecting a replacement number shows a confirmation dialog (e.g. "Replace N-42 with B-12?")
- [ ] Confirming calls `correctNumber(creatorHash, newNumber)` from the hook
- [ ] Cancelling the confirmation returns to the grid picker
- [ ] Dismissing the grid picker closes everything without action
- [ ] Button is not shown when no numbers have been drawn
- [ ] Button is not shown in AUTOMATIC mode rooms
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `correct-number-panel.tsx` | `components/correct-number-panel.tsx` | Inline correction trigger + grid picker + confirmation dialog |
| `correct-number-panel.test.tsx` | `components/__tests__/correct-number-panel.test.tsx` | Component tests |

### Files to MODIFY
| File | Path | Change |
|------|------|--------|
| `page.tsx` | `app/[locale]/room/[code]/admin/page.tsx` | Wire `correctNumber` from hook, render CorrectNumberPanel next to CurrentNumber |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/manual-draw-panel.tsx` | Number grid layout, B/I/N/G/O columns, drawn number styling, button pattern |
| `components/ui/dialog.tsx` | Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose — Base UI render prop pattern |
| `components/share-room-section.tsx` | Dialog usage example with render prop (`render={<Button />}`) |
| `app/[locale]/room/[code]/admin/page.tsx` | How ManualDrawPanel is wired, `displayRoom`, `creatorHash`, `handleAddNumber` pattern |
| `lib/constants.ts` | `BINGO_LETTERS`, `getNumbersForLetter`, `TOTAL_NUMBERS` |
| `components/current-number.tsx` | How the last drawn number is displayed |

### Component: CorrectNumberPanel

**Props:**
```typescript
interface CorrectNumberPanelProps {
  lastDrawnNumber: number;
  drawnNumbers: number[];
  onCorrect: (newNumber: number) => void;
}
```

**Behavior:**
1. Renders a small "Correct" button (variant="outline", size="sm") inline
2. Clicking opens a Dialog with a number grid (same layout as ManualDrawPanel — 5 columns B/I/N/G/O, 15 rows)
3. In the grid: already-drawn numbers are disabled EXCEPT the number being replaced (it shouldn't appear as "available" since it's the one being corrected — keep it disabled)
4. Clicking an available number shows a confirmation step inside the same dialog: "Replace {oldLabel} with {newLabel}?" with Confirm and Cancel buttons
5. Confirm calls `onCorrect(newNumber)` and closes the dialog
6. Cancel returns to the grid picker

**Admin page wiring:**
```typescript
// In admin page, add handler:
function handleCorrectNumber(newNumber: number) {
  if (creatorHash) {
    correctNumber(creatorHash, newNumber);
  }
}

// Render near CurrentNumber, only for MANUAL mode with drawn numbers:
{displayRoom.drawMode === "MANUAL" && displayRoom.drawnNumbers.length > 0 && (
  <CorrectNumberPanel
    lastDrawnNumber={displayRoom.drawnNumbers[displayRoom.drawnNumbers.length - 1]}
    drawnNumbers={displayRoom.drawnNumbers}
    onCorrect={handleCorrectNumber}
  />
)}
```

### Conventions (from project CLAUDE.md)
- `"use client"` directive on component files
- Components in `components/`, tests in `components/__tests__/`
- Dialog uses Base UI render prop pattern: `render={<Button />}` (NOT Radix `asChild`)
- `cn()` from `lib/utils` for conditional classNames
- Use `useTranslations` from `next-intl` — keys under `"admin"` namespace
- Tests use vitest + @testing-library/react + userEvent
- Component Builder: test after implementation

## TDD Sequence (test-after for Component Builder)
1. Build `CorrectNumberPanel` component with grid picker and confirmation dialog
2. Wire into admin page
3. Write tests: button renders, grid opens, number selection, confirmation dialog, confirm calls onCorrect, cancel returns to grid, button hidden when no numbers drawn

## Done Definition
All acceptance criteria checked. Tests green. No TypeScript errors. Admin page builds successfully (`npm run build`).
