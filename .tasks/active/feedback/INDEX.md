# Feature: Feedback Modal

**Status**: ready
**Blocked by feature**: —
**Branch**: feature/feedback (off develop, PR to develop)

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Types, API function, i18n translations | ready | — | — |
| 002 | FeedbackDialog component + tests | blocked | 001 | — |
| 003 | Wire feedback button into AppHeader | blocked | 002 | — |

## Decisions
- Button in AppHeader right section: icon-only on mobile (MessageSquarePlus), icon + "Feedback" label on sm+ screens
- Dialog with form: name (required), content (required textarea), email (optional), phone (optional)
- Validation via zod + react-hook-form (existing project pattern)
- Success: toast + close dialog + reset form
- No need to use response DTO beyond confirming success
