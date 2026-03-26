# 003 — E2E: Manual Draw Flow

**Status:** ready
**Assignee:** E2E Writer

## Scenarios
1. Admin page loads with room data, shows manual draw panel
2. Click a number → sends WS message (verify button becomes disabled)
3. Keyboard navigation works on number grid

## Approach
- Mock `GET /api/v1/room/{code}` with manual mode room
- Set creator hash in localStorage before navigating
- WS interactions are harder to mock in E2E — focus on UI state
