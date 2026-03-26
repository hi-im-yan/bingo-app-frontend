import { test, expect } from "@playwright/test";
import { mockGetRoom, mockWebSocket, setCreatorHash, MOCK_ROOM_MANUAL, MOCK_ROOM_WITH_NUMBERS } from "./fixtures";

test.describe("Manual Draw - Admin Panel", () => {
	test.beforeEach(async ({ page }) => {
		await mockWebSocket(page);
	});

	test("loads admin page with manual draw panel", async ({ page }) => {
		await mockGetRoom(page, "ABC123", MOCK_ROOM_MANUAL);
		await page.goto("/");
		await setCreatorHash(page, "ABC123");
		await page.goto("/room/ABC123/admin");

		await expect(page.getByText("Test Room")).toBeVisible();
		await expect(page.getByText(/manual/i)).toBeVisible();
		await expect(page.getByRole("grid", { name: /select/i })).toBeVisible();
	});

	test("number grid shows drawn numbers as disabled", async ({ page }) => {
		await mockGetRoom(page, "ABC123", MOCK_ROOM_WITH_NUMBERS);
		await page.goto("/");
		await setCreatorHash(page, "ABC123");
		await page.goto("/room/ABC123/admin");

		// Number 1 is drawn — button should be disabled
		const button1 = page.getByRole("button", { name: "1" });
		await expect(button1).toBeDisabled();

		// Number 2 is not drawn — button should be enabled
		const button2 = page.getByRole("button", { name: "2" });
		await expect(button2).toBeEnabled();
	});

	test("keyboard navigation works on number grid", async ({ page }) => {
		await mockGetRoom(page, "ABC123", MOCK_ROOM_MANUAL);
		await page.goto("/");
		await setCreatorHash(page, "ABC123");
		await page.goto("/room/ABC123/admin");

		// Focus the grid and navigate
		const grid = page.getByRole("grid", { name: /select/i });
		await grid.locator("button").first().focus();

		// Press ArrowDown — should move to next number in column
		await page.keyboard.press("ArrowDown");
		const focused = page.locator("button:focus");
		await expect(focused).toHaveAttribute("aria-label", "2");
	});
});
