import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { addBaseTiles } from '../lib/mapTiles';
import { X, Clock, TrendingUp, History, Gauge, MapPin, Sparkles, ChevronDown } from 'lucide-react';
import { t } from '../i18n';

export interface ResourceDetailData {
  id: string;
  name: string;
  type: 'tug' | 'pilot' | 'crane' | 'berth';
  status: string;
  operator: string;
  location: string;
  utilization?: number;
  currentOperation?: string;
  availableTime?: string;
  capacity?: string;
  nextVessel?: string;
  depth?: string;
  length?: string;
  image?: string;
  lat?: number;
  lng?: number;
}

interface ActivityEntry {
  date: string;
  vessel: string;
  operation: string;
  duration: string;
  outcome: 'Completed' | 'On Time' | 'Delayed';
}

const getStatusColor = (status: string) => {
  if (status === 'Available') return '#10b981';
  if (status === 'Assigned' || status === 'Occupied') return '#3b82f6';
  if (status === 'Maintenance') return '#ef4444';
  return '#64748b';
};

// Deterministic mock-data generator so each resource always shows the same
// "history" between opens, without needing a backend.
const seedFromName = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const VESSEL_POOL = ['MAERSK DHOFAR', 'ASYAD HORIZON', 'DHOFAR SPIRIT', 'GULF ZENITH', 'AL MIRBAT', 'ARABIAN SEA EXPRESS', 'RAYSUT TRADER', 'SADAH STAR'];
const OPERATIONS_BY_TYPE: Record<ResourceDetailData['type'], string[]> = {
  tug: ['Berthing assist', 'Undocking assist', 'Escort to anchorage', 'Emergency standby'],
  pilot: ['Inbound pilotage', 'Outbound pilotage', 'Shifting operation', 'Anchorage transfer'],
  crane: ['Container loading', 'Container discharge', 'Breakbulk handling', 'Bunkering support'],
  berth: ['Vessel berthed', 'Cargo operations', 'Bunkering', 'Crew change']
};

const generateHistory = (resource: ResourceDetailData): ActivityEntry[] => {
  const seed = seedFromName(resource.name);
  const ops = OPERATIONS_BY_TYPE[resource.type];
  const outcomes: ActivityEntry['outcome'][] = ['Completed', 'On Time', 'Delayed'];
  const entries: ActivityEntry[] = [];

  for (let i = 0; i < 6; i++) {
    const s = seed + i * 977;
    const vessel = VESSEL_POOL[(s + i) % VESSEL_POOL.length];
    const operation = ops[(s >> 2) % ops.length];
    const outcome = outcomes[(s >> 4) % (i === 0 ? 2 : outcomes.length)]; // most recent rarely "Delayed" for variety
    const daysAgo = i === 0 ? 0 : i + Math.floor((s % 5));
    const hours = (s % 12) + 1;
    const mins = (s % 60).toString().padStart(2, '0');
    entries.push({
      date: daysAgo === 0 ? `Today, ${hours}:${mins}` : `${daysAgo}d ago, ${hours}:${mins}`,
      vessel,
      operation,
      duration: `${1 + (s % 4)}h ${(s * 7) % 60}m`,
      outcome
    });
  }
  return entries;
};

const generateUtilizationTrend = (resource: ResourceDetailData): number[] => {
  const seed = seedFromName(resource.name);
  const base = resource.utilization ?? 40;
  return Array.from({ length: 7 }, (_, i) => {
    const noise = ((seed >> i) % 25) - 12;
    return Math.max(5, Math.min(100, base + noise));
  });
};

const outcomeColor = (outcome: ActivityEntry['outcome']) => {
  if (outcome === 'Delayed') return '#ef4444';
  if (outcome === 'On Time') return '#10b981';
  return '#3b82f6';
};

