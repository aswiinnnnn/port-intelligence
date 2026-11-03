import React, { useState } from 'react';
import { FileText, Anchor, Phone, CheckCircle, AlertCircle, Clock, Search, Ship, Send, ArrowRight, Sparkles, Check } from 'lucide-react';
import { listVessels } from './UnifiedDashboard';
import { t } from '../i18n';

const mscBarcelonaVessel = listVessels.find(v => v.name === 'MAERSK DHOFAR');

interface PortCallNotification {
  id: string;
  vesselName: string;
  flag: string;
  imo: string;
  mmsi: string;
  eta: string;
  status: 'Draft' | 'Submitted' | 'Acknowledged';
  cargo: string;
  loa: string;
  draft: string;
  agent: string;
  timestamp: string;
}

interface DocumentFile {
  id: string;
  name: string;
  vessel: string;
  type: string;
  status: 'Pending' | 'Submitted' | 'Approved';
  uploadDate: string;
  size: string;
}

interface BerthReservation {
  id: string;
  vesselName: string;
  berth: string;
  terminal: string;
  arrivalTime: string;
  status: 'Requested' | 'Confirmed' | 'Occupied';
  pilot: string;
  tug: string;
}

interface CommMessage {
  id: string;
  vessel: string;
  flag: string;
  time: string;
  channel: 'RADIO' | 'EMAIL' | 'PCS';
  preview: string;
  detail: string;
  sentiment: 'URGENT' | 'NEUTRAL' | 'INFO';
}

const PORT_CALLS: PortCallNotification[] = [
  { id: 'pcn-msc', vesselName: 'MAERSK DHOFAR', flag: '🇩🇰', imo: 'IMO 9786528', mmsi: '219018452', eta: mscBarcelonaVessel?.eta ?? '26-07-09 16:12', status: 'Submitted', cargo: 'Containers · 14,200 TEU', loa: '366m', draft: '14.2m', agent: 'Dhofar Shipping Agency', timestamp: '26-07-09 15:30' },
  { id: 'pcn-1', vesselName: 'GULF ZENITH', flag: '🇲🇹', imo: 'IMO 9833149', mmsi: '249612000', eta: '26-07-09 14:30', status: 'Submitted', cargo: 'Vehicles & Trucks · 1,200 units', loa: '198m', draft: '6.8m', agent: 'Dhofar Shipping Agency', timestamp: '26-07-08 10:15' },
  { id: 'pcn-2', vesselName: 'SADAH STAR', flag: '🇱🇷', imo: 'IMO 9466130', mmsi: '636018734', eta: '26-07-10 08:00', status: 'Draft', cargo: 'Breakbulk · 5,000 MT steel coils', loa: '176m', draft: '9.4m', agent: 'Dhofar Shipping Agency', timestamp: '26-07-08 09:45' },
  { id: 'pcn-3', vesselName: 'DHOFAR SPIRIT', flag: '🇲🇭', imo: 'IMO 9498717', mmsi: '538007312', eta: '26-07-08 15:00', status: 'Acknowledged', cargo: 'Gypsum · 44,000 MT', loa: '225m', draft: '13.5m', agent: 'Dhofar Shipping Agency', timestamp: '26-07-07 16:20' },
  { id: 'pcn-4', vesselName: 'AL MIRBAT', flag: '🇴🇲', imo: 'IMO 9437024', mmsi: '461000087', eta: '26-07-11 06:30', status: 'Draft', cargo: 'Crude Oil · 68,000 MT', loa: '244m', draft: '15.1m', agent: 'Dhofar Shipping Agency', timestamp: '26-07-08 08:05' },
  { id: 'pcn-5', vesselName: 'RAYSUT TRADER', flag: '🇮🇳', imo: 'IMO 9374167', mmsi: '419001563', eta: '26-07-12 11:15', status: 'Submitted', cargo: 'General Cargo · 3,100 MT', loa: '142m', draft: '7.2m', agent: 'Dhofar Shipping Agency', timestamp: '26-07-08 07:50' }
];

