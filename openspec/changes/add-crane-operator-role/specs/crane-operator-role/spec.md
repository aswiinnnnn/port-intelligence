## Purpose

Provides a dedicated authentication identity, role navigation, and operational dashboard for Quay Crane Operators in Port of Barcelona, aligned with real-time AI agent telemetry and container move data.

## ADDED Requirements

### Requirement: Crane Operator Authentication & Role Selector
The system SHALL provide a preset login identity for `Crane Operator` (`Mateo Silva`) in the login page and role dropdown menu.

#### Scenario: User selects Crane Operator login preset
- **WHEN** the user selects the Crane Operator preset identity on the Login Page and clicks Sign In
- **THEN** the system authenticates the user as `Mateo Silva` (`crane-operator`) and renders the dedicated Crane Operator dashboard.

### Requirement: Crane Operator Operations Dashboard
The Crane Operator interface SHALL display active Quay Crane assignments, live container discharge/loading move rates (moves/hr), vessel SLA timelines, equipment roster health, and terminal dispatch communications.

#### Scenario: Viewing active Quay Crane operations
- **WHEN** a Crane Operator views their dashboard
- **THEN** the system displays real-time container moves (e.g. 1,187 TEU inbound discharge rate of 36 moves/hr for `MSC BARCELONA` at berth `BEST-T1-B4`), Quay Crane roster status, and live AI agent execution feed.
