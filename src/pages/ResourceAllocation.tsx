import React, { useMemo, useState } from 'react';
import { Ship, Anchor, Compass, Sparkles, Check, X, RefreshCw, Calendar, ArrowDownRight, ArrowUpRight, ArrowRight, Box, Layers, ChevronDown, ChevronRight, Info, Clock, ShieldCheck, Activity } from 'lucide-react';
import { listVessels, docks, type VesselListItem, type DockDetail } from './UnifiedDashboard';
import { activePort } from '../ports';
import { t } from '../i18n';

interface TugBoat {
  id: string;
  name: string;
  bollardPull: string;
  status: 'Available' | 'On Assignment' | 'Maintenance';
}

interface HarborPilot {
  id: string;
  name: string;
  certification: string;
  status: 'Available' | 'On Assignment' | 'Off Duty';
}

interface QuayCrane {
  id: string;
  name: string;
  capacity: string;
  status: 'Available' | 'On Assignment' | 'Maintenance';
}

const TUG_FLEET: TugBoat[] = [
  { id: 'tug-1', name: 'Tug Poseidon', bollardPull: '65t', status: 'Available' },
  { id: 'tug-2', name: 'Tug Neptune', bollardPull: '60t', status: 'Available' },
  { id: 'tug-3', name: 'Tug Triton', bollardPull: '55t', status: 'On Assignment' },
  { id: 'tug-4', name: 'Tug Meridian', bollardPull: '70t', status: 'Available' },
  { id: 'tug-5', name: 'Tug Aegis', bollardPull: '50t', status: 'Maintenance' },
  { id: 'tug-6', name: 'Tug Orion', bollardPull: '62t', status: 'Available' }
];

const PILOT_ROSTER: HarborPilot[] = [
  { id: 'pilot-1', name: 'Capt. Huda Al Lawati', certification: 'Deep Draft Certified', status: 'Available' },
  { id: 'pilot-2', name: 'Capt. Saif Al Harthy', certification: 'LNG/Hazmat Certified', status: 'Available' },
  { id: 'pilot-3', name: 'Capt. Noor Al Zadjali', certification: 'Cruise Vessel Certified', status: 'On Assignment' },
  { id: 'pilot-4', name: 'Capt. Yousuf Al Farsi', certification: 'Standard Certified', status: 'Available' },
  { id: 'pilot-5', name: 'Capt. Aisha Al Shanfari', certification: 'Deep Draft Certified', status: 'Off Duty' }
];

const CRANE_ROSTER: QuayCrane[] = [
  { id: 'crane-1', name: 'Gantry Crane Super-Post-Panamax #1', capacity: '65t Dual-Hoist', status: 'Available' },
  { id: 'crane-2', name: 'STS Crane SCT #3', capacity: '50t Twin-Lift', status: 'Available' },
  { id: 'crane-3', name: 'Paceco Heavy Gantry Crane #2', capacity: '45t Single-Lift', status: 'On Assignment' },
  { id: 'crane-4', name: 'Liebherr LHM 550 Mobile Harbor Crane', capacity: '100t Heavy-Lift', status: 'Available' },
  { id: 'crane-5', name: 'ZPMC Super-Post-Panamax #4', capacity: '65t Dual-Hoist', status: 'Maintenance' }
];

// MAERSK DHOFAR's arrival resources are pre-assigned by AI Agents (see the toaster
// notification) and must match the fixed allocation shown on the Tug/Pilot/Crane
// Active Assignments pages, rather than the generic hash-based suggestion below.
const MSC_BARCELONA_BERTH: DockDetail = {
  id: 'sct-b04',
  label: 'B04',
  name: 'Salalah Container Terminal - Berth 4',
  pier: 'SCT-B04',
  ...activePort.geo.docks.A,
  width: 0.00018,
  status: 'Reserved',
  vessel: 'MAERSK DHOFAR',
  vesselType: 'Container Ship',
  maxLoa: '400m',
  depth: '18.0m',
  nextArrival: 'Today, 16:12'
};

const MSC_BARCELONA_SUGGESTION = {
  tugIds: ['tug-1', 'tug-2', 'tug-3', 'tug-4'], // Poseidon, Neptune, Triton, Meridian
  pilotId: 'pilot-1', // Capt. Huda Al Lawati
  craneId: 'crane-4', // Liebherr LHM 550 Mobile Harbor Crane
  berthId: MSC_BARCELONA_BERTH.id
};

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const pickAvailable = <T extends { status: string }>(pool: T[], seed: number): T => {
  const available = pool.filter(item => item.status === 'Available');
  const source = available.length > 0 ? available : pool;
  return source[seed % source.length];
};

interface PortCallHistoryItem {
  date: string;
  berth: string;
  inboundTEU: number;
  outboundTEU: number;
  cargoType: string;
  assignedPilot: string;
  assignedTugs: string;
  stevedoreTeam: string;
  dwellTime: string;
}

const BERTH_LIST = ['SCT Berth 1', 'SCT Berth 3', 'SCT Berth 6', 'GCT Berth 21', 'GCT Berth 28'];
const CARGO_CATALOG = [
  'Dry Bulk & Electronics Containers',
  'Automotive & Machinery Units',
  'Reefer Cold-Chain Produce',
  'High-Value Manufactured Goods',
  'Chemical & Raw Materials',
  'Consumer Goods & Apparel'
];
const PILOTS_LIST = ['Capt. Huda Al Lawati', 'Capt. Saif Al Harthy', 'Capt. Noor Al Zadjali', 'Capt. Yousuf Al Farsi', 'Capt. Aisha Al Shanfari'];
const TUGS_LIST = ['Tug Poseidon (65t) + Tug Neptune (60t)', 'Tug Triton (55t)', 'Tug Meridian (70t) + Tug Aegis (50t)', 'Tug Orion (62t) + Tug Poseidon (65t)'];
const SUPERVISORS = ['Team Alpha (Lead: M. Ross)', 'Team Bravo (Lead: J. Delgado)', 'Team Delta (Lead: S. Chen)', 'Team Echo (Lead: K. Novak)'];

const generateVesselHistory = (vesselName: string): PortCallHistoryItem[] => {
  const seed = hashString(vesselName);
  const history: PortCallHistoryItem[] = [];

  for (let i = 1; i <= 10; i++) {
    const s = seed + i * 1337;
    const daysAgo = i * 14 + (s % 7);
    const inbound = 450 + (s % 1200);
    const outbound = 380 + ((s * 3) % 1150);
    const berth = BERTH_LIST[(s + i) % BERTH_LIST.length];
    const cargoType = CARGO_CATALOG[(s >> 2) % CARGO_CATALOG.length];
    const assignedPilot = PILOTS_LIST[(s >> 3) % PILOTS_LIST.length];
    const assignedTugs = TUGS_LIST[(s >> 4) % TUGS_LIST.length];
    const stevedoreTeam = SUPERVISORS[(s >> 5) % SUPERVISORS.length];
    const hours = 14 + (s % 18);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(); // dynamic reference date linked to current system date
    d.setDate(d.getDate() - daysAgo);
    const dateStr = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;

    history.push({
      date: dateStr,
      berth,
      inboundTEU: inbound,
      outboundTEU: outbound,
      cargoType,
      assignedPilot,
      assignedTugs,
      stevedoreTeam,
      dwellTime: `Turnaround: ${hours}h (Completed)`
    });
  }
  return history;
};

interface CraneSlaModalProps {
  vesselName: string;
  craneName: string;
  craneCapacity: string;
  operationType: 'Arrival' | 'Departure';
  onClose: () => void;
}

const formatHM = (d: Date): string => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const addMinutes = (d: Date, mins: number): Date => new Date(d.getTime() + mins * 60000);

