import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import CreateRoomPage from "../page";

const mockPush = vi.fn();

vi.mock("@/i18n/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/api", () => ({
	api: {
		createRoom: vi.fn(),
	},
	BingoApiError: class BingoApiError extends Error {
		status: number;
		code: string;
		constructor(status: number, message: string, code = "UNKNOWN") {
			super(message);
			this.status = status;
			this.code = code;
		}
	},
}));

function renderPage() {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<CreateRoomPage />
		</NextIntlClientProvider>,
	);
}

describe("Create Room Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the form fields", () => {
		renderPage();
		expect(screen.getByRole("heading", { name: "Create Room" })).toBeInTheDocument();
		expect(screen.getByText("Room name")).toBeInTheDocument();
		expect(screen.getByText("Draw mode")).toBeInTheDocument();
		expect(screen.getByText("Manual")).toBeInTheDocument();
		expect(screen.getByText("Automatic")).toBeInTheDocument();
	});

	it("selects manual mode by default", () => {
		renderPage();
		const manualButton = screen.getByText("Manual").closest("button");
		expect(manualButton?.className).toContain("bg-primary/10");
	});

	it("toggles draw mode on click", async () => {
		const user = userEvent.setup();
		renderPage();

		const autoButton = screen.getByText("Automatic").closest("button")!;
		await user.click(autoButton);

		expect(autoButton.className).toContain("bg-primary/10");

		const manualButton = screen.getByText("Manual").closest("button")!;
		expect(manualButton.className).not.toContain("bg-primary/10");
	});

	it("submits and redirects on success", async () => {
		const { api } = await import("@/lib/api");
		vi.mocked(api.createRoom).mockResolvedValue({
			name: "Test Room",
			sessionCode: "ABC123",
			creatorHash: "hash-123",
			drawnNumbers: [],
			drawnLabels: [],
			drawMode: "MANUAL",
		});

		const user = userEvent.setup();
		renderPage();

		await user.type(screen.getByPlaceholderText("e.g. Friday Night Bingo"), "Test Room");
		await user.click(screen.getByRole("button", { name: "Create Room" }));

		await waitFor(() => {
			expect(api.createRoom).toHaveBeenCalledWith({
				name: "Test Room",
				description: undefined,
				drawMode: "MANUAL",
			});
			expect(mockPush).toHaveBeenCalledWith("/room/ABC123/admin");
		});
	});

	it("shows conflict error on 409", async () => {
		const { api, BingoApiError } = await import("@/lib/api");
		vi.mocked(api.createRoom).mockRejectedValue(
			new BingoApiError(409, "Room already exists.", "ROOM_NAME_TAKEN"),
		);

		const user = userEvent.setup();
		renderPage();

		await user.type(screen.getByPlaceholderText("e.g. Friday Night Bingo"), "Taken");
		await user.click(screen.getByRole("button", { name: "Create Room" }));

		await waitFor(() => {
			expect(screen.getByText("A room with that name already exists")).toBeInTheDocument();
		});
	});
});
