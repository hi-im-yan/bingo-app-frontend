# 001 — Share Room Section

## What was built
ShareRoomSection component displayed on admin panel. Shows QR code image from backend, session code with copy-to-clipboard button.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| share-room-section.tsx | components/share-room-section.tsx | QR code image + session code + copy button |
| share-room-section.test.tsx | components/__tests__/share-room-section.test.tsx | 4 tests |

## Key Details
- QR code: `<img src={api.getQrCodeUrl(sessionCode)}>` — no fetch, direct img src
- Session code: monospace bold tracking-widest in muted bg pill
- Copy button: calls `navigator.clipboard.writeText(sessionCode)`, shows "Copied!" for 2 seconds
- Wrapped in GameCard with "Share Room" title
- eslint-disable for @next/next/no-img-element (external backend image)

## Tests (4)
- Shows "Share Room" title
- Displays session code text
- Renders QR code image with correct src
- Shows "Copied!" feedback after clicking copy

## Done Definition
- QR code loads from backend endpoint
- Copy to clipboard works with visual feedback
- 4 tests passing
- npm run build succeeds
