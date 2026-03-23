# F0.2 — shadcn/ui Setup

**Status:** ready
**Blocked by:** —
**Branch:** feature/shadcn-ui-setup

## Description
Initialize shadcn/ui for Tailwind 4 + React 19. Configure component paths and aliases. Install base components: Button, Input, Dialog, Form, Label, Skeleton.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Initialize shadcn/ui and configure paths | ready | — | Component Builder |
| 002 | Install base components | ready | 001 | Component Builder |

## Decisions
- shadcn/ui: same as v1 but compatible with new stack. Not a runtime dependency — components are copied into project.
