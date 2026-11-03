## Context

The three persona views (`TugOperator.tsx`, `ShipAgent.tsx`, `HarbourPilot.tsx`) render incoming vessel requests and assignments. To make live demo recordings realistic, MSC BARCELONA must be placed at the top of their respective queue/notification lists with interactive confirmation UI state.

## Goals / Non-Goals

**Goals:**
- Insert MSC BARCELONA as index 0 in Tug Operator towage queue, Ship Agent clearance notifications, and Harbour Pilot pilotage order list.
- Add interactive stateful action buttons ("Accept Towage Mission", "Confirm Agent Clearance", "Acknowledge Pilotage Order") that update status badges locally upon user interaction.
- Provide visually distinct alert styling (amber/blue highlighted card borders) so MSC BARCELONA stands out immediately during demo recordings.

**Non-Goals:**
- Real-time WebSocket or backend persistence of persona acceptance states (local component state is sufficient for frontend demo).

## Decisions

- **Decision 1: Local state wrapper for request acceptance status**
  - *Rationale*: Allows single-click visual state changes (e.g. from "Pending Acceptance" to "Accepted & Dispatched") during demo video walkthroughs without requiring backend endpoints.
  - *Alternative considered*: Static text without interactive buttons — rejected as less convincing for video demos.

- **Decision 2: Explicit vessel telemetry alignment**
  - *Rationale*: Ensure length (366m), draft (14.2m), TEU (14,200), and bollard pull requirements (120T) perfectly match MSC BARCELONA's specs in `UnifiedDashboard.tsx` and `dashboardData.ts`.

## Risks / Trade-offs

- [Risk] State resets on page refresh → *Mitigation*: Unnecessary for live continuous screen recordings, but clean state initialization ensures default rendering is always ready for demo.
