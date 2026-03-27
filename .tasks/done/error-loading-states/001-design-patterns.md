# 001 — Design Error and Loading State Patterns

**Status:** ready
**Assignee:** Designer
**Blocked by:** —

## Objective
Define the UX patterns for error handling, loading states, and notifications across the app.

## Patterns

### Error Boundary
- Place at `app/[locale]/layout.tsx` level via Next.js `error.tsx` convention
- Fallback UI: centered message with "Something went wrong" + retry button
- Catches unhandled rendering errors only — API/WS errors handled separately

### Loading States
- Continue using `Skeleton` component matching content shapes (already in place for room/admin pages)
- Use Next.js `loading.tsx` convention for route-level loading where appropriate
- No generic spinners — skeletons always match the shape of actual content

### Toast Notifications (Transient Errors)
- Install shadcn `sonner` (toast) component
- Use for: API failures, WS errors, draw failures, delete failures
- Auto-dismiss after 5s, closeable
- Position: bottom-right on desktop, bottom-center on mobile

### Inline Errors (Persistent)
- Form validation errors: keep current react-hook-form pattern
- 404/room not found: keep current full-page error UI
- No creator hash: keep current behavior

### Reconnection Indicator
- Enhance `ConnectionStatus` to show reconnection state (not just disconnected)
- States: connected (hidden), disconnected (warning bar), reconnecting (pulsing bar)
- Show success toast when reconnected after disconnect

## Files to create/modify
- `app/[locale]/error.tsx` — error boundary fallback
- `app/[locale]/layout.tsx` — add Toaster provider
- `components/connection-status.tsx` — enhance with reconnection states
- `hooks/use-stomp-client.ts` — expose reconnection state
- Install: `sonner` via shadcn CLI

## i18n Keys to add
- `errors.unexpectedError` — "Something went wrong"
- `errors.tryAgain` — "Try again"
- `errors.reconnecting` — "Reconnecting..."
- `errors.reconnected` — "Connection restored"
