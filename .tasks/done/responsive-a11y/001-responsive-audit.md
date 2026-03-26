# 001 — Responsive Audit Across All Pages

**Status:** ready
**Assignee:** Component Builder
**Blocked by:** —

## Objective
Audit all pages for responsive issues on small screens (320px–480px). Fix any gaps.

## Current State Analysis
The base design is already mobile-first:
- `PageContainer`: `max-w-lg`, `px-4`, responsive `sm:px-6`
- Touch targets: buttons use `h-14`, `min-h-11`, grid buttons `size-8`
- Text: responsive on home page (`text-4xl sm:text-5xl`)

## Potential Issues to Check

### Number Grid (ManualDrawPanel + DrawnNumbersBoard)
- `grid-cols-5` with `size-8` buttons and `gap-1` — 5 columns of 32px = 160px + gaps. Should fit on 320px.
- Each column has 15 numbers stacked vertically — long scroll. Acceptable for bingo.

### Create Room — Draw Mode Selector
- `grid-cols-2` — should be fine on small screens but verify text wrapping in the description.

### QR Code (ShareRoomSection)
- Fixed `width={200} height={200}` — fits on small screens but verify padding doesn't cause overflow.

### Admin Page
- Multiple sections stacked vertically — good mobile pattern. No horizontal overflow expected.

## Implementation
- Verify layouts on 320px width
- Fix any overflow issues found
- Ensure all interactive elements have minimum 44px touch targets (WCAG 2.5.5)
- The `size-8` (32px) buttons in the number grid are below 44px — but they have `gap-1` spacing that helps. Consider if this needs adjustment.

## Touch Target Analysis
- Number grid buttons: `size-8` = 32px — below 44px WCAG recommendation
- Fix: increase to `size-9` (36px) or `size-10` (40px) with spacing. Given 5 columns, `size-10` × 5 = 200px + gaps fits fine.

## Testing
- Check all pages at 320px, 375px, 414px viewport widths
- Verify no horizontal scroll
- Verify touch targets are >= 44px including spacing
