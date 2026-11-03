import React, { useState } from 'react';
import { 
  Layers, 
  Clock, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Cpu,
  Users,
  Shield,
  Hammer,
  Calendar,
  Wrench,
  BarChart2
} from 'lucide-react';
import { CraneSlaModal } from './ResourceAllocation';
import { t } from '../i18n';

interface CraneAssignmentItem {
  id: string;
  vesselName: string;
  craneName: string;
  craneCapacity: string;
  berth: string;
  operationType: 'Discharge (Arrival)' | 'Reloading (Departure)';
  status: 'In Operation' | 'Scheduled' | 'Completed';
  targetMoveRate: string;
  currentMoveRate: string;
  totalTeu: number;
  completedTeu: number;
  estimatedCompletion: string;
  stevedoreTeam: string;
  aiRationale: string;
  hoistTension: string;
  trolleySpeed: string;
  spreaderAngle: string;
}

const CRANE_ASSIGNMENTS: CraneAssignmentItem[] = [
  {
    id: 'ca-1',
    vesselName: 'MAERSK DHOFAR',
    craneName: 'Liebherr LHM 550 Mobile Harbor Crane',
    craneCapacity: '100t Heavy-Lift',
    berth: 'SCT-B04',
    operationType: 'Discharge (Arrival)',
    status: 'In Operation',
    targetMoveRate: '36 TEU/hr',
    currentMoveRate: '38 TEU/hr',
    totalTeu: 1187,
    completedTeu: 842,
    estimatedCompletion: 'Today, 18:45',
    stevedoreTeam: 'Squad Alfa (Supervisor M. Bosch)',
    aiRationale: 'High-speed gantry crane assigned by PCSAgent to maximize container clearance rate for priority arrival window.',
    hoistTension: '48.2 tonnes',
    trolleySpeed: '3.4 m/s',
    spreaderAngle: 'Starboard 4° Vector'
  },
  {
    id: 'ca-2',
    vesselName: 'ARABIAN SEA EXPRESS',
    craneName: 'ZPMC Super Post-Panamax Gantry #2',
    craneCapacity: '65t Twin-Lift',
    berth: 'SCT Berth 5',
    operationType: 'Reloading (Departure)',
    status: 'In Operation',
    targetMoveRate: '32 TEU/hr',
    currentMoveRate: '34 TEU/hr',
    totalTeu: 791,
    completedTeu: 310,
    estimatedCompletion: 'Today, 21:15',
    stevedoreTeam: 'Squad Bravo (Supervisor J. Soler)',
    aiRationale: 'Twin-lift spreader configured to accelerate outbound bay stowage and meet evening fairway departure slot.',
    hoistTension: '32.1 tonnes',
    trolleySpeed: '3.8 m/s',
    spreaderAngle: 'Port 2° Vector'
  },
  {
    id: 'ca-3',
    vesselName: 'ASYAD HORIZON',
    craneName: 'Gottwald HMK 8410 Harbor Crane',
    craneCapacity: '120t Heavy-Lift',
    berth: 'GCT-B30',
    operationType: 'Discharge (Arrival)',
    status: 'Scheduled',
    targetMoveRate: '30 TEU/hr',
    currentMoveRate: '0 TEU/hr',
    totalTeu: 450,
    completedTeu: 0,
    estimatedCompletion: 'Tomorrow, 08:30',
    stevedoreTeam: 'Squad Charlie (Supervisor A. Roca)',
    aiRationale: 'Heavy-lift crane reserved for dual passenger provision loading and specialized cargo container discharge.',
    hoistTension: '0.0 tonnes (Standby)',
    trolleySpeed: '0.0 m/s',
    spreaderAngle: 'Neutral 0° Vector'
  }
];

