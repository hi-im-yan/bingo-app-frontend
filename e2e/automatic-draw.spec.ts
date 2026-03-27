import { test, expect } from "@playwright/test";
import { mockGetRoom, mockWebSocket, setCreatorHash, MOCK_ROOM_AUTOMATIC, MOCK_ROOM_ALL_DRAWN } from "./fixtures";

test.describe("Automatic Draw - Admin Panel", () => {
	test.beforeEach(async ({ page }) => {
		await mockWebSocket(page);
	});

	test("loads admin page with automatic draw button", async ({ page }) => {
		await mockGetRoom(page, "XYZ789", MOCK_ROOM_AUTOMATIC);
		await page.goto("/");
		await setCreatorHash(page, "XYZ789");
		await page.goto("/room/XYZ789/admin");

		await expect(page.getByText("Auto Room")).toBeVisible();
		await expect(page.getByText(/automatic/i)).toBeVisible();
		await expect(page.getByRole("button", { name: /draw number/i })).toBeVisible();
	});

	test("shows all drawn message when all numbers are drawn", async ({ page }) => {
		await mockGetRoom(page, "XYZ789", MOCK_ROOM_ALL_DRAWN);
		await page.goto("/");
		await setCreatorHash(page, "XYZ789");
		await page.goto("/room/XYZ789/admin");

		await expect(page.getByText(/all numbers have been drawn/i)).toBeVisible();
	});
});
