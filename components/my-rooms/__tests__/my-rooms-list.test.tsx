import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { MyRoomsList } from "../my-rooms-list";
import type { RoomDTO } from "@/lib/types";

vi.mock("@/i18n/navigation", () => ({
	Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
		<a href={href} {...props}>{children}</a>
	),
}));

const mockRooms: RoomDTO[] = [
	{
		name: "Friday Bingo",
		sessionCode: "ABC123",
		drawnNumbers: [],
		drawnLabels: [],
		drawMode: "MANUAL",
	},
	{
		name: "Weekend Game",
		sessionCode: "XYZ789",
		drawnNumbers: [1, 5],
		drawnLabels: ["B-1", "B-5"],
		drawMode: "AUTOMATIC",
	},
];

function renderList(
	rooms: RoomDTO[] = mockRooms,
	loading = false,
	error: string | null = null,
	onDelete = vi.fn(),
) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<MyRoomsList rooms={rooms} loading={loading} error={error} onDelete={onDelete} />
		</NextIntlClientProvider>,
	);
}

describe("MyRoomsList", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders a row for each room with name and session code", () => {
		renderList();
		expect(screen.getByText("Friday Bingo")).toBeInTheDocument();
		expect(screen.getByText("ABC123")).toBeInTheDocument();
		expect(screen.getByText("Weekend Game")).toBeInTheDocument();
		expect(screen.getByText("XYZ789")).toBeInTheDocument();
	});

	it("renders enter-as-gm link with correct href for each room", () => {
		renderList();
		const links = screen.getAllByRole("link", { name: "Enter as GM" });
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveAttribute("href", "/room/ABC123/admin");
		expect(links[1]).toHaveAttribute("href", "/room/XYZ789/admin");
	});

	it("renders a delete button for each room", () => {
		renderList();
		const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
		expect(deleteButtons).toHaveLength(2);
	});

	it("opens confirm dialog when delete button is clicked", async () => {
		const user = userEvent.setup();
		renderList();
		const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
		await user.click(deleteButtons[0]);
		expect(screen.getByText("Delete this room?")).toBeInTheDocument();
		expect(screen.getByText("This permanently deletes the room for everyone.")).toBeInTheDocument();
	});

	it("calls onDelete with sessionCode when confirm is clicked", async () => {
		const user = userEvent.setup();
		const onDelete = vi.fn().mockResolvedValue(undefined);
		renderList(mockRooms, false, null, onDelete);
		const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
		await user.click(deleteButtons[0]);
		const dialog = screen.getByRole("alertdialog");
		const confirmButton = within(dialog).getByRole("button", { name: "Delete" });
		await user.click(confirmButton);
		expect(onDelete).toHaveBeenCalledWith("ABC123");
		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("does not call onDelete when cancel is clicked", async () => {
		const user = userEvent.setup();
		const onDelete = vi.fn();
		renderList(mockRooms, false, null, onDelete);
		const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
		await user.click(deleteButtons[0]);
		const dialog = screen.getByRole("alertdialog");
		await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
		expect(onDelete).not.toHaveBeenCalled();
	});

	it("shows loading state when loading is true", () => {
		renderList([], true, null);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("shows error message when error is provided", () => {
		renderList([], false, "Failed to load rooms");
		expect(screen.getByText("Failed to load rooms")).toBeInTheDocument();
	});

	it("renders nothing when rooms is empty and not loading or error", () => {
		const { container } = renderList([], false, null);
		expect(container.firstChild).toBeNull();
	});
});
