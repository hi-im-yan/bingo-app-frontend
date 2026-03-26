"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { GameCard, GameCardContent } from "@/components/ui/game-card";

interface AutomaticDrawPanelProps {
	allDrawn: boolean;
	onDraw: () => void;
}

export function AutomaticDrawPanel({ allDrawn, onDraw }: AutomaticDrawPanelProps) {
	const t = useTranslations("admin");

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
						onClick={onDraw}
					>
						{t("drawNumber")}
					</Button>
				)}
			</GameCardContent>
		</GameCard>
	);
}
