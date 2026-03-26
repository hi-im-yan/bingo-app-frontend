"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteRoomButtonProps {
	sessionCode: string;
}

export function DeleteRoomButton({ sessionCode }: DeleteRoomButtonProps) {
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");
	const tErrors = useTranslations("errors");
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleDelete() {
		setDeleting(true);
		setError(null);
		try {
			await api.deleteRoom(sessionCode);
			router.push("/");
		} catch {
			setError(tErrors("deleteFailed"));
			setDeleting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={<Button variant="destructive" className="w-full" />}
			>
				{t("deleteRoom")}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("deleteConfirm")}</DialogTitle>
					<DialogDescription>{t("deleteWarning")}</DialogDescription>
				</DialogHeader>
				{error && (
					<p className="text-sm text-destructive">{error}</p>
				)}
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={deleting}
					>
						{tCommon("cancel")}
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleting}
					>
						{deleting ? tCommon("loading") : tCommon("confirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
