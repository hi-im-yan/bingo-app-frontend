# 001 — Create Room Page

## What was built
Form page at `/create` with room name, description, draw mode selector, Zod validation, API submission, and redirect to admin panel.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| page.tsx | app/[locale]/create/page.tsx | Client component — react-hook-form + Zod, draw mode toggle, API call |
| page.test.tsx | app/[locale]/create/__tests__/page.test.tsx | 5 tests |

## Key Details
- react-hook-form + zodResolver for form state
- Draw mode selector: two toggle buttons (MANUAL/AUTOMATIC) with selected state via bg-primary/10
- On submit: calls api.createRoom, redirects to `/room/{code}/admin`
- 409 conflict: shown inline on name field via setError
- All text via useTranslations("createRoom")

## Tests (5)
- Renders form fields and labels
- Shows validation error for empty name
- Selects draw mode
- Submits and redirects on success
- Shows conflict error on 409

## Done Definition
- Form validates and submits correctly
- 5 tests passing
- npm run build succeeds
