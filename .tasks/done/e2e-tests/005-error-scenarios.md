# 005 — E2E: Error Scenarios

**Status:** ready
**Assignee:** E2E Writer

## Scenarios
1. Navigate to non-existent room → shows "Room not found"
2. Admin page without creator hash → shows error
3. Create room with duplicate name → shows conflict error
4. Network error on room fetch → shows generic error

## Approach
- Mock API routes to return error responses
