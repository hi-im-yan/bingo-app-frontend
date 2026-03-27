import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import Home from "../page";

vi.mock("@/i18n/navigation", () => ({
	Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
	useRouter: () => ({ push: vi.fn() }),
}));

function renderWithIntl(ui: React.ReactElement) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			{ui}
		</NextIntlClientProvider>,
	);
}

describe("Home Page", () => {
	it("renders the title", () => {
		renderWithIntl(<Home />);
		expect(screen.getByText("Bingo")).toBeInTheDocument();
	});

	it("renders the subtitle", () => {
		renderWithIntl(<Home />);
		expect(screen.getByText("Create or join a room to play")).toBeInTheDocument();
	});

	it("renders create room link", () => {
		renderWithIntl(<Home />);
		const link = screen.getByText("Create Room");
		expect(link).toBeInTheDocument();
		expect(link.closest("a")).toHaveAttribute("href", "/create");
	});

	it("renders join room section", () => {
		renderWithIntl(<Home />);
		expect(screen.getByText("Join Room")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Room code")).toBeInTheDocument();
	});

	it("renders join button disabled by default", () => {
		renderWithIntl(<Home />);
		const button = screen.getByText("Join");
		expect(button).toBeDisabled();
	});
});
