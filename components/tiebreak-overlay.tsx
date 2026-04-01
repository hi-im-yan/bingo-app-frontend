"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { TiebreakDTO, TiebreakDrawEntry } from "@/lib/types";

interface TiebreakOverlayProps {
	tiebreak: TiebreakDTO;
	onClose?: () => void;
	onDrawSlot?: (slot: number) => void;
}

export function TiebreakOverlay({ tiebreak, onClose, onDrawSlot }: TiebreakOverlayProps) {
	const t = useTranslations("tiebreaker");
	const tc = useTranslations("common");
	const { status, playerCount, draws, winnerSlot } = tiebreak;

	const isFinished = status === "FINISHED";
	const winnerDraw = winnerSlot
		? draws.find((d) => d.slot === winnerSlot)
		: undefined;
	const drawnSlots = new Set(draws.map((d) => d.slot));

	return (
		<div
			role="dialog"
			aria-label={t("title")}
			className="fixed inset-0 z-[70] flex justify-center overflow-y-auto py-8"
		>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/60 backdrop-blur-xs"
				style={{ animation: "popup-backdrop-in 300ms ease-out forwards" }}
			/>

			{/* Content */}
			<div
				className="relative z-10 mx-4 flex h-fit w-full max-w-lg flex-col items-center gap-6 rounded-2xl bg-card p-6 shadow-2xl sm:p-8"
				style={{ animation: "tiebreak-slide-up 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
			>
				<h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>

				{/* Slot cards grid */}
				<div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
					{Array.from({ length: playerCount }, (_, i) => {
						const slot = i + 1;
						const draw = draws.find((d) => d.slot === slot);
						const isWinner = winnerSlot === slot;
						const isDrawn = drawnSlots.has(slot);
						const isClickable = !!onDrawSlot && !isDrawn && !isFinished;
						return (
							<SlotCard
								key={slot}
								slot={slot}
								draw={draw}
								isWinner={isWinner}
								isFinished={isFinished}
								isClickable={isClickable}
								onClick={isClickable ? () => onDrawSlot(slot) : undefined}
							/>
						);
					})}
				</div>

				{/* Close button — only when finished */}
				{isFinished && onClose && (
					<Button variant="outline" onClick={onClose}>
						{tc("close")}
					</Button>
				)}

				{/* Screen reader announcement for winner */}
				<div aria-live="assertive" className="sr-only">
					{isFinished && winnerDraw && winnerSlot != null &&
						t("winnerAnnouncement", { slot: winnerSlot, label: winnerDraw.label })
					}
				</div>
			</div>
		</div>
	);
}

interface SlotCardProps {
	slot: number;
	draw?: TiebreakDrawEntry;
	isWinner: boolean;
	isFinished: boolean;
	isClickable: boolean;
	onClick?: () => void;
}

function SlotCard({ slot, draw, isWinner, isFinished, isClickable, onClick }: SlotCardProps) {
	const t = useTranslations("tiebreaker");
	const hasDrawn = !!draw;

	return (
		<button
			type="button"
			disabled={!isClickable}
			onClick={onClick}
			className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
				isWinner
					? "border-primary bg-primary/10 shadow-lg"
					: "border-border bg-card"
			} ${isFinished && !isWinner ? "opacity-50" : ""} ${
				isClickable
					? "cursor-pointer hover:border-primary hover:bg-primary/5 active:scale-95"
					: hasDrawn
						? "cursor-default"
						: "cursor-default"
			}`}
			style={
				isWinner
					? { animation: "tiebreak-winner-glow 1.5s ease-in-out infinite alternate" }
					: hasDrawn
						? { animation: "tiebreak-card-reveal 400ms ease-out forwards" }
						: undefined
			}
		>
			<span className="text-xs font-medium text-muted-foreground">
				{t("slotLabel", { slot })}
			</span>

			{hasDrawn ? (
				<div
					className="flex size-14 items-center justify-center rounded-full bg-ball-drawn shadow-md"
					style={{
						animation: "tiebreak-ball-spin 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
						transformStyle: "preserve-3d",
					}}
				>
					<span className="text-xl font-black tabular-nums text-ball-drawn-foreground">
						{draw.label}
					</span>
				</div>
			) : (
				<div className="flex size-14 items-center justify-center rounded-full bg-muted">
					<span className="text-xs text-muted-foreground">
						{isClickable ? t("tapToDraw") : t("waiting")}
					</span>
				</div>
			)}

			{isWinner && (
				<span className="text-sm font-bold text-primary">{t("winner")}</span>
			)}
		</button>
	);
}
