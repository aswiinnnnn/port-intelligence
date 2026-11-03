## Context

See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Ensure MSC BARCELONA card slides into position 0 of the carousel upon reaching port radius.
- Automatically reset carousel horizontal scroll position.

## Decisions

1. Clean list reconstruction without array reference mutations.
2. React key forced element re-mount for animation re-triggering.
3. Direct scrollLeft: 0 smooth scroll call on vessel carousel ref when isVesselInRadius turns true.

## Risks / Trade-offs

- [Risk] Layout shifts during scroll ? Mitigation: Use CSS overflow containment and smooth scrolling.
