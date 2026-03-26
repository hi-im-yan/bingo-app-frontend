import { test, expect } from "@playwright/test";
import { mockGetRoom, mockWebSocket, MOCK_ROOM_MANUAL, API_URL } from "./fixtures";

test.describe("Join Room", () => {
	test.beforeEach(async ({ page }) => {
		await mockWebSocket(page);
	});

	test("joins a room with valid code from join page", async ({ page }) => {
		await mockGetRoom(page, "ABC123");

		await page.goto("/join");
		await page.getByPlaceholder("ABC123").fill("ABC123");
		await page.getByRole("button", { name: /join/i }).click();

		await expect(page).toHaveURL(/\/room\/ABC123/);
	});

	test("shows error for invalid room code (404)", async ({ page }) => {
		await mockGetRoom(page, "BADCOD", null, 404);

		await page.goto("/join");
		await page.getByPlaceholder("ABC123").fill("BADCOD");
		await page.getByRole("button", { name: /join/i }).click();

		await expect(page.getByText(/not found/i)).toBeVisible();
	});

	test("join button is disabled when code is empty", async ({ page }) => {
		await page.goto("/join");

		const joinButton = page.getByRole("button", { name: /join/i });
		await expect(joinButton).toBeDisabled();
	});

	test("joins a room from home page form", async ({ page }) => {
		await mockGetRoom(page, "ABC123");

		await page.goto("/");
		await page.getByPlaceholder(/room code/i).fill("ABC123");
		await page.getByRole("button", { name: /join/i }).click();

		await expect(page).toHaveURL(/\/room\/ABC123/);
	});
});
