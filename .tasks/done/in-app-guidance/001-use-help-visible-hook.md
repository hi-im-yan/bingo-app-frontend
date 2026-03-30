# 001 — useHelpVisible Hook

## What to build
A custom React hook that manages help text visibility state persisted in localStorage. Provides toggle and hide functions for controlling help text across the app.

## Acceptance Criteria
- [ ] `helpVisible` reads from localStorage key `bingo-help-visible`
- [ ] Defaults to `true` when no localStorage value exists (first-time users see help)
- [ ] `toggleHelp()` flips the value and persists to localStorage
- [ ] `hideHelp()` sets to false and persists (used by auto-hide on first draw)
- [ ] State is reactive — components re-render when value changes
- [ ] Works with SSR (no localStorage access during server render)
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `use-help-visible.ts` | `hooks/` | Help visibility hook |
| `use-help-visible.test.ts` | `hooks/__tests__/` | Tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `hooks/use-ball-sound.ts` | Hook structure, useRef + useCallback pattern |
| `lib/api.ts` | localStorage access pattern (see `getCreatorHash`, `saveCreatorHash`) |

### Implementation Details

```typescript
"use client";

const STORAGE_KEY = "bingo-help-visible";

interface UseHelpVisibleReturn {
  helpVisible: boolean;
  toggleHelp: () => void;
  hideHelp: () => void;
}

export function useHelpVisible(): UseHelpVisibleReturn
```

**Behavior:**
- Use `useState` with lazy initializer that reads from localStorage
- Guard localStorage access with `typeof window !== "undefined"` for SSR safety
- `toggleHelp`: flip current state, write to localStorage
- `hideHelp`: set false, write to localStorage
- Both functions wrapped in `useCallback`

**localStorage values:** store `"true"` or `"false"` as strings, parse with `=== "true"`

**Default logic:**
```typescript
const [helpVisible, setHelpVisible] = useState(() => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
});
```

### Conventions
- `"use client"` directive
- `useCallback` for stable function references
- No external dependencies beyond React

## TDD Sequence
1. Write tests: default true when no localStorage, reads stored value, toggleHelp flips and persists, hideHelp sets false and persists
2. Implement the hook
3. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
