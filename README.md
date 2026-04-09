# Grita Bingo — Frontend

Real-time bingo game web app. Create rooms, share via QR code, and play with live updates over WebSocket. Supports manual and automatic draw modes.

**Live:** https://gritabingo.com.br/pt

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4
- STOMP over SockJS for real-time updates
- next-intl for i18n (en / pt)

## Getting started
```bash
npm install
npm run dev
```

Configure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` in `.env.local` to point at the backend.

## Scripts
- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm test` — run tests

## Related
Backend repo: separate Spring Boot service (see `FRONTEND_API.md` in the backend for the full API contract).
