## Purpose

Manages equipment, berth, and labor allocation modal displays and action controls for terminal operations.

## ADDED Requirements

### Requirement: Modal Action Footer Layout
The resource allocation modal footer SHALL be rendered at the bottom of the modal card container as a persistent flex container containing Cancel, Reset, and Accept Allocation action buttons.

#### Scenario: Footer rendered inside modal card
- **WHEN** the resource allocation modal is opened
- **THEN** the action buttons ("Cancel", "Reset", "Accept Allocation") remain anchored at the bottom inside the modal card container below the main layout grid.
