## Purpose

Ensures that approaching vessel cards smoothly slide into the upcoming vessel carousel upon arrival.

## ADDED Requirements

### Requirement: Vessel Arrival Card Animation
When an approaching vessel enters the port radius stop position, its card SHALL dynamically insert at position index 0 in the upcoming vessels carousel and trigger a smooth left-to-right slide-in animation.

#### Scenario: Vessel reaches port radius
- **WHEN** vessel arrives at the 2 NM port radius boundary
- **THEN** the vessel card slides into index 0 from left to right with a smooth spring transition.
