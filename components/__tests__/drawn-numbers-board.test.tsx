import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { DrawnNumbersBoard } from "../drawn-numbers-board";

function renderBoard(drawnNumbers: number[]) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<DrawnNumbersBoard drawnNumbers={drawnNumbers} />
		</NextIntlClientProvider>,
	);
}

describe("DrawnNumbersBoard", () => {
	it("shows empty message when no numbers drawn", () => {
		renderBoard([]);
		expect(screen.getByText("No numbers drawn yet")).toBeInTheDocument();
	});

	it("shows drawn count", () => {
		renderBoard([7, 42, 63]);
		expect(screen.getByText("3 of 75 drawn")).toBeInTheDocument();
	});

	it("renders B-I-N-G-O column headers", () => {
		renderBoard([1]);
		for (const letter of ["B", "I", "N", "G", "O"]) {
			expect(screen.getByText(letter)).toBeInTheDocument();
		}
	});

	it("marks drawn numbers", () => {
		renderBoard([7, 42]);
		const ball7 = screen.getByText("7").closest("[data-slot='bingo-ball']");
		expect(ball7).toHaveAttribute("data-drawn", "true");

		const ball42 = screen.getByText("42").closest("[data-slot='bingo-ball']");
		expect(ball42).toHaveAttribute("data-drawn", "true");

		const ball1 = screen.getByText("1").closest("[data-slot='bingo-ball']");
		expect(ball1).toHaveAttribute("data-drawn", "false");
	});
});
