import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRoomSubscription } from "../use-room-subscription";
import type { RoomDTO, NumberCorrectionDTO, PlayerDTO } from "@/lib/types";

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

	it("publishes correct-number with correct payload", () => {
		const { result } = renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		act(() => {
			result.current.correctNumber("hash-123", 42);
		});

		expect(mockPublish).toHaveBeenCalledWith(
			"/app/correct-number",
			JSON.stringify({
				"session-code": "ABC123",
				"creator-hash": "hash-123",
				"new-number": 42,
			}),
		);
	});

	it("subscribes to corrections topic when onCorrection is provided", () => {
		const onCorrection = vi.fn();
		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123", onCorrection }),
		);

		expect(mockSubscribe).toHaveBeenCalledWith(
			"/room/ABC123/corrections",
			expect.any(Function),
		);
	});

	it("does NOT subscribe to corrections topic when onCorrection is omitted", () => {
		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		const correctionsCalls = mockSubscribe.mock.calls.filter(
			([dest]) => dest === "/room/ABC123/corrections",
		);
		expect(correctionsCalls).toHaveLength(0);
	});

	it("calls onCorrection callback with parsed NumberCorrectionDTO", () => {
		const onCorrection = vi.fn();
		let correctionsCallback: (msg: { body: string }) => void = () => {};

		mockSubscribe.mockImplementation((dest: string, cb: (msg: { body: string }) => void) => {
			if (dest === "/room/ABC123/corrections") {
				correctionsCallback = cb;
			}
			return vi.fn();
		});

		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123", onCorrection }),
		);

		const correction: NumberCorrectionDTO = {
			oldNumber: 5,
			oldLabel: "B-5",
			newNumber: 10,
			newLabel: "B-10",
			message: "Number corrected from B-5 to B-10",
		};

		act(() => {
			correctionsCallback({ body: JSON.stringify(correction) });
		});

		expect(onCorrection).toHaveBeenCalledWith(correction);
	});

	it("publishes join-room with correct payload", () => {
		const { result } = renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		act(() => {
			result.current.joinRoom("Alice");
		});

		expect(mockPublish).toHaveBeenCalledWith(
			"/app/join-room",
			JSON.stringify({
				"session-code": "ABC123",
				"player-name": "Alice",
			}),
		);
	});

	it("subscribes to players topic when onPlayerJoin is provided", () => {
		const onPlayerJoin = vi.fn();
		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123", onPlayerJoin }),
		);

		expect(mockSubscribe).toHaveBeenCalledWith(
			"/room/ABC123/players",
			expect.any(Function),
		);
	});

	it("does NOT subscribe to players topic when onPlayerJoin is omitted", () => {
		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123" }),
		);

		const playersCalls = mockSubscribe.mock.calls.filter(
			([dest]) => dest === "/room/ABC123/players",
		);
		expect(playersCalls).toHaveLength(0);
	});

	it("calls onPlayerJoin callback with parsed PlayerDTO", () => {
		const onPlayerJoin = vi.fn();
		let playersCallback: (msg: { body: string }) => void = () => {};

		mockSubscribe.mockImplementation((dest: string, cb: (msg: { body: string }) => void) => {
			if (dest === "/room/ABC123/players") {
				playersCallback = cb;
			}
			return vi.fn();
		});

		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123", onPlayerJoin }),
		);

		const player: PlayerDTO = {
			name: "Alice",
			joinDateTime: "2026-03-30T10:00:00Z",
		};

		act(() => {
			playersCallback({ body: JSON.stringify(player) });
		});

		expect(onPlayerJoin).toHaveBeenCalledWith(player);
	});

	it("calls onError when players message fails to parse", () => {
		const onPlayerJoin = vi.fn();
		const onError = vi.fn();
		let playersCallback: (msg: { body: string }) => void = () => {};

		mockSubscribe.mockImplementation((dest: string, cb: (msg: { body: string }) => void) => {
			if (dest === "/room/ABC123/players") {
				playersCallback = cb;
			}
			return vi.fn();
		});

		renderHook(() =>
			useRoomSubscription({ sessionCode: "ABC123", onPlayerJoin, onError }),
		);

		act(() => {
			playersCallback({ body: "not valid json {{" });
		});

		expect(onError).toHaveBeenCalledWith("Failed to parse player update");
		expect(onPlayerJoin).not.toHaveBeenCalled();
	});
});
