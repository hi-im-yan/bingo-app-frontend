import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { PlayerList } from "../player-list";
import type { PlayerDTO } from "@/lib/types";

function renderPlayerList(players: PlayerDTO[], loading = false) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<PlayerList players={players} loading={loading} />
		</NextIntlClientProvider>,
	);
}

const mockPlayers: PlayerDTO[] = [
	{ name: "Alice", joinDateTime: "2024-01-15T10:30:00Z" },
	{ name: "Bob", joinDateTime: "2024-01-15T10:25:00Z" },
	{ name: "Charlie", joinDateTime: "2024-01-15T10:35:00Z" },
];

describe("PlayerList", () => {
	it("renders player names", () => {
		renderPlayerList(mockPlayers);
		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("Bob")).toBeInTheDocument();
		expect(screen.getByText("Charlie")).toBeInTheDocument();
	});

	it("shows empty state when no players", () => {
		renderPlayerList([]);
		expect(screen.getByText(/no players yet/i)).toBeInTheDocument();
	});

	it("shows loading state with skeletons when loading", () => {
		const { container } = renderPlayerList([], true);
		const skeletons = container.querySelectorAll("[data-slot='skeleton']");
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it("does not show empty state when loading", () => {
		renderPlayerList([], true);
		expect(screen.queryByText(/no players yet/i)).not.toBeInTheDocument();
	});

	it("shows players sorted by joinDateTime newest first", () => {
		renderPlayerList(mockPlayers);
		const items = screen.getAllByRole("listitem");
		// Charlie joined last (10:35), then Alice (10:30), then Bob (10:25)
		expect(items[0]).toHaveTextContent("Charlie");
		expect(items[1]).toHaveTextContent("Alice");
		expect(items[2]).toHaveTextContent("Bob");
	});

	it("displays player count in heading", () => {
		renderPlayerList(mockPlayers);
		expect(screen.getByText("3")).toBeInTheDocument();
	});
});
