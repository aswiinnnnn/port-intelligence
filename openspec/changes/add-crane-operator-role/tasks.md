## 1. Role Definition & Authentication Setup

- [x] 1.1 Add `crane-operator` to `UserRole` union in `LoginPage.tsx`, `Header.tsx`, `Layout.tsx`, and `App.tsx`.
- [x] 1.2 Add `Mateo Silva` preset profile to `PRESET_USERS` in `LoginPage.tsx` and update `ROLES` list in `Header.tsx`.

## 2. Navigation & View Routing

- [x] 2.1 Update `Sidebar.tsx` to include Crane Operator navigation items (`crane-dashboard`, `crane-assignments`, `crane-roster`, `crane-sla-timeline`).
- [x] 2.2 Add `CraneOperator.tsx` page component with active crane operations, live AI agent execution feed, TEU move counters, and equipment roster.
- [x] 2.3 Connect `App.tsx` routing to render `CraneOperator.tsx` when authenticated as `crane-operator` and verify build with `npx vite build`.
