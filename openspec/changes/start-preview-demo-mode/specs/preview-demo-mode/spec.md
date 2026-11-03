## Purpose

Provides an interactive SaaS product preview mode for creating screen recordings and live video demos without UI clutter, featuring realistic sea channel vessel navigation and seamless modal overlay presentation.

## ADDED Requirements

### Requirement: Start Preview Button Controls and UI Hiding
The system SHALL provide a "Start Preview" button on the Home Page map toolbar. Upon clicking "Start Preview", the button SHALL immediately hide from the user interface so that it does not appear in video recordings.

#### Scenario: User activates preview mode
- **WHEN** the user clicks the "Start Preview" button on the Home Page
- **THEN** the "Start Preview" button is hidden from the UI and the preview sequence is initialized

### Requirement: Realistic Sea Channel Vessel Navigation
The system SHALL animate the hero vessel starting from open sea coordinates `[41.310, 2.235]` along a curved nautical fairway path into the 2 NM port radius, dynamically rotating the marker heading icon to match navigation trajectory.

#### Scenario: Vessel approaches along sea fairway
- **WHEN** the preview animation executes
- **THEN** the ship marker follows a smooth sea channel curve with dynamic heading angle rotation and realistic deceleration

### Requirement: Approaching Event and Floating Notification
The system SHALL trigger alert notifications when the vessel crosses the 2 NM radius, showing a map alert icon, a left-to-right sliding vessel card, and a bottom-right floating glassmorphism notification card with a "View Allocation" button.

#### Scenario: Vessel reaches 2 NM port radius
- **WHEN** the approaching vessel reaches the 2 NM port radius circle boundary
- **THEN** an alert badge icon appears over the vessel marker, a vessel card slides in from left to right on the left panel, and a floating notification card opens in the bottom-right corner

### Requirement: Seamless Allocation Modal Opening Without Screen Flashing
The system SHALL open the Resource Allocation Modal directly over the dark glassmorphism Live Map layout when "View Allocation" is clicked, preventing light-theme background flashes or blank screen transitions.

#### Scenario: User clicks View Allocation button
- **WHEN** the user clicks the "View Allocation" button on the bottom-right notification card
- **THEN** the Resource Allocation Modal opens smoothly on top of the dark Live Map view with a backdrop blur filter

### Requirement: Live AI Agent Activity Stream
The system SHALL display a real-time step-by-step AI agent reasoning activity stream inside the Resource Allocation Modal showing simulated decision-making for berth, pilot, tug, and crane allocation.

#### Scenario: Viewing AI agent reasoning
- **WHEN** the Resource Allocation Modal is opened during preview mode
- **THEN** the modal displays live animated steps showing agent search, depth checks, tug matching, and final allocation completion
