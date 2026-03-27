# 002 — Admin QR Modal & Full URL Copy
**Status:** ready
**Blocked by:** none
**Assignee:** Component Builder

## What
Enhance `components/share-room-section.tsx` with two UX improvements:

1. **QR modal** — Add a "Show QR" button (desktop only) that opens the existing `Dialog` component with a larger version of the QR code image, giving admins an easy way to project or share the code visually without leaving the page.
2. **Full URL copy** — Change the existing "Copy" button to copy the full join URL (`${window.location.origin}/${locale}/room/${sessionCode}`) instead of just the bare session code, so the link is directly pasteable.

## Acceptance Criteria
- [ ] A "Show QR" button is present in the share section, visible only on `md` and larger screens (`hidden md:inline-flex` or equivalent Tailwind class)
- [ ] Clicking "Show QR" opens a `Dialog` containing the QR code image at a larger size (at least 300×300px)
- [ ] The dialog uses the existing components from `@/components/ui/dialog`: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`
- [ ] The dialog has a visible title using i18n key `admin.showQr`
- [ ] The dialog is closable via its built-in close button (already provided by `DialogContent`)
- [ ] The copy button now writes the full URL to the clipboard: `${window.location.origin}/${locale}/room/${sessionCode}`
- [ ] `locale` is obtained via `useLocale()` from `next-intl`
- [ ] The existing copied/copy toggle feedback on the button is preserved
- [ ] A new i18n label for the copy button area uses key `admin.roomUrl` (used as aria-label or as a section label)
- [ ] Keys `admin.showQr` and `admin.roomUrl` are added to `messages/en.json` and `messages/pt.json`
- [ ] No new dependencies are introduced

## Implementation Notes
- `useLocale` import: `import { useLocale, useTranslations } from "next-intl"`
- URL construction must happen inside the click handler (not at render time) to avoid SSR mismatches with `window.location.origin`. Alternatively wrap in `typeof window !== "undefined"` guard
- Dialog trigger pattern with `@base-ui/react/dialog` (already used in `components/ui/dialog.tsx`): wrap the "Show QR" button with `<DialogTrigger render={<Button ... />}>` inside a `<Dialog>` root
- The QR image inside the dialog reuses `api.getQrCodeUrl(sessionCode)` from `@/lib/api` — no new endpoint needed
- Suggested image size in dialog: `width={300} height={300}`
- English string suggestions:
  - `"showQr": "Show QR Code"`
  - `"roomUrl": "Room URL"`
- Portuguese string suggestions:
  - `"showQr": "Mostrar QR Code"`
  - `"roomUrl": "URL da sala"`
- The small inline QR image already present in the card body should be kept so the layout remains consistent on mobile where the modal button is hidden
