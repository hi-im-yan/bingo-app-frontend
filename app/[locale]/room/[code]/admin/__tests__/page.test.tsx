import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

vi.mock("next/navigation", () => ({
	useParams: () => ({ code: "ABC123" }),
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/i18n/navigation", () => ({
	useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

const mockGetRoom = vi.fn();
const mockGetCreatorHash = vi.fn();

vi.mock("@/lib/api", () => ({
	api: {
		getRoom: (...args: unknown[]) => mockGetRoom(...args),
		getQrCodeUrl: (code: string) => `http://localhost:8080/api/v1/room/${code}/qrcode`,
		deleteRoom: vi.fn().mockResolvedValue(undefined),
	},
	BingoApiError: class extends Error {
		status: number;
		constructor(status: number, message: string) {
			super(message);
			this.status = status;
		}
	},
	getCreatorHash: (...args: unknown[]) => mockGetCreatorHash(...args),
}));

const mockAddNumber = vi.fn();
const mockDrawNumber = vi.fn();

vi.mock("@/hooks/use-room-subscription", () => ({
	useRoomSubscription: () => ({
		room: null,
		connected: true,
		addNumber: mockAddNumber,
		drawNumber: mockDrawNumber,
	}),
}));

import AdminPage from "../../admin/page";

function renderAdmin() {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<AdminPage />
		</NextIntlClientProvider>,
	);
}

function makeRoom(overrides = {}) {
	return {
		name: "Test Room",
		sessionCode: "ABC123",
		drawnNumbers: [],
		drawnLabels: [],
		drawMode: "MANUAL" as const,
		...overrides,
	};
}

describe("AdminPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows loading skeleton initially", () => {
		mockGetRoom.mockReturnValue(new Promise(() => {}));
		mockGetCreatorHash.mockReturnValue("hash123");
		renderAdmin();
		expect(document.querySelector("[data-slot='skeleton']")).toBeInTheDocument();
	});

	it("shows error when no creator hash", async () => {
		mockGetCreatorHash.mockReturnValue(null);
		mockGetRoom.mockResolvedValue(makeRoom());
		renderAdmin();
		await waitFor(() => {
			expect(screen.getByRole("heading", { name: "Room not found" })).toBeInTheDocument();
		});
	});

	it("shows room name and mode for manual room", async () => {
		mockGetCreatorHash.mockReturnValue("hash123");
		mockGetRoom.mockImplementation(() => Promise.resolve(makeRoom()));
		renderAdmin();
		await waitFor(() => {
			expect(screen.getByText("Test Room")).toBeInTheDocument();
		});
		expect(screen.getByText("Mode: Manual")).toBeInTheDocument();
	});

	it("renders number grid for manual mode", async () => {
		mockGetCreatorHash.mockReturnValue("hash123");
		mockGetRoom.mockImplementation(() => Promise.resolve(makeRoom()));
		renderAdmin();
		await waitFor(() => {
			expect(screen.getByText("Select a number")).toBeInTheDocument();
		});
		// Should render B-I-N-G-O column headers
		for (const letter of ["B", "I", "N", "G", "O"]) {
			expect(screen.getByText(letter)).toBeInTheDocument();
		}
	});

	it("calls addNumber when clicking a number in manual mode", async () => {
		mockGetCreatorHash.mockReturnValue("hash123");
		mockGetRoom.mockImplementation(() => Promise.resolve(makeRoom()));
		const user = userEvent.setup();
		renderAdmin();
		await waitFor(() => {
			expect(screen.getByText("Select a number")).toBeInTheDocument();
		});
		const button1 = screen.getByRole("button", { name: "1" });
		await user.click(button1);
		expect(mockAddNumber).toHaveBeenCalledWith("hash123", 1);
	});

	it("disables already-drawn numbers in manual mode", async () => {
		mockGetCreatorHash.mockReturnValue("hash123");
		mockGetRoom.mockImplementation(() =>
			Promise.resolve(makeRoom({ drawnNumbers: [7], drawnLabels: ["B-7"] })),
		);
		renderAdmin();
		await waitFor(() => {
			expect(screen.getByText("Select a number")).toBeInTheDocument();
		});
		const button7 = screen.getByRole("button", { name: "7" });
		expect(button7).toBeDisabled();
	});

	it("renders draw button for automatic mode", async () => {
		mockGetCreatorHash.mockReturnValue("hash123");
		mockGetRoom.mockImplementation(() =>
			Promise.resolve(makeRoom({ drawMode: "AUTOMATIC" })),
		);
		renderAdmin();
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Draw Number" })).toBeInTheDocument();
		});
	});

	it("calls drawNumber when clicking draw button in automatic mode", async () => {
		mockGetCreatorHash.mockReturnValue("hash123");
		mockGetRoom.mockImplementation(() =>
			Promise.resolve(makeRoom({ drawMode: "AUTOMATIC" })),
		);
		const user = userEvent.setup();
		renderAdmin();
		const drawBtn = await screen.findByRole("button", { name: "Draw Number" });
		await user.click(drawBtn);
		expect(mockDrawNumber).toHaveBeenCalledWith("hash123");
	});

	it("shows all-drawn message when 75 numbers drawn in automatic mode", async () => {
		mockGetCreatorHash.mockReturnValue("hash123");
		const allNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
		mockGetRoom.mockImplementation(() =>
			Promise.resolve(makeRoom({ drawMode: "AUTOMATIC", drawnNumbers: allNumbers })),
		);
		renderAdmin();
		await waitFor(() => {
			expect(screen.getByText("All numbers have been drawn!")).toBeInTheDocument();
		});
	});
});
