# 03 — `ResetRoomButton` component + tests

## What to build

A creator-only button that opens a confirmation dialog and, on confirm,
calls `api.resetRoom(sessionCode)`. Mirrors `DeleteRoomButton` in
structure. Shows a specific toast when the backend returns 400
`TIEBREAK_ALREADY_ACTIVE`; otherwise a generic error toast. No
success toast — the `onRoomReset` callback from the hook (task 02)
handles the user-visible success feedback in task 04.

## Acceptance Criteria

- [ ] `components/reset-room-button.tsx` exists and exports `ResetRoomButton`
- [ ] Takes a single prop: `sessionCode: string`
- [ ] Shows a non-destructive button (variant `outline` or `secondary` — NOT `destructive`; delete is destructive, reset is reversible by drawing again)
- [ ] Mobile-first: icon-only on default (smallest screens), icon + label on `sm:` and up. Use a suitable Lucide icon (`RotateCcw` is a natural fit)
- [ ] Clicking the button opens a confirmation `Dialog`
- [ ] Confirm button calls `api.resetRoom(sessionCode)`; dialog closes on success; error toasts (differentiated) on failure
- [ ] Confirm button disabled while the request is in flight; shows loading label (`common.loading`)
- [ ] Cancel button closes the dialog and does nothing
- [ ] Error path: `BingoApiError` with `code === "TIEBREAK_ALREADY_ACTIVE"` shows `errors.tiebreakActive`; everything else shows `errors.resetFailed`
- [ ] Component test file `components/__tests__/reset-room-button.test.tsx` covers: dialog opens on click, confirm calls `api.resetRoom`, dialog closes on success, tiebreak error shows the specific toast, generic error shows the generic toast
- [ ] `npm test` passes

## Technical Spec

### Files to CREATE

| File | Purpose |
|------|---------|
| `components/reset-room-button.tsx` | The button + confirmation dialog |
| `components/__tests__/reset-room-button.test.tsx` | Tests for the above |

### Files to READ (for patterns — do NOT modify)

| File | What to copy |
|------|-------------|
| `components/delete-room-button.tsx` | Dialog structure, hook usage (`useTranslations`, `useState`), async handler shape, import paths |
| `components/__tests__/delete-room-button.test.tsx` | Test structure: how `api` is mocked, how router is mocked, how dialog interactions are tested with `userEvent` |
| `components/ui/dialog.tsx` | The exported dialog primitives you can use (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`) |
| `components/ui/button.tsx` | Available `variant` values |
| `lib/api.ts` | `BingoApiError` export and `code` field |

### Implementation Details

**Imports (follow `DeleteRoomButton` style):**

```typescript
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { api, BingoApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
```

**Component sketch:**

```typescript
interface ResetRoomButtonProps {
	sessionCode: string;
}

export function ResetRoomButton({ sessionCode }: ResetRoomButtonProps) {
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");
	const tErrors = useTranslations("errors");
	const [open, setOpen] = useState(false);
	const [resetting, setResetting] = useState(false);

	async function handleReset() {
		setResetting(true);
		try {
			await api.resetRoom(sessionCode);
			setOpen(false);
		} catch (err) {
			if (err instanceof BingoApiError && err.code === "TIEBREAK_ALREADY_ACTIVE") {
				toast.error(tErrors("tiebreakActive"));
			} else {
				toast.error(tErrors("resetFailed"));
			}
		} finally {
			setResetting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button variant="outline" className="w-full">
						<RotateCcw className="size-4" aria-hidden />
						<span className="sr-only sm:not-sr-only">
							{t("resetRoom")}
						</span>
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("resetConfirmTitle")}</DialogTitle>
					<DialogDescription>{t("resetConfirmBody")}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={resetting}
					>
						{tCommon("cancel")}
					</Button>
					<Button onClick={handleReset} disabled={resetting}>
						{resetting ? tCommon("loading") : t("resetConfirmCta")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
```

**Mobile-first responsive note:** the pattern above hides the label on default (smallest) and reveals it at `sm:` via `sr-only`/`sm:not-sr-only`. Check `DeleteRoomButton` and any other admin buttons for the exact Tailwind convention used in this project — if there's a different idiom (e.g., `hidden sm:inline`), match that.

**Do NOT call `router.push` on success.** Unlike delete, reset keeps the user in the room.

### Test plan (`components/__tests__/reset-room-button.test.tsx`)

Match the structure of `delete-room-button.test.tsx`. Key cases:

```typescript
describe("ResetRoomButton", () => {
	it("opens the confirmation dialog when clicked", async () => {
		// render button, click it, expect dialog title visible
	});

	it("calls api.resetRoom and closes dialog on confirm", async () => {
		// mock api.resetRoom resolved
		// click trigger, click confirm
		// expect(api.resetRoom).toHaveBeenCalledWith("ABC123")
		// expect dialog hidden
	});

	it("shows the tiebreak-specific toast when api returns TIEBREAK_ALREADY_ACTIVE", async () => {
		// mock api.resetRoom to reject with new BingoApiError(400, "...", "TIEBREAK_ALREADY_ACTIVE")
		// assert toast.error called with the translated tiebreakActive message
	});

	it("shows the generic resetFailed toast on any other error", async () => {
		// mock api.resetRoom to reject with a generic Error (or BingoApiError with a different code)
		// assert toast.error called with the translated resetFailed message
	});

	it("does not call api when the dialog is cancelled", async () => {
		// click trigger, click cancel
		// expect(api.resetRoom).not.toHaveBeenCalled()
	});
});
```

Mock `api` via `vi.mock("@/lib/api", ...)` and mock `sonner`'s `toast` the same way the delete test does.

### Conventions (from project CLAUDE.md + project memory)

- Tabs for indentation.
- `"use client"` at the top — this is interactive.
- Mobile-first design — icon-only on small screens, icon + label on larger (this is a firm user preference).
- All API calls through `lib/api.ts` — no `fetch` here.
- Do NOT use `dangerouslySetInnerHTML` or `innerHTML` — the `no-xss.sh` PreToolUse hook blocks commits that do.
- `npm run lint` runs automatically via the `lint-fix.sh` PostToolUse hook.
- 80% coverage threshold via `coverage-check.sh` Stop hook.

## TDD Sequence

1. Read `components/delete-room-button.tsx` and `components/__tests__/delete-room-button.test.tsx` to lock in the style.
2. Write `components/__tests__/reset-room-button.test.tsx` with all five test cases (they will fail — component doesn't exist).
3. Run tests — confirm they fail for the expected reason.
4. Implement `components/reset-room-button.tsx`.
5. Re-run tests — they should pass.
6. Run the full test suite to confirm no regressions.

## Done Definition

All acceptance criteria checked. Tests green. No TypeScript errors.
Component is not yet wired into any page — that's task 04.
