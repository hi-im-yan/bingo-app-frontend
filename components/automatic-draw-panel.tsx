"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GameCard, GameCardContent } from "@/components/ui/game-card";

const DRAW_COOLDOWN_MS = 1500;

interface AutomaticDrawPanelProps {
	allDrawn: boolean;
	onDraw: () => void;
}

export function AutomaticDrawPanel({ allDrawn, onDraw }: AutomaticDrawPanelProps) {
	const t = useTranslations("admin");
	const [cooldown, setCooldown] = useState(false);

	const handleDraw = useCallback(() => {
		if (cooldown) return;
		onDraw();
		setCooldown(true);
		setTimeout(() => setCooldown(false), DRAW_COOLDOWN_MS);
	}, [cooldown, onDraw]);

	return (
		<GameCard>
			<GameCardContent className="flex flex-col items-center gap-3 py-4">
				{allDrawn ? (
					<p className="text-center font-medium text-muted-foreground">
						{t("allDrawn")}
					</p>
				) : (
					<Button
						size="lg"
						className="min-h-11 w-full max-w-xs text-base"
						onClick={handleDraw}
						disabled={cooldown}
					>
						{t("drawNumber")}
					</Button>
				)}
			</GameCardContent>
		</GameCard>
	);
}
