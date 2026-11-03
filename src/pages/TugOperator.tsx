import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Shield, Radio, Phone, Calendar, Hammer, Users, Activity, HardDrive, List } from 'lucide-react';
import { listVessels } from './UnifiedDashboard';
import { t } from '../i18n';

interface Assignment {
  id: string;
  vessel: string;
  berth: string;
  operation: 'Arrival' | 'Departure';
  eta: string;
  etd: string;
  status: 'Assigned' | 'En Route' | 'On Station' | 'Complete';
  pilotName: string;
  towlines: number;
  bollardPullReq: string;
  priority: 'High' | 'Routine' | 'Urgent';
}

interface TugStatus {
  id: string;
  name: string;
  bollardPull: string;
  currentStatus: 'Available' | 'En Route' | 'Assisting' | 'Maintenance';
  location: string;
  fuel: number;
  assignments: number;
  engineHealth: string;
  winchStatus: string;
  crewCount: number;
  lastInspection: string;
  bhp: string;
  propulsion: string;
  winchTension: string;
  oilPressure: string;
  temp: string;
  firefightingClass: string;
  generatorOutput: string;
  ropeLength: string;
}

interface PastMission {
  id: string;
  date: string;
  vessel: string;
  tug: string;
  operation: string;
  duration: string;
  status: string;
  pilot: string;
}

interface IncidentLog {
  time: string;
  tug: string;
  event: string;
  severity: 'Info' | 'Warning' | 'Urgent';
}

interface RadioArchive {
  timestamp: string;
  speaker: string;
  channel: string;
  message: string;
}

interface TugOperatorProps {
  activeTab: 'dashboard' | 'assignments' | 'fleet' | 'communications';
  isMscBarcelonaAccepted?: boolean;
  onAcceptMscBarcelona?: () => void;
  resetChecklistSignal?: number;
}

