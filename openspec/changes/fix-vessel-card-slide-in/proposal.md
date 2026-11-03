## Why

The MSC BARCELONA vessel card is failing to slide into view from left to right when the ship reaches the 2 NM port radius stop point. Fixing this ensures the SaaS demo preview animation triggers seamlessly and predictably.

## What Changes

- Implement non-mutating visibleShips ordering logic in VesselCarousel.tsx.
- Wrap MSC BARCELONA card in a dedicated container or apply keyframe animation.
- Automatically reset scrollLeft: 0 on the carousel container when isVesselInRadius is true.

## Capabilities

### Modified Capabilities
- dashboard/vessel-carousel: Update vessel carousel animation and insertion behavior when a vessel arrives at the port radius.

## Impact

- src/components/dashboard/VesselCarousel.tsx
- src/components/dashboard/dashboardData.ts
