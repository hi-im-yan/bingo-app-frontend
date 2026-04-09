"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import type { RoomDTO } from "@/lib/types";

interface MyRoomsListProps {
	rooms: RoomDTO[];
	loading: boolean;
	error: string | null;
	onDelete: (sessionCode: string) => Promise<void>;
}

export function MyRoomsList({ rooms, loading, error, onDelete }: MyRoomsListProps) {
	const t = useTranslations("home.myRooms");

	if (loading) {
		return (
			<p className="text-sm text-muted-foreground py-4 text-center">
				{t("loading")}
			</p>
		);
	}

	if (error) {
		return (
			<p className="text-sm text-destructive py-4 text-center">{error}</p>
		);
	}

	if (rooms.length === 0) {
		return null;
	}

	return (
		<ul className="flex flex-col gap-2">
			{rooms.map((room) => (
				<RoomRow key={room.sessionCode} room={room} onDelete={onDelete} t={t} />
			))}
		</ul>
	);
}

interface RoomRowProps {
	room: RoomDTO;
	onDelete: (sessionCode: string) => Promise<void>;
	t: ReturnType<typeof useTranslations>;
}

function RoomRow({ room, onDelete, t }: RoomRowProps) {
	const [open, setOpen] = useState(false);

	async function handleConfirm() {
		await onDelete(room.sessionCode);
		setOpen(false);
	}

	return (
		<li className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-0.5 min-w-0">
				<span className="font-medium truncate">{room.name}</span>
				<span className="font-mono text-xs text-muted-foreground">{room.sessionCode}</span>
			</div>
			<div className="flex items-center gap-2 shrink-0">
				<Button variant="outline" size="sm" render={<Link href={`/room/${room.sessionCode}/admin`} />}>
					{t("enterAsGm")}
				</Button>
				<AlertDialog open={open} onOpenChange={setOpen}>
					<AlertDialogTrigger
						render={
							<Button
								variant="ghost"
								size="sm"
								className="text-destructive hover:text-destructive hover:bg-destructive/10"
								aria-label={t("delete")}
							/>
						}
					>
						<Trash2 className="size-4" aria-hidden="true" />
						<span className="sr-only">{t("delete")}</span>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
							<AlertDialogDescription>{t("deleteConfirmDescription")}</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								onClick={handleConfirm}
							>
								{t("confirm")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</li>
	);
}
