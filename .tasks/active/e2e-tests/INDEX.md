# F4.3 — E2E Tests

**Status:** ready
**Blocked by:** — (F4.2 recommended first but not hard blocker)
**Branch:** feature/e2e-tests

## Description
Playwright test suite covering full user flows: create room -> share -> join -> draw numbers -> see updates. Manual and automatic draw modes. Error scenarios (invalid session code, duplicate name).

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
- Playwright already configured (playwright.config.ts exists), chromium installed

## Notes
- Playwright can't fully run in WSL2 without sudo for browser deps (chromium installed without --with-deps)
- E2E tests may need CI environment to run reliably
- Smoke spec already exists at e2e/smoke.spec.ts
