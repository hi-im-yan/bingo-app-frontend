"use client";

import { useTranslations } from "next-intl";

interface ConnectionStatusProps {
	connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
	const t = useTranslations("errors");

	if (connected) return null;

	return (
		<div className="rounded-lg bg-warning/10 px-4 py-3 text-center text-sm font-medium text-warning-foreground">
			{t("connectionLost")}
		</div>
	);
}
