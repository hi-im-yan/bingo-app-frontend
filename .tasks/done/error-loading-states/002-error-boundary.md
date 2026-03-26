# 002 — Build Global Error Boundary

**Status:** ready
**Assignee:** Component Builder
**Blocked by:** —

## Objective
Add a Next.js error boundary at the locale layout level to catch unhandled rendering errors.

## Implementation

### File: `app/[locale]/error.tsx`
- Client component (`"use client"`)
- Receives `error` and `reset` props from Next.js
- UI: centered layout using `PageContainer`, error icon, translated message, retry button
- Log error to console in development
- Uses `useTranslations("errors")` for i18n

### Skeleton
```tsx
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  // Centered error UI with retry button
}
```

## i18n Keys
- `errors.unexpectedError`
- `errors.tryAgain`

## Testing
- Verify error boundary catches rendering errors
- Verify retry button calls `reset()`
- Verify i18n works for both locales
