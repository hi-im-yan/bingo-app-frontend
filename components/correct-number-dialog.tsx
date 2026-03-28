"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { BINGO_LETTERS, getNumbersForLetter, formatBingoLabel } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ROWS = 15;
const COLS = 5;

function getGridNumbers(): number[][] {
	return BINGO_LETTERS.map((letter) => getNumbersForLetter(letter));
}

const GRID = getGridNumbers();

function findNextAvailable(
	col: number,
	row: number,
	dCol: number,
	dRow: number,
	disabledSet: Set<number>,
): [number, number] | null {
	let c = col + dCol;
	let r = row + dRow;
	while (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
		if (!disabledSet.has(GRID[c][r])) {
			return [c, r];
		}
		c += dCol;
		r += dRow;
	}
	return null;
}

interface CorrectNumberDialogProps {
	lastDrawn: number | null;
	drawnNumbers: number[];
	onCorrect: (newNumber: number) => void;
}

export function CorrectNumberDialog({
	lastDrawn,
	drawnNumbers,
	onCorrect,
}: CorrectNumberDialogProps) {
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");

	const [pickerOpen, setPickerOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pending, setPending] = useState<number | null>(null);

	const [focusCol, setFocusCol] = useState(0);
	const [focusRow, setFocusRow] = useState(0);
	const gridRef = useRef<HTMLDivElement>(null);

	// All drawn numbers are disabled in the picker grid; lastDrawn can't replace itself
	const disabledSet = new Set(drawnNumbers);

	const focusButton = useCallback((col: number, row: number) => {
		setFocusCol(col);
		setFocusRow(row);
		const button = gridRef.current?.querySelector(
			`[data-col="${col}"][data-row="${row}"]`,
		) as HTMLButtonElement | null;
		button?.focus();
	}, []);

	function handleKeyDown(e: React.KeyboardEvent) {
		let dCol = 0;
		let dRow = 0;

		switch (e.key) {
			case "ArrowUp":
				dRow = -1;
				break;
			case "ArrowDown":
				dRow = 1;
				break;
			case "ArrowLeft":
				dCol = -1;
				break;
			case "ArrowRight":
				dCol = 1;
				break;
			case "Home":
				e.preventDefault();
				for (let r = 0; r < ROWS; r++) {
					if (!disabledSet.has(GRID[focusCol][r])) {
						focusButton(focusCol, r);
						return;
					}
				}
				return;
			case "End":
				e.preventDefault();
				for (let r = ROWS - 1; r >= 0; r--) {
					if (!disabledSet.has(GRID[focusCol][r])) {
						focusButton(focusCol, r);
						return;
					}
				}
				return;
			default:
				return;
		}

		e.preventDefault();
		const next = findNextAvailable(focusCol, focusRow, dCol, dRow, disabledSet);
		if (next) {
			focusButton(next[0], next[1]);
		}
	}

	function handleSelectNumber(num: number) {
		setPending(num);
		setPickerOpen(false);
		setConfirmOpen(true);
	}

	function handleConfirm() {
		if (pending !== null) {
			onCorrect(pending);
		}
		setConfirmOpen(false);
		setPending(null);
	}

	function handleCancelConfirm() {
		setConfirmOpen(false);
		setPending(null);
	}

	if (lastDrawn === null) return null;

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setPickerOpen(true)}
			>
				{t("correctNumber")}
			</Button>

			{/* Number picker dialog */}
			<Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
				<DialogContent className="sm:max-w-md" showCloseButton>
					<DialogHeader>
						<DialogTitle>{t("correctNumberTitle")}</DialogTitle>
						<DialogDescription>
							{t("correctNumberDesc", { number: formatBingoLabel(lastDrawn) })}
						</DialogDescription>
					</DialogHeader>
					<div
						ref={gridRef}
						role="grid"
						aria-label={t("correctNumberTitle")}
						onKeyDown={handleKeyDown}
						className="grid grid-cols-5 gap-1 py-2"
					>
						{BINGO_LETTERS.map((letter, colIdx) => (
							<div key={letter} role="rowgroup" className="flex flex-col items-center gap-1">
								<span role="columnheader" className="text-sm font-bold text-primary">
									{letter}
								</span>
								<div className="flex flex-col gap-1">
									{getNumbersForLetter(letter).map((num, rowIdx) => {
										const isDisabled = disabledSet.has(num);
										const isFocusTarget = colIdx === focusCol && rowIdx === focusRow;
										return (
											<button
												key={num}
												type="button"
												data-col={colIdx}
												data-row={rowIdx}
												tabIndex={isFocusTarget ? 0 : -1}
												aria-label={String(num)}
												disabled={isDisabled}
												onClick={() => handleSelectNumber(num)}
												onFocus={() => {
													setFocusCol(colIdx);
													setFocusRow(rowIdx);
												}}
												className={cn(
													"inline-flex size-10 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
													isDisabled
														? "bg-ball-drawn text-ball-drawn-foreground opacity-50 cursor-not-allowed"
														: "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground active:scale-95",
												)}
											>
												{num}
											</button>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</DialogContent>
			</Dialog>

			{/* Confirmation dialog */}
			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>{t("correctConfirmTitle")}</DialogTitle>
						<DialogDescription>
							{t("correctConfirmDesc", {
								old: formatBingoLabel(lastDrawn),
								new: pending !== null ? formatBingoLabel(pending) : "",
							})}
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-center gap-6 py-2">
						<div className="flex flex-col items-center gap-1">
							<span className="text-xs text-muted-foreground">{t("correctOld")}</span>
							<span className="text-2xl font-bold tabular-nums">{lastDrawn}</span>
						</div>
						<span className="text-muted-foreground">→</span>
						<div className="flex flex-col items-center gap-1">
							<span className="text-xs text-muted-foreground">{t("correctNew")}</span>
							<span className="text-2xl font-bold tabular-nums text-primary">{pending}</span>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancelConfirm}>
							{tCommon("cancel")}
						</Button>
						<Button onClick={handleConfirm}>
							{tCommon("confirm")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
