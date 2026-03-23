# F4.3 — E2E Tests

**Status:** blocked
**Blocked by:** F4.2 (responsive-a11y)
**Branch:** feature/e2e-tests

## Description
Playwright test suite covering full user flows: create room → share → join → draw numbers → see updates. Manual and automatic draw modes. Error scenarios (invalid session code, duplicate name).

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | E2E: room creation flow | ready | — | E2E Writer |
| 002 | E2E: join room flow | ready | — | E2E Writer |
| 003 | E2E: manual draw flow | ready | — | E2E Writer |
| 004 | E2E: automatic draw flow | ready | — | E2E Writer |
| 005 | E2E: error scenarios | ready | — | E2E Writer |

## Decisions
- Tests run against a real or mocked backend (decide during implementation)
- Cover both happy path and error scenarios
