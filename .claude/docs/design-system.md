# Design System Reference

See `.interface-design/system.md` for the full design system documentation.

## Quick Reference

### Imports
```tsx
import { PageContainer } from "@/components/page-container";
import { PageHeader, PageTitle, PageDescription } from "@/components/page-header";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";
import { BingoBall } from "@/components/ui/bingo-ball";
```

### Page Template
```tsx
<PageContainer>
  <PageHeader>
    <PageTitle>Screen Title</PageTitle>
    <PageDescription>Supporting text</PageDescription>
  </PageHeader>
  <GameCard>
    <GameCardHeader>
      <GameCardTitle>Card Title</GameCardTitle>
    </GameCardHeader>
    <GameCardContent>
      {/* content */}
    </GameCardContent>
  </GameCard>
</PageContainer>
```

### BingoBall
```tsx
<BingoBall number={42} size="lg" drawn />
<BingoBall number={7} size="md" />
<BingoBall number={15} size="sm" drawn={false} />
```
