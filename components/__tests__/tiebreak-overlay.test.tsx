import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { TiebreakOverlay } from "../tiebreak-overlay";
import type { TiebreakDTO } from "@/lib/types";

function renderOverlay(tiebreak: TiebreakDTO, onClose?: () => void, onDrawSlot?: (slot: number) => void) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<TiebreakOverlay tiebreak={tiebreak} onClose={onClose} onDrawSlot={onDrawSlot} />
		</NextIntlClientProvider>,
	);
}

describe("TiebreakOverlay", () => {
	describe("rendering", () => {
		it("renders full-screen overlay with backdrop", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 3,
				draws: [],
			};
			renderOverlay(tiebreak);
			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		it("renders the title", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 3,
				draws: [],
			};
			renderOverlay(tiebreak);
			expect(screen.getByText("Tiebreaker")).toBeInTheDocument();
		});

		it("overlay is scrollable", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 3,
				draws: [],
			};
			renderOverlay(tiebreak);
			const dialog = screen.getByRole("dialog");
			expect(dialog.className).toContain("overflow-y-auto");
		});
	});

	describe("slots", () => {
		it("renders a slot card for each player", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 4,
				draws: [],
			};
			renderOverlay(tiebreak);
			expect(screen.getByText("Draw 1")).toBeInTheDocument();
			expect(screen.getByText("Draw 2")).toBeInTheDocument();
			expect(screen.getByText("Draw 3")).toBeInTheDocument();
			expect(screen.getByText("Draw 4")).toBeInTheDocument();
		});

		it("shows 'Waiting...' for undrawn slots in player view", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 2,
				draws: [],
			};
			renderOverlay(tiebreak);
			const waitingElements = screen.getAllByText("Waiting...");
			expect(waitingElements).toHaveLength(2);
		});

		it("shows 'Tap to draw' for undrawn slots in admin view", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 2,
				draws: [],
			};
			renderOverlay(tiebreak, undefined, vi.fn());
			const tapElements = screen.getAllByText("Tap to draw");
			expect(tapElements).toHaveLength(2);
		});

		it("shows the drawn number for completed slots", () => {
			const tiebreak: TiebreakDTO = {
				status: "IN_PROGRESS",
				playerCount: 3,
				draws: [{ slot: 1, number: 42, label: "N-42" }],
			};
			renderOverlay(tiebreak);
			expect(screen.getByText("N-42")).toBeInTheDocument();
			const waitingElements = screen.getAllByText("Waiting...");
			expect(waitingElements).toHaveLength(2);
		});

		it("shows multiple drawn numbers", () => {
			const tiebreak: TiebreakDTO = {
				status: "IN_PROGRESS",
				playerCount: 3,
				draws: [
					{ slot: 1, number: 42, label: "N-42" },
					{ slot: 2, number: 7, label: "B-7" },
				],
			};
			renderOverlay(tiebreak);
			expect(screen.getByText("N-42")).toBeInTheDocument();
			expect(screen.getByText("B-7")).toBeInTheDocument();
			expect(screen.getAllByText("Waiting...")).toHaveLength(1);
		});
	});

	describe("winner state", () => {
		it("highlights the winning slot", () => {
			const tiebreak: TiebreakDTO = {
				status: "FINISHED",
				playerCount: 3,
				draws: [
					{ slot: 1, number: 42, label: "N-42" },
					{ slot: 2, number: 7, label: "B-7" },
					{ slot: 3, number: 68, label: "O-68" },
				],
				winnerSlot: 3,
			};
			renderOverlay(tiebreak);
			const winnerBadge = screen.getByText("Winner!");
			expect(winnerBadge).toBeInTheDocument();
		});

		it("announces the winner for screen readers", () => {
			const tiebreak: TiebreakDTO = {
				status: "FINISHED",
				playerCount: 2,
				draws: [
					{ slot: 1, number: 42, label: "N-42" },
					{ slot: 2, number: 68, label: "O-68" },
				],
				winnerSlot: 2,
			};
			renderOverlay(tiebreak);
			const liveRegion = document.querySelector("[aria-live='assertive']");
			expect(liveRegion).toBeInTheDocument();
			expect(liveRegion).toHaveTextContent("Draw 2 wins with O-68!");
		});

		it("shows close button only when finished", () => {
			const started: TiebreakDTO = {
				status: "STARTED",
				playerCount: 2,
				draws: [],
			};
			const { rerender } = renderOverlay(started);
			expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();

			const finished: TiebreakDTO = {
				status: "FINISHED",
				playerCount: 2,
				draws: [
					{ slot: 1, number: 42, label: "N-42" },
					{ slot: 2, number: 68, label: "O-68" },
				],
				winnerSlot: 2,
			};
			rerender(
				<NextIntlClientProvider locale="en" messages={messages}>
					<TiebreakOverlay tiebreak={finished} onClose={vi.fn()} />
				</NextIntlClientProvider>,
			);
			expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
		});

		it("calls onClose when close button is clicked", async () => {
			const user = userEvent.setup();
			const onClose = vi.fn();
			const tiebreak: TiebreakDTO = {
				status: "FINISHED",
				playerCount: 2,
				draws: [
					{ slot: 1, number: 42, label: "N-42" },
					{ slot: 2, number: 68, label: "O-68" },
				],
				winnerSlot: 2,
			};
			renderOverlay(tiebreak, onClose);
			await user.click(screen.getByRole("button", { name: /close/i }));
			expect(onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe("admin click-to-draw", () => {
		it("slot cards are clickable when onDrawSlot is provided", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 3,
				draws: [],
			};
			renderOverlay(tiebreak, undefined, vi.fn());
			const buttons = screen.getAllByRole("button");
			const slotButtons = buttons.filter((b) => b.textContent?.includes("Draw"));
			expect(slotButtons).toHaveLength(3);
			slotButtons.forEach((b) => expect(b).toBeEnabled());
		});

		it("slot cards are disabled when onDrawSlot is omitted (player view)", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 2,
				draws: [],
			};
			renderOverlay(tiebreak);
			const buttons = screen.getAllByRole("button");
			const slotButtons = buttons.filter((b) => b.textContent?.includes("Draw"));
			slotButtons.forEach((b) => expect(b).toBeDisabled());
		});

		it("calls onDrawSlot with correct slot when card is clicked", async () => {
			const user = userEvent.setup();
			const onDrawSlot = vi.fn();
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 3,
				draws: [],
			};
			renderOverlay(tiebreak, undefined, onDrawSlot);
			const buttons = screen.getAllByRole("button");
			const draw2 = buttons.find((b) => b.textContent?.includes("Draw 2"));
			await user.click(draw2!);
			expect(onDrawSlot).toHaveBeenCalledWith(2);
		});

		it("disables cards for already-drawn slots", () => {
			const tiebreak: TiebreakDTO = {
				status: "IN_PROGRESS",
				playerCount: 3,
				draws: [{ slot: 1, number: 42, label: "N-42" }],
			};
			renderOverlay(tiebreak, undefined, vi.fn());
			const buttons = screen.getAllByRole("button");
			const draw1 = buttons.find((b) => b.textContent?.includes("Draw 1"));
			const draw2 = buttons.find((b) => b.textContent?.includes("Draw 2"));
			expect(draw1).toBeDisabled();
			expect(draw2).toBeEnabled();
		});

		it("disables all cards when finished", () => {
			const tiebreak: TiebreakDTO = {
				status: "FINISHED",
				playerCount: 2,
				draws: [
					{ slot: 1, number: 42, label: "N-42" },
					{ slot: 2, number: 68, label: "O-68" },
				],
				winnerSlot: 2,
			};
			renderOverlay(tiebreak, undefined, vi.fn());
			const buttons = screen.getAllByRole("button");
			const slotButtons = buttons.filter((b) => b.textContent?.includes("Draw"));
			slotButtons.forEach((b) => expect(b).toBeDisabled());
		});
	});

	describe("accessibility", () => {
		it("has dialog role with accessible label", () => {
			const tiebreak: TiebreakDTO = {
				status: "STARTED",
				playerCount: 2,
				draws: [],
			};
			renderOverlay(tiebreak);
			const dialog = screen.getByRole("dialog");
			expect(dialog).toHaveAccessibleName("Tiebreaker");
		});
	});
});
