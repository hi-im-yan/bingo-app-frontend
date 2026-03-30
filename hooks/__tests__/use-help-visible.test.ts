import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHelpVisible } from "../use-help-visible";

const STORAGE_KEY = "bingo-help-visible";

describe("useHelpVisible", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
	});

	it("defaults to true when no localStorage value exists", () => {
		const { result } = renderHook(() => useHelpVisible());
		expect(result.current.helpVisible).toBe(true);
	});

	it("reads stored true value from localStorage", () => {
		localStorage.setItem(STORAGE_KEY, "true");
		const { result } = renderHook(() => useHelpVisible());
		expect(result.current.helpVisible).toBe(true);
	});

	it("reads stored false value from localStorage", () => {
		localStorage.setItem(STORAGE_KEY, "false");
		const { result } = renderHook(() => useHelpVisible());
		expect(result.current.helpVisible).toBe(false);
	});

	it("toggleHelp flips from true to false and persists", () => {
		const { result } = renderHook(() => useHelpVisible());
		expect(result.current.helpVisible).toBe(true);

		act(() => {
			result.current.toggleHelp();
		});

		expect(result.current.helpVisible).toBe(false);
		expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
	});

	it("toggleHelp flips from false to true and persists", () => {
		localStorage.setItem(STORAGE_KEY, "false");
		const { result } = renderHook(() => useHelpVisible());

		act(() => {
			result.current.toggleHelp();
		});

		expect(result.current.helpVisible).toBe(true);
		expect(localStorage.getItem(STORAGE_KEY)).toBe("true");
	});

	it("hideHelp sets to false and persists", () => {
		const { result } = renderHook(() => useHelpVisible());
		expect(result.current.helpVisible).toBe(true);

		act(() => {
			result.current.hideHelp();
		});

		expect(result.current.helpVisible).toBe(false);
		expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
	});

	it("hideHelp is a no-op change when already false", () => {
		localStorage.setItem(STORAGE_KEY, "false");
		const { result } = renderHook(() => useHelpVisible());

		act(() => {
			result.current.hideHelp();
		});

		expect(result.current.helpVisible).toBe(false);
		expect(localStorage.getItem(STORAGE_KEY)).toBe("false");
	});

	it("toggleHelp and hideHelp are stable references (useCallback)", () => {
		const { result, rerender } = renderHook(() => useHelpVisible());
		const { toggleHelp: toggle1, hideHelp: hide1 } = result.current;

		rerender();

		expect(result.current.toggleHelp).toBe(toggle1);
		expect(result.current.hideHelp).toBe(hide1);
	});
});
