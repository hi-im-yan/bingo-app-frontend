"use client";

import { useEffect, useState, useCallback } from "react";
import type { RoomDTO, AddNumberForm, DrawNumberForm } from "@/lib/types";
import { useStompClient } from "./use-stomp-client";

interface UseRoomSubscriptionOptions {
	sessionCode: string;
	initialRoom?: RoomDTO;
	onError?: (error: string) => void;
	onReconnect?: () => void;
}

interface UseRoomSubscriptionReturn {
	room: RoomDTO | null;
	connected: boolean;
	reconnecting: boolean;
	addNumber: (creatorHash: string, number: number) => void;
	drawNumber: (creatorHash: string) => void;
}

export function useRoomSubscription({
	sessionCode,
	initialRoom,
	onError,
	onReconnect,
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

	return { room, connected, reconnecting, addNumber, drawNumber };
}
