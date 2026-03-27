import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import { ShareRoomSection } from "../share-room-section";

beforeAll(() => {
	// jsdom doesn't provide navigator.clipboard by default
	if (!navigator.clipboard) {
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText: vi.fn().mockResolvedValue(undefined) },
			configurable: true,
		});
	} else {
		vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
	}
});

function renderSection(sessionCode = "ABC123") {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<ShareRoomSection sessionCode={sessionCode} />
		</NextIntlClientProvider>,
	);
}

describe("ShareRoomSection", () => {
	it("shows the share room title", () => {
		renderSection();
		expect(screen.getByText("Share Room")).toBeInTheDocument();
	});

	it("displays the session code", () => {
		renderSection("XYZ789");
		expect(screen.getByText("XYZ789")).toBeInTheDocument();
	});

	it("renders the QR code image", () => {
		renderSection("ABC123");
		const imgs = screen.getAllByAltText("QR Code — ABC123");
		expect(imgs.length).toBeGreaterThan(0);
		expect(imgs[0]).toHaveAttribute("src", expect.stringContaining("ABC123"));
	});

	it("shows copied feedback after clicking copy", async () => {
		const user = userEvent.setup();
		renderSection("ABC123");
		const copyButton = screen.getByRole("button", { name: /copy/i });
		await user.click(copyButton);
		expect(screen.getByText("Copied!")).toBeInTheDocument();
	});
});
