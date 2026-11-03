## Context

Port of Barcelona features role-tailored dashboards for Port Service Providers, Ship Agents, Tug Operators, and Harbour Pilots. Adding a Crane Operator role completes the terminal operational ecosystem by giving crane specialists real-time visibility into AI-allocated vessel discharge/loading schedules and equipment SLA metrics.

## Goals / Non-Goals

**Goals:**
- Add `crane-operator` to the role type definition and preset user list.
- Build `CraneOperator.tsx` with live container move tracking, SLA timelines, equipment status, and dispatch logs.
- Integrate seamless role switching and sidebar navigation for Crane Operators.

**Non-Goals:**
- Modifying backend server logic (all role views run on client-side state and mock data generators).

## Decisions

- **Decision:** Model `CraneOperator.tsx` after `TugOperator.tsx` and `HarbourPilot.tsx` using consistent card design, Lucide icons, status badges, and tabbed sub-views.
  - **Rationale:** Ensures UI/UX design consistency across all 5 operational roles.

## Risks / Trade-offs

- [Risk] Missing role handling in header/sidebar dropdowns → Mitigation: Audit all role union references in `Header.tsx`, `Sidebar.tsx`, `Layout.tsx`, `LoginPage.tsx`, and `App.tsx`.
