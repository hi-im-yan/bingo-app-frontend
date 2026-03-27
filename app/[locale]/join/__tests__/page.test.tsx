import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import JoinRoomPage from "../page";

const mockPush = vi.fn();

vi.mock("@/i18n/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/api", () => ({
	api: {
		getRoom: vi.fn(),
	},
	BingoApiError: class BingoApiError extends Error {
		status: number;
		constructor(status: number, message: string) {
			super(message);
			this.status = status;
		}
	},
}));

function renderPage() {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<JoinRoomPage />
		</NextIntlClientProvider>,
	);
}

describe("Join Room Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the form", () => {
		renderPage();
		expect(screen.getByRole("heading", { name: "Join Room" })).toBeInTheDocument();
		expect(screen.getByPlaceholderText("ABC123")).toBeInTheDocument();
	});

	it("disables button when input is empty", () => {
		renderPage();
		expect(screen.getByRole("button", { name: "Join" })).toBeDisabled();
	});

	it("uppercases input", async () => {
		const user = userEvent.setup();
		renderPage();

		const input = screen.getByPlaceholderText("ABC123");
		await user.type(input, "abc123");
		expect(input).toHaveValue("ABC123");
	});

	it("navigates on valid room", async () => {
		const { api } = await import("@/lib/api");
		vi.mocked(api.getRoom).mockResolvedValue({
			name: "Test",
			sessionCode: "ABC123",
			drawnNumbers: [],
			drawnLabels: [],
			drawMode: "MANUAL",
		});

		const user = userEvent.setup();
		renderPage();

		await user.type(screen.getByPlaceholderText("ABC123"), "abc123");
		await user.click(screen.getByRole("button", { name: "Join" }));

		await waitFor(() => {
			expect(api.getRoom).toHaveBeenCalledWith("ABC123");
			expect(mockPush).toHaveBeenCalledWith("/room/ABC123");
		});
	});

	it("shows error on 404", async () => {
		const { api, BingoApiError } = await import("@/lib/api");
		vi.mocked(api.getRoom).mockRejectedValue(
			new BingoApiError(404, "Room not found"),
		);

		const user = userEvent.setup();
		renderPage();

		await user.type(screen.getByPlaceholderText("ABC123"), "NOPE12");
		await user.click(screen.getByRole("button", { name: "Join" }));

		await waitFor(() => {
			expect(screen.getByText("Room not found")).toBeInTheDocument();
		});
	});
});
