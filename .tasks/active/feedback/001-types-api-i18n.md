# 001 — Types, API Function, i18n Translations

## What to build
Add the FeedbackForm and FeedbackMessageDTO TypeScript interfaces, the submitFeedback API function, and i18n translation keys for the feedback modal in both English and Portuguese.

## Acceptance Criteria
- [ ] `FeedbackForm` and `FeedbackMessageDTO` interfaces exist in `lib/types.ts`
- [ ] `submitFeedback` function exists in `lib/api.ts` and is exported via the `api` object
- [ ] `feedback` section exists in both `messages/en.json` and `messages/pt.json`
- [ ] All existing tests still pass

## Technical Spec

### Files to MODIFY
| File | Change |
|------|--------|
| `lib/types.ts` | Add `FeedbackForm` and `FeedbackMessageDTO` interfaces |
| `lib/api.ts` | Add `submitFeedback` function, update import and export |
| `messages/en.json` | Add `feedback` section |
| `messages/pt.json` | Add `feedback` section |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `lib/types.ts` | Existing interface style |
| `lib/api.ts` | `request<T>()` pattern, how functions are exported |
| `messages/en.json` | Existing i18n key structure |

### Implementation Details

**Types (`lib/types.ts`)** — add at the end, before any deprecated types:

```typescript
export interface FeedbackForm {
	name: string;
	email?: string;
	phone?: string;
	content: string;
}

export interface FeedbackMessageDTO {
	id: number;
	name: string;
	email?: string;
	phone?: string;
	content: string;
	createdAt: string;
}
```

**API function (`lib/api.ts`)** — add after `getQrCodeUrl`:

```typescript
async function submitFeedback(form: FeedbackForm): Promise<FeedbackMessageDTO> {
	return request<FeedbackMessageDTO>("/api/v1/feedback", {
		method: "POST",
		body: JSON.stringify(form),
	});
}
```

Update the import to include `FeedbackForm, FeedbackMessageDTO` and add `submitFeedback` to the `api` export object.

**i18n keys** — add a `feedback` section to both language files:

English (`messages/en.json`):
```json
"feedback": {
	"button": "Feedback",
	"title": "Send Feedback",
	"description": "Help us improve the experience",
	"nameLabel": "Your name",
	"namePlaceholder": "Enter your name",
	"contentLabel": "Message",
	"contentPlaceholder": "Tell us what you think...",
	"emailLabel": "Email (optional)",
	"emailPlaceholder": "your@email.com",
	"phoneLabel": "Phone (optional)",
	"phonePlaceholder": "Your phone number",
	"submit": "Send",
	"submitting": "Sending...",
	"success": "Thank you for your feedback!",
	"error": "Failed to send feedback. Please try again."
}
```

Portuguese (`messages/pt.json`):
```json
"feedback": {
	"button": "Feedback",
	"title": "Enviar Feedback",
	"description": "Ajude-nos a melhorar a experiência",
	"nameLabel": "Seu nome",
	"namePlaceholder": "Digite seu nome",
	"contentLabel": "Mensagem",
	"contentPlaceholder": "Conte-nos o que você acha...",
	"emailLabel": "E-mail (opcional)",
	"emailPlaceholder": "seu@email.com",
	"phoneLabel": "Telefone (opcional)",
	"phonePlaceholder": "Seu número de telefone",
	"submit": "Enviar",
	"submitting": "Enviando...",
	"success": "Obrigado pelo seu feedback!",
	"error": "Falha ao enviar feedback. Tente novamente."
}
```

### Conventions (from project CLAUDE.md)
- All API calls go through centralized client in `lib/api.ts` — never call fetch directly
- Types in `lib/types.ts` match backend DTOs
- Tabs for indentation
- i18n: `next-intl`, messages in `messages/` directory, en.json and pt.json

## TDD Sequence
1. No dedicated tests for this task — these are type definitions, a thin API wrapper, and translation keys
2. Run existing test suite to ensure nothing broke

## Done Definition
All acceptance criteria checked. Types compile. API function follows existing pattern. Both language files have complete feedback sections. Existing tests green.
