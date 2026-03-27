"use client";

import { useTranslations } from "next-intl";

interface ConnectionStatusProps {
	connected: boolean;
	reconnecting?: boolean;
}

export function ConnectionStatus({ connected, reconnecting }: ConnectionStatusProps) {
	const t = useTranslations("errors");

	if (connected) return null;

	return (
		<div
			role="alert"
			className={`rounded-lg bg-warning/10 px-4 py-3 text-center text-sm font-medium text-warning-foreground ${
				reconnecting ? "animate-pulse" : ""
			}`}
		>
			{reconnecting ? t("reconnecting") : t("connectionLost")}
		</div>
	);
}
