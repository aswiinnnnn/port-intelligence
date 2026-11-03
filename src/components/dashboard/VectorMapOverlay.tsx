import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { addBaseTiles } from '../../lib/mapTiles';
import { docks, getRotatedCoords, shipsData, type DockDetail } from './dashboardData';
import { DockDetailPanel } from './DockDetailPanel';
import { PreviewNotificationCard } from './PreviewNotificationCard';
import { t } from '../../i18n';
import { activePort } from '../../ports';

interface VectorMapOverlayProps {
  onSelectShipName?: (name: string) => void;
  onPageChange?: (pageId: string) => void;
  onSelectVesselForAllocation?: (vesselName: string, withDelay?: boolean) => void;
  onVesselEnterRadius?: (inRadius: boolean) => void;
}

const SHIP_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10V2"/></svg>`;

const { start: START_LAT_LNG, target: TARGET_LAT_LNG } = activePort.geo.approach;
const HARBOUR_CENTER = activePort.geo.harbourCenter;

const createMscIconHtml = (hasNotification: boolean) => {
  // Approaching vessel starts as Green (#10b981), turns to Blue (#2563eb) smoothly once it reaches stop point
  const primaryColor = hasNotification ? '#2563eb' : '#10b981';
  const ringColor = hasNotification ? 'rgba(37, 99, 235, 0.6)' : 'rgba(16, 185, 129, 0.6)';

  return `
    <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px; cursor: pointer;">
      <div style="
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid ${ringColor};
        animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
      "></div>

      <div style="
        width: 32px;
        height: 32px;
        background-color: ${primaryColor};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${ringColor};
        position: relative;
        z-index: 2;
      ">
        ${SHIP_SVG_STRING}
      </div>

      <div style="
        position: absolute;
        top: 38px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        background-color: ${primaryColor};
        color: #ffffff;
        font-family: var(--font-sans, system-ui);
        font-size: 10px;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        gap: 3px;
        letter-spacing: 0.5px;
      ">
        <span>${t('MAERSK DHOFAR')}</span>
      </div>
    </div>
  `;
};

