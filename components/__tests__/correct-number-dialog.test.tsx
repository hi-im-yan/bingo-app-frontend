import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { CorrectNumberDialog } from "../correct-number-dialog";

function renderDialog({
	lastDrawn = 42,
	drawnNumbers = [42, 17, 5],
	onCorrect = vi.fn(),
} = {}) {
	return {
		onCorrect,
		...render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<CorrectNumberDialog
					lastDrawn={lastDrawn}
					drawnNumbers={drawnNumbers}
					onCorrect={onCorrect}
				/>
			</NextIntlClientProvider>,
		),
	};
}

describe("CorrectNumberDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the correct button", () => {
		renderDialog();
		expect(screen.getByRole("button", { name: /correct/i })).toBeInTheDocument();
	});

	it("shows number picker dialog when correct button is clicked", async () => {
		const user = userEvent.setup();
		renderDialog();
		await user.click(screen.getByRole("button", { name: /correct/i }));
		expect(screen.getByText("Select replacement number")).toBeInTheDocument();
	});

	it("does not show already-drawn numbers (except lastDrawn) as selectable in grid", async () => {
		const user = userEvent.setup();
		renderDialog({ lastDrawn: 42, drawnNumbers: [42, 17, 5] });
		await user.click(screen.getByRole("button", { name: /correct/i }));
		// 17 and 5 are drawn and not the last — should be disabled
		expect(screen.getByRole("button", { name: "17" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "5" })).toBeDisabled();
		// 42 is the last drawn — should be disabled (can't replace with itself)
		expect(screen.getByRole("button", { name: "42" })).toBeDisabled();
		// 1 is available
		expect(screen.getByRole("button", { name: "1" })).not.toBeDisabled();
	});

	it("shows confirmation dialog after selecting a replacement number", async () => {
		const user = userEvent.setup();
		renderDialog({ lastDrawn: 42, drawnNumbers: [42] });
		await user.click(screen.getByRole("button", { name: /correct/i }));
		await user.click(screen.getByRole("button", { name: "1" }));
		expect(screen.getByText(/replace/i)).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("calls onCorrect with new number after confirming", async () => {
		const user = userEvent.setup();
		const { onCorrect } = renderDialog({ lastDrawn: 42, drawnNumbers: [42] });
		await user.click(screen.getByRole("button", { name: /correct/i }));
		await user.click(screen.getByRole("button", { name: "1" }));
		await user.click(screen.getByRole("button", { name: /confirm/i }));
		expect(onCorrect).toHaveBeenCalledWith(1);
	});

	it("cancels from confirmation dialog without calling onCorrect", async () => {
		const user = userEvent.setup();
		const { onCorrect } = renderDialog({ lastDrawn: 42, drawnNumbers: [42] });
		await user.click(screen.getByRole("button", { name: /correct/i }));
		await user.click(screen.getByRole("button", { name: "1" }));
		await user.click(screen.getByRole("button", { name: /cancel/i }));
		expect(onCorrect).not.toHaveBeenCalled();
	});

	it("is not rendered when lastDrawn is null", () => {
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<CorrectNumberDialog
					lastDrawn={null}
					drawnNumbers={[]}
					onCorrect={vi.fn()}
				/>
			</NextIntlClientProvider>,
		);
		expect(screen.queryByRole("button", { name: /correct/i })).not.toBeInTheDocument();
	});
});
