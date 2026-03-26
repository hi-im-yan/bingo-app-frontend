# F0.3 — Design System

**Status:** done
**Blocked by:** F0.2 (shadcn-ui-setup)
**Branch:** feature/design-system

## Description
Designer agent proposes visual direction (colors, typography, spacing, component styling). Configure Tailwind theme tokens + CSS variables. Create base layout components (shell, page container, card). Document in `.interface-design/system.md`.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Design visual direction and tokens | done | — | Designer |
| 002 | Configure Tailwind theme + CSS variables | done | 001 | Component Builder |
| 003 | Create base layout components | done | 002 | Component Builder |

## Decisions
- Warm amber/gold palette with oklch colors — fits the bingo game world (warm, community, fun)
- Outfit font — rounded, friendly, readable for elderly users
- Custom game tokens: --ball, --ball-foreground, --ball-drawn, --ball-drawn-foreground
- 44px+ touch targets, 16px min text for accessibility
- Base components: PageContainer, PageHeader/PageTitle/PageDescription, GameCard, BingoBall
- Documented in `.interface-design/system.md`
