import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { toast } from "sonner";
import messages from "@/messages/en.json";
import { FeedbackDialog } from "@/components/feedback-dialog";

vi.mock("@/lib/api", () => ({
	api: {
		submitFeedback: vi.fn(),
	},
}));

const mockToastSuccess = vi.spyOn(toast, "success");
const mockToastError = vi.spyOn(toast, "error");

function renderDialog(open = true, onOpenChange = vi.fn()) {
	return render(
		<NextIntlClientProvider locale="en" messages={messages}>
			<FeedbackDialog open={open} onOpenChange={onOpenChange} />
		</NextIntlClientProvider>,
	);
}

describe("FeedbackDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders all form fields and buttons when open", () => {
		renderDialog();

		expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Tell us what you think...")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Your phone number")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
	});

	it("renders the dialog title and description", () => {
		renderDialog();

		expect(screen.getByText("Send Feedback")).toBeInTheDocument();
		expect(screen.getByText("Help us improve the experience")).toBeInTheDocument();
	});

	it("does not render form fields when closed", () => {
		renderDialog(false);

		expect(screen.queryByPlaceholderText("Enter your name")).not.toBeInTheDocument();
	});

	it("shows validation error and does not submit when name is empty", async () => {
		const user = userEvent.setup();
		renderDialog();

		await user.type(screen.getByPlaceholderText("Tell us what you think..."), "Great app!");
		await user.click(screen.getByRole("button", { name: /send/i }));

		const { api } = await import("@/lib/api");
		await waitFor(() => {
			expect(api.submitFeedback).not.toHaveBeenCalled();
		});
	});

	it("shows validation error and does not submit when content is empty", async () => {
		const user = userEvent.setup();
		renderDialog();

		await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
		await user.click(screen.getByRole("button", { name: /send/i }));

		const { api } = await import("@/lib/api");
		await waitFor(() => {
			expect(api.submitFeedback).not.toHaveBeenCalled();
		});
	});

	it("calls api.submitFeedback with correct data on valid submission", async () => {
		const { api } = await import("@/lib/api");
		vi.mocked(api.submitFeedback).mockResolvedValue({
			id: 1,
			name: "Alice",
			content: "Great app!",
			createdAt: "2026-04-06T00:00:00Z",
		});

		const user = userEvent.setup();
		renderDialog();

		await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
		await user.type(screen.getByPlaceholderText("Tell us what you think..."), "Great app!");
		await user.click(screen.getByRole("button", { name: /send/i }));

		await waitFor(() => {
			expect(api.submitFeedback).toHaveBeenCalledWith({
				name: "Alice",
				content: "Great app!",
				email: undefined,
				phone: undefined,
			});
		});
	});

	it("sends optional fields when provided", async () => {
		const { api } = await import("@/lib/api");
		vi.mocked(api.submitFeedback).mockResolvedValue({
			id: 1,
			name: "Alice",
			email: "alice@example.com",
			phone: "123456789",
			content: "Great app!",
			createdAt: "2026-04-06T00:00:00Z",
		});

		const user = userEvent.setup();
		renderDialog();

		await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
		await user.type(screen.getByPlaceholderText("Tell us what you think..."), "Great app!");
		await user.type(screen.getByPlaceholderText("your@email.com"), "alice@example.com");
		await user.type(screen.getByPlaceholderText("Your phone number"), "123456789");
		await user.click(screen.getByRole("button", { name: /send/i }));

		await waitFor(() => {
			expect(api.submitFeedback).toHaveBeenCalledWith({
				name: "Alice",
				content: "Great app!",
				email: "alice@example.com",
				phone: "123456789",
			});
		});
	});

	it("shows success toast and closes dialog on successful submission", async () => {
		const { api } = await import("@/lib/api");
		vi.mocked(api.submitFeedback).mockResolvedValue({
			id: 1,
			name: "Alice",
			content: "Great app!",
			createdAt: "2026-04-06T00:00:00Z",
		});

		const onOpenChange = vi.fn();
		const user = userEvent.setup();

		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<FeedbackDialog open={true} onOpenChange={onOpenChange} />
			</NextIntlClientProvider>,
		);

		await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
		await user.type(screen.getByPlaceholderText("Tell us what you think..."), "Great app!");
		await user.click(screen.getByRole("button", { name: /send/i }));

		await waitFor(() => {
			expect(mockToastSuccess).toHaveBeenCalledWith("Thank you for your feedback!");
			expect(onOpenChange).toHaveBeenCalledWith(false);
		});
	});

	it("shows error toast on API failure", async () => {
		const { api } = await import("@/lib/api");
		vi.mocked(api.submitFeedback).mockRejectedValue(new Error("Network error"));

		const user = userEvent.setup();
		renderDialog();

		await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
		await user.type(screen.getByPlaceholderText("Tell us what you think..."), "Great app!");
		await user.click(screen.getByRole("button", { name: /send/i }));

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalledWith(
				"Failed to send feedback. Please try again.",
			);
		});
	});

	it("does not close dialog on API failure", async () => {
		const { api } = await import("@/lib/api");
		vi.mocked(api.submitFeedback).mockRejectedValue(new Error("Network error"));

		const onOpenChange = vi.fn();
		const user = userEvent.setup();

		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<FeedbackDialog open={true} onOpenChange={onOpenChange} />
			</NextIntlClientProvider>,
		);

		await user.type(screen.getByPlaceholderText("Enter your name"), "Alice");
		await user.type(screen.getByPlaceholderText("Tell us what you think..."), "Great app!");
		await user.click(screen.getByRole("button", { name: /send/i }));

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalled();
		});

		expect(onOpenChange).not.toHaveBeenCalledWith(false);
	});
});
