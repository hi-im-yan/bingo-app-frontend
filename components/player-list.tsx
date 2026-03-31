"use client";

import { useTranslations, useLocale } from "next-intl";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlayerDTO } from "@/lib/types";

interface PlayerListProps {
	players: PlayerDTO[];
	loading?: boolean;
}

export function PlayerList({ players, loading = false }: PlayerListProps) {
	const t = useTranslations("admin");
	const locale = useLocale();

	const sorted = [...players].sort(
		(a, b) => new Date(b.joinDateTime).getTime() - new Date(a.joinDateTime).getTime(),
	);

	function formatTime(isoString: string): string {
		return new Intl.DateTimeFormat(locale, {
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(isoString));
	}

	return (
		<GameCard>
			<GameCardHeader>
				<GameCardTitle>{t("players")}</GameCardTitle>
				{!loading && (
					<span className="ml-auto text-sm text-muted-foreground">
						{players.length}
					</span>
				)}
			</GameCardHeader>
			<GameCardContent>
				{loading ? (
					<div className="flex flex-col gap-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-8 w-full" />
						))}
					</div>
				) : sorted.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground">{t("noPlayersYet")}</p>
				) : (
					<ul className="flex flex-col gap-1">
						{sorted.map((player) => (
							<li
								key={`${player.name}-${player.joinDateTime}`}
								className="flex items-center justify-between rounded-lg px-3 py-2 text-sm odd:bg-muted/50"
							>
								<span className="font-medium">{player.name}</span>
								<span className="text-muted-foreground">{formatTime(player.joinDateTime)}</span>
							</li>
						))}
					</ul>
				)}
			</GameCardContent>
		</GameCard>
	);
}