export const VectorMapOverlay: React.FC<VectorMapOverlayProps> = ({
  onSelectShipName,
  onPageChange,
  onSelectVesselForAllocation,
  onVesselEnterRadius
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const mscMarkerRef = useRef<L.Marker | null>(null);
  const animRef = useRef<number | null>(null);

  const [selectedDock, setSelectedDock] = useState<DockDetail | null>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [mapViewMode] = useState<'harbor' | 'vector'>('harbor');
  
  const [isPreviewRunning, setIsPreviewRunning] = useState(false);
  const [isVesselInRadius, setIsVesselInRadius] = useState(false);

  const getBerthColor = (status: string, isSelected: boolean) => {
    if (isSelected) return '#3b82f6';
    if (status === 'Occupied') return '#ef4444';
    if (status === 'Reserved') return '#fbbf24';
    return '#4ade80';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: activePort.geo.overviewMap.center,
      zoom: activePort.geo.overviewMap.zoom,
      zoomControl: false,
      attributionControl: false
    });
    mapRef.current = map;

    addBaseTiles(map, { opacity: 0.85 });

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // 2 NM boundary circle
    L.circle(HARBOUR_CENTER, {
      radius: 3704,
      color: '#10b981',
      weight: 1.5,
      dashArray: '6, 8',
      fillColor: '#10b981',
      fillOpacity: 0.02,
      interactive: false
    }).addTo(map);

    // Draw berth polygons
    docks.forEach((dock) => {
      const isSelected = selectedDock?.id === dock.id;
      const rectColor = getBerthColor(dock.status, isSelected);
      const coords = getRotatedCoords(dock.lat, dock.lng, dock.length, dock.width, dock.angle);

      const polygon = L.polygon(coords, {
        color: rectColor,
        weight: isSelected ? 3.5 : 2,
        fillColor: rectColor,
        fillOpacity: isSelected ? 0.4 : 0.2,
      }).addTo(map);

      const tooltipContent = `
        <div style="font-family: var(--font-sans, system-ui); padding: 4px; line-height: 1.4;">
          <strong style="display: block; margin-bottom: 4px; font-size: 14px;">${t(dock.name)}</strong>
          <div style="font-size: 12px;">
            <div><strong>${t('Status:')}</strong> ${t(dock.status)}</div>
            ${dock.vessel ? `<div><strong>${t('Vessel:')}</strong> ${t(dock.vessel)} (${t(dock.vesselType)})</div>` : ''}
            <div><strong>${t('Max LOA:')}</strong> ${dock.maxLoa}</div>
            <div><strong>${t('Depth:')}</strong> ${dock.depth}</div>
          </div>
        </div>
      `;
      polygon.bindTooltip(tooltipContent, {
        direction: 'top',
        className: 'dock-hover-tooltip',
        opacity: 0.95
      });

      polygon.on('click', () => {
        setSelectedDock(dock);
        setHasUserSelected(true);
      });

      polygonsRef.current.set(dock.id, polygon);
    });

    const radiusCenter = L.latLng(HARBOUR_CENTER);
    const radiusMeters = 3704;

    // Draw ship markers — skip MAERSK DHOFAR (only shown during automated movement)
    shipsData.forEach((ship) => {
      if (ship.name === 'MAERSK DHOFAR') return;

      const isInsideRadius = map.distance([ship.lat, ship.lng], radiusCenter) <= radiusMeters;
      const markerBg = isInsideRadius ? '#2563eb' : '#10b981';
      const labelBg = isInsideRadius ? '#2563eb' : '#10b981';
      const labelColor = '#ffffff';

      const html = `
        <div style="position: relative; width: 32px; height: 32px; margin-left: -16px; margin-top: -16px; cursor: pointer;">
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${markerBg};
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${SHIP_SVG_STRING}
          </div>

          <div style="
            position: absolute;
            top: 38px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            background-color: ${labelBg};
            color: ${labelColor};
            font-family: var(--font-sans);
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            border: 1px solid rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 2px;
          ">
            ${t(ship.name)}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([ship.lat, ship.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        if (onSelectShipName) {
          onSelectShipName(ship.name);
        }
        const cardId = `ship-card-${ship.name.replace(/\s+/g, '-').toLowerCase()}`;
        const cardIdAnalytics = `ship-card-analytics-${ship.name.replace(/\s+/g, '-').toLowerCase()}`;
        const cardElement = document.getElementById(cardId) || document.getElementById(cardIdAnalytics);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    docks.forEach((dock) => {
      const polygon = polygonsRef.current.get(dock.id);
      if (polygon) {
        const isSelected = selectedDock?.id === dock.id;
        const rectColor = getBerthColor(dock.status, isSelected);

        polygon.setStyle({
          color: rectColor,
          weight: isSelected ? 3.5 : 2,
          fillColor: rectColor,
          fillOpacity: isSelected ? 0.4 : 0.2,
        });
      }
    });

    if (selectedDock && hasUserSelected) {
      const coords = getRotatedCoords(selectedDock.lat, selectedDock.lng, selectedDock.length, selectedDock.width, selectedDock.angle);
      mapRef.current.fitBounds(L.latLngBounds(coords), {
        padding: [50, 50],
        maxZoom: 16,
        animate: true
      });
    }
  }, [selectedDock, hasUserSelected]);

  // Start vessel arrival animation automatically
  const handleStartPreview = () => {
    if (isPreviewRunning) return;
    setIsPreviewRunning(true);
    setIsVesselInRadius(false);

    // Create & add the MAERSK DHOFAR marker if it doesn't exist yet
    if (!mscMarkerRef.current && mapRef.current) {
      const icon = L.divIcon({
        html: createMscIconHtml(false),
        className: 'msc-approaching-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const marker = L.marker(START_LAT_LNG, { icon }).addTo(mapRef.current);
      marker.on('click', () => {
        if (onSelectShipName) onSelectShipName('MAERSK DHOFAR');
      });
      mscMarkerRef.current = marker;
    } else if (mscMarkerRef.current) {
      // Reset position and icon to green approaching state
      mscMarkerRef.current.setLatLng(START_LAT_LNG);
      mscMarkerRef.current.setIcon(L.divIcon({
        html: createMscIconHtml(false),
        className: 'msc-approaching-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      }));
    }

    const startTime = performance.now();
    const duration = 6000;

    const animateVessel = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentLat = START_LAT_LNG[0] + (TARGET_LAT_LNG[0] - START_LAT_LNG[0]) * progress;
      const currentLng = START_LAT_LNG[1] + (TARGET_LAT_LNG[1] - START_LAT_LNG[1]) * progress;

      if (mscMarkerRef.current) {
        mscMarkerRef.current.setLatLng([currentLat, currentLng]);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animateVessel);
      } else {
        // Ship reached radius — turn blue, notify parent
        setIsVesselInRadius(true);
        setIsPreviewRunning(false);
        if (onVesselEnterRadius) onVesselEnterRadius(true);

        if (mscMarkerRef.current) {
          mscMarkerRef.current.setIcon(L.divIcon({
            html: createMscIconHtml(true),
            className: 'msc-blue-arrived-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          }));
        }
      }
    };

    animRef.current = requestAnimationFrame(animateVessel);
  };

  // Automatically start vessel movement animation upon mounting (on login or page refresh)
  useEffect(() => {
    const autoStartTimer = setTimeout(() => {
      handleStartPreview();
    }, 400);

    return () => clearTimeout(autoStartTimer);
  }, []);

  return (
    <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
        {/* Leaflet Map canvas */}
        <div 
          className="custom-map" 
          ref={mapContainerRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: mapViewMode === 'harbor' ? 'block' : 'none' 
          }} 
        />

        {/* Vector map mode fallback graphics */}
        {mapViewMode === 'vector' && (
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '40%', top: '20%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>{t("OMAN")}</div>
            <div style={{ position: 'absolute', left: '12%', top: '30%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>{t("YEMEN")}</div>
            <div style={{ position: 'absolute', left: '55%', top: '71%', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>{t("ARABIAN SEA")}</div>
          </div>
        )}

        {/* Dock details drawer */}
        {selectedDock && mapViewMode === 'harbor' && (
          <DockDetailPanel selectedDock={selectedDock} onClose={() => setSelectedDock(null)} />
        )}

        {/* Preview Notification Card for MAERSK DHOFAR (Only shows once vessel reaches 2 NM radius circle!) */}
        {mapViewMode === 'harbor' && !selectedDock && isVesselInRadius && (
          <PreviewNotificationCard
            onPageChange={onPageChange}
            onSelectVesselForAllocation={onSelectVesselForAllocation}
          />
        )}
      </div>
    </div>
  );
};
