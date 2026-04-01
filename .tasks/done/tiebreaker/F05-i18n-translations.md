# F05 — i18n Translations (pt + en)

## What to build
Add Portuguese and English translations for all user-facing strings introduced in tasks F02, F03, and F04.

## Acceptance Criteria
- [ ] All hardcoded strings from F02/F03/F04 have i18n keys
- [ ] English translations in `messages/en.json`
- [ ] Portuguese translations in `messages/pt.json`
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `messages/en.json` | Add `tiebreak` namespace |
| `messages/pt.json` | Add `tiebreak` namespace |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `messages/en.json` | Existing namespace structure and naming conventions |
| `components/tiebreaker-overlay.tsx` | Identify strings that need translation |
| `components/tiebreaker-panel.tsx` | Identify strings that need translation |

### Implementation Details

**`tiebreak` namespace** (adjust keys based on actual strings used in F02/F03):

| Key | EN | PT |
|-----|----|----|
| `title` | Tiebreaker! | Desempate! |
| `startButton` | Start Tiebreaker | Iniciar Desempate |
| `playerCount` | Players | Jogadores |
| `drawSlot` | Draw {slot} | Sorteio {slot} |
| `drawButton` | Draw | Sortear |
| `waiting` | Waiting... | Aguardando... |
| `winnerBanner` | Draw {slot} wins! | Sorteio {slot} venceu! |
| `close` | Close | Fechar |
| `drawn` | Drawn: {label} | Sorteado: {label} |

### Conventions
- New `tiebreak` top-level namespace (tiebreaker is a distinct feature, not part of existing admin/room)
- Interpolation with `{variable}` syntax
- Keep keys camelCase
- Portuguese uses proper accents (ã, é, etc.)

## TDD Sequence
1. Read components from F02/F03 to identify all user-facing strings
2. Add keys to both en.json and pt.json
3. Verify components use `useTranslations("tiebreak")` with correct keys
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No hardcoded user-facing strings remain.
