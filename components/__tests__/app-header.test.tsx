import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { AppHeader } from "../app-header";

vi.mock("@/components/feedback-dialog", () => ({
	FeedbackDialog: ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) =>
		open ? (
			<div role="dialog" aria-label="feedback-dialog">
				<button onClick={() => onOpenChange(false)}>Close</button>
			</div>
		) : null,
}));

let mockHelpVisible = false;
const mockToggleHelp = vi.fn();

vi.mock("@/hooks/use-help-visible", () => ({
	useHelpVisible: () => ({
		helpVisible: mockHelpVisible,
		toggleHelp: mockToggleHelp,
	}),
}));

vi.mock("@/i18n/navigation", () => ({
	Link: ({
		href,
		children,
		...props
	}: {
		href: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

function renderHeader() {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<AppHeader />
		</NextIntlClientProvider>,
	);
}

describe("AppHeader", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockHelpVisible = false;
	});

	it("renders the app header element", () => {
		renderHeader();
		expect(screen.getByRole("banner")).toBeInTheDocument();
	});

	it("renders a home link pointing to /", () => {
		renderHeader();
		const homeLink = screen.getByRole("link", { name: /home/i });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute("href", "/");
	});

	it("renders the help toggle button", () => {
		renderHeader();
		expect(screen.getByRole("button", { name: /show help/i })).toBeInTheDocument();
	});

	it("help toggle button has aria-pressed=false when help is hidden", () => {
		mockHelpVisible = false;
		renderHeader();
		const btn = screen.getByRole("button", { name: /show help/i });
		expect(btn).toHaveAttribute("aria-pressed", "false");
	});

	it("help toggle button has aria-pressed=true when help is visible", () => {
		mockHelpVisible = true;
		renderHeader();
		const btn = screen.getByRole("button", { name: /hide help/i });
		expect(btn).toHaveAttribute("aria-pressed", "true");
	});

	it("calls toggleHelp when help button is clicked", async () => {
		const user = userEvent.setup();
		renderHeader();
		await user.click(screen.getByRole("button", { name: /show help/i }));
		expect(mockToggleHelp).toHaveBeenCalledTimes(1);
	});

	it("shows different aria-label based on help visibility", () => {
		mockHelpVisible = true;
		renderHeader();
		expect(screen.getByRole("button", { name: /hide help/i })).toBeInTheDocument();
	});

	it("has data-slot attribute", () => {
		const { container } = renderHeader();
		expect(container.querySelector("[data-slot='app-header']")).toBeInTheDocument();
	});

	it("renders the feedback button with aria-label", () => {
		renderHeader();
		expect(screen.getByRole("button", { name: /feedback/i })).toBeInTheDocument();
	});

	it("feedback dialog is not visible by default", () => {
		renderHeader();
		expect(screen.queryByRole("dialog", { name: "feedback-dialog" })).not.toBeInTheDocument();
	});

	it("opens the feedback dialog when feedback button is clicked", async () => {
		const user = userEvent.setup();
		renderHeader();
		await user.click(screen.getByRole("button", { name: /feedback/i }));
		expect(screen.getByRole("dialog", { name: "feedback-dialog" })).toBeInTheDocument();
	});

	it("closes the feedback dialog when dialog signals close", async () => {
		const user = userEvent.setup();
		renderHeader();
		await user.click(screen.getByRole("button", { name: /feedback/i }));
		expect(screen.getByRole("dialog", { name: "feedback-dialog" })).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: /close/i }));
		expect(screen.queryByRole("dialog", { name: "feedback-dialog" })).not.toBeInTheDocument();
	});
});
