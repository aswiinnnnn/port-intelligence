import React from 'react';
import { VesselArrivalsChart } from './VesselArrivalsChart';
import { TurnaroundTimeChart } from './TurnaroundTimeChart';
import { shipsData } from './dashboardData';
import { t } from '../../i18n';

interface DashboardAnalyticsViewProps {
  selectedShipName: string | null;
}

export const DashboardAnalyticsView: React.FC<DashboardAnalyticsViewProps> = ({ selectedShipName }) => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', padding: '24px 40px 0 40px', overflowY: 'auto' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '12px', paddingBottom: '32px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '48px', marginTop: '24px' }}>
            <div>
              <span className="pill-label" style={{ fontSize: '13px', padding: '4px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '6px' }}>{t("Berth Utilization")}</span>
              <div style={{ fontSize: '38px', fontWeight: 700, marginTop: '8px', color: 'white' }}>71%</div>
            </div>
            <div>
              <span className="pill-label" style={{ fontSize: '13px', padding: '4px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '6px' }}>{t("On-Time Rate")}</span>
              <div style={{ fontSize: '38px', fontWeight: 700, marginTop: '8px', color: 'white' }}>87%</div>
            </div>
            <div>
              <span className="pill-label" style={{ fontSize: '13px', padding: '4px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: '6px' }}>{t("Vessels Today")}</span>
              <div style={{ fontSize: '38px', fontWeight: 700, marginTop: '8px', color: 'white' }}>{t("7 vessels")}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
          <VesselArrivalsChart />
          <TurnaroundTimeChart />
        </div>

        <div className="glass-dark-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 28px', borderRadius: '12px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'var(--card-gradient-1)' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("CO₂ Saved")}</span> <span style={{ fontWeight: 600, marginLeft: '6px', color: 'var(--accent-cyan)' }}>18.4T</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("Fuel Saved")}</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>6.2T</span></div>
          <div><span style={{ color: 'var(--accent-cyan)' }}>{t("Active Berths")}</span> <span style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginLeft: '6px' }}>5/7</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("Pending")}</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>3</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>{t("Turnaround")}</span> <span style={{ fontWeight: 600, marginLeft: '6px' }}>14.2h</span></div>
        </div>

        <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '0px', marginBottom: '0px' }}>
          {t("Vessels Upcoming")}</h3>

        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', marginTop: '-12px' }}>
          {shipsData.map((ship, idx) => {
            const isFirst = idx === 0;
            const isSelected = selectedShipName === ship.name;
            return (
              <div 
                key={idx} 
                id={`ship-card-analytics-${ship.name.replace(/\s+/g, '-').toLowerCase()}`}
                className={isFirst ? "" : "glass-panel"} 
                style={{ 
                  minWidth: '400px', 
                  borderRadius: '14px', 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'row', 
                  gap: '16px',
                  background: isFirst ? 'var(--card-gradient-1)' : undefined,
                  border: isSelected 
                    ? '2px solid var(--accent-cyan)' 
                    : isFirst 
                      ? '1px solid rgba(255,255,255,0.25)' 
                      : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isSelected ? '0 0 16px rgba(91, 226, 200, 0.4)' : undefined,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>{t(ship.flag)}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-cyan)', backgroundColor: 'rgba(91,226,200,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(91,226,200,0.2)' }}>
                        {t(ship.status)}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'white', lineHeight: 1.2 }}>{t(ship.name)}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{t(ship.type)}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '64px', fontSize: '11px', color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}>
                    <div>{t("LOA ")}<span style={{ fontWeight: 600 }}>{t(ship.loa)}</span></div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                    <div>{t("Draft ")}<span style={{ fontWeight: 600 }}>{t(ship.draft)}</span></div>
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                    <div>{t("GT ")}<span style={{ fontWeight: 600 }}>{t(ship.gt)}</span></div>
                  </div>
                </div>

                <img 
                  src={ship.image} 
                  alt={t(ship.name)} 
                  style={{ 
                    position: 'absolute', 
                    left: '-42px', 
                    bottom: '28px', 
                    height: '110px', 
                    width: '60%', 
                    objectFit: 'contain', 
                    objectPosition: 'left bottom', 
                    pointerEvents: 'none',
                    filter: 'brightness(1.1) contrast(1.1)',
                    zIndex: 1
                  }} 
                />

                <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px', zIndex: 2, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>{t("ETA")}</div>
                      <div style={{ fontWeight: 600, color: 'white' }}>{t(ship.eta)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>{t("Cargo")}</div>
                      <div style={{ fontWeight: 600, color: 'white' }}>{t(ship.cargo)}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>{t("Berth")}</div>
                      <div style={{ fontWeight: 600, color: 'white' }}>{t(ship.berth)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>{t("Tugs")}</div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{ship.tugs}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase' }}>{t("Risk")}</div>
                        <div style={{ fontWeight: 600, color: ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981' }}>{ship.risk}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <span style={{ display: 'inline-block', fontSize: '9px', fontWeight: 700, color: ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981', backgroundColor: `${ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981'}15`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${ship.riskLevel === 'HIGH RISK' ? '#ef4444' : ship.riskLevel === 'MEDIUM RISK' ? '#f59e0b' : '#10b981'}33` }}>
                      {t(ship.riskLevel)}
                    </span>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t(ship.operator)}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