export const MiniPositionMap: React.FC<{ resource: ResourceDetailData }> = ({ resource }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || resource.lat === undefined || resource.lng === undefined) return;

    const map = L.map(containerRef.current, {
      center: [resource.lat, resource.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false
    });
    mapRef.current = map;

    addBaseTiles(map, { opacity: 0.75 });

    const color = getStatusColor(resource.status);
    const html = `
      <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px;">
        <div style="
          width: 32px; height: 32px; background-color: ${color};
          border: 3px solid white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        "></div>
      </div>
    `;
    L.marker([resource.lat, resource.lng], {
      icon: L.divIcon({ html, className: '', iconSize: [32, 32], iconAnchor: [16, 16] })
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [resource.id, resource.lat, resource.lng, resource.status]);

  if (resource.lat === undefined || resource.lng === undefined) return null;

  return (
    <div>
      <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={14} /> {t(" Current Position")}</h3>
      <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div ref={containerRef} className="custom-map" style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '4px', padding: '4px 8px', fontSize: '9px', fontWeight: 700, color: '#1e293b', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t(resource.location)}>
          {t(resource.location)}
        </div>
      </div>
    </div>
  );
};

interface ResourceDetailModalProps {
  resource: ResourceDetailData;
  onClose: () => void;
  onAssign?: (resourceId: string, type: 'tug' | 'pilot' | 'crane' | 'berth', vesselName: string) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, onClose, onAssign }) => {
  const [selectedVessel, setSelectedVessel] = useState<string>('');
  const [openVesselDropdown, setOpenVesselDropdown] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  const handleConfirmAssignment = () => {
    if (onAssign && selectedVessel) {
      onAssign(resource.id, resource.type, selectedVessel);
      setAssignSuccess(true);
      setTimeout(() => setAssignSuccess(false), 3000);
    }
  };
  const statusColor = getStatusColor(resource.status);
  const history = generateHistory(resource);
  const trend = generateUtilizationTrend(resource);
  const avgTrend = Math.round(trend.reduce((a, b) => a + b, 0) / trend.length);
  const completedCount = history.filter(h => h.outcome !== 'Delayed').length;
  const reliabilityPct = Math.round((completedCount / history.length) * 100);

  const seed = seedFromName(resource.name);
  const totalOpsThisMonth = 8 + (seed % 20);
  const avgDurationMins = 45 + (seed % 90);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50000,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#EAF1F3',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '760px',
          width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with image at top */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 24px 18px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.04)' }}
            title={t("Close")}
          >
            <X size={20} color="#475569" />
          </button>

          {/* Top Resource Image Header Banner */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginBottom: '12px' }}>
            {resource.image ? (
              <div style={{ width: '100%', maxHeight: '180px', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', marginBottom: '16px' }}>
                <img src={resource.image} alt={t(resource.name)} style={{ width: '100%', height: '100%', objectFit: resource.type === 'pilot' ? 'cover' : 'contain' }} />
              </div>
            ) : (
              <div style={{ width: '72px', height: '72px', borderRadius: '16px', backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Gauge size={32} color={statusColor} />
              </div>
            )}
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0, textAlign: 'center' }}>{t(resource.name)}</h2>
            <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'capitalize', marginTop: '2px', textAlign: 'center' }}>{t(resource.type)} · {t(resource.operator)}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Current status row (Unified Status, Location, and Current Operation) */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '100px', backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Status")}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: statusColor, marginTop: '4px' }}>{t(resource.status)}</div>
            </div>
            {t(resource.location && (
              <div style={{ flex: 1, minWidth: '120px', backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Location")}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{t(resource.location)}</div>
              </div>
            ))}
            {t(resource.currentOperation && (
              <div style={{ flex: 2, minWidth: '220px', backgroundColor: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.15)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>{t("Current Operation")}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginTop: '4px' }}>📋 {t(resource.currentOperation)}</div>
              </div>
            ))}
          </div>

          {/* Secondary Details Row (For Berths / Capacities) */}
          {t((resource.length || resource.depth || resource.capacity) && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${[resource.length, resource.depth, resource.capacity].filter(Boolean).length}, 1fr)`, gap: '12px' }}>
              {t(resource.length && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Max Length")}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{t(resource.length)}</div>
                </div>
              ))}
              {t(resource.depth && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Depth")}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{t(resource.depth)}</div>
                </div>
              ))}
              {t(resource.capacity && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Cranes")}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{t(resource.capacity)}</div>
                </div>
              ))}
            </div>
          ))}

          {t(resource.availableTime && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color="#ef4444" />
              <div style={{ fontSize: '12px', color: '#1e293b' }}>{t("Back in service at ")}<strong>{t(resource.availableTime)}</strong></div>
            </div>
          ))}

          {/* Assign / Reassign Control Box */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#2563eb" /> {t(" Assign / Reassign Resource")}</h3>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Shadcn Custom Select Dropdown for Assign / Reassign */}
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <button
                  type="button"
                  onClick={() => setOpenVesselDropdown(!openVesselDropdown)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: selectedVessel ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <span>{t(selectedVessel || 'Select Vessel to Assign...')}</span>
                  <ChevronDown size={14} color="#64748b" style={{ transform: openVesselDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {openVesselDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 200,
                    padding: '4px',
                    maxHeight: '180px',
                    overflowY: 'auto'
                  }}>
                    {VESSEL_POOL.map(v => (
                      <div
                        key={v}
                        onClick={() => {
                          setSelectedVessel(v);
                          setOpenVesselDropdown(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: v === selectedVessel ? 700 : 500,
                          backgroundColor: v === selectedVessel ? '#f1f5f9' : 'transparent',
                          color: '#1e293b',
                          cursor: 'pointer'
                        }}
                      >
                        {t(v)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleConfirmAssignment}
                disabled={!selectedVessel}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: selectedVessel ? 'pointer' : 'not-allowed',
                  opacity: selectedVessel ? 1 : 0.65,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => selectedVessel && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => selectedVessel && (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                {t("Confirm Allocation")}</button>
            </div>

            {assignSuccess && (
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t("✓ Resource successfully allocated to ")}{t(selectedVessel)}!
              </div>
            )}
          </div>

          {/* Analytics */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={14} /> {t(" Analytics")}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: resource.type === 'pilot' ? '1fr 1fr' : '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              {resource.type !== 'pilot' && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Avg. Utilization (7d)")}</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{avgTrend}%</div>
                </div>
              )}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Operations This Month")}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{totalOpsThisMonth}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t("Reliability Score")}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: reliabilityPct >= 80 ? '#10b981' : '#f59e0b', marginTop: '4px' }}>{reliabilityPct}%</div>
              </div>
            </div>

            {/* 7-day utilization sparkline bars */}
            {resource.type !== 'pilot' && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>{t("Utilization Trend (Last 7 Days)")}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '70px' }}>
                  {trend.map((val, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ width: '100%', maxWidth: '22px', height: `${Math.max(6, val * 0.55)}px`, backgroundColor: val >= 70 ? '#2563eb' : val >= 40 ? '#3b82f6' : '#93c5fd', borderRadius: '3px 3px 0 0' }} title={t(`${val}%`)} />
                      <span style={{ fontSize: '8px', color: '#94a3b8' }}>{t(['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Today'][i])}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '10px', textAlign: 'right' }}>
              {t("Avg. operation duration: ")}{Math.floor(avgDurationMins / 60)}h {avgDurationMins % 60}m
            </div>
          </div>

          {/* History */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={14} /> {t(" Recent Activity")}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((entry, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', padding: '10px 14px', display: 'grid', gridTemplateColumns: '90px 1fr auto auto', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{t(entry.date)}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{t(entry.operation)}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{t(entry.vessel)}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{t(entry.duration)}</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: outcomeColor(entry.outcome), backgroundColor: `${outcomeColor(entry.outcome)}15`, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {t(entry.outcome)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
