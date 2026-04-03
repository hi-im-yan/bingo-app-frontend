"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { api, BingoApiError, getCreatorHash } from "@/lib/api";
import { useRoomSubscription } from "@/hooks/use-room-subscription";
import type { WsErrorResponse } from "@/hooks/use-stomp-client";
import type { RoomDTO, PlayerDTO, TiebreakDTO } from "@/lib/types";
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageTitle, PageDescription } from "@/components/page-header";
import { CurrentNumber } from "@/components/current-number";
import { DrawnNumbersBoard } from "@/components/drawn-numbers-board";
import { LastDrawnNumbers } from "@/components/last-drawn-numbers";
import { useBallSound } from "@/hooks/use-ball-sound";
import { DrawPopup } from "@/components/draw-popup";
import { ConnectionStatus } from "@/components/connection-status";
import { HelpText } from "@/components/help-text";
import { useHelpVisible } from "@/hooks/use-help-visible";
import { ManualDrawPanel } from "@/components/manual-draw-panel";
import { AutomaticDrawPanel } from "@/components/automatic-draw-panel";
import { ShareRoomSection } from "@/components/share-room-section";
import { PlayerList } from "@/components/player-list";
import { DeleteRoomButton } from "@/components/delete-room-button";
import { CorrectNumberDialog } from "@/components/correct-number-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminTiebreakPanel } from "@/components/admin-tiebreak-panel";
import { TiebreakOverlay } from "@/components/tiebreak-overlay";
import { TOTAL_NUMBERS } from "@/lib/constants";

