import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
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
	afterEach(() => {
		vi.restoreAllMocks();
	});

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

	it("disables button during cooldown to prevent rapid clicks", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		const { onDraw } = renderPanel(false);
		const button = screen.getByRole("button", { name: "Draw Number" });

		await user.click(button);
		expect(onDraw).toHaveBeenCalledTimes(1);
		expect(button).toBeDisabled();

		await user.click(button);
		expect(onDraw).toHaveBeenCalledTimes(1);

		act(() => vi.advanceTimersByTime(1500));
		expect(button).toBeEnabled();

		vi.useRealTimers();
	});

	it("shows all-drawn message when allDrawn is true", () => {
		renderPanel(true);
		expect(screen.getByText("All numbers have been drawn!")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Draw Number" })).not.toBeInTheDocument();
	});
});
