## 1. Tug Operator Integration

- [x] 1.1 Add MSC BARCELONA as index 0 active towage request in `src/pages/TugOperator.tsx` with 120T bollard pull details, 4 tug assignments (Poseidon, Neptune, Triton, Meridian), and interactive "Accept Towage Mission" state. Verify by rendering Tug Operator page and clicking acceptance button.

## 2. Ship Agent Integration

- [x] 2.1 Add MSC BARCELONA as index 0 incoming vessel notification in `src/pages/ShipAgent.tsx` with IMO 9705217, 14,200 TEU, BEST-T1-B4 berth reservation, and interactive "Confirm Agent Clearance" state. Verify by rendering Ship Agent page and toggling clearance button.

## 3. Harbour Pilot Integration

- [x] 3.1 Add MSC BARCELONA as primary active pilotage order in `src/pages/HarbourPilot.tsx` assigned to Capt. Marina Solà with draft 14.2m, LOA 366m, and interactive "Acknowledge Pilotage Order" button. Verify by checking Harbour Pilot view and acknowledging order.

## 4. Verification

- [x] 4.1 Run `npx tsc --noEmit` to verify type safety across all persona views.
