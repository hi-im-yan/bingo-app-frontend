import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { MyRoomsMobile } from "../my-rooms-mobile";
import type { RoomDTO } from "@/lib/types";

vi.mock("@/hooks/use-my-rooms");
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

function renderMobile() {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<MyRoomsMobile />
		</NextIntlClientProvider>,
	);
}

describe("MyRoomsMobile", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the trigger button with room count when rooms exist", async () => {
		const { useMyRooms } = await import("@/hooks/use-my-rooms");
		vi.mocked(useMyRooms).mockReturnValue({
			rooms: mockRooms,
			loading: false,
			error: null,
			refresh: vi.fn(),
			removeRoom: vi.fn(),
		});
		renderMobile();
		expect(screen.getByRole("button", { name: /my rooms/i })).toBeInTheDocument();
		expect(screen.getByText(/2/)).toBeInTheDocument();
	});

	it("opens the dialog with the room list when button is clicked", async () => {
		const user = userEvent.setup();
		const { useMyRooms } = await import("@/hooks/use-my-rooms");
		vi.mocked(useMyRooms).mockReturnValue({
			rooms: mockRooms,
			loading: false,
			error: null,
			refresh: vi.fn(),
			removeRoom: vi.fn(),
		});
		renderMobile();
		await user.click(screen.getByRole("button", { name: /my rooms/i }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("Friday Bingo")).toBeInTheDocument();
		expect(screen.getByText("Weekend Game")).toBeInTheDocument();
	});

	it("renders nothing when rooms are empty and not loading or error", async () => {
		const { useMyRooms } = await import("@/hooks/use-my-rooms");
		vi.mocked(useMyRooms).mockReturnValue({
			rooms: [],
			loading: false,
			error: null,
			refresh: vi.fn(),
			removeRoom: vi.fn(),
		});
		const { container } = renderMobile();
		expect(container.firstChild).toBeNull();
	});

	it("renders button while loading", async () => {
		const { useMyRooms } = await import("@/hooks/use-my-rooms");
		vi.mocked(useMyRooms).mockReturnValue({
			rooms: [],
			loading: true,
			error: null,
			refresh: vi.fn(),
			removeRoom: vi.fn(),
		});
		const { container } = renderMobile();
		expect(container.firstChild).not.toBeNull();
	});
});
