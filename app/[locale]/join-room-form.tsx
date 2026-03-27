"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function JoinRoomForm() {
	const t = useTranslations("home");
	const router = useRouter();
	const [code, setCode] = useState("");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = code.trim().toUpperCase();
		if (trimmed) {
			router.push(`/room/${trimmed}`);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-3">
			<Input
				value={code}
				onChange={(e) => setCode(e.target.value.toUpperCase())}
				placeholder={t("joinPlaceholder")}
				maxLength={6}
				className="h-12 flex-1 text-center text-lg font-mono uppercase tracking-widest"
				autoComplete="off"
			/>
			<Button
				type="submit"
				variant="outline"
				size="lg"
				disabled={code.trim().length === 0}
				className="h-12 px-6 text-base font-semibold"
			>
				{t("joinButton")}
			</Button>
		</form>
	);
}
