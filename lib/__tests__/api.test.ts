import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	api,
	BingoApiError,
	getCreatorHash,
	saveCreatorHash,
	removeCreatorHash,
	BASE_URL,
} from "@/lib/api";
import type { RoomDTO } from "@/lib/types";

const mockRoom: RoomDTO = {
	name: "Test Room",
	sessionCode: "A3X9K2",
	creatorHash: "550e8400-e29b-41d4-a716-446655440000",
	drawnNumbers: [],
	drawnLabels: [],
	drawMode: "MANUAL",
};

describe("localStorage helpers", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("saves and retrieves creator hash", () => {
		saveCreatorHash("ABC123", "hash-value");
		expect(getCreatorHash("ABC123")).toBe("hash-value");
	});

	it("returns null for unknown session", () => {
		expect(getCreatorHash("UNKNOWN")).toBeNull();
	});

	it("removes creator hash", () => {
		saveCreatorHash("ABC123", "hash-value");
		removeCreatorHash("ABC123");
		expect(getCreatorHash("ABC123")).toBeNull();
	});
});

describe("api.createRoom", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("sends POST and saves creator hash", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify(mockRoom), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const room = await api.createRoom({ name: "Test Room" });

		expect(room.sessionCode).toBe("A3X9K2");
		expect(getCreatorHash("A3X9K2")).toBe(mockRoom.creatorHash);
		expect(fetch).toHaveBeenCalledWith(
			`${BASE_URL}/api/v1/room`,
			expect.objectContaining({ method: "POST" }),
		);
	});

	it("throws BingoApiError on 409 conflict", async () => {
		const errorBody = { status: 409, message: "Room name already taken" };
		vi.spyOn(globalThis, "fetch").mockImplementation(() =>
			Promise.resolve(
				new Response(JSON.stringify(errorBody), {
					status: 409,
					headers: { "Content-Type": "application/json" },
				}),
			),
		);

		await expect(api.createRoom({ name: "Taken" })).rejects.toThrow(BingoApiError);
		await expect(api.createRoom({ name: "Taken" })).rejects.toThrow("Room name already taken");
	});
});

describe("api.getRoom", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it("sends GET with creator hash header when available", async () => {
		saveCreatorHash("A3X9K2", "my-hash");

		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify(mockRoom), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		await api.getRoom("A3X9K2");

		const [, options] = vi.mocked(fetch).mock.calls[0];
		const headers = options?.headers as Headers;
		expect(headers.get("X-Creator-Hash")).toBe("my-hash");
	});

	it("sends GET without creator hash when not available", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ ...mockRoom, creatorHash: undefined }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		await api.getRoom("A3X9K2");

		const [, options] = vi.mocked(fetch).mock.calls[0];
		const headers = options?.headers as Headers;
		expect(headers.get("X-Creator-Hash")).toBeNull();
	});

	it("throws BingoApiError on 404", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(
				JSON.stringify({ status: 404, message: "Room not found" }),
				{ status: 404, headers: { "Content-Type": "application/json" } },
			),
		);

		await expect(api.getRoom("NOPE")).rejects.toThrow(BingoApiError);
	});
});

describe("api.deleteRoom", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it("sends DELETE and removes stored hash", async () => {
		saveCreatorHash("A3X9K2", "my-hash");

		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(null, { status: 200, headers: { "content-length": "0" } }),
		);

		await api.deleteRoom("A3X9K2");

		expect(getCreatorHash("A3X9K2")).toBeNull();
		expect(fetch).toHaveBeenCalledWith(
			`${BASE_URL}/api/v1/room/A3X9K2`,
			expect.objectContaining({ method: "DELETE" }),
		);
	});

	it("throws if no creator hash is stored", async () => {
		await expect(api.deleteRoom("A3X9K2")).rejects.toThrow("No creator hash found");
	});
});

describe("api.getQrCodeUrl", () => {
	it("returns correct URL", () => {
		expect(api.getQrCodeUrl("A3X9K2")).toBe(`${BASE_URL}/api/v1/room/A3X9K2/qrcode`);
	});
});

describe("BingoApiError", () => {
	it("has name, status, and message", () => {
		const error = new BingoApiError(404, "Not found");
		expect(error.name).toBe("BingoApiError");
		expect(error.status).toBe(404);
		expect(error.message).toBe("Not found");
		expect(error).toBeInstanceOf(Error);
	});
});
