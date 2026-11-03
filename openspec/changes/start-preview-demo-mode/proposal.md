## Why

To support creating impressive product walkthrough videos and live SaaS interactive demonstrations, the application needs a dedicated "Start Preview" mode on the Home page. This mode simulates a realistic vessel approach along a navigable sea channel, real-time map tracking with dynamic heading rotation, automated AI resource allocation alerts, smooth UI card animations, and a live agent reasoning stream inside the allocation view. When activated, the "Start Preview" button hides from the UI immediately to ensure clean recording outputs, and opening allocation view transitions seamlessly without flashing blank screens.

## What Changes

- **"Start Preview" UI Control**: Add a "Start Preview" button on the Home Page (`Live Port Map` header). When clicked, the button hides from the UI immediately to avoid interfering with screen recordings.
- **Realistic Nautical Movement & Heading**:
  - The hero vessel `MSC BARCELONA` starts in the open Mediterranean Sea (South/Southeast: `[41.310, 2.235]`) and moves smoothly along a curved nautical fairway into the 2 NM port radius (`[41.358, 2.192]`).
  - The ship marker dynamically rotates its heading angle along the path tangent and applies realistic deceleration.
- **Approaching Event & Notifications**:
  - When reaching the 2 NM radius circle:
    - An alert badge icon with bell overlay appears on the ship marker.
    - A new approaching vessel card slides in from left to right on the ship list panel.
    - A bottom-right floating glassmorphism notification card appears: *"MSC BARCELONA is approaching the port. Automatic allocation is being created using AI agents..."* with a **"View Allocation"** button.
- **Seamless Modal Presentation (No Blank Screen)**:
  - Clicking **"View Allocation"** opens the `ResourceAllocationModal` directly over the dark glassmorphism Live Map with a backdrop blur, avoiding any light-theme background flashes.
- **Live AI Agent Reasoning Stream**:
  - Inside `ResourceAllocationModal` (right panel), render a live step-by-step stream of AI agent activities (*"Searching specs..."*, *"Analyzing berth depth..."*, *"Checking tug & pilot availability..."*, *"Optimizing crane schedule..."*, *"Allocation complete!"*).

## Capabilities

### New Capabilities
- `preview-demo-mode`: Interactive SaaS demo workflow, hidden-on-trigger preview button, realistic sea channel trajectory, dynamic ship heading rotation, seamless modal trigger, and live AI agent activity stream.

### Modified Capabilities
*(None)*

## Impact

- **Frontend Components**:
  - `src/pages/UnifiedDashboard.tsx`: Add preview mode state, hidden-on-click preview button, Bezier sea curve calculation, heading rotation, slide-in ship card, and floating notification card.
  - `src/App.tsx`: Modal trigger over dark dashboard layout.
  - `src/pages/ResourceAllocation.tsx`: Live AI agent activity console.
- **CSS / Styling**:
  - `src/index.css`: Keyframe animations for card slide-in, alert pulsing, and smooth modal overlays.
