"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { api, BingoApiError, getCreatorHash } from "@/lib/api";
import { useRoomSubscription } from "@/hooks/use-room-subscription";
import type { RoomDTO } from "@/lib/types";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageTitle, PageDescription } from "@/components/page-header";
import { CurrentNumber } from "@/components/current-number";
import { DrawnNumbersBoard } from "@/components/drawn-numbers-board";
import { ConnectionStatus } from "@/components/connection-status";
import { ManualDrawPanel } from "@/components/manual-draw-panel";
import { AutomaticDrawPanel } from "@/components/automatic-draw-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { TOTAL_NUMBERS } from "@/lib/constants";

export default function AdminPage() {
	const params = useParams<{ code: string }>();
	const t = useTranslations("admin");
	const tErrors = useTranslations("errors");
	const [initialRoom, setInitialRoom] = useState<RoomDTO | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const creatorHash = getCreatorHash(params.code);

	useEffect(() => {
		if (!creatorHash) {
			setError(tErrors("roomNotFound"));
			setLoading(false);
			return;
		}

		async function fetchRoom() {
			try {
				const room = await api.getRoom(params.code);
				setInitialRoom(room);
			} catch (err) {
				if (err instanceof BingoApiError && err.status === 404) {
					setError(tErrors("roomNotFound"));
				} else {
					setError(tErrors("generic"));
				}
			} finally {
				setLoading(false);
			}
		}
		fetchRoom();
	}, [params.code, creatorHash, tErrors]);

	const { room, connected, addNumber, drawNumber } = useRoomSubscription({
		sessionCode: params.code,
		initialRoom: initialRoom ?? undefined,
	});

	const displayRoom = room ?? initialRoom;

	if (loading) {
		return (
			<PageContainer>
				<div className="flex flex-col gap-4">
					<Skeleton className="mx-auto h-8 w-48" />
					<Skeleton className="mx-auto h-16 w-16 rounded-full" />
					<Skeleton className="h-64 w-full rounded-2xl" />
				</div>
			</PageContainer>
		);
	}

	if (error || !displayRoom) {
		return (
			<PageContainer className="justify-center">
				<PageHeader>
					<PageTitle>{tErrors("roomNotFound")}</PageTitle>
					<PageDescription>{error ?? tErrors("generic")}</PageDescription>
				</PageHeader>
			</PageContainer>
		);
	}

	const lastDrawn =
		displayRoom.drawnNumbers.length > 0
			? displayRoom.drawnNumbers[displayRoom.drawnNumbers.length - 1]
			: null;

	const modeLabel =
		displayRoom.drawMode === "MANUAL" ? t("manual") : t("automatic");

	const allDrawn = displayRoom.drawnNumbers.length >= TOTAL_NUMBERS;

	function handleAddNumber(number: number) {
		if (creatorHash) {
			addNumber(creatorHash, number);
		}
	}

	function handleDrawNumber() {
		if (creatorHash) {
			drawNumber(creatorHash);
		}
	}

	return (
		<PageContainer>
			<ConnectionStatus connected={connected} />

			<PageHeader>
				<PageTitle>{displayRoom.name}</PageTitle>
				<PageDescription>
					{t("roomMode", { mode: modeLabel })}
				</PageDescription>
			</PageHeader>

			<div className="flex flex-col gap-6">
				<CurrentNumber number={lastDrawn} />

				{displayRoom.drawMode === "MANUAL" ? (
					<ManualDrawPanel
						drawnNumbers={displayRoom.drawnNumbers}
						onDrawNumber={handleAddNumber}
					/>
				) : (
					<AutomaticDrawPanel
						allDrawn={allDrawn}
						onDraw={handleDrawNumber}
					/>
				)}

				<DrawnNumbersBoard drawnNumbers={displayRoom.drawnNumbers} />
			</div>
		</PageContainer>
	);
}
