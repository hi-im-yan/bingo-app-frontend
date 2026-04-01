import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { AdminTiebreakPanel } from "../admin-tiebreak-panel";
import type { TiebreakDTO } from "@/lib/types";

const defaultProps = {
	onStart: vi.fn(),
	onDrawSlot: vi.fn(),
};

function renderPanel(tiebreak: TiebreakDTO | null = null, props = defaultProps) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<AdminTiebreakPanel tiebreak={tiebreak} {...props} />
		</NextIntlClientProvider>,
	);
}

describe("AdminTiebreakPanel", () => {
	describe("start form (no active tiebreaker)", () => {
		it("renders start button", () => {
			renderPanel(null);
			expect(screen.getByRole("button", { name: "Start Tiebreaker" })).toBeInTheDocument();
		});

		it("renders player count selector with default value of 2", () => {
			renderPanel(null);
			const spinbutton = screen.getByRole("spinbutton", { name: "Players" });
			expect(spinbutton).toHaveValue(2);
		});

		it("calls onStart with selected player count", async () => {
			const user = userEvent.setup();
			const onStart = vi.fn();
			renderPanel(null, { ...defaultProps, onStart });

			const input = screen.getByRole("spinbutton", { name: "Players" });
			await user.clear(input);
			await user.type(input, "4");
			await user.click(screen.getByRole("button", { name: "Start Tiebreaker" }));
			expect(onStart).toHaveBeenCalledWith(4);
		});

		it("clamps player count to minimum of 2", async () => {
			const user = userEvent.setup();
			const onStart = vi.fn();
			renderPanel(null, { ...defaultProps, onStart });

			const input = screen.getByRole("spinbutton", { name: "Players" });
			await user.clear(input);
			await user.type(input, "1");
			await user.click(screen.getByRole("button", { name: "Start Tiebreaker" }));
			expect(onStart).toHaveBeenCalledWith(2);
		});

		it("clamps player count to maximum of 6", async () => {
			const user = userEvent.setup();
			const onStart = vi.fn();
			renderPanel(null, { ...defaultProps, onStart });

			const input = screen.getByRole("spinbutton", { name: "Players" });
			await user.clear(input);
			await user.type(input, "9");
			await user.click(screen.getByRole("button", { name: "Start Tiebreaker" }));
			expect(onStart).toHaveBeenCalledWith(6);
		});
	});

	describe("active tiebreaker (slot draw buttons)", () => {
		it("renders a draw button for each slot", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 3,
				draws: [],
			};
			renderPanel(tiebreak);
			expect(screen.getByRole("button", { name: "Draw 1" })).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Draw 2" })).toBeInTheDocument();
			expect(screen.getByRole("button", { name: "Draw 3" })).toBeInTheDocument();
		});

		it("calls onDrawSlot with the correct slot number", async () => {
			const user = userEvent.setup();
			const onDrawSlot = vi.fn();
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 3,
				draws: [],
			};
			renderPanel(tiebreak, { ...defaultProps, onDrawSlot });

			await user.click(screen.getByRole("button", { name: "Draw 2" }));
			expect(onDrawSlot).toHaveBeenCalledWith(2);
		});

		it("disables draw buttons for already-drawn slots", () => {
			const tiebreak: TiebreakDTO = {
				status: "IN_PROGRESS",
				playerCount: 3,
				draws: [{ slot: 1, number: 42, label: "N-42" }],
			};
			renderPanel(tiebreak);
			expect(screen.getByRole("button", { name: "Draw 1" })).toBeDisabled();
			expect(screen.getByRole("button", { name: "Draw 2" })).toBeEnabled();
			expect(screen.getByRole("button", { name: "Draw 3" })).toBeEnabled();
		});

		it("disables all buttons when tiebreaker is finished", () => {
			const tiebreak: TiebreakDTO = {
				status: "FINISHED",
				playerCount: 2,
				draws: [
					{ slot: 1, number: 42, label: "N-42" },
					{ slot: 2, number: 68, label: "O-68" },
				],
				winnerSlot: 2,
			};
			renderPanel(tiebreak);
			expect(screen.getByRole("button", { name: "Draw 1" })).toBeDisabled();
			expect(screen.getByRole("button", { name: "Draw 2" })).toBeDisabled();
		});

		it("hides start form when tiebreaker is active", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 2,
				draws: [],
			};
			renderPanel(tiebreak);
			expect(screen.queryByRole("button", { name: "Start Tiebreaker" })).not.toBeInTheDocument();
		});
	});
});
