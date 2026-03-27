import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { DeleteRoomButton } from "../delete-room-button";

const mockDeleteRoom = vi.fn();
const mockPush = vi.fn();

vi.mock("@/lib/api", () => ({
	api: { deleteRoom: (...args: unknown[]) => mockDeleteRoom(...args) },
	BingoApiError: class extends Error {
		status: number;
		constructor(status: number, message: string) {
			super(message);
			this.status = status;
		}
	},
}));

vi.mock("@/i18n/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
}));

function renderButton(sessionCode = "ABC123") {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<DeleteRoomButton sessionCode={sessionCode} />
		</NextIntlClientProvider>,
	);
}

describe("DeleteRoomButton", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the close room button", () => {
		renderButton();
		expect(screen.getByRole("button", { name: "Close Room" })).toBeInTheDocument();
	});

	it("shows confirmation dialog when clicked", async () => {
		const user = userEvent.setup();
		renderButton();
		await user.click(screen.getByRole("button", { name: "Close Room" }));
		expect(screen.getByText("Are you sure you want to close this room?")).toBeInTheDocument();
		expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
	});

	it("calls deleteRoom and redirects on confirm", async () => {
		const user = userEvent.setup();
		mockDeleteRoom.mockResolvedValue(undefined);
		renderButton("ABC123");
		await user.click(screen.getByRole("button", { name: "Close Room" }));
		await user.click(screen.getByRole("button", { name: "Confirm" }));
		expect(mockDeleteRoom).toHaveBeenCalledWith("ABC123");
	});

	it("closes dialog on cancel", async () => {
		const user = userEvent.setup();
		renderButton();
		await user.click(screen.getByRole("button", { name: "Close Room" }));
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		expect(screen.queryByText("Are you sure you want to close this room?")).not.toBeInTheDocument();
	});
});
