# 002 — Player Name Form

## What to build
A name input form that gates the player room view. Players must enter a name before seeing the bingo board. On submit, send `/app/join-room` via WebSocket. Store name in sessionStorage so refreshing the same tab doesn't re-prompt.

## Acceptance Criteria
- [ ] Player sees a name form when visiting a room without a stored name
- [ ] Form validates: required, max 50 chars
- [ ] On submit, `joinRoom(playerName)` is called
- [ ] Name stored in sessionStorage as `player-name:{sessionCode}`
- [ ] If sessionStorage already has a name, skip the form and show the room
- [ ] 409 error (name taken) shown as inline form error
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `player-name-form.tsx` | `components/` | Name input form component |
| `player-name-form.test.tsx` | `components/__tests__/` | Tests |

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/[locale]/room/[code]/page.tsx` | Gate room view: show form if no stored name, show room if name exists. Pass `onPlayerJoin` to subscription for future use. |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `app/[locale]/(game)/create/page.tsx` | react-hook-form + zod pattern, FormField usage, error handling |
| `components/ui/form.tsx` | Form compound component imports |
| `components/ui/input.tsx` | Input component |
| `app/[locale]/room/[code]/page.tsx` | Current player page structure |

### Implementation Details

**Player name form** (`components/player-name-form.tsx`):
```typescript
"use client";

interface PlayerNameFormProps {
  sessionCode: string;
  onJoin: (playerName: string) => void;
  error?: string | null;
  submitting?: boolean;
}
```

- Zod schema: `z.object({ playerName: z.string().min(1).max(50) })`
- Use `react-hook-form` with `zodResolver`
- On submit: call `onJoin(playerName)`
- If `error` prop is set (e.g. "name taken"), display via `form.setError`
- Styled with existing Form/Input/Button components

**Player page changes** (`app/[locale]/room/[code]/page.tsx`):
- Add state: `playerName` initialized from `sessionStorage.getItem(\`player-name:${code}\`)`
- If no `playerName`: render `<PlayerNameForm>` instead of the room view
- On join: save to sessionStorage, set `playerName` state, call `joinRoom(playerName)` from hook
- Handle STOMP error frames for 409 → set form error "name taken"

**sessionStorage key**: `player-name:{sessionCode}` (per-tab, cleared on tab close)

### Conventions
- `"use client"` directive on form component
- `useTranslations("joinRoom")` for i18n — reuse existing namespace where keys fit
- Form pattern: `useForm` + `zodResolver` + `FormField` compound component
- Error handling: `BingoApiError` for REST, STOMP error frames for WS

## TDD Sequence
1. Write tests for PlayerNameForm: renders input, submit calls onJoin, validates max length, shows error prop
2. Implement PlayerNameForm component
3. Modify player page to gate view behind name form
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
