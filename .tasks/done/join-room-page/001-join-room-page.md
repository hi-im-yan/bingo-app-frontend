# 001 — Join Room Page

## What was built
Standalone join page at `/join` with large monospace input, API verification before navigation, 404 handling.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| page.tsx | app/[locale]/join/page.tsx | Client component — code input, API verify, navigate to /room/{code} |
| page.test.tsx | app/[locale]/join/__tests__/page.test.tsx | 5 tests |

## Key Details
- Uppercase monospace input, 6-char limit
- Calls api.getRoom before navigating to verify room exists
- 404 from API shown inline as error message
- Uses useTranslations("joinRoom") for all text

## Tests (5)
- Renders title and input
- Formats input to uppercase
- Verifies room via API and navigates on success
- Shows error for invalid code
- Shows 404 error when room not found

## Done Definition
- Join page verifies room before navigation
- 5 tests passing
- npm run build succeeds