const DOCUMENTS: DocumentFile[] = [
  { id: 'doc-msc-1', name: 'IMO FAL Form 1 — General Declaration', vessel: 'MAERSK DHOFAR', type: 'PDF', status: 'Approved', uploadDate: '09 Jul', size: '245 KB' },
  { id: 'doc-msc-2', name: 'Customs Pre-Clearance & Dangerous Goods', vessel: 'MAERSK DHOFAR', type: 'PDF', status: 'Approved', uploadDate: '09 Jul', size: '310 KB' },
  { id: 'doc-1', name: 'IMO FAL Form 1 — General Declaration', vessel: 'GULF ZENITH', type: 'PDF', status: 'Approved', uploadDate: '08 Jul', size: '212 KB' },
  { id: 'doc-2', name: 'IMO FAL Form 6 — Dangerous Goods', vessel: 'GULF ZENITH', type: 'PDF', status: 'Submitted', uploadDate: '08 Jul', size: '184 KB' },
  { id: 'doc-3', name: 'Maritime Health Declaration', vessel: 'GULF ZENITH', type: 'PDF', status: 'Pending', uploadDate: '08 Jul', size: '96 KB' },
  { id: 'doc-4', name: 'Cargo Manifest', vessel: 'SADAH STAR', type: 'XLSX', status: 'Submitted', uploadDate: '08 Jul', size: '340 KB' },
  { id: 'doc-5', name: 'Crew List & Passenger List', vessel: 'DHOFAR SPIRIT', type: 'PDF', status: 'Approved', uploadDate: '07 Jul', size: '128 KB' },
  { id: 'doc-6', name: 'Ship Security Certificate (ISSC)', vessel: 'AL MIRBAT', type: 'PDF', status: 'Pending', uploadDate: '08 Jul', size: '154 KB' }
];

const BERTHS: BerthReservation[] = [
  { id: 'br-msc', vesselName: 'MAERSK DHOFAR', berth: 'SCT-B04', terminal: 'Salalah Container Terminal', arrivalTime: mscBarcelonaVessel?.eta ?? '26-07-09 16:12', status: 'Confirmed', pilot: 'Capt. Huda Al Lawati', tug: 'SPS Marine Tugs (4 Units)' },
  { id: 'br-1', vesselName: 'GULF ZENITH', berth: 'GCT-B31', terminal: 'RoRo Terminal', arrivalTime: '26-07-09 14:30', status: 'Confirmed', pilot: 'Capt. Al Rawahi', tug: 'SPS Tug MIRBAT' },
  { id: 'br-2', vesselName: 'SADAH STAR', berth: 'GCT-B27', terminal: 'GCT South Quay', arrivalTime: '26-07-10 08:00', status: 'Requested', pilot: 'Unassigned', tug: 'Unassigned' },
  { id: 'br-3', vesselName: 'DHOFAR SPIRIT', berth: 'GCT-B24', terminal: 'General Cargo Terminal', arrivalTime: '26-07-08 15:00', status: 'Occupied', pilot: 'Capt. Al Saadi', tug: 'SPS Tug RAYSUT' },
  { id: 'br-4', vesselName: 'AL MIRBAT', berth: 'LBT-J2', terminal: 'Liquid Bulk Terminal', arrivalTime: '26-07-11 06:30', status: 'Requested', pilot: 'Unassigned', tug: 'Unassigned' }
];

