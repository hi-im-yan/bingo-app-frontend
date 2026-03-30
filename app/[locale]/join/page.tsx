"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { api, BingoApiError } from "@/lib/api";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageTitle } from "@/components/page-header";
import { HelpText } from "@/components/help-text";
import { GameCard, GameCardContent } from "@/components/ui/game-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JoinRoomPage() {
	const t = useTranslations("joinRoom");
	const tErrors = useTranslations("errors");
	const router = useRouter();
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = code.trim().toUpperCase();

		if (!trimmed) {
			setError(t("codeRequired"));
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			await api.getRoom(trimmed);
			router.push(`/room/${trimmed}`);
		} catch (err) {
			if (err instanceof BingoApiError && err.status === 404) {
				setError(tErrors("roomNotFound"));
			} else {
				setError(tErrors("generic"));
			}
			setIsLoading(false);
		}
	}

	return (
		<PageContainer className="justify-center">
			<PageHeader>
				<PageTitle>{t("title")}</PageTitle>
			</PageHeader>

			<HelpText>
				{t("help.joinIntro")}
			</HelpText>

			<GameCard>
				<GameCardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							<Label htmlFor="session-code" className="text-base">
								{t("codePlaceholder")}
							</Label>
							<Input
								id="session-code"
								value={code}
								onChange={(e) => {
									setCode(e.target.value.toUpperCase());
									setError(null);
								}}
								placeholder="ABC123"
								maxLength={6}
								className="h-14 text-center text-2xl font-mono uppercase tracking-[0.3em]"
								autoComplete="off"
								autoFocus
							/>
						</div>

						{error && (
							<p className="text-sm font-medium text-destructive text-center">{error}</p>
						)}

						<Button
							type="submit"
							size="lg"
							disabled={code.trim().length === 0 || isLoading}
							className="h-14 text-lg font-semibold"
						>
							{isLoading ? t("joining") : t("joinButton")}
						</Button>
					</form>
				</GameCardContent>
			</GameCard>
		</PageContainer>
	);
}
