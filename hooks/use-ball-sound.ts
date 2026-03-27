"use client";

import { useCallback, useRef } from "react";

export function useBallSound() {
	const audioContextRef = useRef<AudioContext | null>(null);
	const hasInteractedRef = useRef(false);

	const enableSound = useCallback(() => {
		hasInteractedRef.current = true;
	}, []);

	const playSound = useCallback(() => {
		if (!hasInteractedRef.current) return;

		try {
			if (!audioContextRef.current) {
				audioContextRef.current = new AudioContext();
			}
			const ctx = audioContextRef.current;

			const oscillator = ctx.createOscillator();
			const gainNode = ctx.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(ctx.destination);

			oscillator.type = "sine";
			oscillator.frequency.setValueAtTime(800, ctx.currentTime);
			oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

			gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

			oscillator.start(ctx.currentTime);
			oscillator.stop(ctx.currentTime + 0.4);
		} catch {
			// Audio not available — fail silently
		}
	}, []);

	return { playSound, enableSound };
}
