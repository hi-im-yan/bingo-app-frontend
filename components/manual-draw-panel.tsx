"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { BINGO_LETTERS, getNumbersForLetter } from "@/lib/constants";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";
import { cn } from "@/lib/utils";

interface ManualDrawPanelProps {
	drawnNumbers: number[];
	onDrawNumber: (number: number) => void;
}

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
	drawnSet: Set<number>,
): [number, number] | null {
	let c = col + dCol;
	let r = row + dRow;

	while (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
		if (!drawnSet.has(GRID[c][r])) {
			return [c, r];
		}
		c += dCol;
		r += dRow;
	}
	return null;
}

export function ManualDrawPanel({ drawnNumbers, onDrawNumber }: ManualDrawPanelProps) {
	const t = useTranslations("admin");
	const drawnSet = new Set(drawnNumbers);
	const [focusCol, setFocusCol] = useState(0);
	const [focusRow, setFocusRow] = useState(0);
	const gridRef = useRef<HTMLDivElement>(null);

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
					if (!drawnSet.has(GRID[focusCol][r])) {
						focusButton(focusCol, r);
						return;
					}
				}
				return;
			case "End":
				e.preventDefault();
				for (let r = ROWS - 1; r >= 0; r--) {
					if (!drawnSet.has(GRID[focusCol][r])) {
						focusButton(focusCol, r);
						return;
					}
				}
				return;
			default:
				return;
		}

		e.preventDefault();
		const next = findNextAvailable(focusCol, focusRow, dCol, dRow, drawnSet);
		if (next) {
			focusButton(next[0], next[1]);
		}
	}

	return (
		<GameCard>
			<GameCardHeader>
				<GameCardTitle>{t("selectNumber")}</GameCardTitle>
			</GameCardHeader>
			<GameCardContent>
				<div
					ref={gridRef}
					role="grid"
					aria-label={t("selectNumber")}
					onKeyDown={handleKeyDown}
					className="grid grid-cols-5 gap-1"
				>
					{BINGO_LETTERS.map((letter, colIdx) => (
						<div key={letter} role="rowgroup" className="flex flex-col items-center gap-1">
							<span role="columnheader" className="text-sm font-bold text-primary">
								{letter}
							</span>
							<div className="flex flex-col gap-1">
								{getNumbersForLetter(letter).map((num, rowIdx) => {
									const isDrawn = drawnSet.has(num);
									const isFocusTarget = colIdx === focusCol && rowIdx === focusRow;
									return (
										<button
											key={num}
											type="button"
											data-col={colIdx}
											data-row={rowIdx}
											tabIndex={isFocusTarget ? 0 : -1}
											aria-label={String(num)}
											disabled={isDrawn}
											onClick={() => onDrawNumber(num)}
											onFocus={() => {
												setFocusCol(colIdx);
												setFocusRow(rowIdx);
											}}
											className={cn(
												"inline-flex size-10 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
												isDrawn
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
			</GameCardContent>
		</GameCard>
	);
}
