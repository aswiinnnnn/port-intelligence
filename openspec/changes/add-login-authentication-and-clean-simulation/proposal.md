## Why

Currently, role switching occurs instantaneously via a dropdown menu in the header, which lacks realistic authentication. Additionally, dismissing the simulation control widget leaves behind a "Show Simulation" toggle, which breaks the realism required for demo recordings. Introducing a dedicated light-themed login page with authenticated user credentials, updating the top nav header to show active profile details with a Log Out dropdown, and completely removing simulation controls upon dismissal will provide a clean, production-ready demo experience.

## What Changes

- **Login Authentication Page**: Create a new light-themed login view (`LoginPage.tsx`) with preset quick-fill buttons for Port Service Provider, Ship Agent, Tug Operator, and Harbour Pilot roles.
- **Top Navigation User Dropdown**: Replace the instant role selector dropdown in `Header.tsx` with the logged-in user profile (avatar, name, role) and a dropdown menu containing user details and a "Log Out" button.
- **Clean Simulation Control**: Modify `VectorMapOverlay.tsx` so that closing the simulation control widget hides it completely without leaving a "Show Simulation" button.
- **Documentation**: Update `ROLE_PAGES_GUIDE.md` to document the login authentication system and profile credentials.

## Capabilities

### New Capabilities
- `user-authentication`: User login, session management, profile header display, and logout functionality.
- `simulation-control`: Clean simulation control behavior on vector map overlay.

### Modified Capabilities

## Impact

- `src/App.tsx`: Controls authentication state (`isAuthenticated`, `currentUser`) and page routing.
- `src/components/Header.tsx`: Replaces role switcher with logged-in user card and Log Out menu.
- `src/components/dashboard/VectorMapOverlay.tsx`: Updates simulation button rendering logic.
- `ROLE_PAGES_GUIDE.md`: Updated role access and login documentation.
