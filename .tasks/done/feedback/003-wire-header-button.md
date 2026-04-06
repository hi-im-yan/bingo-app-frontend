# 003 — Wire Feedback Button into AppHeader

## What to build
Add a feedback button to the AppHeader's right section that opens the FeedbackDialog. Icon-only on mobile (MessageSquarePlus), icon + "Feedback" label on sm+ screens.

## Acceptance Criteria
- [ ] Feedback button appears in AppHeader right section (between ThemePicker and Help toggle)
- [ ] Mobile: icon-only button (MessageSquarePlus from lucide-react)
- [ ] sm+ screens: icon + "Feedback" text label visible
- [ ] Clicking the button opens the FeedbackDialog
- [ ] Button has proper `aria-label` using i18n
- [ ] Unit tests cover: button renders, dialog opens on click
- [ ] All tests pass
- [ ] `npm run build` succeeds (app-header is used in a server component layout)

## Technical Spec

### Files to MODIFY
| File | Change |
|------|--------|
| `components/app-header.tsx` | Add feedback button + FeedbackDialog |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/app-header.tsx` | Current header structure, button styling, icon sizes |
| `components/feedback-dialog.tsx` | Props interface (created in task 002) |

### Implementation Details

**Add imports:**
```typescript
import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackDialog } from "@/components/feedback-dialog";
```

**Add state:**
```typescript
const [feedbackOpen, setFeedbackOpen] = useState(false);
```

**Add translations:**
```typescript
const t = useTranslations("common");
const tFeedback = useTranslations("feedback");
```

**Add button between ThemePicker and HelpCircle button:**
```tsx
<Button
	variant="ghost"
	size="icon-sm"
	onClick={() => setFeedbackOpen(true)}
	aria-label={tFeedback("button")}
	className="gap-1.5 sm:w-auto sm:px-2"
>
	<MessageSquarePlus className="size-4" />
	<span className="hidden text-xs sm:inline">{tFeedback("button")}</span>
</Button>
<FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
```

Note: override `size="icon-sm"` width on sm+ with `sm:w-auto sm:px-2` so the text label has room. The `hidden sm:inline` pattern hides text on mobile, shows on sm+.

### Conventions (from project CLAUDE.md)
- Mobile-first: icon-only on small screens, icon + label on sm+
- Tabs for indentation
- Icon size: `size-4` (matches existing header icons)
- Button variant: `ghost`, size: `icon-sm` (matches existing header buttons)
- i18n: use `useTranslations` for all text

## TDD Sequence
1. Write/update `__tests__/components/app-header.test.tsx` — test feedback button renders, dialog opens on click
2. Modify `components/app-header.tsx` — add button + dialog
3. Run test suite — all tests must pass
4. Run `npm run build` — verify no client/server boundary errors

## Done Definition
All acceptance criteria checked. Tests green. Build succeeds. Button is visible and functional on all screen sizes.
