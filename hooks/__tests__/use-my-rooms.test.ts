import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useMyRooms } from "../use-my-rooms";
import type { RoomDTO } from "@/lib/types";

vi.mock("@/lib/api", () => ({
	api: {
		lookupRooms: vi.fn(),
		deleteRoom: vi.fn(),
	},
	BingoApiError: class BingoApiError extends Error {
		constructor(message: string) {
			super(message);
			this.name = "BingoApiError";
		}
	},
}));

import { api, BingoApiError } from "@/lib/api";

const mockRooms: RoomDTO[] = [
	{
		name: "Room One",
		sessionCode: "AAA111",
		drawnNumbers: [],
		drawnLabels: [],
		drawMode: "MANUAL",
	},
	{
		name: "Room Two",
		sessionCode: "BBB222",
		drawnNumbers: [5],
		drawnLabels: ["B-5"],
		drawMode: "AUTOMATIC",
	},
];

describe("useMyRooms", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("loads rooms on mount and sets loading correctly", async () => {
		vi.mocked(api.lookupRooms).mockResolvedValue(mockRooms);

		const { result } = renderHook(() => useMyRooms());

		expect(result.current.loading).toBe(true);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.rooms).toEqual(mockRooms);
		expect(result.current.error).toBeNull();
		expect(api.lookupRooms).toHaveBeenCalledTimes(1);
	});

	it("sets error when lookupRooms rejects with BingoApiError", async () => {
		vi.mocked(api.lookupRooms).mockRejectedValue(
			new BingoApiError("Unauthorized"),
		);

		const { result } = renderHook(() => useMyRooms());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.error).toBe("Unauthorized");
		expect(result.current.rooms).toEqual([]);
	});

	it("sets generic error when lookupRooms rejects with unknown error", async () => {
		vi.mocked(api.lookupRooms).mockRejectedValue(new Error("Network error"));

		const { result } = renderHook(() => useMyRooms());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.error).toBe("Failed to load rooms");
	});

	it("refresh re-runs lookupRooms", async () => {
		vi.mocked(api.lookupRooms).mockResolvedValue(mockRooms);

		const { result } = renderHook(() => useMyRooms());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			await result.current.refresh();
		});

		expect(api.lookupRooms).toHaveBeenCalledTimes(2);
	});

	it("removeRoom calls deleteRoom and removes room from state", async () => {
		vi.mocked(api.lookupRooms).mockResolvedValue(mockRooms);
		vi.mocked(api.deleteRoom).mockResolvedValue(undefined);

		const { result } = renderHook(() => useMyRooms());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			await result.current.removeRoom("AAA111");
		});

		expect(api.deleteRoom).toHaveBeenCalledWith("AAA111");
		expect(result.current.rooms).toHaveLength(1);
		expect(result.current.rooms[0].sessionCode).toBe("BBB222");
	});

	it("removeRoom sets error on failure", async () => {
		vi.mocked(api.lookupRooms).mockResolvedValue(mockRooms);
		vi.mocked(api.deleteRoom).mockRejectedValue(
			new BingoApiError("Not found"),
		);

		const { result } = renderHook(() => useMyRooms());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await act(async () => {
			try {
				await result.current.removeRoom("AAA111");
			} catch {
				// expected to throw
			}
		});

		expect(result.current.error).toBe("Not found");
		expect(result.current.rooms).toHaveLength(2);
	});
});
