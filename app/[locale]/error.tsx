"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations("errors");
	const tCommon = useTranslations("common");

	useEffect(() => {
		console.error("Unhandled error:", error);
	}, [error]);

	return (
		<PageContainer className="items-center justify-center">
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
					<AlertTriangle className="h-8 w-8 text-destructive" />
				</div>
				<h2 className="text-xl font-semibold">{t("unexpectedError")}</h2>
				<p className="text-sm text-muted-foreground">{t("generic")}</p>
				<Button onClick={reset}>{tCommon("retry")}</Button>
			</div>
		</PageContainer>
	);
}
