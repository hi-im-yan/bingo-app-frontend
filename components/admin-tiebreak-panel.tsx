"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GameCard, GameCardContent, GameCardHeader, GameCardTitle } from "@/components/ui/game-card";
import type { TiebreakDTO } from "@/lib/types";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

interface AdminTiebreakPanelProps {
	tiebreak: TiebreakDTO | null;
	onStart: (playerCount: number) => void;
	onDrawSlot: (slot: number) => void;
}

export function AdminTiebreakPanel({ tiebreak, onStart, onDrawSlot }: AdminTiebreakPanelProps) {
	const t = useTranslations("tiebreaker");

	if (!tiebreak) {
		return <StartForm onStart={onStart} />;
	}

	return <SlotDrawButtons tiebreak={tiebreak} onDrawSlot={onDrawSlot} />;
}

function StartForm({ onStart }: { onStart: (playerCount: number) => void }) {
	const t = useTranslations("tiebreaker");
	const [playerCount, setPlayerCount] = useState(MIN_PLAYERS);

	const handleStart = () => {
		const clamped = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, playerCount));
		onStart(clamped);
	};

	return (
		<GameCard>
			<GameCardHeader>
				<GameCardTitle>{t("title")}</GameCardTitle>
			</GameCardHeader>
			<GameCardContent className="flex flex-col items-center gap-4">
				<div className="flex items-center gap-3">
					<label htmlFor="tiebreak-player-count" className="text-sm font-medium text-foreground">
						{t("playerCount")}
					</label>
					<input
						id="tiebreak-player-count"
						type="number"
						role="spinbutton"
						aria-label={t("playerCount")}
						min={MIN_PLAYERS}
						max={MAX_PLAYERS}
						value={playerCount}
						onChange={(e) => setPlayerCount(Number(e.target.value))}
						className="w-16 rounded-md border border-input bg-background px-2 py-1 text-center text-sm tabular-nums transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>
				<Button size="lg" className="w-full max-w-xs" onClick={handleStart}>
					{t("startTiebreaker")}
				</Button>
			</GameCardContent>
		</GameCard>
	);
}

function SlotDrawButtons({ tiebreak, onDrawSlot }: { tiebreak: TiebreakDTO; onDrawSlot: (slot: number) => void }) {
	const t = useTranslations("tiebreaker");
	const { playerCount, draws, status } = tiebreak;
	const isFinished = status === "FINISHED";
	const drawnSlots = new Set(draws.map((d) => d.slot));

	return (
		<GameCard>
			<GameCardHeader>
				<GameCardTitle>{t("title")}</GameCardTitle>
			</GameCardHeader>
			<GameCardContent className="flex flex-col gap-2">
				{Array.from({ length: playerCount }, (_, i) => {
					const slot = i + 1;
					const isDrawn = drawnSlots.has(slot);
					return (
						<Button
							key={slot}
							variant={isDrawn ? "outline" : "default"}
							disabled={isDrawn || isFinished}
							onClick={() => onDrawSlot(slot)}
							className="w-full"
						>
							{t("drawSlot", { slot })}
						</Button>
					);
				})}
			</GameCardContent>
		</GameCard>
	);
}
