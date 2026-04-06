# 002 — FeedbackDialog Component + Tests

## What to build
A client component `FeedbackDialog` that renders a dialog with a feedback form. Uses zod validation, react-hook-form, the `api.submitFeedback()` function, and sonner toasts for success/error. The dialog is controlled via open/onOpenChange props.

## Acceptance Criteria
- [ ] `components/feedback-dialog.tsx` exists as a `"use client"` component
- [ ] Form has 4 fields: name (required, max 100), content (required textarea, max 2000), email (optional, valid format, max 254), phone (optional, max 20)
- [ ] Zod schema validates all constraints matching backend
- [ ] Submit calls `api.submitFeedback()` and shows success toast on 200
- [ ] On error, shows error toast
- [ ] On success, dialog closes, form resets
- [ ] Submit button shows loading state while submitting
- [ ] All text uses `useTranslations("feedback")` — no hardcoded strings
- [ ] Unit tests cover: rendering, validation errors, successful submission, API error handling
- [ ] All tests pass

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `feedback-dialog.tsx` | `components/` | Dialog + form component |
| `feedback-dialog.test.tsx` | `__tests__/components/` | Unit tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/player-name-form.tsx` | Form structure: zod schema, useForm, FormField/FormItem/FormControl/FormLabel/FormMessage |
| `components/delete-room-button.tsx` | Dialog usage: Dialog/DialogTrigger/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter |
| `components/ui/dialog.tsx` | Available dialog subcomponents and props |
| `components/ui/form.tsx` | Available form subcomponents |
| `lib/types.ts` | `FeedbackForm` interface (added in task 001) |
| `lib/api.ts` | `api.submitFeedback()` signature (added in task 001) |
| `__tests__/components/player-name-form.test.tsx` | Test patterns: render, user interaction, assertions |

### Implementation Details

**Props:**
```typescript
interface FeedbackDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
```

**Zod schema:**
```typescript
const feedbackSchema = z.object({
	name: z.string().min(1).max(100),
	content: z.string().min(1).max(2000),
	email: z.string().email().max(254).optional().or(z.literal("")),
	phone: z.string().max(20).optional().or(z.literal("")),
});
```

**Form layout (mobile-first):**
- DialogContent with DialogHeader (title + description)
- Form with vertical stack of fields (flex-col gap)
- name: Input (required)
- content: Textarea (required) — use a `<textarea>` styled with the same classes as Input, or check if a Textarea component exists in `components/ui/`
- email: Input type="email" (optional)
- phone: Input type="tel" (optional)
- DialogFooter with cancel + submit buttons
- Submit button disabled while `form.formState.isSubmitting`

**Submit handler:**
```typescript
async function onSubmit(values: z.infer<typeof feedbackSchema>) {
	try {
		await api.submitFeedback({
			name: values.name,
			content: values.content,
			email: values.email || undefined,
			phone: values.phone || undefined,
		});
		toast.success(t("success"));
		form.reset();
		onOpenChange(false);
	} catch {
		toast.error(t("error"));
	}
}
```

Convert empty strings to `undefined` for optional fields so they aren't sent as `""` to the backend.

**Tests should cover:**
1. Renders all form fields and buttons
2. Shows validation errors for empty required fields (name, content)
3. Calls `api.submitFeedback` with correct data on valid submission
4. Shows success toast and closes dialog on success
5. Shows error toast on API failure
6. Does not close dialog on API failure

### Conventions (from project CLAUDE.md)
- `"use client"` directive at top
- Tabs for indentation
- All text via `useTranslations("feedback")` — no hardcoded strings
- Form pattern: zod + react-hook-form + zodResolver
- Dialog pattern: Dialog/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter
- Toast: `import { toast } from "sonner"`
- API: `import { api } from "@/lib/api"`
- Mobile-first: design for small screens first, responsive classes for larger

## TDD Sequence
1. Write `__tests__/components/feedback-dialog.test.tsx` — test rendering, validation, submission success/error
2. Write `components/feedback-dialog.tsx` — make tests pass
3. Run test suite — all tests must pass

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings. Form validates correctly and handles all API responses.
