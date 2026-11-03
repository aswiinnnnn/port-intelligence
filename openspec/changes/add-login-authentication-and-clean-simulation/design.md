## Context

The application currently defaults to instant role selection in `Header.tsx` without an explicit login barrier. Replacing this with a dedicated light-themed `LoginPage.tsx` and adding session authentication state in `App.tsx` allows true user persona login/logout behavior. In `VectorMapOverlay.tsx`, closing the simulation widget will permanently hide it from view until page reload.

## Goals / Non-Goals

**Goals:**
- Implement `LoginPage.tsx` with light glassmorphic card design and 4 preset credential buttons.
- Manage `isAuthenticated` state and `currentUserProfile` object in `App.tsx`.
- Update `Header.tsx` to render the logged-in user profile with a dropdown menu featuring user details and a "Log Out" action.
- Update `VectorMapOverlay.tsx` to omit the "Show Simulation" button when `isSimButtonHidden` is true.
- Update `ROLE_PAGES_GUIDE.md` to document the login authentication system.

**Non-Goals:**
- Server-side JWT token persistence or database backend connection (React state persistence is optimal for frontend demos).

## Decisions

- **Decision 1: React State Authentication in `App.tsx`**
  - *Rationale*: Storing `isAuthenticated` and `currentUser` in top-level state provides instant page routing and clean session resets on Log Out.
  - *Alternative considered*: LocalStorage persistence — state-based auth is cleaner for demo video recordings as refreshing re-triggers the Login experience smoothly.

- **Decision 2: Omit "Show Simulation" fallback element in `VectorMapOverlay.tsx`**
  - *Rationale*: Returning `null` when `isSimButtonHidden` is true completely removes all simulation UI overlays for clean screen recordings.

## Risks / Trade-offs

- [Risk] Page refresh resets auth state back to Login page → *Mitigation*: Preset quick-fill buttons allow instant 1-click re-entry into any persona view.
