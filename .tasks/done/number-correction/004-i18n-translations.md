# 004 — i18n Translations for Number Correction

## What to build
Add translation keys for the number correction feature to both Portuguese and English message files.

## Acceptance Criteria
- [ ] All correction-related UI text uses `useTranslations` — no hardcoded strings
- [ ] Portuguese translations in `messages/pt.json`
- [ ] English translations in `messages/en.json`
- [ ] All tests pass (`npm test`)
- [ ] `npm run build` succeeds

## Technical Spec

### Files to MODIFY
| File | Path | Change |
|------|------|--------|
| `pt.json` | `messages/pt.json` | Add correction keys under `"admin"` namespace |
| `en.json` | `messages/en.json` | Add correction keys under `"admin"` namespace |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `messages/en.json` | Existing key structure and naming conventions |
| `messages/pt.json` | Existing key structure |
| `components/correct-number-panel.tsx` | Which translation keys are used (from task 002) |

### Translation Keys

Add under the `"admin"` namespace in both files:

**English (`messages/en.json`):**
```json
{
  "admin": {
    "correctNumber": "Correct",
    "selectCorrection": "Select the correct number",
    "confirmCorrection": "Replace {oldLabel} with {newLabel}?",
    "confirmButton": "Confirm",
    "cancelButton": "Cancel"
  }
}
```

**Portuguese (`messages/pt.json`):**
```json
{
  "admin": {
    "correctNumber": "Corrigir",
    "selectCorrection": "Selecione o numero correto",
    "confirmCorrection": "Substituir {oldLabel} por {newLabel}?",
    "confirmButton": "Confirmar",
    "cancelButton": "Cancelar"
  }
}
```

Note: These keys are added to the existing `"admin"` object — do NOT replace existing keys. Merge them in.

### Conventions (from project CLAUDE.md)
- All user-facing text must go through `next-intl` — no hardcoded strings
- Keys use camelCase
- Interpolation uses `{variable}` syntax
- Portuguese is the default locale

## TDD Sequence
1. Add keys to both message files
2. Verify components from tasks 002/003 render correctly with translations
3. Run `npm run build` to catch any missing keys

## Done Definition
All keys present in both locale files. No hardcoded strings in correction components. Build succeeds.
