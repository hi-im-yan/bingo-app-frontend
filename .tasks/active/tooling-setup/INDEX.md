# F0.1 — Tooling Setup

**Status:** ready
**Blocked by:** —
**Branch:** feature/tooling-setup

## Description
Install and configure Vitest + React Testing Library for unit/component tests and Playwright for E2E tests. Add test scripts to package.json. Verify project hooks (run-tests.sh, coverage-check.sh) work correctly.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Configure Vitest + React Testing Library | ready | — | Logic Writer |
| 002 | Configure Playwright | ready | — | E2E Writer |
| 003 | Verify hooks integration | ready | 001 | Logic Writer |

## Decisions
- Vitest over Jest: faster, native ESM, better DX with Vite ecosystem
- React Testing Library for component tests (user-centric testing)
- Playwright over Cypress: better multi-browser support, faster execution
