## Context

In `src/pages/ResourceAllocation.tsx`, the JSX tree structure had an orphaned/mismatched `</div>` closing tag that left the backdrop overlay wrapper unclosed while prematurely nesting/positioning the modal footer outside the main card flex flow.

## Goals / Non-Goals

**Goals:**
- Fix the JSX closing tag order so the backdrop container wraps the modal card, and the modal card wraps header, grid body, and footer buttons cleanly.
- Ensure Vite build compiles cleanly with zero JSX syntax errors.

**Non-Goals:**
- Restructuring the component's internal state management or business logic.

## Decisions

- **Decision:** Remove orphaned closing `</div>` tags outside the return statement and add missing closing `</div>` tag for the backdrop overlay before `);`.
  - **Rationale:** Ensures clean hierarchy where backdrop flex overlay properly centers the modal card child and modal card flex column contains the footer as its last child.

## Risks / Trade-offs

- [Risk] Mismatched closing tags could cause DOM tree truncation → Mitigation: Verify JSX nesting via Vite build compiler checks.
