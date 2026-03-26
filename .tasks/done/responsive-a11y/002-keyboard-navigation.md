# 002 — Keyboard Navigation for NumberGrid

**Status:** ready
**Assignee:** Logic Writer
**Blocked by:** —

## Objective
Add arrow key navigation to the ManualDrawPanel number grid so keyboard users can navigate between numbers.

## Implementation

### Approach: Roving tabindex
Use roving tabindex pattern on the number grid:
- Only one button in the grid has `tabindex="0"` at a time
- All other buttons have `tabindex="-1"`
- Arrow keys move focus between buttons
- Enter/Space activates the focused button (native behavior)

### Key bindings
- **ArrowUp/ArrowDown**: move within a column (same BINGO letter)
- **ArrowLeft/ArrowRight**: move between columns (different letters)
- **Home**: first number in column
- **End**: last number in column
- Skip drawn numbers when navigating

### File: `components/manual-draw-panel.tsx`
- Add `onKeyDown` handler to the grid container
- Track focused index with `useState`
- Calculate grid position from flat index (col = index % 5, row = Math.floor(index / 5))
- Skip disabled (already drawn) buttons

### Grid structure
The grid is 5 columns × 15 rows:
- Column 0 (B): 1–15
- Column 1 (I): 16–30
- Column 2 (N): 31–45
- Column 3 (G): 46–60
- Column 4 (O): 61–75

## Testing
- Verify arrow key navigation moves between numbers
- Verify drawn numbers are skipped
- Verify Enter selects a number
- Verify focus is visible (outline ring)
