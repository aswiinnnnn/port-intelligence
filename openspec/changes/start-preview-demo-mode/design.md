## Context

The system renders a Leaflet interactive map on the Home Page (`UnifiedDashboard.tsx`). Navigation and modals are managed by state in `App.tsx` and `UnifiedDashboard.tsx`.

See `proposal.md` for background and user goals.

## Goals / Non-Goals

**Goals:**
- Provide a realistic, smooth SaaS demo preview sequence triggered by a "Start Preview" button on the Home Page.
- Hide the "Start Preview" button immediately after click so it does not clutter screen recordings.
- Animate hero vessel `MSC BARCELONA` along a realistic sea channel trajectory from open sea `[41.310, 2.235]` through fairway curve `[41.338, 2.215]` into radius boundary `[41.358, 2.192]`.
- Calculate dynamic heading angle ($\theta$) at each frame to rotate the ship icon SVG naturally along the movement tangent.
- Display pulsing alert badges on the marker once crossing the 2 NM port radius.
- Animate left vessel list card from left to right with glowing highlight border.
- Render a bottom-right floating glassmorphism notification card with active AI allocation text and "View Allocation" button.
- Open `ResourceAllocationModal` directly over the dark glassmorphism Live Map layout to prevent light background screen flashing.
- Embed a dynamic, multi-step AI Agent Reasoning Activity Log within `ResourceAllocationModal`.

**Non-Goals:**
- Backend API integration (purely frontend-state driven for maximum reliability and offline capability).

## Decisions

### 1. Quadratic Bezier Sea Curve & Dynamic Heading Angle Calculation
- **Decision**: Define control points $P_0 = [41.310, 2.235]$ (Open Sea), $P_1 = [41.338, 2.215]$ (Fairway Turn), and $P_2 = [41.358, 2.192]$ (Radius Entrance).
- **Formula**:
  - Position: $P(t) = (1-t)^2 P_0 + 2(1-t)t P_1 + t^2 P_2$
  - Tangent vector: $P'(t) = 2(1-t)(P_1 - P_0) + 2t(P_2 - P_1)$
  - Heading angle: $\theta = \text{atan2}(P'_y, P'_x) \times \frac{180}{\pi}$
- **Icon Rotation**: Apply `transform: rotate(${headingDeg}deg)` to the ship icon marker wrapper in Leaflet.

### 2. Seamless Modal Overlay (Eliminating Blank Screen Flash)
- **Decision**: Trigger `onSelectVesselForAllocation('MSC BARCELONA')` directly without forcing a page route change to light-themed `'vessels'`. The `ResourceAllocationModal` renders over the active dark dashboard view with `backdrop-filter: blur(12px)`, providing a smooth, high-end SaaS presentation.

### 3. AI Agent Activity Console
- **Decision**: Sequentially animate 5 agent step items inside `ResourceAllocationModal` with typing/fade effects and checkmark state transitions every 450ms.

## Risks / Trade-offs

- **[Risk]** Marker rotation jumping during initial frame.
  - **Mitigation**: Pre-calculate initial tangent angle $P'(0)$ so initial render matches starting orientation.
