import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { LastDrawnNumbers } from "../last-drawn-numbers";

function renderComponent(drawnNumbers: number[]) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<LastDrawnNumbers drawnNumbers={drawnNumbers} />
		</NextIntlClientProvider>,
	);
}

describe("LastDrawnNumbers", () => {
	it("renders nothing when no numbers drawn", () => {
		const { container } = renderComponent([]);
		expect(container.firstChild).toBeNull();
	});

	it("shows one number when only one drawn", () => {
		renderComponent([42]);
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByText("N-42")).toBeInTheDocument();
	});

	it("shows last 3 numbers in reverse order", () => {
		renderComponent([1, 16, 42, 7, 63]);
		expect(screen.getByText("63")).toBeInTheDocument();
		expect(screen.getByText("7")).toBeInTheDocument();
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.queryByText("16")).not.toBeInTheDocument();
	});

	it("shows recent draws label", () => {
		renderComponent([42]);
		expect(screen.getByText("Recent draws")).toBeInTheDocument();
	});
});
