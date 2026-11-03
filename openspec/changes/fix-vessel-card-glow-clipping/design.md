## Context

See `proposal.md` for motivation. The wrapper `.msc-push-wrapper` currently uses `overflow: hidden` to clip child content during width expansion (`0` to `392px`). This prevents the 3-blink neon glow (`35px` radius box-shadow) from displaying unclipped.

## Goals / Non-Goals

**Goals:**
- Transition container overflow to `overflow: visible` after width expansion animation completes (`0.62s`).
- Ensure the neon ring glow pulses 3 times around the card frame without layout drift or horizontal scrollbar glitches.

**Non-Goals:**
- Changing the carousel scroll behavior or card layout dimensions.

## Decisions

- **Decision 1: CSS Animation Fill-mode & Keyframe Overflow Transition**: Update `.msc-push-wrapper` animation timeline so `overflow` becomes `visible` when expansion reaches 100% (after `0.62s`).
- **Decision 2: Card Container Overflow Adjustments**: Ensure `.msc-card-glow-blink` allows box-shadow projection beyond borders.

## Risks / Trade-offs

- [Risk: Transient horizontal overflow on scroll container] → Mitigated by keeping carousel parent `overflow-x: clip` or `overflow-x: auto` with bottom padding.