// Parses the app's canonical "YY-MM-DD HH:MM" ship date/time format back into a Date.
const parseShipDateTime = (value: string | undefined): Date | null => {
  if (!value) return null;
  const match = value.match(/^(\d{2})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, yy, mm, dd, hh, mi] = match;
  return new Date(2000 + Number(yy), Number(mm) - 1, Number(dd), Number(hh), Number(mi));
};

const CRANE_SLA_STEPS = [
  { durationMin: 15, title: 'Crane Positioning & Gang Safety Calibration', desc: 'Quay crane positioned at quay mark. Spreader calibration & pre-ops safety checklist.', status: 'In Progress', color: '#2563eb' },
  { durationMin: 45, title: 'Hatch Cover Removal & Stack Lashing Unlocks', desc: 'Deck hatch covers removed and stack twistlocks unlocked across Bays 12-24.', status: 'Scheduled', color: '#64748b' },
  { durationMin: 255, title: 'Phase 1: Container Discharge Operation', desc: 'Continuous discharge of 450 Inbound TEUs to automated quay AGVs at 38 moves/hr.', status: 'Scheduled', color: '#64748b' },
  { durationMin: 30, title: 'Mid-Operation Maintenance & Crew Rotation', desc: 'Scheduled 30-min gang shift changeover, hydraulic lube check, and twistlock inspection.', status: 'Scheduled', color: '#64748b' },
  { durationMin: 255, title: 'Phase 2: Outbound Container Loading Operation', desc: 'Loading and securing of 400 Outbound TEUs onto vessel cell guides at 36 moves/hr.', status: 'Scheduled', color: '#64748b' },
  { durationMin: 30, title: 'Lashing Inspection & Quay Clearance (Completion)', desc: 'Final container lashing verification, gangway clearance, and crane boom stowage.', status: 'Scheduled', color: '#64748b' }
];

// Crane Positioning starts at the vessel's ETA; every later milestone is chained
// off the previous one's completion time, keeping each step's fixed duration.
const buildCraneSlaSchedule = (vesselName: string) => {
  const vessel = listVessels.find(v => v.name === vesselName);
  let cursor = parseShipDateTime(vessel?.eta) ?? new Date();

  return CRANE_SLA_STEPS.map(step => {
    const start = cursor;
    const end = addMinutes(cursor, step.durationMin);
    cursor = end;
    return { time: `${formatHM(start)} - ${formatHM(end)}`, title: step.title, desc: step.desc, status: step.status, color: step.color };
  });
};

export const CraneSlaModal: React.FC<CraneSlaModalProps> = ({ vesselName, craneName, craneCapacity, operationType, onClose }) => {
  const slaSchedule = useMemo(() => buildCraneSlaSchedule(vesselName), [vesselName]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 80000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(37,99,235,0.1)', padding: '8px', borderRadius: '10px' }}>
              <Clock size={20} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {t("Quay Crane Operation SLA & Timeline")}</h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {t(craneName)} ({t(craneCapacity)}) · {t(vesselName)} ({t(operationType)})
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* SLA Performance KPI Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>{t("Target Move Speed")}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e40af', marginTop: '4px' }}>{t("38 Moves / Hr")}</div>
              <div style={{ fontSize: '10px', color: '#3b82f6', marginTop: '2px' }}>{t("Dual-Hoist Mode")}</div>
            </div>
            <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>{t("Max Allowed SLA Delay")}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46', marginTop: '4px' }}>{t("< 15 Mins")}</div>
              <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>{t("Oman PCS Guarantee")}</div>
            </div>
            <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>{t("Total SLA Window")}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#92400e', marginTop: '4px' }}>{t("10.5 Hours")}</div>
              <div style={{ fontSize: '10px', color: '#d97706', marginTop: '2px' }}>{t("Turnaround Target")}</div>
            </div>
          </div>

          {/* Stevedore Gang Info */}
          <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#475569', fontWeight: 600 }}>{t("Assigned Stevedore Team:")}</span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{t("Team Alpha (Lead: M. Ross) · 12 Crane Operators")}</span>
          </div>

          {/* Detailed Timeline Schedule */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#2563eb" /> {t(" Operational Schedule & SLA Milestones")}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {slaSchedule.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', backgroundColor: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ minWidth: '115px', fontSize: '11px', fontWeight: 800, color: step.color, backgroundColor: `${step.color}10`, padding: '4px 8px', borderRadius: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {t(step.time)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{t(step.title)}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: step.color, backgroundColor: `${step.color}15`, padding: '1px 7px', borderRadius: '4px' }}>
                        {t(step.status)}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
                      {t(step.desc)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee Banner */}
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: '#065f46' }}>
            <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#047857' }}>{t("PCS SLA Guarantee:")}</strong> {t(" Real-time telematics automatically report moves/hr to PCS TOS. Automatic penalty credits triggered if crane downtime exceeds 15 mins.")}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {t("Close SLA & Schedule")}</button>
        </div>
      </div>
    </div>
  );
};

interface ResourceAllocationModalProps {
  vesselName: string | null;
  onClose: () => void;
  onAccept: () => void;
  isMscBarcelonaAccepted?: boolean;
}

