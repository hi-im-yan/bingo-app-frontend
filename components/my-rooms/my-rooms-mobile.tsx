"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMyRooms } from "@/hooks/use-my-rooms";
import { MyRoomsList } from "./my-rooms-list";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ListChecks } from "lucide-react";

export function MyRoomsMobile() {
	const t = useTranslations("home.myRooms");
	const { rooms, loading, error, removeRoom } = useMyRooms();
	const [open, setOpen] = useState(false);

	if (!loading && rooms.length === 0 && !error) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="outline" className="lg:hidden" />}>
				<ListChecks className="mr-2 h-4 w-4" aria-hidden="true" />
				{t("title")} ({rooms.length})
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
				</DialogHeader>
				<MyRoomsList rooms={rooms} loading={loading} error={error} onDelete={removeRoom} />
			</DialogContent>
		</Dialog>
	);
}
