## Purpose

Provides persona-specific operational views (Tug Operator, Ship Agent, Harbour Pilot) with active vessel requests and interactive clearance/acknowledgment controls for MSC BARCELONA.

## ADDED Requirements

### Requirement: Tug Operator active mission notification for MSC BARCELONA
The system SHALL display MSC BARCELONA as the top active towage assignment in the Tug Operator portal with interactive mission acceptance capabilities.

#### Scenario: Display and accept Tug mission
- **WHEN** Tug Operator views towage assignments
- **THEN** MSC BARCELONA appears at index 0 with 120T bollard pull requirements and an interactive "Accept Towage Mission" button

### Requirement: Ship Agent port call clearance for MSC BARCELONA
The system SHALL display MSC BARCELONA as the priority incoming vessel notification in the Ship Agent portal with agent clearance confirmation.

#### Scenario: Display and confirm agent clearance
- **WHEN** Ship Agent accesses port call notifications
- **THEN** MSC BARCELONA appears at index 0 with terminal BEST-T1-B4 details and an interactive "Confirm Agent Clearance" button

### Requirement: Harbour Pilot pilotage order acknowledgment for MSC BARCELONA
The system SHALL present MSC BARCELONA as the primary active pilotage assignment in the Harbour Pilot portal assigned to Capt. Marina Solà.

#### Scenario: Display and acknowledge pilotage order
- **WHEN** Harbour Pilot views pilotage queue
- **THEN** MSC BARCELONA appears at index 0 with draft 14.2m specs and an interactive "Acknowledge Pilotage Order" button