const MESSAGES: CommMessage[] = [
  { id: 'msg-1', vessel: 'GULF ZENITH', flag: '🇲🇹', time: '14:30', channel: 'RADIO', sentiment: 'URGENT', preview: 'Requesting berth allocation confirmation before ETA', detail: 'Dear port control, GULF ZENITH needs berth change. Current berth GCT-B31 unavailable — requesting confirmation of alternate assignment before arrival at 14:30.' },
  { id: 'msg-2', vessel: 'SADAH STAR', flag: '🇱🇷', time: '09:45', channel: 'EMAIL', sentiment: 'INFO', preview: 'Documentation package submitted for review', detail: 'Cargo manifest and FAL forms for SADAH STAR have been uploaded to Oman PCS. Awaiting customs pre-clearance ahead of 10 Jul arrival.' },
  { id: 'msg-3', vessel: 'DHOFAR SPIRIT', flag: '🇲🇭', time: '16:20', channel: 'PCS', sentiment: 'NEUTRAL', preview: 'Berth confirmed at GCT Berth 24', detail: 'Oman PCS system update: DHOFAR SPIRIT berth reservation confirmed at GCT-B24. Pilot Capt. Al Saadi and Tug MIRBAT assigned for berthing operation.' },
  { id: 'msg-4', vessel: 'AL MIRBAT', flag: '🇴🇲', time: '08:05', channel: 'RADIO', sentiment: 'URGENT', preview: 'ISSC certificate pending upload — customs hold risk', detail: 'Reminder: Ship Security Certificate for AL MIRBAT is still pending. Customs clearance may be delayed if not submitted before 10 Jul 18:00.' },
  { id: 'msg-5', vessel: 'RAYSUT TRADER', flag: '🇮🇳', time: '07:50', channel: 'EMAIL', sentiment: 'INFO', preview: 'Port call notification acknowledged by port authority', detail: 'Port authority has acknowledged the port call notification for RAYSUT TRADER. Standard pre-arrival checklist applies, no exceptions flagged.' }
];

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.5)',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.6px'
};

const statusColor = (status: string) => {
  if (status === 'Approved' || status === 'Submitted' || status === 'Confirmed' || status === 'Acknowledged') return '#10b981';
  if (status === 'Pending' || status === 'Requested' || status === 'Draft') return '#f59e0b';
  if (status === 'Occupied') return '#3b82f6';
  return '#ef4444';
};

const statusBg = (status: string) => `${statusColor(status)}15`;

const statusIcon = (status: string) => {
  if (status === 'Approved' || status === 'Confirmed' || status === 'Submitted' || status === 'Acknowledged') return <CheckCircle size={12} />;
  if (status === 'Pending' || status === 'Requested' || status === 'Draft') return <Clock size={12} />;
  return <AlertCircle size={12} />;
};

interface ShipAgentProps {
  activeTab: 'notifications' | 'documents' | 'berth' | 'communications' | 'departure';
  isMscBarcelonaAccepted?: boolean;
  onAcceptMscBarcelona?: () => void;
}

