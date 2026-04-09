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

export interface CorrectNumberForm {
	"session-code": string;
	"creator-hash": string;
	"new-number": number;
}

export interface NumberCorrectionDTO {
	oldNumber: number;
	oldLabel: string;
	newNumber: number;
	newLabel: string;
	message: string;
}

export interface PlayerDTO {
	name: string;
	joinDateTime: string; // ISO datetime
}

export interface JoinRoomForm {
	"session-code": string;
	"player-name": string;
}

export interface FieldError {
	field: string;
	code: string;
}

export interface ErrorResponse {
	status: number;
	code: string;
	message: string;
	fields?: FieldError[];
}

/** @deprecated Use ErrorResponse instead */
export type ApiError = ErrorResponse;

export type TiebreakStatus = "STARTED" | "IN_PROGRESS" | "FINISHED";

export interface TiebreakDrawEntry {
	slot: number;
	number: number;
	label: string;
}

export interface TiebreakDTO {
	status: TiebreakStatus;
	playerCount: number;
	draws: TiebreakDrawEntry[];
	winnerSlot?: number;
}

export interface StartTiebreakForm {
	"session-code": string;
	"creator-hash": string;
	"player-count": number;
}

export interface TiebreakDrawForm {
	"session-code": string;
	"creator-hash": string;
	slot: number;
}

export interface FeedbackForm {
	name: string;
	email?: string;
	phone?: string;
	content: string;
}

export interface FeedbackMessageDTO {
	id: number;
	name: string;
	email?: string;
	phone?: string;
	content: string;
	createdAt: string;
}

export interface RoomLookupForm {
	creatorHashes: string[];
}
