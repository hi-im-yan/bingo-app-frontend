/**
 * Tests that verify correction toast behaviour.
 * We test this through a minimal wrapper component that mirrors how both the
 * admin and player pages consume the onCorrection callback from
 * useRoomSubscription.
 */
import { describe, it, expect, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { NumberCorrectionDTO } from "@/lib/types";
import messages from "@/messages/en.json";

// Capture the onCorrection handler that a page would wire up
function useCorrectionToast(namespace: "room" | "admin") {
	const t = useTranslations(namespace);
	return useCallback(
		(correction: NumberCorrectionDTO) => {
			toast.warning(t("correctionToast", { message: correction.message }));
		},
		[t],
	);
}

function AdminCorrectionWrapper({
	onReady,
}: {
	onReady: (fn: (c: NumberCorrectionDTO) => void) => void;
}) {
	const handleCorrection = useCorrectionToast("admin");
	onReady(handleCorrection);
	return null;
}

function PlayerCorrectionWrapper({
	onReady,
}: {
	onReady: (fn: (c: NumberCorrectionDTO) => void) => void;
}) {
	const handleCorrection = useCorrectionToast("room");
	onReady(handleCorrection);
	return null;
}

const mockToastWarning = vi.spyOn(toast, "warning");

const correction: NumberCorrectionDTO = {
	oldNumber: 42,
	oldLabel: "N-42",
	newNumber: 7,
	newLabel: "B-7",
	message: "N-42 was replaced with B-7",
};

describe("Correction toast — admin namespace", () => {
	it("shows a warning toast with the correction message", () => {
		let handler: ((c: NumberCorrectionDTO) => void) | undefined;
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<AdminCorrectionWrapper onReady={(fn) => { handler = fn; }} />
			</NextIntlClientProvider>,
		);
		act(() => {
			handler?.(correction);
		});
		expect(mockToastWarning).toHaveBeenCalledWith(
			`Number corrected: ${correction.message}`,
		);
	});
});

describe("Correction toast — room (player) namespace", () => {
	it("shows a warning toast with the correction message", () => {
		let handler: ((c: NumberCorrectionDTO) => void) | undefined;
		render(
			<NextIntlClientProvider locale="en" messages={messages}>
				<PlayerCorrectionWrapper onReady={(fn) => { handler = fn; }} />
			</NextIntlClientProvider>,
		);
		act(() => {
			handler?.(correction);
		});
		expect(mockToastWarning).toHaveBeenCalledWith(
			`Number corrected: ${correction.message}`,
		);
	});
});
