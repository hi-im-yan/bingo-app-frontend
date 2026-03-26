# 001 — Home Page

## What was built
Landing page with Create Room link and inline Join Room form. Server component with client-side JoinRoomForm child.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| page.tsx | app/[locale]/page.tsx | Home page — Create Room link + JoinRoomForm |
| join-room-form.tsx | app/[locale]/join-room-form.tsx | Client component — uppercase monospace input, 6-char limit, navigates to /room/{code} |
| page.test.tsx | app/[locale]/__tests__/page.test.tsx | 5 tests |

## Key Details
- Create Room link uses inline Tailwind classes (NOT buttonVariants — server component can't call client functions)
- JoinRoomForm: uppercase input via CSS + value transform, 6-char maxLength, navigates on submit
- Server/client boundary: page.tsx is server component, join-room-form.tsx is "use client"

## Lessons Learned
- buttonVariants() from "use client" module cannot be called in server components — caught by build-check hook
- vitest/jsdom doesn't enforce server/client boundaries — must rely on `npm run build` to catch

## Tests (5)
- Renders app title and subtitle
- Shows Create Room link
- Shows Join Room form
- Navigates on valid code submission
- Formats input to uppercase

## Done Definition
- Home page renders at `/` with both CTAs
- 5 tests passing
- npm run build succeeds
