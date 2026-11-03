import React from 'react';
import { Ship, Check, X, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { t } from '../i18n';

interface MscBarcelonaToasterProps {
  onAccept: () => void;
  onClose: () => void;
  onViewDetails?: () => void;
}

export const MscBarcelonaToaster: React.FC<MscBarcelonaToasterProps> = ({
  onAccept,
  onClose,
  onViewDetails
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      insetInlineEnd: '24px',
      zIndex: 99999,
      maxWidth: '420px',
      width: 'calc(100vw - 48px)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(37, 99, 235, 0.3)',
      borderRadius: '16px',
      boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(37, 99, 235, 0.15)',
      padding: '18px 20px',
      animation: 'slideInRightToLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Top Bar: Icon, Title, Close Button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.35)',
            flexShrink: 0
          }}>
            <Ship size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px' }}>🇵🇦</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{t("MAERSK DHOFAR")}</span>
              <span style={{
                fontSize: '9px',
                fontWeight: 800,
                color: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                {t("PRIORITY")}</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
              {t("Berth SCT-B04 · 1,187 TEU Container Discharge")}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s'
          }}
          title={t("Dismiss notification")}
        >
          <X size={18} color="#64748b" />
        </button>
      </div>

      {/* Info Body */}
      <div style={{
        backgroundColor: 'rgba(37, 99, 235, 0.04)',
        border: '1px solid rgba(37, 99, 235, 0.12)',
        borderRadius: '10px',
        padding: '10px 12px',
        fontSize: '11.5px',
        color: '#334155',
        lineHeight: '1.4'
      }}>
        <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} color="#2563eb" /> {t(" Action Required")}</div>
        {t("Towage, Pilotage & Quay Crane allocation pre-assigned by AI Agents. Accept to initiate berth clearance protocol.")}</div>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Clock size={13} color="#475569" />
            <span>{t("View Details")}</span>
          </button>
        )}

        <button
          onClick={onAccept}
          style={{
            flex: 1.4,
            padding: '9px 14px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.15s ease'
          }}
        >
          <Check size={15} color="#ffffff" />
          <span>{t("Accept Assignment")}</span>
          <ChevronRight size={14} color="#ffffff" />
        </button>
      </div>
    </div>
  );
};
