## Why

To support terminal crane specialists alongside Ship Agents, Tug Operators, and Harbour Pilots, Port of Barcelona requires a dedicated **Crane Operator** login and workflow page aligned with AI agent operational data (Quay Crane move rates, SLA timelines, equipment rosters, and stevedore dispatch logs).

## What Changes

- Add `crane-operator` to `UserRole` type and preset profiles (`Mateo Silva - Senior Crane Operator / Quay Crane Specialist` at BEST Container Terminal).
- Update `Header.tsx`, `Layout.tsx`, and `Sidebar.tsx` to support the Crane Operator role and dedicated navigation bar items.
- Create `src/pages/CraneOperator.tsx` featuring real-time container discharge/load move calculations, Quay Crane rosters, AI agent SLA timelines, and terminal dispatch communications.
- Update `App.tsx` routing to render `CraneOperator.tsx` when authenticated as a Crane Operator.

## Capabilities

### New Capabilities
- `crane-operator-role`: Dedicated authentication preset, navigation, and operational dashboard for Crane Operators integrated with AI agent working data.

## Impact

- `src/pages/LoginPage.tsx`: Updated `UserRole` and `PRESET_USERS`.
- `src/components/Header.tsx`, `src/components/Layout.tsx`, `src/components/Sidebar.tsx`: Role navigation and role selector dropdown updates.
- `src/pages/CraneOperator.tsx`: [NEW] Dedicated Crane Operator dashboard component.
- `src/App.tsx`: Updated application routing for `crane-operator` role.
