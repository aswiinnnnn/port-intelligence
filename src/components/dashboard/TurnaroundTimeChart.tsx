import React from 'react';
import { t } from '../../i18n';

export const TurnaroundTimeChart: React.FC = () => {
  return (
    <div className="glass-dark-panel" style={{ padding: '16px 20px', borderRadius: '14px', flex: 1, minWidth: '260px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'var(--card-gradient-1)' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px' }}>
        {t("AVG TURNAROUND TIME (HOURS)")}</div>
      
      <div className="dashboard-chart-box" style={{ display: 'flex', gap: '12px', height: '195px', position: 'relative' }}>
        {/* Y Axis Labels */}
        <div className="dashboard-chart-y" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', height: '150px', textAlign: 'right', width: '18px' }}>
          <span>18</span>
          <span>16</span>
          <span>14</span>
          <span>12</span>
        </div>

        {/* Chart Canvas */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <svg className="dashboard-chart-svg" viewBox="0 0 500 125" preserveAspectRatio="none" style={{ width: '100%', height: '150px', overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="0" y1="0" x2="500" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="41" x2="500" y2="41" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="83" x2="500" y2="83" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="0" y1="125" x2="500" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

            {/* Line Curve */}
            <path 
              className="animate-path"
              d="M 0,38 C 125,45 125,45 250,65 C 375,62 375,62 500,78" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2.5" 
            />

            {/* Dots */}
            <circle cx="0" cy="38" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0 }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="125" cy="45" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '0.4s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="250" cy="65" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '0.8s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="375" cy="62" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '1.2s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
            <circle cx="500" cy="78" r="5" className="animate-point" style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animationDelay: '1.6s' }} fill="#3b82f6" stroke="#121418" strokeWidth="1.5" />
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
