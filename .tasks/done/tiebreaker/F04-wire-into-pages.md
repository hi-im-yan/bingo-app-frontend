# F04 — Wire Tiebreaker into Admin + Player Pages

## What to build
Connect the tiebreaker overlay and admin panel to the existing pages. Admin page gets the control panel and overlay. Player page gets the overlay (read-only). Both subscribe to `/room/{sessionCode}/tiebreak` via the hook's `onTiebreakUpdate` callback.

## Acceptance Criteria
- [ ] Admin page: TiebreakerPanel rendered in AUTOMATIC rooms (between AutomaticDrawPanel and ShareRoomSection)
- [ ] Admin page: TiebreakerOverlay shown when tiebreak state is active
- [ ] Admin page: startTiebreak and tiebreakDraw wired to hook actions with creatorHash
- [ ] Admin page: overlay dismissable after FINISHED (clears local tiebreak state)
- [ ] Player page: TiebreakerOverlay shown when tiebreak state is active
- [ ] Player page: overlay auto-dismisses after a delay when FINISHED (e.g. 5 seconds)
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/[locale]/room/[code]/admin/page.tsx` | Add tiebreak state, wire hook, render TiebreakerPanel + TiebreakerOverlay |
| `app/[locale]/room/[code]/page.tsx` | Add tiebreak state, wire hook, render TiebreakerOverlay |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `app/[locale]/room/[code]/admin/page.tsx` | Existing hook wiring pattern (handlePlayerJoin, handleCorrection callbacks) |
| `app/[locale]/room/[code]/page.tsx` | Existing hook wiring pattern, DrawPopup integration |
| `components/tiebreaker-overlay.tsx` | Props interface |
| `components/tiebreaker-panel.tsx` | Props interface |
| `hooks/use-room-subscription.ts` | startTiebreak, tiebreakDraw actions, onTiebreakUpdate option |

### Implementation Details

**Admin page changes:**
```typescript
// State
const [tiebreak, setTiebreak] = useState<TiebreakDTO | null>(null);

// Callback for hook
const handleTiebreakUpdate = useCallback((dto: TiebreakDTO) => {
  setTiebreak(dto);
}, []);

// Wire into hook
const { ..., startTiebreak, tiebreakDraw } = useRoomSubscription({
  ...,
  onTiebreakUpdate: handleTiebreakUpdate,
});

// Handlers for panel
const handleStartTiebreak = useCallback((playerCount: number) => {
  if (creatorHash) startTiebreak(creatorHash, playerCount);
}, [creatorHash, startTiebreak]);

const handleTiebreakDraw = useCallback((slot: number) => {
  if (creatorHash) tiebreakDraw(creatorHash, slot);
}, [creatorHash, tiebreakDraw]);

const handleTiebreakDismiss = useCallback(() => {
  setTiebreak(null);
}, []);

// Render (in AUTOMATIC mode section, after AutomaticDrawPanel):
<TiebreakerPanel
  tiebreak={tiebreak}
  onStart={handleStartTiebreak}
  onDraw={handleTiebreakDraw}
/>

// Render (at top level, alongside DrawPopup):
<TiebreakerOverlay tiebreak={tiebreak} onDismiss={handleTiebreakDismiss} />
```

**Player page changes:**
```typescript
// State
const [tiebreak, setTiebreak] = useState<TiebreakDTO | null>(null);

// Callback
const handleTiebreakUpdate = useCallback((dto: TiebreakDTO) => {
  setTiebreak(dto);
  // Auto-dismiss after 5s when finished
  if (dto.status === "FINISHED") {
    setTimeout(() => setTiebreak(null), 5000);
  }
}, []);

// Wire into hook
const { ... } = useRoomSubscription({
  ...,
  onTiebreakUpdate: handleTiebreakUpdate,
});

// Render (alongside DrawPopup):
<TiebreakerOverlay tiebreak={tiebreak} onDismiss={() => setTiebreak(null)} />
```

**Placement in admin page (AUTOMATIC mode):**
```
<AutomaticDrawPanel ... />
<TiebreakerPanel ... />        ← NEW
<HelpText>{t("help.shareRoom")}</HelpText>
<ShareRoomSection ... />
```

### Conventions
- `useCallback` for all handlers
- Import types from `@/lib/types`
- Consistent with existing page patterns

## TDD Sequence
1. Update admin page test mock to include `startTiebreak` and `tiebreakDraw` in hook mock return
2. Write test: TiebreakerPanel renders in AUTOMATIC mode admin page
3. Write test: TiebreakerOverlay not visible when tiebreak is null
4. Implement admin page changes
5. Implement player page changes
6. Run full test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
