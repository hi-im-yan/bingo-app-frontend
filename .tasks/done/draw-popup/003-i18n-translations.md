# 003 — i18n Translations (pt + en)

## What to build
Add Portuguese and English translations for the aria-live announcement text used in the DrawPopup component.

## Acceptance Criteria
- [ ] English translations in `messages/en.json`
- [ ] Portuguese translations in `messages/pt.json`
- [ ] DrawPopup component uses `useTranslations` with correct keys
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `messages/en.json` | Add keys under `room` namespace |
| `messages/pt.json` | Add keys under `room` namespace |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `messages/en.json` | Existing key structure |
| `components/draw-popup.tsx` | Identify strings that need translation |

### Implementation Details

Add to `room` namespace:

| Key | EN | PT |
|-----|----|----|
| `numberDrawn` | Number drawn: {label} | Numero sorteado: {label} |

This key is used in the `aria-live` region of the DrawPopup. The `{label}` interpolation receives the formatted bingo label (e.g. "B-7").

### Conventions
- Use existing `room` namespace — no new top-level namespace
- Interpolation with `{variable}` syntax
- Portuguese uses proper accents (u in numero)
- Keep keys camelCase

## TDD Sequence
1. Read DrawPopup component to confirm key usage
2. Add keys to both en.json and pt.json
3. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No hardcoded user-facing strings.
