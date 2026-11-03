# Role-Based Pages Guide

## Overview
The application now supports 4 distinct user roles, each with tailored interfaces and features:

1. **Port Service Provider** (Default)
2. **Ship Agent**
3. **Tug Operator**
4. **Harbour Pilot**

Users can switch roles using the role dropdown in the header (top-right corner).

---

## Role 1: Port Service Provider (Default)

**Files:** `src/pages/UnifiedDashboard.tsx`, `src/pages/Communications.tsx`

### Features:
- **Live Port Map**: Real-time vessel tracking and port operations
- **Vessel Management**: View all active vessels with detailed information
- **Resource Allocation Modal**: Assign tugs, pilots, and berths to vessels
- **Communications Center**: Multilingual communication system with radio playback
- **Analytics**: Port performance metrics and turnaround times

### Pages:
- Dashboard (Operations overview)
- Live Map (Interactive port visualization)
- Vessels (Ship details & allocation)
- Communications (Multilingual messaging)

---

## Role 2: Ship Agent

**File:** `src/pages/ShipAgent.tsx`

### Key Responsibilities:
1. Submit port call notifications (ETA, vessel particulars, cargo manifest)
2. Arrange berth reservation and pilotage/tug requirements
3. File pre-arrival documentation (IMO FAL forms, declarations)
4. Manage vessel communications and mail
5. Confirm pilot and tug booking for departure

### Tab Sections:

#### 📋 Port Call Notifications
- Submit vessel arrival information
- Track notification status (Draft, Submitted, Acknowledged)
- View ETA and cargo details
- Create new notifications

#### 📄 Documentation
- Upload pre-arrival documents (IMO FAL Forms, Dangerous Goods Declaration, Health Declarations)
- Track document status (Pending, Submitted, Approved)
- View and edit uploaded files

#### ⚓ Berth Reservation & Pilotage
- View berth allocations for vessels
- Check pilot and tug assignments
- Confirm availability and status
- Manage pilotage requirements

#### 💬 Vessel Communications
- View recent vessel messages
- Send direct communications to vessels
- Track message delivery status
- Manage mail and logistics coordination

#### ⛵ Departure Confirmation
- Confirm pilot assignment with details
- Confirm tug assignment and capability
- Departure checklist (briefings, cargo, personnel)
- Final departure authorization

---

## Role 3: Tug Operator

**File:** `src/pages/TugOperator.tsx`

### Key Responsibilities:
- Receive and manage tug assignments
- Monitor fleet status and fuel levels
- Respond to port assignments
- Update operational status
- Communicate with port control

### Tab Sections:

#### 📊 Dashboard
- **Available Tugs**: Count of ready-to-deploy tugs
- **Active Assignments**: Current operation count
- **Response Time**: Average assignment response time
- **Next Assignment**: Quick action button for upcoming task

#### 📋 My Assignments
- Vessel name and berth details
- Operation type (Arrival/Departure)
- ETA and current status
- Real-time status updates (Assigned, En Route, On Station)

#### 🚢 Fleet Status
- Individual tug cards showing:
  - Bollard pull capacity
  - Current status (Available/En Route/Assisting/Maintenance)
  - Location and fuel level
  - Active assignments count
  - Quick action buttons

#### 💬 Communications
- Messages from port control
- Weather alerts and warnings
- Assignment confirmations
- Status update submission form

---

## Role 4: Harbour Pilot

**File:** `src/pages/HarbourPilot.tsx`

### Key Responsibilities:
- Receive vessel pilotage assignments
- Conduct pre-arrival briefings
- Manage safe navigation through port
- Confirm departure readiness
- Monitor port and weather conditions

### Tab Sections:

#### 📊 Dashboard
- **Today's Schedules**: Count of scheduled operations
- **On Vessel**: Active pilot assignments
- **Briefings**: Completed pre-arrival briefings
- **Upcoming Assignment**: Next pilot operation with quick action

