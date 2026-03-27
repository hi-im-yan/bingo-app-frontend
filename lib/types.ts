export type DrawMode = "MANUAL" | "AUTOMATIC";

export type BingoLetter = "B" | "I" | "N" | "G" | "O";

export interface RoomDTO {
	name: string;
	description?: string;
	sessionCode: string;
	creatorHash?: string;
	drawnNumbers: number[];
	drawnLabels: string[];
	drawMode: DrawMode;
}

export interface CreateRoomForm {
	name: string;
	description?: string;
	drawMode?: DrawMode;
}

export interface AddNumberForm {
	"session-code": string;
	"creator-hash": string;
	number: number;
}

export interface DrawNumberForm {
	"session-code": string;
	"creator-hash": string;
}

export interface ApiError {
	status: number;
	message: string;
}
