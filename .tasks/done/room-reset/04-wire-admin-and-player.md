# 04 — Wire reset into admin + player pages + build check

## What to build

Mount `<ResetRoomButton />` in the admin page's controls area, and wire
the `onRoomReset` callback from `useRoomSubscription` to a
`toast.info(t("gameWasReset"))` in BOTH the admin page and the player
room page. Run `npm run build` at the end to catch any client/server
boundary violations.

## Acceptance Criteria

- [ ] `app/[locale]/room/[code]/admin/page.tsx` mounts `<ResetRoomButton sessionCode={sessionCode} />` near the existing `<DeleteRoomButton />`
- [ ] `app/[locale]/room/[code]/admin/page.tsx` passes `onRoomReset: () => toast.info(t("gameWasReset"))` to `useRoomSubscription` (use the correct i18n namespace per task 01 — likely `common` or `room`)
- [ ] `app/[locale]/room/[code]/page.tsx` passes the same `onRoomReset` callback to `useRoomSubscription` so players also see the toast
- [ ] Admin test file `app/[locale]/room/[code]/admin/__tests__/page.test.tsx` still passes (if the admin button layout changes broke snapshots, update them intentionally — do not blindly accept snapshot diffs without confirming the new layout is correct)
- [ ] `npm run build` completes with no errors (required because `page.tsx` files are server-component entrypoints — the `build-check.sh` hook also runs this, but run it explicitly to confirm)
- [ ] `npm test` passes

## Technical Spec

### Files to MODIFY

| File | Change |
|------|--------|
| `app/[locale]/room/[code]/admin/page.tsx` | Import `ResetRoomButton`, mount it near `DeleteRoomButton`. Add `onRoomReset` callback to the `useRoomSubscription` options. |
| `app/[locale]/room/[code]/page.tsx` | Add `onRoomReset` callback to the `useRoomSubscription` options. No new button — players don't get the control. |

### Files to READ (for patterns — do NOT modify)

| File | What to copy |
|------|-------------|
| `app/[locale]/room/[code]/admin/page.tsx` (current) | Where `DeleteRoomButton` is mounted (around line 319 per explorer report), how `useRoomSubscription` is called, how `toast` + `useTranslations` are already imported |
| `app/[locale]/room/[code]/page.tsx` (current) | How the player page calls `useRoomSubscription` — add `onRoomReset` alongside the existing options |
| `components/reset-room-button.tsx` (from task 03) | Import path, props shape |

### Implementation Details

**Admin page — button placement:** mount `<ResetRoomButton />` adjacent to `<DeleteRoomButton />`. Visual grouping matters: both are creator-only controls. If `DeleteRoomButton` is wrapped in a container or card, put `ResetRoomButton` in the same container. Reset should appear BEFORE delete (reset is less destructive — conventional ordering is lighter actions first).

**Admin page — hook callback:**

```typescript
const t = useTranslations("common"); // or whichever namespace holds gameWasReset per task 01

const { room, connected, /* ... */ } = useRoomSubscription({
	sessionCode,
	// ...existing options...
	onRoomReset: () => toast.info(t("gameWasReset")),
});
```

If `useTranslations("common")` is already called in the component under a different variable name, reuse that variable — do not create a duplicate.

**Player page — same callback pattern:**

```typescript
const { room, connected } = useRoomSubscription({
	sessionCode,
	// ...existing options...
	onRoomReset: () => toast.info(t("gameWasReset")),
});
```

If `toast` or `useTranslations` isn't imported in the player page yet, add them. `toast` from `"sonner"`, `useTranslations` from `"next-intl"`.

### What NOT to do

- Do NOT add the reset button to the player page — players cannot reset.
- Do NOT pass `creatorHash` to the button or the callback. The `ResetRoomButton` gets it from localStorage via `api.resetRoom`, and the toast doesn't need auth context.
- Do NOT add a second toast on the admin side from inside `handleReset`. The hook's `onRoomReset` fires for the admin too (they're a subscriber), and the message is the same.
- Do NOT add loading state to the admin page for the reset call. The button owns its own loading state.

### Conventions (from project CLAUDE.md + project memory)

- Server components by default; `"use client"` only where needed. These two pages are already client components — no change required.
- Mobile-first — the button itself already handles responsive sizing (task 03).
- `build-verify after server component changes` is a firm project rule: after editing `page.tsx`, run `npm run build` to catch client/server boundary violations that unit tests miss. Do this before marking the task done.
- Run `npm test` to confirm no regressions.
- `lint-fix.sh` PostToolUse hook will run ESLint automatically.

## TDD Sequence

1. If the admin page has a test covering the button container layout, read it first to understand what assertions exist.
2. If needed, add/update an admin page test asserting `ResetRoomButton` renders near `DeleteRoomButton`. Run it — it should fail until you wire the button.
3. Wire the button into the admin page. Re-run the admin test — it should pass.
4. Wire the `onRoomReset` callback in both pages. (Hook behavior is already tested in task 02 — no additional test required for the wire-up itself; integration is confirmed by the build + manual smoke.)
5. Run `npm test` — all tests pass.
6. Run `npm run build` — completes with no errors.

## Done Definition

All acceptance criteria checked. `ResetRoomButton` mounted in admin
page. `onRoomReset` callback wired in both admin and player pages.
`npm run build` succeeds. `npm test` passes. No TypeScript errors.
