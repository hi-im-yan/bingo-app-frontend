# CLAUDE.md — Bingo App Frontend

Real-time bingo game frontend. Rooms with manual/automatic draw modes, WebSocket live updates, QR code sharing.

## Stack
Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, ESLint 9.
WebSocket: STOMP over SockJS. HTTP: fetch (no axios in v2).

## Commands
- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npm test` — run tests (vitest, once added)

## Architecture
**App Router** with server components by default, `"use client"` only where needed.

```
app/              → pages and layouts (file-based routing)
  (game)/         → game-related routes (create, join, play, admin)
components/       → reusable UI components
  ui/             → base design system components
lib/              → utilities, API client, types, WebSocket setup
hooks/            → custom React hooks
```

## Design Conventions
- Server components by default. Client components only for interactivity (forms, WebSocket, state).
- All API calls go through a centralized client in `lib/api.ts` — never call fetch directly in components.
- WebSocket connection managed via a custom hook — not raw STOMP setup in pages.
- Types from `lib/types.ts` match backend DTOs: `RoomDTO`, `CreateRoomForm`, `AddNumberForm`, `DrawNumberForm`.
- Creator auth via `X-Creator-Hash` header + localStorage. Player access is unauthenticated.
- Room `drawMode` (`MANUAL`|`AUTOMATIC`) drives UI branching in admin panel.
- Environment: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`.

## Backend API
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/room` | Create room | none (returns creatorHash) |
| GET | `/api/v1/room/{session-code}` | Get room | X-Creator-Hash (optional) |
| DELETE | `/api/v1/room/{session-code}` | Delete room | X-Creator-Hash (required) |
| GET | `/api/v1/room/{session-code}/qrcode` | QR code PNG | none |
| WS | `/bingo-connect` | STOMP over SockJS | — |
| WS send | `/app/add-number` | Manual draw | creator-hash in payload |
| WS send | `/app/draw-number` | Auto draw | creator-hash in payload |
| WS sub | `/room/{sessionCode}` | Room updates | — |

## Hooks
Project-level hooks in `.claude/hooks/` — wired in `.claude/settings.json`.
- `no-xss.sh` — PreToolUse: blocks dangerouslySetInnerHTML and innerHTML
- `detect-hardcoded-keys.sh` — PreToolUse: blocks hardcoded API keys/secrets
- `lint-fix.sh` — PostToolUse: runs ESLint --fix on modified files
- `run-tests.sh` — PostToolUse (TaskUpdate): runs test suite when a feature task is marked completed
- `build-check.sh` — PostToolUse: runs `npm run build` on server component files (page.tsx/layout.tsx) to catch client/server boundary violations
- `coverage-check.sh` — Stop: verifies 80% coverage threshold
Do NOT run test/lint commands manually — hooks handle it.

## Git & Team
Branch: `v2` (feature branch off `main`). Conventional commits.
Team: **Frontend Pipeline** — see `~/.claude/references/team-profiles.md`.
Task management: `.tasks/` system — see `~/.claude/references/task-system.md`.
