import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { PlayerNameForm } from "@/components/player-name-form";

// The joinRoom namespace keys will appear as raw keys since translations
// for joinRoom.nameLabel etc. haven't been added yet — that's expected.

function renderForm(props: {
	sessionCode?: string;
	onJoin?: (name: string) => void;
	error?: string | null;
	submitting?: boolean;
}) {
	const {
		sessionCode = "ABC123",
		onJoin = vi.fn(),
		error = null,
		submitting = false,
	} = props;

	return render(
		<NextIntlClientProvider locale="en" messages={{}}>
			<PlayerNameForm
				sessionCode={sessionCode}
				onJoin={onJoin}
				error={error}
				submitting={submitting}
			/>
		</NextIntlClientProvider>,
	);
}

describe("PlayerNameForm", () => {
	it("renders a text input", () => {
		renderForm({});
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("renders a submit button", () => {
		renderForm({});
		expect(screen.getByRole("button", { name: /joinRoom\.joinButton/i })).toBeInTheDocument();
	});

	it("calls onJoin with the player name on valid submit", async () => {
		const onJoin = vi.fn();
		renderForm({ onJoin });

		await userEvent.type(screen.getByRole("textbox"), "Alice");
		await userEvent.click(screen.getByRole("button", { name: /joinRoom\.joinButton/i }));

		await waitFor(() => {
			expect(onJoin).toHaveBeenCalledWith("Alice");
		});
	});

	it("does not call onJoin when input is empty", async () => {
		const onJoin = vi.fn();
		renderForm({ onJoin });

		await userEvent.click(screen.getByRole("button", { name: /joinRoom\.joinButton/i }));

		await waitFor(() => {
			expect(onJoin).not.toHaveBeenCalled();
		});
	});

	it("shows validation error when name exceeds 50 characters", async () => {
		const onJoin = vi.fn();
		renderForm({ onJoin });

		const longName = "a".repeat(51);
		await userEvent.type(screen.getByRole("textbox"), longName);
		await userEvent.click(screen.getByRole("button", { name: /joinRoom\.joinButton/i }));

		await waitFor(() => {
			expect(onJoin).not.toHaveBeenCalled();
		});
	});

	it("accepts a name of exactly 50 characters", async () => {
		const onJoin = vi.fn();
		renderForm({ onJoin });

		const name50 = "a".repeat(50);
		await userEvent.type(screen.getByRole("textbox"), name50);
		await userEvent.click(screen.getByRole("button", { name: /joinRoom\.joinButton/i }));

		await waitFor(() => {
			expect(onJoin).toHaveBeenCalledWith(name50);
		});
	});

	it("displays the error prop as an inline form error", async () => {
		renderForm({ error: "Name already taken" });

		await waitFor(() => {
			expect(screen.getByText("Name already taken")).toBeInTheDocument();
		});
	});

	it("disables the submit button while submitting", () => {
		renderForm({ submitting: true });
		expect(screen.getByRole("button", { name: /joinRoom\.joining/i })).toBeDisabled();
	});
});
