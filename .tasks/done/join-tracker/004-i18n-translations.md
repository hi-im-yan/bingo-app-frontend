# 004 — i18n Translations (pt + en)

## What to build
Add Portuguese and English translations for all user-facing strings introduced in tasks 002 and 003.

## Acceptance Criteria
- [ ] All hardcoded strings from tasks 002/003 have i18n keys
- [ ] English translations in `messages/en.json`
- [ ] Portuguese translations in `messages/pt.json`
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `messages/en.json` | Add new keys |
| `messages/pt.json` | Add new keys |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `messages/en.json` | Existing key structure and naming conventions |
| `components/player-name-form.tsx` | Identify strings that need translation |
| `components/player-list.tsx` | Identify strings that need translation |
| `app/[locale]/room/[code]/admin/page.tsx` | Identify toast messages |

### Implementation Details

**Expected keys** (adjust based on actual strings used in 002/003):

`joinRoom` namespace:
| Key | EN | PT |
|-----|----|----|
| `nameLabel` | Your name | Seu nome |
| `namePlaceholder` | Enter your name | Digite seu nome |
| `joinButton` | Join | Entrar |
| `joining` | Joining... | Entrando... |
| `nameRequired` | Name is required | Nome obrigatorio |
| `nameTooLong` | Name must be 50 characters or less | Nome deve ter no maximo 50 caracteres |
| `nameTaken` | This name is already taken | Este nome ja esta em uso |

`admin` namespace:
| Key | EN | PT |
|-----|----|----|
| `players` | Players | Jogadores |
| `noPlayers` | No players yet | Nenhum jogador ainda |
| `playerJoined` | {name} joined the room | {name} entrou na sala |
| `joinedAt` | Joined at {time} | Entrou as {time} |

### Conventions
- Use existing namespace structure (don't create new top-level namespaces)
- Interpolation with `{variable}` syntax
- Keep keys camelCase
- Portuguese uses proper accents (a, e, o, etc.)

## TDD Sequence
1. Read components from 002/003 to identify all user-facing strings
2. Add keys to both en.json and pt.json
3. Verify components use `useTranslations()` with correct keys
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No hardcoded user-facing strings remain.
