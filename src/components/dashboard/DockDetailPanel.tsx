import React from 'react';
import { Info, Ship } from 'lucide-react';
import type { DockDetail } from './dashboardData';
import { t } from '../../i18n';

interface DockDetailPanelProps {
  selectedDock: DockDetail;
  onClose: () => void;
}

export const DockDetailPanel: React.FC<DockDetailPanelProps> = ({ selectedDock, onClose }) => {
  return (
    <div 
      className="glass-dark-panel"
      style={{
        position: 'absolute',
        top: '24px',
        right: '80px',
        bottom: '24px',
        width: '320px',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid rgba(255,255,255,0.15)',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span 
              style={{
                backgroundColor: 'var(--accent-cyan)',
                color: '#121c22',
                fontWeight: 800,
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >
              {t(selectedDock.label)}
            </span>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0 }}>{t("Berth ")}{t(selectedDock.label)}</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{t(selectedDock.pier)}</p>
            </div>
          </div>
          
          <div 
            style={{ 
              fontSize: '11px', 
              fontWeight: 600,
              display: 'inline-block',
              borderRadius: '4px',
              padding: '3px 10px',
              backgroundColor: 
                selectedDock.status === 'Occupied' ? 'rgba(239, 68, 68, 0.15)' :
                selectedDock.status === 'Reserved' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(74, 222, 128, 0.15)',
              color: 
                selectedDock.status === 'Occupied' ? '#ef4444' :
                selectedDock.status === 'Reserved' ? '#fbbf24' : '#4ade80',
              border: `1px solid ${
                selectedDock.status === 'Occupied' ? 'rgba(239, 68, 68, 0.3)' :
                selectedDock.status === 'Reserved' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(74, 222, 128, 0.3)'
              }`,
              marginTop: '8px'
            }}
          >
            {t("Berth Status: ")}{t(selectedDock.status)}
          </div>
        </div>

        {/* Vessel Information */}
        <div 
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '10px', fontWeight: 600 }}>
            <Ship size={12} />
            <span>{t("VESSEL AT BERTH")}</span>
          </div>
          
          {selectedDock.vessel ? (
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>
                {t(selectedDock.vessel)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t("Type: ")}{t(selectedDock.vesselType)}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {t("No vessel currently berthed")}</div>
          )}
        </div>

        {/* Technical specs */}
        <div 
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>
            <Info size={12} />
            <span>{t("BERTH METRICS")}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t("Max LOA Cap:")}</span>
            <span style={{ fontWeight: 600, color: 'white' }}>{t(selectedDock.maxLoa)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t("Berth Depth:")}</span>
            <span style={{ fontWeight: 600, color: 'white' }}>{t(selectedDock.depth)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t("Next Schedule:")}</span>
            <span style={{ fontWeight: 600, color: 'white' }}>{t(selectedDock.nextArrival || 'N/A')}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px' }}>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t("Click map to clear focus")}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ 
            background: 'rgba(255,255,255,0.12)', 
            border: '1px solid rgba(255,255,255,0.15)', 
            borderRadius: '6px', 
            color: 'white', 
            fontSize: '11px', 
            padding: '6px 12px', 
            cursor: 'pointer' 
          }}
        >
          {t("Close")}</button>
      </div>
    </div>
  );
};
