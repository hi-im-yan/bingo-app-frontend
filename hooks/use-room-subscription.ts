"use client";

import { useEffect, useState, useCallback } from "react";
import type { RoomDTO, AddNumberForm, DrawNumberForm, CorrectNumberForm, NumberCorrectionDTO, PlayerDTO, JoinRoomForm } from "@/lib/types";
import { useStompClient } from "./use-stomp-client";

interface UseRoomSubscriptionOptions {
	sessionCode: string;
	initialRoom?: RoomDTO;
	onError?: (error: string) => void;
	onReconnect?: () => void;
	onCorrection?: (correction: NumberCorrectionDTO) => void;
	onPlayerJoin?: (player: PlayerDTO) => void;
}

interface UseRoomSubscriptionReturn {
	room: RoomDTO | null;
	connected: boolean;
	reconnecting: boolean;
	addNumber: (creatorHash: string, number: number) => void;
	drawNumber: (creatorHash: string) => void;
	correctNumber: (creatorHash: string, newNumber: number) => void;
	joinRoom: (playerName: string) => void;
}

export function useRoomSubscription({
	sessionCode,
	initialRoom,
	onError,
	onReconnect,
	onCorrection,
	onPlayerJoin,
}: UseRoomSubscriptionOptions): UseRoomSubscriptionReturn {
	const [room, setRoom] = useState<RoomDTO | null>(initialRoom ?? null);

	const { connected, reconnecting, subscribe, publish } = useStompClient({
		onError,
		onReconnect,
	});

	useEffect(() => {
		if (!connected || !sessionCode) return;

		const unsubscribe = subscribe(`/room/${sessionCode}`, (message) => {
			try {
				const updated: RoomDTO = JSON.parse(message.body);
				setRoom(updated);
			} catch {
				onError?.("Failed to parse room update");
			}
		});

		return () => {
			unsubscribe?.();
		};
	}, [connected, sessionCode, subscribe, onError]);

	const addNumber = useCallback(
		(creatorHash: string, number: number) => {
			const payload: AddNumberForm = {
				"session-code": sessionCode,
				"creator-hash": creatorHash,
				number,
			};
			publish("/app/add-number", JSON.stringify(payload));
		},
		[sessionCode, publish],
	);

	const drawNumber = useCallback(
		(creatorHash: string) => {
			const payload: DrawNumberForm = {
				"session-code": sessionCode,
				"creator-hash": creatorHash,
			};
			publish("/app/draw-number", JSON.stringify(payload));
		},
		[sessionCode, publish],
	);

	const correctNumber = useCallback(
		(creatorHash: string, newNumber: number) => {
			const payload: CorrectNumberForm = {
				"session-code": sessionCode,
				"creator-hash": creatorHash,
				"new-number": newNumber,
			};
			publish("/app/correct-number", JSON.stringify(payload));
		},
		[sessionCode, publish],
	);

	useEffect(() => {
		if (!connected || !sessionCode || !onCorrection) return;

		const unsubscribe = subscribe(`/room/${sessionCode}/corrections`, (message) => {
			try {
				const correction: NumberCorrectionDTO = JSON.parse(message.body);
				onCorrection(correction);
			} catch {
				onError?.("Failed to parse correction update");
			}
		});

		return () => {
			unsubscribe?.();
		};
	}, [connected, sessionCode, subscribe, onCorrection, onError]);

	const joinRoom = useCallback(
		(playerName: string) => {
			const payload: JoinRoomForm = {
				"session-code": sessionCode,
				"player-name": playerName,
			};
			publish("/app/join-room", JSON.stringify(payload));
		},
		[sessionCode, publish],
	);

	useEffect(() => {
		if (!connected || !sessionCode || !onPlayerJoin) return;

		const unsubscribe = subscribe(`/room/${sessionCode}/players`, (message) => {
			try {
				const player: PlayerDTO = JSON.parse(message.body);
				onPlayerJoin(player);
			} catch {
				onError?.("Failed to parse player update");
			}
		});

		return () => {
			unsubscribe?.();
		};
	}, [connected, sessionCode, subscribe, onPlayerJoin, onError]);

	return { room, connected, reconnecting, addNumber, drawNumber, correctNumber, joinRoom };
}
