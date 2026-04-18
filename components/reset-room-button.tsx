"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { api, BingoApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface ResetRoomButtonProps {
	sessionCode: string;
}

export function ResetRoomButton({ sessionCode }: ResetRoomButtonProps) {
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");
	const tErrors = useTranslations("errors");
	const [open, setOpen] = useState(false);
	const [resetting, setResetting] = useState(false);
	const [description, setDescription] = useState("");

	function handleOpenChange(next: boolean) {
		setOpen(next);
		if (!next) {
			setDescription("");
		}
	}

	async function handleReset() {
		setResetting(true);
		try {
			const trimmedDescription = description.trim();
			if (trimmedDescription) {
				try {
					await api.updateRoomInfo(sessionCode, { description: trimmedDescription });
				} catch {
					toast.error(tErrors("generic"));
					return;
				}
			}

			try {
				await api.resetRoom(sessionCode);
			} catch (err) {
				if (err instanceof BingoApiError && err.code === "TIEBREAK_ALREADY_ACTIVE") {
					toast.error(tErrors("tiebreakActive"));
				} else {
					toast.error(tErrors("resetFailed"));
				}
				return;
			}

			setOpen(false);
			setDescription("");
		} finally {
			setResetting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={<Button variant="outline" className="w-full" />}
			>
				<RotateCcw className="size-4" aria-hidden />
				<span>{t("resetRoom")}</span>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("resetConfirmTitle")}</DialogTitle>
					<DialogDescription>{t("resetConfirmBody")}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<Label htmlFor="reset-description">{t("resetDescriptionLabel")}</Label>
					<Input
						id="reset-description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder={t("resetDescriptionPlaceholder")}
						maxLength={255}
						disabled={resetting}
					/>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={resetting}
					>
						{tCommon("cancel")}
					</Button>
					<Button onClick={handleReset} disabled={resetting}>
						{resetting ? tCommon("loading") : t("resetConfirmCta")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
