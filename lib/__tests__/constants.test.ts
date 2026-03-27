import { describe, it, expect } from "vitest";
import {
	BINGO_LETTERS,
	BINGO_RANGES,
	TOTAL_NUMBERS,
	getLetterForNumber,
	formatBingoLabel,
	getNumbersForLetter,
} from "@/lib/constants";

describe("BINGO_LETTERS", () => {
	it("contains B-I-N-G-O in order", () => {
		expect(BINGO_LETTERS).toEqual(["B", "I", "N", "G", "O"]);
	});
});

describe("BINGO_RANGES", () => {
	it("covers all 75 numbers without gaps or overlaps", () => {
		const allNumbers = new Set<number>();
		for (const letter of BINGO_LETTERS) {
			const { min, max } = BINGO_RANGES[letter];
			for (let n = min; n <= max; n++) {
				expect(allNumbers.has(n)).toBe(false);
				allNumbers.add(n);
			}
		}
		expect(allNumbers.size).toBe(TOTAL_NUMBERS);
	});

	it("each letter maps 15 numbers", () => {
		for (const letter of BINGO_LETTERS) {
			const { min, max } = BINGO_RANGES[letter];
			expect(max - min + 1).toBe(15);
		}
	});
});

describe("getLetterForNumber", () => {
	it.each([
		[1, "B"], [15, "B"],
		[16, "I"], [30, "I"],
		[31, "N"], [45, "N"],
		[46, "G"], [60, "G"],
		[61, "O"], [75, "O"],
	])("returns %s for number %i", (num, letter) => {
		expect(getLetterForNumber(num as number)).toBe(letter);
	});

	it("throws for number 0", () => {
		expect(() => getLetterForNumber(0)).toThrow(RangeError);
	});

	it("throws for number 76", () => {
		expect(() => getLetterForNumber(76)).toThrow(RangeError);
	});

	it("throws for negative numbers", () => {
		expect(() => getLetterForNumber(-1)).toThrow(RangeError);
	});
});

describe("formatBingoLabel", () => {
	it.each([
		[7, "B-7"],
		[22, "I-22"],
		[42, "N-42"],
		[51, "G-51"],
		[63, "O-63"],
	])("formats %i as %s", (num, label) => {
		expect(formatBingoLabel(num)).toBe(label);
	});
});

describe("getNumbersForLetter", () => {
	it("returns 1-15 for B", () => {
		const numbers = getNumbersForLetter("B");
		expect(numbers).toHaveLength(15);
		expect(numbers[0]).toBe(1);
		expect(numbers[14]).toBe(15);
	});

	it("returns 61-75 for O", () => {
		const numbers = getNumbersForLetter("O");
		expect(numbers).toHaveLength(15);
		expect(numbers[0]).toBe(61);
		expect(numbers[14]).toBe(75);
	});
});
