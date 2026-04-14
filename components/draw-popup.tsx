"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatBingoLabel } from "@/lib/constants";

interface DrawPopupProps {
	number: number | null;
	onDismiss: () => void;
}

export function DrawPopup({ number, onDismiss }: DrawPopupProps) {
	const t = useTranslations("room");
	const [dismissing, setDismissing] = useState(false);

	useEffect(() => {
		if (number === null) {
			setDismissing(false);
			return;
		}

		const fadeTimer = setTimeout(() => {
			setDismissing(true);
		}, 3500);

		const dismissTimer = setTimeout(() => {
			onDismiss();
		}, 3800);

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(dismissTimer);
		};
	}, [number, onDismiss]);

	if (number === null) {
		return null;
	}

	const label = formatBingoLabel(number);

	return (
		<div
			role="presentation"
			className="fixed inset-0 z-[60] flex items-center justify-center"
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				style={{
					animation: dismissing
						? "popup-backdrop-out 300ms ease-in forwards"
						: "popup-backdrop-in 200ms ease-out forwards",
				}}
			/>

			{/* Ball */}
			<div
				className="relative z-10 flex flex-col items-center"
				style={{
					animation: dismissing
						? "popup-fade-out 300ms ease-in forwards"
						: "popup-drop-spin 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
				}}
			>
				<div className="flex size-40 items-center justify-center rounded-full bg-ball-drawn shadow-2xl">
					<span className="text-5xl font-black tabular-nums text-ball-drawn-foreground">
						{label}
					</span>
				</div>
			</div>

			{/* Screen reader announcement */}
			<div aria-live="assertive" className="sr-only">
				{t("numberDrawn", { label })}
			</div>
		</div>
	);
}
