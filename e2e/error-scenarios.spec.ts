import { test, expect } from "@playwright/test";
import { mockGetRoom, mockWebSocket, API_URL } from "./fixtures";

test.describe("Error Scenarios", () => {
	test.beforeEach(async ({ page }) => {
		await mockWebSocket(page);
	});

	test("shows room not found for non-existent room", async ({ page }) => {
		await mockGetRoom(page, "NOPE00", null, 404);
		await page.goto("/room/NOPE00");

		await expect(page.getByText(/not found/i)).toBeVisible();
	});

	test("admin page without creator hash shows error", async ({ page }) => {
		await mockGetRoom(page, "ABC123");
		// Don't set creator hash
		await page.goto("/room/ABC123/admin");

		await expect(page.getByText(/not found/i)).toBeVisible();
	});

	test("shows generic error on network failure", async ({ page }) => {
		await page.route(`${API_URL}/api/v1/room/FAIL00`, (route) => {
			route.abort("connectionrefused");
		});
		await page.goto("/room/FAIL00");

		await expect(page.getByText(/something went wrong/i)).toBeVisible();
	});
});
