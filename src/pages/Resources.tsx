import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { addBaseTiles } from '../lib/mapTiles';
import { Info } from 'lucide-react';
import { ResourceDetailModal, type ResourceDetailData } from '../components/ResourceDetailModal';
import { t } from '../i18n';
import { activePort } from '../ports';
import type { LatLng } from '../ports/types';

const ANCHOR_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`;
const SHIP_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10V2"/></svg>`;

interface ResourceItem {
  id: string;
  name: string;
  type: 'tug' | 'pilot' | 'crane' | 'berth';
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Occupied';
  operator: string;
  location: string;
  utilization?: number;
  currentOperation?: string;
  availableTime?: string;
  capacity?: string;
  nextVessel?: string;
  depth?: string;
  length?: string;
  lat?: number;
  lng?: number;
  assignedShip?: { name: string; lat: number; lng: number };
}

// Map positions come from the active port's geography
const geo = activePort.geo;
const at = (p: LatLng | { lat: number; lng: number }) => (Array.isArray(p) ? { lat: p[0], lng: p[1] } : { lat: p.lat, lng: p.lng });

const TUG_FLEET: ResourceItem[] = [
  { id: 'tug-1', name: 'SPS Tug MIRBAT', type: 'tug', status: 'Assigned', operator: 'SPS Marine', location: 'General Cargo Terminal', utilization: 85, currentOperation: 'DHOFAR SPIRIT berthing', ...at(geo.tugs['tug-1']), assignedShip: { name: 'DHOFAR SPIRIT', ...at(geo.tugAssignedShip) } },
  { id: 'tug-2', name: 'SPS Tug RAYSUT', type: 'tug', status: 'Available', operator: 'SPS Marine', location: 'Tug Base', utilization: 0, ...at(geo.tugs['tug-2']) },
  { id: 'tug-3', name: 'SPS Tug TAQAH', type: 'tug', status: 'Available', operator: 'SPS Marine', location: 'Tug Base', utilization: 0, ...at(geo.tugs['tug-3']) },
  { id: 'tug-4', name: 'SPS Tug SADAH', type: 'tug', status: 'Maintenance', operator: 'SPS Marine', location: 'Dry Dock', utilization: 0, availableTime: '02:08 AM', ...at(geo.tugs['tug-4']) },
  { id: 'tug-5', name: 'SPS Tug HASIK', type: 'tug', status: 'Available', operator: 'SPS Marine', location: 'Tug Base', utilization: 0, ...at(geo.tugs['tug-5']) }
];

const PILOT_ROSTER: ResourceItem[] = [
  { id: 'pilot-1', name: 'Capt. Al Rawahi', type: 'pilot', status: 'Assigned', operator: 'Salalah Pilot Station', location: 'Pilot Station', currentOperation: 'DHOFAR SPIRIT' },
  { id: 'pilot-2', name: 'Capt. Al Saadi', type: 'pilot', status: 'Available', operator: 'Salalah Pilot Station', location: 'Pilot Station' },
  { id: 'pilot-3', name: 'Capt. Chen', type: 'pilot', status: 'Available', operator: 'Salalah Pilot Station', location: 'Pilot Station' },
  { id: 'pilot-4', name: 'Capt. Al Hashmi', type: 'pilot', status: 'Assigned', operator: 'Salalah Pilot Station', location: 'Pilot Station', currentOperation: 'GULF ZENITH' },
  { id: 'pilot-5', name: 'Capt. O\'Connor', type: 'pilot', status: 'Available', operator: 'Salalah Pilot Station', location: 'Pilot Station' },
  { id: 'pilot-6', name: 'Capt. Tanaka', type: 'pilot', status: 'Available', operator: 'Salalah Pilot Station', location: 'Pilot Station' },
  { id: 'pilot-7', name: 'Capt. Al-Mansoor', type: 'pilot', status: 'Available', operator: 'Salalah Pilot Station', location: 'Pilot Station' }
];

