import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRoomSubscription } from "../use-room-subscription";
import type { RoomDTO } from "@/lib/types";

const mockSubscribe = vi.fn();
const mockPublish = vi.fn();

vi.mock("../use-stomp-client", () => ({
	useStompClient: () => ({
		connected: true,
		subscribe: mockSubscribe,
		publish: mockPublish,
	}),
}));

const mockRoom: RoomDTO = {
	name: "Test Room",
	sessionCode: "ABC123",
	drawnNumbers: [],
	drawnLabels: [],
	drawMode: "MANUAL",
};

describe("useRoomSubscription", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSubscribe.mockReturnValue(vi.fn());
	});

	it("subscribes to the room destination on connect", () => {
		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		expect(mockSubscribe).toHaveBeenCalledWith(
			"/room/ABC123",
			expect.any(Function),
		);
	});

	it("returns initial room when provided", () => {
		const { result } = renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123", initialRoom: mockRoom }),
		);

		expect(result.current.room).toEqual(mockRoom);
	});

	it("updates room when message received", () => {
		let messageCallback: (msg: { body: string }) => void = () => {};
		mockSubscribe.mockImplementation((_dest: string, cb: (msg: { body: string }) => void) => {
			messageCallback = cb;
			return vi.fn();
		});

		const { result } = renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		const updatedRoom: RoomDTO = {
			...mockRoom,
			drawnNumbers: [42],
			drawnLabels: ["N-42"],
		};

		act(() => {
			messageCallback({ body: JSON.stringify(updatedRoom) });
		});

		expect(result.current.room?.drawnNumbers).toEqual([42]);
	});

	it("publishes add-number with correct payload", () => {
		const { result } = renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		act(() => {
			result.current.addNumber("hash-123", 42);
		});

		expect(mockPublish).toHaveBeenCalledWith(
			"/app/add-number",
			JSON.stringify({
				"session-code": "ABC123",
				"creator-hash": "hash-123",
				number: 42,
			}),
		);
	});

	it("publishes draw-number with correct payload", () => {
		const { result } = renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		act(() => {
			result.current.drawNumber("hash-123");
		});

		expect(mockPublish).toHaveBeenCalledWith(
			"/app/draw-number",
			JSON.stringify({
				"session-code": "ABC123",
				"creator-hash": "hash-123",
			}),
		);
	});

	it("reports connected state", () => {
		const { result } = renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		expect(result.current.connected).toBe(true);
	});
});
