import React, { useEffect, useState } from 'react';
import { ArrowRight, Bot, Compass, Ship, Sparkles } from 'lucide-react';
import { t } from '../../i18n';

const AI_AGENT_LIVE_LOGS = [
  { agent: 'NavAgent', msg: 'Ship arriving at 2 NM port entry radius...' },
  { agent: 'DataAgent', msg: 'Collecting telemetry, LOA (366m) & draft data from ship...' },
  { agent: 'PCSAgent', msg: 'Gathering real-time AIS & berth data from Oman PCS...' },
  { agent: 'Orchestrator', msg: 'Starting automatic resource allocation sequence...' },
  { agent: 'BerthAgent', msg: 'Finding available berths matching LOA & depth clearance...' },
  { agent: 'MatchingAgent', msg: 'Matching & choosing optimal berth (SCT-B04)...' },
  { agent: 'ResourceAgent', msg: 'Allocating berth slot, harbor pilot & escort tugboats...' },
  { agent: 'SyncAgent', msg: 'Updating Oman PCS central vessel management system...' },
  { agent: 'NotifyAgent', msg: 'Informing port operations & stevedoring teams. Ready!' }
];

interface PreviewNotificationCardProps {
  onPageChange?: (pageId: string) => void;
  onSelectVesselForAllocation?: (vesselName: string, withDelay?: boolean) => void;
}

export const PreviewNotificationCard: React.FC<PreviewNotificationCardProps> = ({
  onPageChange,
  onSelectVesselForAllocation
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedMsg, setDisplayedMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < AI_AGENT_LIVE_LOGS.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  // Text typing effect for active log message
  useEffect(() => {
    const fullText = t(AI_AGENT_LIVE_LOGS[currentStep].msg);
    setDisplayedMsg('');
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      charIndex += 1;
      setDisplayedMsg(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 18);

    return () => clearInterval(typingInterval);
  }, [currentStep]);

  const handleViewAllocation = () => {
    if (onPageChange) {
      onPageChange('vessels');
    }
    if (onSelectVesselForAllocation) {
      onSelectVesselForAllocation('MAERSK DHOFAR', true);
    }
  };

  const activeLog = AI_AGENT_LIVE_LOGS[currentStep];
  const isFinal = currentStep === AI_AGENT_LIVE_LOGS.length - 1;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        width: '320px',
        borderRadius: '16px',
        padding: '16px 18px',
        background: '#ffffff',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid #cbd5e1',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18), 0 0 20px rgba(37, 99, 235, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        color: '#0f172a',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #bfdbfe'
            }}
          >
            <Ship size={15} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a', letterSpacing: '0.3px' }}>
              {t("MAERSK DHOFAR")}</div>
            <div style={{ fontSize: '10px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
              <Compass size={10} color="#2563eb" /> {t(" Approaching Port Radius (2 NM)")}</div>
          </div>
        </div>
      </div>

      {/* Dynamic Body — live AI agent activity */}
      <div
        key={currentStep}
        style={{
          fontSize: '11.5px',
          color: '#1e3a8a',
          lineHeight: '1.4',
          backgroundColor: '#eff6ff',
          padding: '10px 12px',
          borderRadius: '10px',
          border: '1px dashed #93c5fd',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
          minHeight: '52px',
          height: '52px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {isFinal ? (
          <Sparkles size={15} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
        ) : (
          <Bot size={15} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0, animation: 'spin 3s linear infinite' }} />
        )}
        <div>
          {!isFinal && (
            <span style={{ color: '#1d4ed8', fontWeight: 800, marginRight: '6px' }}>
              {t(activeLog.agent)}:
            </span>
          )}
          <span style={{ fontWeight: 600 }}>
            {t(displayedMsg)}
            {displayedMsg.length < activeLog.msg.length && (
              <span style={{ opacity: 0.7, animation: 'pulse 0.6s infinite', marginLeft: '2px', fontWeight: 700, color: '#2563eb' }}>|</span>
            )}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleViewAllocation}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '10px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
      >
        <span>{t("View Allocation")}</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
};


