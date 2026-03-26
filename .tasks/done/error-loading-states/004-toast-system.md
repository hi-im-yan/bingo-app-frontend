# 004 — Build Toast/Notification System

**Status:** ready
**Assignee:** Component Builder
**Blocked by:** 001

## Objective
Add a toast notification system for transient errors. Replace inline error messages where appropriate.

## Implementation

### Step 1: Install sonner via shadcn
```bash
npx shadcn@latest add sonner
```
This installs the `sonner` package and creates `components/ui/sonner.tsx` with the `Toaster` component.

### Step 2: Add Toaster to layout
**File:** `app/[locale]/layout.tsx`
- Import `Toaster` from `@/components/ui/sonner`
- Add `<Toaster />` inside the body, after `{children}`
- Since `Toaster` is a client component and the layout is a server component, this is fine — React handles the boundary

### Step 3: Use toast in existing error handlers
Replace inline error state patterns with toast calls where errors are transient:

**Admin page (`app/[locale]/room/[code]/admin/page.tsx`):**
- WS errors (onError callback): show toast instead of silently failing
- Keep 404/missing hash as full-page errors (persistent)

**Player room page (`app/[locale]/room/[code]/page.tsx`):**
- WS errors: show toast
- Keep 404 as full-page error

**Delete room (`components/delete-room-button.tsx`):**
- Delete failure: show error toast instead of/in addition to inline error

**Manual/Automatic draw panels:**
- Draw failures surfaced via WS error callback → toast

### Step 4: Add toast for reconnection success
- When WS reconnects after disconnect, show success toast "Connection restored"

## i18n
Toast messages should use translation keys from the `errors` namespace.

## Testing
- Verify Toaster renders without hydration issues
- Verify toast appears on API/WS errors
- Verify toast auto-dismisses
- Verify toast works in both locales
