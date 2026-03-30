"use client";

import { useState, useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "bingo-help-visible";
const listeners = new Set<() => void>();
let currentValue = true;

function getSnapshot() {
	return currentValue;
}

function getServerSnapshot() {
	return true;
}

function subscribe(callback: () => void) {
	listeners.add(callback);
	return () => listeners.delete(callback);
}

function setValue(next: boolean) {
	currentValue = next;
	localStorage.setItem(STORAGE_KEY, String(next));
	listeners.forEach((fn) => fn());
}

interface UseHelpVisibleReturn {
	helpVisible: boolean;
	toggleHelp: () => void;
	hideHelp: () => void;
}

export function useHelpVisible(): UseHelpVisibleReturn {
	const helpVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		const value = stored === null ? true : stored === "true";
		if (value !== currentValue) {
			currentValue = value;
			listeners.forEach((fn) => fn());
		}
	}, []);

	const toggleHelp = useCallback(() => setValue(!currentValue), []);
	const hideHelp = useCallback(() => setValue(false), []);

	return { helpVisible, toggleHelp, hideHelp };
}