export const ResourceAllocationModal: React.FC<ResourceAllocationModalProps> = ({ vesselName, onClose, onAccept }) => {
  const vessel: VesselListItem | undefined = useMemo(
    () => listVessels.find(v => v.name === vesselName),
    [vesselName]
  );

  // MAERSK DHOFAR's dedicated berth (SCT-B04) isn't part of the shared live-map
  // dock list, so it's added locally for this vessel to keep it selectable/found.
  const dockPool = useMemo(
    () => (vessel?.name === 'MAERSK DHOFAR' ? [...docks, MSC_BARCELONA_BERTH] : docks),
    [vessel]
  );

  const vacantBerths = useMemo(() => dockPool.filter(d => d.status !== 'Occupied'), [dockPool]);

  const tugReqs = useMemo(() => {
    if (!vessel) return { requiredTugsCount: 2, requiredBollardPull: 120 };
    const loaNum = parseInt(vessel.loa) || 280;
    const rawGt = parseInt(vessel.gt.replace(/[^0-9]/g, '')) || 80;
    const gtNum = rawGt * (vessel.gt.toLowerCase().includes('k') ? 1000 : 1);

    const requiredTugsCount = vessel.tugs || (loaNum >= 350 || gtNum >= 120000 ? 4 : loaNum >= 280 || gtNum >= 75000 ? 3 : 2);
    const requiredBollardPull = Math.round(loaNum * 0.35 + (gtNum / 1000) * 0.7);

    return {
      requiredTugsCount,
      requiredBollardPull
    };
  }, [vessel]);

  const suggestion = useMemo(() => {
    if (!vessel) return null;
    const seed = hashString(vessel.name);

    const pickAvailableMultiple = (pool: TugBoat[], count: number, offset: number = 0): string[] => {
      const available = pool.filter(item => item.status === 'Available');
      const source = available.length >= count ? available : pool;
      const selectedIds: string[] = [];
      for (let i = 0; i < source.length && selectedIds.length < count; i++) {
        const item = source[(i + offset) % source.length];
        if (!selectedIds.includes(item.id)) {
          selectedIds.push(item.id);
        }
      }
      return selectedIds.length > 0 ? selectedIds : [pool[0].id];
    };

    // Arrival Suggestions - Multi-Tug
    const berthPool = vacantBerths.length > 0 ? vacantBerths : dockPool;

    const isMscBarcelona = vessel.name === 'MAERSK DHOFAR';
    const tugIds = isMscBarcelona ? MSC_BARCELONA_SUGGESTION.tugIds : pickAvailableMultiple(TUG_FLEET, tugReqs.requiredTugsCount, seed);
    const pilotId = isMscBarcelona ? MSC_BARCELONA_SUGGESTION.pilotId : pickAvailable(PILOT_ROSTER, seed + 1).id;
    const craneId = isMscBarcelona ? MSC_BARCELONA_SUGGESTION.craneId : pickAvailable(CRANE_ROSTER, seed + 2).id;
    const berthId = isMscBarcelona ? MSC_BARCELONA_SUGGESTION.berthId : berthPool[seed % berthPool.length].id;

    // Departure Suggestions - Multi-Tug (no fixed AI pre-assignment exists yet for departure)
    const depTugIds = pickAvailableMultiple(TUG_FLEET, tugReqs.requiredTugsCount, seed + 3);
    const depPilot = pickAvailable(PILOT_ROSTER, seed + 4);
    const depCrane = pickAvailable(CRANE_ROSTER, seed + 5);
    const depBerth = berthPool[(seed + 1) % berthPool.length];

    return {
      tugIds,
      pilotId,
      craneId,
      berthId,
      depTugIds,
      depPilotId: depPilot.id,
      depCraneId: depCrane.id,
      depBerthId: depBerth.id
    };
  }, [vessel, vacantBerths, dockPool, tugReqs]);

  const [accepted, setAccepted] = useState(false);

  // Arrival Selection State (Multi-Tug)
  const [selectedTugIds, setSelectedTugIds] = useState<string[]>(suggestion?.tugIds ?? [TUG_FLEET[0].id]);
  const [selectedPilotId, setSelectedPilotId] = useState<string>(suggestion?.pilotId ?? PILOT_ROSTER[0].id);
  const [selectedCraneId, setSelectedCraneId] = useState<string>(suggestion?.craneId ?? CRANE_ROSTER[0].id);
  const [selectedBerthId, setSelectedBerthId] = useState<string>(suggestion?.berthId ?? docks[0].id);

  // Departure Selection State (Multi-Tug)
  const [selectedDepTugIds, setSelectedDepTugIds] = useState<string[]>(suggestion?.depTugIds ?? [TUG_FLEET[1]?.id ?? TUG_FLEET[0].id]);
  const [selectedDepPilotId, setSelectedDepPilotId] = useState<string>(suggestion?.depPilotId ?? PILOT_ROSTER[1]?.id ?? PILOT_ROSTER[0].id);
  const [selectedDepCraneId, setSelectedDepCraneId] = useState<string>(suggestion?.depCraneId ?? CRANE_ROSTER[3]?.id ?? CRANE_ROSTER[0].id);
  const [selectedDepBerthId, setSelectedDepBerthId] = useState<string>(suggestion?.depBerthId ?? docks[0].id);

  // Crane SLA Modal state
  const [slaModalData, setSlaModalData] = useState<{ craneName: string; craneCapacity: string; operationType: 'Arrival' | 'Departure' } | null>(null);

  const selectedTugs = useMemo(() => {
    const list = TUG_FLEET.filter(t => (selectedTugIds || []).includes(t.id));
    return list.length > 0 ? list : [TUG_FLEET[0]];
  }, [selectedTugIds]);

  const selectedDepTugs = useMemo(() => {
    const list = TUG_FLEET.filter(t => (selectedDepTugIds || []).includes(t.id));
    return list.length > 0 ? list : [TUG_FLEET[1] || TUG_FLEET[0]];
  }, [selectedDepTugIds]);

  const totalArrivalPull = useMemo(() => {
    return selectedTugs.reduce((sum, t) => sum + (parseInt(t.bollardPull) || 0), 0);
  }, [selectedTugs]);

  const totalDepPull = useMemo(() => {
    return selectedDepTugs.reduce((sum, t) => sum + (parseInt(t.bollardPull) || 0), 0);
  }, [selectedDepTugs]);

  const arrivalTugsStr = selectedTugs.map(t => `${t.name} (${t.bollardPull})`).join(' + ');
  const depTugsStr = selectedDepTugs.map(t => `${t.name} (${t.bollardPull})`).join(' + ');

  // Live AI agent stream step index (-1 means not started yet)
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [typedTask, setTypedTask] = useState('');

  const startAgentStream = React.useCallback(() => {
    setActiveStepIndex(-1);
    setTypedTask('');
    let current = -1;
    const interval = setInterval(() => {
      current += 1;
      setActiveStepIndex(current);
      if (current >= 9) {
        clearInterval(interval);
      }
    }, 2200); // 2.2s per agent step for realistic AI execution
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const cleanup = startAgentStream();
    return cleanup;
  }, [vessel?.name, startAgentStream]);

  // Typewriter animation effect for active AI agent task
  React.useEffect(() => {
    if (activeStepIndex >= 0 && activeStepIndex <= 8) {
      const stepTasks = [
        `Tracking vessel approach & calculating ETA (T+90m)...`,
        `Collecting telemetry: Gross Tonnage (${vessel?.gt || '153K GT'}), LOA (${vessel?.loa || '366m'}) & Draft (${vessel?.draft || '14.2m'})...`,
        `Computing required bollard pull (${tugReqs.requiredBollardPull}t) based on vessel displacement weight...`,
        `Starting automatic multi-agent resource allocation for Arrival & Departure...`,
        `Finding available berths matching LOA & depth clearance...`,
        `Matching optimal berth slot (SCT-B04 cleared)...`,
        `Allocating ${selectedTugs.length} Arrival Tugs (${arrivalTugsStr}) for ${totalArrivalPull}t combined pull force...`,
        `Allocating ${selectedDepTugs.length} Departure Tugs (${depTugsStr}) for ${totalDepPull}t combined pull force...`,
        `Updating Oman PCS central vessel management system API...`
      ];
      const fullText = t(stepTasks[activeStepIndex] || '');
      setTypedTask('');
      let charIndex = 0;
      const timer = setInterval(() => {
        charIndex += 1;
        setTypedTask(fullText.slice(0, charIndex));
        if (charIndex >= fullText.length) {
          clearInterval(timer);
        }
      }, 18);
      return () => clearInterval(timer);
    }
  }, [activeStepIndex, vessel?.name, vessel?.loa, vessel?.draft, vessel?.gt, vessel?.tugs, tugReqs, selectedTugs.length, selectedDepTugs.length, arrivalTugsStr, depTugsStr, totalArrivalPull, totalDepPull]);

  // Custom Shadcn Dropdown visibility states (Arrival)
  const [openTugDropdown, setOpenTugDropdown] = useState(false);
  const [openPilotDropdown, setOpenPilotDropdown] = useState(false);
  const [openCraneDropdown, setOpenCraneDropdown] = useState(false);
  const [openBerthDropdown, setOpenBerthDropdown] = useState(false);

  // Custom Shadcn Dropdown visibility states (Departure)
  const [openDepTugDropdown, setOpenDepTugDropdown] = useState(false);
  const [openDepPilotDropdown, setOpenDepPilotDropdown] = useState(false);
  const [openDepCraneDropdown, setOpenDepCraneDropdown] = useState(false);
  const [openDepBerthDropdown, setOpenDepBerthDropdown] = useState(false);

  const closeAllDropdowns = () => {
    setOpenTugDropdown(false);
    setOpenPilotDropdown(false);
    setOpenCraneDropdown(false);
    setOpenBerthDropdown(false);
    setOpenDepTugDropdown(false);
    setOpenDepPilotDropdown(false);
    setOpenDepCraneDropdown(false);
    setOpenDepBerthDropdown(false);
  };

  // Compute live vessel container metrics & AI reasoning explanations for Arrival and Departure
  const vesselMetrics = useMemo(() => {
    if (!vessel) return {
      inboundTEU: 0,
      outboundTEU: 0,
      availableTEU: 0,
      maxCapacityTEU: 10000,
      utilizationPct: 80,
      arrivalAiReasoning: { tug: '', pilot: '', crane: '', berth: '' },
      departureAiReasoning: { tug: '', pilot: '', crane: '', berth: '' }
    };
    const seed = hashString(vessel.name);
    const inboundTEU = 850 + (seed % 950);
    const outboundTEU = 720 + ((seed * 3) % 900);
    const maxCapacityTEU = 12500 + (seed % 5000);
    const loadedContainers = 9200 + (seed % 2800);
    const availableTEU = maxCapacityTEU - loadedContainers;
    const utilizationPct = Math.round((loadedContainers / maxCapacityTEU) * 100);

    const pilotObj = PILOT_ROSTER.find(p => p.id === (suggestion?.pilotId ?? selectedPilotId));
    const craneObj = CRANE_ROSTER.find(c => c.id === (suggestion?.craneId ?? selectedCraneId));
    const berthObj = dockPool.find(d => d.id === (suggestion?.berthId ?? selectedBerthId));

    const depPilotObj = PILOT_ROSTER.find(p => p.id === (suggestion?.depPilotId ?? selectedDepPilotId));
    const depCraneObj = CRANE_ROSTER.find(c => c.id === (suggestion?.depCraneId ?? selectedDepCraneId));
    const depBerthObj = dockPool.find(d => d.id === (suggestion?.depBerthId ?? selectedDepBerthId));

    return {
      inboundTEU,
      outboundTEU,
      availableTEU,
      maxCapacityTEU,
      utilizationPct,
      arrivalAiReasoning: {
        tug: `Allocated ${selectedTugs.length} Tugs (${arrivalTugsStr}) providing ${totalArrivalPull}t combined bollard pull. Selected by AI based on vessel weight (${vessel.gt}), LOA (${vessel.loa}), and draft (${vessel.draft}) requiring minimum ${tugReqs.requiredBollardPull}t force for safe harbor maneuvering.`,
        pilot: `Assigned ${pilotObj?.name || 'Pilot'} holding ${pilotObj?.certification} matching vessel's LOA (${vessel.loa}) and inward fairway maneuver profile.`,
        crane: `Assigned ${craneObj?.name || 'Quay Crane'} (${craneObj?.capacity}) optimized for container discharge speed on quay section ${berthObj?.name || 'Berth'}.`,
        berth: `Allocated ${berthObj?.name || 'Berth'} as it has sufficient depth (${berthObj?.depth || '16m'}) and LOA clearance (max ${berthObj?.maxLoa}) for prompt inbound berthing.`
      },
      departureAiReasoning: {
        tug: `Allocated ${selectedDepTugs.length} Tugs (${depTugsStr}) providing ${totalDepPull}t combined bollard pull. Selected by AI based on vessel displacement weight (${vessel.gt}), LOA (${vessel.loa}), and turning basin unberthing thrust parameters.`,
        pilot: `Assigned ${depPilotObj?.name || 'Departure Pilot'} holding ${depPilotObj?.certification} matching vessel outbound draft profile and exit channel traffic timing.`,
        crane: `Assigned ${depCraneObj?.name || 'Departure Crane'} (${depCraneObj?.capacity}) for final container reloading, hatch cover securing, and gangway clearance.`,
        berth: `Scheduled departure unberthing slot at ${depBerthObj?.name || 'Berth'} matching estimated vessel load completion and outbound tide window.`
      }
    };
  }, [vessel, suggestion, dockPool, selectedTugs, selectedDepTugs, totalArrivalPull, totalDepPull, arrivalTugsStr, depTugsStr, tugReqs, selectedPilotId, selectedCraneId, selectedBerthId, selectedDepPilotId, selectedDepCraneId, selectedDepBerthId]);

  React.useEffect(() => {
    if (suggestion) {
      setSelectedTugIds(suggestion.tugIds);
      setSelectedPilotId(suggestion.pilotId);
      setSelectedCraneId(suggestion.craneId);
      setSelectedBerthId(suggestion.berthId);
      setSelectedDepTugIds(suggestion.depTugIds);
      setSelectedDepPilotId(suggestion.depPilotId);
      setSelectedDepCraneId(suggestion.depCraneId);
      setSelectedDepBerthId(suggestion.depBerthId);
      setAccepted(false);
    }
  }, [vessel?.name, suggestion]);

  if (!vessel || !suggestion) {
    return null;
  }

  const selectedPilot = PILOT_ROSTER.find(p => p.id === selectedPilotId) || PILOT_ROSTER[0];
  const selectedCrane = CRANE_ROSTER.find(c => c.id === selectedCraneId) || CRANE_ROSTER[0];
  const selectedBerth = dockPool.find(d => d.id === selectedBerthId) || dockPool[0];

  const selectedDepPilot = PILOT_ROSTER.find(p => p.id === selectedDepPilotId) || PILOT_ROSTER[1] || PILOT_ROSTER[0];
  const selectedDepCrane = CRANE_ROSTER.find(c => c.id === selectedDepCraneId) || CRANE_ROSTER[3] || CRANE_ROSTER[0];
  const selectedDepBerth = dockPool.find(d => d.id === selectedDepBerthId) || dockPool[0];

  const resetToSuggestion = () => {
    if (suggestion) {
      setSelectedTugIds(suggestion.tugIds);
      setSelectedPilotId(suggestion.pilotId);
      setSelectedCraneId(suggestion.craneId);
      setSelectedBerthId(suggestion.berthId);
      setSelectedDepTugIds(suggestion.depTugIds);
      setSelectedDepPilotId(suggestion.depPilotId);
      setSelectedDepCraneId(suggestion.depCraneId);
      setSelectedDepBerthId(suggestion.depBerthId);
      setAccepted(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === 'Available') return '#10b981';
    if (status === 'On Assignment' || status === 'Occupied') return '#f59e0b';
    return '#ef4444';
  };
  const [showToast, setShowToast] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setShowToast(true);
    onAccept();
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50000,
      padding: '20px'
    }}>
      {/* Success Toast Notification */}
      {showToast && (
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '32px',
          backgroundColor: '#059669',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(5, 150, 105, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 60000,
          fontWeight: 600,
          fontSize: '13px',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <Check size={18} color="white" />
          {t("Resource Allocation Confirmed Successfully for ")}{t(vessel.name)}!
        </div>
      )}

      <div style={{
        backgroundColor: '#EAF1F3',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '1380px',
        width: '95vw',
        maxHeight: '95vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{t(vessel.flag)}</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t(vessel.name)}</h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{t(vessel.type)}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="#475569" />
          </button>
        </div>
        {/* Content Grid Container */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 300px) minmax(0, 1fr) minmax(320px, 360px)', gap: '20px', padding: '20px 24px', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* Column 1: Vessel Specifications & Image (Independent Scroll) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderRight: '1px solid rgba(0,0,0,0.08)', paddingRight: '20px', overflowY: 'auto', maxHeight: '100%', paddingBottom: '12px' }}>
            
            {/* Vessel Image Banner (Positioned at TOP of left column with transparent background) */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px 0'
            }}>
              <img 
                src={vessel.image} 
                alt={t(vessel.name)} 
                style={{ 
                  maxHeight: '130px', 
                  maxWidth: '100%', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                }} 
              />
            </div>

            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Vessel Specifications")}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("LOA")}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(vessel.loa)}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("DRAFT")}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(vessel.draft)}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("GT")}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(vessel.gt)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("ETA")}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(vessel.eta)}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("ETD")}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(vessel.etd)}</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("CARGO TYPE")}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(vessel.cargo)}</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("RISK PROFILE")}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {t(vessel.riskLevel)}
                <span style={{ fontSize: '11px', color: 'white', backgroundColor: vessel.riskLevel === 'CRITICAL RISK' ? '#ef4444' : vessel.riskLevel === 'HIGH RISK' ? '#f97316' : '#eab308', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {vessel.risk}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t("OPERATOR")}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{t(vessel.operator)}</div>
            </div>
          </div>

          {/* Column 2 (Center): Vessel Port Calls & Cargo History (Independent Scroll) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderRight: '1px solid rgba(0,0,0,0.08)', paddingRight: '20px', overflowY: 'auto', maxHeight: '100%', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#EAF1F3', zIndex: 10, paddingBottom: '6px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                {t("Port Call & Cargo History (Last 10 Visits)")}</h3>
              <span style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                {t("10 Records")}</span>
            </div>

            {/* History list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {generateVesselHistory(vessel.name).map((visit, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid rgba(0,0,0,0.08)', 
                    borderRadius: '12px', 
                    padding: '14px', 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {/* Arrival Date & Berth */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="#2563eb" /> {t(visit.date)}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '3px 10px', borderRadius: '6px' }}>
                      {t(visit.berth)}
                    </div>
                  </div>

                  {/* Containers stats: Inbound & Outbound */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t("Inbound Containers")}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowDownRight size={15} color="#059669" /> {visit.inboundTEU} {t(" TEU")}</div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t("Outbound Containers")}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowUpRight size={15} color="#2563eb" /> {visit.outboundTEU} {t(" TEU")}</div>
                    </div>
                  </div>

                  {/* Cargo Breakdown */}
                  <div style={{ fontSize: '11px', color: '#334155', backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ color: '#1e293b' }}>{t("Cargo Manifest:")}</strong> <span>{t(visit.cargoType)}</span>
                  </div>

                  {/* Assigned Personnel & Services */}
                  <div style={{ fontSize: '11px', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <div><strong>{t("Pilot:")}</strong> {t(visit.assignedPilot)}</div>
                    <div><strong>{t("Tugs:")}</strong> {t(visit.assignedTugs)}</div>
                    <div><strong>{t("Supervisor:")}</strong> {t(visit.stevedoreTeam)}</div>
                    <div style={{ color: '#10b981', fontWeight: 700, textAlign: 'right' }}>{t(visit.dwellTime)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 (Rightmost): Resource Allocation (Independent Scroll) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', minHeight: 0, height: '100%', paddingBottom: '16px', paddingRight: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#2563eb" />
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{t("Resource Allocation")}</h3>
            </div>

            {/* AI Agent Live Reasoning Console */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.2)', boxShadow: '0 2px 10px rgba(37,99,235,0.06)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#2563eb" /> {t(" AI Agent Live Execution")}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: activeStepIndex >= 9 ? 'rgba(16,185,129,0.12)' : 'rgba(37,99,235,0.1)', color: activeStepIndex >= 9 ? '#10b981' : '#2563eb', padding: '2px 8px', borderRadius: '12px' }}>
                    {t(activeStepIndex === -1 ? 'INITIALIZING' : activeStepIndex >= 9 ? 'COMPLETE' : 'WORKING')}
                  </span>
                  <button
                    type="button"
                    onClick={startAgentStream}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 4px'
                    }}
                    title={t("Re-run AI Agent reasoning stream")}
                  >
                    <RefreshCw size={11} /> {t(" Re-run")}</button>
                </div>
              </div>

              {(() => {
                const steps = [
                  {
                    agent: 'NavAgent',
                    summary: 'Ship arrived at 2 NM port entry radius',
                    task: `Tracking vessel approach & calculating ETA (T+90m)...`,
                    toolCall: `query_vessel_telemetry({ vesselId: "${vessel.name}", radiusNM: 2.0 })`,
                    subtask: `Confirm entry clearance & speed reduction window (10.5 kt)`,
                    delegation: null
                  },
                  {
                    agent: 'DataAgent',
                    summary: 'Vessel telemetry, LOA (366m) & draft (15.2m) collected',
                    task: `Collecting telemetry, LOA & draft data from vessel...`,
                    toolCall: `fetch_vessel_manifest({ imo: "9786528", fields: ["loa", "draft", "teu"] })`,
                    subtask: `Verify tidal clearance window (+1.8m sea level tolerance)`,
                    delegation: null
                  },
                  {
                    agent: 'PCSAgent',
                    summary: 'Real-time AIS & berth availability synced from Oman PCS',
                    task: `Gathering real-time AIS & berth availability from Oman PCS...`,
                    toolCall: `sync_pcs_ais({ portId: "OMSLL", pier: "SCT-B04" })`,
                    subtask: `Fetch live harbor congestion & channel traffic locks`,
                    delegation: `PCSBridge (Task: Lock channel data feed)`
                  },
                  {
                    agent: 'Orchestrator',
                    summary: 'Automatic AI resource allocation sequence initialized',
                    task: `Starting automatic multi-agent resource allocation sequence...`,
                    toolCall: `initiate_multi_agent_pipeline({ vessel: "${vessel.name}", priority: "HIGH" })`,
                    subtask: `Spinning up specialized sub-agent orchestration tree`,
                    delegation: null
                  },
                  {
                    agent: 'BerthAgent',
                    summary: 'LOA & depth clearance verified for SCT-B04',
                    task: `Finding available berths matching LOA & depth clearance...`,
                    toolCall: `query_berth_bathymetry({ pier: "SCT-B04", minDepth: "${vessel.draft}" })`,
                    subtask: `Verify pier bollard spacing & maximum draft tolerance`,
                    delegation: null
                  },
                  {
                    agent: 'MatchingAgent',
                    summary: 'Optimal berth slot matched (SCT-B04 cleared)',
                    task: `Matching & choosing optimal berth slot (SCT-B04 cleared)...`,
                    toolCall: `match_optimal_berth({ vesselLoa: 366, terminal: "SCT-P1" })`,
                    subtask: `Evaluate turn-around time & crane reach parameters`,
                    delegation: `TerminalOpsAgent (Task: Reserve berth slot SCT-B04)`
                  },
                  {
                    agent: 'ResourceAgent',
                    summary: 'Assigned Capt. Huda Al Lawati & allocated 4 escort tugs',
                    task: `Allocating berth slot, harbor pilot & escort tugboats...`,
                    toolCall: `allocate_marine_resources({ tugCount: 4, cert: "Deep Draft Certified" })`,
                    subtask: `Assign Tug Poseidon (65t) + Tug Neptune (60t) + Capt. Huda Al Lawati`,
                    delegation: `TugFleetAgent (Task: Lock escort channel slot)`
                  },
                  {
                    agent: 'SyncAgent',
                    summary: 'Oman PCS central vessel management system updated',
                    task: `Updating Oman PCS central vessel management system API...`,
                    toolCall: `update_pcs_manifest({ vesselId: "${vessel.name}", berthId: "SCT-B04" })`,
                    subtask: `Publish allocation schema to Oman PCS central API`,
                    delegation: `PCSBridge (Task: Write clearance record)`
                  },
                  {
                    agent: 'NotifyAgent',
                    summary: 'Port operations & stevedoring teams notified. Ready!',
                    task: `Informing port operations & stevedoring teams. Complete!`,
                    toolCall: `broadcast_ops_notification({ channel: "STEVE-OPS-SALALAH", status: "READY" })`,
                    subtask: `Dispatch automated briefing to pilot & stevedore crew`,
                    delegation: `PortControlAgent (Task: Broadcast clearance)`
                  }
                ];

                if (activeStepIndex === -1) {
                  return (
                    <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 0' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'ping 1s infinite' }}></span>
                      {t("Initializing AI multi-agent orchestration workflow...")}</div>
                  );
                }

                const completed = steps.slice(0, activeStepIndex);
                const current = steps[activeStepIndex];

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {/* Compact completed rows */}
                    {completed.map((cStep, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '11px',
                          padding: '5px 8px',
                          borderRadius: '7px',
                          background: 'rgba(16, 185, 129, 0.06)',
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                        }}
                      >
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                          background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 0 6px rgba(16,185,129,0.35)'
                        }}>
                          <Check size={9} color="#fff" strokeWidth={3} />
                        </div>
                        <span style={{ fontWeight: 700, color: '#059669', fontSize: '10px' }}>{t(cStep.agent)}</span>
                        <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t(cStep.summary)}</span>
                      </div>
                    ))}

                    {/* Active agent card */}
                    {current && (
                      <div
                        style={{
                          marginTop: completed.length > 0 ? '4px' : '0',
                          backgroundColor: '#fafbff',
                          border: '1px solid rgba(37, 99, 235, 0.25)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '7px',
                          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: '0 2px 10px rgba(37,99,235,0.07)'
                        }}
                      >
                        {/* Agent name + pulsing dot */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: '#2563eb', flexShrink: 0,
                            boxShadow: '0 0 0 3px rgba(37,99,235,0.2)',
                            animation: 'ping 1s infinite'
                          }} />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', flexShrink: 0 }}>{t(current.agent)}</span>
                          <span style={{ fontSize: '11px', color: '#334155', flex: 1, fontWeight: 600, wordBreak: 'break-word' }}>
                            {t(typedTask)}
                            {typedTask.length < current.task.length && (
                              <span style={{ opacity: 0.7, color: '#2563eb', fontWeight: 800, marginLeft: '2px', animation: 'pulse 0.6s infinite' }}>|</span>
                            )}
                          </span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: 'rgba(37,99,235,0.1)', margin: '0 -2px' }} />

                        {/* Tool Call row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                            background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2,132,199,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px'
                          }}>
                            <Info size={10} color="#0284c7" />
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{t("Tool Call")}</div>
                            <code style={{
                              fontSize: '9.5px', color: '#0c4a6e', fontFamily: 'monospace',
                              backgroundColor: '#f0f9ff', padding: '2px 6px',
                              borderRadius: '4px', border: '1px solid #bae6fd',
                              display: 'inline-block', lineHeight: '1.5'
                            }}>{t(current.toolCall)}</code>
                          </div>
                        </div>

                        {/* Sub-task row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                            background: 'rgba(100, 116, 139, 0.08)', border: '1px solid rgba(100,116,139,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px'
                          }}>
                            <ArrowRight size={10} color="#64748b" />
                          </div>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{t("Sub-task")}</div>
                            <span style={{ fontSize: '10.5px', color: '#334155' }}>{t(current.subtask)}</span>
                          </div>
                        </div>

                        {/* Delegation row (conditional) */}
                        {t(current.delegation && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                              background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124,58,237,0.18)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px'
                            }}>
                              <Compass size={10} color="#7c3aed" />
                            </div>
                            <div>
                              <div style={{ fontSize: '9px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{t("Delegation")}</div>
                              <span style={{ fontSize: '10.5px', color: '#4c1d95', fontWeight: 600 }}>{t(current.delegation)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Current Cargo & Space Metrics for this Vessel Call */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Box size={14} color="#2563eb" /> {t(" Container & Capacity Status")}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t("Inbound")}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ArrowDownRight size={13} /> {vesselMetrics.inboundTEU} {t(" TEU")}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t("Outbound")}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ArrowUpRight size={13} /> {vesselMetrics.outboundTEU} {t(" TEU")}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t("Available Space")}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#d97706', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Layers size={13} /> {vesselMetrics.availableTEU} {t(" TEU")}</div>
                </div>
              </div>

              {/* Progress bar of vessel deck capacity */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                  <span>{t("Deck Load Factor (")}{vesselMetrics.utilizationPct}{t("% Full)")}</span>
                  <span>{t("Max Capacity: ")}{t(vesselMetrics.maxCapacityTEU.toLocaleString())} {t(" TEU")}</span>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${vesselMetrics.utilizationPct}%`, height: '100%', backgroundColor: vesselMetrics.utilizationPct > 85 ? '#ef4444' : '#2563eb', borderRadius: '3px' }} />
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* SECTION 1: ARRIVAL (INCOMING) ALLOCATION                   */}
            {/* ========================================================== */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(5,150,105,0.3)', boxShadow: '0 2px 8px rgba(5,150,105,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <ArrowDownRight size={16} color="#059669" />
                  {t("Arrival (Incoming) Allocation")}</div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                  {t("INBOUND MANEUVER")}</span>
              </div>

              {/* Arrival Tug Boat Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <Compass size={13} color="#059669" />
                    {t("Tug Boat Allocation")}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9.5px', color: '#047857', backgroundColor: '#d1fae5', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {totalArrivalPull}t / {tugReqs.requiredBollardPull}{t("t Pull")}</span>
                    <div 
                      className="custom-tooltip-trigger"
                      title={t(`AI Rationale: Vessel parameters (${vessel?.gt} weight, ${vessel?.loa} LOA, ${vessel?.draft} draft) require minimum ${tugReqs.requiredBollardPull}t bollard pull. Allocated ${selectedTugs.length} tugs (${arrivalTugsStr}) for ${totalArrivalPull}t combined force.`)}
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#059669" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '260px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#059669" /> {t(" Multi-Tug AI Rationale")}</div>
                        {t("Vessel parameters (")}{t(vessel?.gt)} {t(" weight, ")}{t(vessel?.loa)} {t(" LOA, ")}{t(vessel?.draft)} {t(" draft) require minimum ")}{tugReqs.requiredBollardPull}{t("t pull. Allocated ")}{selectedTugs.length} {t(" tugs (")}{t(arrivalTugsStr)}{t(") for ")}{totalArrivalPull}{t("t combined force.")}</div>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openTugDropdown;
                      closeAllDropdowns();
                      setOpenTugDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      minHeight: '36px',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                      {selectedTugs.map(tug => (
                        <span key={tug.id} style={{ fontSize: '10.5px', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 7px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {t(tug.name)} ({t(tug.bollardPull)})
                        </span>
                      ))}
                    </div>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openTugDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>

                  {openTugDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {TUG_FLEET.map(tug => {
                        const isSelected = selectedTugIds.includes(tug.id);
                        return (
                          <div
                            key={tug.id}
                            onClick={() => {
                              if (tug.status !== 'Maintenance') {
                                if (isSelected) {
                                  if (selectedTugIds.length > 1) {
                                    setSelectedTugIds(selectedTugIds.filter(id => id !== tug.id));
                                  }
                                } else {
                                  setSelectedTugIds([...selectedTugIds, tug.id]);
                                }
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: isSelected ? 700 : 500,
                              backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                              color: tug.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                              cursor: tug.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                              {t(tug.name)} ({t(tug.bollardPull)})
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(tug.status) }}>{t(tug.status)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival Harbor Pilot Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Ship size={13} color="#059669" />
                    {t("Harbor Pilot Allocation")}</label>
                  {selectedPilotId === suggestion.pilotId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{t("AI SUGGESTED")}</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title={t(`AI Rationale: Matched pilot certification rank to vessel draft (${vessel?.draft || '12m'}) and current tide window.`)}
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#059669" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#059669" /> {t(" Arrival Pilot Rationale")}</div>
                          {t("Matched pilot certification rank to vessel draft (")}{t(vessel?.draft || '12m')}{t(") and current tide window.")}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openPilotDropdown;
                      closeAllDropdowns();
                      setOpenPilotDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{t(selectedPilot.name)} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({t(selectedPilot.certification)})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openPilotDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openPilotDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {PILOT_ROSTER.map(pilot => (
                        <div
                          key={pilot.id}
                          onClick={() => {
                            if (pilot.status !== 'Off Duty') {
                              setSelectedPilotId(pilot.id);
                              setOpenPilotDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: pilot.id === selectedPilotId ? 700 : 500,
                            backgroundColor: pilot.id === selectedPilotId ? '#f1f5f9' : 'transparent',
                            color: pilot.status === 'Off Duty' ? '#94a3b8' : '#1e293b',
                            cursor: pilot.status === 'Off Duty' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{t(pilot.name)} ({t(pilot.certification)})</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(pilot.status) }}>{t(pilot.status)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival Quay Crane Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <Layers size={13} color="#059669" />
                      {t("Quay Crane Allocation")}</label>
                    {selectedCraneId === suggestion.craneId && (
                      <span style={{ fontSize: '9px', color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>{t("AI SUGGESTED")}</span>
                    )}
                    <div 
                      className="custom-tooltip-trigger"
                      title={t("AI Rationale: High-speed gantry crane assigned to maximize container discharge clearance rate.")}
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#059669" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#059669" /> {t(" Arrival Crane Rationale")}</div>
                        {t("High-speed gantry crane assigned to maximize container discharge clearance rate.")}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlaModalData({ craneName: selectedCrane.name, craneCapacity: selectedCrane.capacity, operationType: 'Arrival' })}
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: '1px solid #1d4ed8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                      transition: 'all 0.2s ease',
                      marginLeft: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.25)';
                    }}
                  >
                    <Clock size={12} color="#ffffff" />
                    <span>{t("View SLA & Timeline")}</span>
                    <ChevronRight size={12} color="#ffffff" />
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openCraneDropdown;
                      closeAllDropdowns();
                      setOpenCraneDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t(selectedCrane.name)} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>({t(selectedCrane.capacity)})</span>
                    </span>
                    <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0, transform: openCraneDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openCraneDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {CRANE_ROSTER.map(crane => (
                        <div
                          key={crane.id}
                          onClick={() => {
                            if (crane.status !== 'Maintenance') {
                              setSelectedCraneId(crane.id);
                              setOpenCraneDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: crane.id === selectedCraneId ? 700 : 500,
                            backgroundColor: crane.id === selectedCraneId ? '#f1f5f9' : 'transparent',
                            color: crane.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                            cursor: crane.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{t(crane.name)} ({t(crane.capacity)})</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(crane.status) }}>{t(crane.status)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival Berth Assignment Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Anchor size={13} color="#059669" />
                    {t("Berth Assignment")}</label>
                  {selectedBerthId === suggestion.berthId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{t("AI SUGGESTED")}</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title={t("AI Rationale: Optimal depth berth closest to assigned container yard zone.")}
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#d1fae5', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#059669" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#059669', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#059669" /> {t(" Arrival Berth Rationale")}</div>
                          {t("Optimal depth berth closest to assigned container yard zone.")}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openBerthDropdown;
                      closeAllDropdowns();
                      setOpenBerthDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{t(selectedBerth.name)} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>{t("(Max LOA ")}{t(selectedBerth.maxLoa)})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openBerthDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openBerthDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {dockPool.map(dock => (
                        <div
                          key={dock.id}
                          onClick={() => {
                            if (dock.status !== 'Occupied') {
                              setSelectedBerthId(dock.id);
                              setOpenBerthDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: dock.id === selectedBerthId ? 700 : 500,
                            backgroundColor: dock.id === selectedBerthId ? '#f1f5f9' : 'transparent',
                            color: dock.status === 'Occupied' ? '#94a3b8' : '#1e293b',
                            cursor: dock.status === 'Occupied' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{t(dock.name)} {t(" (Max LOA ")}{t(dock.maxLoa)})</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(dock.status) }}>{t(dock.status)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrival AI Allocation Insights */}
              <div style={{ backgroundColor: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="#059669" /> {t(" Arrival AI Allocation Insights")}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#1e293b', lineHeight: '1.4' }}>
                  <div>
                    <strong style={{ color: '#059669' }}>{t("Tug:")}</strong> {t(vesselMetrics.arrivalAiReasoning.tug)}
                  </div>
                  <div>
                    <strong style={{ color: '#059669' }}>{t("Pilot:")}</strong> {t(vesselMetrics.arrivalAiReasoning.pilot)}
                  </div>
                  <div>
                    <strong style={{ color: '#059669' }}>{t("Crane:")}</strong> {t(vesselMetrics.arrivalAiReasoning.crane)}
                  </div>
                  <div>
                    <strong style={{ color: '#059669' }}>{t("Berth:")}</strong> {t(vesselMetrics.arrivalAiReasoning.berth)}
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* SECTION 2: DEPARTURE (OUTGOING) ALLOCATION                 */}
            {/* ========================================================== */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.3)', boxShadow: '0 2px 8px rgba(37,99,235,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <ArrowUpRight size={16} color="#2563eb" />
                  {t("Departure (Outgoing) Allocation")}</div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                  {t("OUTBOUND MANEUVER")}</span>
              </div>              {/* Departure Tug Boat Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    <Compass size={13} color="#2563eb" />
                    {t("Tug Boat Allocation")}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9.5px', color: '#1d4ed8', backgroundColor: '#dbeafe', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {totalDepPull}t / {tugReqs.requiredBollardPull}{t("t Pull")}</span>
                    <div 
                      className="custom-tooltip-trigger"
                      title={t(`AI Rationale: Vessel parameters (${vessel?.gt} weight, ${vessel?.loa} LOA, ${vessel?.draft} draft) require minimum ${tugReqs.requiredBollardPull}t bollard pull. Allocated ${selectedDepTugs.length} departure tugs (${depTugsStr}) for ${totalDepPull}t combined thrust.`)}
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#2563eb" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '260px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#2563eb" /> {t(" Departure Multi-Tug AI Rationale")}</div>
                        {t("Allocated ")}{selectedDepTugs.length} {t(" departure tugs (")}{t(depTugsStr)}{t(") for ")}{totalDepPull}{t("t combined thrust based on vessel weight (")}{t(vessel?.gt)}{t("), LOA (")}{t(vessel?.loa)}{t("), and turning basin maneuver parameters.")}</div>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepTugDropdown;
                      closeAllDropdowns();
                      setOpenDepTugDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      minHeight: '36px',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                      {selectedDepTugs.map(tug => (
                        <span key={tug.id} style={{ fontSize: '10.5px', fontWeight: 700, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 7px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {t(tug.name)} ({t(tug.bollardPull)})
                        </span>
                      ))}
                    </div>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openDepTugDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>

                  {openDepTugDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {TUG_FLEET.map(tug => {
                        const isSelected = selectedDepTugIds.includes(tug.id);
                        return (
                          <div
                            key={tug.id}
                            onClick={() => {
                              if (tug.status !== 'Maintenance') {
                                if (isSelected) {
                                  if (selectedDepTugIds.length > 1) {
                                    setSelectedDepTugIds(selectedDepTugIds.filter(id => id !== tug.id));
                                  }
                                } else {
                                  setSelectedDepTugIds([...selectedDepTugIds, tug.id]);
                                }
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: isSelected ? 700 : 500,
                              backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                              color: tug.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                              cursor: tug.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                              {t(tug.name)} ({t(tug.bollardPull)})
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(tug.status) }}>{t(tug.status)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Harbor Pilot Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Ship size={13} color="#2563eb" />
                    {t("Harbor Pilot Allocation")}</label>
                  {selectedDepPilotId === suggestion.depPilotId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{t("AI SUGGESTED")}</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title={t(`AI Rationale: Assigned senior pilot certified for departure fairway clearance and channel transit.`)}
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#2563eb" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#2563eb" /> {t(" Departure Pilot Rationale")}</div>
                          {t("Assigned senior pilot certified for departure fairway clearance and channel transit.")}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepPilotDropdown;
                      closeAllDropdowns();
                      setOpenDepPilotDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{t(selectedDepPilot.name)} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>({t(selectedDepPilot.certification)})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openDepPilotDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openDepPilotDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {PILOT_ROSTER.map(pilot => (
                        <div
                          key={pilot.id}
                          onClick={() => {
                            if (pilot.status !== 'Off Duty') {
                              setSelectedDepPilotId(pilot.id);
                              setOpenDepPilotDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: pilot.id === selectedDepPilotId ? 700 : 500,
                            backgroundColor: pilot.id === selectedDepPilotId ? '#f1f5f9' : 'transparent',
                            color: pilot.status === 'Off Duty' ? '#94a3b8' : '#1e293b',
                            cursor: pilot.status === 'Off Duty' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{t(pilot.name)} ({t(pilot.certification)})</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(pilot.status) }}>{t(pilot.status)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Quay Crane Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                      <Layers size={13} color="#2563eb" />
                      {t("Quay Crane Allocation")}</label>
                    {selectedDepCraneId === suggestion.depCraneId && (
                      <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>{t("AI SUGGESTED")}</span>
                    )}
                    <div 
                      className="custom-tooltip-trigger"
                      title={t("AI Rationale: Heavy-lift mobile crane reserved for final outbound container reloading and gangway stowage.")}
                      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                    >
                      <Info size={13} color="#2563eb" />
                      <div 
                        className="custom-tooltip-card"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 8px)',
                          right: '0',
                          width: '240px',
                          padding: '10px 12px',
                          backgroundColor: '#ffffff',
                          color: '#334155',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                          fontSize: '11px',
                          lineHeight: '1.4',
                          pointerEvents: 'none',
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.2s ease',
                          zIndex: 99999,
                          border: '1px solid #e2e8f0'
                        }} 
                      >
                        <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} color="#2563eb" /> {t(" Departure Crane Rationale")}</div>
                        {t("Heavy-lift mobile crane reserved for final outbound container reloading and gangway stowage.")}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSlaModalData({ craneName: selectedDepCrane.name, craneCapacity: selectedDepCrane.capacity, operationType: 'Departure' })}
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: '1px solid #1d4ed8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                      transition: 'all 0.2s ease',
                      marginLeft: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(37, 99, 235, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.25)';
                    }}
                  >
                    <Clock size={12} color="#ffffff" />
                    <span>{t("View SLA & Timeline")}</span>
                    <ChevronRight size={12} color="#ffffff" />
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepCraneDropdown;
                      closeAllDropdowns();
                      setOpenDepCraneDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t(selectedDepCrane.name)} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>({t(selectedDepCrane.capacity)})</span>
                    </span>
                    <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0, transform: openDepCraneDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openDepCraneDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {CRANE_ROSTER.map(crane => (
                        <div
                          key={crane.id}
                          onClick={() => {
                            if (crane.status !== 'Maintenance') {
                              setSelectedDepCraneId(crane.id);
                              setOpenDepCraneDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: crane.id === selectedDepCraneId ? 700 : 500,
                            backgroundColor: crane.id === selectedDepCraneId ? '#f1f5f9' : 'transparent',
                            color: crane.status === 'Maintenance' ? '#94a3b8' : '#1e293b',
                            cursor: crane.status === 'Maintenance' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{t(crane.name)} ({t(crane.capacity)})</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(crane.status) }}>{t(crane.status)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Berth Assignment Selector */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Anchor size={13} color="#2563eb" />
                    {t("Berth Assignment")}</label>
                  {selectedDepBerthId === suggestion.depBerthId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9px', color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{t("AI SUGGESTED")}</span>
                      <div 
                        className="custom-tooltip-trigger"
                        title={t("AI Rationale: Passenger & cargo unberthing slot reserved with max LOA clearance and direct channel access.")}
                        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', backgroundColor: '#dbeafe', padding: '3px', borderRadius: '50%' }}
                      >
                        <Info size={13} color="#2563eb" />
                        <div 
                          className="custom-tooltip-card"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '240px',
                            padding: '10px 12px',
                            backgroundColor: '#ffffff',
                            color: '#334155',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
                            fontSize: '11px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            opacity: 0,
                            visibility: 'hidden',
                            transform: 'translateY(4px)',
                            transition: 'all 0.2s ease',
                            zIndex: 99999,
                            border: '1px solid #e2e8f0'
                          }} 
                        >
                          <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={11} color="#2563eb" /> {t(" Departure Berth Rationale")}</div>
                          {t("Passenger & cargo unberthing slot reserved with max LOA clearance and direct channel access.")}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const prev = openDepBerthDropdown;
                      closeAllDropdowns();
                      setOpenDepBerthDropdown(!prev);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{t(selectedDepBerth.name)} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>{t("(Max LOA ")}{t(selectedDepBerth.maxLoa)})</span></span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: openDepBerthDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {openDepBerthDropdown && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100, padding: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      {dockPool.map(dock => (
                        <div
                          key={dock.id}
                          onClick={() => {
                            if (dock.status !== 'Occupied') {
                              setSelectedDepBerthId(dock.id);
                              setOpenDepBerthDropdown(false);
                            }
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: dock.id === selectedDepBerthId ? 700 : 500,
                            backgroundColor: dock.id === selectedDepBerthId ? '#f1f5f9' : 'transparent',
                            color: dock.status === 'Occupied' ? '#94a3b8' : '#1e293b',
                            cursor: dock.status === 'Occupied' ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{t(dock.name)} {t(" (Max LOA ")}{t(dock.maxLoa)})</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor(dock.status) }}>{t(dock.status)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure AI Allocation Insights */}
              <div style={{ backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} color="#2563eb" /> {t(" Departure AI Allocation Insights")}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#1e293b', lineHeight: '1.4' }}>
                  <div>
                    <strong style={{ color: '#2563eb' }}>{t("Tug:")}</strong> {t(vesselMetrics.departureAiReasoning.tug)}
                  </div>
                  <div>
                    <strong style={{ color: '#2563eb' }}>{t("Pilot:")}</strong> {t(vesselMetrics.departureAiReasoning.pilot)}
                  </div>
                  <div>
                    <strong style={{ color: '#2563eb' }}>{t("Crane:")}</strong> {t(vesselMetrics.departureAiReasoning.crane)}
                  </div>
                  <div>
                    <strong style={{ color: '#2563eb' }}>{t("Berth:")}</strong> {t(vesselMetrics.departureAiReasoning.berth)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Acceptance Confirmed SLA & Dispatch Timeline View */}
        {accepted && (
          <div style={{ padding: '0 24px 16px 24px' }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} color="#16a34a" />
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', margin: 0 }}>
                    {t("Resource Allocation Confirmed — Live Operational Timeline & Dispatch Initiated")}</h4>
                </div>
                <button
                  onClick={() => setSlaModalData({ craneName: selectedCrane.name, craneCapacity: selectedCrane.capacity, operationType: 'Arrival' })}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
                  }}
                >
                  <Clock size={12} color="#ffffff" />
                  <span>{t("Launch Interactive SLA Timeline Modal")}</span>
                </button>
              </div>

              {/* SLA Operational Schedule Timeline Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '11px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>{t("T-90m · PILOT BOARDING")}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{t(selectedPilot.name)}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{t("Station Alpha Boarding")}</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>{t("T-45m · TUG ESCORT")}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{t(selectedTugs[0]?.name || 'Tug')}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{totalArrivalPull}{t("t Bollard Force")}</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>{t("T-0m · BERTHING")}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{t(selectedBerth.name)}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{t("Berth Clearance Approved")}</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>{t("T+30m · CONTAINER CRANE")}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>{t(selectedCrane.name)}</div>
                  <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>{t("38.0 TEU/h Target Pace")}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 28px', borderTop: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#ffffff', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', width: '100%' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {t(accepted ? 'Close' : 'Cancel')}
          </button>
          <button
            onClick={resetToSuggestion}
            style={{
              height: '44px',
              padding: '0 24px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} />
            <span>{t("Reset")}</span>
          </button>
          <button
            onClick={handleAccept}
            style={{
              flex: 2,
              height: '44px',
              borderRadius: '10px',
              backgroundColor: accepted ? '#059669' : '#2563eb',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Check size={16} />
            <span>{t(accepted ? 'Confirmed — Return to Platform' : 'Accept Allocation')}</span>
          </button>
        </div>

        {slaModalData && (
          <CraneSlaModal
            vesselName={vessel.name}
            craneName={slaModalData.craneName}
            craneCapacity={slaModalData.craneCapacity}
            operationType={slaModalData.operationType}
            onClose={() => setSlaModalData(null)}
          />
        )}
      </div>
    </div>
  );
};
