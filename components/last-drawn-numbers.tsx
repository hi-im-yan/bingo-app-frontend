"use client";

import { useTranslations } from "next-intl";
import { BingoBall } from "@/components/ui/bingo-ball";
import { formatBingoLabel } from "@/lib/constants";

interface LastDrawnNumbersProps {
	drawnNumbers: number[];
}

export function LastDrawnNumbers({ drawnNumbers }: LastDrawnNumbersProps) {
	const t = useTranslations("room");

	if (drawnNumbers.length === 0) return null;

	const lastThree = drawnNumbers.slice(-3).reverse();

	return (
		<div className="flex flex-col items-center gap-2">
			<p className="text-sm font-medium text-muted-foreground">
				{t("recentDraws")}
			</p>
			<div className="flex items-center justify-center gap-3">
				{lastThree.map((num, index) => (
					<div
						key={num}
						className="flex flex-col items-center gap-1 transition-opacity"
						style={{ opacity: index === 0 ? 1 : 0.5 - index * 0.1 }}
					>
						<BingoBall
							number={num}
							drawn
							size={index === 0 ? "md" : "sm"}
						/>
						<span className={`font-semibold tabular-nums ${index === 0 ? "text-sm" : "text-xs text-muted-foreground"}`}>
							{formatBingoLabel(num)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
