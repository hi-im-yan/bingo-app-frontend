# Feature: Number Correction (Manual Mode)

**Status**: ready
**Blocked by feature**: —
**Branch**: feature/number-correction

## Description

Allow the GM to correct the last drawn number in MANUAL mode rooms. Inline button near the last drawn number opens a number grid picker with confirmation dialog. Players receive a warning toast about the correction.

## Backend Contract

### Send — `/app/correct-number`
```json
{ "session-code": "A3X9K2", "creator-hash": "uuid", "new-number": 12 }
```
Constraints: MANUAL only, at least one number drawn, new-number 1-75 and not already drawn.

### Subscribe — `/room/{sessionCode}/corrections`
```json
{ "oldNumber": 42, "oldLabel": "N-42", "newNumber": 12, "newLabel": "B-12", "message": "GM changed N-42 to B-12" }
```
Note: `/room/{sessionCode}` also receives updated RoomDTO on correction — board stays in sync. `/corrections` is for toast alerts only.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Types + hook (correctNumber, /corrections subscription) | done | — | Logic Writer |
| 002 | Correction UI in admin (inline button, grid picker, confirm dialog) | ready | 001 | Component Builder |
| 003 | Player + admin correction toasts | ready | 001 | Component Builder |
| 004 | i18n translations (pt + en) | blocked | 002, 003 | Component Builder |

## Decisions
- Inline button near the last drawn number to trigger correction
- Confirmation dialog before sending the correction
- Warning toast for players on correction
- Reuse existing number grid for picking the replacement number
