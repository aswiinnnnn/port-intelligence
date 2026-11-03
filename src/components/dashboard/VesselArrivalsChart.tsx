import React from 'react';
import { t } from '../../i18n';

export const VesselArrivalsChart: React.FC = () => {
  return (
    <div className="glass-dark-panel" style={{ padding: '16px 20px', borderRadius: '14px', flex: 1, minWidth: '260px', border: '1px solid rgba(255,255,255,0.15)', background: 'var(--card-gradient-1)' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px' }}>
        {t("DAILY VESSEL ARRIVALS")}</div>
      
      <div className="dashboard-chart-box" style={{ display: 'flex', gap: '12px', height: '195px', position: 'relative' }}>
        {/* Y Axis Labels */}
        <div className="dashboard-chart-y" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', height: '150px', textAlign: 'right', width: '18px' }}>
          <span>16</span>
          <span>12</span>
          <span>8</span>
          <span>4</span>
          <span>0</span>
        </div>

        {/* Chart Canvas */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <svg className="dashboard-chart-svg" viewBox="0 0 500 125" preserveAspectRatio="none" style={{ width: '100%', height: '150px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-green)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent-green)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="0" x2="500" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="31" x2="500" y2="31" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="62" x2="500" y2="62" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="93" x2="500" y2="93" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="125" x2="500" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Areas */}
            <path 
              className="animate-area"
              d="M 0,55 C 125,72 125,72 250,45 C 375,50 375,50 500,80 L 500,125 L 0,125 Z" 
              fill="url(#greenGrad)" 
            />
            <path 
              className="animate-area"
              d="M 0,38 C 125,58 125,58 250,25 C 375,35 375,35 500,62 L 500,125 L 0,125 Z" 
              fill="url(#cyanGrad)" 
            />

            {/* Lines */}
            <path 
              className="animate-path"
              d="M 0,55 C 125,72 125,72 250,45 C 375,50 375,50 500,80" 
              fill="none" 
              stroke="var(--accent-green)" 
              strokeWidth="2.5" 
            />
            <path 
              className="animate-path"
              d="M 0,38 C 125,58 125,58 250,25 C 375,35 375,35 500,62" 
              fill="none" 
              stroke="var(--accent-cyan)" 
              strokeWidth="2.5" 
            />
          </svg>

          {/* X Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>{t("01 Jul")}</span>
            <span>{t("02 Jul")}</span>
            <span>{t("03 Jul")}</span>
            <span>{t("04 Jul")}</span>
            <span>{t("05 Jul")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
