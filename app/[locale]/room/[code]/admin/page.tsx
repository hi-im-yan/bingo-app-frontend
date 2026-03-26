"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
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
import { ShareRoomSection } from "@/components/share-room-section";
import { DeleteRoomButton } from "@/components/delete-room-button";
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

	const handleWsError = useCallback(
		(error: string) => toast.error(error),
		[],
	);

	const handleReconnect = useCallback(
		() => toast.success(tErrors("reconnected")),
		[tErrors],
	);

	const { room, connected, reconnecting, addNumber, drawNumber } = useRoomSubscription({
		sessionCode: params.code,
		initialRoom: initialRoom ?? undefined,
		onError: handleWsError,
		onReconnect: handleReconnect,
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
			<ConnectionStatus connected={connected} reconnecting={reconnecting} />

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

				<ShareRoomSection sessionCode={displayRoom.sessionCode} />

				<DrawnNumbersBoard drawnNumbers={displayRoom.drawnNumbers} />

				<DeleteRoomButton sessionCode={displayRoom.sessionCode} />
			</div>
		</PageContainer>
	);
}
