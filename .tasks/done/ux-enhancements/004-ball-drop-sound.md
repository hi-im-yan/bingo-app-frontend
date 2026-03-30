# 004 — Ball Drop Sound Hook
**Status:** ready
**Blocked by:** none
**Assignee:** Logic Writer

## What
Create a custom hook `hooks/use-ball-sound.ts` that returns a `playSound()` function. When called, it plays a short auditory cue to accompany a drawn ball. The hook must respect browser autoplay policy: sound only plays after the user has interacted with the page at least once. Because we cannot ship a real audio file in this task, the hook implements a Web Audio API synthesized tone as the primary approach, with an `HTMLAudioElement` fallback path wired up for when `public/sounds/ball-drop.mp3` is placed in the repository later.

## Acceptance Criteria
- [ ] Hook file exists at `hooks/use-ball-sound.ts`
- [ ] Hook is marked `"use client"` (or exported without the directive — it must only be used in client components)
- [ ] Returns `{ playSound: () => void }`
- [ ] `playSound()` generates a short synthesized tone via the Web Audio API (e.g. a ~200ms descending sine wave, 440 Hz → 220 Hz) when called
- [ ] `playSound()` is a no-op in SSR environments (`typeof window === "undefined"`)
- [ ] `playSound()` is a no-op if `AudioContext` is not available (graceful degradation for older browsers)
- [ ] The hook does NOT enforce its own interaction guard — calling components are responsible for only calling `playSound()` after a user gesture (see task 005). The hook itself should not throw or warn if called too early; the browser's own autoplay policy will silently block it
- [ ] `AudioContext` is lazily created on the first call to `playSound()`, not at hook mount, to avoid unnecessary resource allocation
- [ ] A commented-out `HTMLAudioElement` code path is present in the hook showing how to swap in `public/sounds/ball-drop.mp3` once the file exists
- [ ] Hook has no external dependencies beyond the browser Web Audio API

## Implementation Notes
- Web Audio API tone synthesis pattern:
  ```ts
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
  ```
- Lazy `AudioContext` ref pattern using `useRef<AudioContext | null>(null)`:
  - On first `playSound()` call: `if (!ctxRef.current) ctxRef.current = new AudioContext()`
  - Reuse the same `AudioContext` instance across calls (creating one per call leaks resources)
- `AudioContext` may be in `suspended` state after page load; call `ctx.resume()` before playing if `ctx.state === "suspended"`
- The `HTMLAudioElement` fallback stub (commented out):
  ```ts
  // const audio = new Audio("/sounds/ball-drop.mp3");
  // audio.volume = 0.5;
  // audio.play().catch(() => {});
  ```
- Hook should be a plain function export, not a default export, consistent with other hooks in `hooks/`
- No i18n keys required for this task
