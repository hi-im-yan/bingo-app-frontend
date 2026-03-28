# 002 — AppHeader Component

## What to build
A global app header with a home link and help toggle button. Integrated into the root layout so it appears on every page. Minimal and compact — doesn't compete with page content.

## Acceptance Criteria
- [ ] Header renders on every page (added to root layout)
- [ ] Home link navigates to `/` using locale-aware Link
- [ ] Help toggle button shows current state (on/off visual)
- [ ] Clicking help toggle calls `toggleHelp()` from useHelpVisible
- [ ] Header is visually compact — doesn't dominate the page
- [ ] Header respects max-w-lg container width (matches PageContainer)
- [ ] Accessible: buttons have aria-labels
- [ ] All tests pass (`npm test`)

## Technical Spec

### Files to CREATE
| File | Path | Purpose |
|------|------|---------|
| `app-header.tsx` | `components/` | Global header component |
| `app-header.test.tsx` | `components/__tests__/` | Tests |

### Files to MODIFY
| File | What to change |
|------|---------------|
| `app/[locale]/layout.tsx` | Add `<AppHeader />` above `{children}` inside the body/provider |

### Files to READ (for patterns — do NOT modify)
| File | What to copy |
|------|-------------|
| `components/page-container.tsx` | Container width pattern: `mx-auto max-w-lg px-4 sm:px-6` |
| `components/connection-status.tsx` | Top-level banner component pattern |
| `components/ui/button.tsx` | Button variants and sizes (use `ghost`, `icon-sm`) |
| `i18n/navigation.ts` | Locale-aware `Link` import |
| `hooks/use-help-visible.ts` | Hook usage |

### Implementation Details

**Component** (`components/app-header.tsx`):
```typescript
"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHelpVisible } from "@/hooks/use-help-visible";
```

**Structure:**
```tsx
<header className="w-full border-b border-border/50">
  <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2 sm:px-6">
    {/* Left: Home link */}
    <Button variant="ghost" size="icon-sm" asChild>
      <Link href="/" aria-label={t("home")}>
        <Home className="size-4" />
      </Link>
    </Button>

    {/* Right: Help toggle */}
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleHelp}
      aria-label={helpVisible ? t("hideHelp") : t("showHelp")}
      aria-pressed={helpVisible}
    >
      <HelpCircle className={cn("size-4", helpVisible && "text-primary")} />
    </Button>
  </div>
</header>
```

**Layout integration** (`app/[locale]/layout.tsx`):
Add `<AppHeader />` as the first child inside `<body>`, before `{children}`. Since AppHeader is a client component and layout is a server component, just import and render it — Next.js handles the boundary.

**Icons:** Use `Home` and `HelpCircle` from `lucide-react` (already a project dependency).

**Visual state:** When help is ON, the HelpCircle icon gets `text-primary` color. When OFF, it's default muted.

### Conventions
- `"use client"` directive
- `Link` from `@/i18n/navigation` (NOT from `next/link`)
- `useTranslations("common")` for aria labels
- `cn()` from `@/lib/utils` for conditional classes
- `data-slot="app-header"` on the header element
- Ghost button variant for minimal visual weight
- `lucide-react` for icons (already in project)

## TDD Sequence
1. Write tests: renders home link, renders help toggle, toggle calls toggleHelp, aria-labels present, help icon shows active state
2. Implement AppHeader component
3. Modify layout.tsx to include AppHeader
4. Run test suite

## Done Definition
All acceptance criteria checked. Tests green. Header appears on all pages.
