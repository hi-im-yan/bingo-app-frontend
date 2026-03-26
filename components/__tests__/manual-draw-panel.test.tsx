import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { ManualDrawPanel } from "../manual-draw-panel";

function renderPanel(drawnNumbers: number[] = [], onDrawNumber = vi.fn()) {
	return {
		onDrawNumber,
		...render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<ManualDrawPanel drawnNumbers={drawnNumbers} onDrawNumber={onDrawNumber} />
			</NextIntlClientProvider>,
		),
	};
}

describe("ManualDrawPanel", () => {
	it("renders B-I-N-G-O column headers", () => {
		renderPanel();
		for (const letter of ["B", "I", "N", "G", "O"]) {
			expect(screen.getByText(letter)).toBeInTheDocument();
		}
	});

	it("renders number buttons for all 75 numbers", () => {
		renderPanel();
		for (let i = 1; i <= 75; i++) {
			expect(screen.getByRole("button", { name: String(i) })).toBeInTheDocument();
		}
	});

	it("disables drawn numbers", () => {
		renderPanel([7, 42]);
		expect(screen.getByRole("button", { name: "7" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "42" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "1" })).not.toBeDisabled();
	});

	it("calls onDrawNumber when clicking an available number", async () => {
		const user = userEvent.setup();
		const { onDrawNumber } = renderPanel();
		await user.click(screen.getByRole("button", { name: "15" }));
		expect(onDrawNumber).toHaveBeenCalledWith(15);
	});

	it("shows select a number title", () => {
		renderPanel();
		expect(screen.getByText("Select a number")).toBeInTheDocument();
	});
});
