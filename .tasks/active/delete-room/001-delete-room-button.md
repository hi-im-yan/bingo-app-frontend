# 001 — Delete Room Button

## What was built
DeleteRoomButton component with confirmation dialog. Calls DELETE API, redirects to home on success. Displayed at bottom of admin panel.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| delete-room-button.tsx | components/delete-room-button.tsx | Destructive button + Base UI Dialog confirmation |
| delete-room-button.test.tsx | components/__tests__/delete-room-button.test.tsx | 4 tests |

## Key Details
- Trigger: destructive variant Button, full width, "Close Room" text
- Dialog: title "Are you sure?", description "This action cannot be undone.", Cancel + Confirm buttons
- Confirm: calls `api.deleteRoom(sessionCode)`, redirects to `/` via `useRouter` from `@/i18n/navigation`
- Error: shown inline in dialog as text-destructive paragraph
- Deleting state: disables both Cancel and Confirm buttons
- Uses Base UI Dialog primitives (DialogPrimitive.Root, Trigger, etc.)

## Tests (4)
- Renders "Close Room" button
- Shows confirmation dialog on click
- Calls deleteRoom API and redirects on confirm
- Closes dialog on cancel

## Done Definition
- Delete requires confirmation dialog
- Successful delete redirects to home
- 4 tests passing
- npm run build succeeds
