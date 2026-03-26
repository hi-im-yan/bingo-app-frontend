"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
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
	async function handleDelete() {
		setDeleting(true);
		try {
			await api.deleteRoom(sessionCode);
			router.push("/");
		} catch {
			toast.error(tErrors("deleteFailed"));
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
