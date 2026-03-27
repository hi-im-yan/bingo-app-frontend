"use client";

import { useCallback, useRef } from "react";

export function useBallSound() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const hasInteractedRef = useRef(false);

	const enableSound = useCallback(() => {
		hasInteractedRef.current = true;
	}, []);

	const playSound = useCallback(() => {
		if (!hasInteractedRef.current) return;

		try {
			if (!audioRef.current) {
				audioRef.current = new Audio("/ball-spinning.mp3");
			}
			audioRef.current.currentTime = 0;
			audioRef.current.play();
		} catch {
			// Audio not available — fail silently
		}
	}, []);

	return { playSound, enableSound };
}
