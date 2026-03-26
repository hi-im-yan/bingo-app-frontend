"use client";

import { useTranslations } from "next-intl";
import { BingoBall } from "@/components/ui/bingo-ball";
import { formatBingoLabel } from "@/lib/constants";

interface CurrentNumberProps {
	number: number | null;
}

export function CurrentNumber({ number }: CurrentNumberProps) {
	const t = useTranslations("room");

	if (number === null) {
		return (
			<div role="status" aria-live="polite" className="flex flex-col items-center gap-2 py-6">
				<p className="text-lg text-muted-foreground">{t("waitingForDraw")}</p>
			</div>
		);
	}

	return (
		<div role="status" aria-live="polite" className="flex flex-col items-center gap-2 py-4">
			<p className="text-sm font-medium text-muted-foreground">{t("lastDrawn")}</p>
			<BingoBall number={number} drawn size="lg" aria-hidden="true" />
			<p className="text-base font-semibold">{formatBingoLabel(number)}</p>
		</div>
	);
}
