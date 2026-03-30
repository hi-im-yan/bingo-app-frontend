# F6.1 — UX Enhancements: draw experience, sharing, and animations

**Status:** ready
**Blocked by:** tailwind-v4-fix (build must pass first)
**Branch:** feature/ux-enhancements

## Description
Polish the game experience with visual/audio feedback on number draws, better sharing tools for admins, and a last-drawn numbers display.

## Requirements

### 1. Last 3 drawn numbers display
- Show the last 3 drawn numbers in a dedicated section (admin + player views)
- Most recent number prominent, previous two smaller/faded
- Updates live via WebSocket

### 2. Admin sharing improvements (desktop only)
- QR code button in admin panel (hidden on mobile — already has share section)
- Opens a modal showing the room QR code full-size
- Copy button copies the full room URL (not just session code) for easy sharing in group texts

### 3. Ball drop animation
- When a number is drawn, animate a bingo ball dropping into view
- Previous number fades out as the new one drops in
- Animation plays on both admin and player views (triggered by WebSocket update)
- Smooth, satisfying motion — not flashy

### 4. Ball drop sound effect
- Play a short ball-drop sound when a new number is drawn
- Same sound on admin and player views
- Respect user's system mute / keep volume reasonable
- Need a royalty-free sound asset (short, crisp)

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Last 3 drawn numbers component | ready | — | Component Builder |
| 002 | Admin QR modal + full URL copy button | ready | — | Component Builder |
| 003 | Ball drop animation (CSS/Framer Motion) | ready | — | Component Builder |
| 004 | Ball drop sound effect integration | ready | 003 | Logic Writer |
| 005 | Wire animations + sound into admin and player views | ready | 001, 003, 004 | Component Builder |

## Decisions
- Animation approach: CSS keyframes vs Framer Motion (decide during implementation)
- Sound: use a small MP3/OGG in public/ — no external audio library needed
- QR modal: reuse existing QR endpoint, render in dialog component
- Last 3 numbers: derive from drawnNumbers/drawnLabels arrays (last 3 items from RoomDTO), no backend change needed

## Notes
- Animations must not block interaction or feel sluggish on mobile
- Sound should be opt-in friendly (browsers block autoplay without user gesture — first draw after page load may be silent)
- All visual changes apply to both admin and player views unless noted
