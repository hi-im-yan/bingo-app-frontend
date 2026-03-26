"use client";

import { useTranslations } from "next-intl";
import { BINGO_LETTERS, getNumbersForLetter } from "@/lib/constants";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";
import { cn } from "@/lib/utils";

interface ManualDrawPanelProps {
	drawnNumbers: number[];
	onDrawNumber: (number: number) => void;
}

export function ManualDrawPanel({ drawnNumbers, onDrawNumber }: ManualDrawPanelProps) {
	const t = useTranslations("admin");
	const drawnSet = new Set(drawnNumbers);

	return (
		<GameCard>
			<GameCardHeader>
				<GameCardTitle>{t("selectNumber")}</GameCardTitle>
			</GameCardHeader>
			<GameCardContent>
				<div className="grid grid-cols-5 gap-1">
					{BINGO_LETTERS.map((letter) => (
						<div key={letter} className="flex flex-col items-center gap-1">
							<span className="text-sm font-bold text-primary">{letter}</span>
							<div className="flex flex-col gap-1">
								{getNumbersForLetter(letter).map((num) => {
									const isDrawn = drawnSet.has(num);
									return (
										<button
											key={num}
											type="button"
											aria-label={String(num)}
											disabled={isDrawn}
											onClick={() => onDrawNumber(num)}
											className={cn(
												"inline-flex size-8 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-colors",
												isDrawn
													? "bg-ball-drawn text-ball-drawn-foreground opacity-50 cursor-not-allowed"
													: "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground active:scale-95",
											)}
										>
											{num}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</GameCardContent>
		</GameCard>
	);
}
