# 003 — ARIA Labels + Screen Reader Support

**Status:** ready
**Assignee:** Component Builder
**Blocked by:** —

## Objective
Add ARIA labels to interactive elements and a live region for drawn number announcements.

## Implementation

### Live Region for Drawn Numbers
**File:** `components/current-number.tsx`
- Add `aria-live="polite"` and `role="status"` to the current number container
- When a new number is drawn, screen readers will announce it
- Include the BINGO letter label in the announcement (e.g., "B-7")

### BingoBall Component
**File:** `components/ui/bingo-ball.tsx`
- Add `aria-label` with the number and drawn state (e.g., "7, drawn" or "7, not drawn")
- The drawn state is useful in the DrawnNumbersBoard context

### DrawnNumbersBoard
**File:** `components/drawn-numbers-board.tsx`
- Add `role="grid"` to the board container
- Add `role="columnheader"` to letter headers
- Add `aria-label` to the board section

### ManualDrawPanel
- Number buttons already have `aria-label={String(num)}`
- Enhance to include drawn state: `aria-label="7, already drawn"` or `aria-label="7"`
- Add `role="grid"` and `aria-label` to the grid container

### ShareRoomSection
- QR code `alt` already set to "QR Code" — enhance to "QR Code for room {sessionCode}"
- Copy button already has `aria-label`

### ConnectionStatus
- Add `role="alert"` for connection status changes (important state change)

### DrawModeOption (create page)
- Add `role="radio"` and `aria-checked` to the draw mode toggle buttons
- Wrap in `role="radiogroup"` with `aria-label`

## i18n Keys
No new keys needed — use existing labels with programmatic composition.

## Testing
- Verify screen reader announces new drawn numbers
- Verify all buttons have meaningful labels
- Verify grid navigation is announced properly
