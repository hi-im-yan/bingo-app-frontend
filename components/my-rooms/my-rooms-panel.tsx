"use client";

import { useTranslations } from "next-intl";
import { useMyRooms } from "@/hooks/use-my-rooms";
import { MyRoomsList } from "./my-rooms-list";

export function MyRoomsPanel() {
	const t = useTranslations("home.myRooms");
	const { rooms, loading, error, removeRoom } = useMyRooms();

	if (!loading && rooms.length === 0 && !error) return null;

	return (
		<aside className="hidden lg:block w-80 rounded-lg border border-border bg-card p-4">
			<h2 className="mb-3 text-lg font-semibold">{t("title")}</h2>
			<MyRoomsList rooms={rooms} loading={loading} error={error} onDelete={removeRoom} />
		</aside>
	);
}
