"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "bingo-theme";
const THEMES = ["default", "neon", "retro", "ember"] as const;
type Theme = (typeof THEMES)[number];

const listeners = new Set<() => void>();
let currentTheme: Theme = "default";

function getSnapshot(): Theme {
	return currentTheme;
}

function getServerSnapshot(): Theme {
	return "default";
}

function subscribe(callback: () => void) {
	listeners.add(callback);
	return () => listeners.delete(callback);
}

function setTheme(next: Theme) {
	currentTheme = next;
	localStorage.setItem(STORAGE_KEY, next);
	applyThemeClass(next);
	listeners.forEach((fn) => fn());
}

function applyThemeClass(theme: Theme) {
	const root = document.documentElement;
	THEMES.forEach((t) => root.classList.remove(`theme-${t}`));
	if (theme !== "default") {
		root.classList.add(`theme-${theme}`);
	}
}

export function useTheme() {
	const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
		const value = stored && THEMES.includes(stored) ? stored : "default";
		if (value !== currentTheme) {
			currentTheme = value;
			applyThemeClass(value);
			listeners.forEach((fn) => fn());
		}
	}, []);

	const selectTheme = useCallback((t: Theme) => setTheme(t), []);

	return { theme, selectTheme, themes: THEMES };
}

export type { Theme };
export { THEMES };
