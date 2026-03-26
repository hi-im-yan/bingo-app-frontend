# 004 — E2E: Automatic Draw Flow

**Status:** ready
**Assignee:** E2E Writer

## Scenarios
1. Admin page loads with room data, shows automatic draw button
2. "All drawn" message when all numbers are drawn

## Approach
- Mock `GET /api/v1/room/{code}` with automatic mode room
- Set creator hash in localStorage