export default function AdminPage() {
	const params = useParams<{ code: string }>();
	const t = useTranslations("admin");
	const tErrors = useTranslations("errors");
	const [initialRoom, setInitialRoom] = useState<RoomDTO | null>(null);
	const [players, setPlayers] = useState<PlayerDTO[]>([]);
	const [playersLoading, setPlayersLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const creatorHash = getCreatorHash(params.code);
	const { playSound, enableSound } = useBallSound();
	const { hideHelp } = useHelpVisible();
	const prevDrawnCountRef = useRef(-1);
	const [popupNumber, setPopupNumber] = useState<number | null>(null);
	const [tiebreak, setTiebreak] = useState<TiebreakDTO | null>(null);
	const tiebreakPendingRef = useRef(false);

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
				try {
					const initialPlayers = await api.getPlayers(params.code);
					setPlayers(initialPlayers);
				} catch (playerErr) {
					if (playerErr instanceof BingoApiError && playerErr.code === "ROOM_NOT_FOUND") {
						// Creator hash mismatch — player list unavailable
						setPlayers([]);
					} else {
						toast.error(tErrors("generic"));
						setPlayers([]);
					}
				}
			} catch (err) {
				if (err instanceof BingoApiError && err.code === "ROOM_NOT_FOUND") {
					setError(tErrors("ROOM_NOT_FOUND"));
				} else {
					setError(tErrors("generic"));
				}
			} finally {
				setLoading(false);
				setPlayersLoading(false);
			}
		}
		fetchRoom();
	}, [params.code, creatorHash, tErrors]);

	const handleWsError = useCallback(
		(error: string) => {
			toast.error(error);
		},
		[],
	);

	const handleServerError = useCallback(
		(error: WsErrorResponse) => {
			const message = tErrors.has(error.code)
				? tErrors(error.code)
				: error.message || tErrors("generic");
			toast.error(message);
			if (tiebreakPendingRef.current) {
				tiebreakPendingRef.current = false;
				setTiebreak(null);
			}
		},
		[tErrors],
	);

	const handleReconnect = useCallback(
		() => toast.success(tErrors("reconnected")),
		[tErrors],
	);

	const handleCorrection = useCallback(
		(correction: import("@/lib/types").NumberCorrectionDTO) =>
			toast.warning(t("correctionToast", { message: correction.message })),
		[t],
	);

	const handlePlayerJoin = useCallback(
		(player: PlayerDTO) => {
			setPlayers((prev) => [...prev, player]);
			toast.info(t("playerJoined", { name: player.name }));
		},
		[t],
	);

	const handleTiebreakUpdate = useCallback(
		(update: TiebreakDTO) => {
			tiebreakPendingRef.current = false;
			setTiebreak(update);
		},
		[],
	);

	const { room, connected, reconnecting, addNumber, drawNumber, correctNumber, startTiebreak, tiebreakDraw } = useRoomSubscription({
		sessionCode: params.code,
		initialRoom: initialRoom ?? undefined,
		onError: handleWsError,
		onServerError: handleServerError,
		onReconnect: handleReconnect,
		onCorrection: handleCorrection,
		onPlayerJoin: handlePlayerJoin,
		onTiebreakUpdate: handleTiebreakUpdate,
	});

	const displayRoom = room ?? initialRoom;

	const handlePopupDismiss = useCallback(() => setPopupNumber(null), []);

	useEffect(() => {
		if (!displayRoom) return;
		const count = displayRoom.drawnNumbers.length;
		if (prevDrawnCountRef.current === -1) {
			// First render — snapshot current count, don't trigger
			prevDrawnCountRef.current = count;
			return;
		}
		if (count > prevDrawnCountRef.current) {
			playSound();
			setPopupNumber(displayRoom.drawnNumbers[count - 1]);
			hideHelp();
		}
		prevDrawnCountRef.current = count;
	}, [displayRoom, playSound, hideHelp]);

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
		enableSound();
		if (creatorHash) {
			addNumber(creatorHash, number);
		}
	}

	function handleDrawNumber() {
		enableSound();
		if (creatorHash) {
			drawNumber(creatorHash);
		}
	}

	function handleCorrectNumber(newNumber: number) {
		if (creatorHash) {
			correctNumber(creatorHash, newNumber);
		}
	}

	function handleStartTiebreak(playerCount: number) {
		if (creatorHash) {
			tiebreakPendingRef.current = true;
			startTiebreak(creatorHash, playerCount);
		}
	}

	function handleTiebreakDraw(slot: number) {
		if (creatorHash) {
			tiebreakPendingRef.current = true;
			tiebreakDraw(creatorHash, slot);
		}
	}

	function handleTiebreakClose() {
		setTiebreak(null);
	}

	return (
		<PageContainer className="lg:max-w-5xl">
			<DrawPopup number={popupNumber} onDismiss={handlePopupDismiss} />
			{tiebreak && (
				<TiebreakOverlay tiebreak={tiebreak} onClose={handleTiebreakClose} onDrawSlot={handleTiebreakDraw} />
			)}
			<ConnectionStatus connected={connected} reconnecting={reconnecting} />

			<PageHeader>
				<PageTitle>{displayRoom.name}</PageTitle>
				<PageDescription>
					{t("roomMode", { mode: modeLabel })}
				</PageDescription>
				{displayRoom.description && (
					<p className="text-sm text-muted-foreground">{displayRoom.description}</p>
				)}
			</PageHeader>

			<HelpText>
				{t("help.adminIntro")}
			</HelpText>

			<div className="flex flex-col gap-6 lg:flex-row lg:items-start" onClick={enableSound}>
				{/* Main column — draw controls + board */}
				<div className="flex min-w-0 flex-1 flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<CurrentNumber number={lastDrawn} />
						{displayRoom.drawMode === "MANUAL" && (
							<>
								<CorrectNumberDialog
									lastDrawn={lastDrawn}
									drawnNumbers={displayRoom.drawnNumbers}
									onCorrect={handleCorrectNumber}
								/>
								<HelpText className="text-xs">
									{t("help.correction")}
								</HelpText>
							</>
						)}
					</div>
					<LastDrawnNumbers drawnNumbers={displayRoom.drawnNumbers} />

					{displayRoom.drawMode === "MANUAL" ? (
						<>
							<HelpText className="text-xs">
								{t("help.manualMode")}
							</HelpText>
							<ManualDrawPanel
								drawnNumbers={displayRoom.drawnNumbers}
								onDrawNumber={handleAddNumber}
							/>
						</>
					) : (
						<>
							<HelpText className="text-xs">
								{t("help.automaticMode")}
							</HelpText>
							<AutomaticDrawPanel
								allDrawn={allDrawn}
								onDraw={handleDrawNumber}
							/>
							<AdminTiebreakPanel
								tiebreak={tiebreak}
								onStart={handleStartTiebreak}
								onDrawSlot={handleTiebreakDraw}
							/>
						</>
					)}

					<DrawnNumbersBoard drawnNumbers={displayRoom.drawnNumbers} />
				</div>

				{/* Sidebar — share + players (stacked on mobile, right column on lg+) */}
				<div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:w-80 lg:shrink-0">
					<HelpText className="text-xs">
						{t("help.shareRoom")}
					</HelpText>
					<ShareRoomSection sessionCode={displayRoom.sessionCode} />
					<PlayerList players={players} loading={playersLoading} />
				</div>
			</div>

			<div className="mt-6">
				<DeleteRoomButton sessionCode={displayRoom.sessionCode} />
			</div>
		</PageContainer>
	);
}
