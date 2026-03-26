# 003 — Verify Hooks Integration

## What to build
Verify project hooks (run-tests.sh, coverage-check.sh, lint-fix.sh) work correctly with Vitest setup. Fix if needed.

## Acceptance Criteria
- [ ] run-tests.sh detects vitest and runs tests on .ts/.tsx edits
- [ ] coverage-check.sh parses vitest coverage output correctly
- [ ] lint-fix.sh runs ESLint --fix with flat config (eslint.config.mjs)
- [ ] Hooks skip config files and .d.ts files

## Technical Spec

### Files to MODIFY (only if fixes needed)
| File | Change |
|------|--------|
| .claude/hooks/run-tests.sh | Fix vitest detection if needed |
| .claude/hooks/coverage-check.sh | Fix coverage parsing if needed |

### Files to READ
| File | What to check |
|------|---------------|
| .claude/hooks/run-tests.sh | vitest detection: grep -q '"vitest"' package.json |
| .claude/hooks/coverage-check.sh | "All files" line parsing from vitest text reporter |
| .claude/hooks/lint-fix.sh | ESLint detection with flat config |
| .claude/settings.json | Hooks wired correctly |
| package.json | "vitest" string exists in devDependencies |

### Verification Steps
1. run-tests.sh: grep -q '"vitest"' package.json must return true
2. coverage-check.sh: npx vitest run --coverage output must contain "All files |" line
3. lint-fix.sh: npx eslint --fix works with eslint.config.mjs

## Done Definition
- All hooks work correctly with Vitest + ESLint 9
- No manual intervention needed
