## 1. CSS Animation Overflow Refactoring

- [x] 1.1 Update `.msc-push-wrapper` in `src/index.css` so `overflow: visible` is enabled after expansion finishes (using `@keyframes mscExpandWidth` or helper utility class). Verify that expanding the vessel container does not clip child elements.
- [x] 1.2 Update `.msc-card-glow-blink` and `.dashboard-vessel-card` styling in `src/index.css` and `src/components/dashboard/VesselCarousel.tsx` to allow unclipped box-shadow glow projection (35px radius) around the card border.

## 2. Verification

- [x] 2.1 Trigger the vessel arrival preview for MSC BARCELONA and verify visually in browser that the 3-blink neon glow renders 100% unclipped across top, bottom, left, and right card boundaries.
- [x] 2.2 Run `npx tsc --noEmit` to confirm clean compilation.

