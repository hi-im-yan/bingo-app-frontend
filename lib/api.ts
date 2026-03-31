import type { RoomDTO, CreateRoomForm, ApiError, PlayerDTO } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

class BingoApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "BingoApiError";
		this.status = status;
	}
}

function getCreatorHash(sessionCode: string): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(`creator-hash:${sessionCode}`);
}

function saveCreatorHash(sessionCode: string, hash: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(`creator-hash:${sessionCode}`, hash);
}

function removeCreatorHash(sessionCode: string): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(`creator-hash:${sessionCode}`);
}

async function request<T>(
	path: string,
	options: RequestInit & { sessionCode?: string } = {},
): Promise<T> {
	const { sessionCode, ...fetchOptions } = options;
	const headers = new Headers(fetchOptions.headers);

	if (!headers.has("Content-Type") && fetchOptions.body) {
		headers.set("Content-Type", "application/json");
	}

	if (sessionCode) {
		const hash = getCreatorHash(sessionCode);
		if (hash) {
			headers.set("X-Creator-Hash", hash);
		}
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		...fetchOptions,
		headers,
	});

	if (!response.ok) {
		let error: ApiError;
		try {
			error = await response.json();
		} catch {
			error = { status: response.status, message: response.statusText };
		}
		throw new BingoApiError(error.status, error.message);
	}

	if (response.status === 204 || response.headers.get("content-length") === "0") {
		return undefined as T;
	}

	return response.json();
}

async function createRoom(form: CreateRoomForm): Promise<RoomDTO> {
	const room = await request<RoomDTO>("/api/v1/room", {
		method: "POST",
		body: JSON.stringify(form),
	});

	if (room.creatorHash) {
		saveCreatorHash(room.sessionCode, room.creatorHash);
	}

	return room;
}

async function getRoom(sessionCode: string): Promise<RoomDTO> {
	return request<RoomDTO>(`/api/v1/room/${sessionCode}`, {
		sessionCode,
	});
}

async function deleteRoom(sessionCode: string): Promise<void> {
	const hash = getCreatorHash(sessionCode);
	if (!hash) {
		throw new BingoApiError(400, "No creator hash found for this room");
	}

	await request<void>(`/api/v1/room/${sessionCode}`, {
		method: "DELETE",
		sessionCode,
	});

	removeCreatorHash(sessionCode);
}

async function getPlayers(sessionCode: string): Promise<PlayerDTO[]> {
	return request<PlayerDTO[]>(`/api/v1/room/${sessionCode}/players`, {
		sessionCode, // triggers X-Creator-Hash header
	});
}

function getQrCodeUrl(sessionCode: string): string {
	return `${BASE_URL}/api/v1/room/${sessionCode}/qrcode`;
}

export const api = {
	createRoom,
	getRoom,
	deleteRoom,
	getQrCodeUrl,
	getPlayers,
};

export {
	BingoApiError,
	getCreatorHash,
	saveCreatorHash,
	removeCreatorHash,
	BASE_URL,
};
