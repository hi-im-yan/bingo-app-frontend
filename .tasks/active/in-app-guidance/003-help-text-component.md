# 003 — HelpText Component

## What to build
A styled inline help text component that conditionally renders based on the help visibility state. Wraps `useHelpVisible` so consumers just use `<HelpText>` without managing visibility themselves. Includes fade animation for smooth enter/exit.

## Acceptance Criteria
- [ ] Renders children when help is visible
- [ ] Renders nothing when help is hidden
- [ ] Styled with muted text, small font, subtle left border accent
- [ ] Smooth fade-in animation when appearing
- [ ] Accepts className prop for layout customization
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `help-text.tsx` | `components/` | Conditional help text wrapper |
| `help-text.test.tsx` | `components/__tests__/` | Tests |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/page-header.tsx` | Simple component pattern with className prop, cn() usage |
| `components/connection-status.tsx` | Conditional render pattern (returns null when not needed) |
| `hooks/use-help-visible.ts` | Hook import and usage |

### Implementation Details

**Component** (`components/help-text.tsx`):
```typescript
"use client";

import { useHelpVisible } from "@/hooks/use-help-visible";
import { cn } from "@/lib/utils";

interface HelpTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HelpText({ children, className }: HelpTextProps) {
  const { helpVisible } = useHelpVisible();

  if (!helpVisible) return null;

  return (
    <div
      data-slot="help-text"
      className={cn(
        "animate-in fade-in-0 duration-300 rounded-lg border-l-2 border-primary/30 bg-primary/5 px-3 py-2 text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

**Styling rationale:**
- `border-l-2 border-primary/30` — subtle left accent that visually distinguishes help from content
- `bg-primary/5` — barely visible warm background tint
- `text-sm text-muted-foreground` — smaller, muted so it doesn't compete with game UI
- `animate-in fade-in-0 duration-300` — smooth entrance (uses tw-animate-css already in project)
- `rounded-lg` — matches project's rounded aesthetic
- `px-3 py-2` — compact padding

**Usage pattern** (by consumers):
```tsx
<HelpText>
  {t("help.createRoomIntro")}
</HelpText>
```

No need to import the hook — HelpText manages it internally.

### Conventions
- `"use client"` directive
- `cn()` from `@/lib/utils` for className merging
- `data-slot` attribute for CSS targeting
- Animation classes from `tw-animate-css` (already imported in globals.css)
- Component accepts standard `className` prop for flexibility

## TDD Sequence
1. Write tests: renders children when help visible, renders nothing when hidden, applies custom className, has data-slot attribute
2. Implement HelpText component
3. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. No compilation warnings.
