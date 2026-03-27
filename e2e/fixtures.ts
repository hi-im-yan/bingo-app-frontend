import { type Page } from "@playwright/test";

export const API_URL = "http://localhost:8080";

export const MOCK_ROOM_MANUAL = {
	sessionCode: "ABC123",
	name: "Test Room",
	description: "A test room",
	drawMode: "MANUAL",
	drawnNumbers: [],
	creatorHash: "test-creator-hash-123",
	createdAt: "2026-03-26T10:00:00Z",
};

export const MOCK_ROOM_AUTOMATIC = {
	...MOCK_ROOM_MANUAL,
	sessionCode: "XYZ789",
	name: "Auto Room",
	drawMode: "AUTOMATIC",
};

export const MOCK_ROOM_WITH_NUMBERS = {
	...MOCK_ROOM_MANUAL,
	drawnNumbers: [1, 16, 31, 46, 61, 5, 20, 35],
};

export const MOCK_ROOM_ALL_DRAWN = {
	...MOCK_ROOM_AUTOMATIC,
	drawnNumbers: Array.from({ length: 75 }, (_, i) => i + 1),
};

export async function mockCreateRoom(page: Page, response = MOCK_ROOM_MANUAL, status = 200) {
	await page.route(`${API_URL}/api/v1/room`, (route, request) => {
		if (request.method() === "POST") {
			route.fulfill({
				status,
				contentType: "application/json",
				body: JSON.stringify(response),
			});
		} else {
			route.continue();
		}
	});
}

export async function mockGetRoom(page: Page, code: string, response: object | null = MOCK_ROOM_MANUAL, status = 200) {
	await page.route(`${API_URL}/api/v1/room/${code}`, (route, request) => {
		if (request.method() === "GET") {
			if (status === 200) {
				route.fulfill({
					status,
					contentType: "application/json",
					body: JSON.stringify(response),
				});
			} else {
				route.fulfill({
					status,
					contentType: "application/json",
					body: JSON.stringify({ status, message: "Not found" }),
				});
			}
		} else {
			route.continue();
		}
	});
}

export async function mockDeleteRoom(page: Page, code: string, status = 204) {
	await page.route(`${API_URL}/api/v1/room/${code}`, (route, request) => {
		if (request.method() === "DELETE") {
			route.fulfill({ status });
		} else {
			route.continue();
		}
	});
}

export async function setCreatorHash(page: Page, code: string, hash = "test-creator-hash-123") {
	await page.evaluate(
		({ code, hash }) => localStorage.setItem(`creator-hash:${code}`, hash),
		{ code, hash },
	);
}

export async function mockWebSocket(page: Page) {
	// Block SockJS requests to avoid connection errors in tests
	await page.route("**/bingo-connect/**", (route) => {
		route.abort();
	});
}
