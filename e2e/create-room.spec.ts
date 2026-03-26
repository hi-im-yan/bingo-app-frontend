import { test, expect } from "@playwright/test";
import { mockCreateRoom, mockWebSocket, MOCK_ROOM_MANUAL, API_URL } from "./fixtures";

test.describe("Create Room", () => {
	test.beforeEach(async ({ page }) => {
		await mockWebSocket(page);
	});

	test("creates a room with manual mode and redirects to admin", async ({ page }) => {
		await mockCreateRoom(page);
		// Also mock the admin page room fetch
		await page.route(`${API_URL}/api/v1/room/${MOCK_ROOM_MANUAL.sessionCode}`, (route) => {
			route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(MOCK_ROOM_MANUAL),
			});
		});

		await page.goto("/create");
		await page.getByLabel(/room name/i).fill("Test Room");
		await page.getByRole("radio", { name: /manual/i }).click();
		await page.getByRole("button", { name: /create room/i }).click();

		await expect(page).toHaveURL(/\/room\/ABC123\/admin/);
	});

	test("creates a room with automatic mode", async ({ page }) => {
		const autoRoom = { ...MOCK_ROOM_MANUAL, drawMode: "AUTOMATIC" };
		await mockCreateRoom(page, autoRoom);
		await page.route(`${API_URL}/api/v1/room/${MOCK_ROOM_MANUAL.sessionCode}`, (route) => {
			route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(autoRoom),
			});
		});

		await page.goto("/create");
		await page.getByLabel(/room name/i).fill("Test Room");
		await page.getByRole("radio", { name: /automatic/i }).click();
		await page.getByRole("button", { name: /create room/i }).click();

		await expect(page).toHaveURL(/\/room\/ABC123\/admin/);
	});

	test("shows validation error for empty name", async ({ page }) => {
		await page.goto("/create");

		// The create button should be present
		const createButton = page.getByRole("button", { name: /create room/i });
		await expect(createButton).toBeVisible();

		// Submit without filling name
		await createButton.click();

		// Should stay on create page (no redirect)
		await expect(page).toHaveURL(/\/create/);
	});

	test("shows conflict error for duplicate name", async ({ page }) => {
		await mockCreateRoom(
			page,
			{ status: 409, message: "Room name already exists" },
			409,
		);

		await page.goto("/create");
		await page.getByLabel(/room name/i).fill("Duplicate Room");
		await page.getByRole("button", { name: /create room/i }).click();

		await expect(page.getByText(/already exists/i)).toBeVisible();
	});
});
