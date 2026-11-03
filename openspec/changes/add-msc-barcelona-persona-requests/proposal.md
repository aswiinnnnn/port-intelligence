## Why

For realistic demo recordings, `MSC BARCELONA` needs to appear as the primary active incoming request/assignment across all 3 persona views (Tug Operator, Ship Agent, Harbour Pilot), creating a coherent end-to-end story of a live vessel arrival.

## What Changes

- **Tug Operator (`TugOperator.tsx`)**: Add `MSC BARCELONA` as the top pending towage assignment with an interactive "Accept Towage Mission" request banner and priority badge.
- **Ship Agent (`ShipAgent.tsx`)**: Add `MSC BARCELONA` as the top active port call notification and berth reservation request with a "Confirm Agent Clearance" action button.
- **Harbour Pilot (`HarbourPilot.tsx`)**: Add `MSC BARCELONA` as the top scheduled pilotage order assigned to Capt. Marina Solà with an "Acknowledge Pilotage Order" action card.

## Capabilities

### New Capabilities
- `persona-requests`: Integration of `MSC BARCELONA` active arrival requests across Tug Operator, Ship Agent, and Harbour Pilot portal views.

### Modified Capabilities

## Impact

- `src/pages/TugOperator.tsx`: Assignment state and towage request acceptance banner.
- `src/pages/ShipAgent.tsx`: Port call and berth reservation requests.
- `src/pages/HarbourPilot.tsx`: Pilotage assignments and order acknowledgment banner.
