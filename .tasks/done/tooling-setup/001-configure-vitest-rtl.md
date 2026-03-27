# 001 — Configure Vitest + React Testing Library

## What to build
Install and configure Vitest with React Testing Library as the unit/component test framework.

## Acceptance Criteria
- [ ] vitest, @vitejs/plugin-react, jsdom, @testing-library/react, @testing-library/dom, @testing-library/jest-dom, vite-tsconfig-paths, @vitest/coverage-v8 installed as devDependencies
- [ ] vitest.config.mts exists at project root
- [ ] package.json has "test", "test:watch", "test:coverage" scripts
- [ ] A smoke test file exists and passes
- [ ] Path alias @/* resolves in tests
- [ ] Coverage report generates with npm run test:coverage

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| vitest.config.mts | /vitest.config.mts | Vitest config (jsdom, react plugin, tsconfig paths, coverage) |
| vitest.setup.ts | /vitest.setup.ts | Global test setup (jest-dom matchers) |
| smoke.test.ts | /__tests__/smoke.test.ts | Smoke test to verify setup |

### Files to MODIFY
| File | Change |
|------|--------|
| package.json | Add "test": "vitest run", "test:watch": "vitest", "test:coverage": "vitest run --coverage" |

### Implementation Details

Install:
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom vite-tsconfig-paths @vitest/coverage-v8

vitest.config.mts:
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest.setup.ts'],
		include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
		exclude: ['node_modules', '.next', 'e2e'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary', 'lcov'],
			include: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'hooks/**/*.{ts,tsx}'],
			exclude: ['**/*.test.*', '**/*.spec.*', '**/*.config.*', '**/*.d.ts'],
			thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
		},
	},
});

vitest.setup.ts:
import '@testing-library/jest-dom/vitest';

__tests__/smoke.test.ts:
import { describe, it, expect } from 'vitest';

describe('Smoke test', () => {
	it('verifies test setup works', () => {
		expect(1 + 1).toBe(2);
	});
});

## Conventions
- Tabs for indentation
- devDependencies only
- Hooks run-tests.sh auto-detects vitest — do NOT run tests manually

## TDD Sequence
1. Create config files
2. Write smoke test
3. Add scripts to package.json
4. Install dependencies
5. Run npm test to verify

## Done Definition
- npm test exits 0
- npm run test:coverage generates report
- No lint errors