const STS_CRANES: ResourceItem[] = [
  { id: 'crane-1', name: 'STS Crane #1', type: 'crane', status: 'Assigned', operator: 'Salalah Container Terminal', location: 'SCT-P1', utilization: 75, currentOperation: 'RAYSUT TRADER loading', ...at(geo.cranes['crane-1']) },
  { id: 'crane-2', name: 'STS Crane #2', type: 'crane', status: 'Available', operator: 'Salalah Container Terminal', location: 'SCT-P1', utilization: 0, ...at(geo.cranes['crane-2']) },
  { id: 'crane-3', name: 'STS Crane #3', type: 'crane', status: 'Available', operator: 'Salalah Container Terminal', location: 'SCT-P1', utilization: 0, ...at(geo.cranes['crane-3']) },
  { id: 'crane-4', name: 'STS Crane #4', type: 'crane', status: 'Maintenance', operator: 'Salalah Container Terminal', location: 'SCT-P1', utilization: 0, availableTime: '08:08 PM', ...at(geo.cranes['crane-4']) }
];

const BERTHS: ResourceItem[] = [
  { id: 'berth-1', name: 'SCT-B04', type: 'berth', status: 'Occupied', operator: 'SCT Phase 1', location: 'SCT Phase 1', currentOperation: 'MAERSK DHOFAR', nextVessel: 'ARABIAN SEA EXPRESS', length: '380m', depth: '16m', capacity: '5 cranes', ...at(geo.docks.A) },
  { id: 'berth-2', name: 'SCT-B05', type: 'berth', status: 'Available', operator: 'SCT Phase 2', location: 'SCT Phase 2', nextVessel: 'ARABIAN SEA EXPRESS', length: '420m', depth: '17m', capacity: '6 cranes', ...at(geo.docks.H) },
  { id: 'berth-3', name: 'GCT-B24', type: 'berth', status: 'Occupied', operator: 'General Cargo Terminal', location: 'General Cargo Terminal', currentOperation: 'DHOFAR SPIRIT', length: '240m', depth: '14m', capacity: '2 cranes', ...at(geo.docks.C) },
  { id: 'berth-4', name: 'GCT-B30', type: 'berth', status: 'Available', operator: 'GCT Cruise Berth', location: 'GCT Cruise Berth', nextVessel: 'ASYAD HORIZON', length: '300m', depth: '10m', capacity: '0 cranes', ...at(geo.docks.S) }
];

const getStatusColor = (status: string) => {
  if (status === 'Available') return '#10b981';
  if (status === 'Assigned' || status === 'Occupied') return '#3b82f6';
  if (status === 'Maintenance') return '#ef4444';
  return '#64748b';
};

const getTugImage = (id: string) => {
  if (id === 'tug-1') return '/tugs/tug-1.png';
  if (id === 'tug-2') return '/tugs/tug-2.png';
  if (id === 'tug-3') return '/tugs/tug-3.png';
  if (id === 'tug-4') return '/tugs/tug-4.png';
  return '/tugs/tug-1.png';
};

const getPilotImage = (id: string) => {
  return `/pilots/${id}.png`;
};

