import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { MyRoomsPanel } from "../my-rooms-panel";
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
];

function renderPanel() {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<MyRoomsPanel />
		</NextIntlClientProvider>,
	);
}

describe("MyRoomsPanel", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the panel with title and room list when rooms exist", async () => {
		const { useMyRooms } = await import("@/hooks/use-my-rooms");
		vi.mocked(useMyRooms).mockReturnValue({
			rooms: mockRooms,
			loading: false,
			error: null,
			refresh: vi.fn(),
			removeRoom: vi.fn(),
		});
		renderPanel();
		expect(screen.getByText("My Rooms")).toBeInTheDocument();
		expect(screen.getByText("Friday Bingo")).toBeInTheDocument();
	});

	it("renders the panel while loading", async () => {
		const { useMyRooms } = await import("@/hooks/use-my-rooms");
		vi.mocked(useMyRooms).mockReturnValue({
			rooms: [],
			loading: true,
			error: null,
			refresh: vi.fn(),
			removeRoom: vi.fn(),
		});
		const { container } = renderPanel();
		expect(container.firstChild).not.toBeNull();
	});

	it("renders the panel when there is an error", async () => {
		const { useMyRooms } = await import("@/hooks/use-my-rooms");
		vi.mocked(useMyRooms).mockReturnValue({
			rooms: [],
			loading: false,
			error: "Failed to load rooms",
			refresh: vi.fn(),
			removeRoom: vi.fn(),
		});
		const { container } = renderPanel();
		expect(container.firstChild).not.toBeNull();
		expect(screen.getByText("Failed to load rooms")).toBeInTheDocument();
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
		const { container } = renderPanel();
		expect(container.firstChild).toBeNull();
	});
});
