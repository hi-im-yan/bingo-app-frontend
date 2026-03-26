import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { CurrentNumber } from "../current-number";

function renderComponent(number: number | null) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<CurrentNumber number={number} />
		</NextIntlClientProvider>,
	);
}

describe("CurrentNumber", () => {
	it("shows waiting message when no number", () => {
		renderComponent(null);
		expect(screen.getByText("Waiting for draw...")).toBeInTheDocument();
	});

	it("shows the number in a bingo ball", () => {
		renderComponent(42);
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByText("N-42")).toBeInTheDocument();
	});

	it("shows last drawn label", () => {
		renderComponent(7);
		expect(screen.getByText("Last drawn")).toBeInTheDocument();
		expect(screen.getByText("B-7")).toBeInTheDocument();
	});
});
