# 001 — Types, API Client, and Bingo Constants

## What was built
TypeScript interfaces matching backend DTOs. Centralized fetch client with auth header injection. Bingo letter/range constants with utility functions. Full unit test coverage.

## Files CREATED
| File | Path | Purpose |
|------|------|---------|
| types.ts | lib/types.ts | RoomDTO, CreateRoomForm, AddNumberForm, DrawNumberForm, ApiError, DrawMode, BingoLetter |
| api.ts | lib/api.ts | Centralized fetch client with BingoApiError, creator hash helpers, api.* methods |
| constants.ts | lib/constants.ts | BINGO_LETTERS, BINGO_RANGES, TOTAL_NUMBERS, getLetterForNumber, formatBingoLabel, getNumbersForLetter |
| api.test.ts | lib/__tests__/api.test.ts | 12 tests for API client |
| constants.test.ts | lib/__tests__/constants.test.ts | 24 tests for bingo constants |

## API Client Methods
- `api.createRoom(form)` — POST, stores creatorHash in localStorage
- `api.getRoom(sessionCode)` — GET, auto-injects X-Creator-Hash if available
- `api.deleteRoom(sessionCode)` — DELETE, requires creatorHash, removes from localStorage
- `api.getQrCodeUrl(sessionCode)` — returns URL string (no fetch)
- `getCreatorHash(sessionCode)` / `saveCreatorHash()` / `removeCreatorHash()` — localStorage helpers

## Done Definition
- All types match backend DTOs from FRONTEND_API.md
- 12 API tests + 24 constants tests passing
- npm run build succeeds
