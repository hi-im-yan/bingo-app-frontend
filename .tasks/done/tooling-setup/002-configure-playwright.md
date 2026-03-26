# 002 — Configure Playwright

## What to build
Install and configure Playwright for E2E testing with dev server integration.

## Acceptance Criteria
- [ ] @playwright/test installed as devDependency
- [ ] playwright.config.ts exists at project root
- [ ] webServer config points to npm run dev on port 3000
- [ ] package.json has "test:e2e" script
- [ ] Smoke E2E test passes
- [ ] .gitignore includes playwright artifacts

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| playwright.config.ts | /playwright.config.ts | Playwright configuration |
| e2e/smoke.spec.ts | /e2e/smoke.spec.ts | Smoke E2E test |

### Files to MODIFY
| File | Change |
|------|--------|
| package.json | Add "test:e2e": "playwright test", "test:e2e:ui": "playwright test --ui" |
| .gitignore | Add /test-results/, /playwright-report/, /blob-report/, /playwright/.cache/ |

### Implementation Details

Install:
npm install -D @playwright/test
npx playwright install --with-deps chromium

playwright.config.ts:
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
	],
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:3000',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});

e2e/smoke.spec.ts:
import { test, expect } from '@playwright/test';

test.describe('Smoke E2E', () => {
	test('home page loads successfully', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('body')).toBeVisible();
	});
});

.gitignore additions:
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/

## Conventions
- Tabs for indentation
- E2E tests in e2e/ directory, separate from unit tests
- Install chromium only for CI speed

## TDD Sequence
1. Install Playwright + chromium
2. Create playwright.config.ts
3. Write smoke E2E test
4. Add scripts to package.json
5. Run npm run test:e2e to verify

## Done Definition
- npm run test:e2e exits 0
- Dev server starts automatically during E2E run
- .gitignore updated
