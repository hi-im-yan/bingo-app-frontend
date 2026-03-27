# 003 — Build Loading Skeletons

**Status:** ready
**Assignee:** Component Builder
**Blocked by:** 001

## Objective
Review and polish existing loading skeletons. Add `loading.tsx` files for route-level loading where beneficial.

## Current State
- Player room page: 3-skeleton layout (title, ball, board) — already implemented
- Admin page: same 3-skeleton layout — already implemented
- Create/Join pages: no skeletons (form-based, load instantly)

## Implementation

### Review existing skeletons
- Player room and admin page already have skeleton loading states
- Verify they closely match the actual rendered content shapes
- Adjust dimensions/layout if actual content has changed since initial implementation

### Add `loading.tsx` (optional, evaluate)
- `app/[locale]/room/[code]/loading.tsx` — route-level skeleton for player room
- `app/[locale]/room/[code]/admin/loading.tsx` — route-level skeleton for admin
- Note: current pages are client components doing client-side fetches, so `loading.tsx` may not trigger. Evaluate whether moving the fetch to a server component wrapper would be cleaner, or if the current useState-based approach is sufficient.

## Decision
Keep current client-side loading approach (useState + Skeleton) since the pages need WebSocket interactivity and are already client components. No `loading.tsx` files needed — they only apply to server component async rendering.

## Testing
- Verify skeleton layout matches actual content proportions
- Verify smooth transition from skeleton to content
