# 006 — i18n Translations (pt + en)

## What to build
Add Portuguese and English translations for all help text strings and header aria-labels introduced in tasks 002-005.

## Acceptance Criteria
- [ ] All help text strings have i18n keys in both languages
- [ ] Header aria-labels translated
- [ ] English translations in `messages/en.json`
- [ ] Portuguese translations in `messages/pt.json`
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `messages/en.json` | Add help and header keys |
| `messages/pt.json` | Add help and header keys |

### Files to READ (to identify all strings)
| File | What to look for |
|------|-----------------|
| `components/app-header.tsx` | aria-labels for home link and help toggle |
| `app/[locale]/page.tsx` | Help text keys used |
| `app/[locale]/(game)/create/page.tsx` | Help text keys used |
| `app/[locale]/(game)/join/page.tsx` | Help text keys used |
| `app/[locale]/room/[code]/page.tsx` | Help text keys used |
| `app/[locale]/room/[code]/admin/page.tsx` | Help text keys used |

### Implementation Details

**`common` namespace** (header aria-labels):
| Key | EN | PT |
|-----|----|----|
| `home` | Home | Inicio |
| `showHelp` | Show help | Mostrar ajuda |
| `hideHelp` | Hide help | Ocultar ajuda |

**`home` namespace** (help sub-keys):
| Key | EN | PT |
|-----|----|----|
| `help.intro` | Host a bingo game for your group. Create a room to draw numbers and share with players, or join an existing room with a code from your host. | Organize um jogo de bingo para seu grupo. Crie uma sala para sortear numeros e compartilhe com os jogadores, ou entre em uma sala existente com o codigo do anfitriao. |
| `help.createHint` | You'll be the host — pick or draw numbers and share the room code with your players. | Voce sera o anfitriao — escolha ou sorteie numeros e compartilhe o codigo da sala com seus jogadores. |
| `help.joinHint` | Enter the 6-character code your host shared with you. | Digite o codigo de 6 caracteres que seu anfitriao compartilhou com voce. |

**`createRoom` namespace**:
| Key | EN | PT |
|-----|----|----|
| `help.createIntro` | Set up your bingo room. After creating, you'll get a room code and QR code to share with your players. | Configure sua sala de bingo. Apos criar, voce recebera um codigo de sala e QR code para compartilhar com seus jogadores. |
| `help.drawModeExplained` | Manual mode is for when you have a bingo globe and want to pick the numbers yourself. Automatic mode lets the system draw random numbers for you. | O modo manual e para quando voce tem um globo de bingo e quer escolher os numeros. O modo automatico deixa o sistema sortear numeros aleatorios para voce. |

**`joinRoom` namespace**:
| Key | EN | PT |
|-----|----|----|
| `help.joinIntro` | Ask your host for the 6-character room code. You can also scan the QR code if they have one displayed. | Peca ao anfitriao o codigo de 6 caracteres da sala. Voce tambem pode escanear o QR code se ele estiver exibido. |

**`room` namespace**:
| Key | EN | PT |
|-----|----|----|
| `help.playerIntro` | The host is drawing numbers. When a number is called, it will appear here. Mark it off on your bingo card! | O anfitriao esta sorteando numeros. Quando um numero for sorteado, ele aparecera aqui. Marque no seu cartao de bingo! |
| `help.waitingForHost` | Waiting for the host to start drawing numbers. Keep this page open — updates appear in real time. | Aguardando o anfitriao comecar a sortear. Mantenha esta pagina aberta — as atualizacoes aparecem em tempo real. |

**`admin` namespace**:
| Key | EN | PT |
|-----|----|----|
| `help.adminIntro` | You're the host. Numbers you draw are shown live to all players in this room. | Voce e o anfitriao. Os numeros sorteados sao exibidos ao vivo para todos os jogadores nesta sala. |
| `help.manualMode` | Click on a number to draw it. Already drawn numbers are disabled. | Clique em um numero para sortea-lo. Numeros ja sorteados ficam desabilitados. |
| `help.automaticMode` | Click the button to draw a random number. | Clique no botao para sortear um numero aleatorio. |
| `help.correction` | Drew the wrong number? Use the Correct button to fix it. | Sorteou o numero errado? Use o botao Corrigir para corrigi-lo. |
| `help.shareRoom` | Share the room code or QR code with your players so they can follow along. | Compartilhe o codigo da sala ou QR code com seus jogadores para que possam acompanhar. |

### Conventions
- Help keys nested under `help.` within each page's existing namespace
- Use proper Portuguese accents (a, e, o, u, etc.)
- Interpolation with `{variable}` syntax where needed
- Keep keys camelCase
- Don't create new top-level namespaces

## TDD Sequence
1. Read all components from tasks 002-005 to confirm exact key names used
2. Add all keys to both en.json and pt.json
3. Run test suite to verify no missing translation warnings

## Done Definition
All acceptance criteria checked. Tests green. No hardcoded user-facing strings.
