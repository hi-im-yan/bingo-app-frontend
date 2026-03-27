# F0.5 — Types + API Client

**Status:** done
**Blocked by:** —
**Branch:** feature/types-and-api-client

## Description
Create TypeScript interfaces matching backend DTOs (RoomDTO, CreateRoomForm, AddNumberForm, DrawNumberForm, ApiResponse). Build centralized fetch client with base URL config, X-Creator-Hash header injection, and error handling. Add bingo constants (letter/range mappings). Unit tests for all.

## Tasks

| ID | Task | Status | Blocked By | Assignee |
|----|------|--------|------------|----------|
| 001 | Define TypeScript types (lib/types.ts) | done | — | Logic Writer |
| 002 | Build API client (lib/api.ts) | done | 001 | Logic Writer |
| 003 | Add bingo constants (lib/constants.ts) | done | — | Logic Writer |
| 004 | Unit tests for API client and constants | done | 001, 002, 003 | Logic Writer |

## Decisions
- Native fetch (no axios) — Next.js 16 extends fetch with caching/revalidation
- API client handles: base URL from env, X-Creator-Hash injection, JSON parsing, error mapping
- Types match backend DTOs exactly (see FRONTEND_API.md)
- BingoApiError class for typed error handling
- Creator hash stored in localStorage keyed by session code
- 12 API tests, 24 constants tests
