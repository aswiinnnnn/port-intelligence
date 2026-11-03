## Why

When a new vessel card (such as `MSC BARCELONA`) arrives in the vessel carousel, its 3-blink neon glow animation is currently cut off at the container edges due to strict `overflow: hidden` styling on the wrapper and card elements. Allowing the glow animation to extend unclipped ensures the arrival effect renders fully and creates the intended high-impact visual feedback.

## What Changes

- Allow `.msc-push-wrapper` and `.msc-push-inner` container overflow to expand cleanly after the initial width expansion animation completes (`0.62s`).
- Remove clipping restrictions on the vessel card during the 3-blink glow animation phase.
- Ensure the neon glow shadow radius (`35px`) projects fully beyond the card boundaries without drifting layout alignment.

## Capabilities

### New Capabilities
- `vessel-carousel`: Enhanced vessel carousel arrival animation system with unclipped glow ring feedback.

### Modified Capabilities

## Impact

- `src/index.css`: Animation keyframes and container overflow rules for `.msc-push-wrapper`, `.msc-push-inner`, and `.msc-card-glow-blink`.
- `src/components/dashboard/VesselCarousel.tsx`: Dynamic animation classes for new vessel arrival cards.
