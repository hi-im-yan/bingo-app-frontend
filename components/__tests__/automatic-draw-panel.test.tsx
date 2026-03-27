import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { AutomaticDrawPanel } from "../automatic-draw-panel";

function renderPanel(allDrawn = false, onDraw = vi.fn()) {
	return {
		onDraw,
		...render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<AutomaticDrawPanel allDrawn={allDrawn} onDraw={onDraw} />
			</NextIntlClientProvider>,
		),
	};
}

describe("AutomaticDrawPanel", () => {
	it("renders draw button when numbers remain", () => {
		renderPanel(false);
		expect(screen.getByRole("button", { name: "Draw Number" })).toBeInTheDocument();
	});

	it("calls onDraw when clicking draw button", async () => {
		const user = userEvent.setup();
		const { onDraw } = renderPanel(false);
		await user.click(screen.getByRole("button", { name: "Draw Number" }));
		expect(onDraw).toHaveBeenCalledOnce();
	});

	it("shows all-drawn message when allDrawn is true", () => {
		renderPanel(true);
		expect(screen.getByText("All numbers have been drawn!")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Draw Number" })).not.toBeInTheDocument();
	});
});
