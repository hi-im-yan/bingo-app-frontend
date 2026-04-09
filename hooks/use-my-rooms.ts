import { useCallback, useEffect, useState } from "react";
import { api, BingoApiError } from "@/lib/api";
import type { RoomDTO } from "@/lib/types";

interface UseMyRoomsReturn {
	rooms: RoomDTO[];
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	removeRoom: (sessionCode: string) => Promise<void>;
}

export function useMyRooms(): UseMyRoomsReturn {
	const [rooms, setRooms] = useState<RoomDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await api.lookupRooms();
			setRooms(result);
		} catch (e) {
			setError(e instanceof BingoApiError ? e.message : "Failed to load rooms");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	const removeRoom = useCallback(async (sessionCode: string) => {
		setError(null);
		try {
			await api.deleteRoom(sessionCode);
			setRooms((prev) => prev.filter((r) => r.sessionCode !== sessionCode));
		} catch (e) {
			setError(e instanceof BingoApiError ? e.message : "Failed to delete room");
			throw e;
		}
	}, []);

	return { rooms, loading, error, refresh, removeRoom };
}