const CRANE_ROSTER_DATA = [
  { id: 'cr-1', name: 'Liebherr LHM 550', capacity: '100t Heavy-Lift', status: 'Active (Assigned)', vessel: 'MAERSK DHOFAR', health: '98%', operator: 'Salim Al Mashani', type: 'Mobile Harbor', motorTemp: '78°C', hydraulicPress: '4.2 bar', cableWear: 'Nominal (2%)', lastInspection: '2026-07-01', totalHours: '1,420h' },
  { id: 'cr-2', name: 'ZPMC Super Post-Panamax #2', capacity: '65t Twin-Lift', status: 'Active (Assigned)', vessel: 'ARABIAN SEA EXPRESS', health: '95%', operator: 'Hamed Al Busaidi', type: 'Quay Gantry', motorTemp: '81°C', hydraulicPress: '4.1 bar', cableWear: 'Nominal (4%)', lastInspection: '2026-06-28', totalHours: '2,890h' },
  { id: 'cr-3', name: 'Gottwald HMK 8410', capacity: '120t Heavy-Lift', status: 'Standby (Assigned)', vessel: 'ASYAD HORIZON', health: '99%', operator: 'Salim Al Mashani', type: 'Mobile Harbor', motorTemp: '72°C', hydraulicPress: '4.4 bar', cableWear: 'Optimal (1%)', lastInspection: '2026-07-03', totalHours: '980h' },
  { id: 'cr-4', name: 'Super Post-Panamax #4', capacity: '65t Twin-Lift', status: 'Standby', vessel: 'None (Vacant)', health: '100%', operator: 'Unassigned', type: 'Quay Gantry', motorTemp: '24°C', hydraulicPress: '4.0 bar', cableWear: 'New (0%)', lastInspection: '2026-07-05', totalHours: '450h' },
  { id: 'cr-5', name: 'Fantuzzi Reggiane MHC-200', capacity: '80t Standard', status: 'Maintenance', vessel: 'None', health: '74% (Service Req.)', operator: 'Engineering Tech', type: 'Mobile Harbor', motorTemp: '20°C', hydraulicPress: '0.8 bar', cableWear: 'Service Req. (18%)', lastInspection: '2026-07-07', totalHours: '4,120h' }
];

interface PastShiftMission {
  id: string;
  date: string;
  vessel: string;
  crane: string;
  operation: string;
  moves: string;
  status: string;
  stevedore: string;
}

interface IncidentLog {
  time: string;
  crane: string;
  event: string;
  severity: 'Info' | 'Warning' | 'Urgent';
}

interface SparePartItem {
  id: string;
  partName: string;
  craneCompatibility: string;
  stockLevel: number;
  unitCost: string;
  status: 'In Stock' | 'Low Stock' | 'Reordered';
}

const SPARE_PARTS_INVENTORY: SparePartItem[] = [
  { id: 'sp-1', partName: 'Liebherr Hoist Wire Rope (32mm Steel Core)', craneCompatibility: 'Liebherr LHM 550', stockLevel: 4, unitCost: 'OMR 1,760', status: 'In Stock' },
  { id: 'sp-2', partName: 'ZPMC Spreader Twistlock Sensor Pack', craneCompatibility: 'ZPMC Super Post-Panamax #2', stockLevel: 12, unitCost: 'OMR 360', status: 'In Stock' },
  { id: 'sp-3', partName: 'Gottwald Main Hydraulic Pump Seal Kit', craneCompatibility: 'Gottwald HMK 8410', stockLevel: 2, unitCost: 'OMR 610', status: 'Low Stock' },
  { id: 'sp-4', partName: 'Fantuzzi Cylinder 3 Heavy Rebuild Kit', craneCompatibility: 'Fantuzzi MHC-200', stockLevel: 1, unitCost: 'OMR 2,860', status: 'Reordered' }
];

interface CraneOperatorProps {
  viewSubMode?: string;
  onPageChange?: (pageId: any) => void;
  isMscBarcelonaAccepted?: boolean;
  onAcceptMscBarcelona?: () => void;
}