#### 📅 My Schedule
- Full pilot schedule for the day
- Vessel details and operation type
- Berth assignments and ETAs
- Status tracking (Scheduled, Briefed, On Vessel, Complete)

#### 🚢 Vessel Data
- **Vessel Information Panel**:
  - Vessel name and type
  - Length Overall (LOA)
  - Draft (critical for pilotage)
  
- **Additional Data Panel**:
  - Gross Tonnage (GRT)
  - Cargo type and manifest
  - Special requirements (certifications needed)
  - Pilot change information

#### 🌊 Conditions
- **Weather Conditions**:
  - Wind speed and direction
  - Visibility forecast
  - Temperature
  
- **Port Conditions**:
  - Port operational status
  - Sea state and wave height
  - Tidal information and current direction

---

## Authentication & Profile Access

### Login Portal
The application features a light-themed **Login Screen** (`LoginPage.tsx`) with single sign-on authentication and quick-fill profile credentials for demo recordings.

### Default Profile Credentials:
1. **Port Service Provider / Admin**: `elena.vidal@portdebarcelona.cat`
2. **Ship Agent**: `t.riera@msc-agency.com`
3. **Tug Operator**: `laia.puig@boluda.com`
4. **Harbour Pilot**: `j.rodriguez@pilotstationbcn.es`
5. **Crane Operator**: `m.silva@best-terminal.com`

### Features:
- **Authenticated Header Display**: Shows active user's avatar, name, and role title in top header.
- **Log Out Dropdown**: Clicking the profile card opens a dropdown menu with user details and a "Log Out" button.
- **Session Management**: Logging out clears session state and redirects to the Login Page.

---

## UI/UX Consistency

All role pages maintain consistent design elements:

### Styling:
- **Tab Navigation**: Light background with active state highlight
- **Content Cards**: Semi-transparent white background with borders
- **Status Badges**: Color-coded by status (Green=Good/Approved, Yellow=Pending, Blue=Active, Red=Critical)
- **Icons**: From lucide-react for visual clarity
- **Typography**: Consistent font sizes and weights

### Color Scheme:
- Primary Blue: `#2563eb` - CTAs, highlights
- Success Green: `#10b981` - Available, Complete, Approved
- Warning Yellow: `#f59e0b` - Pending, Caution
- Info Blue: `#3b82f6` - Active operations
- Error Red: `#ef4444` - Maintenance, Critical

### Responsive Layout:
- Grid-based layouts (auto-fit, minmax)
- Independent scrolling sections
- Responsive spacing and padding
- Mobile-friendly component sizing

---

## Implementation Details

### Files Modified:
1. **src/App.tsx**: Added role state and conditional rendering
2. **src/components/Header.tsx**: Added role switcher dropdown
3. **src/components/Layout.tsx**: Updated props for role management

### Files Created:
1. **src/pages/ShipAgent.tsx**: Ship agent interface (425 lines)
2. **src/pages/TugOperator.tsx**: Tug operator interface (408 lines)
3. **src/pages/HarbourPilot.tsx**: Harbour pilot interface (445 lines)

### Type Definitions:
- `UserRole`: Union type for 4 roles
- `PortCallNotification`, `DocumentFile`, `BerthReservation`: Ship Agent data types
- `Assignment`, `TugStatus`: Tug Operator data types
- `PilotAssignment`, `VesselData`: Harbour Pilot data types

---

## Future Enhancements

1. **Backend Integration**: Connect role pages to real port authority APIs
2. **Data Persistence**: Store document uploads and notifications
3. **Real-time Updates**: WebSocket connections for live status updates
4. **Notifications**: Toast/alert system for new assignments and messages
5. **Export Functions**: PDF reports and manifest generation
6. **Mobile Optimization**: Responsive design improvements for tablets/phones
7. **Accessibility**: WCAG compliance and keyboard navigation
