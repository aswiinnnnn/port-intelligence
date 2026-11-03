## Purpose

Provides light-themed login authentication, user profile top navigation header display, and session logout functionality across all role profiles.

## ADDED Requirements

### Requirement: Light-themed login screen with profile quick-fill credentials
The system SHALL display a light-themed login page before granting access to port operations, providing credentials and one-click quick-fill buttons for all 4 profiles (Port Service Provider, Ship Agent, Tug Operator, Harbour Pilot).

#### Scenario: User authenticates via profile quick-fill button
- **WHEN** user selects a profile quick-fill button on the login screen
- **THEN** credential fields populate and successful login directs the user to their designated role dashboard

### Requirement: Top navigation profile header with Log Out menu
The system SHALL display the authenticated user's profile name and role in the top header and provide a dropdown menu with a Log Out option.

#### Scenario: User clicks profile card in header and logs out
- **WHEN** authenticated user clicks their profile card in the top header
- **THEN** a dropdown menu opens with user details and clicking "Log Out" clears the session and returns to the login screen
