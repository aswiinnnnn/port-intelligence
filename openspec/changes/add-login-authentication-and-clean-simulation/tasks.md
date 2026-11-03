## 1. Login Authentication Component

- [x] 1.1 Create `src/pages/LoginPage.tsx` with light glassmorphism card design, email/password inputs, and preset quick-fill buttons for Port Service Provider, Ship Agent, Tug Operator, and Harbour Pilot profiles. Verify component compiles.

## 2. App Routing & Header Profile Integration

- [x] 2.1 Update `src/App.tsx` to include `isAuthenticated` and `currentUser` session state, rendering `LoginPage` when unauthenticated. Verify routing behavior.
- [x] 2.2 Update `src/components/Header.tsx` to render the logged-in user's profile card with a dropdown menu displaying user details and a "Log Out" button that triggers session termination. Verify user dropdown and logout interaction.

## 3. Clean Simulation Overlay Control

- [x] 3.1 Update `src/components/dashboard/VectorMapOverlay.tsx` to return `null` when `isSimButtonHidden` is true, completely hiding the simulation widget without displaying a "Show Simulation" button. Verify map overlay rendering.

## 4. Documentation & Verification

- [x] 4.1 Update `ROLE_PAGES_GUIDE.md` to document the login authentication system and profile credentials.
- [x] 4.2 Run `npx tsc --noEmit` to verify type safety across the entire application.
