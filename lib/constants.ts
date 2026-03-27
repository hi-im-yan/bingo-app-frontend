import type { BingoLetter } from "@/lib/types";

export const BINGO_LETTERS: BingoLetter[] = ["B", "I", "N", "G", "O"];

export const BINGO_RANGES: Record<BingoLetter, { min: number; max: number }> = {
	B: { min: 1, max: 15 },
	I: { min: 16, max: 30 },
	N: { min: 31, max: 45 },
	G: { min: 46, max: 60 },
	O: { min: 61, max: 75 },
};

export const TOTAL_NUMBERS = 75;

export function getLetterForNumber(num: number): BingoLetter {
	for (const letter of BINGO_LETTERS) {
		const range = BINGO_RANGES[letter];
		if (num >= range.min && num <= range.max) {
			return letter;
		}
	}
	throw new RangeError(`Number ${num} is outside bingo range (1-${TOTAL_NUMBERS})`);
}

export function formatBingoLabel(num: number): string {
	return `${getLetterForNumber(num)}-${num}`;
}

export function getNumbersForLetter(letter: BingoLetter): number[] {
	const { min, max } = BINGO_RANGES[letter];
	return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}
