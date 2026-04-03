"use client";

import { useEffect, useState, useCallback } from "react";
import type { RoomDTO, AddNumberForm, DrawNumberForm, CorrectNumberForm, NumberCorrectionDTO, PlayerDTO, JoinRoomForm, TiebreakDTO, StartTiebreakForm, TiebreakDrawForm } from "@/lib/types";
import { useStompClient, type WsErrorResponse } from "./use-stomp-client";

interface UseRoomSubscriptionOptions {
	sessionCode: string;
	initialRoom?: RoomDTO;
	onError?: (error: string) => void;
	onServerError?: (error: WsErrorResponse) => void;
	onReconnect?: () => void;
	onCorrection?: (correction: NumberCorrectionDTO) => void;
	onPlayerJoin?: (player: PlayerDTO) => void;
	onTiebreakUpdate?: (tiebreak: TiebreakDTO) => void;
}

interface UseRoomSubscriptionReturn {
	room: RoomDTO | null;
	connected: boolean;
	reconnecting: boolean;
	addNumber: (creatorHash: string, number: number) => void;
	drawNumber: (creatorHash: string) => void;
	correctNumber: (creatorHash: string, newNumber: number) => void;
	joinRoom: (playerName: string) => void;
	startTiebreak: (creatorHash: string, playerCount: number) => void;
	tiebreakDraw: (creatorHash: string, slot: number) => void;
}

export function useRoomSubscription({
	sessionCode,
	initialRoom,
	onError,
	onServerError,
	onReconnect,
	onCorrection,
	onPlayerJoin,
	onTiebreakUpdate,
}: UseRoomSubscriptionOptions): UseRoomSubscriptionReturn {
	const [room, setRoom] = useState<RoomDTO | null>(initialRoom ?? null);

	const { connected, reconnecting, subscribe, publish } = useStompClient({
		onError,
		onServerError,
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

	const startTiebreak = useCallback(
		(creatorHash: string, playerCount: number) => {
			const payload: StartTiebreakForm = {
				"session-code": sessionCode,
				"creator-hash": creatorHash,
				"player-count": playerCount,
			};
			publish("/app/start-tiebreak", JSON.stringify(payload));
		},
		[sessionCode, publish],
	);

	const tiebreakDraw = useCallback(
		(creatorHash: string, slot: number) => {
			const payload: TiebreakDrawForm = {
				"session-code": sessionCode,
				"creator-hash": creatorHash,
				slot,
			};
			publish("/app/tiebreak-draw", JSON.stringify(payload));
		},
		[sessionCode, publish],
	);

	useEffect(() => {
		if (!connected || !sessionCode || !onTiebreakUpdate) return;

		const unsubscribe = subscribe(`/room/${sessionCode}/tiebreak`, (message) => {
			try {
				const tiebreak: TiebreakDTO = JSON.parse(message.body);
				onTiebreakUpdate(tiebreak);
			} catch {
				onError?.("Failed to parse tiebreak update");
			}
		});

		return () => {
			unsubscribe?.();
		};
	}, [connected, sessionCode, subscribe, onTiebreakUpdate, onError]);

	return { room, connected, reconnecting, addNumber, drawNumber, correctNumber, joinRoom, startTiebreak, tiebreakDraw };
}