export const TugOperator: React.FC<TugOperatorProps> = ({
  activeTab,
  isMscBarcelonaAccepted = false,
  onAcceptMscBarcelona,
  resetChecklistSignal
}) => {
  const [tugFleet] = useState<TugStatus[]>([
    { id: 'tug-1', name: 'Poseidon', bollardPull: '65t', currentStatus: 'Assisting', location: 'South Terminal', fuel: 85, assignments: 2, engineHealth: 'Nominal', winchStatus: 'Ready', crewCount: 4, lastInspection: '2026-07-01', bhp: '4,800 BHP', propulsion: 'ASD (Azimuth Stern Drive)', winchTension: '120t Cap', oilPressure: '4.2 bar', temp: '82°C', firefightingClass: 'FiFi-1 (2,400 m3/h)', generatorOutput: '2x 120 ekW', ropeLength: '220m Steel Core' },
    { id: 'tug-2', name: 'Neptune', bollardPull: '60t', currentStatus: 'Available', location: 'Main Port', fuel: 92, assignments: 0, engineHealth: 'Nominal', winchStatus: 'Ready', crewCount: 4, lastInspection: '2026-06-28', bhp: '4,500 BHP', propulsion: 'ASD', winchTension: '110t Cap', oilPressure: '4.1 bar', temp: '79°C', firefightingClass: 'FiFi-1', generatorOutput: '2x 100 ekW', ropeLength: '200m Steel Core' },
    { id: 'tug-3', name: 'Triton', bollardPull: '55t', currentStatus: 'En Route', location: 'Breakwater', fuel: 78, assignments: 1, engineHealth: 'Nominal', winchStatus: 'Calibrating', crewCount: 3, lastInspection: '2026-07-03', bhp: '4,000 BHP', propulsion: 'Conventional Twin Screw', winchTension: '100t Cap', oilPressure: '3.9 bar', temp: '85°C', firefightingClass: 'None', generatorOutput: '2x 80 ekW', ropeLength: '180m Synthetic' },
    { id: 'tug-4', name: 'Meridian', bollardPull: '70t', currentStatus: 'Available', location: 'Berth T2', fuel: 88, assignments: 0, engineHealth: 'Optimal', winchStatus: 'Ready', crewCount: 5, lastInspection: '2026-07-05', bhp: '5,200 BHP', propulsion: 'Voith Schneider (VSP)', winchTension: '135t Cap', oilPressure: '4.4 bar', temp: '77°C', firefightingClass: 'FiFi-2 (3,600 m3/h)', generatorOutput: '2x 150 ekW', ropeLength: '250m Dyneema' },
    { id: 'tug-5', name: 'Aegis', bollardPull: '50t', currentStatus: 'Maintenance', location: 'Repair Dock', fuel: 0, assignments: 0, engineHealth: 'Repairing Cylinder 3', winchStatus: 'Undergoing Maintenance', crewCount: 0, lastInspection: '2026-07-07', bhp: '3,800 BHP', propulsion: 'ASD', winchTension: '90t Cap', oilPressure: '0.2 bar', temp: '22°C', firefightingClass: 'None', generatorOutput: '1x 90 ekW', ropeLength: '150m Nylon' },
    { id: 'tug-6', name: 'Orion', bollardPull: '62t', currentStatus: 'Available', location: 'Main Port', fuel: 95, assignments: 0, engineHealth: 'Nominal', winchStatus: 'Ready', crewCount: 4, lastInspection: '2026-06-25', bhp: '4,600 BHP', propulsion: 'ASD', winchTension: '115t Cap', oilPressure: '4.0 bar', temp: '81°C', firefightingClass: 'FiFi-1', generatorOutput: '2x 110 ekW', ropeLength: '210m Steel Core' }
  ]);

  const mscBarcelonaVessel = listVessels.find(v => v.name === 'MAERSK DHOFAR');

  const [assignments] = useState<Assignment[]>([
    { id: 'asn-msc', vessel: 'MAERSK DHOFAR', berth: 'SCT-B04', operation: 'Arrival', eta: mscBarcelonaVessel?.eta ?? '26-07-09 16:12', etd: mscBarcelonaVessel?.etd ?? '26-07-10 19:00', status: 'Assigned', pilotName: 'Capt. Huda Al Lawati', towlines: 4, bollardPullReq: '120t', priority: 'Urgent' },
    { id: 'asn-1', vessel: 'GULF ZENITH', berth: 'South T2', operation: 'Arrival', eta: '26-07-09 14:30', etd: '26-07-10 09:15', status: 'Assigned', pilotName: 'Capt. Davies', towlines: 2, bollardPullReq: '60t', priority: 'Urgent' },
    { id: 'asn-2', vessel: 'SADAH STAR', berth: 'RoRo Terminal', operation: 'Arrival', eta: '26-07-10 08:00', etd: '26-07-11 17:30', status: 'Assigned', pilotName: 'Capt. Henderson', towlines: 1, bollardPullReq: '45t', priority: 'Routine' },
    { id: 'asn-3', vessel: 'TAQAH EXPRESS', berth: 'Container T1', operation: 'Departure', eta: '26-07-09 18:00', etd: '26-07-09 21:45', status: 'En Route', pilotName: 'Capt. Al Saadi', towlines: 2, bollardPullReq: '65t', priority: 'High' }
  ]);

  const [pastMissions] = useState<PastMission[]>([
    { id: 'pm-1', date: '2026-07-08', vessel: 'DHOFAR SPIRIT', tug: 'Poseidon', operation: 'Berthing', duration: '1h 15m', status: 'Success', pilot: 'Capt. Henderson' },
    { id: 'pm-2', date: '2026-07-08', vessel: 'MAERSK DHOFAR', tug: 'Meridian', operation: 'Unberthing', duration: '45m', status: 'Success', pilot: 'Capt. Davies' },
    { id: 'pm-3', date: '2026-07-07', vessel: 'RAYSUT TRADER', tug: 'Orion', operation: 'Berthing', duration: '1h 30m', status: 'Success', pilot: 'Capt. Al Saadi' }
  ]);

  const [incidentLogs] = useState<IncidentLog[]>([
    { time: '16:45', tug: 'Triton', event: 'Winch tension calibration completed', severity: 'Info' },
    { time: '15:20', tug: 'Poseidon', event: 'Minor oil pressure fluctuate, normalized', severity: 'Warning' },
    { time: '11:10', tug: 'Aegis', event: 'Docked at repair Berth 4 for engine rebuild', severity: 'Urgent' },
    { time: '09:05', tug: 'Meridian', event: 'Crew shift change completed successfully', severity: 'Info' }
  ]);

  const [radioArchives] = useState<RadioArchive[]>([
    { timestamp: '14:20', speaker: 'Port Control', channel: 'VHF 12', message: 'Tug Triton, proceed to outer breakwater to stand by.' },
    { timestamp: '14:22', speaker: 'Triton Master', channel: 'VHF 12', message: 'Roger Port Control. Triton is underway, speed 10 knots.' },
    { timestamp: '14:25', speaker: 'Vessel Gulf Zenith', channel: 'VHF 12', message: 'Harbour Pilot on board. Requesting tug connection details.' },
    { timestamp: '14:28', speaker: 'Pilot Davies', channel: 'VHF 14', message: 'Tug Poseidon to secure line on starboard shoulder. Triton on stern.' },
    { timestamp: '14:31', speaker: 'Poseidon Master', channel: 'VHF 14', message: 'Poseidon in position. Preparing to heave line.' }
  ]);

  const [selectedVesselChecklist, setSelectedVesselChecklist] = useState<string>('MAERSK DHOFAR');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [vesselStates, setVesselStates] = useState<{ [vesselName: string]: any }>({
    'MAERSK DHOFAR': {
      checklist: {
        'Radio Contact Established': false,
        'Towlines Attached & Tensioned': false,
        'Vessel Speed Under 4 Knots': false,
        'Pilot Briefing Completed': false,
        'Tug Power Set to Assist': false,
      },
      telemetry: {
        winchTension: '58.4 tonnes',
        winchStatus: 'NOMINAL',
        winchPercent: '82%',
        engineRpm: '1,920 RPM (74%)',
        enginePercent: '74%',
        towlineAngle: 'Starboard 12° Vector',
        tugName: '4x Tugs (Poseidon, Neptune, Triton, Meridian)'
      }
    },
    'GULF ZENITH': {
      checklist: {
        'Radio Contact Established': true,
        'Towlines Attached & Tensioned': false,
        'Vessel Speed Under 4 Knots': true,
        'Pilot Briefing Completed': true,
        'Tug Power Set to Assist': false,
      },
      telemetry: {
        winchTension: '42.8 tonnes',
        winchStatus: 'WARNING HIGH',
        winchPercent: '78%',
        engineRpm: '1,850 RPM (68%)',
        enginePercent: '68%',
        towlineAngle: 'Port 18° Vector',
        tugName: 'Tug Poseidon'
      }
    },
    'SADAH STAR': {
      checklist: {
        'Radio Contact Established': true,
        'Towlines Attached & Tensioned': true,
        'Vessel Speed Under 4 Knots': true,
        'Pilot Briefing Completed': true,
        'Tug Power Set to Assist': true,
      },
      telemetry: {
        winchTension: '22.4 tonnes',
        winchStatus: 'NOMINAL',
        winchPercent: '40%',
        engineRpm: '1,450 RPM (52%)',
        enginePercent: '52%',
        towlineAngle: 'Starboard 8° Vector',
        tugName: 'Tug Neptune'
      }
    },
    'TAQAH EXPRESS': {
      checklist: {
        'Radio Contact Established': false,
        'Towlines Attached & Tensioned': false,
        'Vessel Speed Under 4 Knots': false,
        'Pilot Briefing Completed': false,
        'Tug Power Set to Assist': false,
      },
      telemetry: {
        winchTension: '0.0 tonnes',
        winchStatus: 'STANDBY',
        winchPercent: '0%',
        engineRpm: '850 RPM (15%)',
        enginePercent: '15%',
        towlineAngle: 'Neutral 0° Vector',
        tugName: 'Tug Triton'
      }
    }
  });

  const [selectedVhfChannel] = useState<string>('Channel 12 (Port Operations)');
  const [sentMessages, setSentMessages] = useState<{ sender: string; message: string; time: string }[]>([
    { sender: 'Poseidon', message: 'Tug line secured to Gulf Zenith aft.', time: '14:32 UTC+4' },
    { sender: 'Port Control', message: 'Proceed with inbound tow at 3.5 knots.', time: '14:34 UTC+4' }
  ]);
  const [newMessageText, setNewMessageText] = useState<string>('');

  const [delayReason, setDelayReason] = useState<string>('');
  const [delayDuration, setDelayDuration] = useState<string>('15 mins');

  const [assignmentList, setAssignmentList] = useState<Assignment[]>(assignments);
  const nextAssignment = assignmentList.find(a => a.status === 'Assigned') ?? null;
  const [dispatchStatus, setDispatchStatus] = useState<'pending' | 'accepted' | 'declined'>(
    isMscBarcelonaAccepted ? 'accepted' : 'pending'
  );

  React.useEffect(() => {
    if (isMscBarcelonaAccepted) {
      setDispatchStatus('accepted');
    }
  }, [isMscBarcelonaAccepted]);

  const prevResetChecklistSignalRef = React.useRef(resetChecklistSignal);

  React.useEffect(() => {
    if (resetChecklistSignal !== undefined && resetChecklistSignal !== prevResetChecklistSignalRef.current) {
      setSelectedVesselChecklist('MAERSK DHOFAR');
      setVesselStates(prev => {
        const vData = prev['MAERSK DHOFAR'] || { checklist: {}, telemetry: {} };
        const resetChecklist = Object.keys(vData.checklist).reduce((acc, item) => {
          acc[item] = false;
          return acc;
        }, {} as { [key: string]: boolean });
        return {
          ...prev,
          'MAERSK DHOFAR': {
            ...vData,
            checklist: resetChecklist
          }
        };
      });
    }
    prevResetChecklistSignalRef.current = resetChecklistSignal;
  }, [resetChecklistSignal]);

  const availableTugs = tugFleet.filter(t => t.currentStatus === 'Available');
  const fleetAvgFuel = Math.round(tugFleet.reduce((sum, t) => sum + t.fuel, 0) / tugFleet.length);

  const handleAcceptTowage = () => {
    setDispatchStatus('accepted');
    onAcceptMscBarcelona?.();
    if (nextAssignment) {
      setAssignmentList(prev => prev.map(a => a.id === nextAssignment.id ? { ...a, status: 'En Route' } : a));
    }
  };

  const handleDeclineTowage = () => {
    setDispatchStatus('declined');
  };

  const getStatusColor = (status: string) => {
    if (status === 'Available' || status === 'Complete') return '#10b981';
    if (status === 'En Route' || status === 'Assigned') return '#f59e0b';
    if (status === 'On Station' || status === 'Assisting') return '#3b82f6';
    return '#ef4444';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Complete') return <CheckCircle size={14} />;
    if (status === 'Available') return <CheckCircle size={14} />;
    if (status === 'En Route' || status === 'Assigned' || status === 'On Station') return <Clock size={14} />;
    return <AlertCircle size={14} />;
  };

  const toggleChecklistItem = (item: string) => {
    setVesselStates(prev => {
      const vData = prev[selectedVesselChecklist] || { checklist: {}, telemetry: {} };
      return {
        ...prev,
        [selectedVesselChecklist]: {
          ...vData,
          checklist: {
            ...vData.checklist,
            [item]: !vData.checklist[item]
          }
        }
      };
    });
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} UTC+4`;
    setSentMessages([...sentMessages, { sender: 'Poseidon', message: newMessageText, time: timeStr }]);
    setNewMessageText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', width: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', width: '100%' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>{t("Available Tugs")}</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{availableTugs.length}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                {t(availableTugs.map(t => t.name).join(', ') || 'None')} {t(" ready for deployment.")}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>{t("Active Assignments")}</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{assignmentList.length}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                {assignmentList.filter(a => a.operation === 'Arrival').length} {t(" arrivals (")}{t(assignmentList.filter(a => a.operation === 'Arrival').map(a => a.vessel).join(', ') || 'none')}), {assignmentList.filter(a => a.operation === 'Departure').length} {t(" departure(s) (")}{t(assignmentList.filter(a => a.operation === 'Departure').map(a => a.vessel).join(', ') || 'none')}{t(") active.")}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase' }}>{t("Fuel Reserves")}</h4>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>{fleetAvgFuel}{t("% Avg")}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
                {t("Fleet average across ")}{tugFleet.length} {t(" tugs. ")}{t(tugFleet.find(t => t.fuel === 0)?.name ?? 'None')} {t(" requires refueling.")}</div>
            </div>

            {/* Next Assignment Protocol */}
            {nextAssignment && dispatchStatus === 'pending' ? (
              <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{t("Pending Dispatch")}</span>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '6px', margin: 0 }}>{t("Vessel Towing Authorization")}</h3>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{t("Requested Tug: ")}<strong>{t(availableTugs[0]?.name ?? 'Unassigned')}</strong></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("TARGET SHIP")}</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(nextAssignment.vessel)}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("TUG PULL REQUIRED")}</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(nextAssignment.bollardPullReq)} {t(" minimum (")}{nextAssignment.towlines} {t(" Lines)")}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("LOCATION / BERTH")}</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t("Berth ")}{t(nextAssignment.berth)} ({t(nextAssignment.operation)})</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button onClick={handleDeclineTowage} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'transparent', color: '#475569', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>{t("Decline")}</button>
                  <button onClick={handleAcceptTowage} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>{t("Accept Towage Mission")}</button>
                </div>
              </div>
            ) : (
              <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {dispatchStatus === 'accepted' ? (
                  <>
                    <CheckCircle size={16} color="#10b981" />
                    <span style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>{t("Towage mission for ")}{t(nextAssignment?.vessel ?? 'the next vessel')} {t(" accepted — status updated to En Route.")}</span>
                  </>
                ) : dispatchStatus === 'declined' ? (
                  <>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>{t("Towage mission declined — dispatcher notified to reassign.")}</span>
                  </>
                ) : (
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{t("No pending dispatch requests.")}</span>
                )}
              </div>
            )}

            {/* Crew Duty Roster */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {t(" Crew Duty Roster")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#000000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Poseidon (A-Shift)")}</span>
                  <strong style={{ color: '#10b981' }}>{t("Active (12h remain)")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Neptune (B-Shift)")}</span>
                  <strong style={{ color: '#2563eb' }}>{t("Standby Station")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Triton (A-Shift)")}</span>
                  <strong style={{ color: '#10b981' }}>{t("Active (4h remain)")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <span>{t("Meridian (C-Shift)")}</span>
                  <strong style={{ color: '#475569' }}>{t("Rest Period")}</strong>
                </div>
              </div>
            </div>

            {/* Incident Logs Feed & Port Safety Protocols */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Incident Feed & System Signals")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {incidentLogs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '11.5px', color: '#000000' }}>
                    <div>
                      <strong style={{ color: log.severity === 'Urgent' ? '#ef4444' : log.severity === 'Warning' ? '#f59e0b' : '#2563eb' }}>[{t(log.severity)}]</strong>{t(' ')}
                      <strong>{t(log.tug)}:</strong> {t(log.event)}
                    </div>
                    <span style={{ color: '#000000' }}>{t(log.time)} {t(" UTC+4")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}><Shield size={14} /> {t(" Safety Regulations")}</h3>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
                {t("1. Speed limit in all berths is 4.0 knots max.")}<br/>
                {t("2. Standard safety distance from cruise liners is 50m.")}<br/>
                {t("3. Towline configuration requires double-bit connection.")}<br/>
                {t("4. VHF dual watch must be kept on Ch 12 & 16.")}</div>
            </div>

            {/* Maintenance Schedule */}
            <div style={{ gridColumn: '1 / -1', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Hammer size={14} /> {t(" Tug Fleet Maintenance & Inspections")}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '11px' }}>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("Poseidon Winch Check")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: 2026-07-12")}</div>
                  <div style={{ color: '#10b981', fontWeight: 600, marginTop: '6px' }}>{t("✓ Scheduled")}</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("Aegis Cylinder Head")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: In Progress")}</div>
                  <div style={{ color: '#ef4444', fontWeight: 600, marginTop: '6px' }}>{t("⚠ Critical Repair")}</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("Triton Propeller Shaft")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: 2026-07-18")}</div>
                  <div style={{ color: '#2563eb', fontWeight: 600, marginTop: '6px' }}>{t("Planned")}</div>
                </div>
                <div style={{ padding: '10px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{t("Neptune Load Testing")}</div>
                  <div style={{ color: '#64748b', marginTop: '2px' }}>{t("Due: 2026-07-22")}</div>
                  <div style={{ color: '#475569', fontWeight: 600, marginTop: '6px' }}>{t("Pending")}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '16px', width: '100%' }}>
            {/* Left Column: Active Assignments & Completed Log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Active Assignments")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assignmentList.map(asn => (
                  <div 
                    key={asn.id} 
                    onClick={() => setSelectedVesselChecklist(asn.vessel)}
                    style={{ 
                      backgroundColor: selectedVesselChecklist === asn.vessel ? 'rgba(37,99,235,0.05)' : 'rgba(255,255,255,0.5)', 
                      border: selectedVesselChecklist === asn.vessel ? '1.5px solid #2563eb' : '1px solid rgba(0,0,0,0.06)', 
                      borderRadius: '12px', 
                      padding: '16px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t(asn.vessel)}</h4>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Operation: ")}<strong>{t(asn.operation)}</strong> {t(" to ")}{t(asn.berth)}</div>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: getStatusColor(asn.status), backgroundColor: `${getStatusColor(asn.status)}15`, border: `1px solid ${getStatusColor(asn.status)}25`, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {getStatusIcon(asn.status)}
                        {t(asn.status)}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '11px', color: '#475569' }}>
                      <div>
                        <div>{t("ETA / ETD")}</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{t(asn.eta)}</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '1px' }}>{t(asn.etd)}</div>
                      </div>
                      <div>
                        <div>{t("Pilot")}</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{t(asn.pilotName)}</div>
                      </div>
                      <div>
                        <div>{t("Bollard Req")}</div>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{t(asn.bollardPullReq)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Past Completed Missions Log */}
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '16px 0 4px 0' }}><Calendar size={14} /> {t(" Completed Towage (Past 24h)")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pastMissions.map(pm => (
                  <div key={pm.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '8px', fontSize: '11px', color: '#000000' }}>
                    <div>
                      <strong>{t(pm.vessel)}</strong> ({t(pm.operation)})
                      <div style={{ color: '#000000', fontSize: '9px', marginTop: '2px' }}>{t("Tug: ")}{t(pm.tug)} {t(" • Pilot: ")}{t(pm.pilot)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{t("✓ Success")}</span>
                      <div style={{ color: '#000000', fontSize: '9px', marginTop: '2px' }}>{t(pm.duration)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column: Interactive Checklist & Delay Logger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Towage Protocol")}</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Active Vessel: ")}<strong>{t(selectedVesselChecklist)}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.keys((vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).checklist).map((item) => {
                    const checked = (vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).checklist[item];
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
                    setToastMsg(`Protocol for ${selectedVesselChecklist} updated.`);
                    setTimeout(() => setToastMsg(null), 4000);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                >
                  {t("Send Protocol Update")}</button>
              </div>

              {/* Delay Logger */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Report Transit Delay")}</h3>
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
                    placeholder={t("Describe delay reason (e.g. swell, traffic)...")}
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', minHeight: '60px', fontFamily: 'inherit' }}
                  />
                  <button 
                    onClick={() => {
                      setToastMsg(`Delay of ${delayDuration} logged for ${selectedVesselChecklist}`);
                      setDelayReason('');
                      setTimeout(() => setToastMsg(null), 4000);
                    }}
                    style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                  >
                    {t("Log Delay")}</button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Telemetry & Winch Load Monitor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} color="#2563eb" /> {t(" Live Towing Telemetry")}</h3>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Active Unit: ")}<strong>{(vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.tugName}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>{t("WINCH LINE TENSION")}</span>
                      <span style={{ color: (vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.winchStatus === 'WARNING HIGH' ? '#ef4444' : (vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.winchStatus === 'NOMINAL' ? '#10b981' : '#64748b' }}>
                        {(vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.winchStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{(vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.winchTension}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: (vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.winchPercent, height: '100%', backgroundColor: (vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.winchStatus === 'WARNING HIGH' ? '#ef4444' : '#10b981' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>{t("ENGINE LOAD (ASD 1 & 2)")}</span>
                      <span style={{ color: '#10b981' }}>{t("NOMINAL")}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{(vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.engineRpm}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                      <div style={{ width: (vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.enginePercent, height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      <span>{t("TOWAGE LINE ANGLE")}</span>
                      <span style={{ color: '#2563eb' }}>{t("ASD STEERING")}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{(vesselStates[selectedVesselChecklist] || vesselStates['GULF ZENITH']).telemetry.towlineAngle}</div>
                  </div>
                </div>
              </div>

              {/* Towing Operations Code Reference */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("VHF Towage Codes")}</h3>
                <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>{t("Code 1:")}</strong> {t(" Commencing towage connection")}</div>
                  <div><strong>{t("Code 2:")}</strong> {t(" Line secured and under light tension")}</div>
                  <div><strong>{t("Code 3:")}</strong> {t(" Full power assistance authorized")}</div>
                  <div><strong>{t("Code 4:")}</strong> {t(" Cast off towlines, standing by")}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fleet Registry Tab */}
        {activeTab === 'fleet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Tug Fleet Registry")}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px', width: '100%' }}>
              {tugFleet.map(tug => (
                <div key={tug.id} style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t(tug.name)}</h4>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{t("Bollard Pull: ")}<strong>{t(tug.bollardPull)}</strong></div>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: getStatusColor(tug.currentStatus), backgroundColor: `${getStatusColor(tug.currentStatus)}15`, border: `1px solid ${getStatusColor(tug.currentStatus)}25`, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {t(tug.currentStatus)}
                    </span>
                  </div>

                  {/* Machinery details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: '11px', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '10px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("LOCATION")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(tug.location)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("POWER CAPACITY")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(tug.bhp)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("PROPULSION")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(tug.propulsion)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("WINCH CAPACITY")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(tug.winchTension)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("ROPE SPECIFICATION")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(tug.ropeLength)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("FIREFIGHTING CLASS")}</div>
                      <div style={{ color: '#10b981', fontWeight: 600, marginTop: '2px' }}>{t(tug.firefightingClass)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("AUX GENERATORS")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(tug.generatorOutput)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 600 }}>{t("LAST INSPECTION")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(tug.lastInspection)}</div>
                    </div>
                  </div>

                  {tug.fuel > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px', color: '#64748b' }}>
                        <span>{t("Fuel Level")}</span>
                        <span style={{ fontWeight: 600, color: tug.fuel > 50 ? '#10b981' : tug.fuel > 25 ? '#f59e0b' : '#ef4444' }}>{tug.fuel}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${tug.fuel}%`, height: '100%', backgroundColor: tug.fuel > 50 ? '#10b981' : tug.fuel > 25 ? '#f59e0b' : '#ef4444', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tug Fleet Operational Capabilities & Equipment Table (Fills the bottom half of Fleet page!) */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', width: '100%', marginTop: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><HardDrive size={14} color="#2563eb" /> {t(" Tug Fleet Machinery Equipment Inventory")}</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left', color: '#000000' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#000000' }}>
                    <th style={{ padding: '8px 12px' }}>{t("Tug Name")}</th>
                    <th style={{ padding: '8px 12px' }}>{t("Winch Manufacturer")}</th>
                    <th style={{ padding: '8px 12px' }}>{t("Towline Break Load")}</th>
                    <th style={{ padding: '8px 12px' }}>{t("FiFi Monitor Flow")}</th>
                    <th style={{ padding: '8px 12px' }}>{t("Aux Generator Model")}</th>
                    <th style={{ padding: '8px 12px' }}>{t("Active Master")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{t("Poseidon")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Ibercisa Hydraulic Winch")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("150 tonnes")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("FiFi-1 (1,200 m3/h x2)")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Caterpillar C4.4")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Capt. Eric Vance")}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{t("Neptune")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Ibercisa Hydraulic Winch")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("140 tonnes")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("FiFi-1 (1,200 m3/h x2)")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Caterpillar C4.4")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Capt. Simon Crane")}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{t("Triton")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Markey Electric Winch")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("125 tonnes")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Not Equipped")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Cummins 6BTA")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Capt. Alistair Bell")}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{t("Meridian")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Ibercisa Heavy Escort")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("180 tonnes")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("FiFi-2 (1,800 m3/h x2)")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Caterpillar C6.6")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Capt. Thomas Wright")}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{t("Aegis")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Markey Electric Winch")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("110 tonnes")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Not Equipped")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Cummins 6BTA")}</td>
                    <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{t("Unassigned (In Repair)")}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>{t("Orion")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Ibercisa Hydraulic Winch")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("145 tonnes")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("FiFi-1 (1,200 m3/h x2)")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Caterpillar C4.4")}</td>
                    <td style={{ padding: '8px 12px' }}>{t("Capt. Nadia Ferro")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
            {/* VHF Channel Feed */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("Radio Transmissions Log")}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>
                  <Radio size={14} />
                  <span>{t(selectedVhfChannel)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                {sentMessages.map((msg, idx) => (
                  <div key={idx} style={{ padding: '10px', backgroundColor: msg.sender === 'Poseidon' ? 'rgba(37,99,235,0.06)' : 'rgba(0,0,0,0.03)', borderRadius: '8px', borderLeft: msg.sender === 'Poseidon' ? '4px solid #2563eb' : '4px solid #64748b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#64748b' }}>
                      <span style={{ fontWeight: 700, color: msg.sender === 'Poseidon' ? '#2563eb' : '#475569' }}>{t(msg.sender)}</span>
                      <span>{t(msg.time)}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#1e293b', marginTop: '4px', lineHeight: '1.4' }}>{t(msg.message)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
                <input 
                  type="text" 
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={t("Type radio report...")}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px' }}
                />
                <button 
                  onClick={handleSendMessage}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
                >
                  {t("Send")}</button>
              </div>
            </div>

            {/* Port VHF Directory */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#2563eb" />
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("VHF Radio & Station Directory")}</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#000000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px' }}>
                  <span>{t("Vessel Traffic Services (VTS)")}</span>
                  <strong>{t("Channel 10 / 16")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px' }}>
                  <span>{t("Port Control Tower")}</span>
                  <strong>{t("Channel 12")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px' }}>
                  <span>{t("Harbour Pilot Dispatcher")}</span>
                  <strong>{t("Channel 14")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '6px' }}>
                  <span>{t("Emergency / Tug Master Call")}</span>
                  <strong>{t("Channel 06 / 16")}</strong>
                </div>
              </div>

              {/* predefined status signals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("PREDEFINED TRANSIT SIGNALS:")}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      const now = new Date();
                      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} UTC+4`;
                      setSentMessages([...sentMessages, { sender: 'Poseidon', message: 'Tug lines secured to target vessel.', time: timeStr }]);
                    }}
                    style={{ padding: '8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '10px', fontWeight: 600, backgroundColor: 'white', cursor: 'pointer' }}
                  >
                    {t("Lines Secured")}</button>
                  <button 
                    onClick={() => {
                      const now = new Date();
                      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} UTC+4`;
                      setSentMessages([...sentMessages, { sender: 'Poseidon', message: 'Tug lines successfully cast off.', time: timeStr }]);
                    }}
                    style={{ padding: '8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '10px', fontWeight: 600, backgroundColor: 'white', cursor: 'pointer' }}
                  >
                    {t("Lines Released")}</button>
                </div>
              </div>
            </div>

            {/* VHF Radio Transmission Archives (Fills bottom half of Communications page!) */}
            <div style={{ gridColumn: 'span 2', backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '20px', width: '100%', marginTop: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><List size={14} color="#2563eb" /> {t(" VHF Radio Communication Archives")}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
                {radioArchives.map((arch, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', paddingTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <span style={{ width: '45px', color: '#64748b' }}>{t(arch.timestamp)}</span>
                      <strong style={{ width: '140px', color: '#1e293b' }}>{t(arch.speaker)}</strong>
                      <span style={{ color: '#475569' }}>{t(arch.message)}</span>
                    </div>
                    <span style={{ fontSize: '9.5px', fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>{t(arch.channel)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {t(toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: 600,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CheckCircle size={16} color="#10b981" />
          <span>{t(toastMsg)}</span>
        </div>
      ))}
    </div>
  );
};
