import React, { useState } from 'react';
import { Communications } from './Communications';
import { 
  docks, 
  listVessels, 
  type DockDetail, 
  type VesselListItem, 
  type ShipData, 
  type VesselChecklistStep 
} from '../components/dashboard/dashboardData';
import { VesselArrivalsChart } from '../components/dashboard/VesselArrivalsChart';
import { TurnaroundTimeChart } from '../components/dashboard/TurnaroundTimeChart';
import { VesselCarousel } from '../components/dashboard/VesselCarousel';
import { VectorMapOverlay } from '../components/dashboard/VectorMapOverlay';
import { DashboardOverviewView } from '../components/dashboard/DashboardOverviewView';
import { DashboardAnalyticsView } from '../components/dashboard/DashboardAnalyticsView';
import { DashboardVesselsView } from '../components/dashboard/DashboardVesselsView';
import { t } from '../i18n';

export { docks, listVessels, type DockDetail, type VesselListItem, type ShipData, type VesselChecklistStep };

export interface UnifiedDashboardProps {
  viewMode?: string;
  onPageChange?: (pageId: any) => void;
  selectedMessageId?: string | null;
  onSelectMessageId?: (id: string | null) => void;
  onSelectVesselForAllocation?: (vesselName: string) => void;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  viewMode = 'live-map',
  onPageChange,
  selectedMessageId,
  onSelectMessageId,
  onSelectVesselForAllocation
}) => {
  const [selectedShipName, setSelectedShipName] = useState<string | null>(null);
  const [isVesselInRadius, setIsVesselInRadius] = useState(false);

  // RENDER VIEW: dashboard
  if (viewMode === 'dashboard') {
    return <DashboardOverviewView />;
  }

  // RENDER VIEW: analytics
  if (viewMode === 'analytics') {
    return <DashboardAnalyticsView selectedShipName={selectedShipName} />;
  }

  // RENDER VIEW: communications
  if (viewMode === 'communications') {
    return (
      <Communications 
        selectedMessageId={selectedMessageId}
        onSelectMessageId={onSelectMessageId}
      />
    );
  }

  // RENDER VIEW: vessels
  if (viewMode === 'vessels') {
    return (
      <DashboardVesselsView 
        onPageChange={onPageChange}
        onSelectVesselForAllocation={onSelectVesselForAllocation}
      />
    );
  }

  // DEFAULT VIEW: live-map (Side-by-Side Map & Operational Controls)
  return (
    <div 
      className="animate-fade-in dashboard-main-container" 
      style={{ 
        display: 'flex', 
        width: '100%', 
        height: '100%', 
        gap: '16px', 
        padding: '16px 20px 0 20px', 
        overflow: 'hidden' 
      }}
    >
      {/* Left Dashboard Operational Panel */}
      <div 
        style={{ 
          flex: '1 1 45%', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          overflowY: 'auto', 
          paddingRight: '8px', 
          minWidth: '300px' 
        }}
      >
        {/* Main KPI Sparklines Header */}
        <div className="dashboard-kpi-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px', marginTop: '8px', padding: '0 4px' }}>
          {/* Card 1: Berth Utilization */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Berth Utilization")}</span>
              <div className="dashboard-kpi-val" style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>71%</div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t("↑ 6% vs yesterday")}</span>
            </div>
            <div style={{ width: '60px', height: '32px', display: 'flex', alignItems: 'center' }}>
              <svg width="60" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="berth-grad-white" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 35 C 15 28, 25 35, 40 18 C 55 10, 65 30, 80 15 C 90 8, 95 10, 100 5 L 100 40 L 0 40 Z" fill="url(#berth-grad-white)" />
                <path d="M 0 35 C 15 28, 25 35, 40 18 C 55 10, 65 30, 80 15 C 90 8, 95 10, 100 5" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 2: On-Time Rate */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("On-Time Rate")}</span>
              <div className="dashboard-kpi-val" style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>87%</div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t("↑ 4% vs yesterday")}</span>
            </div>
            <div style={{ width: '60px', height: '32px', display: 'flex', alignItems: 'center' }}>
              <svg width="60" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="ontime-grad-white" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 38 C 125,32 25,38 40 22 C 55 15, 65 25, 80 10 C 90 5, 95 8, 100 2 L 100 40 L 0 40 Z" fill="url(#ontime-grad-white)" />
                <path d="M 0 38 C 15 32, 25 38, 40 22 C 55 15, 65 25, 80 10 C 90 5, 95 8, 100 2" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Card 3: Vessels Today */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t("Vessels Today")}</span>
              <div className="dashboard-kpi-val" style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}>7</div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t("↑ 2 vs yesterday")}</span>
            </div>
            <div style={{ width: '60px', height: '32px', display: 'flex', alignItems: 'center' }}>
              <svg width="60" height="32" viewBox="0 0 100 40" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="vessels-grad-white" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 30 C 15 35, 30 15, 45 25 C 60 10, 75 28, 90 12 C 95 8, 100 5, 100 5 L 100 40 L 0 40 Z" fill="url(#vessels-grad-white)" />
                <path d="M 0 30 C 15 35, 30 15, 45 25 C 60 10, 75 28, 90 12 C 95 8, 100 5, 100 5" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Vessel Performance Trend Charts */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
          <VesselArrivalsChart />
          <TurnaroundTimeChart />
        </div>

        {/* Bottom Row Stats */}
        <div className="glass-dark-panel dashboard-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', padding: '18px 24px', borderRadius: '14px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'var(--card-gradient-1)' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("CO₂ Saved")}</span> <span style={{ fontWeight: 600, marginLeft: '6px', color: 'var(--accent-cyan)' }}>18.4T</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("Fuel Saved")}</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>6.2T</span></div>
          <div><span style={{ color: 'var(--accent-cyan)' }}>{t("Active Berths")}</span> <span style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginLeft: '6px' }}>5/7</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("Pending")}</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>3</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("Turnaround")}</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>14.2h</span></div>
        </div>

        {/* Vessels Upcoming Header */}
        <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: '4px', marginBottom: '0px' }}>
          {t("Vessels Upcoming")}</h3>

        {/* Ship Cards Carousel */}
        <VesselCarousel
          selectedShipName={selectedShipName}
          onPageChange={onPageChange}
          onSelectMessageId={onSelectMessageId}
          isVesselInRadius={isVesselInRadius}
        />
      </div>

      {/* Right Dashboard Map Panel */}
      <VectorMapOverlay
        onSelectShipName={setSelectedShipName}
        onPageChange={onPageChange}
        onSelectVesselForAllocation={onSelectVesselForAllocation}
        onVesselEnterRadius={setIsVesselInRadius}
      />
    </div>
  );
};
