import { test, expect } from '@playwright/test';

test.describe('Smoke E2E', () => {
	test('home page loads successfully', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('body')).toBeVisible();
	});
});