const CardMiniMap: React.FC<{ lat?: number; lng?: number; status: string; location: string }> = ({ lat, lng, status }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || lat === undefined || lng === undefined) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false
    });
    mapRef.current = map;

    addBaseTiles(map, { opacity: 0.75 });

    const color = getStatusColor(status);
    const html = `
      <div style="position: relative; width: 16px; height: 16px; margin-left: -8px; margin-top: -8px;">
        <div style="
          width: 16px; height: 16px; background-color: ${color};
          border: 2px solid white; border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        "></div>
      </div>
    `;
    L.marker([lat, lng], {
      icon: L.divIcon({ html, className: '', iconSize: [16, 16], iconAnchor: [8, 8] })
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, status]);

  if (lat === undefined || lng === undefined) return null;

  return (
    <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
      <div ref={containerRef} className="custom-map" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export const Resources: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tugMarkerRef = useRef<L.Marker | null>(null);
  const shipMarkerRef = useRef<L.Marker | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);
  const [selectedTugId, setSelectedTugId] = useState<string | null>(null);
  const [tugs, setTugs] = useState<ResourceItem[]>(TUG_FLEET);
  const [pilots, setPilots] = useState<ResourceItem[]>(PILOT_ROSTER);
  const [cranes, setCranes] = useState<ResourceItem[]>(STS_CRANES);
  const [berths, setBerths] = useState<ResourceItem[]>(BERTHS);

  const selectedTug = tugs.find(t => t.id === selectedTugId) ?? null;
  const [detailResource, setDetailResource] = useState<ResourceDetailData | null>(null);

  const openDetail = (item: ResourceItem, image?: string) => {
    setDetailResource({ ...item, image });
  };

  const handleAssignResource = (resourceId: string, type: 'tug' | 'pilot' | 'crane' | 'berth', vesselName: string) => {
    const updateList = (list: ResourceItem[]) => list.map(item => {
      if (item.id === resourceId) {
        return {
          ...item,
          status: (type === 'berth' ? 'Occupied' : 'Assigned') as any,
          currentOperation: type === 'berth' ? vesselName : `${vesselName} operation`
        };
      }
      return item;
    });

    if (type === 'tug') setTugs(updateList);
    if (type === 'pilot') setPilots(updateList);
    if (type === 'crane') setCranes(updateList);
    if (type === 'berth') setBerths(updateList);

    setDetailResource(prev => prev ? {
      ...prev,
      status: type === 'berth' ? 'Occupied' : 'Assigned',
      currentOperation: type === 'berth' ? vesselName : `${vesselName} operation`
    } : null);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: geo.resourcesMap.center,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    addBaseTiles(map, { opacity: 0.65 });

    // Fix Leaflet sizing bug on initial display
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    tugMarkerRef.current?.remove();
    tugMarkerRef.current = null;
    shipMarkerRef.current?.remove();
    shipMarkerRef.current = null;
    lineRef.current?.remove();
    lineRef.current = null;

    if (!selectedTugId) return;
    const tug = TUG_FLEET.find(t => t.id === selectedTugId);
    if (!tug || tug.lat === undefined || tug.lng === undefined) return;

    const tugIconSvg = ANCHOR_SVG_STRING;
    const tugColor = getStatusColor(tug.status);

    const tugHtml = `
      <div style="position: relative; width: 38px; height: 38px; margin-left: -19px; margin-top: -19px;">
        <div style="
          width: 38px; height: 38px; background-color: ${tugColor};
          border: 3px solid white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.35), 0 2px 8px rgba(0,0,0,0.4);
        ">
          ${tugIconSvg}
        </div>
        <div style="
          position: absolute; top: 44px; left: 50%; transform: translateX(-50%);
          white-space: nowrap; background-color: #1e293b; color: white;
          font-family: var(--font-sans); font-size: 10px; font-weight: 700;
          padding: 3px 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        ">
          ${t(tug.name)}
        </div>
      </div>
    `;

    const tugMarker = L.marker([tug.lat, tug.lng], {
      icon: L.divIcon({ html: tugHtml, className: '', iconSize: [38, 38], iconAnchor: [19, 19] })
    }).addTo(map);
    tugMarkerRef.current = tugMarker;

    const bounds: [number, number][] = [[tug.lat, tug.lng]];

    if (tug.assignedShip) {
      const shipIconSvg = SHIP_SVG_STRING;
      const shipHtml = `
        <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px;">
          <div style="
            width: 32px; height: 32px; background-color: #2563eb;
            border: 2px solid white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${shipIconSvg}
          </div>
          <div style="
            position: absolute; top: 38px; left: 50%; transform: translateX(-50%);
            white-space: nowrap; background-color: #2563eb; color: white;
            font-family: var(--font-sans); font-size: 9px; font-weight: 700;
            padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          ">
            ${t(tug.assignedShip.name)}
          </div>
        </div>
      `;

      const shipMarker = L.marker([tug.assignedShip.lat, tug.assignedShip.lng], {
        icon: L.divIcon({ html: shipHtml, className: '', iconSize: [32, 32], iconAnchor: [16, 16] })
      }).addTo(map);
      shipMarkerRef.current = shipMarker;
      bounds.push([tug.assignedShip.lat, tug.assignedShip.lng]);

      const polyline = L.polyline([[tug.lat, tug.lng], [tug.assignedShip.lat, tug.assignedShip.lng]], {
        color: '#3b82f6',
        weight: 3,
        dashArray: '5, 8',
        opacity: 0.8
      }).addTo(map);
      lineRef.current = polyline;
    }

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [selectedTugId]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '20px', paddingRight: '12px' }}>
      
      {/* Cards Row (General overview) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Tugs Available")}</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>4/6</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Active in harbor")}</div>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Cranes Operational")}</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>3/4</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Available for cargo")}</div>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Berths Available")}</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>2/4</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{t("Ready to receive")}</div>
        </div>
      </div>

      {/* Tug Fleet Section — list with live map */}
      <div>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', marginLeft: '4px' }}>{t("Tug Fleet")}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)', gap: '16px', alignItems: 'stretch' }}>
          {/* Tug list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tugs.map(tug => {
              const isSelected = tug.id === selectedTugId;
              return (
                <div
                  key={tug.id}
                  onClick={() => tug.lat !== undefined && setSelectedTugId(tug.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'rgba(255,255,255,0.5)',
                    border: isSelected ? '1px solid rgba(37, 99, 235, 0.35)' : '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)',
                    cursor: tug.lat !== undefined ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Far Left: Tug Image */}
                    <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img 
                        src={getTugImage(tug.id)} 
                        alt={t(tug.name)} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    </div>

                    {/* Right: Details (Name, Status & Specs) */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                          {t(tug.name)}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 700, color: getStatusColor(tug.status), backgroundColor: `${getStatusColor(tug.status)}15`, padding: '3px 8px', borderRadius: '4px', border: `1px solid ${getStatusColor(tug.status)}33`, textTransform: 'uppercase' }}>
                            {t(tug.status)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); openDetail(tug, getTugImage(tug.id)); }}
                            title={t("View details")}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '5px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'white', cursor: 'pointer', flexShrink: 0 }}
                          >
                            <Info size={12} color="#64748b" />
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '11px' }}>
                        <div>
                          <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Operator")}</div>
                          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>{t(tug.operator)}</div>
                        </div>
                        <div>
                          <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Location")}</div>
                          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>{t(tug.location)}</div>
                        </div>
                        <div>
                          <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Utilization")}</div>
                          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '4px' }}>{tug.utilization}%</div>
                        </div>
                      </div>
                      
                      {t(tug.currentOperation && (
                        <div style={{ fontSize: '11px', marginTop: '4px', borderTop: '1px dashed rgba(0,0,0,0.06)', paddingTop: '8px' }}>
                          <span style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase', marginRight: '6px' }}>{t("Operation:")}</span>
                          <span style={{ color: '#2563eb', fontWeight: 600 }}>📋 {t(tug.currentOperation)}</span>
                        </div>
                      ))}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(tug, getTugImage(tug.id));
                        }}
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#ffffff',
                          backgroundColor: '#2563eb',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          marginTop: '8px',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                      >
                        {t("View Details")}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live tug position map */}
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', minHeight: '360px', backgroundColor: 'rgba(255,255,255,0.5)' }}>
            <div className="custom-map" ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '360px' }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '6px', padding: '4px 10px', fontSize: '10px', fontWeight: 700, color: '#1e293b', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              {t(selectedTug ? selectedTug.name : 'Select a tug to view position')}
            </div>
            {selectedTug?.assignedShip && (
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '6px', padding: '6px 10px', fontSize: '9px', fontWeight: 600, color: '#1e293b', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(selectedTug.status) }} />
                  {t("Tug: ")}{t(selectedTug.name)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                  {t("Assigned ship: ")}{t(selectedTug.assignedShip.name)}
                </div>
              </div>
            )}
            {!selectedTug && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', padding: '12px 18px', fontSize: '11px', fontWeight: 600, color: '#64748b', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                  {t("Click a tug to locate it on the map")}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pilot Roster / Shore-to-Ship Cranes / Berth Status — 3 columns side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'start', marginTop: '12px' }}>

        {/* Pilot Roster Section */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', marginLeft: '4px' }}>{t("Pilot Roster")}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pilots.map(pilot => (
              <div
                key={pilot.id}
                onClick={() => openDetail(pilot, getPilotImage(pilot.id))}
                style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                {/* Pilot Avatar */}
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden', border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                  <img 
                    src={getPilotImage(pilot.id)} 
                    alt={t(pilot.name)} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                {/* Pilot Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t(pilot.name)}</h4>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: getStatusColor(pilot.status), backgroundColor: `${getStatusColor(pilot.status)}15`, padding: '3px 8px', borderRadius: '4px', border: `1px solid ${getStatusColor(pilot.status)}33`, textTransform: 'uppercase' }}>
                      {t(pilot.status)}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Operator")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(pilot.operator)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Location")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(pilot.location)}</div>
                    </div>
                  </div>
                  {t(pilot.currentOperation && (
                    <div style={{ fontSize: '11px', borderTop: '1px dashed rgba(0,0,0,0.05)', paddingTop: '6px', marginTop: '2px' }}>
                      <span style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase', marginRight: '6px' }}>{t("Assignment:")}</span>
                      <span style={{ color: '#2563eb', fontWeight: 600 }}>📋 {t(pilot.currentOperation)}</span>
                    </div>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(pilot, getPilotImage(pilot.id));
                    }}
                    style={{
                      alignSelf: 'flex-end',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#2563eb',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginTop: '8px',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  >
                    {t("View Details")}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STS Cranes Section */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', marginLeft: '4px' }}>{t("Shore-to-Ship Cranes")}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cranes.map(crane => (
              <div
                key={crane.id}
                onClick={() => openDetail(crane)}
                style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t(crane.name)}</h4>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: getStatusColor(crane.status), backgroundColor: `${getStatusColor(crane.status)}15`, padding: '3px 8px', borderRadius: '4px', border: `1px solid ${getStatusColor(crane.status)}33`, textTransform: 'uppercase' }}>
                    {t(crane.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '8px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Operator")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(crane.operator)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Location")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(crane.location)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Utilization")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{crane.utilization}%</div>
                    </div>
                    {t(crane.currentOperation && (
                      <div>
                        <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Operation")}</div>
                        <div style={{ color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>📋 {t(crane.currentOperation)}</div>
                      </div>
                    ))}
                  </div>

                  <CardMiniMap lat={crane.lat} lng={crane.lng} status={crane.status} location={crane.location} />
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(crane);
                  }}
                  style={{
                    alignSelf: 'flex-end',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                >
                  {t("View Details")}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Berth Status Section */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', marginLeft: '4px' }}>{t("Berth Status")}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {berths.map(berth => (
              <div
                key={berth.id}
                onClick={() => openDetail(berth)}
                style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t(berth.name)}</h4>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: getStatusColor(berth.status), backgroundColor: `${getStatusColor(berth.status)}15`, padding: '3px 8px', borderRadius: '4px', border: `1px solid ${getStatusColor(berth.status)}33`, textTransform: 'uppercase' }}>
                    {t(berth.status)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '8px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Terminal")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(berth.operator)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Max Length / Depth")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(berth.length)} / {t(berth.depth)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Cranes Assigned")}</div>
                      <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(berth.capacity)}</div>
                    </div>
                    <div>
                      {berth.currentOperation ? (
                        <>
                          <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Current Vessel")}</div>
                          <div style={{ color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>{t(berth.currentOperation)}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ color: '#64748b', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>{t("Next Vessel")}</div>
                          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>{t(berth.nextVessel)}</div>
                        </>
                      )}
                    </div>
                  </div>

                  <CardMiniMap lat={berth.lat} lng={berth.lng} status={berth.status} location={berth.location} />
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(berth);
                  }}
                  style={{
                    alignSelf: 'flex-end',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: '#2563eb',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                >
                  {t("View Details")}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {detailResource && (
        <ResourceDetailModal resource={detailResource} onClose={() => setDetailResource(null)} onAssign={handleAssignResource} />
      )}
    </div>
  );
};