export const ShipAgent: React.FC<ShipAgentProps> = ({ activeTab, isMscBarcelonaAccepted = false, onAcceptMscBarcelona }) => {
  const [notifSearch, setNotifSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string>(MESSAGES[0].id);
  const [messageDraft, setMessageDraft] = useState('');

  const [notifications, setNotifications] = useState<PortCallNotification[]>(PORT_CALLS);
  const [documents, setDocuments] = useState<DocumentFile[]>(DOCUMENTS);
  const [berths, setBerths] = useState<BerthReservation[]>(() =>
    BERTHS.map(b => b.vesselName === 'MAERSK DHOFAR' ? { ...b, status: isMscBarcelonaAccepted ? 'Confirmed' : 'Requested' } : b)
  );
  const [allocationAccepted, setAllocationAccepted] = useState(false);

  // MAERSK DHOFAR's berth is AI pre-assigned but needs the ship agent's explicit
  // accept — either here on the Berth Reservations row, or via the global toaster's
  // "Accept Assignment" button, which flips isMscBarcelonaAccepted for every role.
  React.useEffect(() => {
    if (isMscBarcelonaAccepted) {
      setBerths(prev => prev.map(b => b.vesselName === 'MAERSK DHOFAR' ? { ...b, status: 'Confirmed' } : b));
    }
  }, [isMscBarcelonaAccepted]);

  const handleAcceptMscBarcelonaBerth = () => {
    setBerths(prev => prev.map(b => b.vesselName === 'MAERSK DHOFAR' ? { ...b, status: 'Confirmed' } : b));
    onAcceptMscBarcelona?.();
  };

  // Departure Confirmation is now per-vessel: only vessels with a confirmed
  // berth (pilot + tug already assigned) are eligible to check off for departure.
  const departureEligible = berths.filter(b => b.pilot !== 'Unassigned' && b.tug !== 'Unassigned');
  const [selectedDepartureVessel, setSelectedDepartureVessel] = useState<string>(departureEligible[0]?.vesselName ?? berths[0].vesselName);
  const selectedBerth = berths.find(b => b.vesselName === selectedDepartureVessel) ?? berths[0];

  type ChecklistKey = 'pilot' | 'tug' | 'cargo' | 'personnel' | 'customs';
  const [checklistByVessel, setChecklistByVessel] = useState<Record<string, Record<ChecklistKey, boolean>>>(
    Object.fromEntries(berths.map(b => [b.vesselName, { pilot: true, tug: true, cargo: false, personnel: false, customs: true }]))
  );
  const checklist = checklistByVessel[selectedDepartureVessel] ?? { pilot: false, tug: false, cargo: false, personnel: false, customs: false };
  const setChecklist = (updater: (prev: Record<ChecklistKey, boolean>) => Record<ChecklistKey, boolean>) => {
    setChecklistByVessel(prev => ({ ...prev, [selectedDepartureVessel]: updater(prev[selectedDepartureVessel] ?? checklist) }));
  };

  const selectedMessage = MESSAGES.find(m => m.id === selectedMessageId) ?? MESSAGES[0];

  const filteredNotifications = notifications.filter(pcn =>
    t(pcn.vesselName).toLowerCase().includes(notifSearch.toLowerCase())
  );
  const filteredDocuments = documents.filter(doc =>
    t(doc.name).toLowerCase().includes(docSearch.toLowerCase()) || t(doc.vessel).toLowerCase().includes(docSearch.toLowerCase())
  );

  const submittedCount = notifications.filter(p => p.status !== 'Draft').length;
  const draftCount = notifications.filter(p => p.status === 'Draft').length;
  const upcomingArrivals = notifications.filter(p => p.status !== 'Draft');
  const approvedDocs = documents.filter(d => d.status === 'Approved').length;
  const pendingDocs = documents.filter(d => d.status === 'Pending').length;
  const vesselsCovered = new Set(documents.map(d => d.vessel)).size;
  const confirmedBerths = berths.filter(b => b.status !== 'Requested').length;
  const pilotsAssigned = berths.filter(b => b.pilot !== 'Unassigned').length;
  const tugsBooked = berths.filter(b => b.tug !== 'Unassigned').length;

  const handleSubmitNotification = (id: string) => {
    setNotifications(prev => prev.map(pcn => pcn.id === id ? { ...pcn, status: 'Submitted' } : pcn));
  };

  const handleNewNotification = () => {
    const draft: PortCallNotification = {
      id: `pcn-${Date.now()}`,
      vesselName: 'NEW VESSEL CALL',
      flag: '🏳️',
      imo: 'IMO Pending',
      mmsi: 'Pending',
      eta: 'TBD',
      status: 'Draft',
      cargo: 'Pending manifest upload',
      loa: '—',
      draft: '—',
      agent: 'Dhofar Shipping Agency',
      timestamp: new Date().toISOString().slice(0, 10)
    };
    setNotifications(prev => [draft, ...prev]);
  };

  const handleUploadDocument = () => {
    const vessel = notifications[0]?.vesselName ?? 'GULF ZENITH';
    const doc: DocumentFile = {
      id: `doc-${Date.now()}`,
      name: 'New Document — Pending Classification',
      vessel,
      type: 'PDF',
      status: 'Pending',
      uploadDate: new Date().toISOString().slice(0, 10),
      size: '—'
    };
    setDocuments(prev => [doc, ...prev]);
  };

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSendReply = () => {
    if (!messageDraft.trim()) return;
    setToastMsg(`Reply sent to ${selectedMessage.vessel}: "${messageDraft.trim()}"`);
    setMessageDraft('');
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleDocAction = (id: string, action: 'View' | 'Edit') => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    if (action === 'Edit') {
      setDocuments(prev => prev.map(d => d.id === id && d.status === 'Pending' ? { ...d, status: 'Submitted' } : d));
    } else {
      setToastMsg(`${doc.name} · Vessel: ${doc.vessel} · Status: ${doc.status}`);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  const handleAcceptAllocation = () => {
    setBerths(prev => prev.map(b => b.vesselName === 'SADAH STAR' ? { ...b, pilot: 'Capt. Chen', tug: 'SPS Tug TAQAH', status: 'Confirmed' } : b));
    setAllocationAccepted(true);
  };

  const checklistItems: { key: ChecklistKey; label: string }[] = [
    { key: 'pilot', label: 'Pilot briefing complete' },
    { key: 'tug', label: 'Tug lines attached' },
    { key: 'cargo', label: 'Cargo secured' },
    { key: 'personnel', label: 'All personnel aboard' },
    { key: 'customs', label: 'Customs clearance received' }
  ];
  const checklistDone = Object.values(checklist).filter(Boolean).length;
  const departureStepIndex = Math.min(4, Math.round((checklistDone / checklistItems.length) * 4));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minWidth: 0, height: '100%', gap: '16px', overflow: 'auto', paddingRight: '8px' }}>

      {/* ============ PORT CALL NOTIFICATIONS ============ */}
      {activeTab === 'notifications' && (
        <>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Submitted / Acknowledged")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{submittedCount}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("On track for port authority review")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Drafts Pending")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{draftCount}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>{t("Needs submission before ETA")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Submitted / Acknowledged Vessels")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{upcomingArrivals.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t(upcomingArrivals.map(p => p.vesselName).join(', ') || 'None yet')}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Total Port Calls")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{notifications.length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("Tracked this week")}</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ ...cardStyle, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px' }}>
            <Search size={15} color="#64748b" />
            <input
              value={notifSearch}
              onChange={e => setNotifSearch(e.target.value)}
              placeholder={t("Search vessel or IMO...")}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '12px', color: '#1e293b', flex: 1 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("Port Call Notifications")}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotifications.map(pcn => (
              <div key={pcn.id} style={{ ...cardStyle, padding: '16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{t(pcn.flag)}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{t(pcn.vesselName)}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{t(pcn.imo)} {t(" · MMSI ")}{t(pcn.mmsi)} {t(" · Submitted ")}{t(pcn.timestamp)}</div>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: statusColor(pcn.status), backgroundColor: statusBg(pcn.status), padding: '3px 8px', borderRadius: '4px', marginLeft: 'auto' }}>
                      {statusIcon(pcn.status)}
                      {t(pcn.status === 'Draft' ? 'Draft status' : pcn.status)}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("ETA")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{t(pcn.eta)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("LOA / Draft")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{t(pcn.loa)} / {t(pcn.draft)}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Cargo Manifest")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{t(pcn.cargo)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Agent of Record")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '3px' }}>{t(pcn.agent)}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => pcn.status === 'Draft' && handleSubmitNotification(pcn.id)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(37,99,235,0.2)', backgroundColor: pcn.status === 'Draft' ? '#2563eb' : 'transparent', color: pcn.status === 'Draft' ? 'white' : '#2563eb', fontWeight: 600, fontSize: '11px', cursor: pcn.status === 'Draft' ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                >
                  {t(pcn.status === 'Draft' ? 'Submit Notification' : 'View Details')}
                </button>
              </div>
            ))}
            <button
              onClick={handleNewNotification}
              style={{ padding: '12px', borderRadius: '8px', border: '2px dashed rgba(37,99,235,0.3)', backgroundColor: 'transparent', color: '#2563eb', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              {t("+ New Port Call Notification (ETA, Vessel Particulars, Cargo Manifest)")}</button>
          </div>
        </>
      )}

      {/* ============ PRE-ARRIVAL DOCUMENTATION ============ */}
      {activeTab === 'documents' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Approved")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{approvedDocs}/{documents.length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("Cleared by port authority")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Pending Review")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{pendingDocs}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>{t("Awaiting upload or approval")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Total Documents")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{documents.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Across all active port calls")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Vessels Covered")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{vesselsCovered}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Active documentation sets")}</div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px' }}>
            <Search size={15} color="#64748b" />
            <input
              value={docSearch}
              onChange={e => setDocSearch(e.target.value)}
              placeholder={t("Search documents or vessel...")}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '12px', color: '#1e293b', flex: 1 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("Pre-Arrival Documentation")}</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {filteredDocuments.map(doc => (
              <div key={doc.id} style={{ ...cardStyle, padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: 0, wordBreak: 'break-word' }}>{t(doc.name)}</h4>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{t(doc.vessel)} · {t(doc.type)} · {t(doc.size)} · {t(doc.uploadDate)}</div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: statusColor(doc.status), backgroundColor: statusBg(doc.status), padding: '3px 6px', borderRadius: '3px' }}>
                    {statusIcon(doc.status)}
                    {t(doc.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                  <button onClick={() => handleDocAction(doc.id, 'View')} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>{t("View")}</button>
                  <button
                    onClick={() => handleDocAction(doc.id, 'Edit')}
                    disabled={doc.status !== 'Pending'}
                    style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: doc.status === 'Pending' ? '#2563eb' : 'white', color: doc.status === 'Pending' ? 'white' : '#94a3b8', fontWeight: 600, cursor: doc.status === 'Pending' ? 'pointer' : 'default' }}
                  >
                    {t(doc.status === 'Pending' ? 'Submit' : 'Edit')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleUploadDocument} style={{ padding: '12px', borderRadius: '8px', border: '2px dashed rgba(37,99,235,0.3)', backgroundColor: 'transparent', color: '#2563eb', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            {t("+ Upload New Document (FAL Forms, DG Declaration, Health/Maritime Declaration)")}</button>
        </>
      )}

      {/* ============ BERTH RESERVATIONS & PILOTAGE ============ */}
      {activeTab === 'berth' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Berths Confirmed")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{confirmedBerths}/{berths.length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("Ready for berthing ops")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Pilots Assigned")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{pilotsAssigned}/{berths.length}</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>{berths.length - pilotsAssigned} {t(" requests awaiting roster")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Tugs Booked")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{tugsBooked}/{berths.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("SPS Marine fleet coordination")}</div>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <div style={eyebrowStyle}>{t("Occupied Berths")}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>{berths.filter(b => b.status === 'Occupied').length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{t("Currently in active use")}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Anchor size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("Berth Reservations & Pilotage")}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {berths.map(br => (
              <div key={br.id} style={{ ...cardStyle, padding: '16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
                  <div>
                    <div style={eyebrowStyle}>{t("Vessel")}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{t(br.vesselName)}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>{t("Berth / Terminal")}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginTop: '4px' }}>{t(br.berth)}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{t(br.terminal)}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>{t("Arrival")}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{t(br.arrivalTime)}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>{t("Pilot")}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: br.pilot === 'Unassigned' ? '#94a3b8' : '#1e293b', marginTop: '4px' }}>{t(br.pilot)}</div>
                  </div>
                  <div>
                    <div style={eyebrowStyle}>{t("Tug")}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: br.tug === 'Unassigned' ? '#94a3b8' : '#1e293b', marginTop: '4px' }}>{t(br.tug)}</div>
                  </div>
                </div>
                {br.vesselName === 'MAERSK DHOFAR' && br.status !== 'Confirmed' ? (
                  <button
                    onClick={handleAcceptMscBarcelonaBerth}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'white', backgroundColor: '#2563eb', border: 'none', padding: '8px 14px', borderRadius: '6px', whiteSpace: 'nowrap', cursor: 'pointer' }}
                  >
                    <Check size={13} /> {t(" Accept")}</button>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: statusColor(br.status), backgroundColor: statusBg(br.status), padding: '6px 12px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    {statusIcon(br.status)}
                    {t(br.status)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {!allocationAccepted && berths.some(b => b.vesselName === 'SADAH STAR' && b.pilot === 'Unassigned') && (
            <div style={{ ...cardStyle, padding: '16px', backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} /> {t(" AI Suggested Allocation — SADAH STAR")}</h4>
              <div style={{ fontSize: '12px', color: '#1e293b', lineHeight: '1.7' }}>
                <div>{t("Suggested pilot: ")}<strong>{t("Capt. Chen")}</strong> {t(" (Standard Certified, Available)")}</div>
                <div>{t("Suggested tug: ")}<strong>{t("SPS Tug TAQAH")}</strong> {t(" (Available, Tug Base)")}</div>
              </div>
              <button
                onClick={handleAcceptAllocation}
                style={{ marginTop: '10px', padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
              >
                {t("Accept Suggested Allocation")}</button>
            </div>
          )}
          {allocationAccepted && (
            <div style={{ ...cardStyle, padding: '16px', backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={14} color="#10b981" />
              <span style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>{t("Allocation confirmed — Capt. Chen and SPS Tug TAQAH assigned to SADAH STAR.")}</span>
            </div>
          )}
        </>
      )}

      {/* ============ VESSEL COMMUNICATIONS ============ */}
      {activeTab === 'communications' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("Vessel Communications")}</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 700, color: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', padding: '3px 8px', borderRadius: '10px', marginLeft: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} /> {MESSAGES.length} {t(" active threads")}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.3fr', gap: '16px', flex: 1, minHeight: '420px' }}>
            {/* Live feed */}
            <div style={{ ...cardStyle, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {MESSAGES.map(msg => {
                const isSelected = msg.id === selectedMessageId;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(37,99,235,0.08)' : 'rgba(0,0,0,0.02)',
                      border: isSelected ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}>{t(msg.flag)}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{t(msg.vessel)}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{t(msg.time)}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t(msg.preview)}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#475569', backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '3px' }}>{t(msg.channel)}</span>
                      {msg.sentiment === 'URGENT' && (
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', padding: '2px 6px', borderRadius: '3px' }}>{t("URGENT")}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail pane */}
            <div style={{ ...cardStyle, padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{t(selectedMessage.flag)}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{t(selectedMessage.vessel)}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{t(selectedMessage.channel)} · {t(selectedMessage.time)}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 700, color: selectedMessage.sentiment === 'URGENT' ? '#ef4444' : '#2563eb', backgroundColor: selectedMessage.sentiment === 'URGENT' ? 'rgba(239,68,68,0.08)' : 'rgba(37,99,235,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
                  {t(selectedMessage.sentiment)}
                </span>
              </div>

              <div>
                <div style={eyebrowStyle}>{t("Message")}</div>
                <div style={{ fontSize: '12px', color: '#1e293b', marginTop: '6px', lineHeight: '1.6', backgroundColor: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px' }}>
                  {t(selectedMessage.detail)}
                </div>
              </div>

              <div style={{ ...cardStyle, backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', padding: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={12} /> {t(" Suggested Reply")}</div>
                <div style={{ fontSize: '11px', color: '#1e293b', marginTop: '6px', lineHeight: '1.5' }}>
                  {t("\"Confirmed, ")}{t(selectedMessage.vessel)} {t(" — awaiting final approval, will update Oman PCS within the hour.\"")}</div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea
                  value={messageDraft}
                  onChange={e => setMessageDraft(e.target.value)}
                  placeholder={t(`Reply to ${selectedMessage.vessel}...`)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '11px', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px' }}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!messageDraft.trim()}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: messageDraft.trim() ? '#2563eb' : 'rgba(0,0,0,0.1)', color: messageDraft.trim() ? 'white' : '#94a3b8', fontWeight: 600, fontSize: '11px', cursor: messageDraft.trim() ? 'pointer' : 'default' }}
                >
                  <Send size={13} /> {t(" Send Reply")}</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============ DEPARTURE CONFIRMATION ============ */}
      {activeTab === 'departure' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Ship size={16} color="#1e293b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t("Departure Confirmation")}</h3>
            <select
              value={selectedDepartureVessel}
              onChange={e => setSelectedDepartureVessel(e.target.value)}
              style={{ marginLeft: '8px', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 600, color: '#1e293b', backgroundColor: 'white' }}
            >
              {berths.map(b => (
                <option key={b.id} value={b.vesselName}>{t(b.vesselName)}</option>
              ))}
            </select>
          </div>

          {/* Stepper */}
          <div style={{ ...cardStyle, padding: '18px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {['Berthed', 'Cargo Ops', 'Documentation', 'Pilot & Tug', 'Departure'].map((step, i) => {
                const doneUpTo = departureStepIndex;
                const done = i < doneUpTo;
                const current = i === doneUpTo;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: done ? '#10b981' : current ? '#2563eb' : 'rgba(0,0,0,0.06)',
                        color: done || current ? 'white' : '#94a3b8',
                        fontSize: '11px', fontWeight: 700
                      }}>
                        {t(done ? '✓' : i + 1)}
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 600, color: done || current ? '#1e293b' : '#94a3b8', textAlign: 'center', maxWidth: '70px' }}>{t(step)}</span>
                    </div>
                    {i < 4 && <div style={{ flex: 1, height: '2px', backgroundColor: i < doneUpTo ? '#10b981' : 'rgba(0,0,0,0.08)', margin: '0 4px', marginBottom: '18px' }} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>{t("Pilot Confirmation")}</h4>
              {selectedBerth.pilot !== 'Unassigned' ? (
                <div style={{ padding: '10px', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#047857' }}>✓ {t(selectedBerth.pilot)}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{t("Confirmed for ")}{t(selectedBerth.arrivalTime)}</div>
                </div>
              ) : (
                <div style={{ padding: '10px', backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#b45309' }}>{t("⏳ Pilot not yet assigned")}</div>
                </div>
              )}
              <button
                onClick={() => {
                  setToastMsg(`Pilot change requested for ${selectedDepartureVessel}.`);
                  setTimeout(() => setToastMsg(null), 4000);
                }}
                style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
              >
                {t("Request Pilot Change")}</button>
            </div>
            <div style={{ ...cardStyle, padding: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>{t("Tug Confirmation")}</h4>
              {selectedBerth.tug !== 'Unassigned' ? (
                <div style={{ padding: '10px', backgroundColor: 'rgba(16,185,129,0.08)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#047857' }}>✓ {t(selectedBerth.tug)}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{t(selectedBerth.berth)} · {t(selectedBerth.terminal)}</div>
                </div>
              ) : (
                <div style={{ padding: '10px', backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#b45309' }}>{t("⏳ Tug not yet assigned")}</div>
                </div>
              )}
              <button
                onClick={() => {
                  setToastMsg(`Tug change requested for ${selectedDepartureVessel}.`);
                  setTimeout(() => setToastMsg(null), 4000);
                }}
                style={{ marginTop: '10px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}
              >
                {t("Request Tug Change")}</button>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '16px', backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#047857', margin: 0 }}>{t("Departure Checklist — ")}{t(selectedDepartureVessel)}</h4>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>{checklistDone}/{checklistItems.length} {t(" complete")}</span>
            </div>
            <div style={{ height: '5px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ width: `${(checklistDone / checklistItems.length) * 100}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.3s ease' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '11px' }}>
              {checklistItems.map(item => (
                <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#1e293b' }}>{t(item.label)}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={checklistDone < checklistItems.length}
            onClick={() => {
              setToastMsg(`Departure confirmed for ${selectedDepartureVessel}. Port authority notified.`);
              setTimeout(() => setToastMsg(null), 4000);
            }}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: checklistDone === checklistItems.length ? '#2563eb' : 'rgba(0,0,0,0.1)',
              color: checklistDone === checklistItems.length ? 'white' : '#94a3b8',
              fontWeight: 600,
              fontSize: '13px',
              cursor: checklistDone === checklistItems.length ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {t("Confirm Departure & Notify Port Authority ")}<ArrowRight size={14} />
          </button>
        </>
      )}

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