export const CraneOperator: React.FC<CraneOperatorProps> = ({
  viewSubMode = 'crane-dashboard',
  isMscBarcelonaAccepted = false,
  onAcceptMscBarcelona
}) => {
  const [slaModalData, setSlaModalData] = useState<{ craneName: string; craneCapacity: string; operationType: 'Arrival' | 'Departure'; vesselName: string } | null>(null);

  const activeTab = viewSubMode ? viewSubMode.replace('crane-', '') : 'dashboard';

  const [selectedVessel, setSelectedVessel] = useState<string>('MAERSK DHOFAR');
  const [selectedCraneId, setSelectedCraneId] = useState<string>('cr-1');
  const [_toastMsg, setToastMsg] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'pending' | 'accepted' | 'declined'>(
    isMscBarcelonaAccepted ? 'accepted' : 'pending'
  );

  React.useEffect(() => {
    if (isMscBarcelonaAccepted) {
      setDispatchStatus('accepted');
    }
  }, [isMscBarcelonaAccepted]);

  const [pastShifts] = useState<PastShiftMission[]>([
    { id: 'ps-1', date: '2026-07-08', vessel: 'DHOFAR SPIRIT', crane: 'Liebherr LHM 550', operation: 'Discharge', moves: '940 TEU (38 TEU/h)', status: 'Success', stevedore: 'Squad Alfa' },
    { id: 'ps-2', date: '2026-07-08', vessel: 'ASYAD HORIZON', crane: 'Gottwald HMK 8410', operation: 'Provision Loading', moves: '120 Units (24 U/h)', status: 'Success', stevedore: 'Squad Charlie' },
    { id: 'ps-3', date: '2026-07-07', vessel: 'RAYSUT TRADER', crane: 'Super Post-Panamax #4', operation: 'Reloading', moves: '450 TEU (35 TEU/h)', status: 'Success', stevedore: 'Squad Bravo' }
  ]);

  const [incidentLogs] = useState<IncidentLog[]>([
    { time: '16:42', crane: 'Liebherr LHM 550', event: 'Bay 14 discharge complete. Shifting to Cell Guide 08.', severity: 'Info' },
    { time: '16:15', crane: 'ZPMC #2', event: 'Outbound reloading slot reserved for ARABIAN SEA EXPRESS.', severity: 'Info' },
    { time: '15:30', crane: 'Gottwald HMK', event: 'Twistlock sensor recalibration verified.', severity: 'Warning' },
    { time: '14:10', crane: 'Quay Gate 4', event: 'Wind speed 12 knots (Nominal safe lifting limits).', severity: 'Info' }
  ]);

  const [vesselChecklists, setVesselChecklists] = useState<{ [vesselName: string]: { [key: string]: boolean } }>({
    'MAERSK DHOFAR': {
      'Hoist Winch Tension Test Passed': true,
      'Spreader Twistlock Sensor Locked': true,
      'Anti-Sway System Calibrated': true,
      'Operator Cab Controls Verified': true,
      'Stevedore Radio VHF CH 14 Clear': true
    },
    'ARABIAN SEA EXPRESS': {
      'Hoist Winch Tension Test Passed': true,
      'Spreader Twistlock Sensor Locked': true,
      'Anti-Sway System Calibrated': true,
      'Operator Cab Controls Verified': false,
      'Stevedore Radio VHF CH 14 Clear': true
    },
    'ASYAD HORIZON': {
      'Hoist Winch Tension Test Passed': false,
      'Spreader Twistlock Sensor Locked': false,
      'Anti-Sway System Calibrated': false,
      'Operator Cab Controls Verified': false,
      'Stevedore Radio VHF CH 14 Clear': true
    }
  });

  const [delayReason, setDelayReason] = useState<string>('');
  const [delayDuration, setDelayDuration] = useState<string>('15 mins');

  const getStatusColor = (status: string) => {
    if (status === 'In Operation' || status === 'Active (Assigned)' || status === 'Success' || status === 'In Stock') return '#10b981';
    if (status === 'Scheduled' || status === 'Standby (Assigned)' || status === 'Standby' || status === 'Low Stock') return '#f59e0b';
    if (status === 'Completed') return '#3b82f6';
    return '#ef4444';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'In Operation' || status === 'Active (Assigned)' || status === 'Success' || status === 'In Stock') return <CheckCircle size={13} />;
    if (status === 'Scheduled' || status === 'Standby (Assigned)' || status === 'Standby' || status === 'Low Stock') return <Clock size={13} />;
    return <AlertCircle size={13} />;
  };

  const toggleChecklistItem = (item: string) => {
    setVesselChecklists(prev => {
      const current = prev[selectedVessel] || {};
      return {
        ...prev,
        [selectedVessel]: {
          ...current,
          [item]: !current[item]
        }
      };
    });
  };

  const activeAssignment = CRANE_ASSIGNMENTS.find(a => a.vesselName === selectedVessel) || CRANE_ASSIGNMENTS[0];
  const selectedCraneDetail = CRANE_ROSTER_DATA.find(c => c.id === selectedCraneId) || CRANE_ROSTER_DATA[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', width: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', width: '100%' }}>
            {/* Stat Cards */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>{t("Active Quay Cranes")}</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{t("2 Active")}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                {t("Liebherr LHM 550 & ZPMC Super Post-Panamax #2 operating at peak capacity.")}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>{t("Avg Clearance Pace")}</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb' }}>{t("36.0 TEU/h")}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                {t("Exceeding target SLA move pace (34 TEU/h) for priority arrival window.")}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>{t("AI Agent Status")}</h4>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#2563eb" /> {t(" Synchronized")}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                {t("PCSAgent, NavAgent & DataAgent telemetry synchronized live.")}</div>
            </div>

            {/* Next Shift Dispatch Authorization */}
            {dispatchStatus === 'pending' ? (
              <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{t("Pending Crane Dispatch")}</span>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '6px', margin: 0 }}>{t("Vessel Container Clearance Assignment")}</h3>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{t("Assigned Crane: ")}<strong>{t("Liebherr LHM 550 (100t)")}</strong></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("TARGET VESSEL")}</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t("MAERSK DHOFAR")}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("OPERATION & CARGO")}</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t("1,187 TEU Discharge")}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("LOCATION / BERTH")}</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t("SCT-B04 (Quay 4)")}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setDispatchStatus('declined')} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'transparent', color: '#475569', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>{t("Decline")}</button>
                  <button onClick={() => { setDispatchStatus('accepted'); onAcceptMscBarcelona?.(); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>{t("Accept Crane Shift Mission")}</button>
                </div>
              </div>
            ) : (
              <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px' }}>
                {dispatchStatus === 'accepted' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} color="#10b981" />
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#047857', margin: 0 }}>
                          {t("Crane Shift Mission Accepted — Live Operational Timeline & Telemetry Active")}</h4>
                      </div>
                      <button
                        onClick={() => setSlaModalData({ craneName: 'Liebherr LHM 550 Mobile Harbor Crane', craneCapacity: '100t Heavy-Lift', operationType: 'Arrival', vesselName: 'MAERSK DHOFAR' })}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#ffffff',
                          backgroundColor: '#2563eb',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        <Clock size={12} color="#ffffff" />
                        <span>{t("Launch SLA Timeline")}</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("16:12 - BERTHING & SPREADER")}</div>
                        <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{t("✓ Completed")}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("17:30 - BAY 01-12 DISCHARGE")}</div>
                        <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{t("✓ Completed (320 TEU)")}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("IN PROGRESS - MAIN DISCHARGE")}</div>
                        <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{t("842 / 1,187 TEU (38 TEU/h)")}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px 10px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("18:45 - EST. COMPLETION")}</div>
                        <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>{t("On Schedule")}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>{t("Crane shift mission declined — terminal dispatcher notified for reassignment.")}</span>
                  </div>
                )}
              </div>
            )}

            {/* Stevedore Duty Roster */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {t(" Stevedore Squad Roster")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#000000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Squad Alfa (S. Al Mashani)")}</span>
                  <strong style={{ color: '#10b981' }}>{t("Active Quay 4")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Squad Bravo (H. Al Busaidi)")}</span>
                  <strong style={{ color: '#10b981' }}>{t("Active SCT Berth 5")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Squad Charlie (S. Al Mashani)")}</span>
                  <strong style={{ color: '#2563eb' }}>{t("Standby GCT Berth 30")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Tech Team (Engineering)")}</span>
                  <strong style={{ color: '#ef4444' }}>{t("Maintenance Dock")}</strong>
                </div>
              </div>
            </div>

            {/* Incident Logs Feed & Terminal Signals */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Incident Feed & System Signals")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {incidentLogs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '11.5px', color: '#000000' }}>
                    <div>
                      <strong style={{ color: log.severity === 'Urgent' ? '#ef4444' : log.severity === 'Warning' ? '#f59e0b' : '#2563eb' }}>[{t(log.severity)}]</strong>{t(' ')}
                      <strong>{t(log.crane)}:</strong> {t(log.event)}
                    </div>
                    <span style={{ color: '#000000' }}>{t(log.time)} {t(" UTC+4")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Regulations */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}><Shield size={14} /> {t(" Safety Regulations")}</h3>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
                {t("1. Max heavy-lift rating is 100t for Liebherr LHM 550.")}<br/>
                {t("2. Auto-shutdown activates at wind speeds above 25 knots.")}<br/>
                {t("3. Maintain 2.0m clearance above vessel hatch guides.")}<br/>
                {t("4. VHF dual watch required on Channels 14 & 16.")}</div>
            </div>

            {/* Maintenance Schedule */}
            <div style={{ gridColumn: '1 / -1', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Hammer size={14} /> {t(" Quay Crane Maintenance & Inspections")}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '11px' }}>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("Liebherr LHM 550 Wire Check")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: 2026-07-12")}</div>
                  <div style={{ color: '#10b981', fontWeight: 600, marginTop: '6px' }}>{t("✓ Scheduled")}</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("ZPMC #2 Spreader Calibration")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: In Progress")}</div>
                  <div style={{ color: '#f59e0b', fontWeight: 600, marginTop: '6px' }}>{t("⚠ Urgent Service")}</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("Gottwald HMK Hydraulic Service")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: 2026-07-18")}</div>
                  <div style={{ color: '#2563eb', fontWeight: 600, marginTop: '6px' }}>{t("Planned")}</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("Fantuzzi MHC Motor Overhaul")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: 2026-07-22")}</div>
                  <div style={{ color: '#ef4444', fontWeight: 600, marginTop: '6px' }}>{t("Critical Service")}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '16px', width: '100%' }}>
            {/* Left Column: Active Assignments & Past Shifts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Active Crane Assignments")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {CRANE_ASSIGNMENTS.map(asn => (
                  <div 
                    key={asn.id} 
                    onClick={() => setSelectedVessel(asn.vesselName)}
                    style={{ 
                      backgroundColor: selectedVessel === asn.vesselName ? 'rgba(37,99,235,0.05)' : 'rgba(255,255,255,0.5)', 
                      border: selectedVessel === asn.vesselName ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.06)', 
                      borderRadius: '12px', 
                      padding: '16px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t(asn.vesselName)}</h4>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Op: ")}<strong>{t(asn.operationType)}</strong> {t(" at ")}{t(asn.berth)}</div>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: getStatusColor(asn.status), backgroundColor: `${getStatusColor(asn.status)}15`, border: `1px solid ${getStatusColor(asn.status)}25`, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {getStatusIcon(asn.status)}
                        {t(asn.status)}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '11px', color: '#475569' }}>
                      <div>
                        <div>{t("Pace")}</div>
                        <div style={{ fontWeight: 600, color: '#10b981', marginTop: '2px' }}>{t(asn.currentMoveRate)}</div>
                      </div>
                      <div>
                        <div>{t("Crane")}</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t(asn.craneName.split(' ')[0])}</div>
                      </div>
                      <div>
                        <div>{t("Target TEU")}</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{asn.completedTeu}/{asn.totalTeu}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Past Completed Shifts */}
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '16px 0 4px 0' }}><Calendar size={14} /> {t(" Completed Crane Shifts (Past 24h)")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pastShifts.map(ps => (
                  <div key={ps.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '8px', fontSize: '11px', color: '#000000' }}>
                    <div>
                      <strong>{t(ps.vessel)}</strong> ({t(ps.operation)})
                      <div style={{ color: '#000000', fontSize: '9px', marginTop: '2px' }}>{t("Crane: ")}{t(ps.crane)} • {t(ps.stevedore)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{t("✓ Success")}</span>
                      <div style={{ color: '#000000', fontSize: '9px', marginTop: '2px' }}>{t(ps.moves)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column: Interactive Pre-Operational Checklist & Downtime Logger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Crane Pre-Operational Protocol")}</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Active Vessel: ")}<strong>{t(selectedVessel)}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.keys(vesselChecklists[selectedVessel] || vesselChecklists['MAERSK DHOFAR']).map(item => {
                    const checked = (vesselChecklists[selectedVessel] || vesselChecklists['MAERSK DHOFAR'])[item];
                    return (
                      <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#1e293b', cursor: 'pointer', padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <input 
                          type="checkbox" 
                          checked={checked} 
                          onChange={() => toggleChecklistItem(item)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ textDecoration: checked ? 'line-through' : 'none', color: checked ? '#64748b' : '#1e293b' }}>
                          {t(item)}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <button 
                  onClick={() => {
                    setToastMsg(`Pre-op protocol for ${selectedVessel} updated.`);
                    setTimeout(() => setToastMsg(null), 4000);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                >
                  {t("Send Protocol Update")}</button>
              </div>

              {/* Downtime Logger */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Report Shift Downtime / Delay")}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <select 
                    value={delayDuration} 
                    onChange={(e) => setDelayDuration(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px' }}
                  >
                    <option>{t("10 mins")}</option>
                    <option>{t("15 mins")}</option>
                    <option>{t("30 mins")}</option>
                    <option>{t("45 mins+")}</option>
                  </select>
                  <textarea 
                    placeholder={t("Describe downtime reason (e.g. twistlock jam, wind surge)...")}
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', minHeight: '60px', fontFamily: 'inherit' }}
                  />
                  <button 
                    onClick={() => {
                      setToastMsg(`Downtime of ${delayDuration} logged for ${selectedVessel}`);
                      setDelayReason('');
                      setTimeout(() => setToastMsg(null), 4000);
                    }}
                    style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                  >
                    {t("Log Downtime")}</button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Telemetry & Crane Signal Codes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} color="#2563eb" /> {t(" Live Crane Operational Telemetry")}</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Assigned Unit: ")}<strong>{t(activeAssignment.craneName)}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>{t("HOIST LINE TENSION")}</span>
                      <span style={{ color: '#10b981' }}>{t("NOMINAL")}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{t(activeAssignment.hoistTension)}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: '78%', height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>{t("TROLLEY TRAVERSE SPEED")}</span>
                      <span style={{ color: '#10b981' }}>{t("NOMINAL")}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{t(activeAssignment.trolleySpeed)}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: '68%', height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>{t("SPREADER SWAY VECTOR")}</span>
                      <span style={{ color: '#2563eb' }}>{t("AUTO-STABILIZED")}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{t(activeAssignment.spreaderAngle)}</div>
                  </div>
                </div>
              </div>

              {/* Signal Codes Reference */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("VHF Crane Hand Signals")}</h3>
                <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>{t("Code 1:")}</strong> {t(" Commencing cell guide discharge")}</div>
                  <div><strong>{t("Code 2:")}</strong> {t(" Twistlock engaged & locked on bay")}</div>
                  <div><strong>{t("Code 3:")}</strong> {t(" Outbound lashing complete for clearance")}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roster Tab */}
        {(activeTab === 'roster' || activeTab === 'crane-roster') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Top Stat Summary Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Total Crane Fleet")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{t("5 Units")}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("3 Quay Gantries, 2 Mobile Harbors")}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Fleet Availability")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{t("80% Active")}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("4 Operational / 1 Scheduled Service")}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Avg Equipment Health")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>93.2%</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Hydraulics & Hoist Cables Nominal")}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Shift Hoist Hours")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{t("38.5 Hours")}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Current Shift Operating Load")}</div>
              </div>
            </div>

            {/* Main Content Grid: Equipment Roster (Left) + Live Diagnostics & Inventory (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '16px', width: '100%' }}>
              
              {/* Left Column: Full Equipment Roster Cards & Spare Parts Inventory */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Roster Cards List */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={16} color="#2563eb" /> {t(" Quay Crane Equipment Roster")}</h3>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{t("Select crane for diagnostics")}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {CRANE_ROSTER_DATA.map(crane => (
                      <div 
                        key={crane.id}
                        onClick={() => setSelectedCraneId(crane.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          borderRadius: '10px',
                          border: selectedCraneId === crane.id ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.06)',
                          backgroundColor: selectedCraneId === crane.id ? 'rgba(37,99,235,0.04)' : 'rgba(255,255,255,0.6)',
                          cursor: 'pointer',
                          flexWrap: 'wrap',
                          gap: '12px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: selectedCraneId === crane.id ? '#2563eb' : 'rgba(37, 99, 235, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}>
                            <Layers size={20} color={selectedCraneId === crane.id ? '#ffffff' : '#2563eb'} />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                              {t(crane.name)} <span style={{ color: '#64748b', fontSize: '11.5px', fontWeight: 500 }}>({t(crane.capacity)})</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              {t("Type: ")}{t(crane.type)} {t(" · Operator: ")}<strong>{t(crane.operator)}</strong> {t(" · Vessel: ")}<strong>{t(crane.vessel)}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ fontSize: '11px', color: '#475569' }}>
                            <span style={{ color: '#64748b' }}>{t("Motor:")}</span> <strong>{t(crane.motorTemp)}</strong>
                          </div>
                          <div style={{ fontSize: '11px', color: '#475569' }}>
                            <span style={{ color: '#64748b' }}>{t("Hydraulics:")}</span> <strong>{t(crane.hydraulicPress)}</strong>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>{t("HEALTH")}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>{t(crane.health)}</div>
                          </div>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            color: getStatusColor(crane.status),
                            backgroundColor: `${getStatusColor(crane.status)}15`,
                            padding: '4px 10px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>
                            {t(crane.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal Spare Parts & Equipment Inventory */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wrench size={16} color="#2563eb" /> {t(" Terminal Heavy Spare Parts & Component Stock")}</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {SPARE_PARTS_INVENTORY.map(part => (
                      <div key={part.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', fontSize: '11.5px' }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>{t(part.partName)}</strong>
                          <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>{t("Compatibility: ")}{t(part.craneCompatibility)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{part.stockLevel} {t(" units")}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{t(part.unitCost)} {t(" / unit")}</div>
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: getStatusColor(part.status), backgroundColor: `${getStatusColor(part.status)}15`, padding: '3px 8px', borderRadius: '4px' }}>
                            {t(part.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Selected Crane Telemetry & Duty Roster */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Live Diagnostics Card for Selected Crane */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={15} color="#2563eb" /> {t(" Live Crane Telemetry & Health")}</h3>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#10b981', backgroundColor: '#10b98115', padding: '2px 6px', borderRadius: '4px' }}>
                      {t("LIVE SENSOR")}</span>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '14px', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{t(selectedCraneDetail.name)}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t(selectedCraneDetail.capacity)} · {t(selectedCraneDetail.type)}</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', fontSize: '11px' }}>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("OPERATOR")}</div>
                        <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(selectedCraneDetail.operator)}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("CABLE WEAR")}</div>
                        <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{t(selectedCraneDetail.cableWear)}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("TOTAL HOURS")}</div>
                        <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{t(selectedCraneDetail.totalHours)}</div>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '8px', borderRadius: '6px' }}>
                        <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("LAST INSPECTION")}</div>
                        <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>{t(selectedCraneDetail.lastInspection)}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                        <span>{t("HYDRAULIC PRESSURE")}</span>
                        <span style={{ color: '#10b981' }}>{t("NOMINAL")}</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '3px' }}>{t(selectedCraneDetail.hydraulicPress)}</div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                        <span>{t("MOTOR TEMP")}</span>
                        <span style={{ color: '#2563eb' }}>{t("STABLE")}</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '3px' }}>{t(selectedCraneDetail.motorTemp)}</div>
                    </div>
                  </div>
                </div>

                {/* Operator Duty Roster */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} color="#2563eb" /> {t(" Quay Crane Operators Roster")}</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{t("Salim Al Mashani")}</strong>
                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>{t("Senior Crane Specialist")}</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{t("On Duty (Shift A)")}</span>
                    </div>

                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{t("Hamed Al Busaidi")}</strong>
                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>{t("Quay Gantry Lead")}</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{t("On Duty (Shift A)")}</span>
                    </div>

                    <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{t("Engineering Tech")}</strong>
                        <div style={{ fontSize: '9.5px', color: '#64748b' }}>{t("Maintenance Specialist")}</div>
                      </div>
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>{t("Service Dock")}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* SLA Timeline Tab */}
        {(activeTab === 'sla-timeline' || activeTab === 'timeline' || activeTab === 'crane-sla-timeline') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Top Stat Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Overall SLA Compliance")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>98.4%</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("On-Time Clearance Rate")}</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Avg Clearance Speed")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>{t("36.0 TEU/h")}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Exceeding 34.0 TEU/h Target")}</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Turnaround Time Saved")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{t("+42 mins")}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Saved via PCSAgent Sync")}</div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{t("Active SLA Monitored")}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{t("3 Vessels")}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Maersk Dhofar, Arabian Sea Express, Asyad Horizon")}</div>
              </div>
            </div>

            {/* Main Content Grid: Move Timelines (Left 2 cols) + Launch SLA & Hourly Chart (Right col) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '16px', width: '100%' }}>
              
              {/* Left Column: Comprehensive Vessel Move Timelines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="#2563eb" /> {t(" Active Vessel Clearance SLA Schedules & Milestones")}</h3>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{t("Shift Timeline Feed")}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* MAERSK DHOFAR Timeline Row */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{t("MAERSK DHOFAR")}</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>{t("(Berth SCT-B04)")}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', backgroundColor: '#10b98115', padding: '3px 8px', borderRadius: '4px' }}>
                            {t("38.0 TEU/h (Exceeding SLA)")}</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("16:12 - BERTHING & SPREADER")}</div>
                          <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{t("✓ Completed")}</div>
                          <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>{t("Liebherr LHM 550 locked")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("17:30 - BAY 01-12 DISCHARGE")}</div>
                          <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{t("✓ Completed (320 TEU)")}</div>
                          <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>{t("Pace: 38 TEU/h")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("IN PROGRESS - MAIN DISCHARGE")}</div>
                          <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{t("842 / 1,187 TEU")}</div>
                          <div style={{ fontSize: '9.5px', color: '#2563eb', marginTop: '2px' }}>{t("71% Progress")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("18:45 - EST. COMPLETION")}</div>
                          <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>{t("On Schedule")}</div>
                          <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>{t("Unberthing reserved")}</div>
                        </div>
                      </div>
                    </div>

                    {/* ARABIAN SEA EXPRESS Timeline Row */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{t("ARABIAN SEA EXPRESS")}</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>{t("(SCT Berth 5)")}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', backgroundColor: '#10b98115', padding: '3px 8px', borderRadius: '4px' }}>
                          {t("34.0 TEU/h (On Track)")}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("15:00 - INBOUND DISCHARGE")}</div>
                          <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{t("✓ Completed")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("IN PROGRESS - RELOADING")}</div>
                          <div style={{ fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>{t("310 / 791 TEU")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("20:30 - HATCH LOCKOUT")}</div>
                          <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>{t("Scheduled")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("21:15 - EST. COMPLETION")}</div>
                          <div style={{ fontWeight: 700, color: '#334155', marginTop: '2px' }}>{t("On Schedule")}</div>
                        </div>
                      </div>
                    </div>

                    {/* ASYAD HORIZON Timeline Row */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{t("ASYAD HORIZON")}</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>{t("(GCT Berth 30)")}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', backgroundColor: '#f59e0b15', padding: '3px 8px', borderRadius: '4px' }}>
                          {t("Scheduled Tomorrow 08:30")}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("07:00 - PRE-CHECK & CRANE POSITION")}</div>
                          <div style={{ fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>{t("Scheduled")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("08:30 - PROVISION LOADING")}</div>
                          <div style={{ fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>{t("Scheduled")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("11:00 - CARGO CONTAINER CLEARANCE")}</div>
                          <div style={{ fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>{t("Scheduled")}</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("14:00 - COMPLETED")}</div>
                          <div style={{ fontWeight: 700, color: '#64748b', marginTop: '2px' }}>{t("Pending Arrival")}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* AI Rationale & Optimization Insights Log */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="#2563eb" /> {t(" AI Agent SLA Optimization Insights")}</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px', color: '#334155' }}>
                    <div style={{ backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px' }}>{t("PCSAgent Move Rate Optimization")}</div>
                      {t("Assigned dual-spreader configuration to Liebherr LHM 550 for MAERSK DHOFAR, boosting clearance speed to 38.0 TEU/h (+11.7% above baseline SLA target).")}</div>
                    <div style={{ backgroundColor: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px' }}>{t("NavAgent Departure Slot Sync")}</div>
                      {t("Synchronized ARABIAN SEA EXPRESS reloading completion at 21:15 to match high-tide exit window, saving 25 minutes of anchorage delay.")}</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Launch SLA Control Center & Hourly Throughput Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* SLA Launch Card */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={16} color="#2563eb" /> {t(" Interactive SLA Control")}</h3>

                  <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.5', marginBottom: '16px' }}>
                    {t("Launch the full interactive SLA Modal to simulate crane speed changes, inspect berth bottlenecks, or trigger stevedore dispatch updates.")}</p>

                  <button
                    onClick={() => setSlaModalData({ craneName: 'Liebherr LHM 550 Mobile Harbor Crane', craneCapacity: '100t Heavy-Lift', operationType: 'Arrival', vesselName: 'MAERSK DHOFAR' })}
                    style={{
                      width: '100%',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Clock size={16} color="#ffffff" />
                    <span>{t("Launch MAERSK DHOFAR SLA Modal")}</span>
                  </button>
                </div>

                {/* Hourly Throughput Bar Chart Breakdown */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart2 size={16} color="#2563eb" /> {t(" Hourly Move Pace (TEU/h)")}</h3>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#10b981' }}>{t("+8.2% vs Avg")}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>
                        <span>{t("14:00 - 15:00 UTC+4")}</span>
                        <strong style={{ color: '#2563eb' }}>{t("32 TEU/h")}</strong>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: '80%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>
                        <span>{t("15:00 - 16:00 UTC+4")}</span>
                        <strong style={{ color: '#2563eb' }}>{t("35 TEU/h")}</strong>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: '88%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>
                        <span>{t("16:00 - 17:00 UTC+4 (Current)")}</span>
                        <strong style={{ color: '#10b981' }}>{t("38 TEU/h (Peak)")}</strong>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: '95%', height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* SLA Modal Trigger */}
      {slaModalData && (
        <CraneSlaModal
          vesselName={slaModalData.vesselName}
          craneName={slaModalData.craneName}
          craneCapacity={slaModalData.craneCapacity}
          operationType={slaModalData.operationType}
          onClose={() => setSlaModalData(null)}
        />
      )}
    </div>
  );
};
