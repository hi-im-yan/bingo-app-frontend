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
			className="fixed inset-0 z-[70] flex items-center justify-center"
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-xs"
				style={{ animation: "popup-backdrop-in 300ms ease-out forwards" }}
			/>

			{/* Content */}
			<div
				className="relative z-10 mx-4 flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl bg-card p-6 shadow-2xl sm:p-8"
				style={{ animation: "tiebreak-slide-up 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
			>
				<h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>

				{/* Slot cards grid */}
				<div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
					{Array.from({ length: playerCount }, (_, i) => {
						const slot = i + 1;
						const draw = draws.find((d) => d.slot === slot);
						const isWinner = winnerSlot === slot;
						return (
							<SlotCard
								key={slot}
								slot={slot}
								draw={draw}
								isWinner={isWinner}
								isFinished={isFinished}
							/>
						);
					})}
				</div>

				{/* Admin draw buttons — inside the overlay so admin can interact */}
				{onDrawSlot && !isFinished && (
					<div className="flex w-full flex-wrap justify-center gap-2">
						{Array.from({ length: playerCount }, (_, i) => {
							const slot = i + 1;
							const isDrawn = drawnSlots.has(slot);
							return (
								<Button
									key={slot}
									variant={isDrawn ? "outline" : "default"}
									size="sm"
									disabled={isDrawn}
									onClick={() => onDrawSlot(slot)}
								>
									{t("drawSlot", { slot })}
								</Button>
							);
						})}
					</div>
				)}

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
}

function SlotCard({ slot, draw, isWinner, isFinished }: SlotCardProps) {
	const t = useTranslations("tiebreaker");
	const hasDrawn = !!draw;

	return (
		<div
			className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
				isWinner
					? "border-primary bg-primary/10 shadow-lg"
					: "border-border bg-card"
			} ${isFinished && !isWinner ? "opacity-50" : ""}`}
			style={
				isWinner
					? { animation: "tiebreak-winner-glow 1.5s ease-in-out infinite alternate" }
					: hasDrawn
						? { animation: "tiebreak-card-reveal 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }
						: undefined
			}
		>
			<span className="text-xs font-medium text-muted-foreground">
				{t("slotLabel", { slot })}
			</span>

			{hasDrawn ? (
				<div className="flex size-14 items-center justify-center rounded-full bg-ball-drawn shadow-md">
					<span className="text-xl font-black tabular-nums text-ball-drawn-foreground">
						{draw.label}
					</span>
				</div>
			) : (
				<div className="flex size-14 items-center justify-center rounded-full bg-muted">
					<span className="text-xs text-muted-foreground">{t("waiting")}</span>
				</div>
			)}

			{isWinner && (
				<span className="text-sm font-bold text-primary">{t("winner")}</span>
			)}
		</div>
	);
}
