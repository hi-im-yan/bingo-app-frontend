"use client";

import { useTranslations } from "next-intl";
import { BingoBall } from "@/components/ui/bingo-ball";
import { BINGO_LETTERS, getNumbersForLetter } from "@/lib/constants";
import { TOTAL_NUMBERS } from "@/lib/constants";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";

interface DrawnNumbersBoardProps {
	drawnNumbers: number[];
}

export function DrawnNumbersBoard({ drawnNumbers }: DrawnNumbersBoardProps) {
	const t = useTranslations("room");
	const drawnSet = new Set(drawnNumbers);

	return (
		<GameCard>
			<GameCardHeader>
				<GameCardTitle>{t("drawnNumbers")}</GameCardTitle>
				<span className="ml-auto text-sm text-muted-foreground">
					{t("drawnCount", { count: drawnNumbers.length, total: TOTAL_NUMBERS })}
				</span>
			</GameCardHeader>
			<GameCardContent>
				{drawnNumbers.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground">{t("noNumbers")}</p>
				) : (
					<div role="grid" aria-label={t("drawnNumbers")} className="grid grid-cols-5 gap-1">
						{BINGO_LETTERS.map((letter) => (
							<div key={letter} role="rowgroup" className="flex flex-col items-center gap-1">
								<span role="columnheader" className="text-sm font-bold text-primary">{letter}</span>
								<div className="flex flex-col gap-1">
									{getNumbersForLetter(letter).map((num) => (
										<BingoBall
											key={num}
											number={num}
											drawn={drawnSet.has(num)}
											size="sm"
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</GameCardContent>
		</GameCard>
	);
}
