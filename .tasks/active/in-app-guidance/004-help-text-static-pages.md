# 004 — Help Text on Home, Create, and Join Pages

## What to build
Add contextual inline help text to the home page, create room page, and join room page. These are static pages (no auto-hide behavior needed).

## Acceptance Criteria
- [ ] Home page explains what the app is and the difference between creating and joining
- [ ] Create room page explains draw modes in practical terms and what happens after creation
- [ ] Join room page explains where to get the room code
- [ ] All help text uses `<HelpText>` component (auto-hides when help is toggled off)
- [ ] All strings use i18n keys (no hardcoded text)
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/[locale]/page.tsx` | Add HelpText blocks |
| `app/[locale]/(game)/create/page.tsx` | Add HelpText blocks |
| `app/[locale]/(game)/join/page.tsx` | Add HelpText blocks |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/help-text.tsx` | HelpText usage pattern |
| `app/[locale]/page.tsx` | Current home page structure |
| `app/[locale]/(game)/create/page.tsx` | Current create page structure, form layout |
| `app/[locale]/(game)/join/page.tsx` | Current join page structure |
| `messages/en.json` | Existing i18n key patterns |

### Implementation Details

**Home page** (`app/[locale]/page.tsx`):
Place below the PageHeader (after subtitle), before the Create/Join buttons:
```tsx
<HelpText>
  {t("help.intro")}
</HelpText>
```

Help text content (EN): "Host a bingo game for your group. Create a room to draw numbers and share with players, or join an existing room with a code from your host."

Below the Create Room button:
```tsx
<HelpText className="text-xs">
  {t("help.createHint")}
</HelpText>
```
Content (EN): "You'll be the host — pick or draw numbers and share the room code with your players."

Below the Join Room section:
```tsx
<HelpText className="text-xs">
  {t("help.joinHint")}
</HelpText>
```
Content (EN): "Enter the 6-character code your host shared with you."

**Create room page** (`app/[locale]/(game)/create/page.tsx`):
Below the PageHeader:
```tsx
<HelpText>
  {t("help.createIntro")}
</HelpText>
```
Content (EN): "Set up your bingo room. After creating, you'll get a room code and QR code to share with your players."

Below the draw mode selection (after both radio options):
```tsx
<HelpText className="text-xs">
  {t("help.drawModeExplained")}
</HelpText>
```
Content (EN): "Manual mode is for when you have a bingo globe and want to pick the numbers yourself. Automatic mode lets the system draw random numbers for you."

**Join room page** (`app/[locale]/(game)/join/page.tsx`):
Below the PageHeader:
```tsx
<HelpText>
  {t("help.joinIntro")}
</HelpText>
```
Content (EN): "Ask your host for the 6-character room code. You can also scan the QR code if they have one displayed."

**i18n namespace:** All help keys go under `help` within each page's existing namespace:
- `home.help.intro`, `home.help.createHint`, `home.help.joinHint`
- `createRoom.help.createIntro`, `createRoom.help.drawModeExplained`
- `joinRoom.help.joinIntro`

### Conventions
- Import `HelpText` from `@/components/help-text`
- Use `useTranslations` with existing page namespace
- Help text placed after headers/labels, before interactive elements
- `text-xs` className override for secondary hints (less prominent)
- No structural changes to existing page layout

## TDD Sequence
1. Read all three pages to understand current structure
2. Add HelpText imports and blocks to each page
3. Add i18n keys (placeholder values — task 006 finalizes translations)
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. Help text visible on all three pages when help is on, hidden when off.
