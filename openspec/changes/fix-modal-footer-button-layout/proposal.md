## Why

In `ResourceAllocation.tsx`, the action buttons ("Cancel", "Reset", "Accept Allocation") in the Resource Allocation modal footer were incorrectly rendering floated to the right or visually separated from the bottom of the modal card because of unclosed JSX wrapper tags breaking the flex column layout container.

## What Changes

- Restore proper DOM nesting and closing tags in `ResourceAllocation.tsx` so the modal card contains header, grid, and footer sequentially.
- Ensure the footer action buttons stay aligned to the bottom inside the modal card container as shown in the UI spec/screenshots.

## Capabilities

### Modified Capabilities
- `resource-allocation`: Ensure modal footer action buttons are anchored at the bottom inside the resource allocation modal layout.

## Impact

- `ResourceAllocation.tsx`: Updated JSX structure to close backdrop overlay and modal card wrapper properly.
