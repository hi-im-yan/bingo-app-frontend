# 002 — E2E: Join Room Flow

**Status:** ready
**Assignee:** E2E Writer

## Scenarios
1. Join with valid code → redirects to player room
2. Join with invalid code (404) → shows error
3. Join from home page form → same flow
4. Validation: empty code disables button

## Approach
- Mock `GET /api/v1/room/{code}` responses
- 200 with RoomDTO for valid codes, 404 for invalid
