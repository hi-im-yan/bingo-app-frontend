"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";

interface ShareRoomSectionProps {
	sessionCode: string;
}

export function ShareRoomSection({ sessionCode }: ShareRoomSectionProps) {
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		await navigator.clipboard.writeText(sessionCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<GameCard>
			<GameCardHeader>
				<GameCardTitle>{t("shareRoom")}</GameCardTitle>
			</GameCardHeader>
			<GameCardContent>
				<div className="flex flex-col items-center gap-4">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={api.getQrCodeUrl(sessionCode)}
						alt={`${t("qrCode")} — ${sessionCode}`}
						width={200}
						height={200}
						className="rounded-lg"
					/>

					<div className="flex items-center gap-2">
						<span className="rounded-lg bg-muted px-4 py-2 font-mono text-lg font-bold tracking-widest">
							{sessionCode}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={handleCopy}
							aria-label={tCommon("copy")}
						>
							{copied ? tCommon("copied") : tCommon("copy")}
						</Button>
					</div>
				</div>
			</GameCardContent>
		</GameCard>
	);
}
