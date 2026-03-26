# 001 — E2E: Room Creation Flow

**Status:** ready
**Assignee:** E2E Writer

## Scenarios
1. Create room with valid name (manual mode) → redirects to admin page
2. Create room with valid name (automatic mode) → redirects to admin page
3. Validation: empty name shows error
4. Server error: 409 duplicate name shows inline error

## Approach
- Mock `POST /api/v1/room` via Playwright route interception
- Mock returns a RoomDTO with sessionCode
- Verify redirect to `/room/{code}/admin`
- Verify form validation messages
