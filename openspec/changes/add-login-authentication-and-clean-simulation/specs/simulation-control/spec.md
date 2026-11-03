## Purpose

Controls simulation widget dismissal behavior on the live vector map overlay to ensure a clean UI without lingering toggle buttons.

## ADDED Requirements

### Requirement: Complete hiding of simulation control upon dismissal
The system SHALL remove the simulation control widget entirely when dismissed by the user without displaying a "Show Simulation" button.

#### Scenario: User dismisses simulation control widget
- **WHEN** user clicks the close button on the floating simulation control
- **THEN** the simulation widget hides completely and no toggle button remains on screen
