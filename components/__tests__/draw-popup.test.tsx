import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { DrawPopup } from "../draw-popup";

function renderComponent(number: number | null, onDismiss = vi.fn()) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<DrawPopup number={number} onDismiss={onDismiss} />
		</NextIntlClientProvider>,
	);
}

describe("DrawPopup", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders nothing when number is null", () => {
		const { container } = renderComponent(null);
		expect(container.firstChild).toBeNull();
	});

	it("renders overlay when number is provided", () => {
		renderComponent(7);
		expect(screen.getByRole("presentation")).toBeInTheDocument();
	});

	it("displays the formatted bingo label", () => {
		renderComponent(7);
		expect(screen.getByText("B-7")).toBeInTheDocument();
	});

	it("displays the formatted label for a different letter", () => {
		renderComponent(42);
		expect(screen.getByText("N-42")).toBeInTheDocument();
	});

	it("has an aria-live assertive region for screen reader announcement", () => {
		renderComponent(7);
		const liveRegion = document.querySelector("[aria-live='assertive']");
		expect(liveRegion).toBeInTheDocument();
		expect(liveRegion).toHaveTextContent("Number drawn: B-7");
	});

	it("calls onDismiss after 2 seconds", () => {
		const onDismiss = vi.fn();
		renderComponent(7, onDismiss);
		expect(onDismiss).not.toHaveBeenCalled();
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it("does not call onDismiss before 2 seconds", () => {
		const onDismiss = vi.fn();
		renderComponent(7, onDismiss);
		act(() => {
			vi.advanceTimersByTime(1999);
		});
		expect(onDismiss).not.toHaveBeenCalled();
	});

	it("cleans up timer on unmount", () => {
		const onDismiss = vi.fn();
		const { unmount } = renderComponent(7, onDismiss);
		unmount();
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(onDismiss).not.toHaveBeenCalled();
	});

	it("renders the ball with drawn styles", () => {
		renderComponent(7);
		const ball = document.querySelector(".rounded-full");
		expect(ball).toBeInTheDocument();
	});
});
