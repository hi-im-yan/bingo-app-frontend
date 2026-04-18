import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { ResetRoomButton } from "../reset-room-button";

const mockResetRoom = vi.fn();
const mockUpdateRoomInfo = vi.fn();
const mockToastError = vi.fn();

vi.mock("@/lib/api", () => ({
	api: {
		resetRoom: (...args: unknown[]) => mockResetRoom(...args),
		updateRoomInfo: (...args: unknown[]) => mockUpdateRoomInfo(...args),
	},
	BingoApiError: class extends Error {
		status: number;
		code: string;
		constructor(status: number, message: string, code = "UNKNOWN") {
			super(message);
			this.status = status;
			this.code = code;
		}
	},
}));

vi.mock("sonner", () => ({
	toast: { error: (...args: unknown[]) => mockToastError(...args) },
}));

function renderButton(sessionCode = "ABC123") {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<ResetRoomButton sessionCode={sessionCode} />
		</NextIntlClientProvider>,
	);
}

describe("ResetRoomButton", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("opens the confirmation dialog when clicked", async () => {
		const user = userEvent.setup();
		renderButton();
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		expect(screen.getByText("Reset the game?")).toBeInTheDocument();
		expect(screen.getByText("All drawn numbers will be cleared. Players will stay in the room. This cannot be undone.")).toBeInTheDocument();
		expect(screen.getByLabelText("Update description (optional)")).toBeInTheDocument();
	});

	it("calls api.resetRoom and closes dialog on confirm when description is empty", async () => {
		const user = userEvent.setup();
		mockResetRoom.mockResolvedValue(undefined);
		renderButton("ABC123");
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		await user.click(screen.getByRole("button", { name: "Reset game" }));
		expect(mockUpdateRoomInfo).not.toHaveBeenCalled();
		expect(mockResetRoom).toHaveBeenCalledWith("ABC123");
		expect(screen.queryByText("Reset the game?")).not.toBeInTheDocument();
	});

	it("calls updateRoomInfo then resetRoom when description is filled", async () => {
		const user = userEvent.setup();
		mockUpdateRoomInfo.mockResolvedValue(undefined);
		mockResetRoom.mockResolvedValue(undefined);
		renderButton("ABC123");
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		await user.type(screen.getByLabelText("Update description (optional)"), "Round 2");
		await user.click(screen.getByRole("button", { name: "Reset game" }));
		expect(mockUpdateRoomInfo).toHaveBeenCalledWith("ABC123", { description: "Round 2" });
		expect(mockResetRoom).toHaveBeenCalledWith("ABC123");
		expect(screen.queryByText("Reset the game?")).not.toBeInTheDocument();
	});

	it("shows generic error and does NOT call resetRoom when updateRoomInfo fails", async () => {
		const user = userEvent.setup();
		mockUpdateRoomInfo.mockRejectedValue(new Error("network error"));
		renderButton("ABC123");
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		await user.type(screen.getByLabelText("Update description (optional)"), "Round 2");
		await user.click(screen.getByRole("button", { name: "Reset game" }));
		expect(mockToastError).toHaveBeenCalledWith("Something went wrong. Please try again.");
		expect(mockResetRoom).not.toHaveBeenCalled();
		expect(screen.getByText("Reset the game?")).toBeInTheDocument();
	});

	it("shows the tiebreak-specific toast when api returns TIEBREAK_ALREADY_ACTIVE", async () => {
		const user = userEvent.setup();
		const { BingoApiError } = await import("@/lib/api");
		mockResetRoom.mockRejectedValue(
			new BingoApiError(400, "Tiebreak active", "TIEBREAK_ALREADY_ACTIVE"),
		);
		renderButton("ABC123");
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		await user.click(screen.getByRole("button", { name: "Reset game" }));
		expect(mockToastError).toHaveBeenCalledWith(
			"Finish the tiebreaker before resetting the room.",
		);
	});

	it("shows the generic resetFailed toast on any other reset error", async () => {
		const user = userEvent.setup();
		mockResetRoom.mockRejectedValue(new Error("Something went wrong"));
		renderButton("ABC123");
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		await user.click(screen.getByRole("button", { name: "Reset game" }));
		expect(mockToastError).toHaveBeenCalledWith(
			"Could not reset the room. Please try again.",
		);
	});

	it("does not call api when the dialog is cancelled", async () => {
		const user = userEvent.setup();
		renderButton();
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		expect(mockResetRoom).not.toHaveBeenCalled();
		expect(screen.queryByText("Reset the game?")).not.toBeInTheDocument();
	});

	it("clears description field when dialog is closed and reopened", async () => {
		const user = userEvent.setup();
		renderButton();
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		await user.type(screen.getByLabelText("Update description (optional)"), "Round 2");
		expect(screen.getByLabelText("Update description (optional)")).toHaveValue("Round 2");
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		await user.click(screen.getByRole("button", { name: /reset room/i }));
		expect(screen.getByLabelText("Update description (optional)")).toHaveValue("");
	});
});
