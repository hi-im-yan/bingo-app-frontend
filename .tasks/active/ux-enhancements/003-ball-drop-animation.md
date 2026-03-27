# 003 — Ball Drop Animation
**Status:** ready
**Blocked by:** none
**Assignee:** Component Builder

## What
Add a CSS keyframe animation to `CurrentNumber` so that each newly drawn ball visually "drops in" from above when the number changes. Uses only CSS — no animation library or new dependency. Two keyframes are needed: `ball-drop` (ball enters from above with a bounce) and `ball-fade-out` (previous ball fades and shrinks before the new one appears). The React `key` trick forces the component to remount — and therefore restart the animation — on every number change.

## Acceptance Criteria
- [ ] `@keyframes ball-drop` is defined in `app/globals.css`: ball translates from `translateY(-100%)` to `translateY(0)` with a cubic-bezier or `steps` easing that produces a brief overshoot/bounce at the end. Duration ~600ms
- [ ] `@keyframes ball-fade-out` is defined in `app/globals.css`: ball fades from `opacity: 1` to `opacity: 0` with a slight scale-down (`scale(0.8)`). Duration ~400ms
- [ ] Both keyframes are registered as Tailwind utility classes via `@theme` or `@utility` in `globals.css` so they can be applied with class names (e.g. `animate-ball-drop`, `animate-ball-fade-out`)
- [ ] `CurrentNumber` component applies `animate-ball-drop` to the `BingoBall` wrapper when a number is present
- [ ] The animation restarts correctly each time a new number arrives — achieved by passing `key={number}` to the animated element or its wrapper
- [ ] No animation plays on the "waiting for draw" state (when `number` is `null`)
- [ ] Animation classes are scoped to the ball element only, not the entire `CurrentNumber` container
- [ ] The component continues to pass its existing tests (no snapshot breakage from key change)

## Implementation Notes
- Keyframe CSS location: add after the existing `@theme inline` block in `app/globals.css`, before the light/dark mode variable sections
- Tailwind 4 custom animation registration syntax (no `tailwind.config.ts`):
  ```css
  @theme inline {
    --animate-ball-drop: ball-drop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
    --animate-ball-fade-out: ball-fade-out 400ms ease-in both;
  }
  ```
  Then `animate-ball-drop` and `animate-ball-fade-out` become usable Tailwind classes.
- Bounce easing recommendation: `cubic-bezier(0.34, 1.56, 0.64, 1)` — this is the standard spring-style bounce used by shadcn/ui animations in the project.
- `ball-drop` keyframe should start from `translateY(-60px)` (or `-100%` if the parent has sufficient height) and `opacity: 0`, ending at `translateY(0)` and `opacity: 1`
- `ball-fade-out` is optional for this task if it adds complexity — the drop-in alone is the priority
- In `CurrentNumber`, the `key` must be placed on the element that receives the animation class. Example structure:
  ```tsx
  <div key={number} className="animate-ball-drop">
    <BingoBall number={number} drawn size="lg" />
  </div>
  ```
- `aria-live="polite"` on the outer container is already present — keep it. The `role="status"` attribute must also be preserved for accessibility
