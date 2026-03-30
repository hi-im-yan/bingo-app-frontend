import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelpText } from "../help-text";

let mockHelpVisible = false;

vi.mock("@/hooks/use-help-visible", () => ({
	useHelpVisible: () => ({
		helpVisible: mockHelpVisible,
		toggleHelp: vi.fn(),
	}),
}));

describe("HelpText", () => {
	beforeEach(() => {
		mockHelpVisible = false;
	});

	it("renders nothing when help is hidden", () => {
		mockHelpVisible = false;
		const { container } = render(
			<HelpText>Some helpful text</HelpText>,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders children when help is visible", () => {
		mockHelpVisible = true;
		render(<HelpText>Some helpful text</HelpText>);
		expect(screen.getByText("Some helpful text")).toBeInTheDocument();
	});

	it("has data-slot attribute when visible", () => {
		mockHelpVisible = true;
		const { container } = render(<HelpText>Help content</HelpText>);
		expect(container.querySelector("[data-slot='help-text']")).toBeInTheDocument();
	});

	it("applies custom className when visible", () => {
		mockHelpVisible = true;
		const { container } = render(
			<HelpText className="mt-4">Help content</HelpText>,
		);
		const el = container.querySelector("[data-slot='help-text']");
		expect(el).toHaveClass("mt-4");
	});

	it("applies default styling classes when visible", () => {
		mockHelpVisible = true;
		const { container } = render(<HelpText>Help content</HelpText>);
		const el = container.querySelector("[data-slot='help-text']");
		expect(el).toHaveClass("text-muted-foreground");
		expect(el).toHaveClass("text-sm");
		expect(el).toHaveClass("border-l-2");
	});
});
